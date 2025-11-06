# Clusteer - Cryptocurrency Exchange Platform

A modern Next.js-based cryptocurrency exchange platform specializing in USDT/USDC ↔ Nigerian Naira (NGN) conversions with real-time rates, wallet management, and secure P2P transfers.

## 🚀 Features

- **Authentication & Security**
  - Email verification with Supabase Auth
  - Two-factor authentication (2FA) with Google Authenticator
  - JWT-based session management
  - HTTP-only secure cookies
  - Row Level Security (RLS) on database

- **Trading**
  - Real-time exchange rates (buy/sell premiums)
  - Buy/sell cryptocurrency (USDT, USDC)
  - Multi-chain support (Solana, Tron, BSC, Ethereum)
  - Transaction history with pagination

- **Wallet Management**
  - Multi-chain wallet integration
  - Balance aggregation across chains
  - Internal P2P transfers between verified users
  - QR code wallet addresses

- **Identity Verification (KYC)**
  - BVN verification
  - NIN verification
  - Identity verification status tracking

- **Security Features**
  - Rate limiting on all API endpoints
  - Comprehensive audit logging
  - CSRF protection
  - Security headers (CSP, HSTS, etc.)
  - Input validation and sanitization

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15.3.4 (App Router, React Server Components)
- **UI**: React 19, TypeScript 5
- **Styling**: Tailwind CSS 4, Radix UI components
- **State Management**: Zustand (client), React Query (server)
- **Forms**: React Hook Form + Zod validation

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (avatars, documents)
- **External APIs**:
  - Blockchain Engine (custom backend)
  - CoinGecko (crypto prices)
  - Open Exchange Rates (forex rates)

### Security
- **Authentication**: JWT (jose) + HTTP-only cookies
- **2FA**: Speakeasy (TOTP)
- **Rate Limiting**: In-memory (Redis recommended for production)
- **Password Hashing**: bcryptjs

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (via Supabase)
- Blockchain Engine API (custom backend)
- (Optional) Redis for production rate limiting

## 🛠️ Installation

### 1. Clone the repository

\`\`\`bash
git clone <repository-url>
cd clusteer-unified
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set up environment variables

Copy `.env.example` to `.env.local`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your values:

\`\`\`bash
# Required - Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Required - JWT (generate with: openssl rand -base64 32)
JWT_SECRET=your-secure-jwt-secret-minimum-32-characters

# Required - Blockchain Engine
BLOCKCHAIN_ENGINE_URL=http://localhost:8000
BLOCKCHAIN_ENGINE_API_KEY=your-api-key

# Required - Application
NEXT_PUBLIC_APP_URL=http://localhost:3001
\`\`\`

### 4. Set up Supabase database

Run the migration files in order:

1. Go to your Supabase project: https://app.supabase.com/project/_/sql
2. Run these SQL files:
   - `supabase-schema-clean.sql` (base schema)
   - `supabase/migrations/create_transactions_table.sql`
   - `supabase/migrations/create_orders_table.sql`
   - `supabase/migrations/create_notifications_table.sql`
   - `supabase/migrations/create_audit_logs_table.sql`
   - `supabase/migrations/add_2fa_columns.sql`
   - `supabase-migrations/create-internal-transfers-table.sql`

### 5. Set up Supabase Storage

1. Create a bucket named `user-uploads`
2. Set it to public for avatar access
3. Configure CORS if needed

### 6. Run the development server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3001](http://localhost:3001) in your browser.

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to set all required environment variables:

- Use strong JWT_SECRET (32+ characters)
- Set NODE_ENV=production
- Configure production Supabase credentials
- Set up production blockchain engine URL
- (Recommended) Set up Redis for rate limiting

### Security Checklist

Before deploying to production:

- [ ] All TypeScript errors fixed
- [ ] All ESLint errors fixed
- [ ] Strong JWT_SECRET set (32+ characters)
- [ ] KYC provider integrated (currently mock)
- [ ] Redis-based rate limiting configured
- [ ] Error monitoring set up (Sentry, etc.)
- [ ] SSL/TLS certificates configured
- [ ] Security headers verified
- [ ] Database backups configured
- [ ] Audit logs retention policy set

## 📁 Project Structure

\`\`\`
clusteer-unified/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── api/                      # API routes
│   │   ├── auth/                     # Auth callback
│   │   └── globals.css
│   ├── components/
│   │   ├── forms/                    # Form components
│   │   ├── modals/                   # Modal dialogs
│   │   ├── tables/                   # Data tables
│   │   └── ui/                       # Radix UI components
│   ├── hooks/                        # Custom React hooks
│   ├── lib/
│   │   ├── api/                      # API client functions
│   │   ├── api-middleware.ts         # API middleware utilities
│   │   ├── auth.ts                   # JWT utilities
│   │   ├── rate-limiter.ts           # Rate limiting
│   │   ├── supabase.ts               # Supabase clients
│   │   └── utils.ts
│   ├── store/                        # Zustand state stores
│   ├── providers/                    # React context providers
│   └── types.ts                      # TypeScript types
├── supabase/
│   └── migrations/                   # Database migrations
├── public/                           # Static assets
├── .env.example                      # Environment template
├── next.config.ts                    # Next.js config
├── tailwind.config.ts                # Tailwind config
└── tsconfig.json                     # TypeScript config
\`\`\`

## 🔐 Security

### Authentication Flow

1. User registers with email/password
2. Email verification required
3. Login with credentials
4. JWT token stored in HTTP-only cookie
5. Optional 2FA verification

### API Security

- Rate limiting on all endpoints
- Token validation on protected routes
- Input validation with Zod schemas
- SQL injection prevention (Supabase client)
- XSS prevention (input sanitization)

### Database Security

- Row Level Security (RLS) enabled
- User data isolation
- Audit logging on sensitive operations
- Automatic updated_at timestamps

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-otp` - Email OTP verification

