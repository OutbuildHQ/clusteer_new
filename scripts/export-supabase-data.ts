#!/usr/bin/env ts-node

/**
 * Supabase Data Export Script
 * Exports all user data from Supabase to CSV files for migration to PostgreSQL
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../clusteer-unified/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create export directory
const exportDir = path.join(__dirname, '../data-exports');
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

/**
 * Convert array of objects to CSV string
 */
function arrayToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma or newline
      if (value === null || value === undefined) return '';
      const escaped = String(value).replace(/"/g, '""');
      return /[,\n"]/.test(escaped) ? `"${escaped}"` : escaped;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

/**
 * Save data to CSV file
 */
function saveToCSV(filename: string, data: any[]) {
  const csv = arrayToCSV(data);
  const filepath = path.join(exportDir, filename);
  fs.writeFileSync(filepath, csv, 'utf-8');
  console.log(`✓ Exported ${data.length} records to ${filename}`);
}

/**
 * Main export function
 */
async function exportData() {
  console.log('====================================');
  console.log('Supabase Data Export');
  console.log('====================================\n');

  try {
    // Export Users (combining auth.users and public.users)
    console.log('📤 Exporting users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) throw authError;

    const userIds = authUsers.users.map(u => u.id);
    const { data: userProfiles, error: profileError } = await supabase
      .from('users')
      .select('*')
      .in('id', userIds);

    if (profileError) throw profileError;

    // Merge auth and profile data
    const mergedUsers = authUsers.users.map(authUser => {
      const profile = userProfiles?.find(p => p.id === authUser.id);
      return {
        id: authUser.id,
        email: authUser.email,
        email_confirmed_at: authUser.email_confirmed_at,
        created_at: authUser.created_at,
        updated_at: authUser.updated_at,
        username: profile?.username || '',
        phone: profile?.phone || '',
        is_verified: profile?.is_verified || false,
        avatar_url: profile?.avatar_url || '',
        // Note: We cannot export password hashes from Supabase Auth
        // Users will need to reset passwords after migration
      };
    });

    saveToCSV('users.csv', mergedUsers);

    // Export Transactions
    console.log('📤 Exporting transactions...');
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: true });

    if (txError) throw txError;
    saveToCSV('transactions.csv', transactions || []);

    // Export Bank Accounts
    console.log('📤 Exporting bank accounts...');
    const { data: bankAccounts, error: bankError } = await supabase
      .from('bank_accounts')
      .select('*');

    if (bankError) throw bankError;
    saveToCSV('bank_accounts.csv', bankAccounts || []);

    // Export Orders (if exists)
    console.log('📤 Exporting orders...');
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: true });

    if (ordersError) {
      console.log('⚠️  Orders table not found or error:', ordersError.message);
    } else {
      saveToCSV('orders.csv', orders || []);
    }

    // Export Exchange Rates
    console.log('📤 Exporting exchange rates...');
    const { data: rates, error: ratesError } = await supabase
      .from('exchange_rates')
      .select('*')
      .order('created_at', { ascending: true });

    if (ratesError) {
      console.log('⚠️  Exchange rates table not found or error:', ratesError.message);
    } else {
      saveToCSV('exchange_rates.csv', rates || []);
    }

    // Create summary file
    const summary = {
      export_date: new Date().toISOString(),
      users: mergedUsers.length,
      transactions: transactions?.length || 0,
      bank_accounts: bankAccounts?.length || 0,
      orders: orders?.length || 0,
      exchange_rates: rates?.length || 0,
      note: 'Password hashes cannot be exported from Supabase Auth. Users must reset passwords after migration.',
    };

    fs.writeFileSync(
      path.join(exportDir, 'export-summary.json'),
      JSON.stringify(summary, null, 2)
    );

    console.log('\n====================================');
    console.log('✅ Export Complete!');
    console.log('====================================\n');
    console.log('📋 Export Summary:');
    console.log(`   Users: ${summary.users}`);
    console.log(`   Transactions: ${summary.transactions}`);
    console.log(`   Bank Accounts: ${summary.bank_accounts}`);
    console.log(`   Orders: ${summary.orders}`);
    console.log(`   Exchange Rates: ${summary.exchange_rates}`);
    console.log(`\n📁 Files saved to: ${exportDir}`);
    console.log('\n⚠️  IMPORTANT: Users will need to reset their passwords after migration.');
    console.log('   Supabase does not expose password hashes for security reasons.\n');

  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
}

// Run export
exportData();
