import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { ChatSchema } from "@/zod";
import { redis } from "@/services/redis";
import { streamSSE } from "hono/streaming";
import { getChatCompletion } from "@/utils";
import { conversation, db, message as messageTable } from "@workspace/db";

const router = new Hono();

router.get("/conversations", async (c) => {
  // first check if the user is authenticated and then using user session userId get all the conversations
  const userId = "temp";

  const conversations = await db.query.conversation.findMany({
    where: eq(conversation.userId, userId),
  });
  if (conversations.length === 0) {
    c.status(404);
    return c.json({ message: "No conversations found" });
  }

  return c.json({ message: "Success", conversations }, 200);
});

router.get("/conversations/:conversationId", async (c) => {
  const userId = "temp";

  const { conversationId } = c.req.param();
  if (!conversationId) {
    return c.json({ message: "Invalid Inputs" }, 400);
  }

  let cachedConversation = (await redis.get(
    `conv:${conversationId}`,
  ));

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

  await redis.set(`conv:${conversationId}`, JSON.stringify(formattedMessages), { ex: 7200 });

  return c.json({ message: "Success", conversation: formattedMessages }, 200);
});

router.post("/chat", async (c) => {
  try {
    const body = await c.req.json();
    const { success } = ChatSchema.safeParse(body);

    if (!success) {
      c.status(400);
      return c.json({ message: "Invalid Inputs" });
    }

    let { message, model, conversationId } = body;

    conversationId = conversationId ?? crypto.randomUUID();

    // Getting the existing messages of conversation if it exists, otherwise create one.
    let messages: { role: string; content: string }[] = [];

    const cached = (await redis.get(`conv:${conversationId}`)) as string;
    if (cached) {
      messages = JSON.parse(cached);
    } else {
      const existingConv = await db.query.conversation.findFirst({
        where: eq(conversation.id, conversationId),
      });

      if (!existingConv) {
        await db.insert(conversation).values({
          id: conversationId,
          userId: "temp",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        const dbMessages = await db.query.message.findMany({
          where: eq(messageTable.conversationId, conversationId),
        });

        messages = dbMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })) as { role: string; content: string }[];
      }
    }

    // push current message into DB.
    await db.insert(messageTable).values({
      id: crypto.randomUUID(),
      content: message,
      role: "user",
      conversationId,
      createdAt: new Date(),
    });

    // push current user message into messages array for redis purpose.
    messages = [...messages, { role: "user", content: message }];
    return streamSSE(c, async (stream) => {
      let fullContent = "";

      try {
        const aiStream = await getChatCompletion(model, messages);

        for await (const chunk of aiStream) {
          const content = chunk.choices?.[0]?.delta?.content;
          if (content) {
            fullContent += content;
            await stream.writeSSE({ data: content, event: "message" });
          }
        }

        await db.insert(messageTable).values({
          id: crypto.randomUUID(),
          content: fullContent,
          role: "assistant",
          conversationId,
          createdAt: new Date(),
        });

        messages = [...messages, { role: "assistant", content: fullContent }];

        await redis.set(`conv:${conversationId}`, JSON.stringify(messages), {
          ex: 7200,
        });
        await stream.writeSSE({
          data: JSON.stringify({ conversationId }),
          event: "done",
        });
      } catch (error) {
        console.error("[/chat stream]", error);
        await stream.writeSSE({
          data: JSON.stringify({ message: "Stream error" }),
          event: "error",
        });
      }
    });
  } catch (error) {
    console.log(error);
    c.status(500);
    return c.json({ message: "Internal Server Error" });
  }
});

export default router;
