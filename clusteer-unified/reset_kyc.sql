-- Reset KYC verification for testing
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"kyc_reset": true}'::jsonb
WHERE email LIKE '%saintlammy%';

-- Update the users table
UPDATE public.users 
SET is_verified = false, 
    updated_at = NOW()
WHERE username = 'saintlammy' OR email LIKE '%saintlammy%';
