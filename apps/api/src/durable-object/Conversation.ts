import { DurableObject } from "cloudflare:workers";
import {
  ImageSchema,
  InsertIntoMessage,
  MessageSchema,
  PDFSchema,
  QueryMessages,
  UpdateConversationTitle,
} from "./sql";
import {
  Message,
  Role,
  WebSocketClientMessage,
  WebSocketCreateStreamMessage,
  WebSocketRegenerateStreamMessage,
  WebSocketStreamAIDone,
  WebSocketStreamAIResponse,
  WebSocketTitleGeneratedMessage,
} from "@workspace/types";

export class Conversation extends DurableObject<Env> {
  private messages: Message[] = [];
  abortController: AbortController;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.ctx.blockConcurrencyWhile(async () => {
      this.ctx.storage.sql.exec(MessageSchema);
      this.ctx.storage.sql.exec(ImageSchema);
      this.ctx.storage.sql.exec(PDFSchema);

      this.messages = this.ctx.storage.sql
        .exec(QueryMessages)
        .toArray() as Message[];
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
    }
  }

  async handleStreamResponse(
    ws: WebSocket,
    message: WebSocketCreateStreamMessage,
  ) {
    const { eventId, conversationId, content, model, role } = message;
    this.messages = [...this.messages, { role, content }];
    this.abortController = new AbortController();

    const userMessageId = crypto.randomUUID();
    this.ctx.storage.sql.exec(
      InsertIntoMessage,
      userMessageId,
      role,
      content,
      model,
      Date.now(),
    );

    try {
      const stream = (await this.env.AI.run(
        model,
        {
          messages: this.messages,
          stream: true,
        },
        {
          signal: this.abortController.signal,
        },
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
            const streamMessage: WebSocketStreamAIResponse = {
              type: "chat.stream.response",
              eventId,
              role: "assistant" as Role.Assistant,
              content: token as string,
              conversationId,
            };

            ws.send(JSON.stringify(streamMessage));
          }
        }
      }
      if (isDone) {
        const streamDoneMessage: WebSocketStreamAIDone = {
          type: "chat.stream.done",
          eventId,
          conversationId,
        };

        this.messages = [
          ...this.messages,
          { role: "assistant" as Role.Assistant, content: fullContent },
        ];

        this.ctx.storage.sql.exec(
          InsertIntoMessage,
          crypto.randomUUID(),
          Role.Assistant,
          fullContent,
          model,
          Date.now(),
        );
        ws.send(JSON.stringify(streamDoneMessage));
      }

      if (this.messages.length === 2) {
        const firstUserMessage = this.messages.find((x) => x.role === Role.User)?.content;
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

        await this.env.D1_DATABASE.prepare(UpdateConversationTitle)
          .bind(title, conversationId)
          .run();

        const titleGeneratedEvent: WebSocketTitleGeneratedMessage = {
          type: "chat.title.generated",
          conversationId,
          eventId,
          title
        } 
        ws.send(JSON.stringify(titleGeneratedEvent));
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log(`Stream aborted for conversation ${conversationId}`);
      } else {
        console.error(
          `Error processing stream for conversation ${conversationId}:`,
          error,
        );
        throw error;
      }
    }
  }

  async handleStreamRegenerate(
    ws: WebSocket,
    message: WebSocketRegenerateStreamMessage,
  ) {
    this.abortController = new AbortController();
    const result = this.ctx.storage.sql.exec(
      "SELECT content FROM messages WHERE id = ?",
      [message.messageId],
    );

    const regenerateStream = await this.env.AI.run(
      message.model,
      {
        prompt:
          result +
          "For the above text regenerate it properly with exact context of matter",
        stream: true,
      },
      {
        signal: this.abortController.signal,
      },
    );
  }

  async getMessages() {
    return this.messages;
  }

  async destroy() {
    await this.ctx.storage.deleteAll();
  }
}



// Create Image and Pdf table in conversation
// each image or pdf will have messageId associated.
// maybe create a new type of event handling for input data associated with images or pdf.
// and then stream back the response.
