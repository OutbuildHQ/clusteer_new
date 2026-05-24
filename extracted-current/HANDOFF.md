# Clusteer — Design System & Frontend Handoff

**For:** Claude Code (or any engineer) taking this design and implementing it against the existing Clusteer codebase.

This package contains **two parallel deliverables** — read whichever one matches your task:

- **Web revamp** (Next.js / React) — see "Web revamp" sections below + browse `Clusteer Design System.html`. Source files: `tokens.css`, `components.jsx`, `screens-*.jsx`, `tokens-page.jsx`. Existing codebase reference in `clusteer-frontend/`.
- **Mobile app** (React Native / Expo target) — see "Mobile app port" section near the bottom + browse `Clusteer Mobile.html`. Source files: `mobile/`.

Both share the same brand identity but use different type stacks and visual treatments. **Mobile is bolder and more playful; web is denser and more pro.** Don't cross-pollinate component implementations.

---

## What this package is

A complete visual + interaction reference for Clusteer's frontend revamp. Open `Clusteer Design System.html` to browse the full canvas: tokens, components, and every screen across marketing, customer (desktop + mobile), and admin.

It is a **source of truth for visuals and patterns**, not a pixel-locked spec. Where the reference implies a pattern (e.g. "every table has filters, pagination, export"), apply the pattern everywhere that context calls for it — don't wait for a dedicated artboard.

---

## Files

| File | Purpose |
|---|---|
| `tokens.css` | All design tokens — colors, type, spacing, radius, shadow, dark theme, density. Drop-in. |
| `components.jsx` | Primitive React components (Button, Input, Card, Badge, Table, Tabs, Steps, Sparkline, CandleChart, LineChart, QR, Avatar, Progress, ChainBadge, AssetLogo, SectionHead, Num, Logo, Icon). |
| `tokens-page.jsx` | Visualized token inventory (what goes on the Foundations artboard). |
| `screens-customer.jsx` | Marketing, Auth (signup/OTP/2FA), Dashboard, Trade, Receive, KYC, Settings, Support. |
| `screens-extended.jsx` | Login, forgot password, dashboard empty, asset detail, tx detail drawer, orders, tx history, payment methods, sessions, help center, admin ops, user detail, error page, toasts. |
| `screens-admin.jsx` | Admin users/KYC/transactions/wallets/reports/audit/CMS. |
| `design-canvas.jsx` | Presentation shell (ignore when porting). |
| `tweaks-panel.jsx` | Live-tweak controls (ignore when porting). |
| `Clusteer Design System.html` | Host page that wires it all together. |

---

## Design system quick reference

### Tokens

**Brand:** `--cl-brand-500: #0B5FFF` (primary), scale 50→900.
**Semantic:** `--cl-up` (success/buy), `--cl-down` (error/sell), `--cl-warn`, `--cl-info`, each with `-soft` backgrounds.
**Chain accents:** `--cl-chain-tron`, `--cl-chain-bsc`, `--cl-chain-sol`, `--cl-chain-eth`, `--cl-chain-usdt`.
**Neutrals:** `--cl-bg`, `--cl-surface`, `--cl-surface-2`, `--cl-surface-3`, `--cl-line`, `--cl-line-strong`, `--cl-text`, `--cl-text-2` (secondary), `--cl-text-3` (tertiary).
**Radius:** xs 4 · sm 6 · md 10 · lg 14 · xl 20 · pill 999.
**Spacing (4pt):** s-1 4 · s-2 8 · s-3 12 · s-4 16 · s-5 20 · s-6 24 · s-8 32 · s-10 40 · s-12 48 · s-16 64.
**Shadow:** `--cl-shadow-1/2/3`, `--cl-focus`.

### Typography

- **Sans:** Geist, falling back to Inter → system. 650 weight for display numerics, 600 for h1/h2, 500 for controls.
- **Mono:** Geist Mono / JetBrains Mono. **All numeric values use mono with `tnum, zero` features** — use the `Num` component or `.num` class.
- Scale: h1 44px / h2 28 / h3 20 / h4 15 / body 14 / small 13 / micro 12 / eyebrow 11 uppercase.
- Tracking tightens as size grows: -0.04em at display, -0.005em at body, 0 for mono.

### Themes

Toggle via `[data-theme="light"|"dark"]` on `<html>`. Equal-priority — design in both.

### Density

`--cl-density` (0.85–1.15) scales row heights. Default 1.

---

## Component API

