# Clusteer — Product Requirements Document

**Document version:** 1.0
**Date:** April 22, 2026
**Source:** Reverse-engineered from the Clusteer monorepo
(`/Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app`)
**Scope:** Full product, covering every user-facing feature, backend service,
integration, and operational concern present in the codebase.
**Status:** Working draft — intended as the authoritative product description
for engineering, product, compliance, and business stakeholders.

---

## 0. How to read this document

This PRD was produced by auditing every module of the Clusteer codebase — the
unified Next.js web app, the Spring Boot API, the Django blockchain engine, the
legacy landing page and customer dashboard, the admin dashboard, and all
supporting scripts, CI/CD, and documentation. It describes Clusteer as it
exists today (a partially migrated, multi-service platform), not an idealized
future state. Where the codebase is incomplete, ambiguous, or in transition,
those facts are called out explicitly — they are product requirements too, just
ones that have not yet been met.

The document has three layers:

1. **Product layer** (Sections 1–6) — vision, users, journeys, goals.
2. **Functional and non-functional requirements** (Sections 7–9) — what the
   system must do, and how well.
3. **Technical, operational, and appendix layers** (Sections 10–17) —
   architecture, data model, API contracts, environment, deployment, and open
   issues.

---

## 1. Executive summary

Clusteer is a **crypto-fiat exchange and custodial wallet platform**
targeting Nigerian and (eventually) broader African users, with a primary use
case of **buying and selling USDT (and other stablecoins) against Naira and
other fiat currencies**. It offers:

- Email/password authentication with optional two-factor authentication.
- Regulated identity verification (BVN, NIN, passport) via a pluggable KYC
  provider architecture (Smile Identity primary; Youverify supported).
- Multi-chain custodial wallets (TRON, Solana, BSC, Ethereum, with USDT as the
  primary cross-chain asset) plus a fiat balance ledger.
- Fiat on-ramp and off-ramp via Paystack and Flutterwave, with a virtual
  account issuance path through VFD.
- Internal peer-to-peer (P2P) transfers, cross-chain USDT movement, and
  external crypto withdrawals.
- A rich customer dashboard: wallet, markets, trading, orders, transaction
  history, notifications, settings, privacy controls, account limits,
  data-export (NDPR / GDPR), and a support ticketing system.
- An administrative back-office for user management, KYC adjudication, wallet
  reconciliation, transaction review, settlement, order management, support
  operations, reporting, CMS, and system configuration.

Architecturally, Clusteer is transitioning from a Supabase-centric design to a
**three-backend architecture**:

- **Next.js 16 (clusteer-unified)** — web frontend and API routes. Vercel.
- **Spring Boot 3.3 / Java 21 (Clusteer-Api)** — user, admin, transaction,
  order, system preference, and notification services. PostgreSQL. Railway.
- **Django 5.1 / Python 3.13 (Clusteer-Blockchain-Engine)** — multi-chain
  custodial wallets, blockchain RPC integration, KYC orchestration, bank
  account and settings services, deposit webhooks, and WebSocket deposit
  notifications.
- **Firebase** provides authentication, file storage (KYC docs, avatars), and
  Cloud Messaging (FCM) for push.

Two legacy projects (`Clusteer-LandingPage`, `Clusteer-CustomerDashboard`) are
present in the monorepo but are being superseded by the unified Next.js app.
Supabase remains referenced by a small number of frontend routes (mostly
around 2FA) and is slated for removal. A working Supabase → PostgreSQL +
Firebase migration is in progress; significant scaffolding has been built,
but critical blockers remain before production launch (see §16).

---

## 2. Product vision and positioning

### 2.1 Vision

> **"Let anyone in Nigeria buy, sell, hold, and move stablecoins as easily as
> they send money to a friend."**

Clusteer's product wedge is **stablecoin ↔ Naira** with a focus on:

- **Instant settlement** for buys and sells via integrated fiat rails.
- **Custodial multi-chain wallets** so users don't think about seed phrases,
  gas, or chain selection unless they choose to.
- **Regulated-grade compliance** (BVN/NIN KYC, velocity limits, AML hooks,
  audit logs) so the service is defensible with regulators.
- **Fair rates** — explicit purchase mark-up and sale mark-down visible in
  system preferences; platform revenue accrues to a dedicated ledger.

### 2.2 What Clusteer is (per the code)

- A **custodial exchange**: user keys are generated, encrypted, and held by
  Clusteer in `UserBlockchain.private_key` (AES-256-GCM, custodial key).
  Vault wallets (`BscVaultWallet`, `TronsVaultWallet`, `SolVaultWallet`,
  `EthVaultWallet`) hold sweep destinations.
- A **trading venue** for buy/sell of USDT (primarily) and USDC, BTC, ETH
  (present in the `Order.crypto_currency` enum).
- A **P2P and cross-chain movement platform** for moving USDT between users'
  own wallets across chains.
- A **back-office** for compliance and ops (admin dashboard).

### 2.3 What Clusteer is not (today)

- It is **not a non-custodial wallet**. Keys are managed server-side.
- It is **not a DEX / AMM**. There is no on-chain liquidity pool; swaps are
  custodial and handled internally.
- It is **not a lending / yield / staking platform**. No such modules exist.
- It does **not support on-chain external send to arbitrary addresses for all
  users out of the box** — the external-send path is partial and, for some
  chains, placeholder-only (see §7.9).
- It does **not yet have a referral program**, despite the presence of
  sketches in marketing. No referral schema exists.

---

## 3. Goals, non-goals, and success metrics

### 3.1 Goals

- **G1 — Compliant onboarding**: a new user can register, verify identity
  with BVN or NIN, and be ready to trade within 10 minutes median,
  entirely self-service.
- **G2 — Instant USDT ↔ NGN**: buys and sells complete within one payment
  rail SLA (Paystack/Flutterwave ≤ 5 minutes for card, ≤ 15 minutes for bank).
- **G3 — Multi-chain custody**: users can receive and hold USDT on TRON, BSC,
  and Solana; swaps between chains are one-click.
- **G4 — Operational integrity**: every balance change is recorded in
  `transactions`/`WalletTransaction`; every administrative action in
  `EventRecord` / `KYCAuditLog`.
- **G5 — Defensible security posture**: PII encrypted at rest (Fernet),
  private keys encrypted at rest (AES-256-GCM), TLS in transit, JWT auth with
  HttpOnly cookies, admin claims enforced server-side.
- **G6 — Clean migration**: complete the exit from Supabase, so the system has
  one system of record per concern (Spring Boot for user/tx/order, Django for
  wallet/chain/KYC, Firebase for auth).

### 3.2 Non-goals (for the next two quarters)

- Building a mobile-native application (iOS/Android). Clusteer is
  mobile-responsive web; the landing page advertises an "App coming soon"
  download badge but no native project is in the repo.
- Supporting DeFi features (staking, lending, yield, AMM).
- On-chain custody for non-custodial users (non-custodial was not a design
  goal in the code reviewed).
- Fiat rails outside Africa — Paystack, Flutterwave, VFD, and Zepto Mail
  dominate the integration surface; no Stripe/PayPal/SEPA present.

### 3.3 Success metrics

| Metric | Definition | Target (TBD) | Instrumentation |
|---|---|---|---|
| Signup-to-KYC-approved rate | % of registered users who reach `KYCVerification.status=approved` within 24h | 70%+ | `KYCVerification.submitted_at`, `reviewed_at` |
| Time-to-first-trade | Median seconds from user creation to first completed `Transaction`/`Order` | < 24h | `users.dateJoined` → first `Transaction.dateCreated` |
| Buy success rate | Completed buys / initiated buys | > 95% | `Order.status` transitions |
| Withdrawal settlement SLA | P95 from `Order.status=processing` to `completed` | < 30 min (crypto), < 24 h (fiat) | `OrderStatusHistory` |
| KYC false-reject rate | KYCs manually overridden to approved after initial rejection | < 5% | `KYCAuditLog` |
| Ticket resolution | Median time from `SupportTicket.status=open` to `resolved` | < 24 h | `SupportTicket.created_at` → closure |
| Uptime (API layer) | Spring Boot + Django both available | 99.9% monthly | Actuator + Django health |
| Authentication failure rate | Failed logins / total login attempts | < 5% | `AccountSecurity.signInAttempts` |

---

## 4. Target users and personas

### 4.1 Primary personas

1. **"Ada" — the Naija stablecoin saver**, 28, Lagos, tech worker. Holds USDT
   as a hedge against Naira depreciation. Wants a clean mobile-web experience
   to convert salary to USDT and back. Needs: BVN KYC in one go; fair rates;
   instant bank payout; clear tax-friendly transaction history.
2. **"Tobi" — the remittance receiver**, 45, Ibadan. Family abroad sends USDT
   to a Clusteer wallet; he converts to Naira and withdraws to his bank. Key
   flows: Receive → Sell → Bank withdrawal. Needs: confidence that incoming
   USDT is detected (webhook), that payouts to his bank work, and that
   notifications reach him.
3. **"Chidi" — the cross-chain trader**, 32, Abuja. Moves USDT between TRC-20
   and BEP-20 to arbitrage gas and exchange fees. Needs: the cross-chain
   transfer flow, visible network fees, and a dependable list of supported
   chains.
4. **"Fatima" — the small-business accepter**, 38, Kano. Accepts USDT from
   international clients; wants to generate deposit addresses by chain and
   track incoming payments. Needs: receive flows with QR, webhook-driven
   transaction records, per-chain addresses, and filterable transaction
   exports.

### 4.2 Internal / back-office personas

5. **"Amara" — the compliance officer (super_admin)**. Reviews KYC,
   investigates flagged transactions, responds to regulator inquiries, issues
   account holds. Lives in `/admin/kyc`, `/admin/transactions`,
   `/admin/reports/compliance`.
6. **"Emeka" — the customer-support agent (admin / moderator role)**. Lives in
   `/admin/support`, `/admin/users`, and the user-detail view.
7. **"Ifeoma" — the finance / treasury lead (super_admin)**. Manages
   `/admin/wallets/bank-accounts`, settlements, reconciliation, and financial
   reporting (`/admin/reports/financial-summary`). Cares deeply about the
   `Revenue` table.
8. **"Dev-Ops" — the platform engineer**. Configures env vars in Railway and
   Vercel, rotates keys, watches `/actuator/health` and Django
   `/api/v1/health/`, manages Redis and deployment.

### 4.3 Role and permission model

- **Firebase custom claims** gate admin-tier access. Checked server-side at
  `/api/admin/auth/login`:
  - `admin=true`, or
  - `role ∈ {admin, super_admin, moderator}`.
- **Spring Boot `Role` enum** gates domain calls: `CUSTOMER`, `ADMIN`, `SUPER`.
- **Permission matrix** is referenced in `PHASE-1-IMPLEMENTATION-SUMMARY.md`
  with 16 distinct actions (users.read, users.update, users.delete,
  users.suspend, users.activate, kyc.approve, kyc.reject, transactions.review,
  …) but is not currently enforced granularly — today all admin-level users
  have the same access. Granular enforcement is an open requirement (§16).

---

## 5. Core user journeys

These journeys cite the actual routes, endpoints, and models involved. They
are reverse-engineered from the codebase; wherever a step relies on a feature
that is a stub, it is marked **(stub)**.

### 5.1 New user onboarding → first buy

1. User lands on `/` (marketing home inside clusteer-unified; the legacy
   `Clusteer-LandingPage` still exists but is being retired).
