# Clusteer — Funding Requirements

**Internal planning document. Not an offer.**
Prepared: August 2026 · Working FX assumption: ₦1,550 / US$1

---

## 1. The ask, in one paragraph

> Clusteer is raising **US$250,000 (≈ ₦387.5m)** to complete and launch its USDT/USDC ↔ Naira
> settlement platform on Quidax's SEC-licensed rails, and to fund the first 18 months of
> operations to break-even. The money is split **$170,000 operating capital** (engineering,
> security audit, regulatory structuring, compliance, go-to-market, 18-month runway) and
> **$80,000 settlement float** — working capital that stays on the balance sheet and is what
> makes "instant Naira" actually instant. It is released in **three tranches against dated
> milestones**, so no capital is deployed into growth before the platform is audited, the
> regulatory position is confirmed in writing, and the unit economics are proven on live volume.
> Operating break-even lands **Month 13–15**. First cash distribution is realistically
> **Month 27–33**, and there is a faster alternative to a dividend — see §7.

A smaller entry point exists if $250k is too large a first cheque: see **§6, Floor option ($120,000)**.

---

## 2. What Clusteer is

A stablecoin on/off-ramp for Nigeria. Users buy and sell USDT/USDC against Naira with
same-session bank settlement — "Trade stablecoins. Receive Naira. No delays."

Built and in the repository today:

| Component | State |
|---|---|
| Next.js 15 customer app (landing, auth, dashboard, settings, KYC flows) | Substantially built |
| Firebase authentication (email/password, JWT, HttpOnly sessions, route middleware) | Working |
| Django wallet engine, multi-chain (ETH, BSC, Solana, Tron) | Working, self-custody |
| Spring Boot / PostgreSQL API (entities, repositories, Docker, Railway config) | Partially built |
| Admin dashboard | Built, audited, not production-hardened |
| KYC (BVN/NIN) frontend + encrypted PII storage + audit logging | Built, provider not wired |
| Live rate engine | Built, **pricing logic is wrong — see §9.1** |

The last internal launch assessment (Dec 2025) scored overall production readiness at **48%**
with 12 critical blockers. The most recent commit to this repository is **27 January 2026**.
That gap is not hidden in this document — it is precisely what the raise funds.

---

## 3. Why now: the two things that changed

**3.1 Quidax.** Quidax holds Nigeria's first SEC Digital Assets Exchange licence (provisional
licence presented 29 August 2024) and in July 2026 extended its stablecoin infrastructure to
21+ countries and 14 currencies, serving 5,000+ startups and enterprises. Building on those
rails would let Clusteer operate as a **non-custodial distribution and experience layer** over a
licensed exchange, rather than as an unlicensed exchange of record.

*Status as at August 2026:* Quidax has **granted Clusteer access to their API widget**. The
**SLA is not yet signed**. Access is a technical permission; it is not a contractual right, it
carries no service commitments, no notice period, and — critically — **no stated position on
whose licence covers the transaction**. Until the SLA is executed, the regulatory argument in
§3.2 is a plan, not a fact. See `QUIDAX-SLA-CHECKLIST.md` for the clauses that must be in it.

This is the single most important economic fact in this memo, because of what it avoids:

**3.2 The regulatory capital wall.** On 16 January 2026 the SEC raised the minimum paid-up
capital for Digital Asset Exchanges and custodians **from ₦500m to ₦2bn** (≈ US$1.29m), plus a
fidelity bond of 25% of that capital and a ₦30m registration fee. Full compliance is required
by **30 June 2027**.

Clusteer cannot raise ₦2bn, and does not need to — *provided* it never takes custody of client
assets or acts as the exchange of record. Operating under Quidax's licence converts a
$1.3m+ regulatory capital problem into a $250k working-capital-and-execution problem.

**That conversion is the whole investment thesis, and it is also the whole risk. See §9.2.**

---

## 4. Use of funds — US$250,000

### A. Operating capital — $170,000 (68%)

| Line item | 18-month cost (US$) | ₦ |
|---|---:|---:|
| Core team payroll (phased — see below) | 83,000 | 128.6m |
| Legal, regulatory structuring & ongoing compliance | 16,800 | 26.0m |
| External security audit + penetration testing | 11,600 | 18.0m |
| Specialist contractors (Spring Boot, QA automation, mobile) | 9,000 | 14.0m |
| Infrastructure, tooling & third-party services | 14,200 | 22.0m |
| Payment rails setup & settlement banking | 1,000 | 1.6m |
| Marketing, launch & merchant acquisition | 18,000 | 27.9m |
| Contingency (10%) | 16,400 | 25.4m |
| **Subtotal** | **170,000** | **263.5m** |

