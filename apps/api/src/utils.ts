export async function getChatCompletion(
  model: string,
  message: string,
  converstions?: string[],
) {
  fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch(e => {
      console.log(e);
    })
}
