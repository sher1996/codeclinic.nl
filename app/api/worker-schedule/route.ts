import { NextResponse } from 'next/server';
import { z } from 'zod';
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
  console.error('[worker-schedule] Failed to initialize Supabase:', error);
}

// Validation schemas
const workerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  email: z.string().email('Invalid email address').max(255, 'Email is too long'),
  phone: z.string().max(20, 'Phone number is too long').optional(),
  is_active: z.boolean().default(true)
});

const availabilitySchema = z.object({
  worker_id: z.string().uuid('Invalid worker ID'),
  day_of_week: z.number().int().min(0).max(6, 'Day of week must be 0-6'),
  start_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format (HH:MM)'),
  end_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format (HH:MM)'),
  is_available: z.boolean().default(true)
});

const timeOffSchema = z.object({
  worker_id: z.string().uuid('Invalid worker ID'),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  start_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format (HH:MM)').optional(),
  end_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format (HH:MM)').optional(),
  reason: z.string().max(500, 'Reason is too long').optional(),
  is_full_day: z.boolean().default(true)
});

// GET - Fetch all workers and their schedules
export async function GET() {
  console.log('[worker-schedule] GET request received');
  
  if (!supabase) {
    return NextResponse.json({ 
      ok: false, 
      error: 'Database not configured' 
    }, { status: 500 });
  }

  try {
    // Fetch workers with their availability and time off
    const { data: workers, error: workersError } = await supabase
      .from('workers')
      .select(`
        *,
        worker_availability(*),
        worker_time_off(*)
      `)
      .eq('is_active', true)
      .order('name');

    if (workersError) {
      console.error('[worker-schedule] Error fetching workers:', workersError);
      throw workersError;
    }

    return NextResponse.json({ 
      ok: true, 
      workers: workers || [] 
    });
  } catch (error) {
    console.error('[worker-schedule] GET request failed:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to fetch worker schedules' 
    }, { status: 500 });
  }
}

// POST - Create new worker
export async function POST(request: Request) {
  console.log('[worker-schedule] POST request received');
  
  if (!supabase) {
    return NextResponse.json({ 
      ok: false, 
      error: 'Database not configured' 
    }, { status: 500 });
  }

  try {
    const data = await request.json();
    console.log('[worker-schedule] Received data:', data);

    const { action, ...payload } = data;

    switch (action) {
      case 'create_worker': {
        const validated = workerSchema.parse(payload);
        
        const { data: worker, error } = await supabase
          .from('workers')
          .insert([validated])
          .select()
          .single();

        if (error) {
          console.error('[worker-schedule] Error creating worker:', error);
          throw error;
        }

        return NextResponse.json({ 
          ok: true, 
          worker 
        }, { status: 201 });
      }

      case 'update_worker': {
        const { id, ...updateData } = payload;
        const validated = workerSchema.partial().parse(updateData);
        
        const { data: worker, error } = await supabase
          .from('workers')
          .update(validated)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('[worker-schedule] Error updating worker:', error);
          throw error;
        }

        return NextResponse.json({ 
          ok: true, 
          worker 
        });
      }

      case 'set_availability': {
        const validated = availabilitySchema.parse(payload);
        
        const { data: availability, error } = await supabase
          .from('worker_availability')
          .upsert([validated], {
            onConflict: 'worker_id,day_of_week,start_time,end_time'
          })
          .select()
          .single();

        if (error) {
          console.error('[worker-schedule] Error setting availability:', error);
          throw error;
        }

        return NextResponse.json({ 
          ok: true, 
          availability 
        });
      }

      case 'set_time_off': {
        const validated = timeOffSchema.parse(payload);
        
        const { data: timeOff, error } = await supabase
          .from('worker_time_off')
          .insert([validated])
          .select()
          .single();

        if (error) {
          console.error('[worker-schedule] Error setting time off:', error);
          throw error;
        }

        return NextResponse.json({ 
          ok: true, 
          timeOff 
        }, { status: 201 });
      }

      case 'delete_availability': {
        const { id } = payload;
        
        const { error } = await supabase
          .from('worker_availability')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('[worker-schedule] Error deleting availability:', error);
          throw error;
        }

        return NextResponse.json({ 
          ok: true 
        });
      }

      case 'delete_time_off': {
        const { id } = payload;
        
        const { error } = await supabase
          .from('worker_time_off')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('[worker-schedule] Error deleting time off:', error);
          throw error;
        }

        return NextResponse.json({ 
          ok: true 
        });
      }

      default:
        return NextResponse.json({ 
          ok: false, 
          error: 'Invalid action' 
        }, { status: 400 });
    }
  } catch (error) {
    console.error('[worker-schedule] POST request failed:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Invalid data', 
        details: error.errors 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      ok: false, 
      error: 'Server error' 
    }, { status: 500 });
  }
}