2. Clicks "Get Started" → `/signup`. Submits email, password, username, phone.
   Frontend posts to `POST /api/auth-firebase/register`.
   - Firebase Auth creates an account.
   - Spring Boot `POST /v1/user/register` persists a row in `users` and
     creates a `Wallet` record via `WalletServiceImpl.createWallet()`.
   - Email verification OTP is sent via SendGrid (primary) or Zepto Mail.
3. User verifies OTP at `/verify-otp`. On success, `emailVerified=true`.
4. Login at `/login` (`POST /api/auth-firebase/login`) returns an
   `auth_token` HttpOnly cookie.
5. User lands on `/dashboard`. Wallet panel calls `GET /api/wallet`, which
   proxies to Django `GET /api/v1/user/{user_id}/balance/`.
6. Before trading, the user must complete KYC. The dashboard surfaces a
   persistent "Complete KYC" banner linking to `/identity-verification`.
7. At `/identity-verification/verify`, the user chooses BVN or NIN:
   - Frontend posts to `POST /api/kyc/verify` which calls Django
     `POST /api/v1/user/{user_id}/kyc-verification/`.
   - Django's `KYCVerificationView` calls
     `SmileIdentityProvider.verify_bvn()` or `.verify_nin()`.
   - PII (BVN/NIN, phone, address) stored encrypted (`bvn_encrypted`,
     `nin_encrypted`, Fernet).
   - `KYCAuditLog` entry is written.
   - Documents (utility bill, selfie) uploaded to Firebase Storage via
     `POST /api/kyc/upload` (validates MIME, file signature, size caps).
8. When approved (`KYCVerification.status=approved`), the user can trade.
9. User opens `/trade`, enters amount in NGN, chooses USDT + network, submits.
   Frontend → `POST /api/trade` → Django `POST /api/v1/manual-trade/`
   (`SimpleBuySellView`) or Spring Boot `POST /v1/order/purchase/create` →
   Order created in `pending` with `exchange_rate`, `fiat_amount`, and
   `required_confirmations=6`.
10. Payment rail redirects to Paystack/Flutterwave. On success webhook, order
    → `completed`; USDT credited to user's `FiatBalance` / `UserBlockchain`
    balance; a `Transaction` (Spring Boot) and `WalletTransaction` (Django)
    row is created.

### 5.2 Receive USDT on-chain

1. User navigates to `/assets/USDT`, picks network (TRC-20, BEP-20, Solana).
2. `/assets/[asset]/receive` renders address + QR from the user's
   `UserBlockchain` record.
3. Sender transfers USDT on-chain. Tatum (or equivalent) hits the Clusteer
   webhook:
   - `POST /api/v1/tron/webhook/` (`TronUSDTWebhookView`)
   - `POST /api/v1/bsc/webhook/` (`BSCWebhookView`)
   - `POST /api/v1/solana/webhook/` (`SolanaDepositWebhookView`)
4. Django records the incoming transfer, updates the user's balance, and
   pushes a WebSocket event via `DepositNotificationConsumer` on channel
   `/ws/deposits/{user_id}/`.
5. FCM push and in-app notification surface the deposit to the user.
   (Push is wired server-side via Spring Boot's `PushNotificationServiceImpl`;
   in-app is stubbed in `useNotifications` — §7.14.)

### 5.3 Sell USDT → bank payout

1. User on `/trade` selects "Sell", amount in USDT, target bank.
2. The bank account must exist in `BankAccount` (`POST /api/v1/user/{user_id}/
   bank-accounts/`). If not, user is prompted to add one via
   `/settings/payment-methods`.
3. On confirm, `Order` created with `order_type=sell`, `status=pending`.
4. Spring Boot `BankService` (`VFDCreateAccountReq`, `VFDTransferReq`) issues
   a transfer via the VFD integration. `OrderStatusHistory` logs each
   transition.
5. When settled, Order → `completed`; user's USDT balance decremented;
   `Revenue` row written for the platform spread.

### 5.4 Cross-chain USDT transfer (same user)

1. On `/trade` or asset page, user selects "Convert USDT (cross-chain)".
2. `POST /api/v1/convert-usdt/` (`CrossChainUSDTTransferView`) debits USDT on
   the source chain and credits USDT on the destination chain, using the
   Clusteer vault wallets as liquidity. Fee estimate via
   `GET /api/v1/estimate-fee/`.

### 5.5 Internal P2P transfer

1. Sender enters recipient username/user_id. Frontend verifies via
   `GET /api/transfer/verify-recipient/{userId}`.
2. On confirm, `POST /api/transfer/internal` → Django
   `POST /api/v1/p2p-transfer/` (`InternalP2PTransferView`) moves USDT between
   the two users' `UserBlockchain` rows atomically.
3. Both users receive notifications; both see a `WalletTransaction` with
   `direction=p2p`.

### 5.6 External crypto withdrawal

1. User picks asset, enters external address + amount.
2. Wallet PIN challenge (`WalletServiceImpl.withdrawCrypto()` requires
   `Wallet.pinSet=true`).
3. `POST /api/v1/withdrawal-request/` (Django `MultiChainWalletWithdrawView`)
   signs and broadcasts the transaction using the custodial private key.
4. `GET /api/v1/withdrawal-status/{tx_id}/` polls until the required
   confirmations are reached.
5. Admin can manually settle / override via
   `POST /api/v1/admin/manual-transaction/` or Spring Boot's
   `POST /v1/wallet/crypto/settle`.

### 5.7 Compliance officer approves a KYC

1. Amara opens `/admin/kyc`; list is fetched from Spring Boot
   `GET /v1/user/pending/identities` or Django `KYCStatusView`.
2. Opens a case (`/admin/kyc/[id]`), reviews documents (Firebase Storage
   signed URLs) and provider payload.
3. Approves → `PUT /v1/user/{id}/identity/status/update` (Spring Boot) or
   Django `KYCVerificationView` state change. `KYCAuditLog` row written.
4. User receives notification; `/identity-verification` now shows "Approved".

### 5.8 Admin investigates a suspicious transaction

1. Emeka filters `/admin/transactions` by status / date / user / chain /
   amount via `GET /v1/transaction/filter`.
2. Opens a transaction detail page; copies `tx_id`, blockchain hash.
3. Can issue a manual adjustment via `AdminManualTransactionView` (Django) or
   manual settlement (Spring Boot).

### 5.9 Support interaction

1. User opens `/support`, creates a ticket (`POST /api/v1/user/{user_id}/
   support/tickets/`).
2. Ticket assigned unique `TICK-YYYYMMDD-XXXXX` ID.
3. Agent in `/admin/support/[id]` replies via
   `POST /api/v1/user/{user_id}/support/tickets/{ticket_number}/messages/`.
4. Ticket status progresses through `open → in_progress → resolved → closed`.

### 5.10 NDPR / GDPR data export

1. User hits `/settings/privacy` → "Request data export".
2. `POST /api/v1/user/{user_id}/data-export/` creates a `DataExportRequest`
   row in `pending`.
3. **(stub)** Async task to generate and email the archive is not yet
   implemented; the view marks the request but no worker picks it up
   (`TODO` in `DataExportRequestView`). This is an open requirement.

---

## 6. Non-goals / explicit out of scope (near term)

- Native mobile apps (iOS / Android).
- Peer-to-peer fiat marketplace (buyer–seller matching). Note: a `P2POrder`
  entity, `Chat` entity, and a partial order marketplace exist in the Spring
  Boot codebase; they are not surfaced in the active Next.js frontend and are
  considered dormant.
- DeFi features.
- Full-service lending / savings / card issuance.
- External send on all chains (explicitly partial, §7.9).

---

## 7. Functional requirements

This section is the heart of the PRD. Each sub-section describes a capability,
what the user can do, which backend services are responsible, and what is
implemented vs. pending vs. broken. Routes are from the active unified app
unless noted. API paths are rooted at `/api/v1/` for Spring Boot (with a
`/api` context path prefix) and for Django.

### 7.1 Authentication and session management

**User-facing behaviours**

- Registration (`/signup`): email, password (complexity enforced client-side),
  username, phone. Username and email uniqueness enforced server-side
  (`UserRepository.getUserByEmail`, `getUserByUsername`, `getUserByPhone`).
- Login (`/login`): email + password. On success, server issues a
  short-lived session via an `auth_token` HttpOnly cookie (1h expiry,
  `SameSite=Strict`, `Secure` in production, path `/`).
- Email verification (`/verify-email`, `/verify-otp`): six-digit OTP, 15-minute
  TTL. Stored in Spring Boot `EmailVerification` entity.
- Password reset (`/forgot-password`, `/reset-password`): Firebase
  `sendPasswordResetEmail`; token validated by Firebase.
- Logout (`/api/auth-firebase/logout`): clears cookie.
- Session middleware: no centralised `middleware.ts` today; each API route
  validates the cookie and decodes the Firebase JWT payload inline.

**Two-factor authentication**

- Setup at `/settings/security/google-auth` → TOTP secret generated by
  Speakeasy, QR rendered by `qrcode.react`.
- Validation: `PUT /v1/user/2fa/update`.
- Second-factor email OTP also supported via `EmailFactorAuthentication`
  entity (`POST /v1/user/send-email-otp`, `POST /v1/user/{username}/2fa/validate`).
- **Open issues:**
  - The 2FA endpoints under `/api/user/2fa/request` and
    `/api/user/[username]/2fa/validate` in the Next.js frontend still call
    Supabase (`supabaseAdmin`, `supabase()`). The Spring Boot backend
    supports 2FA natively (`AccountSecurity.twoFactor`); the frontend must be
    migrated to call Spring Boot instead.
  - Login flow does not yet branch into the 2FA challenge when
    `AccountSecurity.useTwoFactor=true`. Treat as pending requirement.

**Account security data (Spring Boot `AccountSecurity`)**

- Tracks `passwordHistory` (encrypted), last password change, sign-in
  attempts, saved devices, saved origins, sign-in attempt origins, last
  sign-in timestamp, 2FA enablement flags.
- Password hashing: BCryptPasswordEncoder; hash+salt additionally encrypted
  with Jasypt column encryption (`@Convert(StringCryptoConverter.class)`).

**Admin authentication**

- Admins authenticate via the same Firebase SDK. After a Firebase login, the
  admin panel calls `POST /api/admin/auth/login` with the Firebase `idToken`.
  The server verifies the token with Firebase Admin, inspects custom claims,
  and sets an `admin_token` cookie (8h, path `/admin`).
- Admin panel pages check this cookie before rendering.

### 7.2 User profile

- `/settings/profile`: view and edit avatar, first name, last name, DOB,
  gender, occupation, bio, phone, email. Mapped to
  `PUT /v1/user/profile/update`, which updates the `users` and `Address` JPA
  entities.
- Avatar upload: `POST /api/user/avatar/update` → Firebase Storage. MIME and
  file-signature validation enforced.
- FCM token registration: `PUT /v1/user/fcm/update`.
- Account deletion: `DELETE /v1/user/delete`.

### 7.3 Identity verification (KYC)

**Goal:** gate trading, withdrawals, and payouts behind a verified identity.

**Flow** (described in §5.1). Key characteristics:

- Supported document types (per Django):
  - BVN — 11-digit, Smile Identity / Youverify.
  - NIN — 11-digit, Smile Identity / Youverify.
  - Passport.
  - Address document (utility bill / bank statement) uploaded as PDF or image.
- Providers are pluggable (`p2p/kyc_provider.py`): `get_kyc_provider(name)`
  returns `SmileIdentityProvider` or `YouverifyProvider`.
