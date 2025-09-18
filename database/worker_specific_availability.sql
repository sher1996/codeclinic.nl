-- Create worker_specific_availability table for managing specific date availability
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

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_worker_specific_availability_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_worker_specific_availability_updated_at ON worker_specific_availability;
CREATE TRIGGER trigger_update_worker_specific_availability_updated_at
    BEFORE UPDATE ON worker_specific_availability
    FOR EACH ROW
    EXECUTE FUNCTION update_worker_specific_availability_updated_at();
