import { NextResponse } from "next/server";

export function GET() {
  const greetingText = encodeURIComponent("Hallo! Ik ben Sam van CodeClinic. Hoe kan ik u vandaag helpen?");
  const fallbackText = encodeURIComponent("Sorry, ik hoorde u niet duidelijk. Probeer het nog eens.");
  
  const twiml = `
<Response>
  <Gather input="speech" action="/api/handle" language="nl-NL" speechTimeout="auto" timeout="10">
    <Play>https://codeclinic.nl/api/tts/stream?text=${greetingText}</Play>
  </Gather>
  <Play>https://codeclinic.nl/api/tts/stream?text=${fallbackText}</Play>
  <Hangup/>
</Response>`;
  return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
} 