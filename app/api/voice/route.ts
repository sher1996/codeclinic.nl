import { NextResponse } from "next/server";

export function GET() {
  const twiml = `
<Response>
  <Gather input="speech" action="/api/handle" language="nl-NL" speechTimeout="auto">
    <Play>https://codeclinic.nl/api/tts/stream?text=Hallo!%20Ik%20ben%20Sam%20van%20CodeClinic.%20Hoe%20kan%20ik%20u%20vandaag%20helpen?</Play>
  </Gather>
  <Play>https://codeclinic.nl/api/tts/stream?text=Sorry,%20ik%20hoorde%20u%20niet%20duidelijk.%20Probeer%20het%20nog%20eens.</Play>
  <Hangup/>
</Response>`;
  return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
} 