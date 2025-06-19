import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for booking data
const bookingSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address').max(255, 'Email is too long'),
  phone: z.string().min(1, 'Phone number is required').max(20, 'Phone number is too long'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-3]0$/, 'Invalid time format (HH:30 or HH:00)'),
  notes: z.string().max(1000, 'Notes are too long').optional(),
});

// Generate all 30-minute slots from 09:00 to 16:00
function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 9; h <= 16; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
}

// Helper to check if a time slot is available
async function isTimeSlotAvailable(date: string, time: string): Promise<boolean> {
  const bookingDate = new Date(date);
  const [hours, minutes] = time.split(':').map(Number);
  bookingDate.setHours(hours, minutes, 0, 0);

  const existing = await prisma.booking.findFirst({
    where: { 
      date: bookingDate,
      time: time
    }
  });
  return !existing;
}

// Helper to validate date is not in the past
function isValidDate(date: string): boolean {
  // Parse the date string and create a date object
  const [year, month, day] = date.split('-').map(Number);
  const bookingDate = new Date(year, month - 1, day); // month is 0-indexed
  
  // Create today's date
  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  console.log('[calendar] Validating date:', {
    inputDate: date,
    bookingDate: bookingDate.toISOString(),
    todayDate: todayDate.toISOString(),
    isValid: bookingDate >= todayDate
  });
  
  return bookingDate >= todayDate;
}

export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  if (auth !== process.env.CALENDAR_API_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    orderBy: { date: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      date: true,
      time: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  return NextResponse.json({
    ok: true,
    timeSlots: generateTimeSlots(),
    bookings: bookings.map(b => ({
      id: b.id,
      name: b.name,
      email: b.email,
      phone: b.phone,
      date: b.date.toISOString().split('T')[0],
      time: b.time,
      notes: b.notes,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    })),
  });
}

export async function POST(request: Request) {
  // Allow public access for creating bookings (no auth required)
  // GET requests still require authorization for admin access

  try {
    const data = await request.json();
    console.log('[calendar] Received booking data:', data);
    
    const validated = bookingSchema.parse(data);
    console.log('[calendar] Validated data:', validated);

    if (!isValidDate(validated.date)) {
      console.log('[calendar] Date validation failed for:', validated.date);
      return NextResponse.json({ ok: false, error: 'Cannot book in the past' }, { status: 400 });
    }

    console.log('[calendar] Date validation passed for:', validated.date);

    const [h, m] = validated.time.split(':').map(Number);
    const startTime = new Date(validated.date);
    startTime.setHours(h, m, 0, 0);
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + 30);

    console.log('[calendar] Checking time slot availability...');
    if (!(await isTimeSlotAvailable(validated.date, validated.time))) {
      return NextResponse.json({ ok: false, error: 'Slot already booked' }, { status: 409 });
    }

    console.log('[calendar] Creating booking in database...');
    const booking = await prisma.booking.create({ data: {
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      date: startTime,
      time: validated.time,
      notes: validated.notes,
    }});

    console.log('[calendar] Booking created successfully:', booking);

    return NextResponse.json({
      ok: true,
      booking: {
        id: booking.id,
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        date: booking.date.toISOString().split('T')[0],
        time: booking.time,
        notes: booking.notes,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      }
    }, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      console.log('[calendar] Validation error:', err.errors);
      return NextResponse.json({ ok: false, error: 'Invalid data', details: err.errors }, { status: 400 });
    }
    
    // Log the full error details
    console.error('[calendar] POST error details:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    
    return NextResponse.json({ 
      ok: false, 
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Database connection failed'
    }, { status: 500 });
  }
} 