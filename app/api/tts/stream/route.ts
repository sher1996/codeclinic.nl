import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text") || "…";
  
  // Call ElevenLabs streaming TTS with optimized settings for better performance
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
          stability: 0.7,           // More stable for consistent voice
          similarity_boost: 0.85,   // Higher similarity for voice consistency
          style: 0.1,               // Minimal style variation for clarity
          use_speaker_boost: true,  // Enhance speaker clarity
          speaking_rate: 0.9        // Slower, more natural speaking rate
        },
        output_format: "mp3_44100_128"  // Standard quality for faster generation
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