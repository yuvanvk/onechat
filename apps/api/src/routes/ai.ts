import { getChatCompletion } from "@/utils";
import { Hono } from "hono";

const router = new Hono();

router.post("/chat", async (c) => {
  const { message } = await c.req.json();
  console.log("in chat");
  
  const data = await getChatCompletion("openai/gpt-5.2", "what is 2 + 2?");
  console.log(data);
  
  return c.json({ data });
});

export default router;
