# Clusteer Customer App — Release Readiness Remediation Plan

**Source:** full 4-dimension release-readiness audit (navigation graph, wiring, backend connectivity, edge cases) of `apps/customer`, run 2026-06-30.
**Purpose:** track every finding to a terminal state — fixed, blocked on a decision, blocked on sign-off, or explicitly won't-fix — so nothing is silently dropped.
**Status:** not started. No code has been changed as a result of the audit yet.

## Totals

| Severity | Count |
|---|---|
| BLOCKER | 21 |
| HIGH | 33 |
| MED | 30 |
| LOW | 27 |
| **Total** | **111** |

## How to use this document

1. **Do not fix everything at once.** Work module by module, in the sequence given below — modules are ordered so earlier ones either unblock or de-risk later ones.
2. **Every finding below is a checklist item.** When you fix one, check it off *and* note the commit SHA next to it. When a finding turns out to be a non-issue on closer inspection, check it off and note why instead of deleting the line — the goal is a complete record, not a clean one.
3. **Respect the risk tiers.** `SAFE-TO-FIX` items can be done directly. `NEEDS-DECISION` items require a product/architecture choice from the project owner before code is written — guessing here creates new bugs. `NEEDS-SIGN-OFF` items touch real money movement (order creation, OTP, fees, limits) and must not be touched without explicit go-ahead, per standing project rule.
4. **Verify per module, not at the end.** After each module's fixes land, re-check every finding in that module against the actual running code (build +, for Module C specifically, a real click-through — see the Verification section per module) before marking it done. Don't trust the diff alone.
5. **Small commits, no push without review.** One commit per module (or per sub-fix within a large module), consistent with how prior audit fixes were shipped. Do not push until the project owner has reviewed the diff.
6. **When this document reaches zero open checkboxes, the app is release-ready** — not before, regardless of how far along any single module feels.

## Status legend