### B. Settlement float — $80,000 (32%)

Working capital, not expenditure. To settle a customer's sale of USDT into their bank account
within minutes, Clusteer must hold Naira and stablecoin inventory on both sides of the trade
simultaneously. Requirement ≈ **1.5–2 days of transaction volume**, so $80,000 supports roughly
**$1.2–1.6m of monthly volume**.

This capital is not consumed. It sits on the balance sheet, is recoverable on wind-down, and is
the reason the product can promise "no delays" while competitors quote T+1.

**Growth beyond ~$1.5m/month is float-constrained, not demand-constrained.** The plan assumes
that gap is closed by retained earnings and by negotiating a settlement credit line with Quidax
— not by a further equity raise. If neither materialises, volume caps out around $1.5m/month
and break-even slips one to two quarters.

### Payroll detail

| Phase | Team | Monthly | Duration |
|---|---|---:|---|
| Months 1–5 (build) | Sr. backend/blockchain, full-stack, 2 founders | ₦4.9m | ₦24.5m |
| Months 6–11 (launch) | + compliance/ops lead, support, growth | ₦7.55m | ₦45.3m |
| Months 12–18 (scale) | + 2nd support, founder stipends to ₦1.0m | ₦8.4m | ₦58.8m |
| | | **Total** | **₦128.6m** |

Founder stipends are deliberately modest (₦800k → ₦1.0m/month) — enough to work full-time,
not enough to be the point of the raise.

---

## 5. Tranches and milestone gates

Capital releases against evidence, not calendar.

### Tranche 1 — $85,000, on close (Months 1–5)

Finish and harden the platform; migrate custody to Quidax; pass a security audit; obtain a
written legal opinion; soft-launch.

**Gate to Tranche 2 — all five required:**
- **Executed Quidax SLA** carrying, at minimum, the five deal-breaker clauses in
  `QUIDAX-SLA-CHECKLIST.md` — regulated entity of record, termination notice, customer
  non-solicit, service credits, and fixed commercial terms
- Written legal opinion from a Tier-1 Lagos firm confirming the non-custodial model is
  permissible under Quidax's licence without separate SEC registration
- Independent security audit passed, all critical and high findings closed
- Zero self-custody of client assets anywhere in the stack
- 100+ KYC-verified users and $300,000 cumulative settled volume, zero loss events

### Tranche 2 — $90,000, at Month 6 (Months 6–11)

Scale to $1m+ monthly volume, weighted to B2B merchants. Build the ops and compliance function.
Float to $70,000.

**Gate to Tranche 3 — all three required:**
- $1.0m volume in a single month
- Positive contribution margin (revenue net of variable costs exceeds direct costs)
- Dispute + loss rate ≤ 0.3% of volume

### Tranche 3 — $75,000, at Month 12 (Months 12–18)

Drive to and past operating break-even. Mobile app. Float to $100,000+.

If a gate is missed, the tranche is withheld and the plan is re-cut. That is the point of the
structure: the investor's downside is capped at the tranches already released, and the founders
are held to dated, falsifiable claims.

---

## 6. Floor option — $120,000

If $250k is more than this investor wants to commit alone:

- **10-month runway**, not 18
- Launch and prove unit economics to $600–800k monthly volume
- $30,000 float (caps volume at roughly $500–600k/month)
- Regional security audit instead of a Tier-1 firm
- Lighter marketing; no mobile app; no dedicated growth hire

This reaches a **fundable seed round**, not break-even. It buys proof, not independence, and a
second raise becomes mandatory around Month 9. Say so plainly rather than implying $120k gets
to profitability.

---

## 7. Unit economics, break-even, and when cash comes out

### 7.1 Take rate

| | Gross take | Variable costs | Contribution |
|---|---:|---:|---:|
| Bear | 0.60% | 0.35% | 0.25% |
| **Base** | **0.90%** | **0.35%** | **0.55%** |
| Bull | 1.30% | 0.35% | 0.95% |

Variable costs = payment rails (~0.30%), blockchain gas (~0.03%), KYC amortised, support.
Gross take is **after** Quidax's share — that number must be confirmed from the signed
agreement before this model is shown to anyone (§10).

