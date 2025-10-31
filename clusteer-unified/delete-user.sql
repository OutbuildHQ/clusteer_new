-- Delete user 'saintlammy' from the database
-- Run this in your Supabase SQL Editor

-- First, find the user
SELECT * FROM users WHERE username = 'saintlammy';

-- Delete the user (this will cascade delete related records in wallets, transactions, bank_accounts)
DELETE FROM users WHERE username = 'saintlammy';

-- Verify deletion
SELECT * FROM users WHERE username = 'saintlammy';
