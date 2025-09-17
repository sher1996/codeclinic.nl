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

type Appointment = {
  name: string;
  email: string;
  date: string;   // ISO yyyy-mm-dd
  time: string;   // HH:mm
  address: string;
  bookingId?: string; // Optional booking ID from database
  appointmentType?: 'onsite' | 'remote'; // New field for appointment type
};

export async function POST(req: Request) {
  console.log('[send-email] called');           // <- should appear in 'vercel dev' or server logs
  
  let data: Appointment;

  try {
    data = await req.json();
    console.log('[send-email] received data:', data);
  } catch {
    console.log('[send-email] Invalid JSON body');
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  // Basic server-side validation
  const { name, email, date, time, address, bookingId, appointmentType = 'onsite' } = data;
  if (!name || !email || !date || !time || !address) {
    console.log('[send-email] Missing required fields:', { name, email, date, time, address });
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 422 },
    );
  }

  // Check if Gmail credentials are configured
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('[send-email] Gmail credentials not configured');
    return NextResponse.json(
      { ok: false, error: "Email service not configured" },
      { status: 500 },
    );
  }

  // Compose different emails based on appointment type
  let userSubject: string;
  let userHtml: string;
  let userText: string;

  if (appointmentType === 'remote') {
    userSubject = "🎯 Code Clinic VIP - Bevestiging Remote Afspraak";
    userHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0000FF 0%, #4169E1 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🎯 Code Clinic VIP</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Premium Computer Hulp Service</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
          <h2 style="color: #333; margin-top: 0;">Beste ${name},</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0000FF;">
            <p style="margin: 0 0 15px 0; color: #0000FF; font-weight: bold;">✅ Uw VIP afspraak is bevestigd!</p>
            <p style="margin: 0 0 15px 0;">Bedankt voor het boeken van uw <strong>remote computerhulp</strong> afspraak op <strong>${date}</strong> om <strong>${time}</strong>.</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
            <h3 style="color: #0000FF; margin-top: 0;">📋 Stap-voor-stap instructies:</h3>
            
            <div style="margin: 15px 0;">
              <h4 style="color: #333; margin: 10px 0 5px 0;">Stap 1 – Download TeamViewer QuickSupport</h4>
              <p style="margin: 5px 0;">Klik op de onderstaande, veilige link. Het programma hoeft niet geïnstalleerd te worden; kies gewoon 'Uitvoeren'.</p>
              <p style="margin: 5px 0;">▸ <a href="https://download.teamviewer.com/download/TeamViewerQS_x64.exe" style="color: #0000FF; text-decoration: none;">https://download.teamviewer.com/download/TeamViewerQS_x64.exe</a></p>
            </div>
            
            <div style="margin: 15px 0;">
              <h4 style="color: #333; margin: 10px 0 5px 0;">Stap 2 – Start het programma</h4>
              <p style="margin: 5px 0;">Dubbelklik op het gedownloade bestand om TeamViewer te starten.</p>
            </div>
            
            <div style="margin: 15px 0;">
              <h4 style="color: #333; margin: 10px 0 5px 0;">Stap 3 – Wij maken verbinding</h4>
              <p style="margin: 5px 0;">Op het afgesproken tijdstip maken wij verbinding en lossen we uw probleem op.</p>
            </div>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;"><strong>📞 Hulp nodig?</strong></p>
            <p style="margin: 5px 0; color: #856404;">Vindt u het downloaden of starten van het programma lastig? WhatsApp ons gerust op <strong><a href="https://wa.me/31624837889" target="_blank" rel="noopener noreferrer" style="color: #0000FF;">0624837889</a></strong> – we helpen u stap voor stap verder.</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
            <h3 style="color: #0000FF; margin-top: 0;">📋 Afspraak Details</h3>
            <p style="margin: 5px 0;"><strong>Type:</strong> Remote Computer Hulp 💻</p>
            <p style="margin: 5px 0;"><strong>Datum:</strong> ${date}</p>
            <p style="margin: 5px 0;"><strong>Tijd:</strong> ${time}</p>
            <p style="margin: 5px 0;"><strong>Adres administratie:</strong> ${address}</p>
            ${bookingId ? `<p style="margin: 5px 0;"><strong>Boekingsnummer:</strong> ${bookingId}</p>` : ''}
          </div>
          
          <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #0c5460;"><strong>🎯 Code Clinic VIP Service:</strong></p>
            <ul style="margin: 10px 0 0 0; color: #0c5460;">
              <li>Premium computer hulp service</li>
              <li>Snelle en professionele ondersteuning</li>
              <li>Direct contact via WhatsApp: <strong>0624837889</strong></li>
            </ul>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Deze bevestiging werd automatisch verzonden door het Code Clinic VIP boekingssysteem.
          </p>
        </div>
      </div>
    `;
    userText = `🎯 Code Clinic VIP - Bevestiging Remote Afspraak

Beste ${name},

✅ Uw VIP afspraak is bevestigd!

Bedankt voor het boeken van uw remote computerhulp afspraak op ${date} om ${time}.

📋 Stap-voor-stap instructies:

Stap 1 – Download TeamViewer QuickSupport
Klik op de onderstaande, veilige link. Het programma hoeft niet geïnstalleerd te worden; kies gewoon 'Uitvoeren'.
▸ https://download.teamviewer.com/download/TeamViewerQS_x64.exe

Stap 2 – Start het programma
Dubbelklik op het gedownloade bestand om TeamViewer te starten.

Stap 3 – Wij maken verbinding
Op het afgesproken tijdstip maken wij verbinding en lossen we uw probleem op.

📞 Hulp nodig?
Vindt u het downloaden of starten van het programma lastig? WhatsApp ons gerust op 0624837889 – we helpen u stap voor stap verder.

📋 Afspraak Details
Type: Remote Computer Hulp 💻
Datum: ${date}
Tijd: ${time}
Adres administratie: ${address}${bookingId ? `\nBoekingsnummer: ${bookingId}` : ''}

🎯 Code Clinic VIP Service:
- Premium computer hulp service
- Snelle en professionele ondersteuning
- Direct contact via WhatsApp: 0624837889

Deze bevestiging werd automatisch verzonden door het Code Clinic VIP boekingssysteem.

Met vriendelijke groet,
Code Clinic VIP Team`;
  } else {
    userSubject = "🏠 Code Clinic VIP - Bevestiging Aan Huis Afspraak";
    userHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0000FF 0%, #4169E1 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🏠 Code Clinic VIP</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Premium Computer Hulp Service</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
          <h2 style="color: #333; margin-top: 0;">Beste ${name},</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0000FF;">
            <p style="margin: 0 0 15px 0; color: #0000FF; font-weight: bold;">✅ Uw VIP afspraak is bevestigd!</p>
            <p style="margin: 0 0 15px 0;">Bedankt voor het boeken van uw <strong>aan huis computerhulp</strong> afspraak op <strong>${date}</strong> om <strong>${time}</strong>.</p>
            <p style="margin: 0;">Wij komen bij u langs op het opgegeven adres voor professionele computerhulp.</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
            <h3 style="color: #0000FF; margin-top: 0;">📋 Afspraak Details</h3>
            <p style="margin: 5px 0;"><strong>Type:</strong> Aan Huis Computer Hulp 🏠</p>
            <p style="margin: 5px 0;"><strong>Datum:</strong> ${date}</p>
            <p style="margin: 5px 0;"><strong>Tijd:</strong> ${time}</p>
            <p style="margin: 5px 0;"><strong>Adres:</strong> ${address}</p>
            ${bookingId ? `<p style="margin: 5px 0;"><strong>Boekingsnummer:</strong> ${bookingId}</p>` : ''}
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;"><strong>📞 Contact & Hulp:</strong></p>
            <p style="margin: 5px 0; color: #856404;">Heeft u vragen of moet u de afspraak wijzigen? WhatsApp ons gerust op <strong><a href="https://wa.me/31624837889" target="_blank" rel="noopener noreferrer" style="color: #0000FF;">0624837889</a></strong>.</p>
          </div>
          
          <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #0c5460;"><strong>🎯 Code Clinic VIP Service:</strong></p>
            <ul style="margin: 10px 0 0 0; color: #0c5460;">
              <li>Premium computer hulp service aan huis</li>
              <li>Snelle en professionele ondersteuning</li>
              <li>Direct contact via WhatsApp: <strong>0624837889</strong></li>
              <li>Wij komen op het afgesproken tijdstip</li>
            </ul>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Deze bevestiging werd automatisch verzonden door het Code Clinic VIP boekingssysteem.
          </p>
        </div>
      </div>
    `;
    userText = `🏠 Code Clinic VIP - Bevestiging Aan Huis Afspraak

Beste ${name},

✅ Uw VIP afspraak is bevestigd!

Bedankt voor het boeken van uw aan huis computerhulp afspraak op ${date} om ${time}.
Wij komen bij u langs op het opgegeven adres voor professionele computerhulp.

📋 Afspraak Details
Type: Aan Huis Computer Hulp 🏠
Datum: ${date}
Tijd: ${time}
Adres: ${address}${bookingId ? `\nBoekingsnummer: ${bookingId}` : ''}

📞 Contact & Hulp
Heeft u vragen of moet u de afspraak wijzigen? WhatsApp ons gerust op 0624837889.

🎯 Code Clinic VIP Service:
- Premium computer hulp service aan huis
- Snelle en professionele ondersteuning
- Direct contact via WhatsApp: 0624837889
- Wij komen op het afgesproken tijdstip

Deze bevestiging werd automatisch verzonden door het Code Clinic VIP boekingssysteem.

Met vriendelijke groet,
Code Clinic VIP Team`;
  }

  console.log('[send-email] Sending email to:', email);

  try {
    // Use Gmail SMTP instead of Resend
    const transporter = createTransporter();
    const result = await transporter.sendMail({
      from: `"Code Clinic VIP" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: userSubject,
      html: userHtml,
      text: userText,
    });

    console.log('[send-email] Email sent successfully:', result.messageId);
    return NextResponse.json({ ok: true, message: "Email sent successfully", messageId: result.messageId });
  } catch (error: unknown) {
    console.error('[send-email] Gmail error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { ok: false, error: "Mail service failed", details: errorMessage },
      { status: 502 },
    );
  }
} 