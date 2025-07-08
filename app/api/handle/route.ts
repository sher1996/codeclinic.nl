import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const transcript = form.get("SpeechResult") as string;

    // Debug: Check if BOT_URL is set
    const botUrl = process.env.BOT_URL;
    if (!botUrl) {
      console.error("BOT_URL environment variable is not set");
      return new NextResponse(
        `<Response><Say language="nl-NL">Sorry, er is een technische fout. BOT_URL is niet ingesteld.</Say></Response>`,
        { headers: { "Content-Type": "text/xml" } }
      );
    }

    console.log("BOT_URL:", botUrl);
    console.log("Transcript:", transcript);

    // tell your bot (either via BOT_URL or call OpenAI directly here)
    const aiRes = await fetch(`${botUrl}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: transcript }),
    });

    if (!aiRes.ok) {
      console.error("Bot API error:", aiRes.status, aiRes.statusText);
      return new NextResponse(
        `<Response><Say language="nl-NL">Sorry, er is een technische fout bij het ophalen van het antwoord.</Say></Response>`,
        { headers: { "Content-Type": "text/xml" } }
      );
    }

    const { reply } = await aiRes.json(); // { reply: "..." }
    console.log("Bot reply:", reply);

    // now instruct Twilio to stream that reply via our /tts route
    const ttsUrl = encodeURIComponent(reply);
    const twiml = `
<Response>
  <Play>https://codeclinic.nl/api/tts/stream?text=${ttsUrl}</Play>
  <Gather input="speech" action="/api/handle" language="nl-NL" speechTimeout="auto"/>
</Response>`;
    return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
  } catch (error) {
    console.error("Handle endpoint error:", error);
    return new NextResponse(
      `<Response><Say language="nl-NL">Sorry, er is een technische fout opgetreden.</Say></Response>`,
      { headers: { "Content-Type": "text/xml" } }
    );
  }
} 