- Confidence threshold: 80% for auto-approval (Smile).
- Data stored (all encrypted): `bvn_encrypted`, `nin_encrypted`,
  `phone_number_encrypted`, `address_encrypted`, `document_number_encrypted`,
  `address_document_url` (Firebase Storage).
- Provider response (JSON), confidence score, rejection reason, reviewer ID,
  submitted_at, reviewed_at tracked on `KYCVerification`.
- `KYCAuditLog` row written for every action (submit, view, update, approve,
  reject, export, delete) with `ip_address`, `user_agent`, `details`.

**File-upload rules (enforced at `/api/kyc/upload`)**

- Allowed MIME: JPEG, PNG, PDF, WebP.
- Max 5 MB per file, 15 MB total per submission.
- Magic-bytes check, not just MIME sniff.
- Storage: Firebase Storage bucket (`CLOUD_STORAGE_BUCKET`), reference saved
  in the KYC record.

**Duplicate-document protection**

- `POST /api/v1/user/{user_id}/check-duplicate-document/`
  (`CheckDuplicateDocumentView`) rejects submissions whose BVN/NIN is already
  approved against another account.

**Open issues (from `KYC-SECURITY-AUDIT.md`)**

- Legacy Supabase code path in `src/app/api/kyc/verify/route.ts` still
  present. Must be fully replaced with Django call.
- No rate limiting on KYC submissions — brute-force BVN risk.
- BVN partially visible in the UI (privacy leak).
- Race condition in duplicate-document check (no DB unique constraint /
  advisory lock) could allow two concurrent submissions to bypass dedup.
- Document upload directory not isolated — path-traversal and arbitrary write
  risk (requires enforced signed Firebase Storage URLs).
- Legitimacy verification (photo-of-photo, forged docs) not implemented.
- No user callback on approval/rejection (in-product or email).
- No timeout on upload (long-running requests not aborted).
- Some error messages leak internal structure (information disclosure).

### 7.4 Wallets and balances

**Model.** Each user has one `MultiChainWallet`, which fans out to one
`UserBlockchain` row per `(chain_name, token_type)` pair and a `FiatBalance`
row per currency.

- Supported chains in production: **TRON**, **Solana**, **BSC**, with
  **Ethereum** stubbed (vault model exists, sweep task is commented out).
- Primary token: `usdt`. `Order.crypto_currency` additionally lists `usdc`,
  `btc`, `eth` — marketing scope.
- Fiat currencies named in code: `ngn`, `usd`, `eur`, `gbp`. NGN is the
  production focus.
- Wallets are generated on `POST /api/v1/wallet/create/`
  (`MultiChainWalletCreateView`) and on user registration (Spring Boot
  `WalletServiceImpl.createWallet`).

**Key management**

- BSC / ETH: `eth_account.Account.create()`; private key encrypted with
  `CUSTODIAL_WALLET_ENCRYPTION_KEY` (AES-256-GCM).
- TRON: `tronpy.keys.PrivateKey()`; new TRON wallets require 30 TRX
  activation.
- Solana: `solders.keypair.Keypair()`; ATA (Associated Token Account) created
  on first SPL-USDT transfer.
- Vaults: one per chain (`BscVaultWallet`, …); key encrypted with
  `VAULT_WALLET_ENCRYPTION_KEY` (separate from custodial key).

**Balance display (`/assets`, `/assets/[asset]`)**

- Fetched through `GET /api/wallet` → Django
  `GET /api/v1/user/{user_id}/balance/` (`UserBalanceView`).
- Per-chain USDT balance computed from live RPC if stale; otherwise from
  cached `UserBlockchain.balance`.
- User's FiatBalance row rendered alongside.

**Wallet PIN (Spring Boot)**

- Separate from account password. Required for withdraw / transfer / swap.
- `Wallet.pinSet`, `pinHash`, `pinSalt`. Endpoints:
  `PUT /v1/wallet/pin/create`, `/pin/change`, `/pin/recover`, `/pin/reset`
  (the last is `SUPER`-only and public-entry for admin reset).

### 7.5 Markets and exchange rates

- `/markets` shows price history, 24h change, market cap, and an embedded
  lightweight-charts ticker. Data sources:
  - CoinGecko (implicit — no key).
  - `er-api.com` for fiat rates.
  - Fallback to internally cached values for rate-limit safety.
- `GET /v1/system/exchange-rate` (Spring Boot) exposes a unified rate
  endpoint using `PreferenceServiceImpl.getExchangeRate()`, which delegates
  to the Blockchain Engine (`BlockchainServiceImpl.getExchangeRate`).
- System preferences (`Preference`): `purchaseMarkUp`, `saleMarkDown`, `vat`,
  `withdrawalFee`, `transactionFee`, `fiatFee` set by super admins; these
  modify the displayed rates.

### 7.6 Buy crypto (fiat → crypto)

- Entry: `/trade` (tab = Buy) or `buy-crypto-form.tsx`.
- Inputs: fiat amount, fiat currency (default NGN), target crypto (USDT
  default), network (TRC-20 / BEP-20 / Solana), payment method
  (card / bank transfer / mobile money).
- Flow:
  1. Frontend fetches rate via `GET /api/system/exchange-rate`.
  2. On confirm → `POST /api/trade` → Django
     `POST /api/v1/manual-trade/` (`SimpleBuySellView`) or Spring Boot
     `POST /v1/order/purchase/create` (`CreateP2PPurchaseOrder`).
  3. Order created with `status=pending`, `crypto_amount`, `exchange_rate`,
     `fiat_amount`, `platform_fee`, `expires_at`.
  4. User redirected to Paystack/Flutterwave.
  5. Payment-rail webhook hits Spring Boot `POST /v1/wallet/fiat/webhook`
     (`WalletServiceImpl.processFiatWebhook`). Status → `processing` →
     `completed` on success. USDT credited.
  6. `Transaction` and `Revenue` rows written.

### 7.7 Sell crypto (crypto → fiat)

- Entry: `/trade` (tab = Sell) or `sell-crypto-form.tsx`.
- Preconditions: KYC approved, bank account on file, wallet PIN set, USDT
  balance ≥ sell amount.
- Flow:
  1. Rate fetch.
  2. `POST /v1/order/sale/create` (`CreateP2PSaleOrder`) → order in
     `pending`.
  3. USDT debited (escrowed server-side); vault absorbs it.
  4. Spring Boot `BankService` (`VFDTransferReq`) initiates bank transfer.
  5. VFD callback (`VFDCallbackReq`) triggers status completion.
  6. `Revenue` captures the spread.

### 7.8 Swap (crypto ↔ crypto)

- Implemented server-side: `POST /v1/wallet/crypto/swap`
  (`WalletServiceImpl.swapCrypto`, `BlockchainServiceImpl.swapUsdt`,
  `SwapUsdtRes`).
- **UI status:** No dedicated swap widget in the active Next.js frontend. A
  `stable-coin-converter.tsx` component exists but is not wired to a route.
  **Gap:** swap UI → `POST /v1/wallet/crypto/swap` plumbing needs to be
  added before swap is user-facing.

### 7.9 Send / receive / withdraw / deposit

**Receive** (implemented): `/assets/[asset]/receive` displays address + QR;
incoming funds credited via webhook handlers §5.2. Per-chain separate address
is rendered.

**Internal send** (implemented): `/assets/[asset]/send` calls
`POST /api/transfer/internal` → Django `InternalP2PTransferView`. Recipient
resolved by username via `GET /api/transfer/verify-recipient/{userId}`.

**External crypto withdraw** (partial):
- Spring Boot endpoint `POST /v1/wallet/crypto/withdraw` with
  `WithdrawCryptoRequest`.
- Django executor `POST /api/v1/withdrawal-request/`
  (`MultiChainWalletWithdrawView`) with chain-specific transfer functions:
  `transfer_bsc_usdt()`, `transfer_sol_usdt()`, `transfer_tron_usdt()`.
- **Status:** `withdrawals.py` calls `generate_random_tx_hash()` as a
  placeholder in some code paths — real tx hash must come from the signed
  broadcast. This is a critical correctness issue (flagged in §16).
- ETH send is commented out (no auto-sweep task either).

**External fiat deposit / virtual accounts**:
- `BankService` wraps VFD (Virtual Fund Dynamics) for virtual account
  creation, beneficiary enquiry, and transfer: `createVirtualAccount`,
  `verifyAccount`, `transferFunds`, plus the full VFD DTO suite
  (`VFDCreateAccountReq`, `VFDTsqRes`, `VFDRenewAccessReq`…).
- VFD callback endpoint handles status updates.

**Deposit detection (crypto)**:
- Tatum (external service) calls Clusteer webhooks on new incoming
  transactions. See §5.2 for endpoints. Webhook signature verification
  (`webhook_security.py`) is defined but **not enforced** in the current
  webhook views (see §16).

### 7.10 Bank accounts

- User-facing: `/settings/payment-methods`.
- Data: Django `BankAccount` model — `user_id`, `bank_name`, `account_number`,
  `account_name`, `is_default`, `is_verified`. Unique constraint
  `(user_id, bank_name, account_number)`.
- Endpoints:
  - `GET /api/v1/user/{user_id}/bank-accounts/` — list.
  - `POST /api/v1/user/{user_id}/bank-accounts/` — create.
  - `GET|PUT|DELETE /api/v1/user/{user_id}/bank-accounts/{account_id}/`.
- Admin view: `/admin/wallets/bank-accounts` — settlement accounts for the
  platform.

### 7.11 Orders

- Model: Django `Order` + `OrderStatusHistory`; additionally Spring Boot
  `P2POrder` + `Chat` (dormant, P2P marketplace).
- Order statuses: `pending`, `processing`, `completed`, `cancelled`, `failed`.
- Required blockchain confirmations (default): 6.
- User views: `/orders`, `/markets`, `/trade`, `/admin/orders`.
- Endpoints:
  - User: `GET /api/v1/user/{user_id}/orders/` (list/create),
    `GET /api/v1/user/{user_id}/orders/{order_id}/` (detail/update).
  - Spring Boot: `GET /v1/order`, `/v1/order/{id}`, `/v1/order/all`,
    `/v1/order/filter/date`, `/v1/order/filter/status`,
    `POST /v1/order/purchase/create`, `POST /v1/order/sale/create`.
- In-order chat (Spring Boot): `POST /v1/order/message/{token}/send`,
  `PUT /v1/order/messages/{token}/read`.

### 7.12 Transactions and history

- `/transaction-history` — user view (paginated, filterable by type, status,
  currency, flow, date range).
- Spring Boot endpoints:
  - `GET /v1/transaction/user` — current user's transactions.
  - `GET /v1/transaction/user/{id}` — admin.
  - `GET /v1/transaction/{ref}` — lookup by reference.
  - `GET /v1/transaction/all` — admin.
  - `GET /v1/transaction/filter` — multi-parameter filter
    (`currency`, `type`, `flow`, `status`, `startDate`, `endDate`,
    `page`, `size`).
- `Transaction` columns: `ref` (unique), `orderNumber`, `chain`, `currency`,
  `amount`, `rate`, `info`, `flow` (in/out), `status`, timestamps.
- `Revenue` rows track platform spread per transaction.
- Export: CSV/JSON/Excel via `export-utils.ts` + Apache POI on Spring Boot
  side (`ExportService`, `PreferenceServiceImpl.exportSystemData`).

### 7.13 Notifications

**In-app notifications**

- Model: Spring Boot `Notification` — `type`, `title`, `body`, `extras`,
  `read`, `dateCreated`, `dateUpdated`.
