import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  console.log('[test-resend] Testing email service...');

  // Check if RESEND_API_KEY is configured
  if (!process.env.RESEND_API_KEY) {
    console.error('[test-resend] RESEND_API_KEY not configured');
    return NextResponse.json(
      { ok: false, error: "RESEND_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const result = await resend.emails.send({
      from: "Test Bot <onboarding@resend.dev>",
      to: "delivered@resend.dev",
      subject: "Test Email from Computer Help",
      html: "<p>This is a test email to verify the email service is working.</p>",
      text: "This is a test email to verify the email service is working.",
    });

    console.log('[test-resend] Success:', result);
    return NextResponse.json({ ok: true, message: "Test email sent successfully", result });
  } catch (error: unknown) {
    console.error('[test-resend] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { ok: false, error: "Email service test failed", details: errorMessage },
      { status: 502 }
    );
  }
} 