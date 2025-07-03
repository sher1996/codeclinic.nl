import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    keyPresent: Boolean(process.env.OPENAI_API_KEY),
    promptChars: (process.env.SYSTEM_PROMPT || '').length,
    wsUrl: process.env.WS_URL,
  });
} 