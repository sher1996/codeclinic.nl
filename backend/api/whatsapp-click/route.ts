import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type WhatsAppClickData = {
  page: string;
  userAgent?: string;
  timestamp: string;
  ip?: string;
  referrer?: string;
};

export async function POST(req: Request) {
  console.log('[whatsapp-click] Notification received');
  
  let data: WhatsAppClickData;

  try {
    data = await req.json();
    console.log('[whatsapp-click] received data:', data);
  } catch {
    console.log('[whatsapp-click] Invalid JSON body');
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const { page, userAgent, timestamp, ip, referrer } = data;

  // Check if RESEND_API_KEY is configured
  if (!process.env.RESEND_API_KEY) {
    console.error('[whatsapp-click] RESEND_API_KEY not configured');
    return NextResponse.json(
      { ok: false, error: "Email service not configured" },
      { status: 500 },
    );
  }

  // Get your email from environment variable
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@computer-help.nl';
  
  const subject = "🔔 WhatsApp Click Notification - Computer Help";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0066cc;">WhatsApp Click Notification</h2>
      <p>Someone clicked on your WhatsApp link!</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Click Details:</h3>
        <p><strong>Page:</strong> ${page}</p>
        <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString('nl-NL')}</p>
        ${ip ? `<p><strong>IP Address:</strong> ${ip}</p>` : ''}
        ${referrer ? `<p><strong>Referrer:</strong> ${referrer}</p>` : ''}
        ${userAgent ? `<p><strong>User Agent:</strong> ${userAgent}</p>` : ''}
      </div>
      
      <div style="background-color: #e8f4fd; padding: 15px; border-radius: 8px; border-left: 4px solid #0066cc;">
        <p style="margin: 0; color: #0066cc;"><strong>💡 Tip:</strong> This person is interested in your services and may contact you via WhatsApp soon!</p>
      </div>
      
      <p style="margin-top: 20px; color: #666; font-size: 14px;">
        This notification was sent automatically when someone clicked on a WhatsApp link on your website.
      </p>
    </div>
  `;

  const text = `WhatsApp Click Notification

Someone clicked on your WhatsApp link!

Click Details:
- Page: ${page}
- Time: ${new Date(timestamp).toLocaleString('nl-NL')}
${ip ? `- IP Address: ${ip}` : ''}
${referrer ? `- Referrer: ${referrer}` : ''}
${userAgent ? `- User Agent: ${userAgent}` : ''}

💡 Tip: This person is interested in your services and may contact you via WhatsApp soon!

This notification was sent automatically when someone clicked on a WhatsApp link on your website.`;

  try {
    const result = await resend.emails.send({
      from: "Computer Help Notifications <onboarding@resend.dev>",
      to: adminEmail,
      subject: subject,
      html: html,
      text: text,
    });

    console.log('[whatsapp-click] Notification sent successfully:', result);
    return NextResponse.json({ ok: true, message: "Notification sent successfully" });
  } catch (error: unknown) {
    console.error('[whatsapp-click] Resend error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { ok: false, error: "Notification service failed", details: errorMessage },
      { status: 502 },
    );
  }
}