- Endpoints: `GET /v1/notifications`, `PUT /v1/notifications/{id}/read`,
  `DELETE /v1/notifications/{id}/delete`, `DELETE /v1/notifications/clear`.
- Frontend hook `use-notifications.ts` currently returns empty data
  (no-op) — placeholder pending frontend wiring.

**Push notifications**

- Backend: Spring Boot `PushNotificationServiceImpl` using FCM.
- Users register device tokens via `PUT /v1/user/fcm/update` (field
  `User.fcm`, up to 2048 chars).

**Notification preferences**

- Model: Django `NotificationPreferences` — `email_transactions`,
  `email_security`, `email_marketing`, `email_order_updates`,
  `sms_transactions`, `sms_security`, `sms_order_updates`,
  `push_transactions`, `push_security`, `push_price_alerts`.
- Endpoints: `GET|PUT /api/v1/user/{user_id}/notifications/preferences/`.
- UI: `/settings/notifications`.

**Email / SMS transport**

- Email: SendGrid primary (`SENDGRID_API_KEY`), Resend backup, Zepto Mail
  integrated via Spring Boot `MailService` (`zepto.mail.api.key`).
- SMS: Termii stub (`TERMII_API_KEY`) — not yet wired into main flow.

### 7.14 Privacy settings and account limits

**Privacy (`/settings/privacy`)**

- Django `PrivacySettings`: `profile_visibility`,
  `transaction_history_visibility`, `analytical_cookies`, `marketing_cookies`,
  `third_party_sharing`.
- Endpoints: `GET|PUT /api/v1/user/{user_id}/privacy-settings/`.

**Account limits**

- Django `AccountLimits`: `daily_withdrawal_limit` and `…_used`,
  `daily_deposit_limit` and `…_used`, `monthly_withdrawal_limit` and
  `…_used`, `monthly_deposit_limit` and `…_used`, `daily_reset_date`,
  `monthly_reset_date`, `limit_currency`.
- Endpoints: `GET|PUT /api/v1/user/{user_id}/account-limits/`.
- **Gap:** reset logic (`reset_daily_limits`, `reset_monthly_limits`) exists
  but is not wired into any scheduled job. Daily/monthly rollover must be
  triggered manually today. Requirement: schedule a Celery Beat task (§16).

### 7.15 Data export (NDPR / GDPR)

- Django `DataExportRequest`: `user_id`, `request_type`, `status`
  (`pending`, `processing`, `completed`, `failed`), `requested_at`,
  `completed_at`.
- Endpoint: `POST /api/v1/user/{user_id}/data-export/`.
- UI: `/settings/privacy` → "Request data export".
- **Gap:** async task to materialise the archive is not implemented (TODO
  in `DataExportRequestView`). Must produce a ZIP of user's transactions,
  orders, KYC metadata, wallets, notifications, and deliver via signed
  Firebase Storage URL or email link.

### 7.16 Support and help

- User: `/support`, `/support/[ticketNumber]`, `/support/help/[topic]`.
- Agent: `/admin/support`, `/admin/support/[id]`.
- Models: `SupportTicket` (with auto-generated `TICK-YYYYMMDD-XXXXX`
  numbering), `TicketMessage`, `SupportFAQ`.
- Endpoints:
  - `GET|POST /api/v1/user/{user_id}/support/tickets/`
  - `GET /api/v1/user/{user_id}/support/tickets/{ticket_number}/`
  - `POST /api/v1/user/{user_id}/support/tickets/{ticket_number}/messages/`
  - `GET /api/v1/support/faqs/` (public).
- Attachment uploads supported via Firebase Storage (URL stored as
  `attachment_url` on `TicketMessage`).

### 7.17 Admin dashboard

Routes and capabilities (complete list):

- `/admin` — metrics dashboard (users, volume, KYC pending, alerts).
  Spring Boot `GET /v1/system/dashboard` returns aggregates.
- **Users:** `/admin/users`, `/admin/users/[id]`. Actions: list (paginated,
  search, filter by status / KYC / created date), view detail, suspend,
  activate, KYC reset. Suspend / activate flip Firebase custom claims
  server-side; profile updates flow to Spring Boot.
- **Admins:** `/admin/admins`. Super admins create/edit/delete admin users,
  assign roles, toggle status. Spring Boot `/v1/admin/*`.
- **KYC:** `/admin/kyc`, `/admin/kyc/[id]`. Adjudication queue: list pending
  identity & address verifications; approve, reject with reason, request
  resubmission; batch operations. Full audit trail.
- **Wallets:**
  - `/admin/wallets` — overview of platform liquidity.
  - `/admin/wallets/users/[userId]` — user wallet snapshot.
  - `/admin/wallets/transactions/[id]` — transaction detail + audit.
  - `/admin/wallets/bank-accounts` — platform settlement accounts.
  - `/admin/wallets/withdrawals` — withdrawal request queue.
  - `/admin/wallets/networks` — blockchain network config
    (`CreateBlockchain`, `EditBlockchain`, `/v1/system/chain/*`).
  - `/admin/wallets/settlements` — settlement history.
  - `/admin/wallets/reconciliation` — reconciliation UI.
- **Transactions:** `/admin/transactions`, `/admin/transactions/[id]`. Stats
  cards (total volume, success rate, avg fee), full filterable ledger,
  copy tx ID / blockchain hash, status colour-coding.
- **Orders:** `/admin/orders` — queue, cancellation, manual fulfilment.
- **Support:** `/admin/support`, `/admin/support/[id]`. Same data as the user
  side plus agent workflow.
- **Content:** `/admin/content`, `/admin/content/[id]` — CMS for marketing /
  help pages (implementation depth: scaffolded).
- **Reports:**
  - `/admin/reports/financial-summary` — P&L, TVL, settlement status.
  - `/admin/reports/compliance` — KYC stats, AML alerts, sanctions.
  - `/admin/reports/user-activity` — DAU, MAU, volume, cohorts.
  - Export formats: XLSX (Spring Boot `ExportService`, Apache POI),
    CSV, JSON.
- **Settings:**
  - `/admin/settings/api-keys`.
  - `/admin/settings/audit-logs` — immutable trail from `EventRecord`
    (Spring Boot) and `KYCAuditLog` (Django).
  - `/admin/settings/alerts` — threshold-based alerts.
  - `/admin/settings/integrations` — 3rd-party service config.
  - `/admin/settings/backup` — data backup / restore controls.
- **System preferences:** `PUT /v1/system/preferences/update` controls
  `vat`, `purchaseMarkUp`, `saleMarkDown`, `withdrawalFee`, `transactionFee`,
  `fiatFee`, social handles, privacy/terms links, Android/iOS min app
  versions (future).
- **Payment methods:** `POST /v1/system/payment-method/create`,
  `PUT /v1/system/payment-method/{id}/update`, `DELETE`; listed publicly
  via `GET /v1/system/payment-methods`.
- **Parameter management:** dynamic key/value config
  (`GET /v1/system/parameters`, `PUT /v1/system/parameter/{key}/update`).
- **Data export:** `GET /v1/system/data/{type}/export` — user, transaction,
  order, revenue, wallet exports as XLSX.

**Admin role-gating today:** all admin actions succeed if the caller holds
the admin cookie; no granular per-action permission matrix is enforced.
This is an explicit gap (§16); the matrix is already designed in
`PHASE-1-IMPLEMENTATION-SUMMARY.md` (16 actions).

### 7.18 System configuration surface

Exposed to admins and — for some things — to clients.

- **Blockchain chains:** `Blockchain` entity (name, code, `fee`, `active`).
  CRUD via `/v1/system/chain/*`. Listed publicly at `/v1/system/chains`.
- **Payment methods:** `PaymentMethod` entity. CRUD via
  `/v1/system/payment-method/*`. Listed publicly at
  `/v1/system/payment-methods`.
- **System preferences:** branded assets, social, legal links, min app
  versions, fee schedule.
- **Parameter store:** dynamic key/value via `Parameter` entity.
- **Event log:** `EventRecord` — category, description, origin, timestamp;
  ties every significant admin or user action for audit.

### 7.19 Marketing / public pages

- `/` (homepage inside clusteer-unified) — hero, features, converter widget,
  testimonials, FAQ, CTAs, footer.
- `/privacy-policy`, `/terms-of-service`, `/security-info`.
- Separate project `Clusteer-LandingPage` serves the same purpose and is
  built to be sunset. It uses Next.js 15.3.3 + React 19, Tailwind 4, Motion,
  `@tanstack/react-query`, Axios, Radix-less Lucide icons; fetches exchange
  rates from `NEXT_PUBLIC_API_URL`.

### 7.20 Legacy customer dashboard

Project `Clusteer-CustomerDashboard` (Next.js 15.3.4) exists for historical
reasons. It implements: login, signup, email/OTP verification, forgot /
reset password, wallet list, asset detail with send/receive, buy/sell tabs
with real-time rates, transaction history, orders table, identity
verification (BVN + NIN), security hub (change password, change email,
Google Authenticator 2FA), and FCM push integration. It is functionally
duplicated by `clusteer-unified` and is considered dormant. Any product
changes must be made only in `clusteer-unified`.

---

## 8. Non-functional requirements

### 8.1 Security

- **TLS everywhere**: HSTS 2 years, preload. `Strict-Transport-Security`
  header set in `next.config.ts`.
- **Browser headers** (Next.js): `X-Frame-Options: SAMEORIGIN`,
  `X-Content-Type-Options: nosniff`, `X-XSS-Protection: 1; mode=block`,
  `Referrer-Policy: origin-when-cross-origin`, `Permissions-Policy`
  restricting camera, microphone, geolocation; CSP with `connect-src` for
  Firebase / CoinGecko only.
- **Cookies**: `auth_token` (HttpOnly, Secure in prod, SameSite=Strict, 1h,
  path=/). `admin_token` (HttpOnly, Secure, SameSite=Strict, 8h,
  path=/admin).
- **JWT**: Firebase-issued; verified server-side with Admin SDK (claims
  inspected for admin access).
- **Spring Boot security**: BCryptPasswordEncoder; Spring Security filter
  chain with stateless session policy and JWT filter; method-level
  `@PreAuthorize` by role (`CUSTOMER`, `ADMIN`, `SUPER`).
- **Column encryption (Spring Boot)**: Jasypt `StringCryptoConverter`
  encrypts `passwordHash`, `passwordSalt`, `passwordHistory`, `data`
  (wallet metadata). Algorithm today is PBEWithMD5AndDES — this is legacy
  and should be upgraded to `PBEWithHmacSHA256AndAES_256` (§16).
- **Custodial private-key encryption (Django)**: AES-256-GCM with a
  96-bit nonce; single key (`CUSTODIAL_WALLET_ENCRYPTION_KEY`) today, no
  versioning.
- **Vault private-key encryption**: separate key
  (`VAULT_WALLET_ENCRYPTION_KEY`).
- **PII encryption (Django)**: Fernet (`DJANGO_ENCRYPTION_KEY`) on
  KYC fields.
- **File upload**: MIME + signature validation, size caps, Firebase Storage
  backend with bucket-specific rules.
- **Rate limiting**: Custom in-memory with Upstash Redis optional path;
  `RateLimitPresets.strict` (5/min) on auth, `moderate` (20/min) on trade.
- **Webhook security**: `webhook_security.py` defines HMAC-SHA256
  verification; views do not yet enforce it. Spring Boot
  `/v1/wallet/blockchain/webhook` and `/v1/wallet/fiat/webhook` are public
  and lack signature validation. Both are open issues.
