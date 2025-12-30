/**
 * DEPRECATED: Supabase has been replaced with Firebase + Django backend
 * This file is kept for type definitions only
 * DO NOT import supabase or supabaseAdmin - they will cause errors
 */

// Deprecated exports - DO NOT USE
export const supabase = null as any;
export const supabaseAdmin = null as any;

// Database types
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
