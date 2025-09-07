-- Create admin_access_requests table for email-based admin access system
CREATE TABLE IF NOT EXISTS admin_access_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
    approve_token VARCHAR(255),
    deny_token VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_admin_access_requests_email ON admin_access_requests(email);
CREATE INDEX IF NOT EXISTS idx_admin_access_requests_status ON admin_access_requests(status);
CREATE INDEX IF NOT EXISTS idx_admin_access_requests_created_at ON admin_access_requests(created_at);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_access_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_update_admin_access_requests_updated_at ON admin_access_requests;
CREATE TRIGGER trigger_update_admin_access_requests_updated_at
    BEFORE UPDATE ON admin_access_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_access_requests_updated_at();

-- Add comments for documentation
COMMENT ON TABLE admin_access_requests IS 'Stores admin access requests and their approval status';
COMMENT ON COLUMN admin_access_requests.id IS 'Unique identifier for the request';
COMMENT ON COLUMN admin_access_requests.email IS 'Email address of the person requesting admin access';
COMMENT ON COLUMN admin_access_requests.name IS 'Full name of the person requesting admin access';
COMMENT ON COLUMN admin_access_requests.reason IS 'Optional reason for requesting admin access';
COMMENT ON COLUMN admin_access_requests.status IS 'Current status: pending, approved, or denied';
COMMENT ON COLUMN admin_access_requests.approve_token IS 'Secure token for approving the request via email link';
COMMENT ON COLUMN admin_access_requests.deny_token IS 'Secure token for denying the request via email link';
COMMENT ON COLUMN admin_access_requests.created_at IS 'When the request was created';
COMMENT ON COLUMN admin_access_requests.updated_at IS 'When the request was last updated';
COMMENT ON COLUMN admin_access_requests.processed_at IS 'When the request was approved or denied';
