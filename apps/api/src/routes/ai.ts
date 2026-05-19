import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { ChatSchema } from "@/zod";
import { redis } from "@/services/redis";
import { Message } from "@workspace/types";
import { streamSSE } from "hono/streaming";
import { Bindings, Variables } from "@/types";
import { conversation, message as messageTable } from "@workspace/db";

const router = new Hono<{ Bindings: Bindings; Variables: Variables }>({
  strict: false,
});

router.get("/conversations", async (c) => {
  const userId = c.var.session?.session.userId;
  const db = c.get("db");

  const conversations = await db.query.conversation.findMany({
    where: eq(conversation.userId, userId!),
  });
  if (conversations.length === 0) {
    c.status(404);
    return c.json({ message: "No conversations found" });
  }

  return c.json({ message: "Success", conversations }, 200);
});

router.get("/conversations/:conversationId", async (c) => {
  const db = c.get("db");

  const { conversationId } = c.req.param();
  if (!conversationId) {
    return c.json({ message: "Invalid Inputs" }, 400);
  }

  let cachedConversation = await redis.get(`conv:${conversationId}`);

  if (cachedConversation) {
    cachedConversation = JSON.parse(cachedConversation as string);
    return c.json(
      { message: "Success", conversation: cachedConversation },
      200,
    );
  }

  const existingConversation = await db.query.conversation.findFirst({
    where: eq(conversation.id, conversationId),
  });

  if (!existingConversation) {
    return c.json({ message: "Not found" }, 404);
  }

  let existingConversationMessages = await db.query.message.findMany({
    where: eq(messageTable.conversationId, existingConversation.id),
  });

  const formattedMessages = existingConversationMessages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  })) as { role: string; content: string }[];

  await redis.set(`conv:${conversationId}`, JSON.stringify(formattedMessages), {
    ex: 7200,
  });

  return c.json({ message: "Success", conversation: formattedMessages }, 200);
});

router.post("/chat", async (c) => {
  try {
    const db = c.get("db");
    const body = await c.req.json();
    const { success } = ChatSchema.safeParse(body);
    if (!success) return c.json({ message: "Invalid Inputs" }, 400);

    let { message, model, conversationId } = body;
    conversationId = conversationId ?? crypto.randomUUID();

    let messages: Message[] = [];
    const existingConversations = await db.query.message.findMany({
      where: eq(conversation.id, conversationId),
    });

    if (existingConversations.length) {
      messages = existingConversations.map(
        (m) => ({ role: m.role, content: m.content }) as Message,
      );
    }

    messages = [...messages, { role: "user", content: message } as Message];

    const stream = (await c.env.AI.run(model, {
      messages,
      stream: true,
    })) as unknown as ReadableStream;

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let fullContent = "";

    return streamSSE(c, async (stream) => {
      let buffer = "";
      let isDone = false;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const eventBlock of events) {
            if (eventBlock.includes("data: [DONE]")) {
              isDone = true;
              continue;
            }

            const dataLine = eventBlock
              .split("\n")
              .find((l) => l.startsWith("data: "));

            if (!dataLine) continue;

            const json = JSON.parse(dataLine.slice(6));

            const token =
              json.response ??
              json.choices?.[0]?.delta?.content ??
              "";

            if (token) {
              fullContent += token;
              await stream.writeSSE({
                event: "token",
                data: JSON.stringify({ token }),
              });
            }
          }

          if (isDone) {
            await stream.writeSSE({
              event: "done",
              data: JSON.stringify({ conversationId }),
            });
            await stream.close();
            return;
          }
        }
      } finally {
        reader.releaseLock();
      }
    });
  } catch (error) {
    console.error(error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

export default router