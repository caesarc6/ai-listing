import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateProductInfo(
  imageUrl: string
): Promise<{ title: string; description: string }> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this image and provide a short title and a detailed description. Please format your response as a JSON object with two keys: 'title' and 'description'.",
          },
          {
            type: "image_url",
            image_url: { url: imageUrl },
          },
        ],
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 300,
  });

  // The response content will be a JSON string
  const content = response.choices[0].message.content;
  if (!content) throw new Error("No content returned from OpenAI");
  return JSON.parse(content);
}
