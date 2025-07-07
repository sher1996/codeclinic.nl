import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const transcript = form.get("SpeechResult") as string;

  // tell your bot (either via BOT_URL or call OpenAI directly here)
  const aiRes = await fetch(`${process.env.BOT_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: transcript }),
  });
  const { reply } = await aiRes.json();  // { reply: "..." }

  // now instruct Twilio to stream that reply via our /tts route
  const ttsUrl = encodeURIComponent(reply);
  const twiml = `
<Response>
  <Play>https://codeclinic.nl/api/tts/stream?text=${ttsUrl}</Play>
  <Gather input="speech" action="/api/handle" language="nl-NL" speechTimeout="auto"/>
</Response>`;
  return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
} 