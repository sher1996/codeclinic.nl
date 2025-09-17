import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
let supabase: any = null;

// Initialize Supabase connection
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function GET() {
  console.log('[keepalive] === KEEP-ALIVE REQUEST START ===');
  console.log('[keepalive] Timestamp:', new Date().toISOString());
  
  try {
    if (!supabase) {
      console.log('[keepalive] Supabase not configured, returning fallback response');
      return NextResponse.json({ 
        ok: true, 
        message: 'Keep-alive endpoint active (Supabase not configured)',
        timestamp: new Date().toISOString(),
        supabase_configured: false
      });
    }

    // Perform a simple query to keep Supabase active
    console.log('[keepalive] Performing Supabase ping...');
    const { data, error } = await supabase
      .from('bookings')
      .select('count')
      .limit(1);

    if (error) {
      console.error('[keepalive] Supabase ping failed:', error);
      return NextResponse.json({ 
        ok: false, 
        error: 'Supabase ping failed',
        details: error.message,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    console.log('[keepalive] Supabase ping successful');
    return NextResponse.json({ 
      ok: true, 
      message: 'Supabase keep-alive successful',
      timestamp: new Date().toISOString(),
      supabase_configured: true,
      bookings_count: data?.[0]?.count || 0
    });

  } catch (error) {
    console.error('[keepalive] Keep-alive request failed:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Keep-alive request failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Also support POST for external cron services
export async function POST() {
  return GET();
}