| Component | Props | Notes |
|---|---|---|
| `Button` | `variant: primary\|secondary\|ghost\|danger\|success\|dark`, `size: sm\|md\|lg`, `icon`, `iconRight`, `full`, `disabled` | Primary = brand filled. Secondary = outlined. |
| `Input` | `value`, `onChange`, `icon`, `suffix`, `size`, `type` | Leading icon slot for context. |
| `Field` | `label`, `hint`, `error` | Wraps Input. |
| `Card` | `pad` (default 20), `flush` | Single elevation pattern. Stack with gaps. |
| `Badge` | `tone: neutral\|brand\|up\|down\|warn\|info`, `dot` | Pill status. |
| `Num` | `size`, `weight`, `color` | Always use for currency, rates, hashes. |
| `Table` | `columns: [{label, render, align, nowrap}]`, `rows` | Uppercase 12px headers, 13px rows, hover bg. |
| `Tabs` | `variant: line\|pill` | Line for primary nav, pill for filters. |
| `Steps` | `steps: [labels]`, `current` | Numeric or check glyphs. |
| `Sparkline / LineChart / CandleChart` | `data` / `candles`, dimensions | Use `--cl-up`/`--cl-down` for directional charts. |
| `AssetLogo` | `symbol`, `size` | USDT/BTC/ETH/SOL/TRX/BNB/NGN. |
| `ChainBadge` | `chain: TRC-20\|BEP-20\|ERC-20\|SOL` | Mono font, colored dot. |

---

## Screen inventory

### Marketing
- **Landing** — hero with live rate card, stats strip, feature grid, dark CTA. *Missing (extend by pattern): pricing, security, legal, status, careers.*

### Auth
- Signup · Login · Email OTP · 2FA · Forgot password. *Missing: password reset success, device-trust confirmation, recovery codes — extend from the `AuthFrame` pattern.*

### Customer · Desktop
- Dashboard (with data) · Dashboard (empty / onboarding)
- Trade (Buy/Sell/Swap with candle chart, rail picker, fee breakdown)
- Asset detail (USDT across chains)
- Receive (network picker, QR, warning banner)
- Orders (list with limit/market/swap)
- Transactions history (filtered, exportable)
- Transaction detail (right-side drawer, 480px)
- KYC (4-step: Identity/Selfie/Address/Review)
- Settings (Security · Payment methods · Sessions; extend for Profile/Notifications/Privacy/Limits)
- Support tickets (list + conversation)
- Help center (articles index)

### Customer · Mobile
- Dashboard (with balance card + bottom tab bar)
- Send (recipient picker + custom numpad)
- KYC selfie (liveness frame). *Extend to full mobile parity using the `MobileFrame` wrapper.*

### Admin
- Ops overview (stat grid, live volume chart, system health)
- Users list + filters
- User detail (activity, risk panel, freeze/limits)
- KYC queue (master-detail with Smile ID score, docs preview, approve/reject/re-request)
- Transactions (live table, type tabs)
- Wallets (hot/cold per chain, multi-sig operations log)
- Reports (financial / compliance / activity / growth, sparklines)
- Audit log (immutable append-only, actor/action/entity/IP)
- CMS (marketing site editor, fee schedule)

### System states
- Toasts (up/warn/down/info/brand)
- 404 error page

---

## Patterns to apply everywhere

1. **Numbers are mono.** Use `<Num>` or `.num`. Includes ₦ amounts, USDT, percentages, IDs, hashes, timestamps.
2. **Currency formatting.** NGN uses `₦` prefix, space, comma thousands, no decimals for display totals. USDT uses 2 decimals, symbol suffix.
3. **Status = Badge with dot.** Every state indicator. `tone="up"` for confirmed/active/verified, `warn` for pending, `down` for failed/rejected/frozen, `info` for system, `neutral` for inactive.
4. **Chain is a ChainBadge.** Never just text "TRC-20".
5. **Asset is AssetLogo + name.** Never just a text symbol.
6. **Tables have:** uppercase column headers, filters + tabs on the card header, right-aligned numerics, export button, pagination footer with count.
7. **Forms:** `Field` wraps label + input + hint/error. Primary action bottom-right or full-width on narrow. PIN/OTP: six `56×64` boxes with mono font.
8. **Security warnings:** warn-soft background, icon left, bold leading clause ("Only send USDT on TRC-20.").
9. **Money movement:** always show rate, platform fee, network fee, total on the review step.
10. **Audit trail:** every admin action writes one line — actor, action, entity id, IP, timestamp.
11. **KYC copy:** reference Smile ID primary / Youverify backup. Emphasize Fernet encryption + NDPR alignment.
12. **Empty states:** icon → headline → copy → primary CTA. Three-step onboarding pattern for new users.

---

## What's intentionally out of scope

