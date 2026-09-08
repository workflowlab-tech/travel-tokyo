import { NextResponse } from "next/server";
import {
  buildReceiptPrompt,
  classifyParsedReceipt,
  extractJsonFromGeminiResponse,
} from "../../../lib/receiptExpense";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

interface ParseReceiptRequestBody {
  imageBase64?: string;
  mimeType?: string;
  text?: string;
  caption?: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  let body: ParseReceiptRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const hasImage = typeof body.imageBase64 === "string" && body.imageBase64.length > 0;
  const hasText = typeof body.text === "string" && body.text.trim().length > 0;
  if (!hasImage && !hasText) {
    return NextResponse.json(
      { success: false, error: "Provide either imageBase64 (with mimeType) or text" },
      { status: 400 }
    );
  }

  const prompt = buildReceiptPrompt(
    hasImage ? { kind: "image", caption: body.caption } : { kind: "text", text: body.text }
  );

  const parts: Record<string, unknown>[] = [{ text: prompt }];
  if (hasImage) {
    parts.push({
      inlineData: { mimeType: body.mimeType || "image/jpeg", data: body.imageBase64 },
    });
  }

  const geminiPayload = {
    contents: [{ parts }],
    generationConfig: { temperature: 0.1, responseMimeType: "application/json" },
  };

  let geminiRes: Response;
  try {
    geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify(geminiPayload),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error calling Gemini";
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }

  if (!geminiRes.ok) {
    const errorText = await geminiRes.text().catch(() => "");
    return NextResponse.json(
      { success: false, error: `Gemini API returned ${geminiRes.status}: ${errorText.slice(0, 300)}` },
      { status: 502 }
    );
  }

  let geminiJson: unknown;
  try {
    geminiJson = await geminiRes.json();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to parse Gemini response";
    return NextResponse.json({ success: false, error: `Gemini returned invalid JSON: ${message}` }, { status: 502 });
  }

  const parsed = extractJsonFromGeminiResponse(geminiJson);
  const action = classifyParsedReceipt(parsed);

  return NextResponse.json({ success: true, action, parsed });
}
