-- Create verification_requests table for KYC tracking
CREATE TABLE IF NOT EXISTS public.verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    verification_type VARCHAR(20) NOT NULL CHECK (verification_type IN ('BVN', 'NIN')),
    document_number VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_data JSONB,
    verification_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_verification_requests_user_id ON public.verification_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_status ON public.verification_requests(status);
CREATE INDEX IF NOT EXISTS idx_verification_requests_created_at ON public.verification_requests(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_verification_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER verification_requests_updated_at
BEFORE UPDATE ON public.verification_requests
FOR EACH ROW
EXECUTE FUNCTION update_verification_requests_updated_at();

-- Enable Row Level Security
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view their own verification requests
CREATE POLICY "Users can view own verification requests"
ON public.verification_requests FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own verification requests
CREATE POLICY "Users can create own verification requests"
ON public.verification_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Only service role can update verification requests (for backend processing)
CREATE POLICY "Service role can update verification requests"
ON public.verification_requests FOR UPDATE
TO authenticated
USING (true);

-- Comment on table
COMMENT ON TABLE public.verification_requests IS 'Stores KYC verification requests and results from third-party providers';
