import { Bindings, Variables } from "@/types";
import { conversation } from "@workspace/db";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const router = new Hono<{ Bindings: Bindings; Variables: Variables }>({
  strict: false,
});

router.get("/:shareId", async (c) => {
  try {
    const db = c.get("db");

    const shareId = c.req.param("shareId");
    if (!shareId) {
      return c.json({ message: "No shareId provided" }, 400);
    }

    const toBeSharedConversation = await db.query.conversation.findFirst({
      where: eq(conversation.shareLink, shareId),
    });
    if (!toBeSharedConversation) {
      return c.json({ message: "Invalid Inputs" }, 400);
    }

    const id = c.env.CONVERSATION.idFromName(toBeSharedConversation.id);
    const stub = c.env.CONVERSATION.get(id);

    const messages = await stub.getMessages();

    return c.json({ message: "OK", data: { messages } });
  } catch (error) {
    console.log("SHARE API", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

export default router;