# Clusteer Backend Setup with Supabase

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://app.supabase.com/)
2. Create a new project
3. Wait for the project to be ready

### 2. Run the Database Schema

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the contents of `supabase-schema.sql` and paste it
5. Click "Run" to execute the schema

### 3. Get Your Supabase Credentials

1. Go to Project Settings → API
2. Copy your:
   - Project URL (looks like: `https://xxxxx.supabase.co`)
   - Anon/Public Key (starts with `eyJ...`)

### 4. Update Environment Variables

1. Open `.env.local` in the project root
2. Replace the placeholders with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
JWT_SECRET=your-random-secret-key-here
```

For `JWT_SECRET`, generate a random string (at least 32 characters).

### 5. Start the Development Server

```bash
npm run dev
```

## How Authentication Works

### Registration Flow:
1. User fills signup form (username, email, phone, password)
2. POST `/api/auth/register` creates user with hashed password
3. Generates 6-digit OTP (expires in 10 minutes)
4. OTP is logged to console (implement email sending later)
5. User must verify with OTP before login

### OTP Verification:
1. User submits username and OTP
2. POST `/api/auth/verify-otp` validates OTP
3. Marks user as verified
4. User can now login

### Login Flow:
1. User submits email and password
2. POST `/api/auth/login` verifies credentials
3. Checks if user is verified
4. Generates JWT token (7-day expiry)
5. Sets auth token as httpOnly cookie
6. Returns user data

## Database Tables

- **users** - User accounts with auth credentials
- **wallets** - Crypto wallet addresses per user
- **transactions** - Buy/sell transaction history
- **bank_accounts** - Nigerian bank account details
- **exchange_rates** - USDT/NGN exchange rates

## Next Steps

1. ✅ Supabase setup complete
2. ✅ Authentication APIs ready
3. ⏳ Implement email/SMS for OTP
4. ⏳ Add wallet integration (Web3)
5. ⏳ Build transaction system
6. ⏳ Add payment gateway integration
7. ⏳ Implement real-time rate updates

## Testing

To test registration:
1. Go to http://localhost:3000/signup
2. Fill in the form
3. Check server console for OTP
4. Go to verify page and enter OTP
5. Login with your credentials
6. Access dashboard
