const WS_URL = process.env.WS_URL || 'ws://localhost:8765/ws';   // dev default

export async function GET() {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <ConversationRelay
      url="${WS_URL.replace('http', 'ws')}"
      language="nl-NL"
      ttsProvider="ElevenLabs"
      voice="UgBBYS2sOqTuMpoF3BR0"
      welcomeGreeting="Hi! I'm Sam, your CodeClinic assistant. How can I help you today?" />
  </Connect>
</Response>`, {
    headers: { 'Content-Type': 'text/xml' },
  });
} 