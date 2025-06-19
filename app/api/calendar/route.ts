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

// Helper to validate date is not in the past (uses UTC)
function isValidDate(date: string): boolean {
  const [year, month, day] = date.split('-').map(Number);
  // Booking date at midnight UTC
  const bookingDateUTC = Date.UTC(year, month - 1, day);

  // Today's date at midnight UTC
  const now = new Date();
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  // Tomorrow's date at midnight UTC
  const tomorrowUTC = todayUTC + 24 * 60 * 60 * 1000;

  return bookingDateUTC >= tomorrowUTC;
}

// Atomic booking function using Redis transactions
async function atomicBookSlot(bookingData: any): Promise<{ success: boolean; error?: string; booking?: any }> {
  try {
    // Use Redis transaction to ensure atomicity
    const result = await redis.eval(`
      -- Get all existing bookings
      local bookings = redis.call('LRANGE', 'bookings', 0, -1)
      
      -- Check if slot is already booked
      for i, booking in ipairs(bookings) do
        local bookingObj = cjson.decode(booking)
        if bookingObj.date == ARGV[1] and bookingObj.time == ARGV[2] then
          return cjson.encode({success = false, error = 'Slot already booked'})
        end
      end
      
      -- If slot is available, add the booking
      local newBooking = cjson.encode({
        name = ARGV[3],
        email = ARGV[4],
        phone = ARGV[5],
        date = ARGV[1],
        time = ARGV[2],
        notes = ARGV[6],
        id = ARGV[7],
        createdAt = ARGV[8],
        updatedAt = ARGV[9]
      })
      
      redis.call('RPUSH', 'bookings', newBooking)
      return cjson.encode({success = true, booking = cjson.decode(newBooking)})
    `, [], [
      bookingData.date,
      bookingData.time,
      bookingData.name,
      bookingData.email,
      bookingData.phone,
      bookingData.notes || '',
      bookingData.id,
      bookingData.createdAt,
      bookingData.updatedAt
    ]);

    // Handle the result which can be either a string or object
    if (typeof result === 'string') {
      return JSON.parse(result);
    } else if (typeof result === 'object' && result !== null) {
      return result as { success: boolean; error?: string; booking?: any };
    } else {
      throw new Error('Unexpected result type from Redis eval');
    }
  } catch (error) {
    console.error('[calendar] Atomic booking failed:', error);
    return { success: false, error: 'Booking failed' };
  }
}

export async function GET(request: Request) {
  const rawBookings = await redis.lrange('bookings', 0, -1);
  const bookings = [];
  for (const b of rawBookings) {
    try {
      // Check if it's already an object or needs parsing
      let booking;
      if (typeof b === 'string') {
        booking = JSON.parse(b);
      } else {
        booking = b;
      }
      bookings.push(booking);
    } catch (err) {
      console.error('[calendar] Failed to parse booking from Redis:', typeof b === 'string' ? b : JSON.stringify(b));
    }
  }
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
      return NextResponse.json({ ok: false, error: 'Bookings must be made at least one day in advance' }, { status: 400 });
    }

    // Add a unique ID and timestamps
    const booking = {
      ...validated,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Use atomic booking to prevent race conditions
    const result = await atomicBookSlot(booking);
    
    if (!result.success) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 409 });
    }

    return NextResponse.json({ ok: true, booking: result.booking }, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: 'Invalid data', details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: 'Server error', details: err.message }, { status: 500 });
  }
} 