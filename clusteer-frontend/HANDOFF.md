# Clusteer — Frontend Redesign Handoff

**Product:** Clusteer — Nigeria‑first custodial crypto exchange (buy/sell/swap + multi‑chain send/receive in NGN)
**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Radix · Recharts · Sonner · Zustand · React‑Hook‑Form
**Folder:** `clusteer-frontend/` (replaces the existing FE)

---

## 1. How to run

```bash
cd clusteer-frontend
npm install
npm run dev            # http://localhost:3000
```

Routes are grouped in Next.js route groups — the URL is unaffected.

| Group | URL root | Purpose |
|---|---|---|
| `(marketing)` → `/` | `/` | Public landing page |
| `(auth)` | `/login /signup /verify-otp /verify-email /forgot-password /reset-password` | Anonymous flows |
| `(app)` | `/dashboard /assets /trade /send /receive /transactions /identity-verification /settings /help` | Authenticated customer |
| `admin` | `/admin/*` | Ops / compliance backoffice |

No auth gating is wired — every page is reachable for review. Swap in your real auth guard later (middleware or layout‑level check).

---

## 2. Design system

### Tokens — `src/app/globals.css`

One canonical stylesheet declares OKLCH color tokens, radii, sidebar surfaces, and a numeric‑mono font stack.

- **Brand** — Clusteer Blue 50→900 (OKLCH 254 hue). `--primary = --clusteer-blue-600`.
- **Chains** — hardcoded accents for BTC / ETH / USDT / USDC / SOL / BNB / TRX / Polygon (`--chain-*`).
- **Semantic** — `success / warning / danger / info` each with a paired `-bg` surface.
- **shadcn surfaces** — standard `background / foreground / card / popover / muted / border / input / ring` in both light and dark.
- **Mono** — `.mono` class for addresses, order IDs, BVN / NIN. `tabular-nums` applied globally to the `<Num>` primitive for column alignment.

### Typography
- **Display** — `Sora` (700) for headlines, dashboard totals, amount entry.
- **Sans** — `Inter` for everything else.
- **Numeric** — `JetBrains Mono` for hashes, addresses, IDs.

### Primitives — `src/components/primitives/`

| Primitive | Purpose |
|---|---|
| `<Logo>` / `<Logo monogramOnly>` | Mark + wordmark |
| `<Num tone="positive|negative|muted" />` | Always‑tabular numeric display — use everywhere money appears |
| `<AssetLogo symbol size>` | Branded asset chip (BTC orange, ETH purple, etc.) |
| `<ChainBadge chain>` | Coloured network tag |
| `<Sparkline data width height>` | Inline 24‑point price strip (row trend) |
| `<PriceAreaChart data currency>` | Full gradient area chart (Recharts) |
| `<Steps>` / `<StepsHorizontal>` | KYC, send‑money, onboarding |
| `<QR value size>` | Deposit QR (qrcode.react) |
| `<CopyButton value>` | One‑tap copy with toast |
| `<EmptyState>` | Empty tables / cards |

### shadcn/ui surface — `src/components/ui/`
Standard new‑york variants plus **badge extras**: `success / warning / danger / info / neutral`. Button has `xl` size for marketing CTAs. Destructive variant maps to `--danger`.

### Layout — `src/components/app/`
- `<Sidebar>` — customer nav (260px, collapses behind Sheet on mobile)
- `<AdminSidebar>` — compliance nav with pending‑count chips
- `<TopBar>` — search, notifications, mobile menu trigger
- `<Breadcrumbs>` — auto‑derived from pathname

---

## 3. Page catalog

### Marketing — `src/app/page.tsx`
Hero with licensed‑VASP badge · live market strip · features grid · supported networks · CTA · footer.

### Auth — `src/app/(auth)/*`
- **login** — email + password, 2FA stub, trust‑device checkbox
- **signup** — phone‑first, country = NG default
- **verify-otp** — 6‑digit OTP (`input-otp`)
- **verify-email** — confirmation screen
- **forgot-password / reset-password**

