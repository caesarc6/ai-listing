import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
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

export async function analyzeImage(imageUrl: string): Promise<{
  objects: string[];
  scene: string;
  colors: string[];
  mood: string;
  details: string;
  suggestions: string[];
}> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this image comprehensively and provide detailed insights. Please format your response as a JSON object with the following structure:
            {
              "objects": ["list of main objects detected"],
              "scene": "description of the scene or setting",
              "colors": ["dominant colors in the image"],
              "mood": "overall mood or atmosphere",
              "details": "detailed description of what you see",
              "suggestions": ["potential use cases or applications"]
            }`,
          },
          {
            type: "image_url",
            image_url: { url: imageUrl },
          },
        ],
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 500,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("No content returned from OpenAI");
  return JSON.parse(content);
}

export async function extractTextFromImage(
  imageUrl: string
): Promise<{ text: string; confidence: number }> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract all visible text from this image. If there's no text, respond with 'No text detected'. Please format your response as a JSON object with 'text' and 'confidence' (0-1) keys.",
          },
          {
            type: "image_url",
            image_url: { url: imageUrl },
          },
        ],
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 200,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("No content returned from OpenAI");
  return JSON.parse(content);
}
