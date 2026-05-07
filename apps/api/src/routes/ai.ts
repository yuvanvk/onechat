import { getChatCompletion } from "@/utils";
import { Hono } from "hono";

const router = new Hono();

router.get("/chat", async (c) => {
  const { message } = await c.req.json();

  const data = await getChatCompletion("openai/gpt-5.2", "what is 2 + 2?");
  return c.json({ data });
});

export default router;
