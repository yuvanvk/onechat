import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { ChatSchema } from "@/zod";
import { randomUUIDv7 } from "bun";
import { redis } from "@/services/redis";
import { getChatCompletion } from "@/utils";
import { conversation, db, message as messageDB } from "@workspace/db";
import { streamSSE } from "hono/streaming";

const router = new Hono();

router.get("/conversations", async (c) => {});

router.get("/conversations/:conversationId", async (c) => {});

router.post("/chat", async (c) => {
  try {
    const body = await c.req.json();
    const { success } = ChatSchema.safeParse(body);

    if (!success) {
      c.status(400);
      return c.json({ message: "Invalid Inputs" });
    }

    let { message, model, conversationId } = body;

    conversationId = conversationId ?? randomUUIDv7();
    let messages = [];

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
          where: eq(messageDB.conversationId, conversationId),
          with: { content: true, role: true },
        });
        messages.push(dbMessages);
      }
    }

    await db.insert(messageDB).values({
      id: randomUUIDv7(),
      content: message,
      role: "user",
      conversationId,
      createdAt: new Date(),
    });

    // push current user messages
    messages.push(message);
    return streamSSE(c, async (stream) => {
      let fullContent = "";

      try {
        const aiStream = await getChatCompletion(model, messages);

        for await (const chunk of aiStream) {
          const content = chunk.data.choices[0].message.content ?? "";
          if (content) {
            fullContent += content;
            await stream.writeSSE({ data: content, event: "message" });
          }
        }

        await db.insert(messageDB).values({
          id: randomUUIDv7(),
          content: fullContent,
          role: "assistant",
          conversationId,
          createdAt: new Date(),
        });

        messages.push({ role: "assistant", content: fullContent });
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
