import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Booking } from '@/types/booking';

// Initialize Supabase client
let supabase: SupabaseClient | null = null;
let resend: Resend | null = null;

try {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    console.log('[calendar] Supabase client initialized');
  } else {
    console.warn('[calendar] Supabase credentials not configured');
  }
} catch (error) {
  console.error('[calendar] Failed to initialize Supabase:', error);
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
  const [year, month, day] = date.split('-').map(Number);
  const bookingDate = new Date(year, month - 1, day);
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  const bookingStr = `${bookingDate.getFullYear()}-${pad(bookingDate.getMonth() + 1)}-${pad(bookingDate.getDate())}`;
  const tomorrowStr = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;
  
  return bookingStr >= tomorrowStr;
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
  }
}

export async function GET() {
  try {
    if (!supabase) {
      console.error('[calendar] Supabase not initialized - using fallback mode');
      return NextResponse.json({ 
        ok: true, 
        warning: 'Database not configured - using fallback mode',
        timeSlots: generateTimeSlots(),
        bookings: [],
        fallback: true
      });
    }
    
    console.log('[calendar] Fetching bookings from Supabase...');
    
    // Fetch all bookings from Supabase
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });
    
    if (error) {
      console.error('[calendar] Supabase query failed:', error);
      return NextResponse.json({ 
        ok: true, 
        warning: 'Database query failed - using fallback mode',
        details: error.message,
        timeSlots: generateTimeSlots(),
        bookings: [],
        fallback: true
      });
    }
    
    console.log('[calendar] Successfully fetched bookings:', bookings?.length || 0);
    
    return NextResponse.json({
      ok: true,
      timeSlots: generateTimeSlots(),
      bookings: bookings || [],
      fallback: false
    });
  } catch (error) {
    console.error('[calendar] GET request failed:', error);
    return NextResponse.json({ 
      ok: true, 
      warning: 'Server error - using fallback mode',
      details: error instanceof Error ? error.message : 'Unknown error',
      timeSlots: generateTimeSlots(),
      bookings: [],
      fallback: true
    });
  }
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

    if (!supabase) {
      return NextResponse.json({ ok: false, error: 'Database not configured' }, { status: 503 });
    }

    // Check if slot is already booked
    const { data: existingBooking, error: checkError } = await supabase
      .from('bookings')
      .select('id')
      .eq('date', validated.date)
      .eq('time', validated.time)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('[calendar] Error checking existing booking:', checkError);
      return NextResponse.json({ ok: false, error: 'Database error' }, { status: 500 });
    }
    
    if (existingBooking) {
      console.log('[calendar] Slot already booked:', validated.date, validated.time);
      return NextResponse.json({ ok: false, error: 'Slot already booked' }, { status: 409 });
    }

    // Create new booking
    const bookingData = {
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      date: validated.date,
      time: validated.time,
      notes: validated.notes || null,
      appointment_type: validated.appointmentType || 'onsite'
    };

    const { data: newBooking, error: insertError } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();
    
    if (insertError) {
      console.error('[calendar] Failed to insert booking:', insertError);
      return NextResponse.json({ ok: false, error: 'Failed to create booking' }, { status: 500 });
    }

    console.log('[calendar] Booking created successfully:', newBooking);

    // Convert to Booking type for email notification
    const booking: Booking = {
      id: newBooking.id.toString(),
      name: newBooking.name,
      email: newBooking.email,
      phone: newBooking.phone,
      date: newBooking.date,
      time: newBooking.time,
      notes: newBooking.notes,
      appointmentType: newBooking.appointment_type,
      createdAt: newBooking.created_at,
      updatedAt: newBooking.updated_at
    };

    // Send admin notification email
    await sendAdminNotification(booking);

    return NextResponse.json({ ok: true, booking }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: 'Invalid data', details: err.errors }, { status: 400 });
    }
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[calendar] POST request failed:', err);
    return NextResponse.json({ ok: false, error: 'Server error', details: errorMessage }, { status: 500 });
  }
}
