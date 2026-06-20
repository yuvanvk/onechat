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

interface StreamResult {
  fullContent: string;
  actualInputTokens: number;
  actualOutputTokens: number;
}

export class Conversation extends DurableObject<Env> {
  private messages: Message[] = [];
  private userId = "HfbevZyJ8HESjJOlcA6KJFGyM3lZVrjs"; // TODO: pass from request
  private abortController = new AbortController();

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
  }

  async fetch(request: Request): Promise<Response> {
    const [client, server] = Object.values(new WebSocketPair());
    this.ctx.acceptWebSocket(server);
    return new Response(null, { status: 101, webSocket: client });
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

    const estimatedCredits = Credit.calculate(
      model,
      Model.estimateInputTokens(content),
      Model.estimateOutputTokens(),
    );

    if (
      !(await this.checkAccessAndReserve(
        ws,
        model,
        estimatedCredits,
        conversationId,
      ))
    )
      return;

    const userMessageId = crypto.randomUUID();
    this.messages.push({
      id: userMessageId,
      role,
      model,
      content,
      messageType: "text",
      pdfs: [],
      images: [],
    });

    const hasImages =
      objects?.some((object) => object.type.startsWith("image/")) ?? false;

    const currentContent = hasImages
      ? await this.buildContentBlock(content, objects, userMessageId, provider)
      : content;

    const history = this.messages
      .slice(0, -1)
      .filter(
        (message): message is Message & { content: string } =>
          typeof message.content === "string",
      )
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    let result: StreamResult;
    try {
      const stream = (await this.env.AI.run(
        model,
        {
          messages: [
            ...history,
            { role, content: currentContent },
          ],
          stream: true,
          metadata: true,
        },
        { signal: this.abortController.signal, gateway: { id: "onechat" } },
      )) as unknown as ReadableStream;

      result = await this.readStream(
        stream,
        this.abortController.signal,
        (token) => {
          ws.send(
            JSON.stringify({
              type: "chat.stream.response",
              role: "assistant" as Role.Assistant,
              content: token,
              conversationId,
            } satisfies WebSocketStreamAIResponse),
          );
        },
      );
    } catch (error) {
      await Credit.release(this.userId, estimatedCredits, conversationId);
      if (
        this.abortController.signal.aborted ||
        (error instanceof Error && error.name === "AbortError")
      ) {
        console.log(`Stream aborted: ${conversationId}`);
        this.sendErrorMessage(ws, "Request was cancelled.", conversationId);
      } else {
        console.error(`Stream error: ${conversationId}`, error);
        this.sendErrorMessage(
          ws,
          "Something went wrong. Please try again later",
          conversationId,
        );
      }
      return;
    }

    const { fullContent, actualInputTokens, actualOutputTokens } = result;
    const aiMessageId = crypto.randomUUID();

    this.ctx.storage.sql.exec(
      InsertIntoMessage,
      userMessageId,
      role,
      content,
      model,
      Date.now(),
    );

    this.messages.push({
      role: "assistant" as Role.Assistant,
      content: fullContent,
      messageType: "text",
    });
    this.ctx.storage.sql.exec(
      InsertIntoMessage,
      aiMessageId,
      Role.Assistant,
      fullContent,
      model,
      Date.now(),
    );

    ws.send(
      JSON.stringify({
        type: "chat.stream.done",
        conversationId,
        userMessageId,
        aiMessageId,
      } satisfies WebSocketStreamAIDone),
    );

    await Credit.settle(
      this.userId,
      estimatedCredits,
      Credit.calculate(model, actualInputTokens, actualOutputTokens),
      model,
      conversationId,
      actualInputTokens,
      actualOutputTokens,
    );

    await this.maybeGenerateTitle(ws, conversationId);
  }

  async handleStreamRegenerate(
    ws: WebSocket,
    message: WebSocketRegenerateStreamMessage,
  ) {
    this.abortController = new AbortController();
    const { messageId, model, content, conversationId } = message;

    const estimatedCredits = Credit.calculate(
      model,
      Model.estimateInputTokens(content),
      Model.estimateOutputTokens(),
    );

    if (
      !(await this.checkAccessAndReserve(
        ws,
        model,
        estimatedCredits,
        conversationId,
      ))
    )
      return;

    const messageIndex = this.messages.findIndex((m) => m.id === messageId);
    const history = this.messages.slice(0, messageIndex);

    let result: StreamResult | null = null;
    try {
      const stream = (await this.env.AI.run(
        model,
        {
          messages: [
            ...history,
            {
              role: "user",
              content: `${content}<SystemPrompt>Please regenerate an alternative answer for this content, with different wording and more detail.</SystemPrompt>`,
            },
          ],
          stream: true,
        },
        { signal: this.abortController.signal, gateway: { id: "onechat" } },
      )) as unknown as ReadableStream;

      result = await this.readStream(
        stream,
        this.abortController.signal,
        (token) => {
          ws.send(
            JSON.stringify({
              type: "chat.regenerate.response",
              role: "assistant" as Role.Assistant,
              messageId,
              content: token,
              conversationId,
            } satisfies WebSocketStreamRegenerteResponse),
          );
        },
      );
    } catch (error) {
      await Credit.release(this.userId, estimatedCredits, conversationId);
      console.error("Regenerate error:", error);
      this.sendErrorMessage(
        ws,
        "Unable to process request. Please try again later.",
        conversationId,
      );
      return;
    }

    const { fullContent, actualInputTokens, actualOutputTokens } = result;

    this.messages = this.messages.map((m) =>
      m.role === "assistant" && m.id === messageId
        ? { ...m, content: fullContent }
        : m,
    );
    this.ctx.storage.sql.exec(UpdateMessageContent, fullContent, messageId);

    ws.send(
      JSON.stringify({
        type: "chat.regenerate.done",
        messageId,
        conversationId,
      } satisfies WebSocketRegenerateResponseDone),
    );

    await Credit.settle(
      this.userId,
      estimatedCredits,
      Credit.calculate(model, actualInputTokens, actualOutputTokens),
      model,
      conversationId,
      actualInputTokens,
      actualOutputTokens,
    );
  }

  async handleGenerateImage(ws: WebSocket, message: WebSocketGenerateImage) {
    this.abortController = new AbortController();
    const { model, content, conversationId, role } = message;

    const estimatedCredits = Credit.calculateImageCredits(model);

    if (
      !(await this.checkAccessAndReserve(
        ws,
        model,
        estimatedCredits,
        conversationId,
      ))
    )
      return;

    const userMessageId = crypto.randomUUID();
    this.messages.push({
      id: userMessageId,
      role,
      messageType: "text",
      content,
    });

    try {
      const response = await this.env.AI.run(
        model,
        { prompt: content },
        { signal: this.abortController.signal, gateway: { id: "onechat" } },
      );

      const key = await this.saveImageToR2(response.image as string);
      const aiMessageId = crypto.randomUUID();

      this.messages.push({
        id: aiMessageId,
        role: Role.Assistant,
        model,
        imageKey: key,
        messageType: "image",
      });

      await Promise.all([
        this.ctx.storage.sql.exec(
          InsertIntoMessage,
          userMessageId,
          Role.User,
          content,
          model,
          Date.now(),
        ),
        this.ctx.storage.sql.exec(
          InsertIntoMessageTypeImage,
          aiMessageId,
          Role.Assistant,
          model,
          "image",
          key,
          Date.now(),
        ),
        Credit.settle(
          this.userId,
          estimatedCredits,
          estimatedCredits,
          model,
          conversationId,
        ),
      ]);

      ws.send(
        JSON.stringify({
          type: "chat.generated.image",
          id: aiMessageId,
          role: Role.Assistant,
          conversationId,
          imageKey: key,
          messageType: "image",
          userMessageId,
        } satisfies WebSocketImageGenerated),
      );
    } catch (error) {
      await Credit.release(this.userId, estimatedCredits, conversationId);
      console.error("Image generation error:", error);
      this.sendErrorMessage(ws, "Unable to Generate Image", conversationId);
    }
  }

  private async checkAccessAndReserve(
    ws: WebSocket,
    model: string,
    estimatedCredits: number,
    conversationId: string,
  ): Promise<boolean> {
    const hasAccess = await User.hasAccess(this.userId, model);
    if (!hasAccess) {
      this.sendErrorMessage(
        ws,
        "Please upgrade to Pro to access this model",
        conversationId,
      );
      return false;
    }

    const reserved = await Credit.reserve(
      this.userId,
      estimatedCredits,
      model,
      conversationId,
    );
    if (!reserved) {
      this.sendErrorMessage(ws, "Insufficient credits", conversationId);
      return false;
    }

    return true;
  }

  /**
   * Reads an SSE stream, calls onToken for each token, and returns
   * the full content and actual token counts when done.
   */
  private async readStream(
    stream: ReadableStream,
    signal: AbortSignal,
    onToken: (token: string) => void,
  ): Promise<StreamResult> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let sseBuffer = "";
    let fullContent = "";
    let actualInputTokens = 0;
    let actualOutputTokens = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        sseBuffer += decoder.decode(value, { stream: true });
        const events = sseBuffer.split("\n\n");
        sseBuffer = events.pop() ?? "";

        for (const event of events) {
          if (event.includes("data: [DONE]")) continue;

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
            onToken(token);
          }
        }
      }
    } catch (error) {
      const wasAborted =
        signal.aborted ||
        (error instanceof Error && error.name === "AbortError");

      if (!wasAborted) {
        throw error;
      }
    } finally {
      reader.releaseLock();
    }
    return {
      fullContent,
      actualInputTokens,
      actualOutputTokens,
    };
  }

  /**
   * Builds the content block for a message, including any uploaded images.
   */
  private async buildContentBlock(
    content: string,
    objects: WebSocketCreateStreamMessage["objects"],
    userMessageId: string,
    provider: string,
  ) {
    const contentBlock: unknown[] = [];

    if (objects && objects.length > 0) {
      for (const obj of objects) {
        if (!obj.type.startsWith("image/")) continue;

        const object = await this.env.IMAGES_BUCKET.get(obj.name);
        if (!object) continue;

        this.ctx.storage.sql.exec(
          InsertIntoImage,
          crypto.randomUUID(),
          obj.name,
          obj.size,
          userMessageId,
          Date.now(),
        );
        this.messages = this.messages.map((m) =>
          m.id === userMessageId
            ? {
                ...m,
                images: [
                  ...(m.images ?? []),
                  { name: obj.name, size: obj.size, type: obj.type },
                ],
              }
            : m,
        );

        const base64 = toBase64(await object.arrayBuffer());

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
        }
      }
    }

    contentBlock.push({ type: "text", text: content });
    return contentBlock;
  }

  /** Decodes a base64 image string and saves it to R2, returning the key. */
  private async saveImageToR2(base64: string): Promise<string> {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const key = `${crypto.randomUUID()}.jpg`;
    await this.env.IMAGES_BUCKET.put(key, bytes, {
      httpMetadata: { contentType: "image/jpeg" },
    });
    return key;
  }

  /** Generates a conversation title after the first exchange. */
  private async maybeGenerateTitle(ws: WebSocket, conversationId: string) {
    if (this.messages.length !== 2) return;

    const firstUserMessage = this.messages.find(
      (m) => m.role === Role.User,
    )?.content;
    const response = (await this.env.AI.run("@cf/meta/llama-3.2-3b-instruct", {
      messages: [
        {
          role: "system",
          content:
            "You are a title generator. You output only 3-5 words. Nothing else. No punctuation. No quotes. No labels.",
        },
        { role: "user", content: firstUserMessage },
      ],
    })) as unknown as { response: string };

    const title = response.response?.trim();
    await Db.get()
      .update(conversation)
      .set({ title })
      .where(eq(conversation.id, conversationId));

    ws.send(
      JSON.stringify({
        type: "chat.title.generated",
        conversationId,
        title,
      } satisfies WebSocketTitleGeneratedMessage),
    );
  }

  sendErrorMessage(ws: WebSocket, message: string, conversationId: string) {
    ws.send(
      JSON.stringify({
        type: "chat.stream.error",
        conversationId,
        message,
      } satisfies WebSocketErrorMessage),
    );
  }

  async getMessages() {
    return this.messages;
  }

  async destroy() {
    await this.ctx.storage.deleteAll();
  }
}
