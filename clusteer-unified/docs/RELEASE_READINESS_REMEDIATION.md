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

## Design Source Reconciliation (2026-07-03)

The original audit was code-only — it never checked findings against the actual intended design. `Clusteer.zip` (repo root) contains the design reference. **Per explicit project-owner ruling: `Clusteer.zip` — specifically the interactive prototype `Clusteer Dashboards.html` / `dashboards/*.jsx` + `HANDOFF.md` — is the latest, accepted design. `DESIGN_CHANGE_PLAN_v2.md` (an older document in the same zip, describing work already executed against the now-superseded `clusteer-frontend/` scaffold) is discarded and carries no authority.** Every correction below follows from that ruling, not from weighing the two documents against each other. Reconciled every frontend-relevant module in this doc against the accepted design, comparing it directly to the live, deployed `apps/customer`. Net effect: most findings hold up, three needed correction, and one real audit-coverage gap got closed.

**Confirmed aligned (no change, higher confidence now):**

- Module B1's decision (back up + delete the orphaned wallet/send/receive feature) is directly confirmed by the accepted design — `HANDOFF.md`: *"There are no Wallet, Send, Receive, Withdraw, or Swap screens... if you see those anywhere, they're stale — do not build them."*
- The channel picker correctly has no Solana option (`grep` confirmed) — the accepted design restricts to BEP20/ERC20/TRC20 only.
- `/support/[ticketNumber]`, `/support/help/[topic]`, and the Notifications center all already exist matching the design's inventory — no discrepancy.
- The live Overview page (`dashboard/page.tsx:194-227`) already has the exact Markets section the design calls for — a filterable All/Watchlist/Gainers/Losers table — matching `HANDOFF.md`'s Overview description verbatim. Confirmed by reading the code, not assumed.

**Corrected, decisively — the older document's conflicting claim is discarded, not weighed:**

- **Settings/Security routing: `/settings/page.tsx` (one page, 7 inline tabs, modals for deeper security actions) is canonical, full stop.** This is exactly what `dashboards/client-misc.jsx`'s `Settings` component (lines 321-370) builds — no separate `/settings/limits`, `/security`, or `/settings/security/*` routes. `DESIGN_CHANGE_PLAN_v2.md`'s description of those as executed separate routes is against the discarded scaffold and does not apply. Module E's task list below is updated to a firm decision, not an open question.

**Corrected — the original Module E finding had the right instinct but the wrong mechanism:**

- **`markets/page.tsx` should not get a sidebar entry — the accepted design's sidebar doesn't have one.** `dashboards/client-shell.jsx`'s `CLIENT_NAV` (the actual sidebar array, 11 items: Overview/Trade/Request/Orders/History/Billing/Identity/Notifications/Referrals/Settings/Support) has no Markets item at all — `HANDOFF.md`'s prose customer-surface list mentioning "Markets" refers to the embedded Overview section confirmed above, not a separate nav destination. The standalone `/markets/page.tsx` (319 lines, its own search/filter/live query) isn't redundant — it's a legitimate deeper "see all" view — but the fix is a **"View all markets" link from the Overview's Markets table**, not a sidebar item. Module E's task below is corrected accordingly.

**New finding — the design's actual sidebar contradicts a choice in the live code, worth a business-side confirm before touching:**

- **`Request`/Payment-Request is sidebar position #3 in the accepted design** (`client-shell.jsx`: `{ id:'request', label:'Request', icon: I.qr }`, right after Trade) **but is commented out in the live `sidebar.tsx`** with the note "hidden — requires own crypto license (post-Quidax)." The design treats Payment Request as a fully real, non-speculative feature (unlike Referrals). This may be a legitimate, still-current business/regulatory constraint, or it may be a stale reason from before the Quidax integration — I can't tell which from the code alone. Flagging for a business-side confirm rather than assuming either way; do not un-hide it without that confirmation, since the request feature itself is also still fake per Module C (`request/page.tsx:15-17,80-85,123`).

**New finding, changes the fix direction — moved to Module G below:**

- **Referrals should not be "fixed" to real data at all.** `HANDOFF.md`: *"Referrals (Phase 4, tagged 'Soon')"* — a forward-design, speculative surface, not something to wire to a real API. The hardcoded referral stats (`referrals/page.tsx:36-37,44-53,88-95` — "24 referred," "₦48,000 earned," `MOCK_REFERRALS` fallback) were flagged in the original audit conversation as a wiring bug to eventually build real, but **never actually made it into this doc's checklist** — a separate gap, now closed below with the corrected framing.

**Audit coverage gap, closed — good news, not a defect:** `apps/customer/src/components/trade/buy-handoff.tsx` and `sell-handoff.tsx` were never mentioned anywhere in Module C, despite being core to the trade wizard. Read both in full: they're well-built and match the accepted design's required Quidax hand-off screens exactly — bank details with copy-to-clipboard + reference code for buy, QR + address + chain warning for sell, both with a live expiry countdown — and are correctly wired into `trade-wizard.tsx`'s step machine (`form → review → otp → handoff → confirming → done/failed`, matching the design's `create → otp → awaiting_payment/deposit → confirming → completed/paid_out | expired/failed` exactly). **No separate fix needed** — once Module C's order-creation is wired to a real `/api/trade` call, these screens will render real Quidax data for free, since they already correctly read `order.paymentDetails`/`order.depositDetails`.

---

## Module A — Auth Token Plumbing

**Goal:** every authenticated client-side query in the app successfully identifies the logged-in user and attaches a valid `Authorization` header, so downstream pages actually fetch real data instead of silently falling back to placeholders.

**Risk tier:** SAFE-TO-FIX — this is a pure bug fix with an unambiguous correct behavior (read the session via a mechanism that can actually see an `httpOnly` cookie).

**Root cause:** `auth_token` is set with `httpOnly: true` on every login/verify route (by design, for XSS protection), but several client-side hooks/libs try to read it via `document.cookie`, which cannot see `httpOnly` cookies. They always get `null`/`undefined`.

**The fix shape:** either (a) expose the minimum needed (e.g., just the user ID, not the token) via a **non-httpOnly** companion cookie or a small `/api/me` server route the client can call once and cache, or (b) route all these reads through a Next.js server component/route that *can* read the httpOnly cookie server-side. Do not simply drop `httpOnly` from `auth_token` — that reintroduces the XSS risk it exists to prevent.

### Tasks

