import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Environment test endpoint",
    env: {
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasAdminEmail: !!process.env.ADMIN_EMAIL,
      hasRedisUrl: !!process.env.UPSTASH_REDIS_REST_URL,
      hasRedisToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    }
  });
} 