import { Message } from "@workspace/types";
import { DurableObject } from "cloudflare:workers";
import { object } from "zod";

export class Conversation extends DurableObject<Env> {
  private messages: Message[] = [];

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.ctx.blockConcurrencyWhile(async () => {
      this.ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          role TEXT NOT NULL,
          content TEXT,
          model TEXT,
          created_at INTEGER NOT NULL
        )
      `);
      this.messages = this.ctx.storage.sql
        .exec(`SELECT id, role, content FROM messages ORDER BY created_at ASC`)
        .toArray() as Message[];
    });
  }

  async fetch(request: Request): Promise<Response> {
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    this.ctx.acceptWebSocket(server);

    return new Response(null, {
      status: 101,
      webSocket: client
    })
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    ws.send(
      `[Durable Object] message: ${message}, connections: ${this.ctx.getWebSockets().length}`,
    );
  }

  async getMessages() {
    return this.messages;
  }

  async saveAssistantMessage(message: Message, model: string) {
    this.messages = [...this.messages, message]
    this.ctx.storage.sql.exec(
        `INSERT INTO messages (id, role, content, model, created_at) VALUES (?, ?, ?, ?, ?)`,
        message.id, message.role, message.content, model, Date.now()
    )
  }

  async streamResponse(message: Message, model: string) {
    // insert the current user message into in-memory messages list
    this.messages = [...this.messages, message];
    // also put it into storage API using sqlite
    this.ctx.storage.sql.exec(
      `INSERT INTO messages (id, role, content, model, created_at) VALUES (?, ?, ?, ?, ?)`,
      message.id,
      message.role,
      message.content,
      model,
      Date.now(),
    );

    const formattedMessages = this.messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    return await this.env.AI.run(model, {
      messages: formattedMessages,
      stream: true,
    }) as unknown as ReadableStream;
  }
}
