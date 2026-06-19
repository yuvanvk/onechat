import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { Bindings, Variables } from "@/types";
import { conversation, favourite, session, user } from "@workspace/db";
import { FavouriteSchema } from "@/zod";

const router = new Hono<{ Bindings: Bindings; Variables: Variables }>({
  strict: false,
});

router.get("/conversations", async (c) => {
  const session = c.get("session");
  const db = c.get("db");

  const conversations = await db.query.conversation.findMany({
    where: eq(conversation.userId, session?.user.id!),
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
  const session = c.get("session");
  const conversationId = c.req.param("conversationId");
  const validConversation = await db.query.conversation.findFirst({
    where: and(eq(conversation.id, conversationId), eq(conversation.userId, session?.user.id!)),
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
  const session = c.get("session");
  const conversationId = crypto.randomUUID();

  await db.insert(conversation).values({
    id: conversationId,
    userId: session?.user.id!,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return c.json({ message: "Ok", data: { conversationId } });
});

router.get("/chat", async (c) => {
  try {
    const db = c.get("db");
    const session = c.get("session");
    let { conversationId } = c.req.query();

    if (!conversationId) {
      return c.json({ message: "Conversation id is required" }, 400);
    }
    const existing = await db.query.conversation.findFirst({
      where: and(eq(conversation.id, conversationId), eq(conversation.userId, session?.user.id!)),
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
    const session = c.get("session");
    const conversationId = c.req.param("conversationId");

    if (!conversationId) {
      return c.json({ message: "Provide conversationId" }, 400);
    }

    const existing = await db.query.conversation.findFirst({
      where: and(eq(conversation.id, conversationId), eq(conversation.userId, session?.user.id!)),
    });
    if (!existing) {
      return c.json({ message: "Invalid Inputs" }, 400);
    }

    await db.delete(conversation).where(and(eq(conversation.id, conversationId), eq(conversation.userId, session?.session.userId!)));
    const id = c.env.CONVERSATION.idFromName(conversationId);
    const stub = c.env.CONVERSATION.get(id);
    await stub.destroy();

    return c.json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.log(error);

    return c.json({ message: "Interal Server Error" }, 500);
  }
});

router.post("/chat/share/:conversationId", async (c) => {
  try {
    const db = c.get("db");
    const session = c.get("session");
    const conversationId = c.req.param("conversationId");

    if (!conversationId) {
      return c.json({ message: "Provide conversationId" }, 400);
    }

    const existingConversation = await db.query.conversation.findFirst({
      where: and(
        eq(conversation.id, conversationId),
        eq(conversation.userId, session?.user.id!),
      ),
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

router.get("/favourite", async (c) => {
  const db = c.get("db");
  const session = c.get("session");

  const favourites = await db.query.favourite.findMany({
    where: eq(favourite.userId, session?.user.id!),
  });

  return c.json({
    message: "OK",
    data: {
      favourites: favourites.map((model) => ({
        id: model.modelId,
        displayName: model.displayName,
        description: model.description,
        capabilities: model.capabilities,
      })),
    },
  });
});

router.post("/favourite", async (c) => {
  try {
    const body = await c.req.json();
    const db = c.get("db");

    const session = c.get("session");

    const { success, data } = FavouriteSchema.safeParse(body);
    if (!success) {
      return c.json({ message: "Invalid Inputs" }, 400);
    }

    await db.insert(favourite).values({
      id: crypto.randomUUID(),
      modelId: data.modelId,
      displayName: data.displayName,
      description: data.description,
      capabilities: data.capabilites,
      userId: session?.user.id!,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return c.json({ message: "Added to Favourites" }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Something went wrong" }, 500);
  }
});

router.delete("/favourite/delete/:modelId", async (c) => {
  try {
    const id = c.req.param("modelId");
    const session = c.get("session");
    const db = c.get("db");
    if (!id) {
      return c.json({ message: "Invalid inputs" }, 400);
    }

    await db
      .delete(favourite)
      .where(
        and(
          eq(favourite.modelId, id),
          eq(favourite.userId, session?.user.id!),
        ),
      );

    return c.json({ message: "Removed from favourites" }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Something went wrong" }, 500);
  }
});

export default router;