- **Audit logs**: `EventRecord` (Spring Boot), `KYCAuditLog` (Django),
  `OrderStatusHistory` (Django).
- **Admin claim validation**: enforced on `POST /api/admin/auth/login`.

### 8.2 Performance

- Frontend: Next.js 16 with Turbopack dev, React 19, standard Next.js
  server-component caching.
- Server: Spring Boot on Railway (default 8080; prod 8089). Spring Data
  repositories use pagination (`PaginationQuery`); indexes on
  `transactions(user_id)`, `transactions(username)`, `notifications(user_id)`,
  `wallet_assets(owner)`, `revenue(dateCreated)`, etc.
- Redis cache integration is provisioned but disabled
  (`spring.autoconfigure.exclude`) — enable for hot paths in production.
- Django uses LocMemCache in dev, Redis in prod for Celery broker, result
  backend, and Channels layer.
- Concurrent login / multi-device not bounded — `AccountSecurity.savedDevices`
  tracks but does not enforce limits.

### 8.3 Availability and reliability

- Each service independently deployable (Railway, Vercel).
- Health endpoints: `/api/actuator/health` (Spring Boot), Django's
  `health_urls.py`.
- Restart policy (Railway): `ON_FAILURE`, max 10 retries.
- Database backups: `scripts/backup-database.sh` and `restore-database.sh`
  (gzip-compressed dumps, 30-day retention).
- No circuit breakers on outbound integrations today (blockchain RPC, VFD,
  Zepto, Smile, Youverify). Resilience4j is not integrated.

### 8.4 Observability

- Error tracking: Sentry scaffolded (`NEXT_PUBLIC_SENTRY_DSN`,
  `SENTRY_AUTH_TOKEN`); not configured in production yet.
- Logs: Django writes to `/logs/`. Spring Boot logs to stdout; log level
  controllable per profile.
- Metrics: Spring Actuator default endpoints. No Prometheus / Grafana.
- Codecov: unit-test coverage uploaded via CI.

### 8.5 Accessibility

- Radix UI primitives used throughout (dialog, dropdown, tooltip, etc.) —
  provides focus management and keyboard navigation by default.
- Sonner for toast with ARIA support.
- `ADMIN-DASHBOARD-COMPLETE.md` notes modal focus-management fixes applied;
  WCAG compliance improvements are documented but a formal audit is a gap.
- Dark / light mode: `next-themes` toggle.
- Responsive: Tailwind breakpoints; `use-mobile.ts` hook.

### 8.6 Compliance

- **KYC/AML**: BVN/NIN via Smile Identity (primary) / Youverify. Full audit
  trail. Rejection reason stored.
- **NDPR / GDPR**: `PrivacySettings`, `DataExportRequest`, account deletion
  endpoint (`DELETE /v1/user/delete`). Retention windows not explicitly
  encoded.
- **Consent**: analytical / marketing / third-party cookie switches on
  `PrivacySettings`.
- **Regulatory reporting**: compliance report view in admin
  (`/admin/reports/compliance`); raw data in `KYCAuditLog`, `Transaction`,
  `Order`.

### 8.7 Internationalisation

- No i18n library integrated today. Strings are English-only. Future
  requirement if Clusteer expands outside Nigeria.
- Currencies: multi-currency supported in data model (`Order.fiat_currency`:
  `ngn`, `usd`, `eur`, `gbp`). Active UI currency is NGN.

---

## 9. Architecture

### 9.1 High-level topology

```
+-----------------------------+           +---------------------+
|  Vercel                     |           |  Firebase           |
|  Next.js 16 clusteer-unified|<--------->|  Auth, Storage, FCM |
+--------------+--------------+           +---------+-----------+
               |                                    |
               | HttpOnly auth_token cookie         | Server SDK
               | + Spring Boot API key              | verifyIdToken
               v                                    v
+--------------+--------------+           +---------+-----------+
|  Railway                    |           |  Railway / VPS      |
|  Spring Boot 3.3 / Java 21  |<--------->|  Django 5.1 / Py 3.13|
|  Clusteer-Api               |  REST +   |  Clusteer-Blockchain|
|  PostgreSQL 16              |  API key  |  PostgreSQL / SQLite|
+--------------+--------------+           +---------+-----------+
               |                                    |
               | JDBC                               | web3 / tronpy / solders
               |                                    v
               v                           +--------+--------+
      +--------+--------+                  | Blockchain RPCs |
      |  PostgreSQL     |                  | BSC, ETH, TRON, |
      |  (primary store)|                  | Solana          |
      +-----------------+                  +-----------------+

Outbound: Paystack, Flutterwave, VFD (bank), SendGrid, Resend,
Zepto Mail, Termii (SMS), Smile Identity, Youverify, Tatum (deposit webhooks),
CoinGecko, er-api.com, Upstash Redis, Sentry.
```

### 9.2 Frontend: clusteer-unified

- Next.js 16.1.1, React 19.2.3, TypeScript 5 strict, Tailwind 4, Radix UI,
  Lucide + Tabler icons, Motion, next-themes.
- State: Zustand stores (`user`, `wallet`, `modal`, `breadcrumb`).
- Data: TanStack Query 5 + devtools; Axios 1 for Spring Boot; fetch for
  Django.
- Forms: React Hook Form 7 + Zod 3 + `@hookform/resolvers`.
- Tables: TanStack Table; charts: Recharts + lightweight-charts.
- Auth SDK: Firebase 12 client; Firebase Admin 13.6 server-side
  (`src/lib/firebase-admin.ts`).
- Error tracking: Sentry SDK `@sentry/nextjs` 10.33 (DSN optional).
- 2FA: Speakeasy + qrcode.react.
- Email backends: SendGrid 8, Resend 3.
- Rate limiting: `src/lib/rate-limiter.ts` (in-memory) with
  `src/lib/redis-rate-limiter.ts` (Upstash) fallback; `USE_REDIS_RATE_LIMITING`
  toggles.

### 9.3 Frontend: landing and legacy dashboard

Summarised in §7.19 and §7.20. Both use Next.js 15.x, Tailwind 4, Radix,
TanStack Query. `Clusteer-CustomerDashboard` additionally ships a
Firebase Cloud Messaging service worker (post-build script copies SW).

### 9.4 Backend: Spring Boot API

- Spring Boot 3.3.3, Java 21, Maven.
- Modules: web, actuator, validation, security, data-jpa, data-redis,
  mail, opencsv, Apache POI (5.2.5 + 5.3.0), Firebase Admin 9.3,
  Jasypt 1.9.3, jjwt 0.11.5, Google Authenticator 1.5.0, Zxing 3.4.1,
  UAP Java 1.6.0, Jackson, Lombok, PostgreSQL driver.
- Context path: `/api`; dev profile `iacc` on 8080; prod on 8089.
- Redis autoconfigured but disabled. Jedis 5.2.0 available.
- DB schema auto-update (`spring.jpa.hibernate.ddl-auto=update`) — risky for
  production; migration-based DDL (Flyway/Liquibase) is an open gap.
- File uploads: 100 MB file, 25 MB request.
- Actuator health endpoint exposed.
- No automated tests in `src/test` — an explicit gap.

### 9.5 Backend: Django blockchain engine

- Django 5.1.10, DRF 3.16.0, Python 3.13.
- ASGI (Daphne) + WSGI (Gunicorn) options.
- Channels 4 for WebSocket; Redis channel layer in prod.
- Celery 5.5.3 + django-celery-beat 2.7.0. Three scheduled sweep tasks
  (BSC 02:00 UTC, Solana 02:20 UTC, TRON 02:40 UTC).
- drf-spectacular 0.28.0 for OpenAPI schema (`/api/v1/schema/`),
  Swagger UI (`/swagger/`), ReDoc (`/docs/`).
- Single Django app `p2p` hosting wallets, KYC, orders, support, settings,
  notifications, etc. The `website` project wraps it.

### 9.6 Data stores

- **PostgreSQL** (Spring Boot + Django in prod). Spring Boot owns the user /
  transaction / order / revenue / preference / parameter / event tables.
  Django owns the multi-chain wallets / chain assets / KYC / bank accounts /
  support / settings tables. They must converge on a single Postgres instance
  with separate schemas, or otherwise be carefully reconciled.
- **Firebase Realtime Database / Firestore** — present in
  `firebase-admin-realtime.ts` for admin realtime listeners. Limited use.
- **Firebase Storage** — KYC docs, avatars, ticket attachments.
- **Redis** — Celery broker, Channels layer, Upstash for rate limiting.
- **SQLite** — Django dev-only fallback.
- **Supabase** — legacy; being retired. Schemas in
  `clusteer-unified/supabase-migrations/`: `users`, `wallets`, `transactions`,
  `orders`, `notifications`, `audit_logs`, `verification_requests`, with
  2FA columns (`two_factor_secret`, `two_factor_enabled`).

---

## 10. Data model (reference)

This section enumerates the entities that define Clusteer's business state.
Field lists are abbreviated; the canonical source is the code cited.

### 10.1 Spring Boot JPA entities (Clusteer-Api)

- **User** (`users`): id, username (unique), email (unique), phone (unique),
  firstName, lastName, dob, gender, occupation, avatar, fcm (2048 char),
  type, role (enum), active, passwordHash (enc), passwordSalt (enc),
  emailVerified, dateJoined, dateUpdated. OneToOne `UserKyc`, OneToOne
  `Address`.
- **UserKyc** (`kycs`): identity, idType, idNumber, idExpiry, status,
  idVerified.
- **Address**: embedded user address.
- **AccountSecurity** (`security`): passwordHistory (enc, 2500c), active,
  token (1000c), useTwoFactor, twoFactor (unique), useEmailFactor,
  savedDevices (2500c), savedOrigins (2500c), signInAttempts,
  signInAttemptOrigins, lastSignIn, lastPasswordChange.
- **EmailVerification**, **EmailFactorAuthentication**, **Recovery** — OTP /
  recovery support.
- **Admin** (`admins`): admin users mirroring User with role SUPER/ADMIN.
- **Wallet** (`wallets`): owner (FK), pinSet, pinHash, pinSalt.
- **WalletAsset** (`wallet_assets`): owner, name, currency, code, data (enc,
  10000c), balance (BigDecimal), timestamps.
- **BlockchainWallet** (`p2p_multichainwallet`): OneToMany `BlockchainAsset`.
- **BlockchainAsset**: chain-level asset for a BlockchainWallet.
- **Transaction** (`transactions`): user (FK), username, type, title, ref
  (unique), orderNumber, chain, currency, amount, rate, info (5000c), flow,
  description, status, timestamps.
- **Revenue** (`revenue`): transaction (unique FK), currency, amount,
  dateCreated.
- **P2POrder** (`p2p_orders`): user, number (unique), type, chain, ref
  (unique), amount, rate, paymentMethod, note (5000c), status, dateOrdered,
  dateSettled.
- **Chat** — P2P order in-thread messaging.
- **Notification** (`notifications`): user, type, title, body, extras
  (5000c), read, timestamps.
- **Preference** (`preferences`): key (unique), name, address, website,
  email, phone, socials, privacy, terms, androidMinVersion,
  iosMinVersion, vat, purchaseMarkUp, saleMarkDown, withdrawalFee,
  transactionFee, fiatFee.
- **Blockchain** (`blockchains`): name, code (unique), fee, active.
- **PaymentMethod** (`payment_methods`): name, code (unique), icon (1000c),
  active.
