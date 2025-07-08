import { NextResponse } from "next/server";

export function GET() {
  const twiml = `
<Response>
  <Gather input="speech" action="/api/handle" language="nl-NL" speechTimeout="auto">
    <Say language="nl-NL">Hallo! Ik ben Sam van CodeClinic. Hoe kan ik u vandaag helpen?</Say>
  </Gather>
  <Say language="nl-NL">Sorry, ik hoorde u niet duidelijk. Probeer het nog eens.</Say>
  <Hangup/>
</Response>`;
  return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
} 