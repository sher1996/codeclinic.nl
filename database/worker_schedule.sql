-- Create workers table for managing worker information
CREATE TABLE IF NOT EXISTS workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create worker_availability table for managing weekly schedules
CREATE TABLE IF NOT EXISTS worker_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 1=Monday, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(worker_id, day_of_week, start_time, end_time)
);

-- Create worker_time_off table for managing specific dates when worker is unavailable
CREATE TABLE IF NOT EXISTS worker_time_off (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    reason TEXT,
    is_full_day BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (end_date >= start_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workers_email ON workers(email);
CREATE INDEX IF NOT EXISTS idx_workers_active ON workers(is_active);
CREATE INDEX IF NOT EXISTS idx_worker_availability_worker_id ON worker_availability(worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_availability_day ON worker_availability(day_of_week);
CREATE INDEX IF NOT EXISTS idx_worker_time_off_worker_id ON worker_time_off(worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_time_off_dates ON worker_time_off(start_date, end_date);

-- Create functions to automatically update timestamps
CREATE OR REPLACE FUNCTION update_workers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_worker_availability_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_worker_time_off_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS trigger_update_workers_updated_at ON workers;
CREATE TRIGGER trigger_update_workers_updated_at
    BEFORE UPDATE ON workers
    FOR EACH ROW
    EXECUTE FUNCTION update_workers_updated_at();

DROP TRIGGER IF EXISTS trigger_update_worker_availability_updated_at ON worker_availability;
CREATE TRIGGER trigger_update_worker_availability_updated_at
    BEFORE UPDATE ON worker_availability
    FOR EACH ROW
    EXECUTE FUNCTION update_worker_availability_updated_at();

DROP TRIGGER IF EXISTS trigger_update_worker_time_off_updated_at ON worker_time_off;
CREATE TRIGGER trigger_update_worker_time_off_updated_at
    BEFORE UPDATE ON worker_time_off
    FOR EACH ROW
    EXECUTE FUNCTION update_worker_time_off_updated_at();

-- Add comments for documentation
COMMENT ON TABLE workers IS 'Stores worker information and status';
COMMENT ON COLUMN workers.id IS 'Unique identifier for the worker';
COMMENT ON COLUMN workers.name IS 'Full name of the worker';
COMMENT ON COLUMN workers.email IS 'Email address of the worker';
COMMENT ON COLUMN workers.phone IS 'Phone number of the worker';
COMMENT ON COLUMN workers.is_active IS 'Whether the worker is currently active and available for work';

COMMENT ON TABLE worker_availability IS 'Stores weekly recurring availability for workers';
COMMENT ON COLUMN worker_availability.worker_id IS 'Reference to the worker';
COMMENT ON COLUMN worker_availability.day_of_week IS 'Day of the week (0=Sunday, 1=Monday, etc.)';
COMMENT ON COLUMN worker_availability.start_time IS 'Start time of availability on this day';
COMMENT ON COLUMN worker_availability.end_time IS 'End time of availability on this day';
COMMENT ON COLUMN worker_availability.is_available IS 'Whether the worker is available during this time slot';

COMMENT ON TABLE worker_time_off IS 'Stores specific dates when workers are unavailable';
COMMENT ON COLUMN worker_time_off.worker_id IS 'Reference to the worker';
COMMENT ON COLUMN worker_time_off.start_date IS 'Start date of time off';
COMMENT ON COLUMN worker_time_off.end_date IS 'End date of time off';
COMMENT ON COLUMN worker_time_off.start_time IS 'Start time of unavailability (if not full day)';
COMMENT ON COLUMN worker_time_off.end_time IS 'End time of unavailability (if not full day)';
COMMENT ON COLUMN worker_time_off.reason IS 'Reason for time off';
COMMENT ON COLUMN worker_time_off.is_full_day IS 'Whether the entire day is unavailable';

-- No default workers - users will create their own workers through the admin interface
