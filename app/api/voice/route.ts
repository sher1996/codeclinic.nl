const WS_URL = process.env.WS_URL || 'ws://localhost:8765/ws';   // dev default

export async function GET() {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <ConversationRelay
      url="${WS_URL.replace('http', 'ws')}"
      language="nl-NL"
      ttsProvider="ElevenLabs"
      voice="XJa38TJgDqYhj5mYbSJA"
      welcomeGreeting="Hoi, ik ben Sam van CodeClinic. Waarmee kan ik helpen?" />
  </Connect>
</Response>`, {
    headers: { 'Content-Type': 'text/xml' },
  });
} 