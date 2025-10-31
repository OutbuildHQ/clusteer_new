-- Fix for existing user that wasn't inserted into users table
-- This manually inserts the user data into the users table
-- Replace the values below with your actual user data from auth.users

-- First, check what users exist in auth.users:
SELECT id, email, raw_user_meta_data FROM auth.users;

-- Then insert into users table (replace the UUID and values):
-- INSERT INTO users (id, username, phone, is_verified)
-- VALUES (
--   'YOUR_USER_ID_FROM_AUTH_USERS',
--   'saintlammy',  -- or whatever username you used
--   'YOUR_PHONE_NUMBER',
--   true  -- since email is verified
-- );

-- Example (uncomment and update with your actual values):
-- INSERT INTO users (id, username, phone, is_verified)
-- SELECT
--   id,
--   raw_user_meta_data->>'username',
--   raw_user_meta_data->>'phone',
--   email_confirmed_at IS NOT NULL
-- FROM auth.users
-- WHERE email = 'your-email@example.com';
