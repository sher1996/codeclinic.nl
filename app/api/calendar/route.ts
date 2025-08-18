import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

// Import Upstash Redis
import { Redis } from '@upstash/redis';
import { Booking, AtomicBookingResult } from '@/types/booking';

// Initialize Redis with error handling
let redis: Redis | null = null;
let resend: Resend | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } else {
    console.warn('[calendar] Redis credentials not configured');
  }
} catch (error) {
  console.error('[calendar] Failed to initialize Redis:', error);
}

try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  } else {
    console.warn('[calendar] Resend API key not configured');
  }
} catch (error) {
  console.error('[calendar] Failed to initialize Resend:', error);
}

// Validation schema for booking data
const bookingSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address').max(255, 'Email is too long'),
  phone: z.string().min(1, 'Phone number is required').max(20, 'Phone number is too long'),
  date: z.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-3]0$/, 'Invalid time format (HH:30 or HH:00)'),
  notes: z.string().max(1000, 'Notes are too long').optional(),
  appointmentType: z.enum(['onsite', 'remote']).default('onsite'),
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

// Helper to validate date is not in the past (uses local timezone)
function isValidDate(date: string): boolean {
  // Parse booking date as local date
  const [year, month, day] = date.split('-').map(Number);
  const bookingDate = new Date(year, month - 1, day);

  // Get tomorrow's date in local time
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  // Format both as YYYY-MM-DD
  const pad = (n: number) => n.toString().padStart(2, '0');
  const bookingStr = `${bookingDate.getFullYear()}-${pad(bookingDate.getMonth() + 1)}-${pad(bookingDate.getDate())}`;
  const tomorrowStr = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;

  return bookingStr >= tomorrowStr;
}

// Atomic booking function using Redis transactions
async function atomicBookSlot(bookingData: Booking): Promise<AtomicBookingResult> {
  if (!redis) {
    return { success: false, error: 'Database not configured' };
  }
  
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
        appointmentType = ARGV[7],
        id = ARGV[8],
        createdAt = ARGV[9],
        updatedAt = ARGV[10]
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
      bookingData.appointmentType || 'onsite',
      bookingData.id,
      bookingData.createdAt,
      bookingData.updatedAt
    ]);

    // Handle the result which can be either a string or object
    if (typeof result === 'string') {
      return JSON.parse(result);
    } else if (typeof result === 'object' && result !== null) {
      // If it's already an object, return it directly
      return result as AtomicBookingResult;
    } else {
      throw new Error(`Unexpected result type from Redis eval: ${typeof result}`);
    }
  } catch (error) {
    console.error('[calendar] Atomic booking failed:', error);
    return { success: false, error: 'Booking failed' };
  }
}

// Function to send admin notification email
async function sendAdminNotification(booking: Booking) {
  if (!process.env.ADMIN_EMAIL || !resend) {
    console.log('[calendar] Admin email not configured or Resend not initialized, skipping notification');
    return;
  }

  try {
    const appointmentType = booking.appointmentType || 'onsite';
    const typeText = appointmentType === 'remote' ? 'Remote hulp' : 'Aan huis bezoek';
    const typeEmoji = appointmentType === 'remote' ? '💻' : '🏠';
    
    const html = `
      <h2>${typeEmoji} Nieuwe afspraak geboekt - ${typeText}!</h2>
      <p><strong>Type:</strong> ${typeText}</p>
      <p><strong>Naam:</strong> ${booking.name}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Telefoon:</strong> ${booking.phone}</p>
      <p><strong>Datum:</strong> ${booking.date}</p>
      <p><strong>Tijd:</strong> ${booking.time}</p>
      <p><strong>Notities:</strong> ${booking.notes || 'Geen notities'}</p>
      <p><strong>Boekingsnummer:</strong> ${booking.id}</p>
      <p><strong>Geboekt op:</strong> ${new Date(booking.createdAt).toLocaleString('nl-NL')}</p>
    `;

    await resend.emails.send({
      from: "Computer Help <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL,
      subject: `${typeEmoji} Nieuwe ${typeText}: ${booking.name} - ${booking.date} om ${booking.time}`,
      html,
      text: `${typeEmoji} Nieuwe afspraak geboekt - ${typeText}!\n\nType: ${typeText}\nNaam: ${booking.name}\nEmail: ${booking.email}\nTelefoon: ${booking.phone}\nDatum: ${booking.date}\nTijd: ${booking.time}\nNotities: ${booking.notes || 'Geen notities'}\nBoekingsnummer: ${booking.id}\nGeboekt op: ${new Date(booking.createdAt).toLocaleString('nl-NL')}`,
    });

    console.log('[calendar] Admin notification sent successfully');
  } catch (error: unknown) {
    console.error('[calendar] Failed to send admin notification:', error);
    // Don't fail the booking if admin notification fails
  }
}

export async function GET() {
  if (!redis) {
    return NextResponse.json({ 
      ok: false, 
      error: 'Database not configured',
      timeSlots: generateTimeSlots(),
      bookings: []
    }, { status: 503 });
  }
  
  const rawBookings = await redis.lrange('bookings', 0, -1);
  const bookings: Booking[] = [];
  for (const b of rawBookings) {
    try {
      // Check if it's already an object or needs parsing
      let booking: Booking;
      if (typeof b === 'string') {
        booking = JSON.parse(b);
      } else {
        booking = b as Booking;
      }
      bookings.push(booking);
    } catch {
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
    console.log('[calendar] Received booking data:', data);
    
    const validated = bookingSchema.parse(data);
    console.log('[calendar] Validated data:', validated);
    
    if (!isValidDate(validated.date)) {
      console.log('[calendar] Date validation failed for:', validated.date);
      return NextResponse.json({ ok: false, error: 'Bookings must be made at least one day in advance' }, { status: 400 });
    }

    // Add a unique ID and timestamps
    const booking: Booking = {
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

    // Send admin notification email
    if (result.booking) {
      await sendAdminNotification(result.booking);
    }

    return NextResponse.json({ ok: true, booking: result.booking }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: 'Invalid data', details: err.errors }, { status: 400 });
    }
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: 'Server error', details: errorMessage }, { status: 500 });
  }
} 