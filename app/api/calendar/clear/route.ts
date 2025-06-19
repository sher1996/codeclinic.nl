import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(request: Request) {
  try {
    // Clear all bookings
    await redis.del('bookings');
    
    return NextResponse.json({ 
      ok: true, 
      message: 'All bookings cleared successfully' 
    });
  } catch (error) {
    console.error('[calendar] Failed to clear bookings:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to clear bookings' 
    }, { status: 500 });
  }
} 