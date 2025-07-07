import { NextResponse } from "next/server";

export function GET() {
  const twiml = `
<Response>
  <Gather input="speech" action="/api/handle" language="nl-NL" speechTimeout="auto">
    <Say language="nl-NL">Hoi, ik ben Sam. Waarmee kan ik helpen?</Say>
  </Gather>
  <Say language="nl-NL">Sorry, ik hoorde niets.</Say>
  <Hangup/>
</Response>`;
  return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
} 