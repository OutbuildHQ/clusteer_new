-- Create internal_transfers table
CREATE TABLE IF NOT EXISTS internal_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    asset VARCHAR(10) NOT NULL,
    amount DECIMAL(20, 8) NOT NULL CHECK (amount > 0),
    note TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_internal_transfers_sender ON internal_transfers(sender_id);
CREATE INDEX IF NOT EXISTS idx_internal_transfers_recipient ON internal_transfers(recipient_id);
CREATE INDEX IF NOT EXISTS idx_internal_transfers_created_at ON internal_transfers(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_internal_transfers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER internal_transfers_updated_at
BEFORE UPDATE ON internal_transfers
FOR EACH ROW
EXECUTE FUNCTION update_internal_transfers_updated_at();

-- Enable Row Level Security
ALTER TABLE internal_transfers ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view their own transfers (sent or received)
CREATE POLICY "Users can view their transfers"
ON internal_transfers FOR SELECT
TO authenticated
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Users can create transfers (as sender)
CREATE POLICY "Users can create transfers"
ON internal_transfers FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id);

-- Comment on table
COMMENT ON TABLE internal_transfers IS 'Stores internal transfers between Clusteer users';
