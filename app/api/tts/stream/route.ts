import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text") || "…";
  
  // Call ElevenLabs streaming TTS with improved voice settings
  const elevenRes = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVEN_VOICE_ID || "XJa38TJgDqYhj5mYbSJA"}/stream`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVEN_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,           // More natural variation
          similarity_boost: 0.75,   // Maintain voice consistency
          style: 0.3,               // Slight style variation
          use_speaker_boost: true   // Enhance speaker clarity
        },
        output_format: "mp3_44100_128"
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