Note that the 2.0% / 2.5% premiums currently in the code are not achievable retail pricing.
Binance P2P, Yellow Card, Breet and Quidax's own retail app compete inside 1%. Base case
assumes Clusteer prices to compete.

### 7.2 Volume ramp (base case)

| Month | 4 | 6 | 9 | 12 | 14 | 16 | 18 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Monthly volume (US$) | 150k | 500k | 1.0m | 1.6m | 2.0m | 2.35m | 2.65m |

**This ramp assumes a B2B-led go-to-market, and that is a recommendation, not a detail.**
Reaching $2m/month via retail needs ~3,300 active traders at $600/month each. Reaching it via
merchants needs ~50 SME accounts at $40k/month — businesses paying overseas suppliers,
settling vendor payouts, or holding stablecoin treasury. Fewer relationships, higher volume per
account, far stickier, and it matches the testimonial already on the site about vendor payouts.
Retail is the brand; merchants are the revenue.

### 7.3 Break-even

**Operating break-even: Month 13–15**, at roughly $2.0m monthly volume, against fully-loaded
operating costs of ~$9,000/month at that stage.

- Bull case (1.3% take): Month 9–10
- Bear case (0.6% take): Month 20+, and a bridge is required

Closing in Q4 2026 puts base-case break-even around **Q4 2027 / Q1 2028**.

### 7.4 When dividends actually start — the honest answer

Break-even is not the same as distributable cash. Three gates stand between them:

1. **Operating break-even** — Month 13–15
2. **Reserves built from retained earnings** — the float must be funded to policy (2× peak
   daily volume, ~$150k) and a 6-month operating reserve (~$54k) held. At $4–6k/month of early
   surplus, that is **12–15 months after break-even**.
3. **First full audited financial year closed and CIT settled.**

**First distribution: Month 27–33 — realistically H1 2029 on a Q4 2026 close.**

Tell him that number. A crypto off-ramp is a volume business: dividends only get interesting
above roughly **$8–10m monthly volume** (~$60k/month operating profit), which is a Year-3
milestone that probably requires a second round. Promising an early dividend to a cofounder's
former boss and missing it costs more than the money.

Nigerian tax notes to confirm with an advisor before this is committed to writing: the Nigeria
Tax Act 2025 took effect 1 January 2026; small companies (turnover ≤ ₦100m, fixed assets ≤ ₦250m)
are CIT-exempt, but Clusteer exits that band once net revenue passes ₦100m/year. Standard CIT is
30%, and dividends carry withholding tax on top.

---

## 8. A better structure than a dividend

He asked about dividend sharing. The dividend math above gives him nothing until 2029, which
will not feel like a good deal to an operator who wants to see his money work. Two structures
serve him better:

**Recommended — equity plus a cash sweep.** $250,000 for **12–15% equity**, plus a contractual
**15% sweep of monthly net revenue** starting the first month after certified operating
break-even, running until he has received **1.5× capital ($375,000)**, then stepping down to 5%
or terminating. He starts seeing cash in **2028 rather than 2029**, his capital comes back on a
defined path, and the founders keep more equity. A normal dividend policy applies pro-rata to
all shareholders after that.

**Simpler — straight equity.** $250,000 for **18–20%** (pre-money $1.0–1.15m), with a written
dividend policy: no distributions until 6 consecutive months of positive operating cash flow,
float fully funded, and a 6-month opex reserve held; thereafter 40% of after-tax free cash flow
distributed quarterly.

Whichever is chosen: **do not give away more than 25% in this round.** A seed round follows,
and a cap table that is already 35% angel-owned is very hard to price.

---

## 9. Risks — state these before he finds them

**9.1 The pricing engine is currently wrong.** In
`clusteer-unified/src/app/api/system/exchange-rate/route.ts:44`, buy rate = base × 1.02 and sell
rate = base × 1.025, so the sell rate sits *above* the buy rate — an inverted spread that loses
roughly 0.5% on every round trip. The base is also the **official** FX rate from
`open.er-api.com`, not the parallel/P2P rate Nigerians actually transact at, which makes the
quote mispriced against the real market in both directions. Cheap to fix, fatal if it ships.
Fix it before anyone sees a demo.

**9.2 The regulatory position is unconfirmed.** Everything in §3 depends on Clusteer operating
without custody, under Quidax's licence, without its own SEC registration. That must be
confirmed in a **written legal opinion**, not assumed. If the SEC requires separate registration
as an ancillary provider (≈ ₦300m / $194k paid-up capital), the model changes materially and
this raise is undersized. **This is the first thing Tranche 1 buys, and no growth spend should
happen before it lands.**