- **Parameter** — key/value store.
- **EventRecord** (`events`): userId, userType, category, description,
  origin, timestamp.
- **GFBCredentials** — Firebase credentials value object.

### 10.2 Django models (Clusteer-Blockchain-Engine)

- **APIKey**: key (64c, unique), name, is_active, created_at.
- **MultiChainWallet**: user_id (unique), created_at. FK fanout.
- **UserBlockchain**: wallet (FK), chain_name, token_type, address,
  private_key (AES-256-GCM encrypted), balance, status, last_updated;
  UNIQUE (wallet, chain_name, token_type).
- **FiatBalance**: wallet (FK), currency, balance, last_updated; UNIQUE
  (wallet, currency).
- **BscVaultWallet / EthVaultWallet / SolVaultWallet / TronsVaultWallet**:
  address, private_key (enc).
- **WalletTransaction**: user (FK), direction (deposit/withdrawal/p2p/
  cross_chain), chain, amount, tx_id (unique), counterparty, status,
  timestamp.
- **Order**: order_id (unique), user_id, order_type (buy/sell), status,
  crypto_currency, crypto_amount, crypto_network, fiat_currency,
  fiat_amount, exchange_rate, platform_fee, payment_method,
  blockchain_tx_hash, blockchain_confirmations, required_confirmations
  (default 6), created_at, completed_at, expires_at.
- **OrderStatusHistory**: order (FK), from_status, to_status, changed_by,
  reason, timestamp.
- **NotificationPreferences**: booleans for email/sms/push channels.
- **BankAccount**: user_id, bank_name, account_number, account_name,
  is_default, is_verified; UNIQUE (user_id, bank_name, account_number).
- **PrivacySettings**: profile_visibility, transaction_history_visibility,
  analytical_cookies, marketing_cookies, third_party_sharing.
- **AccountLimits**: daily/monthly withdrawal and deposit limits and usage,
  reset dates, limit_currency.
- **DataExportRequest**: request_type, status, requested_at, completed_at.
- **KYCVerification**: verification_type, status, encrypted BVN/NIN/phone/
  address/document_number, address_document_url, provider_response,
  provider_confidence_score, rejection_reason, reviewed_by, submitted_at,
  reviewed_at.
- **KYCAuditLog**: action, performed_by, ip_address, user_agent, details,
  timestamp.
- **SupportTicket**, **TicketMessage**, **SupportFAQ**: ticketing and KB.
- **Preferences** (legacy): address, android_min_version, email.

### 10.3 Supabase legacy tables

In `clusteer-unified/supabase-migrations/`:

- `users`: email, password_hash, username, phone, is_verified, otp,
  otp_expires_at, two_factor_secret, two_factor_enabled, avatar_url.
- `wallets`, `transactions`, `orders`, `notifications`, `audit_logs`,
  `verification_requests`.

These are being retired.

---

## 11. API contract summary

### 11.1 Next.js API routes (`src/app/api/`)

| Route | Method | Backend | Purpose |
|---|---|---|---|
| `/api/auth-firebase/register` | POST | Firebase + Spring Boot | Create Firebase user + profile |
| `/api/auth-firebase/login` | POST | Firebase | Sign in, set `auth_token` cookie |
| `/api/auth-firebase/logout` | POST | Cookie clear | Log out |
| `/api/auth-firebase/reset-password` | POST | Firebase | Send reset email |
| `/api/auth/*` | POST | Legacy / Supabase | Being retired |
| `/api/user/profile`, `/api/user/profile/update`, `/api/user/avatar/update` | GET/POST | Spring Boot + Firebase Storage | Profile read/update, avatar upload |
| `/api/user/2fa/request`, `/api/user/[username]/2fa/validate` | GET/POST | **Supabase (DEPRECATED)** | Must migrate to Spring Boot |
| `/api/wallet` | GET | Django | Wallet + balances |
| `/api/transfer/internal`, `/api/transfer/verify-recipient/[userId]` | POST/GET | Django / Spring Boot | Internal P2P + recipient check |
| `/api/order`, `/api/trade`, `/api/transaction/user` | GET/POST | Django / Spring Boot | Orders, trades, tx history |
| `/api/kyc/upload`, `/api/kyc/verify`, `/api/kyc/reset` | POST | Firebase Storage + Django | Upload docs, verify, admin reset |
| `/api/system/chains`, `/api/system/exchange-rate` | GET | Spring Boot / Django | System lists + rates |
| `/api/markets` | GET | CoinGecko / cache | Market data |
| `/api/admin/auth/login`, `/api/admin/auth/logout` | POST | Firebase Admin | Admin session |
| `/api/admin/users`, `/api/admin/users/[id]`, `/api/admin/users/[id]/suspend`, `/api/admin/users/[id]/activate` | GET/POST | Firebase Admin + Spring Boot + Django | Admin user mgmt |
| `/api/admin/test-firebase`, `/api/admin/test-simple`, `/api/admin/test-realtime` | GET | Health | Dev / smoke tests |
| `/api/health/firebase`, `/api/version` | GET | Internal | Health, version |

### 11.2 Spring Boot REST endpoints (root: `/api/v1/`)

User: `POST /user/register`, `/user/login`, `/user/send-email-otp`,
`/user/{username}/2fa/validate`, `/user/send-verification`, `/user/verify`,
`/user/account/recover`, `/user/password/reset`.
`GET /user/search`, `/user/all`, `/user/{username}`, `/user/profile`,
`/user/pending/identities`, `/user/pending/addresses`, `/user/2fa/request`.
`PUT /user/profile/update`, `/user/fcm/update`, `/user/identity/update`,
`/user/address/update`, `/user/avatar/update`,
`/user/{id}/address/status/update`, `/user/{id}/identity/status/update`,
`/user/{id}/account/status/update`, `/user/password/update`,
`/user/2fa/update`, `/user/email-factor/update`, `/user/logout`.
`DELETE /user/delete`.

Admin: `POST /admin/create`, `/admin/login`, `/admin/{username}/2fa/validate`,
`/admin/password/recover`. `GET /admin/profile`, `/admin/all`,
`/admin/{username}`, `/admin/2fa/request`.
`PUT /admin/profile/update`, `/admin/fcm/update`, `/admin/avatar/update`,
`/admin/{id}/status/update`, `/admin/password/update`, `/admin/password/reset`,
`/admin/2fa/update`, `/admin/logout`.
`DELETE /admin/{id}/delete`.

Wallet: `GET /wallet`, `/wallet/crypto/withdrawal/{id}`.
`POST /wallet/crypto/swap`, `/wallet/crypto/transfer`,
`/wallet/crypto/withdraw`, `/wallet/crypto/settle`,
`/wallet/blockchain/webhook`, `/wallet/fiat/webhook`.
`PUT /wallet/pin/create`, `/wallet/pin/change`, `/wallet/pin/recover`,
`/wallet/pin/reset`.

Transaction: `GET /transaction/user`, `/transaction/user/{id}`,
`/transaction/{ref}`, `/transaction/all`, `/transaction/filter`.

Order: `POST /order/purchase/create`, `/order/sale/create`,
`/order/message/{token}/send`. `GET /order`, `/order/{id}`,
`/order/{user}/orders`, `/order/all`, `/order/filter/date`,
`/order/filter/status`. `PUT /order/messages/{token}/read`.

System: `GET /system/dashboard`, `/system/preferences`, `/system/parameters`,
`/system/exchange-rate`, `/system/data/{type}/export`, `/system/chains`,
`/system/payment-methods`. `PUT /system/preferences/update`,
`/system/parameter/{key}/update`, `/system/chain/{id}/update`,
`/system/payment-method/{id}/update`. `POST /system/chain/create`,
`/system/payment-method/create`. `DELETE /system/chain/{id}/delete`,
`/system/payment-method/{id}/delete`.

Notifications: `GET /notifications`, `PUT /notifications/{id}/read`,
`DELETE /notifications/{id}/delete`, `/notifications/clear`.

### 11.3 Django endpoints (root: `/api/v1/`)

Wallets & balances: `POST /wallet/create/`, `GET /user/{user_id}/balance/`.

Withdrawals & transfers: `POST /withdrawal-request/`,
`GET /withdrawal-status/{tx_id}/`, `POST /p2p-transfer/`,
`POST /convert-usdt/`, `POST /convert/`, `GET /estimate-fee/`.

Webhooks (public): `POST /solana/webhook/`, `POST /bsc/webhook/`,
`POST /tron/webhook/`.

Admin overrides: `POST /admin/manual-transaction/`, `POST /manual-trade/`.

User settings: `GET|PUT /user/{user_id}/notifications/preferences/`,
`GET|POST /user/{user_id}/bank-accounts/`,
`GET|PUT|DELETE /user/{user_id}/bank-accounts/{account_id}/`,
`GET|PUT /user/{user_id}/privacy-settings/`,
`GET|PUT /user/{user_id}/account-limits/`,
`POST /user/{user_id}/data-export/`.

KYC: `POST /user/{user_id}/kyc-verification/`,
`POST /user/{user_id}/check-duplicate-document/`,
`GET /user/{user_id}/kyc-status/`.

Orders: `GET|POST /user/{user_id}/orders/`,
`GET|PUT|DELETE /user/{user_id}/orders/{order_id}/`.

Support: `GET|POST /user/{user_id}/support/tickets/`,
`GET /user/{user_id}/support/tickets/{ticket_number}/`,
`POST /user/{user_id}/support/tickets/{ticket_number}/messages/`,
`GET /support/faqs/`.

Docs: `GET /schema/`, `/swagger/`, `/docs/`.

WebSocket: `/ws/deposits/{user_id}/`.

---

## 12. Integrations

| Service | Purpose | Env vars | Where used |
|---|---|---|---|
| **Firebase** | Auth + Storage + FCM + Realtime DB | `NEXT_PUBLIC_FIREBASE_*`, `FIREBASE_*`, `CLOUD_STORAGE_BUCKET` | Next.js frontend, Spring Boot, Django (file URLs) |
| **Spring Boot API** | Internal backend | `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SPRING_BOOT_API_KEY`, `USER_BASE_URL`, `ADMIN_BASE_URL` | Next.js |
| **Django Blockchain Engine** | Wallet + chain + KYC | `NEXT_PUBLIC_BLOCKCHAIN_ENGINE_URL`, `NEXT_PUBLIC_BLOCKCHAIN_ENGINE_API_KEY`, `BLOCKCHAIN_BASE_URL`, `BLOCKCHAIN_EX_API_KEY`, `BLOCKCHAIN_IN_API_KEY` | Next.js, Spring Boot |
| **PostgreSQL** | Persistent store | `POSTGRESQL_*`, `DB_*`, `USE_POSTGRES` | Spring Boot, Django |
| **Redis (Upstash)** | Rate limiting | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `USE_REDIS_RATE_LIMITING` | Next.js |
| **Redis (self-hosted)** | Celery, Channels | `REDIS_URL`, `REDIS_PASSWORD` | Django |
| **Smile Identity** | KYC (BVN/NIN) | `SMILE_IDENTITY_API_KEY`, `SMILE_IDENTITY_PARTNER_ID`, `SMILE_IDENTITY_BASE_URL` | Django, Next.js fallback |
| **Youverify** | KYC alt | `YOUVERIFY_API_KEY`, `YOUVERIFY_BASE_URL` | Django |
| **VFD** | Virtual accounts, transfers | (referenced via Spring Boot config) | Spring Boot `BankService` |
| **Paystack** | Payment rail | `PAYSTACK_SECRET_KEY`, `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Next.js / Spring Boot |
| **Flutterwave** | Payment rail | `FLUTTERWAVE_SECRET_KEY`, `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` | Next.js / Spring Boot |
| **SendGrid** | Email | `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, `SENDGRID_FROM_NAME` | Next.js |
| **Resend** | Email (backup) | `RESEND_API_KEY`, `EMAIL_FROM` | Next.js |
| **Zepto Mail** | Email | `ZEPTO_API_KEY` | Spring Boot `MailService` |
| **Termii** | SMS | `TERMII_API_KEY` | Next.js (stub) |
| **Tatum** | On-chain deposit webhooks | (configured upstream) | Django webhook endpoints |
| **CoinGecko** | Market data | (none) | Next.js |
| **er-api.com** | FX rates | (none) | Next.js |
| **Google Maps** | Geo / addresses | `GOOGLE_API_KEY` | Spring Boot |
| **Sentry** | Error monitoring | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` | Next.js |
| **Firebase FCM** | Push | `FIREBASE_*` | Spring Boot `PushNotificationServiceImpl` |
| **Supabase** | Legacy DB | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Next.js 2FA routes (DEPRECATED) |

---

## 13. Environment variable contract (grouped)

**Frontend public (`NEXT_PUBLIC_*`)**: `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`,
`FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`,
`FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`,
`FIREBASE_MEASUREMENT_ID`, `API_URL`, `BLOCKCHAIN_ENGINE_URL`,
`BLOCKCHAIN_ENGINE_API_KEY`, `APP_URL`, `PAYSTACK_PUBLIC_KEY`,
`FLUTTERWAVE_PUBLIC_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
`SENTRY_DSN`, `SPRING_BOOT_API_KEY`.

