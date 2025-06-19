import { NextResponse } from 'next/server';

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
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Test Bot <onboarding@resend.dev>",
        to: "delivered@resend.dev",
        subject: "Test Email from Computer Help",
        html: "<p>This is a test email to verify the email service is working.</p>",
        text: "This is a test email to verify the email service is working.",
      }),
    });

    console.log('[test-resend] Response status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[test-resend] Error:', errorText);
      return NextResponse.json(
        { ok: false, error: "Email service test failed", details: errorText },
        { status: 502 }
      );
    }

    const result = await res.json();
    console.log('[test-resend] Success:', result);
    return NextResponse.json({ ok: true, message: "Test email sent successfully", result });
  } catch (error) {
    console.error('[test-resend] Network error:', error);
    return NextResponse.json(
      { ok: false, error: "Network error" },
      { status: 500 }
    );
  }
} 