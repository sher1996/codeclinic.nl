import { NextResponse } from 'next/server';

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
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 422 },
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

  // Hit Resend's HTTP API with fetch
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Test Bot <onboarding@resend.dev>",
      to: "delivered@resend.dev",
      subject: "Bevestiging van uw afspraak",
      html,
      text: `Beste ${name},\n\nBedankt voor het boeken van uw afspraak op ${date} om ${time}.\nAdres: ${address}${bookingId ? `\nBoekingsnummer: ${bookingId}` : ''}\n\nTot ziens!`,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Resend error:", errorText);
    return NextResponse.json(
      { ok: false, error: "Mail service failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
} 