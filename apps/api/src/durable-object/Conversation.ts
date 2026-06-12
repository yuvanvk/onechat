import { DurableObject } from "cloudflare:workers";
import {
  ImageSchema,
  InsertIntoImage,
  InsertIntoMessage,
  InsertIntoMessageTypeImage,
  MessageSchema,
  PDFSchema,
  QueryMessages,
  UpdateMessageContent,
} from "./sql";
import {
  Message,
  Role,
  WebSocketClientMessage,
  WebSocketCreateStreamMessage,
  WebSocketErrorMessage,
  WebSocketGenerateImage,
  WebSocketImageGenerated,
  WebSocketRegenerateResponseDone,
  WebSocketRegenerateStreamMessage,
  WebSocketStreamAIDone,
  WebSocketStreamAIResponse,
  WebSocketStreamRegenerteResponse,
  WebSocketTitleGeneratedMessage,
} from "@workspace/types";
import { toBase64 } from "@/lib/utils";
import { User, Credit, Model, Db } from "@/lib/credit-system";
import { conversation } from "@workspace/Db";
import { eq } from "drizzle-orm";

export class Conversation extends DurableObject<Env> {
  private messages: Message[] = [];
  abortController: AbortController;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.ctx.blockConcurrencyWhile(async () => {
      this.ctx.storage.sql.exec(MessageSchema);
      this.ctx.storage.sql.exec(ImageSchema);
      this.ctx.storage.sql.exec(PDFSchema);
      Db.initDB(this.env.D1_DATABASE);
      Model.warmCache();

      this.messages = this.ctx.storage.sql
        .exec(QueryMessages)
        .toArray() as unknown as Message[];
    });
    this.abortController = new AbortController();
  }

  async fetch(request: Request): Promise<Response> {
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    this.ctx.acceptWebSocket(server);
    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    const parsed = JSON.parse(message as string) as WebSocketClientMessage;

    switch (parsed.type) {
      case "chat.stream.create":
        this.handleStreamResponse(ws, parsed);
        break;
      case "chat.stream.cancel":
        this.abortController.abort();
        break;
      case "chat.stream.regenerate":
        this.handleStreamRegenerate(ws, parsed);
        break;
      case "chat.generate.image":
        this.handleGenerateImage(ws, parsed);
        break;
    }
  }

  async handleStreamResponse(
    ws: WebSocket,
    message: WebSocketCreateStreamMessage,
  ) {
    this.abortController = new AbortController();
    const { conversationId, content, model, role, objects } = message;
    const provider = model.split("/")[0];
    
    let estimatedCredits = 0;
    let isReseverd = false;
    try {
      const hasAccess = await User.hasAccess(
        "HfbevZyJ8HESjJOlcA6KJFGyM3lZVrjs",
        model,
      );
      if (!hasAccess) {
        this.sendErrorMessage(
          ws,
          "Please Upgrade to Pro to access these models",
          conversationId,
        );
        return;
      }

      const estimatedInputTokens = Model.estimateInputTokens(content);
      const estimatedOutputTokens = Model.estimateOutputTokens();
      estimatedCredits = Credit.calculate(
        model,
        estimatedInputTokens,
        estimatedOutputTokens,
      );

      isReseverd = await Credit.reserve(
        "HfbevZyJ8HESjJOlcA6KJFGyM3lZVrjs",
        estimatedCredits,
      );
      if (!isReseverd) {
        this.sendErrorMessage(
          ws,
          "Insufficient credits. Either credits too low or you dont have enough credits",
          conversationId,
        );
        return;
      }

      const userMessageId = crypto.randomUUID();
      let currentUserMessage: Message = {
        id: userMessageId,
        role,
        model,
        content,
        messageType: "text",
        pdfs: [],
        images: [],
      };

      this.messages = [...this.messages, currentUserMessage];

      this.ctx.storage.sql.exec(
        InsertIntoMessage,
        userMessageId,
        role,
        content,
        model,
        Date.now(),
      );

      const contentBlock = [];

      if (objects && objects.length > 0) {
        for (const obj of objects) {
          if (!obj.type.startsWith("image/")) continue;

          const object = await this.env.IMAGES_BUCKET.get(obj.name);

          if (!object) {
            continue;
          }

          this.ctx.storage.sql.exec(
            InsertIntoImage,
            crypto.randomUUID(),
            obj.name,
            obj.size,
            userMessageId,
            Date.now(),
          );
          this.messages = this.messages.map((message) =>
            message.id === userMessageId
              ? {
                  ...message,
                  images: [
                    ...(message.images ?? []),
                    { name: obj.name, size: obj.size, type: obj.type },
                  ],
                }
              : message,
          );

          const buffer = await object.arrayBuffer();
          const base64 = toBase64(buffer);

          switch (provider) {
            case "anthropic":
              contentBlock.push({
                type: "image",
                source: { type: "base64", media_type: obj.type, data: base64 },
              });
              break;
            case "google":
              contentBlock.push({
                inlineData: { mimeType: obj.type, data: base64 },
              });
              break;
            default:
              contentBlock.push({
                type: "image_url",
                image_url: { url: `data:${obj.type};base64,${base64}` },
              });
              break;
          }
        }
      }
      contentBlock.push({ type: "text", text: content });
      const stream = (await this.env.AI.run(
        model,
        {
          messages: [
            ...this.messages.slice(0, -1),
            {
              role,
              content: contentBlock,
            },
          ],
          stream: true,
          metadata: true,
        },
        {
          signal: this.abortController.signal,
          gateway: { id: "onechat" },
        },
      )) as unknown as ReadableStream;

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";
      let isDone = false;
      let actualInputTokens = 0;
      let actualOutputTokens = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          if (event.includes("data: [DONE]")) {
            isDone = true;
            continue;
          }

          const dataLine = event
            .split("\n")
            .find((l) => l.startsWith("data: "));
          if (!dataLine) continue;

          const json = JSON.parse(dataLine.slice(6));

          if (json.usage) {
            actualInputTokens =
              json.usage.prompt_tokens ??
              json.usage.input_tokens ??
              actualInputTokens;
            actualOutputTokens =
              json.usage.completion_tokens ??
              json.usage.output_tokens ??
              actualOutputTokens;
          }
          const token =
            json.response ?? json.choices?.[0]?.delta?.content ?? "";

          if (token) {
            fullContent += token;
            const streamMessage: WebSocketStreamAIResponse = {
              type: "chat.stream.response",
              role: "assistant" as Role.Assistant,
              content: token as string,
              conversationId,
            };

            ws.send(JSON.stringify(streamMessage));
          }
        }
      }
      if (isDone) {
        const aiMessageId = crypto.randomUUID();
        const streamDoneMessage: WebSocketStreamAIDone = {
          type: "chat.stream.done",
          conversationId,
          userMessageId,
          aiMessageId,
        };

        this.messages = [
          ...this.messages,
          {
            role: "assistant" as Role.Assistant,
            content: fullContent,
            messageType: "text",
          },
        ];

        this.ctx.storage.sql.exec(
          InsertIntoMessage,
          aiMessageId,
          Role.Assistant,
          fullContent,
          model,
          Date.now(),
        );
        ws.send(JSON.stringify(streamDoneMessage));

        const actualCredits = Credit.calculate(
          model,
          actualInputTokens,
          actualOutputTokens,
        );
        await Credit.settle(
          "HfbevZyJ8HESjJOlcA6KJFGyM3lZVrjs",
          estimatedCredits,
          actualCredits,
        );
      }

      if (this.messages.length === 2) {
        const firstUserMessage = this.messages.find(
          (x) => x.role === Role.User,
        )?.content;
        const response = (await this.env.AI.run(
          "@cf/meta/llama-3.2-3b-instruct",
          {
            messages: [
              {
                role: "system",
                content:
                  "You are a title generator. You output only 3-5 words. Nothing else. No punctuation. No quotes. No labels.",
              },
              {
                role: "user",
                content: firstUserMessage,
              },
            ],
          },
        )) as { response: string };
        const title = response.response?.trim();

        await Db.get()
          .update(conversation)
          .set({ title })
          .where(eq(conversation.id, conversationId));
        const titleGeneratedEvent: WebSocketTitleGeneratedMessage = {
          type: "chat.title.generated",
          conversationId,
          title,
        };
        ws.send(JSON.stringify(titleGeneratedEvent));
      }
    } catch (error) {
      if (isReseverd) {
        await Credit.release(
          "HfbevZyJ8HESjJOlcA6KJFGyM3lZVrjs",
          estimatedCredits,
        );
      }
      if (error instanceof Error && error.name === "AbortError") {
        console.log(`Stream aborted for conversation ${conversationId}`);
      } else {
        console.error(
          `Error processing stream for conversation ${conversationId}:`,
          error,
        );
        this.sendErrorMessage(
          ws,
          "Something went wrong. Please try again later",
          conversationId,
        );
      }
    }
  }

  async handleStreamRegenerate(
    ws: WebSocket,
    message: WebSocketRegenerateStreamMessage,
  ) {
    this.abortController = new AbortController();
    const { messageId, model, content, conversationId } = message;

    const messageIndex = this.messages.findIndex((m) => m.id === messageId);
    const historyUpToMessage = this.messages.slice(0, messageIndex);

    try {
      const stream = (await this.env.AI.run(
        model,
        {
          messages: [
            ...historyUpToMessage,
            {
              role: "user",
              content:
                content +
                "<SystemPrompt>Please regenerate an alternative answer for this content, with different wording and more detail.</SystemPrompt>",
            },
          ],
          stream: true,
        },
        { signal: this.abortController.signal, gateway: { id: "onechat" } },
      )) as unknown as ReadableStream;

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";
      let isDone = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          if (event.includes("data: [DONE]")) {
            isDone = true;
            continue;
          }

          const dataLine = event
            .split("\n")
            .find((l) => l.startsWith("data: "));
          if (!dataLine) continue;

          const json = JSON.parse(dataLine.slice(6));

          const token =
            json.response ?? json.choices?.[0]?.delta?.content ?? "";

          if (token) {
            fullContent += token;
            const regenerateStreamMessage: WebSocketStreamRegenerteResponse = {
              type: "chat.regenerate.response",
              role: "assistant" as Role.Assistant,
              messageId,
              content: token as string,
              conversationId,
            };

            ws.send(JSON.stringify(regenerateStreamMessage));
          }
        }
      }
      if (isDone) {
        const regenerateStreamDoneMessage: WebSocketRegenerateResponseDone = {
          type: "chat.regenerate.done",
          messageId,
          conversationId,
        };

        this.messages = this.messages.map((message) =>
          message.role === "assistant" && message.id === messageId
            ? { ...message, content: fullContent }
            : message,
        );

        this.ctx.storage.sql.exec(UpdateMessageContent, fullContent, messageId);
        ws.send(JSON.stringify(regenerateStreamDoneMessage));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async handleGenerateImage(ws: WebSocket, message: WebSocketGenerateImage) {
    this.abortController = new AbortController();
    const { model, content, conversationId, role } = message;
    console.log("inside generate image");
    
    const userMessageId: string = crypto.randomUUID();
    let currentUserMessage: Message = {
      id: userMessageId,
      role,
      messageType: "text",
      content,
    };

    this.messages = [...this.messages, currentUserMessage];

    try {
      const response = await this.env.AI.run(
        model,
        {
          prompt: content,
        },
        {
          signal: this.abortController.signal,
          gateway: {
            id: "onechat",
          },
        },
      );

      const base64 = response.image as string;
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const key = `${crypto.randomUUID()}.jpg`;
      await this.env.IMAGES_BUCKET.put(key, bytes, {
        httpMetadata: { contentType: "image/jpeg" },
      });

      const aiMessageId: string = crypto.randomUUID();
      const imageGeneratedImage: WebSocketImageGenerated = {
        type: "chat.generated.image",
        id: aiMessageId,
        role: Role.Assistant,
        conversationId,
        imageKey: key,
        messageType: "image",
        userMessageId,
      };
      this.messages = [
        ...this.messages,
        {
          id: aiMessageId,
          role: Role.Assistant,
          model,
          imageKey: key,
          messageType: "image",
        },
      ];

      // saving user message into storage
      this.ctx.storage.sql.exec(
        InsertIntoMessage,
        userMessageId,
        Role.User,
        content,
        model,
        Date.now(),
      );

      // saving ai message into storage
      this.ctx.storage.sql.exec(
        InsertIntoMessageTypeImage,
        aiMessageId,
        Role.Assistant,
        model,
        "image",
        key,
        Date.now(),
      );

      ws.send(JSON.stringify(imageGeneratedImage));
    } catch (error) {
      console.log("Error in handleGenerateImage ->", error);
      this.sendErrorMessage(ws, "Unable to Generate Image", conversationId);
    }
  }

  async getMessages() {
    return this.messages;
  }

  async destroy() {
    await this.ctx.storage.deleteAll();
  }

  async sendErrorMessage(
    ws: WebSocket,
    message: string,
    conversationId: string,
  ) {
    const errorMessage: WebSocketErrorMessage = {
      type: "chat.stream.error",
      conversationId,
      message,
    };
    ws.send(JSON.stringify(errorMessage));
  }
}
