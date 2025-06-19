import { NextResponse } from 'next/server';

export async function GET() {
  console.log('[test] Simple test endpoint called');
  
  return NextResponse.json({ 
    ok: true, 
    message: "API routing is working",
    timestamp: new Date().toISOString()
  });
} 