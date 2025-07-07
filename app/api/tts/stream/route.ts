import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text") || "…";
  
  // Call ElevenLabs streaming TTS
  const elevenRes = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVEN_VOICE_ID}/stream`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVEN_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
      }),
    }
  );

  // Pipe the streamed MP3 back to Twilio immediately
  return new NextResponse(elevenRes.body, {
    status: 200,
    headers: new Headers({
      "Content-Type": "audio/mpeg",
      "Transfer-Encoding": "chunked",
    }),
  });
} 