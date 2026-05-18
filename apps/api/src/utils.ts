import { Message } from "@workspace/types";

export async function getChatCompletion(
  model: string,
  converstions?: Message[],
) {
  try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "baidu/cobuddy:free",
          messages: converstions,
          stream: true
        })
      })
        
      return response.body?.getReader();
  } catch (error) {
    console.log("./utils/getChatCompletion -> ",error);
    throw new Error("Something went wrong")
  }
}
