import { NextResponse } from 'next/server';

export async function GET() {
  const envCheck = {
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
  };

  const missingVars = Object.entries(envCheck)
    .filter(([_, exists]) => !exists)
    .map(([key, _]) => key);

  if (missingVars.length > 0) {
    return NextResponse.json({
      ok: false,
      error: "Missing environment variables",
      missing: missingVars,
      envCheck
    }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    message: "All required environment variables are configured",
    envCheck
  });
} 