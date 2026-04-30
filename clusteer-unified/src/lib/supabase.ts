/**
 * DEPRECATED: Supabase has been fully replaced with Firebase + Django backend.
 * Stub exports below prevent build errors in old API routes that haven't been migrated yet.
 * These routes will return 503 "Service unavailable" at runtime.
 * TODO: Remove this file and migrate remaining routes to Firebase/Django.
 */

// Stub clients to prevent build crashes in unmigrated routes
export const supabase = null as any;
export const supabaseAdmin = null as any;

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