- `[ ]` open
- `[x]` fixed (note commit SHA)
- `[~]` in progress
- `[?]` blocked — needs a decision or sign-off (see the module's "Decisions Needed" section)
- `[-]` verified non-issue on closer inspection (note why)

## Sequencing and dependencies

```
Module B (structural decisions)  ──┐
                                    ├──▶ Module E (nav/dead links) ──▶ Module G (marketing/legal)
Module A (auth token plumbing) ────┴──▶ Module F (auth downstream pages)

Module F (exposed API keys) ───────────▶ standalone, do any time

Module B (Django-vs-Spring decision) ──▶ Module H (backend contracts) ──▶ Module C (trade wizard)
Module D (2FA decision) ───────────────▶ Module D fixes

Module C and Module H require explicit sign-off before implementation (financial features).
```

Recommended order: **B → A → F(keys) → E → G → D(decision) → H → C**, with D and C gated on sign-off arriving.

---

## Module A — Auth Token Plumbing

**Goal:** every authenticated client-side query in the app successfully identifies the logged-in user and attaches a valid `Authorization` header, so downstream pages actually fetch real data instead of silently falling back to placeholders.

**Risk tier:** SAFE-TO-FIX — this is a pure bug fix with an unambiguous correct behavior (read the session via a mechanism that can actually see an `httpOnly` cookie).

**Root cause:** `auth_token` is set with `httpOnly: true` on every login/verify route (by design, for XSS protection), but several client-side hooks/libs try to read it via `document.cookie`, which cannot see `httpOnly` cookies. They always get `null`/`undefined`.

**The fix shape:** either (a) expose the minimum needed (e.g., just the user ID, not the token) via a **non-httpOnly** companion cookie or a small `/api/me` server route the client can call once and cache, or (b) route all these reads through a Next.js server component/route that *can* read the httpOnly cookie server-side. Do not simply drop `httpOnly` from `auth_token` — that reintroduces the XSS risk it exists to prevent.

### Tasks

- [ ] `apps/customer/src/hooks/use-user-id.ts:12` — `useUserId()` reads `document.cookie` for `auth_token`; always returns `null` client-side. Replace with a safe pattern (server-derived user ID, not the raw token).
- [ ] `packages/ui/src/lib/axios.ts:14-17` — `getAuthToken()` same issue; no `Authorization: Bearer` header ever attached on this axios client.
- [ ] `packages/ui/src/lib/api/settings/index.ts:13-21` — same `getAuthToken()` pattern, same fix.
- [ ] `packages/ui/src/lib/api/support/index.ts:11-19` — same `getAuthToken()` pattern, same fix.

### Downstream verification (should resolve automatically once the above land — re-check each, don't assume)

- [ ] `apps/customer/src/app/(dashboard)/settings/account/page.tsx:28-39,72-100` — confirm account-limits/KYC query now fires and replaces the hardcoded fallback limits.
- [ ] `apps/customer/src/app/(dashboard)/settings/notifications/page.tsx:111,114-118` — confirm notification-prefs query now fires, replaces `DEFAULT_PREFS`.
- [ ] `apps/customer/src/app/(dashboard)/settings/privacy/page.tsx:74,76-80` — confirm privacy toggles now reflect real saved state, and re-verify the mutation target is one the now-authenticated user can actually reach.
- [ ] `apps/customer/src/app/(dashboard)/settings/payment-methods/page.tsx:35,38-45` — confirm bank-accounts query now fires and shows real linked accounts (not a permanent empty state).
- [ ] `apps/customer/src/app/(dashboard)/identity-verification/page.tsx:67,95-99` — confirm KYC-status query now fires and shows real tier/document status, not `FALLBACK_TIERS`.

### Acceptance criteria

- A logged-in user reloading any of the 5 pages above sees data that changes when the underlying backend record changes (prove it by mutating one field via the backend directly and confirming the UI reflects it after refresh).
- No client-side code anywhere reads `document.cookie` for `auth_token` (grep should return zero matches post-fix).

---

## Module B — Structural Decisions

**Goal:** resolve the three architecture-level ambiguities that are blocking correct fixes elsewhere in the app. These are decisions, not code changes — writing code before deciding will produce fixes that have to be redone.

**Risk tier:** NEEDS-DECISION (all three sub-items).

### B1 — Orphaned root `clusteer-unified/src/`

**Finding:** a second, 90-page Next.js app sits at the monorepo root. It is not in `"workspaces": ["apps/*", "packages/*"]`, has no `apphosting.yaml`, and its last real feature commit was 2026-06-06, while `apps/customer` receives continuous commits. It is fully git-tracked and contains built-out `assets/`, `send/`, `receive/` pages plus `wallet-list.tsx`, `compact-wallet-list.tsx`, `buy-sell-crypto.tsx`, `stable-coin-converter.tsx`, `initialize-app.tsx`, and an `api/transfer/` route — none of which exist in `apps/customer`.

**Why it matters:** several live nav entries in `apps/customer` (mobile tab bar, command palette — see Module E) already assume `/assets`, `/send`, `/receive`, `/withdraw` exist. They don't, in the deployed app. The feature was very likely built in the wrong app copy.

**Decision: RESOLVED (2026-07-03)** — back up, then delete; the wallet feature may be rebuilt later.

- [x] Backed up before deletion, two ways: (1) zip archive at `/Users/saintlammy/Documents/Clusteer/_archive/clusteer-unified-legacy-src-2026-06-30.zip` (1.9MB, captures the full disk state including untracked in-progress files); (2) git branch `archive/legacy-root-src-2026-06-30`, committed at `f49b98d` — recoverable anytime via `git checkout archive/legacy-root-src-2026-06-30 -- clusteer-unified/src`.
- [x] **Cross-check before deleting:** `clusteer-unified/src/app/(admin)/admin/*` turned out to also contain a full parallel admin app (34 pages), not just the wallet feature this decision originally scoped. Compared 1:1 against `apps/admin/src/app/(dashboard)/*` — every page already exists there under a different route-group name, and `apps/admin` has more recent commits. No admin capability is lost by deleting the orphan; only the wallet/send/receive customer-facing pages (never migrated anywhere) are the real loss, and those are fully preserved in the backup for future use.
- [x] `clusteer-unified/src/` deleted from the active tree (`git rm -r`).

### B2 — Duplicate auth route families

**Finding:** three parallel sets of near-identical routes exist for the same features (register, login, verify-2fa, resend-verification, reset-password). Only the `auth-firebase/*` family is actually called by any page. The other two families (`api/auth/*` and bare `api/{login,register,...}`) are dead code, one of which is deprecated 410 stubs.

**Decision: RESOLVED (2026-07-03)** — `auth-firebase/*` confirmed canonical; other two families deleted.

- [x] `apps/customer/src/app/api/auth/login/route.ts` — deleted
- [x] `apps/customer/src/app/api/auth/register/route.ts` — deleted
- [x] `apps/customer/src/app/api/auth/verify-otp/route.ts` — deleted
- [x] `apps/customer/src/app/api/reset-password/route.ts` — deleted
- [x] `apps/customer/src/app/api/verify-2fa/route.ts` — deleted
- [x] `apps/customer/src/app/api/resend-verification/route.ts` — deleted
- [x] `apps/customer/src/app/api/login/route.ts` (410 stub) — deleted
- [x] `apps/customer/src/app/api/register/route.ts` (410 stub) — deleted
- [x] `apps/customer/src/components/nav-user.tsx:31` — repointed to `/api/auth-firebase/logout`, then the whole file was deleted anyway (see note below — it had become fully orphaned).

**Bonus finding during execution:** deleting `dashboard-nav.tsx` (dead, Module E) left `nav-user.tsx` with zero importers — it was only ever used by the dead component. Deleted it too rather than leave a newly-orphaned file behind (fully recoverable via git history — it was tracked, not new).

**Second bonus finding:** before deleting `apps/customer/src/app/api/auth/verify-otp/route.ts`, verified its only caller — `packages/ui/src/lib/api/auth/index.ts:57-64`'s `verifyOTP()` — is itself only used by `apps/customer/src/components/forms/verify-otp-form.tsx`, which has **zero importers** (confirmed via grep). Deleted that form component too. `google-otp-form.tsx` also matched a text search on "verifyOTP" but is unrelated (its own local mutation, calls `verifyGoogleAuthOTP`/`/user/{username}/2fa/validate` instead) and is still formally imported by `settings/security/google-auth/page.tsx` — left untouched, since that page's fate is tied to the still-open Module E settings/security orphan-page decision, not B2.

### B3 — Django (Blockchain Engine) vs Spring (Clusteer-Api) as source of truth for orders/transactions

**Finding:** order **creation** should flow through Spring Boot's `P2POrderService` (`/v1/order/purchase/create`, `/v1/order/sale/create`), but order **listing** and **cancellation** (`apps/customer/src/app/api/order/route.ts:29`, `order/[id]/cancel/route.ts:14`) call the Django Blockchain Engine instead, via `djangoFetch`. These are two different backends with (presumably) two different data stores. Orders created via Spring would never appear in the Django-backed list, and cancellation has no corresponding Spring endpoint at all.

**Decision: RESOLVED (2026-07-03) — Spring Boot (`Clusteer-Api`) is authoritative for orders.** Not a judgment call — verified by reading both backends' actual code:

- **Django (`Clusteer-Blockchain-Engine`) has no deployed Order model.** `p2p/order_models.py` and `p2p/views/order_views.py` — despite being well-built (proper `Order`/`OrderStatusHistory` models, pagination, filtering) — are **completely untracked in git** (`git status` shows `??`, `git log` shows zero history) and **no migration anywhere creates the `orders` table** (only 7 migrations exist in `p2p/migrations/`, none mention orders). This code has never touched a real database. Zero real order data is at risk by moving off it.
- **Django's wallet creation is custodial by design** — `MultiChainWallet`, `BscVaultWallet`, `EthVaultWallet`, `SolVaultWallet`, `TronsVaultWallet` all store raw/encrypted `private_key` fields directly (`p2p/views/wallets.py` generates them: `create_solana_wallet`, `create_tron_wallet`, etc.). This is the exact custodial system already parked pending VASP licensing per the project's earlier non-custodial compliance audit — it was never going to be the right home for order data going forward regardless of the migration state.
- **Spring already has a real, deployed Order implementation.** `P2POrderServiceImpl` uses a genuine `OrderRepository` (`orderRepo.save(newOrder)`) and is already wired directly to `QuidaxService` (`initiatePurchase`/`confirmPurchase`/`initiateSale`). Nothing needs to be built from scratch — the fix is purely re-pointing the customer app's routes.

**Tasks now unblocked (still gated on Module C/H sign-off before implementation):**
- [ ] `apps/customer/src/app/api/order/route.ts` and `order/[id]/cancel/route.ts` — repoint to Spring's real endpoints (`GET /v1/order` for listing — *not* `/user/{userId}/orders/`, see Module H); add a cancel endpoint to Spring's `OrderController.java` since none currently exists there.
- [ ] `apps/customer/src/app/api/transaction/user/route.ts` (dead Django proxy) — delete; the live path (`getAllTransactions()` in `packages/ui/src/lib/api/user/queries.ts:23-34`) already calls Spring's `/v1/transaction/user` directly (separate Module H finding about bypassing the server-side key-hiding pattern remains open).
- [?] **New, separate decision (not blocking):** `Clusteer-Blockchain-Engine/p2p/order_models.py` + `p2p/views/order_views.py` are uncommitted local files sitting in the working directory — not part of any commit history. Confirm whether this is abandoned exploratory work safe to leave alone/delete, or someone's active in-progress branch that shouldn't be touched without asking them first.

---

## Module C — Trade Wizard (Money Flow)

**Goal:** a buy or sell order placed through the UI actually creates a real order against the backend, is gated by a real OTP check, and reflects real settlement status — with no client-side fabrication anywhere in the path.

**Risk tier:** 🔴 **NEEDS-SIGN-OFF.** This is the single highest-stakes module in the entire audit — the current implementation lets a user complete an entire "successful trade," including a fake OTP step and a fake settlement confirmation, with **no network call made at any point** and **no money moved**. Per standing project rule, financial features (exchange rate, fee, OTP validation, transaction limits, order creation) are not to be touched without explicit sign-off. Do not begin implementation until that sign-off is given, even though the fix direction below is unambiguous.

**Depends on:** Module B3 decision (which backend is authoritative) and Module H (contract fixes) — order creation needs to actually reach Spring correctly before OTP/confirmation can be wired to it.

### Tasks

- [ ] `apps/customer/src/components/trade/order-review.tsx:44-82,121-128` — "Continue → Confirm with OTP" never calls `/api/trade`; replace `makeMockOrder()` + `setTimeout` with a real `/api/trade` call for both buy and sell.
- [ ] `apps/customer/src/components/trade/order-otp.tsx:19-25` — "Authorise order" never calls `/api/order/otp/validate` or `/resend`; wire both, remove the fake-delay accept-any-6-digits behavior.
- [ ] `apps/customer/src/components/trade/order-confirming.tsx:16-29` — replace the client `setTimeout` self-completion with real polling against an order-status endpoint until the backend reports settled/failed.
- [ ] `apps/customer/src/components/trade/order-confirming.tsx:16` + `apps/customer/src/components/trade/trade-wizard.tsx:133,159` — wire `onFailed`/`handleFailed` so the existing `OrderFailed` step actually becomes reachable when settlement fails.
- [ ] `apps/customer/src/components/trade/order-otp.tsx:16,74-83` — "Resend code" must call the real resend endpoint, not just reset a local countdown.
- [ ] `apps/customer/src/app/(dashboard)/orders/[id]/page.tsx:41-46` vs `apps/customer/src/app/api/order/route.ts:17-26` — `GET /api/order?id=` never reads the `id` param and always returns the paginated list; the page then does an unsound cast (`d.data as QxOrder | undefined`) and calls `order.status.replace()` with no optional chaining — **this throws a runtime `TypeError` for every single order-detail view today.** Fix the route to actually filter by `id`, and add proper typing/guards on the page so a shape mismatch fails safely instead of crashing.
- [ ] `apps/customer/src/components/trade/order-review.tsx:109`, `buy-entry.tsx:38`, `sell-entry.tsx:40` — all read `rateData.feePercent`, which `exchange-rate/route.ts` never returns; either add `feePercent` to that response or source the fee from wherever it's actually authoritative, and stop silently defaulting to a hardcoded 0.75%.
- [ ] `apps/customer/src/components/trade/buy-entry.tsx:37`, `sell-entry.tsx:39`, `apps/customer/src/app/(dashboard)/dashboard/page.tsx:40` — the hardcoded rate fallback (`1614.5`) must be visually distinguished from a real live rate (a "rate unavailable, try again" state, not a silent swap) before a user commits to a trade amount.
- [ ] `apps/customer/src/app/(dashboard)/dashboard/page.tsx:19-25,226-256` — replace hardcoded `MOCK_MARKETS` with real `/api/markets` data (the same data source the actual Markets page already uses).
- [ ] `apps/customer/src/app/(dashboard)/dashboard/page.tsx:84-99` — the verification/limit card ("Tier 1 · Verified", "₦10,000,000 daily limit", "24.5% used") must be backed by a real query once Module A/B land, not hardcoded JSX.
- [ ] `apps/customer/src/app/(dashboard)/request/page.tsx:15-17,80-85,123` — the entire payment-request feature is currently fake (hardcoded handle/link/rate, "Share" only toasts). Either wire it to a real backend-persisted request, or pull the feature from the UI until it's real — do not ship it half-fake.
- [ ] `apps/customer/src/app/(dashboard)/billing/page.tsx:9,26` — "Fees this month"/"Total fees paid" are a client-side flat 0.75% guess; source the real per-order fee once the backend actually exposes it.
- [ ] `apps/customer/src/components/trade/buy-entry.tsx:43`, `sell-entry.tsx:47` — add a real check against `MAX_TRADE_AMOUNT` and actual wallet/bank balance/limits client-side, in addition to (not instead of) the existing server-side check, so a user isn't led through a wizard that the server will reject.
- [ ] `apps/customer/src/components/trade/order-review.tsx:121-128,227-236` — replace the 600ms-local-timeout double-submit guard with a real idempotency key sent to the server, now that a real network call exists.

### Decisions needed

- [?] Confirm sign-off to begin implementation (financial feature).
- [?] Confirm the payment-request feature's fate (build for real vs. remove for now).

### Acceptance criteria (verify with the `/verify` skill — actually run the app, don't just read the diff)

- A test buy order, placed through the full UI wizard, results in a real order record visible via the backend/DB, with a real OTP required to proceed (verify a wrong OTP is actually rejected).
- Killing network mid-wizard (airplane mode) visibly fails the flow — no fabricated success screen.
- Session expiring mid-wizard is caught and the user is redirected to log in, not shown a fake completed trade.
- Double-clicking "Confirm with OTP" does not create two orders.
- The order-detail page (`/orders/[id]`) loads without throwing, for both an existing and a nonexistent order ID.

---

## Module D — Auth & 2FA Security

**Goal:** 2FA either actually works end-to-end or is removed from the UI until it does; no path exists where an unsigned/forged token or an unchecked OTP grants access.

**Risk tier:** mixed — the middleware and signup-OTP fixes are SAFE-TO-FIX (unambiguous correct behavior: fail closed, not open). The 2FA build-vs-remove choice is NEEDS-DECISION.

### Decision needed

- [?] **2FA endpoints don't exist on the Django backend** (`/user/{userId}/2fa/status/`, `/user/{userId}/2fa/secret/` — grepped, confirmed absent). Choose: (a) build these on whichever backend is confirmed authoritative per Module B3, or (b) remove the 2FA UI/toggle entirely until it can be built, so users aren't shown a security feature that silently does nothing.

### Tasks (SAFE-TO-FIX, no decision blocking these)

- [ ] `apps/customer/src/middleware.ts:15-27` — `verifyAuthToken` falls back to an **unsigned** manual JWT payload decode if `firebase-admin`'s `verifyIdToken` throws *or is simply unreachable* (a transient network blip is enough to trigger this). **This must fail closed** — if signature verification cannot be performed, treat the token as invalid, not valid. This is the highest-severity item in this module.
- [ ] `apps/customer/src/app/(auth)/verify-otp/page.tsx:52-55` — the signup-flow branch (`flow !== "login"`) currently accepts any 6 digits with zero API call and signs the user in client-side. Wire it to a real server-side OTP check.
- [ ] `apps/customer/src/app/(auth)/verify-otp/page.tsx:143-149` — "Resend code" must call a real resend endpoint.
- [ ] `apps/customer/src/app/(auth)/verify-2fa/page.tsx:16`, `verify-otp/page.tsx:30` — on an expired pending-2FA-token 401, redirect to `/login` instead of leaving the user stranded on the code-entry screen with only a toast.
- [ ] `apps/customer/src/app/api/auth-firebase/reset-password/route.ts:26` — invalidate the existing `auth_token` session server-side after a successful password reset (currently the old session stays valid).
- [ ] `apps/customer/src/app/api/auth-firebase/logout/route.ts:16` — `logoutFirebase()`'s `signOut(auth)` call is a no-op on the server; confirm cookie deletion is sufficient, or add a real server-side session invalidation if one becomes available.
- [ ] `apps/customer/src/lib/rate-limiter.ts:9` (used by `login/page.tsx:32,150` and the waitlist route) — the in-memory store doesn't share state across multiple server instances, so the "strict" rate limit isn't globally enforced on Cloud Run/App Hosting with >1 instance. Move to a shared store (Redis/Upstash, already scaffolded elsewhere in the codebase per `apphosting.yaml` comments) or accept the gap explicitly.
- [ ] `apps/customer/src/app/(auth)/login/page.tsx:174,186,201`, `signup/page.tsx:167,175` — Google/Apple/Passkey buttons currently just toast "Coming soon." Either hide these buttons until real, or clearly label them as unavailable rather than presenting live-looking CTAs.

### Tasks gated on the 2FA decision above

- [ ] `apps/customer/src/app/api/auth-firebase/login/route.ts:45` — replace/remove the call to the nonexistent `/user/{userId}/2fa/status/` endpoint.
- [ ] `apps/customer/src/app/api/auth-firebase/verify-2fa/route.ts:38` — replace/remove the call to the nonexistent `/user/{userId}/2fa/secret/` endpoint.
- [ ] `apps/customer/src/components/google-auth-qrcode.tsx:21,57` — reads `twoFactorSecret`, which `/api/user/2fa/request` intentionally never returns to the client (kept server-side, correctly, for security) — the "Copy key" button is permanently disabled as a result. Needs a real manual-entry flow if 2FA is kept.
- [ ] `apps/customer/src/app/api/user/[username]/2fa/validate/route.ts:58-67` — TOTP secret persistence failure is only `console.warn`'d while the response still claims success; must fail the response if persistence fails.
- [ ] `apps/customer/src/app/api/user/2fa/request/route.ts:23-26` — guard against silently regenerating a new secret/QR on every GET, invalidating an in-flight setup attempt.

### Acceptance criteria

- A forged/unsigned token is rejected by middleware even when Firebase Admin is simulated as unreachable.
- Signup OTP verification actually fails for a wrong code.
- 2FA either demonstrably works end-to-end (enable → log out → log back in requires the code) or has been removed from the UI — no partial/silent state ships.

---

## Module E — Navigation / Dead Links

**Goal:** every visible link, button, and nav entry in the app either goes somewhere real or is removed; no orphaned pages sit unreachable without an explicit reason.

**Risk tier:** SAFE-TO-FIX, except the `/assets`/`/send`/`/receive`/`/withdraw` entries which depend on the Module B1 decision.

### Tasks depending on Module B1

- [ ] `apps/customer/src/components/app/mobile-tab-bar.tsx:9,11` — "Wallet"/"Send" tabs point at `/assets`/`/send`, which don't exist in `apps/customer`. Fix once B1 is decided (either the pages get migrated in, or these tabs are removed/repointed).
- [ ] `packages/ui/src/components/app/command-palette.tsx:28,30,31,32` — "Wallet", "Send"/"Send crypto", "Receive", "Withdraw NGN"/"Withdraw to bank" all route to non-existent pages. Same dependency as above.
- [ ] `apps/customer/src/middleware.ts:89-109` — remove dead `protectedPaths` entries (`/assets`, `/send`, `/receive`, `/wallet`, `/transactions`, `/bank-accounts`, `/profile`, `/security`) or add the real pages, per the B1 decision.
- [ ] `apps/customer/src/components/dashboard-nav.tsx`, `nav-bar-dashboard.tsx` — dead/unimported shell components referencing `/assets`; delete once B1 is resolved (don't let them get accidentally reactivated with a stale nav list).
- [ ] `apps/customer/src/components/asset-client.tsx:47,53,59` — orphaned component linking to non-existent `/assets/[currency]/send|receive` routes plus a literal `href="#"` for "Convert"; delete or fix per B1.
- [ ] `apps/customer/src/components/recent-activity.tsx` — orphaned, unimported; delete if not needed once B1 lands.
- [ ] `apps/customer/src/components/nav-user.tsx:115,119` — `/billing`, `/settings/notifications` links currently unreachable since this component is only used by the dead `dashboard-nav.tsx`; resolve alongside that deletion.

### Tasks independent of B1

- [ ] `apps/customer/src/app/(dashboard)/identity-verification/page.tsx:174-181` — "Upgrade" button on Tier 2/3 cards has no `onClick` at all; wire it to the real tier-upgrade flow.
- [ ] `apps/customer/src/components/flow-host.tsx` (via `settings/page.tsx:243`) — "Create new key" calls `window.openFlow("createApiKey")`, which isn't registered in `MODAL_FLOWS`/`DRAWER_FLOWS`; register the flow or remove the button.
- [ ] `apps/customer/src/components/mobile-menu.tsx:89,98,107` — `#how-it-works`, `#features`, `#reviews` anchors don't exist on the homepage (there is no reviews section at all); add the matching ids/sections or remove the links.
- [ ] `apps/customer/src/app/(auth)/verify-2fa/page.tsx` — fully built, posts to a real API, but nothing links to it (`login.tsx:55` redirects to `/verify-otp?flow=login` instead). Decide which page is canonical and remove/redirect the other.
- [ ] `apps/customer/src/middleware.ts:70-109` — `/verify-2fa`, `/referrals`, `/markets`, `/request` currently match neither `publicPaths` nor `protectedPaths` and fall through unauthenticated. Add them explicitly to the correct array.
- [ ] `apps/customer/src/middleware.ts:70-83` — remove dead `publicPaths` entries (`/change-password`, `/auth/callback`) that don't correspond to real routes.
- [ ] `apps/customer/src/app/(dashboard)/settings/page.tsx` — renders its own inline tab UI instead of routing to the dedicated sub-pages, orphaning `/settings/account`, `/limits`, `/notifications`, `/payment-methods`, `/privacy`. Decide: make `/settings` a real router to those pages, or delete the sub-pages and keep the inline version as canonical (see also Module C's finding that the inline version is fully mocked — likely resolve both together).
- [ ] `apps/customer/src/app/(dashboard)/settings/security/page.tsx`, `security/google-auth/page.tsx`, `security/change-email/page.tsx`, `security/change-password/page.tsx` — same orphan pattern; the live flows use modals instead. Same decision as above.
- [ ] `apps/customer/src/app/(dashboard)/identity-verification/verify/page.tsx` — orphan; the main page's upload buttons open a native file picker directly. Delete if truly unused.
- [ ] `apps/customer/src/app/(dashboard)/markets/page.tsx` — not in `sidebar.tsx`'s nav array, zero inbound links. Add a nav entry or remove the page.
- [ ] `apps/customer/src/app/(dashboard)/request/page.tsx` — intentionally hidden from the sidebar ("requires own crypto license") but the route is still live and unauthenticated-reachable. Either gate it server-side (matching the intent of hiding it) or confirm it's fine as a soft-hidden route.
- [ ] `apps/customer/src/app/(marketing)/about/page.tsx:206-210` — "View open roles" CTA points at `/contact` instead of `/careers`; fix the href.
- [ ] `apps/customer/src/app/page.tsx:459` vs `apps/customer/src/middleware.ts:105` — homepage "Talk to us" CTA points at `/support`, which is a protected route — an anonymous marketing visitor clicking it gets redirected to `/login` instead of reaching any help/contact content. Point it at `/contact` or make a public support-intake path.

### Acceptance criteria

- A full crawl of every `Link`/`router.push`/`onClick` in the app resolves to either a real route or is intentionally removed.
- No page exists that cannot be reached from the live nav/shell, unless explicitly documented here as "intentionally hidden" with a reason.

---

## Module F — Exposed API Keys

**Goal:** no backend API key is present in the browser-shipped bundle, matching the fix already applied to the Spring Boot `X-API-KEY` earlier in this project.

**Risk tier:** SAFE-TO-FIX — direct repeat of a pattern already fixed once (`fix(security): stop shipping the Spring X-API-KEY to the browser`, commit `4e23186`).

### Tasks

- [ ] `packages/ui/src/lib/api/settings/index.ts:5-32` — `blockchainApiClient` bakes `NEXT_PUBLIC_BLOCKCHAIN_ENGINE_API_KEY` into default request headers; this client is imported into 5 `"use client"` pages (settings/account, settings/notifications, settings/privacy, settings/payment-methods, identity-verification). Remove the client-side key injection; proxy these calls through a Next.js server route that attaches the key server-side instead (same fix shape as the Spring key).
- [ ] `packages/ui/src/lib/api/support/index.ts:3-9` — same pattern with the Django `X-API-KEY`, called directly from `support/[ticketNumber]/page.tsx:7`, a client component. Same fix.
- [ ] After both fixes: confirm via `grep -rn "NEXT_PUBLIC_BLOCKCHAIN_ENGINE_API_KEY"` that the value is only read server-side, and check whether `apps/customer/apphosting.yaml`/`apps/admin/apphosting.yaml` need the same `availability: [RUNTIME]` (not `[BUILD, RUNTIME]`) treatment applied to the Spring key.

### Acceptance criteria

- The Blockchain Engine API key does not appear anywhere in the built client JS bundle (grep the `.next/static` output after a fresh build).

---

## Module G — Marketing & Legal Honesty Pass

**Goal:** every claim on a public marketing page is either real, clearly labeled illustrative, or removed — consistent with the "zero users yet, no fabricated stats" standard already applied elsewhere in the app. Legal pages contain no unresolved placeholder text.

**Risk tier:** mostly SAFE-TO-FIX (content/copy changes); the legal placeholders and the analytics-cookie claim are NEEDS-DECISION.

### Decisions needed

- [?] **Legal placeholders** (`terms-of-service/page.tsx`) — the liability cap (`₦____`) and the dispute-resolution clause note ("Choose one and confirm with counsel") are not something engineering should fill in unilaterally. Route to counsel/the project owner for the actual values, then replace.
- [?] **Analytics cookies** (`cookie-policy/page.tsx:221-234`) — the page claims `_ga`/`_gid` (Google Analytics) and `_fbp` (Meta Pixel) are used, but no such scripts exist anywhere in the codebase. Decide: implement the tracking for real (consent-gated, per the existing `ConsentScripts` scaffolding), or remove the claim from the cookie policy. Do not leave a legal document asserting data collection that isn't happening (or, worse, ship the claim and then quietly add tracking later without updating consent flows).

### Tasks (SAFE-TO-FIX)

- [ ] `apps/customer/src/app/(marketing)/buy/page.tsx:94-101` — "Live rate" card hardcoded ₦1,612, badged "LIVE," "updates every few seconds" — zero fetch anywhere in the file. Wire to `/api/system/exchange-rate` or remove the "LIVE" framing.
- [ ] `apps/customer/src/app/(marketing)/buy/page.tsx:136,159` — hardcoded order-ticket preview (₦500,000 → 310.05 USDT); either make it a live calculator or clearly label it illustrative.
- [ ] `apps/customer/src/app/(marketing)/sell/page.tsx:80-121` — hardcoded sell ticket plus a fabricated "5 min — median time from deposit to NGN payout" stat on a product with zero completed payouts. Remove the stat entirely (no data exists to back it).
- [ ] `apps/customer/src/app/(marketing)/sell/page.tsx:144-171` — decorative fake linked-bank list ("GTBank •• 4321") shown next to a "live" ticket; remove or clearly label as a mockup.
- [ ] `apps/customer/src/app/(marketing)/press/page.tsx:211-212` — "2023" founding year is a specific, uncorroborated claim (the about page deliberately avoids stating one). Remove or align with whatever the actual/intended founding narrative is.
- [ ] `apps/customer/src/app/(marketing)/live-markets/page.tsx:1-82,56` — page is titled "Live markets"/promises real-time rates but is a hero-only "Coming soon" stub, inconsistent with buy/sell showing the same class of data hardcoded and badged "LIVE" with no disclaimer. Make both pages consistent — either both honestly labeled pre-launch, or both wired to real data.
- [ ] `apps/customer/src/app/(marketing)/payments/page.tsx:1508-1514` — fake QR/payment-link preview presented as a real, working capability; no backing route exists at all. Label as illustrative or remove until Module C's request-feature fate is decided.
- [ ] `apps/customer/src/app/(marketing)/rate-alerts/page.tsx:16-111` — alert builder has zero `onSubmit`/fetch; all inputs are local state that goes nowhere on submit. Either wire it to a real backend (even just an email capture, similar to the waitlist) or make the "mockup" framing explicit beyond the small disclaimer that currently exists.
- [ ] `packages/ui/src/components/app/footer.tsx:21-24` — hardcoded "All systems operational" badge shown on every marketing page, completely independent of the real `/api/status` check; wire it to `getSystemStatus()` so it can actually show degraded/down states.
- [ ] `packages/ui/src/components/app/footer.tsx:196` — hardcoded fake version string "v3.2.1 · build 4f8a92" not matching `package.json` or any commit SHA; either wire to the real build info or remove.
- [ ] `packages/ui/src/components/app/footer.tsx:30,44,64,78` — all 4 social icons are dead `href="#"` links, inconsistent with the real X link used on the contact/status pages; point them at real accounts or remove until they exist.
- [ ] `apps/customer/src/app/(marketing)/cookie-policy/page.tsx:306`, `privacy-policy/page.tsx:621`, `aml-cft/page.tsx:467`, `terms-of-service/page.tsx:658` — empty `<h2></h2>` in the closing CTA card, copy-pasted across all 4 legal pages; add the missing heading text.
- [ ] `apps/customer/src/app/page.tsx:11-13` — three dead imports never rendered (`Num`, `RateTicker`, `PixelRain`), orphaned from a prior homepage iteration; remove.
- [ ] `apps/customer/src/app/(marketing)/help/page.tsx:136,289` vs `contact/page.tsx:128-133` — contradictory, unverifiable support-response-time claims ("2 hours" vs "4 hours," different stated business hours). Align on one honest figure (or none, given there's no support history yet).
- [ ] `apps/customer/src/app/(marketing)/contact/page.tsx:42-105` — no `<form>` anywhere despite copy implying in-app responsiveness; either add a real contact form or adjust the copy to match the actual mailto-only mechanism.
- [ ] `apps/customer/src/app/(marketing)/careers/page.tsx:1-107` — no application form, mailto-only despite "send us a note" copy; same treatment as above.
- [ ] `apps/customer/src/app/api/system/exchange-rate/route.ts:14-15,60-64,111` — hardcoded fallback rates are always stamped `source: "live"` even when the fallback was actually used; add a real `source: "fallback"` (or similar) flag so callers (homepage, buy/sell) can visually distinguish real live data from a stale guess.
- [ ] `apps/customer/src/app/api/system/exchange-rate/route.ts:29-31` — malformed upstream JSON silently falls back to a hardcoded `1420`, also stamped `source:"live"`; same fix as above.
- [ ] `apps/customer/src/app/page.tsx:130-136` — homepage `liveRate` query has no `onError`/`isError` handling; add one so a failed fetch shows a visibly-degraded state instead of silently displaying the hardcoded default next to a "LIVE" badge.
- [ ] `apps/customer/src/app/(marketing)/early-access/page.tsx:31` — `res.json().catch(() => ({}))` masks a non-JSON infra failure (e.g. an HTML 500 page) behind a generic message; acceptable as-is but consider surfacing a more specific "service unavailable" state.
- [ ] `packages/ui/src/lib/system-status.ts` vs `apps/customer/src/lib/system-status.ts` — two different implementations exist; confirm which one the status page actually resolves to via the `tsconfig.json` path alias, and delete the unused copy to remove the ambiguity.

### Acceptance criteria

- No marketing page displays a number, stat, or "LIVE" badge that isn't backed by a real, currently-reachable data source or explicitly labeled illustrative.
- Both legal-page issues (placeholders, cookie claims) are resolved with actual input from the person who owns that content — not invented by whoever does the code fix.

---

## Module H — Backend Contract Fixes

**Goal:** every frontend-to-backend call has a request shape the backend actually accepts and a response shape the frontend actually reads correctly.

**Risk tier:** 🔴 **NEEDS-SIGN-OFF** for the trade/order-related contracts (financial), SAFE-TO-FIX for the rest. Depends on Module B3's Django-vs-Spring decision for full resolution.

### Tasks (financial — needs sign-off, feeds directly into Module C)

- [ ] `apps/customer/src/app/api/trade/route.ts:60-62` vs `Clusteer-Api/.../dtos/p2p/CreateP2PPurchaseOrder.java:11-24` and `CreateP2PSaleOrder.java:12-30` — both buy and sell payloads omit the backend's required `currency` and `rate` fields; add them.
- [ ] `apps/customer/src/app/api/order/otp/resend/route.ts:28-31` vs `Clusteer-Api/.../dtos/p2p/ResendOrderOtp.java:9` — field-name casing mismatch (`orderId` vs backend's `orderID`); fix to match.
- [ ] `apps/customer/src/app/api/order/otp/validate/route.ts:28-31` vs `Clusteer-Api/.../dtos/p2p/ValidateOrderOtp.java:8-10` — casing mismatch on both `orderId`/`orderID` and `otpCode`/`otp`; fix to match.
- [ ] `apps/customer/src/app/api/order/route.ts:29` vs `Clusteer-Api/.../controllers/v1/OrderController.java:58-64` — the real "my orders" endpoint is `GET /v1/order` (`getMyOrders`), not `/user/{userId}/orders/`; repoint once Module B3 is decided.
- [ ] `apps/customer/src/app/api/order/[id]/cancel/route.ts:14` — no corresponding cancel endpoint exists in Spring's `OrderController.java` at all; add one on the backend before this route can ever succeed.
- [ ] `apps/customer/src/app/api/order/route.ts:31-38,45-51`, `transaction/user/route.ts:27-34,70-76` — any backend error is currently caught and silently returned as `{status:true, data:[]}`, indistinguishable from "you have no orders." Return a real error state instead.

### Tasks (non-financial, SAFE-TO-FIX)

- [ ] `apps/customer/src/app/api/auth-firebase/register/route.ts:68-70` vs `Clusteer-Api/.../dtos/user/RegisterUser.java:14-16` — frontend allows `_` in generated usernames; backend's `^[a-zA-Z0-9]+$` pattern rejects it. Align the frontend's charset to match, or loosen the backend pattern (pick one, don't leave the mismatch).
- [ ] `apps/customer/src/app/api/auth-firebase/login/route.ts:1-92` — never calls Spring's real `POST /v1/user/login`; login is 100% Firebase-only today, so the backend never learns about a login event or syncs profile/roles. Decide whether this matters for the current architecture (if the auth bridge from the earlier onboarding-migration discussion is ever built, this becomes moot) and wire it if so.
- [ ] `apps/customer/src/app/api/auth-firebase/register/route.ts:67-78` — backend profile-creation failure is only `console.error`'d; the client is always told "Registration successful" regardless. Add a retry mechanism or a reconciliation job for orphaned Firebase-only users.
- [ ] `apps/customer/src/app/api/user/profile/update/route.ts:52-91,103` — `email` is destructured from the request but never forwarded to the backend, yet the response echoes it back as if saved. Either forward it for real or stop echoing it.
- [ ] `apps/customer/src/app/api/kyc/upload/route.ts:216-227` — an unguarded `.json()` call on a Django error response throws internally if the upstream returns non-JSON (e.g. an HTML 502), masking the real status behind a generic 500. Add the same `.catch()` guard used elsewhere in the same file.
- [ ] `packages/ui/src/lib/api/auth/index.ts:48-55,119-135` — `changePassword()`, `changeEmail()`, `sendEmailOTP()` POST to Next.js routes (`/user/password/update`, `/user/email/update`, `/user/send-email-otp`) that don't exist anywhere under `apps/customer/src/app/api`; `settings/security/change-password` and `change-email` pages always 404 as a result. Build the missing routes or repoint to whatever the real mechanism is (note: modal-based change-password/change-email flows may already work via a different path — check before building duplicates, per the Module E orphan findings on the standalone pages).
- [ ] `apps/customer/src/app/(dashboard)/identity-verification/verify/[type]/page.tsx:94-99` — treats an HTTP 202 response as implicit success, but `apps/customer/src/app/api/kyc/verify/route.ts` never actually returns 202. Remove the dead branch or implement the async-processing pattern it implies.
- [ ] `apps/customer/src/app/api/kyc/{verify,upload}/route.ts`, `user/{profile,profile/update,avatar/update,delete,bank-accounts(+[id]),2fa/request,2fa/validate}/route.ts`, `notifications(+mark-all-read)`, `bank/verify-account` — all forward to the Django Blockchain Engine, whose reachability is not confirmed live per the app's own status-check code. Re-verify each against Module B3's decision.

### Acceptance criteria

- Every route in this module, when called with a valid session, returns a response whose shape the calling page correctly reads (verified by an actual request, not just code inspection).
- No request is sent with a field name the receiving backend doesn't recognize (grep both sides for every DTO involved).

---

## Appendix: Master Findings Ledger

Every finding from the audit, in one place, for a final cross-check that nothing was missed. Cross-reference the ID against the module sections above for the actual fix task.

| ID | Module | Severity | Location | One-line summary | Status |
|---|---|---|---|---|---|
| A-1 | A | BLOCKER | `hooks/use-user-id.ts:12` | `useUserId()` reads httpOnly cookie, always null | [ ] |
| A-2 | A | BLOCKER | `packages/ui/src/lib/axios.ts:14-17` | same, no Authorization header attached | [ ] |
| A-3 | A | BLOCKER | `packages/ui/src/lib/api/settings/index.ts:13-21` | same | [ ] |
| A-4 | A | BLOCKER | `packages/ui/src/lib/api/support/index.ts:11-19` | same | [ ] |
| A-5 | A | HIGH | `settings/account/page.tsx:28-39,72-100` | downstream: limits/KYC query never fires | [ ] |
| A-6 | A | HIGH | `settings/notifications/page.tsx:111,114-118` | downstream: prefs query never fires | [ ] |
| A-7 | A | HIGH | `settings/privacy/page.tsx:74,76-80` | downstream: toggles always default | [ ] |
| A-8 | A | HIGH | `settings/payment-methods/page.tsx:35,38-45` | downstream: bank accounts query never fires | [ ] |
| A-9 | A | HIGH | `identity-verification/page.tsx:67,95-99` | downstream: KYC status query never fires | [ ] |
| B1 | B | — | `clusteer-unified/src/` (whole app) | orphaned legacy app, wallet feature never migrated | [x] backed up (zip + `archive/legacy-root-src-2026-06-30`) then deleted |
| B2 | B | — | 8 duplicate auth route files | three parallel route families, two dead | [x] deleted, `nav-user.tsx` logout repointed then file deleted (fully orphaned) |
| B3 | B | — | order/transaction routes | Django vs Spring split, no single source of truth | [x] Spring confirmed authoritative — Django's Order model is uncommitted + never migrated, holds zero real data |
| C-1 | C | BLOCKER | `dashboard/page.tsx:19-25,226-256` | hardcoded MOCK_MARKETS | [ ] |
| C-2 | C | BLOCKER | `dashboard/page.tsx:84-99` | hardcoded verification/limit card | [ ] |
| C-3 | C | BLOCKER | `trade/order-review.tsx:44-82,121-128` | never calls /api/trade, fake order | [ ] |
| C-4 | C | BLOCKER | `trade/order-otp.tsx:19-25` | OTP never validated, decorative | [ ] |
| C-5 | C | BLOCKER | `trade/order-confirming.tsx:16-29` | fake self-completion via setTimeout | [ ] |
| C-6 | C | BLOCKER | `request/page.tsx:15-17,80-85,123` | entire payment-request feature fake | [ ] |
| C-7 | C | BLOCKER | `orders/[id]/page.tsx:41-46` + `order/route.ts:17-26` | id param ignored, crashes on render | [ ] |
| C-8 | C | HIGH | `order-confirming.tsx:16` + `trade-wizard.tsx:133,159` | onFailed never invoked, dead step | [ ] |
| C-9 | C | HIGH | `order-review.tsx:109`, `buy-entry.tsx:38`, `sell-entry.tsx:40` | feePercent never returned, hardcoded fallback | [ ] |
| C-10 | C | HIGH | `order-otp.tsx:16,74-83` | resend never calls API | [ ] |
| C-11 | C | HIGH | `buy-entry.tsx:43`, `sell-entry.tsx:47` | no MAX_TRADE_AMOUNT/balance check client-side | [ ] |
| C-12 | C | MED | `buy-entry.tsx:37`, `sell-entry.tsx:39`, `dashboard/page.tsx:40` | hardcoded rate fallback indistinguishable from live | [ ] |
| C-13 | C | MED | `billing/page.tsx:9,26` | fees computed as flat guess | [ ] |
| C-14 | C | MED | `order-review.tsx:121-128,227-236` | double-submit guard is only a local timeout | [ ] |
| C-15 | C | HIGH | `api/trade/route.ts:33-34` | correct validation exists but is dead (wizard never calls it) | [ ] |
| C-16 | C | BLOCKER | trade wizard as a whole | session-expiry mid-wizard invisible | [ ] |
| C-17 | C | BLOCKER | trade wizard as a whole | offline mid-trade has zero effect | [ ] |
| D-1 | D | BLOCKER | `auth-firebase/login/route.ts:45` | 2FA status check hits nonexistent endpoint | [?] |
| D-2 | D | BLOCKER | `auth-firebase/verify-2fa/route.ts:38` | 2FA secret retrieval hits nonexistent endpoint | [?] |
| D-3 | D | BLOCKER | `middleware.ts:15-27` | unsigned JWT fallback on verify failure | [ ] |
| D-4 | D | BLOCKER | `verify-otp/page.tsx:52-55` | signup OTP branch never calls API | [ ] |
| D-5 | D | HIGH | `verify-otp/page.tsx:143-149` | resend never calls API | [ ] |
| D-6 | D | HIGH | `google-auth-qrcode.tsx:21,57` | copy-key button permanently disabled | [?] |
| D-7 | D | HIGH | `user/[username]/2fa/validate/route.ts:58-67` | secret-save failure only warned, still claims success | [?] |
| D-8 | D | MED | `verify-2fa/page.tsx:16`, `verify-otp/page.tsx:30` | expired token, no redirect to login | [ ] |
| D-9 | D | MED | `auth-firebase/reset-password/route.ts:26` | no session invalidation after reset | [ ] |
| D-10 | D | MED | `auth-firebase/logout/route.ts:16` | signOut() no-op server-side | [ ] |
| D-11 | D | MED | `login/page.tsx:32,150` + `rate-limiter.ts:9` | in-memory rate limit not shared across instances | [ ] |
| D-12 | D | MED | `login/page.tsx:174,186,201`, `signup/page.tsx:167,175` | OAuth/Passkey "coming soon" stubs | [ ] |
| D-13 | D | LOW | `user/2fa/request/route.ts:23-26` | re-GET invalidates in-flight setup | [?] |
| E-1 | E | BLOCKER | `mobile-tab-bar.tsx:9,11` | Wallet/Send tabs → nonexistent routes | [x] replaced with sidebar.tsx's real `tab:true` set (Home/Buy-Sell/Orders/Me) |
| E-2 | E | BLOCKER | `command-palette.tsx:28,30,31,32` | Wallet/Send/Receive/Withdraw → nonexistent routes | [x] NAV_ITEMS rewritten to mirror sidebar.tsx exactly; broken actions removed |
| E-3 | E | BLOCKER | `identity-verification/page.tsx:174-181` | Upgrade button has no onClick | [ ] |
| E-4 | E | HIGH | `flow-host.tsx` / `settings/page.tsx:243` | createApiKey flow not registered | [ ] |
| E-5 | E | HIGH | `mobile-menu.tsx:89,98,107` | dead anchor links, no matching ids | [ ] |
| E-6 | E | HIGH | `verify-2fa/page.tsx` | orphan page, unreachable | [ ] |
| E-7 | E | HIGH | `middleware.ts:70-109` | /verify-2fa /referrals /markets /request unauth-reachable | [ ] |
| E-8 | E | HIGH | `settings/page.tsx` | orphans 5 dedicated settings sub-pages | [ ] |
| E-9 | E | HIGH | `settings/security/page.tsx` | orphan, cascades to its own sub-pages | [ ] |
| E-10 | E | MED | `middleware.ts:89-109` | dead protectedPaths entries | [x] removed 8 dead entries, added missing `/referrals` |
| E-11 | E | MED | `middleware.ts:70-83` | dead publicPaths entries | [x] removed `/change-password`, `/auth/callback`; added missing `/verify-2fa` |
| E-12 | E | MED | `settings/security/{google-auth,change-email,change-password}/page.tsx` | orphans | [ ] |
| E-13 | E | MED | `identity-verification/verify/page.tsx` | orphan | [ ] |
| E-14 | E | MED | `markets/page.tsx` | orphan, not in sidebar | [ ] |
| E-15 | E | MED | `request/page.tsx` | orphan + unauth-reachable | [ ] |
| E-16 | E | LOW | `dashboard-nav.tsx`, `nav-bar-dashboard.tsx` | dead components | [x] deleted (confirmed zero importers first) |
| E-17 | E | LOW | `nav-user.tsx:115,119` | unreachable links | [x] file deleted — became fully orphaned once `dashboard-nav.tsx` was removed |
| E-18 | E | LOW | `asset-client.tsx:47,53,59` | orphan, nonexistent routes | [x] deleted (confirmed zero importers first) |
| E-19 | E | LOW | `recent-activity.tsx` | orphan, unimported | [x] deleted (confirmed zero importers first) |
| E-20 | E | LOW | `about/page.tsx:206-210` | "View open roles" → wrong route | [ ] |
| E-21 | E | HIGH | `page.tsx:459` + `middleware.ts:105` | "Talk to us" → protected /support, anon redirected to login | [ ] |
| F-1 | F | BLOCKER | `packages/ui/src/lib/api/settings/index.ts:5-32` | Blockchain Engine key in browser bundle, 5 pages | [ ] |
| F-2 | F | BLOCKER | `packages/ui/src/lib/api/support/index.ts:3-9` | same pattern, support ticket page | [ ] |
| G-1 | G | HIGH | `buy/page.tsx:94-101` | hardcoded "live" rate, no fetch | [ ] |
| G-2 | G | MED | `buy/page.tsx:136,159` | hardcoded order-ticket preview | [ ] |
| G-3 | G | HIGH | `sell/page.tsx:80-121` | hardcoded ticket + fabricated 5-min stat | [ ] |
| G-4 | G | LOW | `sell/page.tsx:144-171` | decorative fake bank list | [ ] |
| G-5 | G | HIGH | `press/page.tsx:211-212` | fabricated 2023 founding year | [ ] |
| G-6 | G | HIGH | `live-markets/page.tsx:1-82,56` | stub inconsistent with buy/sell | [ ] |
| G-7 | G | MED | `payments/page.tsx:1508-1514` | fake payment-request feature | [ ] |
| G-8 | G | LOW | `contact/page.tsx:42-105` | no contact form | [ ] |
| G-9 | G | LOW | `careers/page.tsx:1-107` | no application form | [ ] |
| G-10 | G | BLOCKER | `terms-of-service/page.tsx` (6 locations) | unresolved legal placeholders live | [?] |
| G-11 | G | MED | `rate-alerts/page.tsx:16-111` | no submit action, input discarded | [ ] |
| G-12 | G | HIGH | `footer.tsx:21-24` | hardcoded "operational" badge | [ ] |
| G-13 | G | LOW | `footer.tsx:196` | fake version string | [ ] |
| G-14 | G | LOW | `footer.tsx:30,44,64,78` | dead social links | [ ] |
| G-15 | G | HIGH | `cookie-policy/page.tsx:221-234` | fabricated GA/Meta Pixel claim | [?] |
| G-16 | G | LOW | 4 legal pages | empty `<h2>` broken markup | [ ] |
| G-17 | G | LOW | `page.tsx:11-13` | 3 dead imports | [ ] |
| G-18 | G | MED | `help/page.tsx` vs `contact/page.tsx` | contradictory response-time claims | [ ] |
| G-19 | G | HIGH | `system/exchange-rate/route.ts:14-15,60-64,111` | fallback always stamped source:"live" | [ ] |
| G-20 | G | MED | `system/exchange-rate/route.ts:29-31` | malformed JSON silent fallback | [ ] |
| G-21 | G | MED | `page.tsx:130-136` | homepage liveRate no error handling | [ ] |
| G-22 | G | LOW | `early-access/page.tsx:31` | masks infra failure | [ ] |
| G-23 | G | LOW | two `system-status.ts` files | ambiguous which resolves | [ ] |
| H-1 | H | BLOCKER | `trade/route.ts:60-62` | missing currency/rate, both sides | [ ] |
| H-2 | H | HIGH | `order/otp/resend/route.ts:28-31` | field casing mismatch | [ ] |
| H-3 | H | HIGH | `order/otp/validate/route.ts:28-31` | field casing mismatch, 2 fields | [ ] |
| H-4 | H | HIGH | `order/route.ts:29` | wrong endpoint path entirely | [ ] |
| H-5 | H | HIGH | `order/[id]/cancel/route.ts:14` | no backend cancel endpoint exists | [ ] |
| H-6 | H | HIGH | `order/route.ts:31-38,45-51`, `transaction/user/route.ts:27-34,70-76` | errors silently returned as empty success | [ ] |
| H-7 | H | MED | `auth-firebase/register/route.ts:68-70` | username charset mismatch | [ ] |
| H-8 | H | HIGH | `auth-firebase/login/route.ts:1-92` | never calls real Spring login | [ ] |
| H-9 | H | HIGH | `auth-firebase/register/route.ts:67-78` | profile creation fire-and-forget | [ ] |
| H-10 | H | MED | `user/profile/update/route.ts:52-91,103` | email not forwarded but echoed as saved | [ ] |
| H-11 | H | MED | `kyc/upload/route.ts:216-227` | unguarded error parse masks real status | [ ] |
| H-12 | H | BLOCKER | `packages/ui/src/lib/api/auth/index.ts:48-55,119-135` | change-password/email hit nonexistent routes | [ ] |
| H-13 | H | LOW | `identity-verification/verify/[type]/page.tsx:94-99` | dead 202 handling branch | [ ] |
| H-14 | H | BLOCKER | 12 kyc/user/notification routes | Django reachability unconfirmed | [?] |

**Total tracked: 111 findings across 8 modules + 3 structural decisions.**
