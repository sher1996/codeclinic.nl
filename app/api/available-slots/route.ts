import { NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase client
let supabase: SupabaseClient | null = null;

try {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
} catch (error) {
  console.error('[available-slots] Failed to initialize Supabase:', error);
}

// Helper function to check if a time slot is within worker availability
function isTimeSlotAvailable(
  date: Date,
  timeSlot: string,
  availability: Array<{
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_available: boolean;
  }>,
  timeOff: Array<{
    start_date: string;
    end_date: string;
    start_time?: string;
    end_time?: string;
    is_full_day: boolean;
  }>
): boolean {
  const dayOfWeek = date.getDay();
  const [slotHour, slotMinute] = timeSlot.split(':').map(Number);
  const slotTime = slotHour * 60 + slotMinute; // Convert to minutes for easier comparison

  // Check if there's time off for this specific date
  const dateString = date.toISOString().split('T')[0];
  const hasTimeOff = timeOff.some(off => {
    const offStart = new Date(off.start_date);
    const offEnd = new Date(off.end_date);
    const checkDate = new Date(dateString);
    
    if (checkDate >= offStart && checkDate <= offEnd) {
      if (off.is_full_day) {
        return true;
      }
      
      // Check if the time slot falls within the partial time off
      if (off.start_time && off.end_time) {
        const [offStartHour, offStartMinute] = off.start_time.split(':').map(Number);
        const [offEndHour, offEndMinute] = off.end_time.split(':').map(Number);
        const offStartTime = offStartHour * 60 + offStartMinute;
        const offEndTime = offEndHour * 60 + offEndMinute;
        
        return slotTime >= offStartTime && slotTime < offEndTime;
      }
    }
    return false;
  });

  if (hasTimeOff) {
    return false;
  }

  // Check if there's availability for this day of week
  const dayAvailability = availability.filter(av => av.day_of_week === dayOfWeek && av.is_available);
  
  if (dayAvailability.length === 0) {
    return false;
  }

  // Check if the time slot falls within any available time range
  return dayAvailability.some(av => {
    const [startHour, startMinute] = av.start_time.split(':').map(Number);
    const [endHour, endMinute] = av.end_time.split(':').map(Number);
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;
    
    return slotTime >= startTime && slotTime < endTime;
  });
}

// Generate time slots based on worker availability
function generateAvailableTimeSlots(
  date: Date,
  availability: Array<{
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_available: boolean;
  }>,
  timeOff: Array<{
    start_date: string;
    end_date: string;
    start_time?: string;
    end_time?: string;
    is_full_day: boolean;
  }>
): string[] {
  const slots: string[] = [];
  
  // Generate 30-minute slots from 8:00 to 18:00
  for (let hour = 8; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      if (isTimeSlotAvailable(date, timeSlot, availability, timeOff)) {
        slots.push(timeSlot);
      }
    }
  }
  
  return slots;
}

// GET - Get available time slots for a specific date
export async function GET(request: Request) {
  console.log('[available-slots] GET request received');
  
  if (!supabase) {
    return NextResponse.json({ 
      ok: false, 
      error: 'Database not configured' 
    }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    if (!date) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Date parameter is required' 
      }, { status: 400 });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Invalid date format. Use YYYY-MM-DD' 
      }, { status: 400 });
    }

    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Invalid date' 
      }, { status: 400 });
    }

    // Get all active workers with their availability and time off
    const { data: workers, error: workersError } = await supabase
      .from('workers')
      .select(`
        id,
        name,
        worker_availability!inner(
          day_of_week,
          start_time,
          end_time,
          is_available
        ),
        worker_time_off(
          start_date,
          end_date,
          start_time,
          end_time,
          is_full_day
        )
      `)
      .eq('is_active', true);

    if (workersError) {
      console.error('[available-slots] Error fetching workers:', workersError);
      throw workersError;
    }

    if (!workers || workers.length === 0) {
      return NextResponse.json({ 
        ok: true, 
        availableSlots: [],
        message: 'No active workers found' 
      });
    }

    // Combine availability from all workers
    const allAvailability = workers.flatMap(worker => 
      worker.worker_availability.map(av => ({
        ...av,
        worker_id: worker.id,
        worker_name: worker.name
      }))
    );

    const allTimeOff = workers.flatMap(worker => 
      worker.worker_time_off.map(off => ({
        ...off,
        worker_id: worker.id,
        worker_name: worker.name
      }))
    );

    // Generate available time slots
    const availableSlots = generateAvailableTimeSlots(targetDate, allAvailability, allTimeOff);

    // Get existing bookings for this date to filter out booked slots
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('time')
      .eq('date', date);

    if (bookingsError) {
      console.error('[available-slots] Error fetching bookings:', bookingsError);
      // Continue without filtering bookings if there's an error
    }

    const bookedTimes = bookings?.map(booking => booking.time) || [];
    
    // Generate blocked time slots (1.5 hours after each booking)
    const generateBlockedTimeSlots = (bookedTimes: string[]): string[] => {
      const blockedSlots: string[] = [];
      
      bookedTimes.forEach(bookedTime => {
        const [hours, minutes] = bookedTime.split(':').map(Number);
        const bookedDateTime = new Date();
        bookedDateTime.setHours(hours, minutes, 0, 0);
        
        // Generate 30-minute slots for the 1.5-hour block AFTER the booking
        for (let i = 0; i < 3; i++) {
          const slotDateTime = new Date(bookedDateTime.getTime() + (i * 30 * 60 * 1000));
          const slotHours = slotDateTime.getHours();
          const slotMinutes = slotDateTime.getMinutes();
          const slotTime = `${slotHours.toString().padStart(2, '0')}:${slotMinutes.toString().padStart(2, '0')}`;
          
          blockedSlots.push(slotTime);
        }
      });
      
      return blockedSlots;
    };
    
    const blockedTimes = generateBlockedTimeSlots(bookedTimes);
    const finalAvailableSlots = availableSlots.filter(slot => 
      !bookedTimes.includes(slot) && !blockedTimes.includes(slot)
    );

    return NextResponse.json({ 
      ok: true, 
      availableSlots: finalAvailableSlots,
      date,
      totalWorkers: workers.length,
      bookedSlots: bookedTimes.length,
      blockedSlots: blockedTimes.length,
      bookedTimes: bookedTimes,
      blockedTimes: blockedTimes
    });
  } catch (error) {
    console.error('[available-slots] GET request failed:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to fetch available slots' 
    }, { status: 500 });
  }
}