- **Real icons.** Lucide React + a crypto logo pack (e.g. `cryptocurrency-icons`) should replace the inline SVG stubs.
- **Real copy.** Placeholder strings; product team should review.
- **Dynamic charts.** Use `lightweight-charts` for trade, `recharts`/`visx` for portfolio, keeping the same color usage.
- **Motion.** No prescribed animation beyond hover/focus transitions. Use 150ms ease-out for entries, 100ms for micro-interactions.
- **A11y details.** Contrast passes at AA; add labels, focus rings (already tokenized as `--cl-focus`), and aria roles during implementation.
- **i18n.** The product is Nigeria-first; plan for en-NG only initially. Numbers already tabular, so localization is drop-in later.

---

## Porting strategy (recommended)

1. Install tokens: copy `tokens.css` variables into your existing theme file (Tailwind `theme.extend.colors`, or CSS vars directly). Dark mode wires to `[data-theme="dark"]`.
2. Map primitives to your stack: if using shadcn/ui, override Button/Input/Card variants to match. Keep `Num` as a tiny wrapper forcing mono + tnum.
3. Rebuild screens route-by-route, using the reference as layout ground truth. Keep the information density and whitespace ratios.
4. Replace icon placeholders with Lucide, crypto logos with the real pack.
5. Wire real data — the data shapes shown in tables are indicative of what the UI needs (tier, kyc status, risk score, hot/cold split, etc.).

---

## Questions to resolve with design before build

- Exact typeface license (Geist is free; confirm Geist Mono).
- Logo final form (the `ClusteerMark` SVG here is a working direction — verify against brand).
- Fee schedule authority (admin CMS vs env config).
- Admin role matrix (compliance vs ops vs platform — reflected in sidebar groups but not in a permissions UI).
- Whether P2P by `@username` is in v1 (appears on landing + mobile send).

---

# Mobile app port (React Native / Expo)

**Target stack:** Expo SDK (latest) + React Native + TypeScript + `@react-navigation/native` (stack + bottom tabs) + `react-native-svg` + `react-native-reanimated` + `expo-font` + `expo-linear-gradient` + `expo-haptics`.

The mobile design lives entirely in `mobile/` and is **independent from the web design system above**. It uses a different brand expression — bolder, more playful, lime+onyx instead of brand blue.

## Mobile file map

| File | Contents |
|---|---|
| `Clusteer Mobile.html` | Host page that wires everything together. Run this in a browser to see all screens in iOS/Android frames. |
| `mobile/theme.jsx` | **Design tokens.** Colors (`CT.*`), fonts (Sora display / Inter body / JetBrains Mono numerics), radius scale, `ThemeProvider` + `useTheme` hook for light/dark. Brand logo SVGs (`ClusteerLogo`), bank logos, asset logos. **This is your `theme.ts` source of truth.** |
| `mobile/ui.jsx` | All UI primitives: `Phone` (frame), `Screen`, `AppBar`, `IconBtn`, `BtnPrimary`, `BtnSecondary`, `BtnGhost`, `Pill`, `Card`, `Row`, `BottomNav`, `TextField`, `Sheet`, `Toast`, `Num`, `Tabs`, `Badge`, `Sparkline`, `Switch`. Port these to RN equivalents. |
| `mobile/icons.jsx` | Icon set — wraps Lucide. In RN, swap to `lucide-react-native`. |
| `mobile/charts.jsx` | `ClusteerChart`, `CandleChart`, `RangeTabs`, `Donut`. In RN, use `react-native-svg` (already SVG-based, mostly drop-in) or swap to `victory-native` / `react-native-skia` if you want perf. |
| `mobile/data.jsx` | Mock data: assets, transaction history, banks, notifications, support chat, rate series, FAQ topics, formatters (`FMT_NGN`, `FMT_USDT`, `FMT_USD`). Treat as fixtures for the UI; replace with real API responses. |
| `mobile/screens/` | All screens — see inventory below. |

## Mobile screen inventory (`mobile/screens/`)

| File | Screens |
|---|---|
| `onboarding.jsx` | Splash, welcome carousel, auth (signup/login), email/phone OTP, biometric prompt, success states |
| `dashboard.jsx` | Home with balance card, asset list, quick actions, recent transactions, sparklines |
| `trade.jsx` | Buy/Sell USDT or USDC ↔ NGN, rate display, amount input with custom numpad, bank selection, review, success |
| `transfer.jsx` | Send (recipient picker, amount, review), Receive (network/QR), withdraw to bank |
| `account.jsx` | Profile, settings, security, payment methods, sessions, support chat, notifications, help center |
| `kyc.jsx` | KYC flow — tier selection, ID upload, selfie/liveness, address proof, review, status |
| `identity.jsx` | Brand surfaces: AppIcon variants, LockScreen, PushNotification, HomeWidget, AppLockedState |

## Mobile design system

