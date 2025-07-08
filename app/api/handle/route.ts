import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const transcript = form.get("SpeechResult") as string;

    // Debug: Check if BOT_URL is set
    const botUrl = process.env.BOT_URL || "https://computer-help.fly.dev";
    if (!botUrl) {
      console.error("BOT_URL environment variable is not set");
      return new NextResponse(
        `<Response><Say language="nl-NL">Sorry, er is een technische fout. BOT_URL is niet ingesteld.</Say></Response>`,
        { headers: { "Content-Type": "text/xml" } }
      );
    }

    console.log("BOT_URL:", botUrl);
    console.log("Transcript:", transcript);

    if (!transcript || transcript.trim() === "") {
      return new NextResponse(
        `<Response><Say language="nl-NL">Sorry, ik hoorde u niet. Kunt u dat nog eens herhalen?</Say></Response>`,
        { headers: { "Content-Type": "text/xml" } }
      );
    }

    // Call the bot with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const aiRes = await fetch(`${botUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!aiRes.ok) {
        console.error("Bot API error:", aiRes.status, aiRes.statusText);
        return new NextResponse(
          `<Response><Say language="nl-NL">Sorry, er is een technische fout bij het ophalen van het antwoord.</Say></Response>`,
          { headers: { "Content-Type": "text/xml" } }
        );
      }

      const { reply } = await aiRes.json();
      console.log("Bot reply:", reply);

      if (!reply || reply.trim() === "") {
        return new NextResponse(
          `<Response><Say language="nl-NL">Sorry, ik begrijp het niet. Kunt u dat anders formuleren?</Say></Response>`,
          { headers: { "Content-Type": "text/xml" } }
        );
      }

      // Stream the reply via TTS
      const ttsUrl = encodeURIComponent(reply);
      const twiml = `
<Response>
  <Play>https://codeclinic.nl/api/tts/stream?text=${ttsUrl}</Play>
  <Gather input="speech" action="/api/handle" language="nl-NL" speechTimeout="auto" timeout="10"/>
</Response>`;
      return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });

    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        console.error("Bot API timeout");
        return new NextResponse(
          `<Response><Say language="nl-NL">Sorry, het duurt te lang. Probeer het nog eens.</Say></Response>`,
          { headers: { "Content-Type": "text/xml" } }
        );
      }
      throw error;
    }

  } catch (error) {
    console.error("Handle endpoint error:", error);
    return new NextResponse(
      `<Response><Say language="nl-NL">Sorry, er is een technische fout opgetreden.</Say></Response>`,
      { headers: { "Content-Type": "text/xml" } }
    );
  }
} 