**9.3 The current architecture contradicts the thesis.** The Django engine creates and holds
wallet private keys in the database. That is custody, it is the exact thing §3 says Clusteer
does not do, and it is also the largest security liability in the stack. Eliminating self-custody
is a Tranche 1 gate, not a nice-to-have.

**9.4 The Quidax dependency is contractually unsecured.** Today Clusteer has API widget access
and no signed SLA. That means: no committed uptime, no settlement-time guarantee, no notice
period before access is withdrawn or repriced, no service credits, and no written statement of
whose licence covers the transaction. The entire business would sit on a permission that can be
revoked by email.

Layered on top is channel conflict: Quidax runs its own retail app and its own enterprise
stablecoin business. Today's partner is tomorrow's competitor, and Clusteer's merchants would be
visible to them. The agreement needs a customer non-solicit and, ideally, segment exclusivity.

**Signing the SLA is the highest-value action available before this raise closes**, and it costs
nothing but time. An investor who asks "show me the Quidax agreement" and is handed API
credentials will draw an unflattering conclusion — about the deal and about the telling.

**9.5 Naira and float exposure.** Float held in Naira devalues. Mitigation: hold float
predominantly in USDT and convert on demand; never carry an overnight Naira position larger
than one settlement cycle.

**9.6 Bank de-risking.** Nigerian banks close crypto-linked accounts with little notice.
Mitigation: settle through a PSP with a written crypto policy, and maintain at least two
settlement banks from day one.

**9.7 Execution and key-person risk.** The platform is materially incomplete and the repository
has been quiet since January 2026. Two founders, no bus factor. Tranche 1's first hire addresses
the second problem; the milestones address the first.

**9.8 Competition.** Binance P2P, Yellow Card, Breet, Busha and Quidax itself. Clusteer's
defensible wedge is merchant service and settlement speed, not price — do not pitch it on price.

---

## 10. What is needed before this goes to him

Nine gaps. Every one changes a number in this document.

1. **The signed Quidax SLA** — currently API widget access only. Liquidity only, or custody and
   settlement too? Their revenue share? Volume minimums? Exclusivity? Termination notice?
   Without it the 0.9% gross take rate in §7.1 is a guess, and §3.2 is an assumption.
   Working document: `QUIDAX-SLA-CHECKLIST.md`.
2. **The KYC SLA.** Cost per BVN/NIN verification, monthly minimums, contract term.
3. **Current cash position and monthly burn.**
4. **Cap table** — the split between the two founders, and anything already promised to anyone.
5. **Incorporation status** — CAC registration, SCUML registration, NDPC data-controller filing.
6. **Any existing traction** — waitlist, beta users, pilot volume, LOIs from merchants.
7. **What the investor actually wants** — equity, debt, or revenue share; and his cheque range,
   which determines whether §1 or §6 is the right ask.
8. **A current FX rate.** ₦1,550/US$1 is an assumption throughout.
9. **An updated engineering estimate** on the remaining build, from whoever will do the work.

---

## 11. The short version, for a message

> We've costed it properly rather than guessing. To get Clusteer live and to break-even we need
> **$250,000 (≈₦387m)**, released in three tranches against milestones — roughly $170k to finish
> and audit the platform, get the regulatory structuring done, and fund 18 months of a lean team
> and go-to-market; and $80k of settlement float, which isn't spend — it's the working capital
> that lets us pay people out instantly, and it stays on the balance sheet.
>
> Because we're building on Quidax's SEC licence rather than seeking our own, we avoid the ₦2bn
> paid-up capital the SEC now requires of licensed exchanges — that's what makes a raise this
> size viable at all.
>
> Operating break-even is Month 13–15. On dividends I'd rather be straight with you than
> optimistic: real distributions are a Year-3 event. If you want to see cash back sooner, I'd
> propose equity plus a revenue-share sweep that starts the month we hit break-even and runs
> until you've had 1.5× your capital back. Happy to walk through the full model.
>
> If $250k is more than you want to put in alone, there's a $120k version that gets us launched
> and to proof — but I won't pretend that one reaches profitability.

---

*Figures are internal estimates built bottom-up from the current codebase, Nigerian market rates,
and published regulatory requirements as at August 2026. Every assumption is flagged. This
document is a planning tool, not a representation to any investor.*