- [x] `apps/customer/src/hooks/use-user-id.ts:12` — **fixed (2026-07-03, `272099f`).** `useUserId()` now fetches `/api/user/profile` (react-query, `staleTime: 5m`), which decodes `auth_token` server-side, instead of reading `document.cookie`. Moved to `packages/ui/src/hooks/use-user-id.ts` during the audit-fix pass (`ebb3f8c`) so components in `packages/ui` can import it directly.
- [x] `packages/ui/src/lib/axios.ts:14-17` — **fixed (2026-07-03, `272099f`).** Removed the broken/redundant Bearer-token interceptor (unreadable httpOnly cookie; also redundant since `apiClient`'s `baseURL` is same-origin `/api`, so the cookie is already forwarded automatically). Bonus fix found while here: the 401 handler's `document.cookie = "auth_token=..."` clear was a silent no-op against an httpOnly cookie — replaced with a real `fetch("/api/auth-firebase/logout")` call.
- [x] `packages/ui/src/lib/api/settings/index.ts:13-21` — **fixed (2026-07-03, `272099f` + `ebb3f8c`).** Removed the API key + broken auth logic from `blockchainApiClient`. `getKYCVerification` and (added during audit) `getPrivacySettings`/`updatePrivacySettings` now go through Next.js proxy routes. The other 8 functions in this file are confirmed zero-caller scaffolding (see Module F).
- [x] `packages/ui/src/lib/api/support/index.ts:11-19` — **fixed (2026-07-03, `272099f`).** Same pattern; `getTicketDetail`/`addTicketMessage` now go through proxy routes. `getSupportTickets`/`createSupportTicket`/`getFAQs` confirmed zero-caller scaffolding.

### Downstream verification (should resolve automatically once the above land — re-check each, don't assume)

- [?] `apps/customer/src/app/(dashboard)/settings/account/page.tsx:28-39,72-100` — **moot.** This page (and `settings/notifications`, `settings/privacy`, `settings/payment-methods`) was deleted during the Module E settings-routing decision (`/settings/page.tsx`'s 7 inline tabs are canonical) — see Module E. Re-flagged there as "confirm the 7 tabs are wired to real data," not here.
- [-] `apps/customer/src/app/(dashboard)/settings/notifications/page.tsx:111,114-118` — moot, same reason.
- [-] `apps/customer/src/app/(dashboard)/settings/privacy/page.tsx:74,76-80` — moot, same reason.
- [-] `apps/customer/src/app/(dashboard)/settings/payment-methods/page.tsx:35,38-45` — moot, same reason.
- [x] `apps/customer/src/app/(dashboard)/identity-verification/page.tsx:67,95-99` — **verified (2026-07-03, audit pass).** Independently re-read the full page and `sidebar.tsx`: both read plain fields (`status`, `document_number`, `document_type`, `selfie_url`, `address_document_url`, `rejection_reason`) directly off the object `getKYCVerification` returns, which matches the `KYCVerification` shape exactly — no axios-wrapper mismatch. Query now genuinely fires once `useUserId()` resolves a real ID.

### Audit (2026-07-03) — 2 real findings, both fixed, see `ebb3f8c`

Ran an independent adversarial audit of `272099f` (agent had no knowledge of the implementation, told to verify every claim from scratch). It found one real regression; I found a second while independently re-verifying the audit's own findings before trusting them:

1. **`getPrivacySettings`/`updatePrivacySettings` were not actually zero-caller** — `packages/ui/src/components/app/cookie-consent.tsx`, mounted globally in `apps/customer/src/app/layout.tsx`, calls both directly. The "zero live callers" check in the original commit only grepped `apps/customer/src`/`apps/admin/src`, missing this caller living under `packages/ui/src/components/`. Investigated further: this path wasn't actually reachable pre-fix either, for an unrelated reason — `cookie-consent.tsx` read identity from the client-side Firebase SDK's `onAuthStateChanged`/`auth.currentUser`, which is never populated anywhere in this app (both login and signup happen via Firebase Admin SDK calls inside Next.js server routes, never a client-side sign-in call — grepped `signInWith*`/`onAuthStateChanged` across the whole app to confirm). Fixed properly rather than left inert: added `apps/customer/src/app/api/user/privacy-settings/route.ts` (GET+PUT proxy, same pattern as `kyc-status`), converted both functions to call it, and moved `cookie-consent.tsx` onto the working `useUserId()` hook.
2. **`support/[ticketNumber]/page.tsx`** (a live caller of `getTicketDetail`/`addTicketMessage`, also touched by this module) read `user.id` from `useUser()` — an in-memory Zustand store (`apps/customer/src/store/user.ts`) populated only by `login-form.tsx`, which itself has zero importers (the real login flow is `auth-firebase/*` per Module B2's decision). So `user` was always `null` and the ticket-detail query never fired, for any user, ever — not a regression from this commit, but a real bug directly in the call path being audited. Fixed by adding a `useUserProfile()` export alongside `useUserId()` (same underlying `/api/user/profile` fetch) and switching the page to it.

**New backlog item, not fixed (out of scope for this pass):** `apps/customer/src/store/user.ts`'s Zustand `useUser()` store has no persistence/rehydration and is populated by dead code — `apps/customer/src/components/user-profile.tsx` and `user-banner.tsx` both read it but are themselves unimported/orphaned (confirmed via grep), so this is currently inert, not a live bug. `nin-verification-form.tsx`/`bvn-verification-form.tsx` also read it (to merge `is_verified: true` onto whatever's there) — worth a closer look if those forms are still on a live path, but that's a KYC-flow question, not an auth-plumbing one; not investigated further here.

### Acceptance criteria

- A logged-in user reloading any of the 5 pages above sees data that changes when the underlying backend record changes (prove it by mutating one field via the backend directly and confirming the UI reflects it after refresh). **Applies to `identity-verification/page.tsx` and `sidebar.tsx` now (settings pages moot, see above) — verified via code read, not yet click-tested end-to-end against a live Django instance.**
- No client-side code anywhere reads `document.cookie` for `auth_token` (grep should return zero matches post-fix). **Confirmed (2026-07-03)** — only remaining `document.cookie` hits are an unrelated sidebar-open-state cookie and comments.

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

**Decision: RESOLVED (2026-07-03) — Spring Boot (`Clusteer-Api`) is authoritative for orders.** Verified by reading both backends' actual code, then independently re-checked adversarially (a second pass deliberately trying to refute the first). The adversarial pass confirmed the bottom-line decision but corrected two overstated claims in the first draft — recorded here accurately rather than leaving the flattering version:

- **Django's Order model holds zero real data today — but it is NOT abandoned/dead code, it's an unfinished, migration-ready feature.** `p2p/order_models.py`, `p2p/views/order_views.py`, and the `/orders/` routes in `p2p/urls.py` are all **uncommitted** (`git status` shows `??`/`M`, `git log --all` shows zero history for the model/views files) and the live dev database has no `orders` table (only 6 migrations are actually committed — a 7th, `0006_kycauditlog...`, is *also* uncommitted, and none of the 7 create an orders table). **Correction from the first pass:** running `python manage.py makemigrations --check --dry-run p2p` shows Django's autodetector genuinely *does* see `Order`/`OrderStatusHistory` (registered via the URL-import chain) — this is a fully-formed feature one `makemigrations && migrate` away from being live, not invisible/dead code as originally claimed. Combined with the routes also being uncommitted, this looks like someone's in-progress work, not scaffolding to discard — **do not delete or repurpose without checking with whoever wrote it.**
- **Django's wallet system is custodial by design, and — unlike the Order model — it IS already committed to git.** `p2p/models.py:41-49,103-118` (`UserBlockchain`, `BscVaultWallet`, `EthVaultWallet`, `SolVaultWallet`, `TronsVaultWallet`) store `private_key` fields, Fernet-encrypted before storage by `p2p/views/wallets.py:191-238`'s `create_solana_wallet`/`create_tron_wallet`/etc. **Correction from the first pass:** the claim "Django's implementation never held real data" was overstated — that's true for *orders* specifically, but the custodial wallet/key system is committed, deployed code that may well hold real keys/balances. This is the exact system already parked pending VASP licensing per the project's earlier non-custodial compliance audit, and it's a reason to be careful with that codebase generally, not evidence that Django is empty.
- **Spring already has a real, deployed Order implementation.** `P2POrderServiceImpl` uses a genuine `OrderRepository` (`orderRepo.save(newOrder)`) and is already wired directly to `QuidaxService` (`initiatePurchase`/`confirmPurchase`/`initiateSale`). Nothing needs to be built from scratch — the fix is purely re-pointing the customer app's routes. This part of the original conclusion held up fully under adversarial re-check.
- **Runtime detail, for completeness:** if Django's `/orders/` endpoint were hit today against a real instance, `OrderListView.get()` has no try/except and would surface an unhandled 500 (`relation "orders" does not exist`); `OrderListView.post()` and `OrderDetailView` do wrap the DB call, so those paths would mask the same failure as a 400/404 instead.

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

**Confirmed aligned, no fix needed (2026-07-03, see Design Source Reconciliation above):** `apps/customer/src/components/trade/buy-handoff.tsx` and `sell-handoff.tsx` — these were never mentioned in the original audit but were checked against the accepted design during reconciliation. Both are well-built and match the required Quidax hand-off screens exactly (bank details/reference for buy, QR/address/chain-warning for sell, live expiry countdown), and are correctly wired into `trade-wizard.tsx`'s step machine. They'll render real data automatically once the fixes above land — nothing to do here specifically.

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

### Decision — RESOLVED (2026-07-03): drop the second factor entirely

- [x] **2FA endpoints don't exist on the Django backend** — decided (b): remove the 2FA UI/toggle rather than build it. Signup's email-link verification (`verify-email/page.tsx` + `resend-verification`, already real and working) is the only gate for now.
- **Investigation before executing turned up something the original finding didn't know:** `verify-otp/page.tsx`, despite its name, was entirely a login-time TOTP/authenticator-app second factor (its own copy said "Open your authenticator app") — not an OTP-code flow. And it was already **100% unreachable in production**, not just partially broken: `login/route.ts`'s `/user/{userId}/2fa/status/` check silently defaults to `false` (endpoint doesn't exist on Django), so `requiresTwoFactor` was never `true` and nothing ever redirected there — not even the "flow !== login" signup-code branch, since real signup redirects to `/verify-email`, never to `/verify-otp` at all. So this whole module was dead code, not a partially-working feature.
- [x] **Executed (2026-07-03, `7d2ac86`).** Deleted: `verify-otp/page.tsx` (both branches, zero live entry points), `verify-2fa/route.ts`, the Settings → Security "Two-factor authentication" card + its `twoFa` FlowHost flow (`components/flows/two-fa.tsx`), `api/user/2fa/request` + `api/user/[username]/2fa/validate` routes, `google-auth-qrcode.tsx`/`google-otp-form.tsx` (already orphaned since the earlier settings-page cleanup deleted their only page), and the now-dead `authRequest2FA`/`verifyGoogleAuthOTP` functions + `Auth2FARequest` type. Removed `login/page.tsx`'s dead `requiresTwoFactor` redirect branch and `login/route.ts`'s 2FA status check. Simplified `useAuth`'s Zustand store (dropped `completeTwoFactor`/`twoFactorPending`; renamed `requireTwoFactor` → `requireVerification`, its only remaining real purpose). Removed `/verify-otp` from `middleware.ts`'s `publicPaths`.
- **Bonus findings while tracing the dependency chain (both confirmed zero-caller, both deleted):** `apps/customer/src/app/api/logout/route.ts` was an exact duplicate of `auth-firebase/logout/route.ts` with zero callers — Module B2's duplicate-route cleanup scope didn't include logout. `packages/ui/src/lib/auth.ts` (a `jose`-based JWT sign/verify module, including `signPendingToken` — the function the deleted 2FA route used to mint `pending_2fa_token`) had zero importers anywhere in the monorepo.

### Tasks (SAFE-TO-FIX) — all done (2026-07-03, `7d2ac86`)

- [x] `apps/customer/src/middleware.ts:15-27` — **fixed.** Removed the unverified-JWT-decode fallback in `verifyAuthToken`. Previously, if `firebase-admin`'s `verifyIdToken` threw for *any* reason — including a forged/invalid signature — the code fell back to manually decoding the payload with **no signature check at all**, accepting any token with a future `exp` and a `user_id`/`sub` field of the attacker's choosing. Now any verification failure fails closed (returns `false` → redirect to `/login`). Also added `checkRevoked: true` so a session revoked via the new invalidate-sessions route (see below) is rejected before its natural expiry.
- [x] `apps/customer/src/app/(auth)/verify-otp/page.tsx:52-55,143-149` — **moot**, see decision above (whole page deleted).
- [x] `apps/customer/src/app/(auth)/verify-2fa/page.tsx:16`, `verify-otp/page.tsx:30` — **moot**, both files deleted.
- [x] `apps/customer/src/app/api/auth-firebase/reset-password/route.ts:26` — **fixed, but not at this line** — that line only sends the reset *email*; the actual password change happens client-side in `reset-password/page.tsx` via Firebase's `confirmPasswordReset`. Added a new `POST /api/auth-firebase/invalidate-sessions` route (`getUserByEmail` + `admin.auth().revokeRefreshTokens`, new `revokeUserSessions` helper in `firebase-admin.ts`) that `reset-password/page.tsx` calls right after a successful reset, so an old session issued before the reset actually stops working.
- [x] `apps/customer/src/app/api/auth-firebase/logout/route.ts:16` — **confirmed sufficient, no code change.** `signOut(auth)` running server-side against the client SDK instance is indeed a no-op, but harmless — `response.cookies.delete("auth_token")` in the same route is what actually ends the session, and that's correct/sufficient for a normal single-session logout (as opposed to "log out everywhere," which is what the new revoke-based reset flow above does instead).
- [x] `apps/customer/src/lib/rate-limiter.ts:9` — **fixed.** A complete Redis-backed implementation (`redis-rate-limiter.ts`) already existed but nothing called it — all 11 live callers of `rateLimit()` used the bare in-memory function directly, so the "shared store" gap wasn't about missing infrastructure, it was about the infrastructure not being wired in. `rateLimit()` is now `async` and delegates to Redis when `USE_REDIS_RATE_LIMITING=true` (unchanged in-memory fallback otherwise). Updated all 11 call sites — 10 in `apps/customer` plus 1 in `apps/admin/src/app/api/auth/login/route.ts` that the original finding's file path (`apps/customer/...`) didn't cover; `tsc` on the admin app caught it. **Still outstanding, not something I can do from here:** actually provisioning an Upstash Redis instance and setting `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`/`USE_REDIS_RATE_LIMITING=true` in the deployment secrets — the code path is ready the moment that's done.
- [x] `apps/customer/src/app/(auth)/login/page.tsx:174,186,201`, `signup/page.tsx:167,175` — **fixed.** Google/Apple/Passkey buttons are now `disabled`, visually muted, and carry a small "Soon" badge (`soonBadgeStyle`, new in `auth-styles.ts`) instead of toasting "Coming soon" while looking fully clickable.

### Tasks gated on the 2FA decision above — moot, all deleted (2026-07-03, `7d2ac86`)

- [x] `apps/customer/src/app/api/auth-firebase/login/route.ts:45` — moot, the whole 2FA status check block was removed.
- [x] `apps/customer/src/app/api/auth-firebase/verify-2fa/route.ts:38` — moot, file deleted.
- [x] `apps/customer/src/components/google-auth-qrcode.tsx:21,57` — moot, file deleted (was already orphaned).
- [x] `apps/customer/src/app/api/user/[username]/2fa/validate/route.ts:58-67` — moot, file deleted.
- [x] `apps/customer/src/app/api/user/2fa/request/route.ts:23-26` — moot, file deleted.

### New backlog item, not fixed (out of scope for this pass)

- **A parallel, likely-fully-dead legacy auth scaffold**: `packages/ui/src/lib/api/auth/index.ts` still exports `loginUser`, `registerUser`, `forgotPassword`, `resetPassword`, `changePassword`, `resendOTP`, `verifyEmail`, `resendEmailVerification`, `changeEmail`, `sendEmailOTP` — most of these are only imported by a parallel set of `react-hook-form`-based components (`components/forms/login-form.tsx`, `signup-form.tsx`, `forgot-password-form.tsx`, `reset-password-form.tsx`, `change-password-form.tsx`, `change-email-form.tsx`) that predate the current inline-styled auth pages. `login-form.tsx` is already confirmed zero-importer (found during this pass). Whether the whole subtree is dead, like the two functions removed above, needs its own pass — didn't expand this module further to stay in scope.

### Acceptance criteria

- A forged/unsigned token is rejected by middleware even when Firebase Admin is simulated as unreachable. **Verified by code inspection (the fallback path is gone, `catch` unconditionally returns `false`) — not yet exercised against a live forged token in a running instance.**
- Signup OTP verification actually fails for a wrong code. **Superseded — signup verification is a real Firebase email link, not a code; there's no "wrong code" case to fail.**
- 2FA either demonstrably works end-to-end or has been removed from the UI — no partial/silent state ships. **Removed from the UI, per the decision above.**

### Audit (2026-07-03) — 1 real content gap found and fixed

Independent adversarial audit of `7d2ac86` (agent had no knowledge of the implementation, verified `verifyIdToken`/`verifyPasswordResetCode` against their actual `.d.ts` signatures rather than trusting the claims, ran `tsc` fresh). **No functional or security regressions found** — the middleware fail-closed fix, the new session-invalidation route, the rate-limiter async rewrite, and every 2FA-removal deletion all checked out. Two things it did catch:

1. **User-facing copy still described 2FA as a live, required feature after the code removed it** — FAQ page (`faq/page.tsx`, 3 answers plus a whole "What is 2FA?" Q&A), the marketing help center (`help/page.tsx`, an entire "Account & Security" article with QR-code setup steps), the in-app support help topic (`support/help/[topic]/page.tsx`'s `security-2fa` entry, plus a "confirm with 2FA" line under withdrawals), the signup page's own step-2 subtitle, the homepage FAQ, and two lower-visibility strings (`lib/data.ts`, `lib/system-status.ts`) all still told users to enable/use/confirm with 2FA via a control that no longer exists. **Fixed**: removed or rewrote every instance — the in-app help topic was renamed `security-2fa` → `account-security` and rewritten around password reset + suspicious-activity guidance instead of TOTP setup (confirmed the old slug had zero external references before renaming, so nothing broke).
2. **Minor doc/commit-message inaccuracy**: the commit message and this doc's D-11 entry claimed "11 call sites" for the rate-limiter fix; there are actually 12 real `rateLimit(` call-site matches (11 apps/customer + 1 apps/admin), plus a 13th match inside the already-orphaned `api-middleware.ts` that needs no fix. Corrected D-11 above.

**Not fixed, confirmed non-issue:** `packages/ui/src/lib/api-middleware.ts:105`'s un-awaited `return rateLimit(...)` — harmless, since returning a promise from inside an `async` function is auto-flattened, and the file has zero callers anyway.

---

## Module E — Navigation / Dead Links

**Goal:** every visible link, button, and nav entry in the app either goes somewhere real or is removed; no orphaned pages sit unreachable without an explicit reason.

**Risk tier:** SAFE-TO-FIX, except the `/assets`/`/send`/`/receive`/`/withdraw` entries which depend on the Module B1 decision.

### Tasks depending on Module B1 — RESOLVED (2026-07-03, done alongside B1/B2)

- [x] `apps/customer/src/components/app/mobile-tab-bar.tsx:9,11` — replaced with sidebar.tsx's real `tab:true` set (dashboard/trade/orders/settings). See ledger E-1.
- [x] `packages/ui/src/components/app/command-palette.tsx:28,30,31,32` — NAV_ITEMS rewritten to mirror sidebar.tsx exactly; broken actions removed. See ledger E-2.
- [x] `apps/customer/src/middleware.ts:89-109` — 8 dead `protectedPaths` entries removed. See ledger E-10.
- [x] `apps/customer/src/components/dashboard-nav.tsx`, `nav-bar-dashboard.tsx` — deleted (confirmed zero importers first). See ledger E-16.
- [x] `apps/customer/src/components/asset-client.tsx:47,53,59` — deleted (confirmed zero importers first). See ledger E-18.
- [x] `apps/customer/src/components/recent-activity.tsx` — deleted (confirmed zero importers first). See ledger E-19.
- [x] `apps/customer/src/components/nav-user.tsx:115,119` — file deleted outright once it became fully orphaned (its only importer, `dashboard-nav.tsx`, was already dead). See ledger E-17.

### Tasks independent of B1

- [x] `apps/customer/src/app/(dashboard)/identity-verification/page.tsx:174-181` — **fixed (2026-07-07, `953a6fd`).** Tier 2's "Upgrade" (fully buildable — BVN/NIN/Selfie already have real upload rows) now scrolls to the Verification documents section via a new `docsRef`. Tier 3's "Upgrade" is now disabled with a "Coming soon" label instead — its "Source of funds" requirement has no upload mechanism anywhere and its status is hardcoded `"Available"` forever (no real per-tier state machine), so wiring it for real isn't possible without new upload infrastructure (KYC Upgrade Expansion, not started).
- [x] `apps/customer/src/components/flow-host.tsx` (via `settings/page.tsx:243`) — **fixed (2026-07-07, `953a6fd` + audit follow-up).** Checked the backend before assuming: `Clusteer-Api` has a fully real, already-built `ApiKeyController` (create/list/revoke, max 5 active keys, read/trade permission scoping) that had simply never been wired to the frontend. Built new proxy routes (`api/user/api-keys`, `api/user/api-keys/[id]`), a `CreateApiKeyFlow` modal, and wired `settings/page.tsx`'s API keys tab to the real list/revoke instead of an unconditional empty state. **Two real bugs found by the audit + my own follow-up investigation, both material — see the Audit section below; the feature is code-correct but not yet functional end-to-end.**
- [x] `apps/customer/src/components/mobile-menu.tsx:89,98,107` — **resolved (2026-07-07, `953a6fd`) — not by fixing the anchors.** Investigating first (rather than just patching the 3 hrefs) found this component and its only importer, `nav-bar.tsx`, are both entirely unreachable — the actual live marketing nav is `site-header.tsx`, which already correctly links "How it works" to `/#how` and has its own working mobile menu. Deleted both dead files instead of patching code nothing renders.
- [x] `apps/customer/src/app/(auth)/verify-2fa/page.tsx` — **decided and executed (2026-07-03).** Both pages called the identical backend endpoint (`/api/auth-firebase/verify-2fa`); `verify-otp`'s `flow=login` branch had the more complete UI (boxed digit auto-advance/paste, live resend countdown, SMS fallback) and is already the one login redirects to. Deleted `verify-2fa/page.tsx`; removed the now-dead `/verify-2fa` entry from `middleware.ts`'s `publicPaths`. **Superseded (2026-07-03, `7d2ac86`, Module D): 2FA was later removed from the product entirely, so `verify-otp/page.tsx` itself was deleted too** — see Module D's decision section for why (both its branches turned out to be dead code, not just this one).
- [x] `apps/customer/src/middleware.ts:70-109` — resolved during B1/B2 work. On direct re-check of the live file, `/markets` and `/request` were **already** in `protectedPaths` (the original finding was inaccurate on this point) — only `/referrals` was genuinely missing (added) and `/verify-2fa` was missing from `publicPaths` (added, mirroring `/verify-otp`'s pending-token pattern). See ledger E-10/E-11.
- [x] `apps/customer/src/middleware.ts:70-83` — removed dead `/change-password`, `/auth/callback` entries. See ledger E-11.
- [x] **Decision resolved (2026-07-03) — see Design Source Reconciliation above.** `/settings/page.tsx` (inline tabs) is canonical, per the accepted design's `dashboards/client-misc.jsx` `Settings` component. Remaining work is mechanical, not a decision:
  - [x] **Executed (2026-07-03).** Deleted `settings/account`, `settings/limits`, `settings/notifications`, `settings/payment-methods`, `settings/privacy`, `settings/profile`, `settings/security` (+ its 3 sub-pages `google-auth`/`change-email`/`change-password`). Found and fixed 2 dangling references before committing: `topbar.tsx`'s profile-menu link and `notification-detail.tsx`'s security-notification link both repointed from the deleted routes to `/settings`.
  - [ ] Confirm `/settings/page.tsx`'s 7 tabs are wired to real data once Module A lands (it's also currently mocked — separate Module C-adjacent finding, not a routing question).
- [x] `apps/customer/src/app/(dashboard)/identity-verification/verify/page.tsx` — **confirmed and executed (2026-07-07, `953a6fd`).** Genuinely orphaned — the live main page's upload buttons open a native file picker directly, and nothing links here. Deleted the whole subtree (`page.tsx`, `layout.tsx`, `[type]/page.tsx`) plus its two dead-end dependencies: `components/identity-verification.tsx` (only importer was the deleted page) and `components/forms/identity-verification-form.tsx` (already zero-importer). **Moots Module H's `identity-verification/verify/[type]/page.tsx:94-99` finding below (dead 202-handling branch) — the file no longer exists.**
- [x] `apps/customer/src/app/(dashboard)/markets/page.tsx` — **corrected and executed (2026-07-03).** No sidebar entry added — the accepted design's sidebar has no Markets item. Added a "View all markets →" link to the Overview page's existing Markets table header (`dashboard/page.tsx:194-227`) instead, pointing to `/markets`.
- [x] `apps/customer/src/app/(dashboard)/request/page.tsx` — re-checked: already in `protectedPaths` (confirmed above), so it is **not** actually unauthenticated-reachable — the original finding was inaccurate on this point too. **Revisit its sidebar omission** (see Design Source Reconciliation above — the accepted design puts Request at sidebar position #3; flagged for a business-side confirm on whether "requires own crypto license" still applies, not resolved here).
- [x] `apps/customer/src/app/(marketing)/about/page.tsx:206-210` — **fixed (2026-07-07, `953a6fd`).** Now points at `/careers` (confirmed real, 106 lines of content) instead of `/contact`.
- [x] `apps/customer/src/app/page.tsx:459` vs `apps/customer/src/middleware.ts:105` — **fixed (2026-07-07, `953a6fd`).** Now points at `/contact` (confirmed real, 198 lines, not in `protectedPaths`) instead of `/support`.

### Audit (2026-07-07) — 1 confirmed bug fixed, 1 pre-existing architectural gap surfaced (not fixed, needs a decision)

Independent adversarial audit of `953a6fd` (agent had no knowledge of the implementation, traced the actual Java DTOs rather than trusting the TypeScript shapes). Items 1, 3, 4, 5 (Upgrade button, nav-bar/mobile-menu deletion, identity-verification/verify deletion, the two href fixes) all passed clean — confirmed correct from first principles, not just re-reading the diff.

1. **Confirmed bug, fixed**: Spring's `HttpResponse` (`Clusteer-Api/.../models/responses/HttpResponse.java:22`) wraps its payload as `responseData`, not `data`. Both new proxy routes did `data.data ?? data` — since `data.data` is always `undefined`, the `??` fallback silently forwarded Spring's *entire* wrapper object as the payload. Concretely: `settings/page.tsx`'s API-keys list always rendered empty (`apiKeys` was the wrapper object, not an array, so `.length` was always falsy) regardless of how many keys existed, and `create-api-key.tsx`'s raw-key reveal screen never triggered (`data.key` was `undefined`; the real value was nested at `data.responseData.key`) — the key WAS created server-side, but the user saw no confirmation and no error. Fixed both routes to read `data.responseData ?? data`; also added try/catch around the Spring calls (see finding 2 below for why that's now load-bearing, not just tidiness).

2. **Deeper pre-existing gap, found via my own follow-up, not fixed**: tracing *why* this would fail differently than expected, I read `Clusteer-Api`'s actual security wiring (`middlewares/JwtAuthenticationFilter.java`, `middlewares/JwtService.java`, `configs/AppConfig.java`). `/v1/user/api-keys` is not in `AppConfig`'s `permitAll()` list, so it goes through `JwtAuthenticationFilter`, which calls `JwtService.extractAllClaims()` — this requires the token to be an HS256 JWT signed with Spring's own `JWT_SECRET_KEY` and carrying a `role` claim resolvable via Spring's own `UserModelDetailsService`. The customer app's `auth_token` is a **Firebase ID token** (RS256, Google-signed, verified via `firebase-admin` in `middleware.ts` — a completely different system). There is no token-exchange bridge anywhere in the codebase (grepped for one — none exists). Passing the Firebase token as `Authorization: Bearer` to any `hasAuthority('CUSTOMER')`-guarded Spring endpoint will throw an uncaught `SignatureException` inside the filter, not a clean 401. **This is not new** — `trade/route.ts`, `order/otp/validate/route.ts`, and `order/otp/resend/route.ts` already call `springFetch(path, opts, auth.token)` the identical way and would fail identically; it's simply never been exercised because Module C's trade wizard is client-side-fake and never actually calls those routes. My new API-keys feature is the first *reachable* UI path that would hit this. **This is the same root cause as the existing Module H finding below** ("login never calls Spring, backend never learns of a login event") — that finding described one symptom; this is the actual mechanism, and it's broader: it blocks *any* authenticated customer-facing Spring call, not just login-sync. Added the try/catch in both proxy routes so hitting this today shows a clean "Failed to create/load/revoke API key" message instead of a cryptic JSON-parse error, but the feature cannot work end-to-end until the auth-bridge decision (referenced in Module H and the earlier onboarding-migration audit) is actually made and built. Not attempting that here — it's an architecture decision affecting every Spring-calling route, not a Module E fix.

### Acceptance criteria

- A full crawl of every `Link`/`router.push`/`onClick` in the app resolves to either a real route or is intentionally removed.
- No page exists that cannot be reached from the live nav/shell, unless explicitly documented here as "intentionally hidden" with a reason.

---

## Module F — Exposed API Keys

**Goal:** no backend API key is present in the browser-shipped bundle, matching the fix already applied to the Spring Boot `X-API-KEY` earlier in this project.

**Risk tier:** SAFE-TO-FIX — direct repeat of a pattern already fixed once (`fix(security): stop shipping the Spring X-API-KEY to the browser`, commit `4e23186`).

### Tasks

- [x] `packages/ui/src/lib/api/settings/index.ts:5-32` — **fixed (2026-07-03, `272099f` + audit follow-up `ebb3f8c`).** `blockchainApiClient` no longer sends `NEXT_PUBLIC_BLOCKCHAIN_ENGINE_API_KEY`. `getKYCVerification` and `getPrivacySettings`/`updatePrivacySettings` (the 3 functions with real callers — the audit found `getPrivacySettings`/`updatePrivacySettings` were missed as "zero-caller" the first time, see Module A's Audit section) now go through Next.js proxy routes (`/api/user/kyc-status`, `/api/user/privacy-settings`). `getNotificationPreferences`, `updateNotificationPreferences`, `getAccountLimits`, `submitKYCVerification`, `getDataExportRequests`, `createDataExportRequest` remain on the now-key-less `blockchainApiClient` — confirmed zero callers anywhere in `apps/customer`, `apps/admin`, or `packages/ui`.
- [x] `packages/ui/src/lib/api/support/index.ts:3-9` — **fixed (2026-07-03, `272099f`).** `getTicketDetail`/`addTicketMessage` (the 2 functions with real callers, `support/[ticketNumber]/page.tsx`) now go through proxy routes (`/api/support/tickets/[ticketNumber]`, `/api/support/tickets/[ticketNumber]/messages`). `getSupportTickets`/`createSupportTicket`/`getFAQs` remain on the key-less client — confirmed zero callers.
- [x] After both fixes: **confirmed (2026-07-03).** `grep -rn "NEXT_PUBLIC_BLOCKCHAIN_ENGINE_API_KEY"` returns exactly one hit, `packages/ui/src/lib/api-helpers.ts:7` (server-only — used only inside `app/api/*/route.ts` handlers, verified via grep that no `"use client"` file imports it). `apps/customer/apphosting.yaml`'s entry flipped from `[BUILD, RUNTIME]` to `[RUNTIME]`, same as the Spring key; confirmed no build/SSG-time read exists that this would break.

### Acceptance criteria

- The Blockchain Engine API key does not appear anywhere in the built client JS bundle (grep the `.next/static` output after a fresh build) — **not yet re-verified against an actual production build output; the code-level check (no client-side reference) is done, but the acceptance criterion as written calls for a built-bundle grep, which hasn't been run.**

---

## Module G — Marketing & Legal Honesty Pass

**Goal:** every claim on a public marketing page is either real, clearly labeled illustrative, or removed — consistent with the "zero users yet, no fabricated stats" standard already applied elsewhere in the app. Legal pages contain no unresolved placeholder text.

**Risk tier:** mostly SAFE-TO-FIX (content/copy changes); the legal placeholders and the analytics-cookie claim are NEEDS-DECISION.

### Decisions needed

- [?] **Legal placeholders** (`terms-of-service/page.tsx`) — the liability cap (`₦____`) and the dispute-resolution clause note ("Choose one and confirm with counsel") are not something engineering should fill in unilaterally. Route to counsel/the project owner for the actual values, then replace.
- [?] **Analytics cookies** (`cookie-policy/page.tsx:221-234`) — the page claims `_ga`/`_gid` (Google Analytics) and `_fbp` (Meta Pixel) are used, but no such scripts exist anywhere in the codebase. Decide: implement the tracking for real (consent-gated, per the existing `ConsentScripts` scaffolding), or remove the claim from the cookie policy. Do not leave a legal document asserting data collection that isn't happening (or, worse, ship the claim and then quietly add tracking later without updating consent flows).

### Tasks (SAFE-TO-FIX) — RESOLVED (2026-07-03), rate badges upgraded to genuinely live (2026-07-03, follow-up)

- [x] `apps/customer/src/app/(marketing)/buy/page.tsx:94-101` — **superseded.** First pass removed the "LIVE" badge and labeled the rate "illustrative." Follow-up: actually wired it to real data instead of just disclaiming it. Kept `buy/page.tsx`/`sell/page.tsx` as Server Components (SEO) and added 3 small Client Component "islands" that fetch `/api/system/exchange-rate` via a shared `useMarketingRate(type)` hook (`apps/customer/src/hooks/use-marketing-rate.ts`, reusing the homepage's `isLive`/`source !== "fallback"` pattern): `<RateBadge>` (dot + "LIVE"/"SAMPLE"), `<RateValue>` (the ₦ number + caption, falls back to the old static number only while loading/on error), and `<BuyReceiveAmount>`/`<SellReceiveAmount>` (`components/marketing/order-ticket-receive.tsx`) which compute the order-ticket "You receive" line from the real rate instead of a hardcoded value. Confirmed `ReactQueryClientProvider` wraps the whole app at the root layout before relying on `useQuery` inside these islands.
- [x] `apps/customer/src/app/(marketing)/buy/page.tsx:136,159` — labeled "Order ticket — example" (kept — the ₦500,000 input amount is still fixed/non-editable, only the rate math is now live); "Settles instantly" + live-dot softened to "Settles on-chain" (unrelated to rate liveness, a separate settlement-speed claim, left as fixed copy).
- [x] `apps/customer/src/app/(marketing)/sell/page.tsx:80-121` — labeled "Sell ticket — example"; "You receive" now computed live via `<SellReceiveAmount />`. The fabricated "5 min" stat replaced with "100% / Non-custodial — your funds are always yours" (a real, already-established claim reused from `auth-accent-panel.tsx`'s own honest stats) — this one has no live data source to connect to (no historical settlement-time data exists pre-launch), so it stays a static honest claim rather than a live one.
- [x] `apps/customer/src/app/(marketing)/sell/page.tsx:144-171` — replaced named banks + masked account numbers ("GTBank •• 4321", "Access •• 8830") with a generic "Your bank account / any NIBSS-connected bank" entry labeled "Example", removing the implication these are real linked accounts.
- [x] `apps/customer/src/app/(marketing)/press/page.tsx:211-212` — replaced the "2023 / year founded" stat with "100% / non-custodial, by design" — real, verifiable, and consistent with the about page's deliberate choice not to state a founding year.
- [x] `apps/customer/src/app/(marketing)/live-markets/page.tsx` — no change needed. It already carries a "Coming soon" badge; the inconsistency was entirely on the buy/sell side (now fixed), so this page's existing honest framing is sufficient.
- [x] `apps/customer/src/app/(marketing)/payments/page.tsx:1508-1514` — reviewed: this card is already headed "Request preview" (line 67), which is reasonably honest framing for a mockup. Left as-is rather than adding redundant disclaimers.
- [x] `apps/customer/src/app/(marketing)/rate-alerts/page.tsx` — reviewed: already carries "(illustrative)" in a code comment and a visible "Illustrative rate — live pricing shows in the app" disclaimer; the builder's CTA already says "Join the waitlist" (not "Save"/"Create alert"), so it doesn't claim to persist anything. No change needed.
- [x] `packages/ui/src/components/app/footer.tsx:21-24` — Footer converted to a client component (`"use client"` + `useEffect`/`fetch("/api/status")`) since it's rendered from both server (`(marketing)/layout.tsx`) and client (`app/page.tsx`) contexts, so it couldn't be made an async Server Component. Badge is now conditional on the real `overall` status and hidden entirely until the fetch resolves — no more asserting "operational" before we know. Visual styling/colors left untouched (design changes go through the Design Elevation Plan, not this pass).
- [x] `packages/ui/src/components/app/footer.tsx:196` — removed the fake "v3.2.1 · build 4f8a92" version string entirely rather than fabricate a replacement.
- [x] `packages/ui/src/components/app/footer.tsx:30,44,64,78` — removed the 3 dead Instagram/Facebook/LinkedIn icons (no real accounts exist); fixed the X icon's `href="#"` to the real `https://x.com/clusteer` already used on `contact/page.tsx`.
- [x] 4 legal pages' empty `<h2></h2>` — filled with "Ready to get started?" on all four (`cookie-policy`, `privacy-policy`, `aml-cft`, `terms-of-service`).
- [x] `apps/customer/src/app/page.tsx:11-13` — removed the 3 dead imports (`Num`, `RateTicker`, `PixelRain`); confirmed zero render sites via grep before removing.
- [x] `help/page.tsx:136` vs `contact/page.tsx:128-133` — aligned on contact.tsx's more conservative framing: "we aim to respond within 4 hours during business hours (Monday–Friday, 9am–5pm WAT)", replacing help.tsx's conflicting "typically respond within 2 hours... (9am-9pm WAT)".
- [x] `contact/page.tsx` — reviewed: copy ("reach out through any of the channels below") doesn't actually claim an in-app form exists; the mailto mechanism matches the copy already. No change needed.
- [x] `careers/page.tsx` — reviewed: page repeatedly and clearly states "No open positions right now" / "we don't have any roles open at the moment" before the mailto link — nothing dishonest about the mailto-only mechanism here. No change needed.
- [x] `apps/customer/src/app/api/system/exchange-rate/route.ts` — added real `source: "live" | "fallback"` tracking through `fetchLiveRates()` (thrown error if the forex API returns no usable NGN rate, instead of silently defaulting to 1420 inside the "success" path) and propagated it into the GET response instead of hardcoding `source: "live"`.
- [x] `apps/customer/src/app/page.tsx:130-136` — added `isError` from the query plus an `isLive` derived flag (`!isError && rateData?.buyRate && source !== "fallback"`); both "LIVE — USDT / NGN" badges (hero + `MobileSwap`) now read "USDT / NGN" without the pulsing dot when not genuinely live.
- [ ] `apps/customer/src/app/(marketing)/early-access/page.tsx:31` — left as-is; already explicitly noted as "acceptable" in the original finding, deprioritized in favor of higher-value fixes.
- [x] `packages/ui/src/lib/system-status.ts` vs `apps/customer/src/lib/system-status.ts` — resolved on its own: `packages/ui`'s copy no longer exists on disk (confirmed via `ls`), so `status/page.tsx`'s `@/lib/system-status` import unambiguously resolves to the single remaining copy in `apps/customer/src/lib/`. No ambiguity, no action needed.

### Task added 2026-07-03 — corrected framing after design reconciliation (dashboard page, not marketing, but the same honesty-pass pattern)

- [x] **Executed (2026-07-03).** `apps/customer/src/app/(dashboard)/referrals/page.tsx` — rewrote entirely as an honest "Coming Soon" state: removed the hardcoded stat cards ("24 referred," "₦48,000 earned," "₦4,000 pending payout"), the 8-person `MOCK_REFERRALS` table, and the functioning-looking copy-link button. Kept the hero's vision framing but added a "Coming soon" badge and an empty state ("No referrals yet") following `HANDOFF.md`'s own icon → headline → copy pattern. Left `/api/referrals` in place as intentional forward scaffolding for when this actually ships (not dead code — nothing calls it now, which is correct per the design's "do not wire to API" instruction).

**Verification:** `npx tsc --noEmit -p apps/customer/tsconfig.json` run after all edits — the only errors present are the same pre-existing ones already known (stale `.next/types/` build cache referencing deleted routes, and the pre-existing `@/test-helpers/mock-next-request` alias gap) — zero new errors introduced by this pass.

### Acceptance criteria

- No marketing page displays a number, stat, or "LIVE" badge that isn't backed by a real, currently-reachable data source or explicitly labeled illustrative.
- Both legal-page issues (placeholders, cookie claims) are resolved with actual input from the person who owns that content — not invented by whoever does the code fix.

---

## Module H — Backend Contract Fixes

**Goal:** every frontend-to-backend call has a request shape the backend actually accepts and a response shape the frontend actually reads correctly.

**Risk tier:** 🔴 **NEEDS-SIGN-OFF** for the trade/order-related contracts (financial), SAFE-TO-FIX for the rest. Depends on Module B3's Django-vs-Spring decision for full resolution.

**Blocking architectural finding, confirmed 2026-07-07 (found while auditing Module E's API-keys work, see that module's Audit section for the full trace):** the H item below about login never calling Spring described a symptom; the actual mechanism is broader and blocks more than login-sync. Read Spring's real security wiring directly (`Clusteer-Api/.../middlewares/JwtAuthenticationFilter.java` + `JwtService.java` + `configs/AppConfig.java`): any `hasAuthority('CUSTOMER')`-guarded endpoint requires an HS256 JWT signed with Spring's own `JWT_SECRET_KEY` carrying a `role` claim Spring can resolve via its own user table. The customer app's `auth_token` is a Firebase ID token (RS256, Google-signed) — an entirely different, unbridged system; no token-exchange mechanism exists anywhere in the codebase. Every existing `springFetch(path, opts, auth.token)` call site — `trade/route.ts`, `order/otp/validate/route.ts`, `order/otp/resend/route.ts` — would fail with an uncaught `SignatureException`, not a clean 401, if actually reached. This has been invisible so far only because Module C's trade wizard is client-side-fake and never calls them for real. Any future work that makes those routes reachable (Module C sign-off) — or any new customer-facing Spring integration built the same way (e.g. Module E's new API-keys feature) — inherits this and will not function until the auth-bridge is actually built. Needs the same decision as the item directly below, just with the real scope now confirmed rather than inferred.

**Auth bridge — decided (2026-07-07): build it. Built (pending audit).** Design chosen after reading Spring's actual login contract (`UserController.java:30-34` → `UserServiceImpl.loginUser`, `models/dtos/user/Login.java`: `{email, password}` → `HttpResponse{responseData: {accessToken, data}}`) and confirming the constraint that ruled out the simpler alternatives: `auth_token` can't just be swapped for a Spring JWT (Firebase-gated `middleware.ts` and `api-helpers.ts`'s `getUserIdFromToken` both assume its subject is a Firebase UID), and Spring's own signature check (HS256, its own secret) means you can't mint a compatible token without literally calling Spring's login endpoint — a hand-minted JWT would also fail `JwtService.isTokenValid()`'s `security.token`-must-match-DB-row check.

- [x] **Added `springLogin()`/`getSpringTokenFromRequest()`** (`packages/ui/src/lib/spring-boot-server.ts`) — calls Spring's real `POST /v1/user/login` with the same email/password the user just used for Firebase, distinguishes "no Spring account" (400) from every other failure (Spring's error handling doesn't expose a cleaner signal — see `springLogin`'s doc comment), and is never retried automatically (Spring deactivates an account after 3 failed attempts, so a bridge that retries on failure could lock users out).
- [x] **`auth-firebase/login/route.ts`** — after a successful Firebase login, best-effort calls `springLogin` and sets a new, separate `spring_auth_token` httpOnly cookie (30-day maxAge, matching Spring's own token expiry) on success. Failure is logged and non-fatal — the user's Firebase session is unaffected either way; they just can't reach Spring-backed features until reconciled.
- [x] **`auth-firebase/logout/route.ts`** — now also calls Spring's real `PUT /v1/user/logout` (clears `security.token` server-side, so the old JWT actually stops validating) and deletes the new cookie.
- [x] **`auth-firebase/invalidate-sessions/route.ts`** (the post-password-reset flow from Module D) — now also deletes `spring_auth_token`, since a Firebase-only password reset leaves Spring's stored password hash stale (see the open gap below) and the old bridge token shouldn't be trusted going forward.
- [x] **`api/user/api-keys/route.ts` + `[id]/route.ts`** — switched from the Firebase `auth.token` to the new bridge token; return a clear `409` ("Your account isn't linked yet — please log out and back in") if the user has no Spring session, instead of sending a token that would fail Spring's filter with an opaque error.
- [-] **`trade/route.ts`, `order/otp/validate/route.ts`, `order/otp/resend/route.ts` — deliberately NOT touched.** These are Module C files, still gated on financial sign-off. The bridge primitive is ready for them, but wiring it in is Module C's call to make, not a drive-by here.

**Known gaps in the bridge, not fixed here — need a decision, not more code from me right now:**

- **Password drift after a Firebase-only reset.** Spring only exposes two password-write paths (`UserServiceImpl.java`): `changePassword` (needs the *old* password) and `resetPassword` (needs a token Spring itself emails to the user — not something Next.js can drive server-to-server). There is no admin/service-credential override. So the first time any user resets their password through the existing "forgot password" flow, Spring's hash silently goes stale and `springLogin` starts failing for them with `"error"` (indistinguishable from a transient failure) until someone builds a real fix. The only clean options are: (a) add a new Spring endpoint, callable only via the existing `X-API-KEY` service credential (not user-facing), that lets Next.js push a password sync after a *verified* Firebase-side change — this means editing the Java backend, a bigger step I didn't take without asking; or (b) trigger Spring's own emailed reset flow in parallel, which means two separate reset emails per user, worse UX. Flagging for a decision rather than guessing.
- **Users who never got a Spring account.** `register/route.ts`'s Spring call is non-blocking, and the audit that mapped this contract found Spring enforces a *stricter* password policy (needs upper+lower+digit) than Firebase's own signup (6+ chars only, no complexity rule) — so a password that's perfectly valid for Firebase signup can silently fail Spring registration, on top of the already-tracked username-charset mismatch below. Both cause the same symptom: `springLogin` returns `"not_found"` forever for that user. Deliberately did **not** attempt a lazy "register on first login" fallback — Spring's `RegisterUser` DTO requires `phone`, which isn't available at login time (only captured at signup), so a same-time registration would either need to fabricate data or fail anyway. This is the same "orphaned Firebase-only users" gap already tracked below — now with a second, more precise root cause identified (password complexity, not just the username charset issue).

### Tasks (financial — needs sign-off, feeds directly into Module C)

- [ ] `apps/customer/src/app/api/trade/route.ts:60-62` vs `Clusteer-Api/.../dtos/p2p/CreateP2PPurchaseOrder.java:11-24` and `CreateP2PSaleOrder.java:12-30` — both buy and sell payloads omit the backend's required `currency` and `rate` fields; add them.
- [ ] `apps/customer/src/app/api/order/otp/resend/route.ts:28-31` vs `Clusteer-Api/.../dtos/p2p/ResendOrderOtp.java:9` — field-name casing mismatch (`orderId` vs backend's `orderID`); fix to match.
- [ ] `apps/customer/src/app/api/order/otp/validate/route.ts:28-31` vs `Clusteer-Api/.../dtos/p2p/ValidateOrderOtp.java:8-10` — casing mismatch on both `orderId`/`orderID` and `otpCode`/`otp`; fix to match.
- [ ] `apps/customer/src/app/api/order/route.ts:29` vs `Clusteer-Api/.../controllers/v1/OrderController.java:58-64` — the real "my orders" endpoint is `GET /v1/order` (`getMyOrders`), not `/user/{userId}/orders/`; repoint once Module B3 is decided.
- [ ] `apps/customer/src/app/api/order/[id]/cancel/route.ts:14` — no corresponding cancel endpoint exists in Spring's `OrderController.java` at all; add one on the backend before this route can ever succeed.
- [ ] `apps/customer/src/app/api/order/route.ts:31-38,45-51`, `transaction/user/route.ts:27-34,70-76` — any backend error is currently caught and silently returned as `{status:true, data:[]}`, indistinguishable from "you have no orders." Return a real error state instead.

### Tasks (non-financial, SAFE-TO-FIX)

- [ ] `apps/customer/src/app/api/auth-firebase/register/route.ts:68-70` vs `Clusteer-Api/.../dtos/user/RegisterUser.java:14-16` — frontend allows `_` in generated usernames; backend's `^[a-zA-Z0-9]+$` pattern rejects it. Align the frontend's charset to match, or loosen the backend pattern (pick one, don't leave the mismatch).
- [x] `apps/customer/src/app/api/auth-firebase/login/route.ts:1-92` — **decided and built (2026-07-07, pending audit) — see the auth-bridge section above.** Login now also calls Spring's real `POST /v1/user/login` and stores the resulting Spring JWT in a new `spring_auth_token` cookie. Two known gaps remain open (password drift on reset, orphaned Firebase-only users) — see above, not resolved by this.
- [ ] `apps/customer/src/app/api/auth-firebase/register/route.ts:67-78` — backend profile-creation failure is only `console.error`'d; the client is always told "Registration successful" regardless. Add a retry mechanism or a reconciliation job for orphaned Firebase-only users.
- [ ] `apps/customer/src/app/api/user/profile/update/route.ts:52-91,103` — `email` is destructured from the request but never forwarded to the backend, yet the response echoes it back as if saved. Either forward it for real or stop echoing it.
- [ ] `apps/customer/src/app/api/kyc/upload/route.ts:216-227` — an unguarded `.json()` call on a Django error response throws internally if the upstream returns non-JSON (e.g. an HTML 502), masking the real status behind a generic 500. Add the same `.catch()` guard used elsewhere in the same file.
- [ ] `packages/ui/src/lib/api/auth/index.ts:48-55,119-135` — `changePassword()`, `changeEmail()`, `sendEmailOTP()` POST to Next.js routes (`/user/password/update`, `/user/email/update`, `/user/send-email-otp`) that don't exist anywhere under `apps/customer/src/app/api`; `settings/security/change-password` and `change-email` pages always 404 as a result. Build the missing routes or repoint to whatever the real mechanism is (note: modal-based change-password/change-email flows may already work via a different path — check before building duplicates, per the Module E orphan findings on the standalone pages).
- [-] `apps/customer/src/app/(dashboard)/identity-verification/verify/[type]/page.tsx:94-99` — **moot (2026-07-07).** The whole `identity-verification/verify/` subtree was deleted as a confirmed orphan during Module E — see that module's task list.
- [ ] `apps/customer/src/app/api/kyc/{verify,upload}/route.ts`, `user/{profile,profile/update,avatar/update,delete,bank-accounts(+[id]),2fa/request,2fa/validate}/route.ts`, `notifications(+mark-all-read)`, `bank/verify-account` — all forward to the Django Blockchain Engine, whose reachability is not confirmed live per the app's own status-check code. Re-verify each against Module B3's decision.

### Acceptance criteria

- Every route in this module, when called with a valid session, returns a response whose shape the calling page correctly reads (verified by an actual request, not just code inspection).
- No request is sent with a field name the receiving backend doesn't recognize (grep both sides for every DTO involved).

---

## Appendix: Master Findings Ledger

Every finding from the audit, in one place, for a final cross-check that nothing was missed. Cross-reference the ID against the module sections above for the actual fix task.

| ID | Module | Severity | Location | One-line summary | Status |
|---|---|---|---|---|---|
| A-1 | A | BLOCKER | `hooks/use-user-id.ts:12` | `useUserId()` reads httpOnly cookie, always null | [x] `272099f`, moved `ebb3f8c` |
| A-2 | A | BLOCKER | `packages/ui/src/lib/axios.ts:14-17` | same, no Authorization header attached | [x] `272099f` — removed (redundant on same-origin `/api`); 401-handler cookie-clear no-op also fixed |
| A-3 | A | BLOCKER | `packages/ui/src/lib/api/settings/index.ts:13-21` | same | [x] `272099f` |
| A-4 | A | BLOCKER | `packages/ui/src/lib/api/support/index.ts:11-19` | same | [x] `272099f` |
| A-5 | A | HIGH | `settings/account/page.tsx:28-39,72-100` | downstream: limits/KYC query never fires | [-] moot — page deleted, see Module E settings-routing decision |
| A-6 | A | HIGH | `settings/notifications/page.tsx:111,114-118` | downstream: prefs query never fires | [-] moot, same reason |
| A-7 | A | HIGH | `settings/privacy/page.tsx:74,76-80` | downstream: toggles always default | [-] moot, same reason |
| A-8 | A | HIGH | `settings/payment-methods/page.tsx:35,38-45` | downstream: bank accounts query never fires | [-] moot, same reason |
| A-9 | A | HIGH | `identity-verification/page.tsx:67,95-99` | downstream: KYC status query never fires | [x] verified `272099f` — query now fires, shapes match |
| A-10 | A | HIGH | `packages/ui/src/components/app/cookie-consent.tsx:74,98,108` | audit finding: `getPrivacySettings`/`updatePrivacySettings` had a real caller missed by the "zero-caller" grep; also read identity from a client Firebase auth state that's never populated anywhere in the app | [x] `ebb3f8c` — proxy route + `useUserId()` |
| A-11 | A | HIGH | `support/[ticketNumber]/page.tsx:14` | audit finding: read `user.id` from a `useUser()` Zustand store populated only by dead `login-form.tsx` — always null, ticket query never fired | [x] `ebb3f8c` — switched to `useUserProfile()` |
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
| D-1 | D | BLOCKER | `auth-firebase/login/route.ts:45` | 2FA status check hits nonexistent endpoint | [x] `7d2ac86` — 2FA removed, check deleted |
| D-2 | D | BLOCKER | `auth-firebase/verify-2fa/route.ts:38` | 2FA secret retrieval hits nonexistent endpoint | [x] `7d2ac86` — route deleted |
| D-3 | D | BLOCKER | `middleware.ts:15-27` | unsigned JWT fallback on verify failure | [x] `7d2ac86` — fails closed now, `checkRevoked: true` added |
| D-4 | D | BLOCKER | `verify-otp/page.tsx:52-55` | signup OTP branch never calls API | [-] `7d2ac86` — moot, whole page deleted (was already unreachable — signup redirects to `/verify-email`, never `/verify-otp`) |
| D-5 | D | HIGH | `verify-otp/page.tsx:143-149` | resend never calls API | [-] `7d2ac86` — moot, same reason |
| D-6 | D | HIGH | `google-auth-qrcode.tsx:21,57` | copy-key button permanently disabled | [-] `7d2ac86` — moot, file deleted (already orphaned before this) |
| D-7 | D | HIGH | `user/[username]/2fa/validate/route.ts:58-67` | secret-save failure only warned, still claims success | [-] `7d2ac86` — moot, route deleted |
| D-8 | D | MED | `verify-2fa/page.tsx:16`, `verify-otp/page.tsx:30` | expired token, no redirect to login | [-] `7d2ac86` — moot, both files deleted |
| D-9 | D | MED | `auth-firebase/reset-password/route.ts:26` | no session invalidation after reset | [x] `7d2ac86` — new `invalidate-sessions` route + `revokeRefreshTokens` |
| D-10 | D | MED | `auth-firebase/logout/route.ts:16` | signOut() no-op server-side | [-] `7d2ac86` — confirmed cookie-delete is sufficient for single-session logout, no change needed |
| D-11 | D | MED | `login/page.tsx:32,150` + `rate-limiter.ts:9` | in-memory rate limit not shared across instances | [x] `7d2ac86` — wired to existing Redis path (`USE_REDIS_RATE_LIMITING`), all 12 real call sites updated (11 in apps/customer + 1 in apps/admin — corrected count, audit caught the commit undercounting by one); a 12th match in the already-orphaned `api-middleware.ts` needs no fix (async-function return auto-awaits). Upstash credentials still need provisioning |
| D-12 | D | MED | `login/page.tsx:174,186,201`, `signup/page.tsx:167,175` | OAuth/Passkey "coming soon" stubs | [x] `7d2ac86` — disabled + "Soon" badge |
| D-13 | D | LOW | `user/2fa/request/route.ts:23-26` | re-GET invalidates in-flight setup | [-] `7d2ac86` — moot, route deleted |
| E-1 | E | BLOCKER | `mobile-tab-bar.tsx:9,11` | Wallet/Send tabs → nonexistent routes | [x] replaced with sidebar.tsx's real `tab:true` set (Home/Buy-Sell/Orders/Me) |
| E-2 | E | BLOCKER | `command-palette.tsx:28,30,31,32` | Wallet/Send/Receive/Withdraw → nonexistent routes | [x] NAV_ITEMS rewritten to mirror sidebar.tsx exactly; broken actions removed |
| E-3 | E | BLOCKER | `identity-verification/page.tsx:174-181` | Upgrade button has no onClick | [x] `953a6fd` — Tier 2 scrolls to docs, Tier 3 disabled/"Coming soon" |
| E-4 | E | HIGH | `flow-host.tsx` / `settings/page.tsx:243` | createApiKey flow not registered | [x] `953a6fd` + audit fix — built for real against Spring's ApiKeyController; response-envelope bug found+fixed, auth-bridge gap surfaced (see Module H) |
| E-5 | E | HIGH | `mobile-menu.tsx:89,98,107` | dead anchor links, no matching ids | [x] `953a6fd` — component + its only importer `nav-bar.tsx` were both fully unreachable; deleted rather than patched |
| E-6 | E | HIGH | `verify-2fa/page.tsx` | orphan page, unreachable | [ ] |
| E-7 | E | HIGH | `middleware.ts:70-109` | /verify-2fa /referrals /markets /request unauth-reachable | [ ] |
| E-8 | E | HIGH | `settings/page.tsx` | orphans 5 dedicated settings sub-pages | [ ] |
| E-9 | E | HIGH | `settings/security/page.tsx` | orphan, cascades to its own sub-pages | [ ] |
| E-10 | E | MED | `middleware.ts:89-109` | dead protectedPaths entries | [x] removed 8 dead entries, added missing `/referrals` |
| E-11 | E | MED | `middleware.ts:70-83` | dead publicPaths entries | [x] removed `/change-password`, `/auth/callback`; added missing `/verify-2fa` |
| E-12 | E | MED | `settings/security/{google-auth,change-email,change-password}/page.tsx` | orphans | [ ] |
| E-13 | E | MED | `identity-verification/verify/page.tsx` | orphan | [x] `953a6fd` — deleted whole subtree + 2 dead-end component dependencies |
| E-14 | E | MED | `markets/page.tsx` | orphan, not in sidebar | [ ] |
| E-15 | E | MED | `request/page.tsx` | orphan + unauth-reachable | [ ] |
| E-16 | E | LOW | `dashboard-nav.tsx`, `nav-bar-dashboard.tsx` | dead components | [x] deleted (confirmed zero importers first) |
| E-17 | E | LOW | `nav-user.tsx:115,119` | unreachable links | [x] file deleted — became fully orphaned once `dashboard-nav.tsx` was removed |
| E-18 | E | LOW | `asset-client.tsx:47,53,59` | orphan, nonexistent routes | [x] deleted (confirmed zero importers first) |
| E-19 | E | LOW | `recent-activity.tsx` | orphan, unimported | [x] deleted (confirmed zero importers first) |
| E-20 | E | LOW | `about/page.tsx:206-210` | "View open roles" → wrong route | [x] `953a6fd` — now points at `/careers` |
| E-21 | E | HIGH | `page.tsx:459` + `middleware.ts:105` | "Talk to us" → protected /support, anon redirected to login | [x] `953a6fd` — now points at `/contact` |
| F-1 | F | BLOCKER | `packages/ui/src/lib/api/settings/index.ts:5-32` | Blockchain Engine key in browser bundle, 5 pages | [x] `272099f` + `ebb3f8c` — key removed; `getKYCVerification`/`getPrivacySettings`/`updatePrivacySettings` proxied, rest confirmed zero-caller |
| F-2 | F | BLOCKER | `packages/ui/src/lib/api/support/index.ts:3-9` | same pattern, support ticket page | [x] `272099f` — key removed; `getTicketDetail`/`addTicketMessage` proxied, rest confirmed zero-caller |
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
| H-8 | H | HIGH | `auth-firebase/login/route.ts:1-92` | never calls real Spring login | [x] built 2026-07-07 (pending audit) — auth bridge, see Module H's dedicated section |
| H-9 | H | HIGH | `auth-firebase/register/route.ts:67-78` | profile creation fire-and-forget | [ ] |
| H-10 | H | MED | `user/profile/update/route.ts:52-91,103` | email not forwarded but echoed as saved | [ ] |
| H-11 | H | MED | `kyc/upload/route.ts:216-227` | unguarded error parse masks real status | [ ] |
| H-12 | H | BLOCKER | `packages/ui/src/lib/api/auth/index.ts:48-55,119-135` | change-password/email hit nonexistent routes | [ ] |
| H-13 | H | LOW | `identity-verification/verify/[type]/page.tsx:94-99` | dead 202 handling branch | [-] moot (2026-07-07) — whole file deleted as a confirmed orphan during Module E |
| H-14 | H | BLOCKER | 12 kyc/user/notification routes | Django reachability unconfirmed | [?] |

**Total tracked: 111 findings across 8 modules + 3 structural decisions.**
