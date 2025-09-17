import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { sendBookingConfirmation } from '@/lib/email-service';
import { generateUniqueBookingNumber } from '@/lib/booking-utils';

// Initialize Supabase client
let supabase: SupabaseClient | null = null;

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

// Initialize services
console.log('[calendar] Starting service initialization...');

try {
  // Initialize Supabase
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('[calendar] Initializing Supabase client...');
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    console.log('[calendar] Supabase client initialized successfully');
  } else {
    console.log('[calendar] Supabase environment variables not configured');
    supabase = null;
  }
  
  // Gmail SMTP is handled by the email service
  console.log('[calendar] Gmail SMTP will be used for email notifications');
  
  console.log('[calendar] Service initialization completed');
} catch (error) {
  console.error('[calendar] Failed to initialize services:', error);
  console.error('[calendar] Error details:', error instanceof Error ? error.message : 'Unknown error');
  console.error('[calendar] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
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

// Generate all 30-minute slots from 09:00 to 16:00 (fallback)
function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 9; h <= 16; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
}

// Get available time slots based on worker schedules
async function getAvailableTimeSlots(date?: string): Promise<string[]> {
  if (!date) {
    return generateTimeSlots(); // Fallback to default slots
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/available-slots?date=${date}`);
    if (response.ok) {
      const data = await response.json();
      return data.availableSlots || generateTimeSlots();
    }
  } catch (error) {
    console.error('[calendar] Error fetching available slots:', error);
  }

  return generateTimeSlots(); // Fallback to default slots
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
async function sendAdminNotification(booking: {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  notes?: string | null;
  appointment_type: string;
  created_at: string;
  updated_at: string;
}) {
  if (!process.env.ADMIN_EMAIL || !process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log('[calendar] Gmail credentials not configured, skipping admin notification');
    return;
  }

  try {
         const appointmentType = booking.appointment_type || 'onsite';
         const typeText = appointmentType === 'remote' ? 'Remote hulp' : 'Aan huis bezoek';
    
    // HTML template is handled by the email service

    // Use Gmail SMTP service
    const { sendAdminApprovalRequest } = await import('@/lib/email-service');
    
    // Create a mock request object for the admin approval function
    const mockRequest = {
      id: booking.id,
      email: booking.email,
      name: booking.name,
      reason: `Nieuwe ${typeText} geboekt voor ${booking.date} om ${booking.time}`,
      createdAt: booking.created_at,
      approveToken: 'admin-notification',
      denyToken: 'admin-notification'
    };

    // Send using the existing Gmail SMTP service
    await sendAdminApprovalRequest(mockRequest);
    console.log('[calendar] Admin notification sent successfully via Gmail SMTP');
  } catch (error: unknown) {
    console.error('[calendar] Failed to send admin notification:', error);
  }
}



export async function GET(request: Request) {
  console.log('[calendar] === GET REQUEST START ===');
  console.log('[calendar] Environment check - SUPABASE_URL:', !!process.env.SUPABASE_URL);
  console.log('[calendar] Environment check - SUPABASE_SERVICE_ROLE_KEY:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  console.log('[calendar] Supabase client status:', !!supabase);
  
  try {
    console.log('[calendar] GET request received');
    
    // Check if a specific date is requested for available slots
    const { searchParams } = new URL(request.url);
    const requestedDate = searchParams.get('date');
    
    if (supabase) {
      console.log('[calendar] Using Supabase database');
      
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) {
        console.error('[calendar] Supabase query error:', error);
        throw error;
      }
      
      console.log('[calendar] Retrieved', bookings?.length || 0, 'bookings from database');
      
      // Get available time slots based on worker schedules
      const timeSlots = await getAvailableTimeSlots(requestedDate || undefined);
      
      return NextResponse.json({ 
        ok: true, 
        timeSlots,
        bookings: bookings || [],
        fallback: false,
        requestedDate
      });
    } else {
      console.log('[calendar] Supabase not available, using fallback mode');
      return NextResponse.json({ 
        ok: true, 
        warning: 'Database not configured - using fallback mode',
        timeSlots: generateTimeSlots(),
        bookings: fallbackBookings,
        fallback: true
      });
    }
  } catch (error) {
    console.error('[calendar] GET request failed:', error);
    console.error('[calendar] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Fallback to in-memory storage on error
    return NextResponse.json({ 
      ok: true, 
      warning: 'Database error - using fallback mode',
      details: error instanceof Error ? error.message : 'Unknown error',
      timeSlots: generateTimeSlots(),
      bookings: fallbackBookings,
      fallback: true
    });
  }
}

export async function POST(request: Request) {
  console.log('[calendar] === POST REQUEST START ===');
  console.log('[calendar] Environment check - SUPABASE_URL:', !!process.env.SUPABASE_URL);
  console.log('[calendar] Environment check - SUPABASE_SERVICE_ROLE_KEY:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  console.log('[calendar] Supabase client status:', !!supabase);
  
  try {
    console.log('[calendar] POST request received');
    
    const data = await request.json();
    console.log('[calendar] Received booking data:', data);
    
    const validated = bookingSchema.parse(data);
    console.log('[calendar] Validated data:', validated);
    
    if (!isValidDate(validated.date)) {
      console.log('[calendar] Date validation failed for:', validated.date);
      return NextResponse.json({ ok: false, error: 'Bookings must be made at least one day in advance' }, { status: 400 });
    }

    if (supabase) {
      console.log('[calendar] Using Supabase database');
      
      try {
        // Check if slot is already booked in database
        console.log('[calendar] Checking for existing bookings...');
        const { data: existingBookings, error: checkError } = await supabase
          .from('bookings')
          .select('id')
          .eq('date', validated.date)
          .eq('time', validated.time);
        
        if (checkError) {
          console.error('[calendar] Error checking existing bookings:', checkError);
          throw checkError;
        }
        
        console.log('[calendar] Existing bookings found:', existingBookings?.length || 0);
        
        if (existingBookings && existingBookings.length > 0) {
          console.log('[calendar] Slot already booked in database:', validated.date, validated.time);
          return NextResponse.json({ ok: false, error: 'Slot already booked' }, { status: 409 });
        }
        
        // Generate unique random booking number
        const bookingNumber = await generateUniqueBookingNumber(supabase);
        console.log('[calendar] Generated booking number:', bookingNumber);
        
        // Create new booking in database
        console.log('[calendar] Creating new booking in database...');
        const newBooking = {
          name: validated.name,
          email: validated.email,
          phone: validated.phone,
          date: validated.date,
          time: validated.time,
          notes: validated.notes || null,
          appointment_type: validated.appointmentType || 'onsite',
        };
        
        console.log('[calendar] Booking data to insert:', newBooking);
        
        const { data: insertedBooking, error: insertError } = await supabase
          .from('bookings')
          .insert([newBooking])
          .select()
          .single();
        
        if (insertError) {
          console.error('[calendar] Error inserting booking:', insertError);
          throw insertError;
        }
        
        console.log('[calendar] Booking stored in database:', insertedBooking);
        
        // Send admin notification
        await sendAdminNotification(insertedBooking);
        
        // Send customer confirmation email
        try {
          await sendBookingConfirmation(insertedBooking);
          console.log('[calendar] Customer confirmation email sent successfully');
        } catch (error) {
          console.error('[calendar] Failed to send customer confirmation email:', error);
          // Don't fail the booking if confirmation email fails
        }
        
        return NextResponse.json({ 
          ok: true, 
          booking: {
            ...insertedBooking,
            booking_number: bookingNumber
          }
        }, { status: 201 });
      } catch (dbError) {
        console.error('[calendar] Database operation failed:', dbError);
        throw dbError;
      }
      
    } else {
      console.log('[calendar] Supabase not available, using fallback mode');
      
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
      
      // Send customer confirmation email
      try {
        await sendBookingConfirmation(newBooking);
        console.log('[calendar] Customer confirmation email sent successfully (fallback mode)');
      } catch (error) {
        console.error('[calendar] Failed to send customer confirmation email (fallback mode):', error);
        // Don't fail the booking if confirmation email fails
      }
      
      return NextResponse.json({ 
        ok: true, 
        warning: 'Booking saved in fallback mode - will be lost on server restart',
        booking: newBooking
      }, { status: 201 });
    }
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: 'Invalid data', details: err.errors }, { status: 400 });
    }
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[calendar] POST request failed:', err);
    return NextResponse.json({ ok: false, error: 'Server error', details: errorMessage }, { status: 500 });
  }
}
