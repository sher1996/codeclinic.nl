import { NextResponse } from 'next/server';

type WhatsAppClickData = {
  page: string;
  userAgent?: string;
  timestamp: string;
  ip?: string;
  referrer?: string;
};

export async function POST(req: Request) {
  console.log('[whatsapp-notify] Notification received');
  
  let data: WhatsAppClickData;

  try {
    data = await req.json();
    console.log('[whatsapp-notify] received data:', data);
  } catch {
    console.log('[whatsapp-notify] Invalid JSON body');
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const { page, timestamp, ip, referrer } = data;

  // Check if WhatsApp API credentials are configured
  if (!process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID || !process.env.ADMIN_WHATSAPP_NUMBER) {
    console.error('[whatsapp-notify] WhatsApp API credentials not configured');
    return NextResponse.json(
      { ok: false, error: "WhatsApp API not configured" },
      { status: 500 },
    );
  }

  // Format the message
  const message = `🔔 *WhatsApp Click Notification*

Someone clicked on your WhatsApp link!

📍 *Page:* ${page}
⏰ *Time:* ${new Date(timestamp).toLocaleString('nl-NL')}
${ip ? `🌐 *IP:* ${ip}` : ''}
${referrer ? `🔗 *From:* ${referrer}` : ''}

💡 *Tip:* This person is interested in your services and may contact you via WhatsApp soon!

---
Computer Help Notification System`;

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: process.env.ADMIN_WHATSAPP_NUMBER,
          type: 'text',
          text: {
            body: message
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('[whatsapp-notify] WhatsApp API error:', response.status, errorData);
      return NextResponse.json(
        { ok: false, error: "WhatsApp API failed", details: errorData },
        { status: 502 },
      );
    }

    const result = await response.json();
    console.log('[whatsapp-notify] WhatsApp message sent successfully:', result);
    return NextResponse.json({ ok: true, message: "WhatsApp notification sent successfully" });
  } catch (error: unknown) {
    console.error('[whatsapp-notify] WhatsApp API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { ok: false, error: "WhatsApp notification failed", details: errorMessage },
      { status: 502 },
    );
  }
}
