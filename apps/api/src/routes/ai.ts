import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { Bindings, Variables } from "@/types";
import { conversation } from "@workspace/db";

const router = new Hono<{ Bindings: Bindings; Variables: Variables }>({
  strict: false,
});

router.get("/conversations", async (c) => {
  const userId = "VCY2XaUNgKPbmcmkEuwAiyfLy10W6L5A";
  const db = c.get("db");

  const conversations = await db.query.conversation.findMany({
    where: eq(conversation.userId, userId!),
  });

  if (conversations.length === 0) {
    return c.json(
      { message: "No conversations found", data: { conversations: [] } },
      404,
    );
  }

  return c.json({ message: "OK", data: { conversations } }, 200);
});

router.get("/conversations/:conversationId", async (c) => {
  const db = c.get("db");

  const conversationId = c.req.param("conversationId");
  const validConversation = await db.query.conversation.findFirst({
    where: eq(conversation.id, conversationId),
  });

  if (!validConversation) {
    return c.json(
      { message: "Invalid Conversation", data: { conversation: [] } },
      404,
    );
  }

  const id = c.env.CONVERSATION.idFromName(conversationId);
  const stub = c.env.CONVERSATION.get(id);

  const messages = await stub.getMessages();

  if (!messages) {
    return c.json(
      { message: "No Messages found", data: { messages: [] } },
      404,
    );
  }

  return c.json({ message: "OK", data: { messages } }, 200);
});

router.post("/create", async (c) => {
  const db = c.get("db");
  const conversationId = crypto.randomUUID();

  await db.insert(conversation).values({
    id: conversationId,
    userId: "VCY2XaUNgKPbmcmkEuwAiyfLy10W6L5A",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return c.json({ message: "Ok", data: { conversationId } });
});

router.get("/chat", async (c) => {
  try {
    const db = c.get("db");

    let { conversationId } = c.req.query();

    if (!conversationId) {
      return c.json({ message: "Conversation id is required" }, 400);
    }

    const existing = await db.query.conversation.findFirst({
      where: eq(conversation.id, conversationId),
    });

    if (!existing) {
      return c.json({ message: "Conversation not found" }, 404);
    }

    const id = c.env.CONVERSATION.idFromName(conversationId);
    const stub = c.env.CONVERSATION.get(id);

    return stub.fetch(c.req.raw);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

router.delete("/chat/delete/:conversationId", async (c) => {
  try {
    const db = c.get("db");
    const conversationId = c.req.param("conversationId");

    if (!conversationId) {
      return c.json({ message: "Provide conversationId" }, 400);
    }

    const existing = await db.query.conversation.findFirst({
      where: eq(conversation.id, conversationId),
    });
    if (!existing) {
      return c.json({ message: "Invalid Inputs" }, 400);
    }

    await db.delete(conversation).where(eq(conversation.id, conversationId));
    const id = c.env.CONVERSATION.idFromName(conversationId);
    const stub = c.env.CONVERSATION.get(id);
    await stub.destroy();

    return c.json({ message: "Conversation deleted successfully" });
  } catch (error) {
    return c.json({ message: "Interal Server Error" }, 500);
  }
});

router.post("/chat/share/:conversationId", async (c) => {
  try {
    const db = c.get("db");
    const conversationId = c.req.param("conversationId");
    console.log(conversationId);

    if (!conversationId) {
      return c.json({ message: "Provide conversationId" }, 400);
    }

    const existingConversation = await db.query.conversation.findFirst({
      where: eq(conversation.id, conversationId),
    });

    if (!existingConversation) {
      return c.json({ message: "Invalid Inputs" }, 400);
    }

    if (existingConversation.shareLink) {
      return c.json({
        message: "Already Link Generated",
        data: { shareLink: existingConversation.shareLink },
      });
    }

    const link = crypto.randomUUID();
    const [updated] = await db
      .update(conversation)
      .set({ shareLink: link })
      .where(eq(conversation.id, conversationId))
      .returning();
    console.log(updated.shareLink);
    
    return c.json(
      {
        message: "Link Generated",
        data: { shareLink: updated.shareLink },
      },
      200,
    );
  } catch (error) {
    console.error(error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});
export default router;
