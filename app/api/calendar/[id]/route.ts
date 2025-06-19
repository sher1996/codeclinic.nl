import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Validation schema for booking updates
const bookingUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address').max(255, 'Email is too long'),
  phone: z.string().min(1, 'Phone number is required').max(20, 'Phone number is too long'),
  date: z.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-3]0$/, 'Invalid time format (HH:30 or HH:00)'),
  notes: z.string().max(1000, 'Notes are too long').optional(),
});

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

// Find booking by ID
async function findBookingById(bookingId: string): Promise<any | null> {
  const rawBookings = await redis.lrange('bookings', 0, -1);
  
  for (const b of rawBookings) {
    try {
      let booking;
      if (typeof b === 'string') {
        booking = JSON.parse(b);
      } else {
        booking = b;
      }
      
      if (booking.id === bookingId) {
        return booking;
      }
    } catch (err) {
      console.error('[calendar] Failed to parse booking from Redis:', err);
    }
  }
  
  return null;
}

// Update booking in Redis
async function updateBookingInRedis(bookingId: string, updatedBooking: any): Promise<boolean> {
  const rawBookings = await redis.lrange('bookings', 0, -1);
  const updatedBookings = [];
  let found = false;
  
  for (const b of rawBookings) {
    try {
      let booking;
      if (typeof b === 'string') {
        booking = JSON.parse(b);
      } else {
        booking = b;
      }
      
      if (booking.id === bookingId) {
        // Update the booking
        const newBooking = {
          ...booking,
          ...updatedBooking,
          updatedAt: new Date().toISOString()
        };
        updatedBookings.push(JSON.stringify(newBooking));
        found = true;
      } else {
        updatedBookings.push(typeof b === 'string' ? b : JSON.stringify(b));
      }
    } catch (err) {
      console.error('[calendar] Failed to parse booking from Redis:', err);
    }
  }
  
  if (!found) {
    return false;
  }
  
  // Replace all bookings with updated list
  await redis.del('bookings');
  if (updatedBookings.length > 0) {
    await redis.rpush('bookings', ...updatedBookings);
  }
  
  return true;
}

// Delete booking from Redis
async function deleteBookingFromRedis(bookingId: string): Promise<boolean> {
  const rawBookings = await redis.lrange('bookings', 0, -1);
  const remainingBookings = [];
  let found = false;
  
  for (const b of rawBookings) {
    try {
      let booking;
      if (typeof b === 'string') {
        booking = JSON.parse(b);
      } else {
        booking = b;
      }
      
      if (booking.id !== bookingId) {
        remainingBookings.push(typeof b === 'string' ? b : JSON.stringify(b));
      } else {
        found = true;
      }
    } catch (err) {
      console.error('[calendar] Failed to parse booking from Redis:', err);
    }
  }
  
  if (!found) {
    return false;
  }
  
  // Replace all bookings with remaining list
  await redis.del('bookings');
  if (remainingBookings.length > 0) {
    await redis.rpush('bookings', ...remainingBookings);
  }
  
  return true;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await findBookingById(id);
    
    if (!booking) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Booking not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      ok: true, 
      booking 
    });
  } catch (error) {
    console.error('[calendar] Failed to get booking:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Server error' 
    }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    console.log('[calendar] Received update data:', data);
    
    const validated = bookingUpdateSchema.parse(data);
    console.log('[calendar] Validated update data:', validated);
    
    if (!isValidDate(validated.date)) {
      console.log('[calendar] Date validation failed for:', validated.date);
      return NextResponse.json({ 
        ok: false, 
        error: 'Bookings must be made at least one day in advance' 
      }, { status: 400 });
    }

    // Check if booking exists
    const existingBooking = await findBookingById(id);
    if (!existingBooking) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Booking not found' 
      }, { status: 404 });
    }

    // Check if the new time slot conflicts with other bookings (excluding current booking)
    const rawBookings = await redis.lrange('bookings', 0, -1);
    for (const b of rawBookings) {
      try {
        let booking;
        if (typeof b === 'string') {
          booking = JSON.parse(b);
        } else {
          booking = b;
        }
        
        // Skip the current booking being updated
        if (booking.id === id) continue;
        
        // Check for time slot conflict
        if (booking.date === validated.date && booking.time === validated.time) {
          return NextResponse.json({ 
            ok: false, 
            error: 'Time slot already booked' 
          }, { status: 409 });
        }
      } catch (err) {
        console.error('[calendar] Failed to parse booking from Redis:', err);
      }
    }

    // Update the booking
    const success = await updateBookingInRedis(id, validated);
    
    if (!success) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Failed to update booking' 
      }, { status: 500 });
    }

    // Get the updated booking
    const updatedBooking = await findBookingById(id);
    
    return NextResponse.json({ 
      ok: true, 
      booking: updatedBooking 
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Invalid data', 
        details: err.errors 
      }, { status: 400 });
    }
    console.error('[calendar] Failed to update booking:', err);
    return NextResponse.json({ 
      ok: false, 
      error: 'Server error', 
      details: err.message 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if booking exists
    const existingBooking = await findBookingById(id);
    if (!existingBooking) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Booking not found' 
      }, { status: 404 });
    }

    // Delete the booking
    const success = await deleteBookingFromRedis(id);
    
    if (!success) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Failed to delete booking' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      ok: true, 
      message: 'Booking deleted successfully' 
    });
  } catch (error) {
    console.error('[calendar] Failed to delete booking:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Server error' 
    }, { status: 500 });
  }
} 