**Frontend server**: `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`,
`JWT_SECRET`, `SPRING_BOOT_API_KEY`, `BLOCKCHAIN_ENGINE_API_KEY`,
`DJANGO_ENCRYPTION_KEY`, `SMILE_IDENTITY_API_KEY`,
`SMILE_IDENTITY_PARTNER_ID`, `YOUVERIFY_API_KEY`, `RESEND_API_KEY`,
`EMAIL_FROM`, `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`,
`SENDGRID_FROM_NAME`, `ZEPTO_API_KEY`, `TERMII_API_KEY`,
`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`,
`USE_REDIS_RATE_LIMITING`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`,
`SENTRY_PROJECT`, `SUPABASE_SERVICE_ROLE_KEY`.

**Spring Boot**: `POSTGRESQL_URL`, `POSTGRESQL_USER`,
`POSTGRESQL_PASSWORD`, `COLUMN_ENCRYPTION_ALGORITHM`,
`COLUMN_ENCRYPTION_KEY`, `FIREBASE_PROJECT_ID`,
`FIREBASE_PRIVATE_KEY_ID`, `FIREBASE_PRIVATE_KEY`,
`FIREBASE_CLIENT_EMAIL`, `FIREBASE_CLIENT_ID`, `FIREBASE_AUTH_URI`,
`FIREBASE_TOKEN_URI`, `FIREBASE_AUTH_PROVIDER_X509_CERT`,
`FIREBASE_CLIENT_X509_CERT`, `FIREBASE_TYPE`,
`FIREBASE_UNIVERSE_DOMAIN`, `FIREBASE_DATABASE_URL`,
`CLOUD_STORAGE_BUCKET`, `BLOCKCHAIN_BASE_URL`,
`BLOCKCHAIN_EX_API_KEY`, `BLOCKCHAIN_IN_API_KEY`, `GOOGLE_API_KEY`,
`ZEPTO_API_KEY`, `ADMIN_BASE_URL`, `USER_BASE_URL`, `PORT`.

**Django**: `DEBUG`, `SECRET_KEY`, `DJANGO_ENCRYPTION_KEY`, `DB_ENGINE`,
`DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `USE_POSTGRES`,
`ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`,
`CUSTODIAL_WALLET_ENCRYPTION_KEY`, `VAULT_WALLET_ENCRYPTION_KEY`,
`HMAC_SECRET`, `KYC_PROVIDER`, `SMILE_IDENTITY_*`, `YOUVERIFY_*`,
`REDIS_URL`, `REDIS_PASSWORD`, `EMAIL_HOST`, `EMAIL_PORT`,
`EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `BSC_RPC_URL`, `ETH_RPC_URL`,
`SOLANA_RPC_URL`, `TRONS_PROVIDER_RPC`, `BSC_USDT_CONTRACT`,
`ETH_USDT_CONTRACT`, `USDT_SOLANA_MINT`, `USDT_TRON_MINT`, `TESTNET`.

---

## 14. Deployment and CI/CD

### 14.1 Deployment targets

- **Vercel** — `clusteer-unified` (Next.js 16). `vercel.json` sets
  `buildCommand: npm run build`, `outputDirectory: .next`, framework nextjs.
- **Railway** — Spring Boot (`Clusteer-Api`) via `railway.json` /
  `railway.toml`, multi-stage Dockerfile (`eclipse-temurin:21-jdk` builder,
  `21-jre` runtime), JAR `clusteer.jar`. `ON_FAILURE` restart, 10 max retries.
- **Railway / self-host** — Django engine (`Clusteer-Blockchain-Engine`),
  ASGI via Daphne + Channels, Gunicorn WSGI option, Celery worker +
  beat. Own `.github/workflows/deploy.yml`.
- **Firebase** — Auth / Storage / FCM / Realtime (project configured;
  earlier project `outbuild-xchange` was abandoned).

### 14.2 CI/CD pipelines

Unified frontend (`clusteer-unified/.github/workflows/ci.yml`):

1. Lint & type-check (ESLint + `tsc --noEmit`).
2. Test (Jest, jsdom, coverage to Codecov).
3. Security scan (npm audit moderate + Snyk).
4. Build (uploads `.next` artefacts, 7-day retention).
5. Preview deploy (Vercel) on PR.
6. Production deploy (Vercel) on main.

Required secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`,
`JWT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY` (legacy — remove),
`BLOCKCHAIN_ENGINE_API_KEY`, `SMILE_IDENTITY_API_KEY`,
`SMILE_IDENTITY_PARTNER_ID`, `UPSTASH_REDIS_REST_URL`,
`UPSTASH_REDIS_REST_TOKEN`, `RESEND_API_KEY`, `EMAIL_FROM`,
`NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`.

Django `.github/workflows/deploy.yml`: deploys the Django engine.

### 14.3 Scripts

All under `scripts/` at the monorepo root (and some under subprojects):

- `setup-postgresql.sh` — installs Postgres 16, creates `clusteer_api` DB,
  `clusteer_admin` user, generates encryption keys, writes Spring Boot `.env`.
- `setup-firebase.sh` — interactive Firebase init (CLI, `.env.local`).
- `setup-firebase-admin.sh` — service-account JSON extraction.
- `quick-start-migration.sh` — interactive 8-phase migration wizard.
- `backup-database.sh`, `restore-database.sh` — timestamped pg_dump / psql
  restore, 30-day gzip retention.
- `deploy-checklist.sh` — pre-deploy validation (env, DB, Firebase, tests,
  build, security).
- `export-supabase-data.ts` — CSV export of Supabase users, transactions,
  bank accounts, orders, exchange rates.
- `fix-typescript-errors.sh` — one-off codemod (excel → xlsx, onClick →
  onExecute in admin batch actions).
- `test-firebase-setup.js` — connectivity verifier (contains hard-coded
  public Firebase keys for `outbuild-xchange`; this was the abandoned
  project and must be updated or removed).
- `generate-env-keys.sh` (inside `Clusteer-Blockchain-Engine`) — generates
  Fernet / AES keys.

---

## 15. Testing

- **Frontend**: Jest + jsdom. Tests live in
  `clusteer-unified/src/lib/__tests__/` covering auth, rate-limiter,
  validation, export-utils, utils. Coverage threshold 50% per Jest config.
- **Backend (Spring Boot)**: no tests in `src/test` — explicit gap.
- **Backend (Django)**: `p2p/tests.py` contains a single hardcoded Tatum
  request; no meaningful coverage. Requires unit tests for wallet creation,
  KYC provider, encryption, balance queries, withdrawal execution, order
  lifecycle, API key auth, WebSocket notifications.

Minimum test bar before launch (requirement):

- Auth, KYC, wallet, trade, withdrawal, webhook handler, admin permission
  coverage ≥ 80% on Spring Boot.
- Contract tests between Next.js ↔ Spring Boot and Next.js ↔ Django.
- End-to-end smoke test for the signup → KYC → buy → withdraw loop.

---

## 16. Known gaps, risks, and technical debt

Consolidated from `PRODUCTION-LAUNCH-ASSESSMENT.md`,
`KYC-SECURITY-AUDIT.md`, `SECURITY.md`, and individual agent audits.

### 16.1 Critical blockers (must fix before production)

1. **Supabase code paths still active** in `/api/user/2fa/request`,
   `/api/user/[username]/2fa/validate`, `/api/auth/verify-otp` — all call
   `supabaseAdmin`. Must be migrated to Spring Boot or removed entirely.
2. **Withdrawal correctness**: Django `withdrawals.py` uses
   `generate_random_tx_hash()` in some code paths as a placeholder; real
   blockchain tx hash must be captured from the broadcast.
3. **ETH auto-sweep disabled**: `eth_sweeping.py` commented out; no Celery
   schedule for ETH; ETH support advertised but not complete.
4. **Webhook signatures not enforced**: Django `webhook_security.py` defines
   HMAC verification but views have `authentication_classes = []` and do not
   call the verifier. Spring Boot `/v1/wallet/blockchain/webhook` and
   `/v1/wallet/fiat/webhook` are public and lack signature validation.
5. **KYC security gaps**: no rate limiting on KYC submissions; weak BVN/NIN
   validation (length-only, no checksum); duplicate-check race condition;
   document directory not isolated; PII encryption patterns need enforcement
   (Django Fernet falls back to plaintext when key not set).
6. **Missing granular admin permission matrix**: 16 distinct admin actions
   designed but not enforced. All admins equal today.
7. **Jasypt algorithm legacy**: `PBEWithMD5AndDES` is cryptographically
   weak; upgrade to `PBEWithHmacSHA256AndAES_256`.
8. **Env-var contract incomplete in production**: 40+ vars unset in early
   Railway attempts; Spring Boot crashes on missing Firebase vars.
9. **No Flyway / Liquibase** on Spring Boot — `ddl-auto=update` is a
   production risk.
10. **Sentry not configured in production**: no error visibility.
11. **Secret rotation**: credentials documented in markdown files (historical)
    must be rotated (Django, Firebase, Redis, Zepto, Smile, Youverify,
    Paystack, Flutterwave).
12. **Duplicate-file sprawl**: 103 files with " 2" suffix tracked in
    `duplicate-files-backup-list.txt`; maintenance confusion.

### 16.2 High-priority functional gaps

- **Swap UI**: `POST /v1/wallet/crypto/swap` exists but no user-facing
  interface is wired.
- **External crypto send**: only internal and chain-sweep flows are robust;
  arbitrary external sends need to honour chain-specific fees and address
  validation on the client.
- **Deposit notifications on frontend**: `use-notifications.ts` returns
  empty arrays. WebSocket `/ws/deposits/{user_id}/` is unconsumed.
- **FCM push on frontend**: service worker integration is in the legacy
  `Clusteer-CustomerDashboard`, not yet in `clusteer-unified`.
- **Data export worker**: `DataExportRequest` is written but no worker ever
  materialises the archive.
