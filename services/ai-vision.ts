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
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  console.log("[ai-vision] GEMINI_API_KEY present:", !!geminiKey);
  console.log("[ai-vision] OPENAI_API_KEY present:", !!openaiKey);
  console.log("[ai-vision] imageUrl:", imageUrl.slice(0, 80));

  if (geminiKey) {
    console.log("[ai-vision] Using Gemini Vision...");
    return analyzeWithGemini(imageUrl, geminiKey);
  }

  if (openaiKey) {
    console.log("[ai-vision] Using OpenAI Vision...");
    return analyzeWithOpenAI(imageUrl, openaiKey);
  }

  // Demo mock — simulate real AI API latency (3 seconds) to ensure loading states work
  console.log("[ai-vision] ⚠️ No API key found — using MOCK response!");
  await new Promise((r) => setTimeout(r, 3000));
  const seed = imageUrl.length % 20;
  return {
    fabricType: "100% Cotton Woven",
    threadDensity: 110 + seed,
    warpCount: 65 + seed,
    weftCount: 45 + (seed % 10),
    confidence: 96.2 + (seed % 5) * 0.1,
  };
}

async function analyzeWithGemini(
  imageUrl: string,
  apiKey: string
): Promise<FabricAnalysisResult> {
  // Fetch the image and convert to base64 so Gemini can read any public URL.
  // (file_data.file_uri only works with Gemini Files API URIs, not public URLs.)
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error(`Failed to fetch image for analysis: ${imgRes.statusText}`);
  const imgBuffer = await imgRes.arrayBuffer();
  const base64Data = Buffer.from(imgBuffer).toString("base64");

  // Detect mime type from URL extension, default to jpeg
  const ext = imageUrl.split("?")[0].split(".").pop()?.toLowerCase();
  const mimeType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a textile analysis expert. Analyze this fabric image carefully and identify the fabric material (cotton, silk, polyester, linen, wool, etc.) and its weave structure. Return ONLY valid JSON with these exact keys:\n{"fabricType":"string","threadDensity":number,"warpCount":number,"weftCount":number,"confidence":number}\nEstimate warp (vertical) and weft (horizontal) thread counts per inch and overall thread density per inch. Be precise about the fabric type based on visual characteristics like sheen, texture, and weave pattern.`,
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error: ${response.statusText} — ${errText}`);
  }

  const json = await response.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  console.log("[ai-vision] Gemini raw response text:", text?.slice(0, 200));
  return parseVisionResponse(text);
}

async function analyzeWithOpenAI(
  imageUrl: string,
  apiKey: string
): Promise<FabricAnalysisResult> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this fabric image. Return JSON: {"fabricType":"string","threadDensity":number,"warpCount":number,"weftCount":number,"confidence":number}`,
            },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const json = await response.json();
  const text = json.choices?.[0]?.message?.content;
  return parseVisionResponse(text);
}

function parseVisionResponse(text: string): FabricAnalysisResult {
  const parsed = JSON.parse(text) as Partial<FabricAnalysisResult>;
  if (
    typeof parsed.warpCount !== "number" ||
    typeof parsed.weftCount !== "number" ||
    typeof parsed.threadDensity !== "number"
  ) {
    throw new Error("Vision API returned incomplete analysis data");
  }
  return {
    fabricType: parsed.fabricType ?? "Unknown Fabric",
    threadDensity: parsed.threadDensity,
    warpCount: parsed.warpCount,
    weftCount: parsed.weftCount,
    confidence: parsed.confidence ?? 95,
  };
}