### Wallet
- `GET /api/wallet` - Get user wallets
- `POST /api/transfer/internal` - Internal P2P transfer
- `GET /api/transfer/verify-recipient/[userId]` - Verify recipient

### Trading
- `POST /api/trade` - Execute trade (buy/sell)
- `GET /api/system/exchange-rate` - Get current rates

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile/update` - Update profile
- `PUT /api/user/avatar/update` - Upload avatar
- `GET /api/user/2fa/request` - Generate 2FA QR code
- `POST /api/user/[username]/2fa/validate` - Validate 2FA

### KYC
- `POST /api/kyc/verify` - Submit KYC verification
- `POST /api/kyc/reset` - Reset verification status

## 🧪 Testing

\`\`\`bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
\`\`\`

## 🔍 Development

### Code Quality

\`\`\`bash
# Type check
npm run type-check

# Lint
npm run lint

# Format code
npm run format
\`\`\`

### Database Migrations

To create a new migration:

1. Create SQL file in `supabase/migrations/`
2. Name it with timestamp: `YYYYMMDD_description.sql`
3. Run it in Supabase SQL editor

## 🐛 Known Issues & TODOs

### Critical (Must Fix Before Production)

- [ ] Integrate real KYC verification provider (currently mock)
- [ ] Implement actual wallet balance updates in blockchain engine
- [ ] Add Redis-based rate limiting
- [ ] Set up error monitoring (Sentry)
- [ ] Add email service integration
- [ ] Implement payment gateway
- [ ] Add comprehensive test suite

### Enhancements

- [ ] Add transaction confirmation emails
- [ ] Implement withdrawal functionality
- [ ] Add fiat deposit/withdrawal
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Mobile app (React Native)

## 📝 License

[Add your license here]

## 🤝 Contributing

[Add contribution guidelines here]

## 📞 Support

For support, email [your-email] or join our Slack channel.

---

## 🚨 Important Notes

### Before Production Deployment

1. **Security**: This application handles financial transactions. Conduct a professional security audit before going live.

2. **Compliance**: Ensure compliance with local regulations for cryptocurrency exchanges and financial services.

3. **KYC**: The current KYC implementation is a mock. Integrate a real KYC provider (Smile Identity, Youverify, etc.).

4. **Testing**: Add comprehensive test coverage (target: 70%+).

5. **Monitoring**: Set up error monitoring, logging, and alerting.

6. **Backup**: Configure database backups and disaster recovery.

7. **Rate Limiting**: Move to Redis-based rate limiting for production.

### Environment-Specific Configuration

**Development**:
- Use `.env.local` (not committed)
- Mock external services as needed
- Enable detailed logging

**Production**:
- Use environment variables from hosting platform
- Enable security headers
- Set up monitoring and alerting
- Use production database
- Enable Redis rate limiting

---

Built with ❤️ using Next.js, Supabase, and TypeScript