- **Account-limit resets**: `reset_daily_limits` / `reset_monthly_limits`
  exist but are not scheduled.
- **2FA in login flow**: `AccountSecurity.useTwoFactor` is honoured server
  side but not integrated into the login challenge UX.
- **Referral program**: advertised conceptually, not implemented.
- **Notification implementation**: `/settings/notifications` is UI-only on
  the consumption side; no worker publishes notifications yet beyond ad-hoc.
- **Audit log viewer**: real-time log viewing at
  `/admin/settings/audit-logs` — backend tables exist, UI polling or
  realtime feed needs wiring.

### 16.3 Medium / low-priority debt

- No API documentation (OpenAPI) on Spring Boot (`springdoc-openapi-ui` not
  wired). Django has drf-spectacular.
- No circuit breakers (Resilience4j) on external calls.
- `concurrent login` / device limits: data collected but not enforced.
- `reports/compliance` depth: real-time dashboards use placeholder widgets.
- Hardcoded Firebase config in `test-firebase-setup.js` references abandoned
  project (`outbuild-xchange`).
- Modal accessibility fixes partially shipped; formal WCAG audit pending.
- `markets` page may fall back to mock data if CoinGecko 429s.
- Legacy `supabase-migrations/` directory should be archived or deleted.
- `src/lib/supabase.ts` kept as type-only stub — remove after 2FA migration.

### 16.4 Risks to launch

- **Single point of failure in custodial keys**: loss of
  `CUSTODIAL_WALLET_ENCRYPTION_KEY` equals loss of every user's private key.
  Requires secure backups and a key-rotation plan.
- **PostgreSQL split between Spring Boot and Django**: coordinate on a
  single cluster with separate schemas; otherwise cross-service reports
  cannot be produced without federation.
- **Blockchain RPC reliability**: TRON, Solana, BSC RPCs are externally
  hosted; needs redundant providers and retry/backoff.
- **Regulatory**: BVN / NIN handling must meet NDPR; operator must maintain
  a data-protection officer, DPIA, and breach notification process.

---

## 17. Roadmap

This is a synthesis, not a hard commitment; dates are indicative.

**Phase 0 — Clean-up and migration finish (2–3 weeks)**

- Remove Supabase code paths.
- Move 2FA secret storage to Spring Boot.
- Delete duplicate " 2" files.
- Rotate all exposed credentials.
- Configure all Railway / Vercel environment variables.

**Phase 1 — Security hardening (3–4 weeks)**

- Upgrade Jasypt algorithm; introduce key versioning.
- Enforce webhook HMAC signatures.
- Rate-limit KYC submissions and external sends.
- Add Flyway migrations (or Liquibase) on Spring Boot; switch `ddl-auto`
  to `validate`.
- Configure Sentry (prod) and structured logging.
- Granular admin permission matrix.

**Phase 2 — Feature completion (4–6 weeks)**

- Swap UI → `POST /v1/wallet/crypto/swap`.
- External crypto send for all four chains with on-chain confirmation
  polling.
- Data-export worker (Celery task to materialise the archive).
- Account-limit reset schedule (Celery Beat daily + monthly).
- Deposit notifications on unified frontend (WebSocket + FCM).
- In-app notifications from `Notification` entity.
- Real-time audit log viewer.
- 2FA in login flow.

**Phase 3 — Depth and polish (6–8 weeks)**

- Formal WCAG 2.1 AA audit + remediations.
- Load + penetration testing.
- End-to-end test coverage on signup → trade → withdraw.
- Native mobile wrapper or PWA hardening (SW, offline, install prompts).
- i18n scaffolding (English → French / Pidgin as targets).

**Phase 4 — New markets**

- Additional fiat currencies (GHS, KES) once payment rails contracted.
- Referral program.
- Potential P2P marketplace re-activation (the `P2POrder` + `Chat` entities
  already exist in Spring Boot).

---

## Appendix A — Full route map (clusteer-unified)

Authentication: `/`, `/signup`, `/login`, `/forgot-password`,
`/reset-password`, `/verify-otp`, `/verify-email`, `/auth/callback`.

Dashboard (`(dashboard)` layout): `/dashboard`, `/assets`,
`/assets/[asset]`, `/assets/[asset]/send`, `/assets/[asset]/receive`,
`/assets/[asset]/request`, `/send`, `/receive`, `/request`, `/trade`,
`/markets`, `/orders`, `/transaction-history`, `/billing`.

Identity: `/identity-verification`, `/identity-verification/verify`.

Security & Settings: `/security`, `/security/change-password`,
`/security/change-email`, `/security/google-auth`, `/settings`,
`/settings/profile`, `/settings/account`, `/settings/security`,
`/settings/security/change-password`, `/settings/security/change-email`,
`/settings/security/google-auth`, `/settings/notifications`,
`/settings/payment-methods`, `/settings/privacy`.

Support: `/support`, `/support/[ticketNumber]`, `/support/help/[topic]`.

Admin (`(admin)` layout): `/admin`, `/admin/login`, `/admin/users`,
`/admin/users/[id]`, `/admin/wallets`, `/admin/wallets/users/[userId]`,
`/admin/wallets/transactions/[id]`, `/admin/wallets/bank-accounts`,
`/admin/wallets/withdrawals`, `/admin/wallets/networks`,
`/admin/wallets/settlements`, `/admin/wallets/reconciliation`,
`/admin/kyc`, `/admin/kyc/[id]`, `/admin/transactions`,
`/admin/transactions/[id]`, `/admin/orders`, `/admin/support`,
`/admin/support/[id]`, `/admin/content`, `/admin/content/[id]`,
`/admin/admins`, `/admin/reports`, `/admin/reports/financial-summary`,
`/admin/reports/compliance`, `/admin/reports/user-activity`,
`/admin/settings`, `/admin/settings/api-keys`,
`/admin/settings/audit-logs`, `/admin/settings/alerts`,
`/admin/settings/integrations`, `/admin/settings/backup`.

Legal / info: `/privacy-policy`, `/terms-of-service`, `/security-info`,
`/test-kyc-reset` (dev only).

---

## Appendix B — Key source files (as cited)

- Frontend: `clusteer-unified/src/lib/firebase.ts`,
  `firebase-admin.ts`, `auth-firebase.ts`, `spring-boot-api.ts`,
  `rate-limiter.ts`, `redis-rate-limiter.ts`, `kyc-provider.ts`,
  `admin-auth.ts`, `email-service.ts`, `export-utils.ts`.
- Frontend routes: `src/app/**/page.tsx`, `src/app/api/**/route.ts`.
- Spring Boot entities: `src/main/java/com/outbuild/clusteer/entities/**`.
- Spring Boot services: `src/main/java/com/outbuild/clusteer/services/**`.
- Spring Boot controllers: `src/main/java/com/outbuild/clusteer/controllers/v1/*`.
- Spring Boot config: `src/main/java/com/outbuild/clusteer/configs/AppConfig.java`,
  `FirebaseConfig.java`, `src/main/resources/application*.properties`.
- Django p2p app: `Clusteer-Blockchain-Engine/p2p/models.py`,
  `order_models.py`, `support_models.py`, `user_settings_models.py`,
  `serializer.py`, `urls.py`, `authentication.py`, `encryption.py`,
  `kyc_provider.py`, `tasks.py`, `webhook_security.py`,
  `views/**`, `utils/**`, `management/commands/create_apikey.py`.
- Django project: `website/settings.py`, `urls.py`, `routing.py`,
  `consumers.py`, `celery.py`.
- Root scripts: `scripts/setup-postgresql.sh`, `setup-firebase.sh`,
  `setup-firebase-admin.sh`, `quick-start-migration.sh`,
  `backup-database.sh`, `restore-database.sh`, `deploy-checklist.sh`,
  `export-supabase-data.ts`.
- Legacy: `Clusteer-LandingPage/`, `Clusteer-CustomerDashboard/`.

## Appendix C — Glossary

- **BVN** — Bank Verification Number. 11-digit Nigerian identifier for
  individuals across banks.
- **NIN** — National Identification Number. 11-digit Nigerian national ID.
- **Custodial wallet** — wallet whose private keys are held and managed by
  the platform, not the user.
- **Vault wallet** — internal, platform-owned wallet into which user
  deposits are swept for pooled management.
- **Sweep** — scheduled task that moves user balances from their individual
  addresses to a platform vault.
- **P2P transfer (Clusteer sense)** — transfer between two Clusteer users
  (internal), not a public P2P marketplace.
- **Mark-up / mark-down** — premium / discount applied to market rate when
  Clusteer sells / buys crypto to / from users.
- **VFD** — Virtual Fund Dynamics, the bank partner issuing virtual
  accounts.
- **NDPR** — Nigeria Data Protection Regulation (2019).
- **AML** — Anti-money-laundering.
- **FCM** — Firebase Cloud Messaging (push notifications).

## Appendix D — Source documents referenced (in the repo)

`claude.md`, `MIGRATION-GUIDE.md`, `MIGRATION-CHECKLIST.md`,
`MIGRATION-README.md`, `MIGRATION-IMPLEMENTATION-SUMMARY.md`,
`FRONTEND-MIGRATION-GUIDE.md`, `FIREBASE-QUICKSTART.md`,
`SETUP-NEW-FIREBASE.md`, `QUICK-START-FIREBASE.md`,
`FIREBASE-LOGIN-FIXED.md`, `VERCEL-FIREBASE-SETUP.md`, `SECURITY.md`,
`QUICK-START-SECURITY.md`, `KYC-SECURITY-AUDIT.md`,
`PRODUCTION-LAUNCH-ASSESSMENT.md`, `PRODUCTION-READY-GUIDE.md`,
`READY-TO-TEST.md`, `CURRENT-STATUS.md`, `ADMIN-DASHBOARD-AUDIT.md`,
`ADMIN-DASHBOARD-CODE-REVIEW.md`, `ADMIN-DASHBOARD-COMPLETE.md`,
`ADMIN-DASHBOARD-FIXES-APPLIED.md`, `ADMIN-DASHBOARD-PLAN.md`,
`CRITICAL-BLOCKERS-FIXED.md`, `CRITICAL-FIXES-APPLIED.md`,
`DASHBOARD-OPTIMIZATION-SUMMARY.md`, `FLOATING-TOGGLE-BUTTON-ADDED.md`,
`HARDCODED-DATA-REMOVED.md`, `IMPLEMENTATION-COMPLETE-2025-12-09.md`,
`INTEGRATION-COMPLETE-2025-12-30.md`, `ORDERS-API-FIXED.md`,
`PHASE-1-IMPLEMENTATION-SUMMARY.md`, `SESSION-COMPLETE-2025-12-09.md`,
`SESSION-COMPLETE-2025-12-30.md`, `SESSION-STATUS-2025-12-09.md`,
`WORK-SESSION-2025-11-01.md`, `SETTINGS-BACKEND-SETUP.md`,
`SETTINGS-COMPLETE-SUMMARY.md`, `WALLET-FIX-APPLIED.md`,
`RAILWAY-QUICK-FIX.md`, `RAILWAY-FIX.md`,
`RAILWAY-DEPLOYMENT-SUMMARY.md`, `JAR-NAME-FIX.md`,
`RAILWAY-DEPLOYMENT.md`, `RAILWAY-ENV-VARS-REQUIRED.md`,
`clusteer-unified/docs/CICD_SETUP.md`.

---

*End of PRD v1.0. This document should be kept in sync with the codebase;
update the date, version, and change log on every material revision.*
