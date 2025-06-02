import { createMistral } from "@ai-sdk/mistral";
import { streamText } from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const mistral = createMistral({
  apiKey: process.env.MISTRAL_API_KEY,
  baseURL: "https://api.mistral.ai/v1",
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // Validate messages array
    if (!prompt) {
      return new Response("Invalid prompt", { status: 400 });
    }

    const result = streamText({
      model: mistral("mistral-large-latest"),
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Use text streaming which is simpler to parse
    return NextResponse.json({
      textStream: result.textStream,
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
