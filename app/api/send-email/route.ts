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
  const { name, email, date, time, address, bookingId } = data;
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

  // Compose the email
  const html = `
    <p>Beste ${name},</p>
    <p>Bedankt voor het boeken van uw afspraak op <strong>${date}</strong> om <strong>${time}</strong>.</p>
    <p>Adres: ${address}</p>
    ${bookingId ? `<p>Boekingsnummer: ${bookingId}</p>` : ''}
    <p>Tot ziens!</p>
  `;

  console.log('[send-email] Sending email to:', email);

  try {
    // Use Resend SDK instead of HTTP API
    const result = await resend.emails.send({
      from: "Computer Help <onboarding@resend.dev>", // Use Resend's default domain for testing
      to: email,
      subject: "Bevestiging van uw afspraak",
      html,
      text: `Beste ${name},\n\nBedankt voor het boeken van uw afspraak op ${date} om ${time}.\nAdres: ${address}${bookingId ? `\nBoekingsnummer: ${bookingId}` : ''}\n\nTot ziens!`,
    });

    console.log('[send-email] Email sent successfully:', result);
    return NextResponse.json({ ok: true, message: "Email sent successfully", result });
  } catch (error: any) {
    console.error('[send-email] Resend error:', error);
    return NextResponse.json(
      { ok: false, error: "Mail service failed", details: error.message },
      { status: 502 },
    );
  }
} 