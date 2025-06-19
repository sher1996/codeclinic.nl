import { NextResponse } from 'next/server';
import { z } from 'zod';

// Import Upstash Redis
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Validation schema for booking data
const bookingSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address').max(255, 'Email is too long'),
  phone: z.string().min(1, 'Phone number is required').max(20, 'Phone number is too long'),
  date: z.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, 'Invalid date format (YYYY-MM-DD)'),
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
  const bookings = (await redis.lrange('bookings', 0, -1)).map((b: string) => JSON.parse(b));
  return !bookings.some((b: any) => b.date === date && b.time === time);
}

// Helper to validate date is not in the past
function isValidDate(date: string): boolean {
  const [year, month, day] = date.split('-').map(Number);
  const bookingDate = new Date(year, month - 1, day);
  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return bookingDate >= todayDate;
}

export async function GET(request: Request) {
  // Optionally, add admin auth here
  const bookings = (await redis.lrange('bookings', 0, -1)).map((b: string) => JSON.parse(b));
  return NextResponse.json({
    ok: true,
    timeSlots: generateTimeSlots(),
    bookings,
  });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validated = bookingSchema.parse(data);
    if (!isValidDate(validated.date)) {
      return NextResponse.json({ ok: false, error: 'Cannot book in the past' }, { status: 400 });
    }
    if (!(await isTimeSlotAvailable(validated.date, validated.time))) {
      return NextResponse.json({ ok: false, error: 'Slot already booked' }, { status: 409 });
    }
    // Add a unique ID and timestamps
    const booking = {
      ...validated,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await redis.rpush('bookings', JSON.stringify(booking));
    return NextResponse.json({ ok: true, booking }, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: 'Invalid data', details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: 'Server error', details: err.message }, { status: 500 });
  }
} 