### Customer — `src/app/(app)/*`

| Route | What it does |
|---|---|
| `/dashboard` | Total balance (hideable), 30d area chart, quick‑send beneficiaries, asset holdings table, recent activity |
| `/assets` | All supported coins with price / 24h / 7d / balance |
| `/assets/[symbol]` | Per‑asset detail: price chart with 1D/1W/1M/3M/1Y tabs, holdings, supported networks |
| `/assets/[symbol]/receive` | QR + address picker by network, "Only send X on Y" safety block |
| `/receive` | Universal receive — pick asset + network |
| `/send` | 4‑step flow: Details → Review → 2FA authorize → Submitted |
| `/trade` | Unified Buy / Sell / Swap with rate lock, 0.75% fee preview |
| `/transactions` | Filterable ledger (type, status, search, CSV export) |
| `/identity-verification` | Tier 1/2/3 cards, KYC wizard (BVN → ID → Selfie → Review) |
| `/settings` | Profile, Security, Notifications, Payment methods, Preferences (tabs) |
| `/help` | Search, topic cards, FAQ accordion, chat/email CTAs |

### Admin — `src/app/admin/*`

| Route | What it does |
|---|---|
| `/admin` | Ops overview — users, 24h volume, AUM, pending KYC; volume chart; KYC & flagged‑tx queues; wallet health |
| `/admin/users` | Directory with status filters, KYC tier, deposit / volume metrics |
| `/admin/kyc` | Review cards + modal with doc thumbnails, approve/reject |
| `/admin/wallets` | Hot / Warm / Cold / Multi‑sig pools with threshold progress, rebalance trigger |
| `/admin/transactions` | Platform ledger, flagged‑only filter, reason callouts |
| `/admin/reports` | Volume + signups charts, CSV exports (regulatory, KYC, volume) |
| `/admin/audit` | Immutable action log by actor / severity |
| `/admin/cms` | System banner editor, scheduled maintenance, help articles |

### Utility
- `not-found.tsx` — branded 404
- `sonner` — toasts globally mounted in root layout

---

## 4. Mock data — `src/lib/mock-data.ts`
All pages read from typed fixtures (`Asset`, `Order`, `User`, `KycSubmission`, `WalletPool`, `AdminTxn`, `AuditEntry`) and two chart generators (`generateCandles`, `generateAreaSeries`). Replace these imports with your React Query hooks / API calls one page at a time — nothing else needs to change.

---

## 5. Next steps for engineering
1. **Auth** — add middleware to gate `/dashboard` and `/admin`; wire `CURRENT_USER` to a real session.
2. **Data** — swap each `import { ASSETS, ORDERS, … } from "@/lib/mock-data"` for a React Query hook against your backend.
3. **Real addresses** — replace the mocked address map in `/receive` and `/assets/[asset]/receive` with server‑issued deposit addresses.
4. **Pricing** — hook up a live rate feed for `/trade` quote refresh (the UI already labels a 10‑second refresh).
5. **WebSockets** — `/admin` flagged‑tx list and wallet health are the first surfaces that benefit from live pushes.
6. **Dark mode** — tokens are already defined; wire `next-themes` (installed).

---

## 6. File map

```
src/
├── app/
│   ├── (app)/           # customer shell + pages
│   ├── (auth)/          # login, signup, OTP, reset
│   ├── admin/           # ops backoffice
│   ├── globals.css      # tokens + resets
│   ├── layout.tsx       # root html, fonts, providers, toaster
│   ├── page.tsx         # public marketing
│   └── not-found.tsx
├── components/
│   ├── app/             # sidebar, topbar, breadcrumbs, admin-sidebar
│   ├── brand/           # logo
│   ├── primitives/      # Num, AssetLogo, ChainBadge, charts, QR…
│   └── ui/              # shadcn primitives
└── lib/
    ├── mock-data.ts
    ├── types.ts
    └── utils.ts         # cn, formatMoney, formatPct, relativeTime…
```

---

© Clusteer Technologies — redesign delivered by Claude.
