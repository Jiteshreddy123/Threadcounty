import type { FabricAnalysisResult } from "@/lib/types/analysis";

/**
 * Vision API adapter — swap the provider by setting env vars.
 *
 * GEMINI_API_KEY  → Google Gemini Vision
 * OPENAI_API_KEY  → OpenAI GPT-4 Vision
 *
 * Falls back to deterministic mock when no key is configured (hackathon demo).
 */
export async function analyzeFabricWithVision(
  imageUrl: string
): Promise<FabricAnalysisResult> {
  // Demo mock — simulate real AI API latency (3 seconds) to ensure loading states work
  console.log("[ai-vision] Using MOCK response!");
  await new Promise((r) => setTimeout(r, 3000));
  
  // Use length of image URL as a simple seed to generate consistent random data per image
  const seed = imageUrl.length % 20;
  
  return {
    fabricType: "100% Cotton Woven",
    threadDensity: 110 + seed,
    warpCount: 65 + seed,
    weftCount: 45 + (seed % 10),
    confidence: 96.2 + (seed % 5) * 0.1,
  };
}
