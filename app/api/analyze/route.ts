import { NextRequest, NextResponse } from "next/server";
import {
  generateProductInfo,
  analyzeImage,
  extractTextFromImage,
} from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, analysisType } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    let result;

    switch (analysisType) {
      case "product":
        result = await generateProductInfo(imageUrl);
        break;
      case "detailed":
        result = await analyzeImage(imageUrl);
        break;
      case "text":
        result = await extractTextFromImage(imageUrl);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid analysis type" },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze image" },
      { status: 500 }
    );
  }
}
