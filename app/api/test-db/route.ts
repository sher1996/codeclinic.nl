import { NextResponse } from 'next/server';

export async function GET() {
  console.log('[test-db] Testing database connection...');

  try {
    // Import prisma dynamically to avoid potential issues
    const { prisma } = await import('@/lib/prisma');
    
    // Test database connection by counting bookings
    const count = await prisma.booking.count();
    console.log('[test-db] Database connection successful, booking count:', count);
    
    return NextResponse.json({ 
      ok: true, 
      message: "Database connection successful",
      bookingCount: count
    });
  } catch (error: any) {
    console.error('[test-db] Database connection failed:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json({ 
      ok: false, 
      error: "Database connection failed",
      details: error.message
    }, { status: 500 });
  }
} 