import { NextResponse } from 'next/server';
import { z } from 'zod';

// In-memory storage for fallback mode (bookings when database is not available)
const fallbackBookings: Array<{
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  notes?: string;
  appointment_type: string;
  created_at: string;
  updated_at: string;
}> = [];

console.log('[calendar] Running in fallback mode - no database connection');

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
  const [year, month, day] = date.split('-').map(Number);
  const bookingDate = new Date(year, month - 1, day);
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  const bookingStr = `${bookingDate.getFullYear()}-${pad(bookingDate.getMonth() + 1)}-${pad(bookingDate.getDate())}`;
  const tomorrowStr = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;
  
  return bookingStr >= tomorrowStr;
}



export async function GET() {
  try {
    console.log('[calendar] GET request received');
    console.log('[calendar] Using fallback mode - no database connection');
    
    return NextResponse.json({ 
      ok: true, 
      warning: 'Database not configured - using fallback mode',
      timeSlots: generateTimeSlots(),
      bookings: fallbackBookings,
      fallback: true
    });
  } catch (error) {
    console.error('[calendar] GET request failed:', error);
    console.error('[calendar] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ 
      ok: true, 
      warning: 'Server error - using fallback mode',
      details: error instanceof Error ? error.message : 'Unknown error',
      timeSlots: generateTimeSlots(),
      bookings: fallbackBookings,
      fallback: true
    });
  }
}

export async function POST(request: Request) {
  try {
    console.log('[calendar] POST request received');
    console.log('[calendar] Using fallback mode - no database connection');
    
    const data = await request.json();
    console.log('[calendar] Received booking data:', data);
    
    const validated = bookingSchema.parse(data);
    console.log('[calendar] Validated data:', validated);
    
    if (!isValidDate(validated.date)) {
      console.log('[calendar] Date validation failed for:', validated.date);
      return NextResponse.json({ ok: false, error: 'Bookings must be made at least one day in advance' }, { status: 400 });
    }

    console.log('[calendar] Using fallback mode - storing in memory');
    
    // Check if slot is already booked in fallback storage
    const existingBooking = fallbackBookings.find(
      booking => booking.date === validated.date && booking.time === validated.time
    );
    
    if (existingBooking) {
      console.log('[calendar] Slot already booked in fallback mode:', validated.date, validated.time);
      return NextResponse.json({ ok: false, error: 'Slot already booked' }, { status: 409 });
    }
    
    // Create new booking in fallback storage
    const newBooking = {
      id: 'fallback-' + Date.now(),
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      date: validated.date,
      time: validated.time,
      notes: validated.notes || undefined,
      appointment_type: validated.appointmentType || 'onsite',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    fallbackBookings.push(newBooking);
    console.log('[calendar] Booking stored in fallback mode:', newBooking);
    
    return NextResponse.json({ 
      ok: true, 
      warning: 'Booking saved in fallback mode - will be lost on server restart',
      booking: newBooking
    }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: 'Invalid data', details: err.errors }, { status: 400 });
    }
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[calendar] POST request failed:', err);
    return NextResponse.json({ ok: false, error: 'Server error', details: errorMessage }, { status: 500 });
  }
}
