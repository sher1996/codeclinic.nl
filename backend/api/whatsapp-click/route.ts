import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create Gmail SMTP transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

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

  // Check if Gmail credentials are configured
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('[whatsapp-click] Gmail credentials not configured');
    return NextResponse.json(
      { ok: false, error: "Email service not configured" },
      { status: 500 },
    );
  }

  // Get your email from environment variable
  const adminEmail = process.env.ADMIN_EMAIL || 'codeclinic.nl@gmail.com';
  
  const subject = "🔔 WhatsApp Click Notification - Code Clinic VIP";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0000FF 0%, #4169E1 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">🔔 WhatsApp Click Alert</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Code Clinic VIP</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #333; margin-top: 0;">Iemand heeft op uw WhatsApp link geklikt!</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0000FF;">
          <h3 style="color: #0000FF; margin-top: 0;">📋 Click Details:</h3>
          <p style="margin: 5px 0;"><strong>Pagina:</strong> ${page}</p>
          <p style="margin: 5px 0;"><strong>Tijd:</strong> ${new Date(timestamp).toLocaleString('nl-NL')}</p>
          ${ip ? `<p style="margin: 5px 0;"><strong>IP Adres:</strong> ${ip}</p>` : ''}
          ${referrer ? `<p style="margin: 5px 0;"><strong>Referrer:</strong> ${referrer}</p>` : ''}
          ${userAgent ? `<p style="margin: 5px 0;"><strong>User Agent:</strong> ${userAgent}</p>` : ''}
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; color: #856404;"><strong>💡 Tip:</strong> Deze persoon is geïnteresseerd in uw services en kan u binnenkort via WhatsApp contacteren!</p>
        </div>
        
        <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; color: #0c5460;"><strong>📞 WhatsApp Contact:</strong></p>
          <p style="margin: 5px 0; color: #0c5460;">Uw WhatsApp nummer: <strong>0624837889</strong></p>
          <p style="margin: 5px 0; color: #0c5460;">Zorg ervoor dat u beschikbaar bent voor nieuwe klanten!</p>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Deze notificatie werd automatisch verzonden door het Code Clinic VIP systeem.
        </p>
      </div>
    </div>
  `;

  const text = `🔔 WhatsApp Click Notification - Code Clinic VIP

Iemand heeft op uw WhatsApp link geklikt!

📋 Click Details:
- Pagina: ${page}
- Tijd: ${new Date(timestamp).toLocaleString('nl-NL')}
${ip ? `- IP Adres: ${ip}` : ''}
${referrer ? `- Referrer: ${referrer}` : ''}
${userAgent ? `- User Agent: ${userAgent}` : ''}

💡 Tip: Deze persoon is geïnteresseerd in uw services en kan u binnenkort via WhatsApp contacteren!

📞 WhatsApp Contact:
Uw WhatsApp nummer: 0624837889
Zorg ervoor dat u beschikbaar bent voor nieuwe klanten!

Deze notificatie werd automatisch verzonden door het Code Clinic VIP systeem.`;

  try {
    const transporter = createTransporter();
    const result = await transporter.sendMail({
      from: `"Code Clinic VIP Notifications" <${process.env.GMAIL_USER}>`,
      to: adminEmail,
      subject: subject,
      html: html,
      text: text,
    });

    console.log('[whatsapp-click] Notification sent successfully:', result.messageId);
    return NextResponse.json({ ok: true, message: "Notification sent successfully", messageId: result.messageId });
  } catch (error: unknown) {
    console.error('[whatsapp-click] Gmail error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { ok: false, error: "Notification service failed", details: errorMessage },
      { status: 502 },
    );
  }
}
