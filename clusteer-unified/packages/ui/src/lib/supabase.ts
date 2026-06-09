/**
 * DEPRECATED: Supabase has been fully replaced with Firebase + Django backend
 * This file only contains type definitions for backward compatibility
 * All Supabase client exports have been removed
 */

// Database types (kept for reference during migration)
export type User = {
  id: string;
  username: string;
  email: string;
  phone: string;
  password_hash: string;
  is_verified: boolean;
  otp: string | null;
  otp_expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Wallet = {
  id: string;
  user_id: string;
  address: string;
  chain: string;
  balance: number;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  type: 'buy' | 'sell';
  amount: number;
  rate: number;
  status: 'pending' | 'completed' | 'failed';
  tx_hash: string | null;
  created_at: string;
  updated_at: string;
};
