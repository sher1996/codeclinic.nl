import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  console.log('[test-admin-email] Testing admin email notification');
  
  // Check if required environment variables are set
  if (!process.env.RESEND_API_KEY) {
    console.error('[test-admin-email] RESEND_API_KEY not configured');
    return NextResponse.json(
      { ok: false, error: "RESEND_API_KEY not configured" },
      { status: 500 }
    );
  }

  if (!process.env.ADMIN_EMAIL) {
    console.error('[test-admin-email] ADMIN_EMAIL not configured');
    return NextResponse.json(
      { ok: false, error: "ADMIN_EMAIL not configured" },
      { status: 500 }
    );
  }

  try {
    const testBooking = {
      name: "Test Klant",
      email: "test@example.com",
      phone: "0612345678",
      date: "2024-12-25",
      time: "10:00",
      notes: "Dit is een test afspraak",
      id: "test-" + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const html = `
      <h2>Test: Nieuwe afspraak geboekt!</h2>
      <p>Dit is een test email om te controleren of de admin notificaties werken.</p>
      <p><strong>Naam:</strong> ${testBooking.name}</p>
      <p><strong>Email:</strong> ${testBooking.email}</p>
      <p><strong>Telefoon:</strong> ${testBooking.phone}</p>
      <p><strong>Datum:</strong> ${testBooking.date}</p>
      <p><strong>Tijd:</strong> ${testBooking.time}</p>
      <p><strong>Notities:</strong> ${testBooking.notes}</p>
      <p><strong>Boekingsnummer:</strong> ${testBooking.id}</p>
      <p><strong>Geboekt op:</strong> ${new Date(testBooking.createdAt).toLocaleString('nl-NL')}</p>
    `;

    const result = await resend.emails.send({
      from: "Computer Help <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL,
      subject: `Test: Nieuwe afspraak - ${testBooking.name} - ${testBooking.date} om ${testBooking.time}`,
      html,
      text: `Test: Nieuwe afspraak geboekt!\n\nDit is een test email om te controleren of de admin notificaties werken.\n\nNaam: ${testBooking.name}\nEmail: ${testBooking.email}\nTelefoon: ${testBooking.phone}\nDatum: ${testBooking.date}\nTijd: ${testBooking.time}\nNotities: ${testBooking.notes}\nBoekingsnummer: ${testBooking.id}\nGeboekt op: ${new Date(testBooking.createdAt).toLocaleString('nl-NL')}`,
    });

    console.log('[test-admin-email] Test email sent successfully:', result);
    return NextResponse.json({ 
      ok: true, 
      message: "Test admin email sent successfully", 
      result,
      adminEmail: process.env.ADMIN_EMAIL 
    });
  } catch (error: unknown) {
    console.error('[test-admin-email] Failed to send test email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { ok: false, error: "Failed to send test email", details: errorMessage },
      { status: 500 }
    );
  }
} 