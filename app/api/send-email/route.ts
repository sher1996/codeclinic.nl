import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

  // Check if RESEND_API_KEY is configured
  if (!process.env.RESEND_API_KEY) {
    console.error('[send-email] RESEND_API_KEY not configured');
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
    userSubject = "Bevestiging van uw afspraak - Remote hulp";
    userHtml = `
      <p>Beste ${name},</p>
      <p>Bedankt voor het boeken van uw afspraak voor <strong>remote computerhulp</strong> op <strong>${date}</strong> om <strong>${time}</strong>.</p>
      
      <h3>Stap 1 – Download TeamViewer QuickSupport</h3>
      <p>Klik op de onderstaande, veilige link. Het programma hoeft niet geïnstalleerd te worden; kies gewoon 'Uitvoeren'.</p>
      <p>▸ <a href="https://download.teamviewer.com/download/TeamViewerQS_x64.exe" style="color: #00d4ff;">https://download.teamviewer.com/download/TeamViewerQS_x64.exe</a></p>
      
      <h3>Stap 2 – Start het programma</h3>
      <p>Dubbelklik op het gedownloade bestand om TeamViewer te starten.</p>
      
      <h3>Stap 3 – Wij maken verbinding</h3>
      <p>Op het afgesproken tijdstip maken wij verbinding en lossen we uw probleem op.</p>
      
      <h3>Hulp nodig?</h3>
      <p>Vindt u het downloaden of starten van het programma lastig? Bel ons gerust op <strong>0624837889</strong> – we helpen u stap voor stap verder.</p>
      
      <h3>Praktische gegevens</h3>
      <p><strong>Adres administratie:</strong> ${address}</p>
      ${bookingId ? `<p><strong>Boekingsnummer:</strong> ${bookingId}</p>` : ''}
      
      <p>Tot ziens!</p>
      <p>Met vriendelijke groet,<br>Computer Help</p>
    `;
    userText = `Beste ${name},

Bedankt voor het boeken van uw afspraak voor remote computerhulp op ${date} om ${time}.

Stap 1 – Download TeamViewer QuickSupport
Klik op de onderstaande, veilige link. Het programma hoeft niet geïnstalleerd te worden; kies gewoon 'Uitvoeren'.
▸ https://download.teamviewer.com/download/TeamViewerQS_x64.exe

Stap 2 – Start het programma
Dubbelklik op het gedownloade bestand om TeamViewer te starten.

Stap 3 – Wij maken verbinding
Op het afgesproken tijdstip maken wij verbinding en lossen we uw probleem op.

Hulp nodig?
Vindt u het downloaden of starten van het programma lastig? Bel ons gerust op 0624837889 – we helpen u stap voor stap verder.

Praktische gegevens
Adres administratie: ${address}${bookingId ? `\nBoekingsnummer: ${bookingId}` : ''}

Tot ziens!

Met vriendelijke groet,
Computer Help`;
  } else {
    userSubject = "Bevestiging van uw afspraak - Aan huis bezoek";
    userHtml = `
      <p>Beste ${name},</p>
      <p>Bedankt voor het boeken van uw afspraak voor <strong>aan huis computerhulp</strong> op <strong>${date}</strong> om <strong>${time}</strong>.</p>
      <p>Wij komen bij u langs op het opgegeven adres.</p>
      <p>Adres: ${address}</p>
      ${bookingId ? `<p>Boekingsnummer: ${bookingId}</p>` : ''}
      <p>Tot ziens!</p>
    `;
    userText = `Beste ${name},\n\nBedankt voor het boeken van uw afspraak voor aan huis computerhulp op ${date} om ${time}.\nWij komen bij u langs op het opgegeven adres.\nAdres: ${address}${bookingId ? `\nBoekingsnummer: ${bookingId}` : ''}\n\nTot ziens!`;
  }

  console.log('[send-email] Sending email to:', email);

  try {
    // Use Resend SDK instead of HTTP API
    const result = await resend.emails.send({
      from: "Computer Help <onboarding@resend.dev>", // Use Resend's default domain for testing
      to: email,
      subject: userSubject,
      html: userHtml,
      text: userText,
    });

    console.log('[send-email] Email sent successfully:', result);
    return NextResponse.json({ ok: true, message: "Email sent successfully", result });
  } catch (error: unknown) {
    console.error('[send-email] Resend error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { ok: false, error: "Mail service failed", details: errorMessage },
      { status: 502 },
    );
  }
} 