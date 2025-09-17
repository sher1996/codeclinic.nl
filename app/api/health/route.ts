import { NextResponse } from 'next/server';

export async function GET() {
  console.log('[health] === HEALTH CHECK REQUEST START ===');
  console.log('[health] Timestamp:', new Date().toISOString());
  
  try {
    const healthData = {
      ok: true,
      message: 'Service is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        supabase: {
          configured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
          url: process.env.SUPABASE_URL ? 'Set' : 'Not set'
        },
        gmail: {
          configured: !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD),
          user: process.env.GMAIL_USER ? 'Set' : 'Not set'
        }
      }
    };

    console.log('[health] Health check successful');
    return NextResponse.json(healthData);

  } catch (error) {
    console.error('[health] Health check failed:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
