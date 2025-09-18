# Setup Specific Date Availability

This guide explains how to set up the new specific date availability feature that allows you to set availability for specific dates like "August 13, 2025 9:00-17:00".

## Database Setup

### Option 1: Manual Setup in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the following SQL (safe version without destructive operations):

```sql
-- Create worker_specific_availability table for managing specific date availability
-- This is a safe version without DROP statements

CREATE TABLE IF NOT EXISTS worker_specific_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    availability_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(worker_id, availability_date, start_time, end_time)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_worker_specific_availability_worker_id ON worker_specific_availability(worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_specific_availability_date ON worker_specific_availability(availability_date);
CREATE INDEX IF NOT EXISTS idx_worker_specific_availability_worker_date ON worker_specific_availability(worker_id, availability_date);

-- Add comments
COMMENT ON TABLE worker_specific_availability IS 'Stores specific date availability for workers (e.g., August 13, 2025 9:00-17:00)';
COMMENT ON COLUMN worker_specific_availability.worker_id IS 'Reference to the worker';
COMMENT ON COLUMN worker_specific_availability.availability_date IS 'Specific date for availability (YYYY-MM-DD)';
COMMENT ON COLUMN worker_specific_availability.start_time IS 'Start time of availability on this specific date';
COMMENT ON COLUMN worker_specific_availability.end_time IS 'End time of availability on this specific date';
COMMENT ON COLUMN worker_specific_availability.is_available IS 'Whether the worker is available during this time slot on this date';
COMMENT ON COLUMN worker_specific_availability.reason IS 'Optional reason for this specific availability (e.g., "Covering for colleague")';

-- Create function for updated_at trigger (safe version)
CREATE OR REPLACE FUNCTION update_worker_specific_availability_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger (will only create if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_update_worker_specific_availability_updated_at') THEN
        CREATE TRIGGER trigger_update_worker_specific_availability_updated_at
            BEFORE UPDATE ON worker_specific_availability
            FOR EACH ROW
            EXECUTE FUNCTION update_worker_specific_availability_updated_at();
    END IF;
END $$;
```

4. Click "Run" to execute the SQL

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
supabase db reset
# or
supabase db push
```

## Features Added

### Admin Interface

The admin interface now has three tabs:

1. **Wekelijkse Beschikbaarheid** - Weekly recurring schedules (e.g., "Every Monday 9:00-17:00")
2. **Specifieke Datums** - Specific date availability (e.g., "August 13, 2025 9:00-17:00") 
3. **Vrije Tijd** - Time off and vacation days

### Specific Date Availability

- **Clear Date Display**: Shows actual dates like "woensdag 13 augustus 2025"
- **Time Range**: Start and end times for that specific date
- **Availability Status**: Whether the worker is available or not
- **Reason Field**: Optional reason for the specific availability
- **Easy Management**: Add, edit, and delete specific date availability

### How to Use

1. Go to `/admin/schedule`
2. Select a worker
3. Click on the "Specifieke Datums" tab
4. Fill in the form:
   - **Date**: Select the specific date (e.g., August 13, 2025)
   - **Start Time**: When availability starts (e.g., 09:00)
   - **End Time**: When availability ends (e.g., 17:00)
   - **Available**: Check if the worker is available
   - **Reason**: Optional reason (e.g., "Covering for colleague")
5. Click "Specifieke Beschikbaarheid Toevoegen"

### Example

To add availability for August 13, 2025:
- Date: 2025-08-13
- Start Time: 09:00
- End Time: 17:00
- Available: ✓
- Reason: "Extra shift"

This will show as: "woensdag 13 augustus 2025" with "09:00 - 17:00" and "Beschikbaar"

## Calendar Integration

The calendar system will now use both:
- Weekly recurring availability (for regular schedules)
- Specific date availability (for one-off or special dates)

This gives you the flexibility to have regular weekly hours plus specific dates when workers are available or unavailable.

## Troubleshooting

If you see "Could not find the table" errors, make sure you've run the SQL setup in your Supabase dashboard first.

The new feature is now ready to use! You can add specific dates like "13/08/2025" and they will display clearly in the admin interface.
