import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { ChatSchema } from "@/zod";
import { redis } from "@/services/redis";
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

router.get("/chat", async (c) => {
  try {
    const db = c.get("db");

    let { conversationId } = c.req.query();
    conversationId = conversationId ?? crypto.randomUUID();

    const id = c.env.CONVERSATION.idFromName(conversationId)
    const stub = c.env.CONVERSATION.get(id)

    return stub.fetch(c.req.raw);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

export default router