### Brand
- **Primary:** Lime `#9FE870` on Onyx `#21241D`
- **Surfaces:** Pale green `#EFFCD0`, warm cream backgrounds
- **Accents:** Deep green `#0F4F26`, neutral grays
- **Mark:** Solid filled "C" with 4 dots (see `ClusteerLogo` in `mobile/theme.jsx`)
- **Direction:** Bold Playful — generous radii, friendly numerics, confident type

### Typography
- **Display:** Sora (600/700/800) — headlines, balances, screen titles
- **Body:** Inter (400/500/600) — UI labels, body copy, buttons
- **Numerics:** JetBrains Mono (500/600) — every currency value, rate, amount, hash, ID. Wrap with `<Num>` component (forces tabular nums).

### Scope
**USDT and USDC ↔ NGN only.** Do NOT add BTC/ETH/SOL/other assets to the mobile app. The web platform is multi-asset; the mobile app is intentionally focused on stablecoin off-ramping for the Nigerian market. The trade and transfer screens reflect this.

### Frame sizes
Designed for `390 × 844` (iPhone 14 Pro reference). Use safe-area insets in RN (`react-native-safe-area-context`). Status bar = 44px, bottom home indicator = 34px on iOS.

## Porting strategy (mobile)

1. **Scaffold Expo app** — `npx create-expo-app clusteer-mobile -t expo-template-blank-typescript`. Add navigation, reanimated, svg, safe-area, fonts.
2. **Translate `mobile/theme.jsx` → `src/theme/`** — split into `colors.ts`, `typography.ts`, `radius.ts`. Keep the same token names (`CT.lime`, `FONTS.display`, etc.) so screens port cleanly. Build a `ThemeProvider` using React Context.
3. **Load fonts via `expo-font`** — Sora, Inter, JetBrains Mono. Use the variable font files where possible.
4. **Port `mobile/ui.jsx` primitives one at a time.** RN gotchas:
   - `<div>` → `<View>`, all text MUST be in `<Text>` (no bare strings)
   - No CSS — use `StyleSheet.create({...})` or inline style objects (most CSS props supported, with caveats)
   - No `gap` on older RN; use `marginRight`/`marginBottom` or upgrade to RN 0.71+ where flex `gap` works
   - No `cursor`, no `:hover` — use `Pressable` with `pressed` state for press feedback
   - `position: absolute` works but no `inset: 0` shorthand — use `top:0, right:0, bottom:0, left:0`
   - `boxShadow` → `shadowColor` + `shadowOffset` + `shadowOpacity` + `shadowRadius` (iOS) + `elevation` (Android). Or use `react-native-shadow-2`.
   - Inline `<svg>` → `react-native-svg` (`<Svg>`, `<Path>`, `<Circle>`, `<Rect>`, etc.). API is nearly identical, just capitalize tags.
5. **Set up navigation** — bottom tabs for Home/Trade/Transfer/Account, stack navigators for flows (onboarding, KYC, transaction details). Match the `BottomNav` component visually.
6. **Port screens** roughly in this order: onboarding → dashboard → trade → transfer → account → kyc → identity surfaces. Each screen file has multiple screens inside; split into one file per screen during port.
7. **Custom numpad** in `transfer.jsx` / `trade.jsx` — important brand moment. Build as a controlled component, not a native keyboard.
8. **Haptics** — add `expo-haptics` light/medium impacts on primary CTAs, success toasts, numpad taps. Not in the design but expected on mobile.
9. **App icon + splash** — `mobile/screens/identity.jsx` has the `AppIcon` SVG and `LockScreen` references. Export at all required iOS/Android sizes via `expo-asset` or `app.json` icon config.

## Mobile gotchas / out of scope

- **No real wallet integration** — the screens show flows but don't connect to chain RPCs. Wire to your existing Clusteer mobile API or shared backend.
- **Charts use SVG** — fine for static, but for live ticker performance consider `react-native-skia`.
- **Bank logos** are SVG placeholders matching real Nigerian banks (GTBank, Access, UBA, Zenith, etc.). Verify usage rights before shipping production logos; consider monochrome bank glyphs if uncertain.
- **No biometric implementation** — the prompt UI is mocked. Use `expo-local-authentication` for real FaceID/TouchID/fingerprint.
- **Push notification design** is in `identity.jsx` — actual push wiring needs Expo Notifications + APNs/FCM setup.

## Suggested first prompt for Claude Code (mobile)

> Read `HANDOFF.md` first, then explore `mobile/`. Scaffold an Expo TypeScript app in `clusteer-mobile/`. Translate `mobile/theme.jsx` into a typed theme module under `src/theme/`. Port `mobile/ui.jsx` primitives to React Native components under `src/components/`. Then port the onboarding flow from `mobile/screens/onboarding.jsx` as the first reference screen so we can validate the porting pattern before doing the rest.
