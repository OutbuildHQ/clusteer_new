# Quidax SLA — What Must Be In It Before You Sign

**Working document. Not legal advice — have a Nigerian lawyer review before execution.**
Status as at August 2026: **API widget access granted. SLA unsigned.**

---

## 0. Why this is urgent

API access is a permission. An SLA is a right. Right now Quidax can withdraw access, reprice,
change the settlement window, or start selling directly to your merchants, and you would have no
contractual recourse. Every number in `FUNDING-REQUIREMENTS.md` — the 0.9% take rate, the
avoidance of the ₦2bn SEC capital requirement, the whole reason a $250k raise is viable —
depends on terms that do not yet exist on paper.

Signing this is the highest-value, lowest-cost action available before the raise closes.

---

## 1. Where the economics landed — and what is still open

The widget permits Clusteer to **quote its own rate**. That settles the commercial question in
Clusteer's favour:

| | **Referral model** | **What Clusteer has** |
|---|---|---|
| Who sets the rate shown | Quidax | **Clusteer** |
| Economics | Commission, ~0.1–0.4% | **Spread over wholesale, ~0.9%** |
| Float required | None — Quidax settles | **$80k, as budgeted** |
| What Clusteer is worth | A lead-gen channel | **A business** |

So the funding model stands: the 0.9% gross take rate and the $80k settlement float are both
correctly sized. Good news, and worth telling the investor plainly.

**The regulatory question is not settled, and rate flexibility made it harder.**

Regulators test economic substance, not labels. Setting your own price and capturing the spread
is what a **principal** does — a dealer trading on its own account — not what an agent or
introducer does. The factors now point in two directions:

| Points toward *Clusteer is the VASP* | Points toward *Quidax is the VASP* |
|---|---|
| Clusteer sets the price | Quidax holds custody |
| Clusteer captures the spread | Quidax executes and settles |
| Clusteer owns the customer relationship | Quidax is the licensed counterparty |
| Customer contracts on Clusteer's terms | |

Custody is the strongest thing on the right-hand side, which makes it the load-bearing element
of the whole argument. Two things follow:

- **Never take custody.** The moment Clusteer holds client assets, every factor points one way
  and the licence question answers itself — at ₦2bn. The Django engine currently creates and
  holds wallet private keys in the database. That must be gone. It is a Tranche 1 gate.
- **The legal opinion is now more necessary, not less.** Do not let the rate flexibility be read
  as good news for the licensing position. It is good news for revenue and a complication for
  compliance, and your lawyer needs to see the actual flow of funds and the actual customer
  contract to advise.

**Ask Quidax directly, in writing:** *"For transactions originated through Clusteer, which entity
is the exchange of record and the regulated VASP, and under whose licence is the activity
conducted?"* Get it in an email at minimum, in the contract ideally. Your lawyer cannot start
without it.

---

## 1b. The widget is temporary — and that changes what you sign

The widget is an interim integration pending a successor arrangement. The trap is obvious once
stated: **an SLA scoped to the widget stops being useful at the exact moment you migrate off it**
— which will be when volume is highest, customer obligations are real, and your negotiating
position is weakest because you are already committed.

Three rules follow.

1. **Scope the agreement to the relationship, not the integration.** Define Quidax as the
   liquidity, execution and custody provider for Clusteer, and make the widget one *schedule*
   under it. The successor integration becomes another schedule. The commercial terms, the
   non-solicit, the termination notice and the entity-of-record language all survive the
   migration.
2. **Contractually commit the successor.** If the plan is to move to direct API, get Quidax's
   commitment to provide it — with a timeline — rather than a promise to discuss it later.
   "We'll sort it out when you're ready" is worth nothing when you are carrying $2m/month.
3. **Do not let the interim status delay signing.** "It's only temporary" is the most common
   reason startups operate for two years with no contract. Temporary integrations become
   permanent, and the unsigned period is exactly when you are most exposed.

**Before finalising, establish the end state,** because it determines whether the SLA is
sufficient or whether a much larger problem is being deferred:

- **Direct Quidax API, still their licence** — same analysis, same SLA, just a new schedule.
- **Multiple liquidity providers with Quidax as one** — you become an aggregator/broker; the
  entity-of-record argument gets harder, and each provider needs its own agreement.
- **Own custody and own settlement** — this is Model C. It requires Clusteer's own SEC DAX
  licence at **₦2bn paid-up capital**, and the funding plan in `FUNDING-REQUIREMENTS.md` does not
  cover it. If this is the intended destination, the raise is undersized by an order of magnitude
  and the strategy needs rethinking before the investor conversation, not after.

---

## 1c. The BVN decision — it should not be driving the architecture

The widget was adopted because Clusteer chose not to implement BVN — ID verification only —
which meant using Quidax's BVN provider, which activated the widget. The plan is that $250k
funds an independent BVN provider, unlocking the direct API and full customisation.

Both premises behind that chain need checking, and the conclusion needs re-deriving.

### Premise 1: "BVN is expensive." It is not.

Published Nigerian pricing runs from **₦10 per BVN check** (Monnify) to roughly ₦100–₦300 for a
full-service provider with biometric matching. Against the raise:

| Users verified | @ ₦10 | @ ₦100 | @ ₦300 |
|---|---:|---:|---:|
| 5,000 | ₦50k · $32 | ₦500k · $323 | ₦1.5m · $968 |
| 20,000 | ₦200k · $129 | ₦2m · $1,290 | ₦6m · $3,871 |
| 50,000 | ₦500k · $323 | ₦5m · $3,226 | ₦15m · $9,677 |

The realistic cell — 20,000 verified users at ₦100 — is **$1,290, or 0.5% of the raise.** The
worst cell in the table is under 4%. This already sits inside the ₦300k/month KYC allowance in
the infrastructure line of `FUNDING-REQUIREMENTS.md`. **BVN cost has never been a real constraint
on this business, and no architectural decision should have turned on it.**

> **Find out what "expensive" actually meant.** If it was a **minimum monthly commitment** or a
> prepaid wallet float, that is negotiable and small. If it was **eligibility** — direct NIBSS
> BVN access generally requires a licensed financial institution or a licensed aggregator, and
> providers do refuse unlicensed crypto businesses — then **money does not solve it**, and the
> whole "$250k unlocks our own BVN provider" plan fails on a non-financial constraint. Establish
> which one it was before building a plan on it.

### Premise 2: "BVN is optional." It is not.

Nigerian VASP obligations require BVN or NIN linkage as part of customer due diligence under the
SEC framework and CBN AML/CFT guidance. Anonymous or lightly-verified trading is not a supported
model. Running ID-only verification is not a cost saving — it is **an open compliance gap**, and
it is the kind of gap that surfaces in exactly two places you do not want it: the legal opinion
that gates Tranche 1, and an investor's diligence.

So BVN is going in regardless. The only question is who performs it.

### The real trade — and it is not the one it looks like

Moving to direct API with in-house KYC is not a free upgrade. It systematically strips away the
evidence that Quidax, not Clusteer, is the regulated entity:

| Factor | Today (widget) | After (direct API + own BVN) |
|---|---|---|
| Sets the price | Clusteer | Clusteer |
| Captures the spread | Clusteer | Clusteer |
| Owns the customer | Clusteer | Clusteer |
| **Performs customer due diligence** | **Quidax** | **Clusteer** |
| Holds custody | Quidax | Quidax |
| **Score** | **3–2 Clusteer** | **4–1 Clusteer** |

Performing CDD is one of the defining functions of an obliged entity under FATF-aligned AML
regimes. Taking it in-house moves Clusteer materially closer to "you are the VASP, licence
yourself" — and leaves **custody as the single remaining pillar** of the argument that keeps the
₦2bn requirement away.

**The widget is not only a technical constraint. Right now it is also a compliance shelter.**

### The way to get both

There is a well-established structure: perform KYC **as outsourced customer due diligence under
Quidax's AML programme**, rather than as your own obliged-entity function. Clusteer builds and
runs the flow — native UX, own provider, full customisation, own data — while Quidax remains the
obliged entity, retains regulatory responsibility, sets the CDD standard, and holds audit and
oversight rights over how Clusteer executes it.

That is a contractual arrangement, not a technical one, and it must be written into the Quidax
agreement. Done properly you keep the conversion and the customisation *and* the shelter. Done
casually — you simply start doing your own KYC and tell Quidax afterwards — you get the
customisation and lose the shelter.

### Correct sequencing

The plan as stated is *fund → buy BVN → move to API*. That risks spending the money on the thing
that undermines the reason the money was raisable. Reorder it:

1. **Scope the legal opinion to cover both configurations** — widget-with-Quidax-KYC *and* direct
   API with outsourced CDD. Same lawyer, same engagement, marginal extra cost. This happens in
   Tranche 1 regardless.
2. **Get the outsourced-CDD arrangement into the Quidax agreement** while you are negotiating it
   anyway. It costs a clause, not a renegotiation.
3. **Then migrate**, knowing the position holds.

### And do it for the right reason

The case for direct API is real, but BVN cost is not it. The reasons that justify the migration:

- **Conversion.** A handoff to an embedded third-party flow typically leaks a meaningful share of
  signups at the KYC step. At $2m/month volume, a 20% conversion improvement is worth
  multiples of the entire lifetime BVN bill.
- **Customer ownership.** Your verification data, your record, reusable across products.
- **Optionality.** A native integration is a precondition for ever adding a second liquidity
  provider.
- **Brand.** Your flow, not a Quidax-shaped hole in the middle of it.

Argue it on those, budget BVN as the rounding error it is, and stop letting a $1,300 line item
determine the shape of the company.

---

## 2. The six deal-breakers

If you get nothing else, get these. Each one is individually capable of making the company
uninvestable or worthless.

### 1 · Regulated entity of record
The agreement states, per transaction type, which party is the licensed VASP and under whose
licence the activity is conducted — and, if it is Quidax's, acknowledges Clusteer as an appointed
distribution partner operating under it.

> Without this, your lawyer cannot write the legal opinion, and without the opinion your
> Tranche 1 gate fails and the raise stalls.

### 2 · Scope that survives the migration off the widget
The agreement governs the **relationship** — Quidax as liquidity, execution and custody provider
— with the widget as one schedule beneath it, and a committed timeline for the successor
integration as another. Not an agreement about a widget.

> The widget is interim. An agreement scoped to it expires in usefulness precisely when volume
> is highest and your leverage is lowest.

### 3 · Termination notice of at least 90 days, with transition assistance
Termination for convenience on 30 days' notice or less is fatal. Target **90–180 days**, plus a
**60–90 day wind-down period** in which Quidax continues serving existing customers while you
migrate.

> An investor will not fund a company whose core dependency can vanish inside a month.

### 4 · Customer non-solicit
Quidax will not directly solicit merchants or users introduced through Clusteer, for the term
plus 12 months. Push for segment exclusivity too — you likely won't get it, but ask.

> Quidax runs a competing retail app and a competing enterprise stablecoin business, and the
> integration shows them every merchant you acquire.

### 5 · Fixed commercial terms with a repricing notice period
Their take rate in writing, tiered by volume, with a minimum **60 days' notice** before any
change. No unilateral repricing.

> Your entire margin is the difference between their rate and yours. If they can move theirs on
> a week's notice, you have no business model — you have their business model.

### 6 · Service credits tied to the service levels
Uptime, settlement time, and support response times with **financial remedies** attached.

> An SLA with commitments but no remedies is a brochure. Credits are what make the numbers real.

---

## 3. Full clause checklist

Work through these with your lawyer. "Target" is what to open with.

### Commercial

| # | Clause | Target |
|---|---|---|
| 1 | Pricing mechanism — wholesale rate, markup, or per-transaction fee | Wholesale rate you mark up; you control the retail price |
| 2 | Quidax's take rate, in writing | Stated %, confirms your 0.9% gross model |
| 3 | Volume tiers and rebates | Rate improves at defined volume thresholds |
| 4 | Minimum volume commitments | **None.** If unavoidable, set well below forecast with no penalty |
| 5 | Repricing notice | ≥ 60 days |
| 6 | Settlement currency, timing, and cut-offs | T+0 where possible; stated cut-off times |
| 7 | Fees for failed or reversed transactions | Borne by the party at fault |
| 8 | Invoicing and payment terms | Net 30, netted against settlement |

### Regulatory and compliance

| # | Clause | Target |
|---|---|---|
| 9 | Regulated entity of record *(deal-breaker 1)* | Explicit, per transaction type |
| 10 | Evidence of Quidax's SEC licence and its current standing | Copy annexed; confirm whether provisional has converted to full |
| 11 | Who performs and owns KYC/AML | Defined; no gap, no duplication |
| 11a | **Outsourced CDD arrangement** — Clusteer runs the KYC flow under Quidax's AML programme | Quidax remains the obliged entity; sets the CDD standard; holds audit and oversight rights. Written in *before* you migrate off the widget |
| 11b | Approved KYC providers and standards | Your provider named and accepted, so the migration does not need re-approval |
| 12 | Who files suspicious transaction reports to NFIU | Defined |
| 13 | Sanctions and screening responsibility | Defined; Quidax's Chainalysis coverage extends to your flow |
| 14 | Regulatory change clause | Renegotiate in good faith, not automatic termination — SEC deadline is 30 June 2027 |
| 15 | Audit and information rights | You can obtain records needed for your own compliance |
| 16 | Data protection / NDPA roles | Controller vs processor defined; NDPC-compliant |
| 17 | Right to name Quidax publicly and in fundraising materials | Granted, subject to reasonable approval |

### Service levels — the actual SLA

| # | Clause | Target |
|---|---|---|
| 18 | Uptime commitment, with measurement method and exclusions | ≥ 99.9%, measured monthly |
| 19 | Quote latency and **rate validity window** | Quote honoured for a stated period — critical when you promise instant rates |
| 20 | Settlement time commitment | Stated maximum, not "best efforts" |
| 21 | API throughput and rate limits | Ceiling stated, with headroom above your Month-18 forecast |
| 22 | Support response times by severity, with named contact and escalation path | P1 ≤ 30 min, 24/7 |
| 23 | Planned maintenance windows and notice | ≥ 5 business days, outside Nigerian peak hours |
| 24 | Incident notification | ≤ 30 min from detection |
| 25 | **Service credits** *(deal-breaker 5)* | Sliding scale against fees |

### Risk and liability

| # | Clause | Target |
|---|---|---|
| 26 | Liability cap | Resist a cap at fees paid; carve out failed settlement and loss of client funds |
| 27 | Who bears loss on stuck or failed blockchain transactions | Quidax, where custody and execution are theirs |
| 28 | Reversal and chargeback handling | Defined process and timelines |
| 29 | Mutual indemnities | Balanced |
| 30 | Insurance, including custody insurance | Evidence provided |
| 31 | Force majeure | Standard, but excludes their own system failures |

### Protecting the business

| # | Clause | Target |
|---|---|---|
| 32 | Customer non-solicit *(deal-breaker 3)* | Term + 12 months |
| 33 | Segment exclusivity | Ask; expect to trade it away |
| 34 | Term and termination notice *(deal-breaker 2)* | 90–180 days |
| 35 | Transition assistance on termination | 60–90 days of continued service |
| 36 | Change of control | Notice, and a termination right if a competitor acquires them |
| 37 | Customer data ownership and export | **Yours**, exportable in a usable format on demand |
| 38 | Suspension rights | Only for defined material breach, with cure period |

### Operational

| # | Clause | Target |
|---|---|---|
| 39 | **Successor integration** — committed availability, spec and timeline | Named in the agreement as a schedule, not a future conversation |
| 39a | Migration support between integrations | Quidax-supported, no service gap, no repricing on migration |
| 39b | Sandbox / test environment access | Permanent |
| 40 | API versioning and deprecation notice | ≥ 90 days |
| 41 | Branding and white-labelling | Clusteer-branded flow |
| 42 | Governing law and dispute resolution | Nigerian law, Lagos arbitration |

---

## 4. How to actually get it signed

Quidax serves 5,000+ partners. They will have standard partner terms — you are not going to
redline a bespoke contract, and trying will cost you months.

**The play:**

1. **Ask for their standard partner agreement and SLA schedule.** Whoever drafts, controls — but
   with a counterparty this size, asking for their paper is faster than proposing yours.
2. **Accept the standard terms.** Do not fight clauses that do not matter.
3. **Negotiate a short addendum covering only the six deal-breakers.** A one-page addendum gets
   signed. A 40-clause redline gets forwarded to someone's legal queue and dies there.
4. **Escalate to a named partnerships or commercial contact** — not the support desk, and not
   whoever gave you the API key. Ask your cofounder who made the introduction to make it again.
5. **Use the raise as the forcing function.** It is true, it is specific, and it is the kind of
   deadline partner teams respond to. See the draft below.
6. **Have a lawyer review before signing.** This is inside the legal line already budgeted in the
   funding plan — do not skip it to save two weeks.
7. **In parallel, get the cheap things in writing now:** the rate card, the entity-of-record
   answer from §1, and a copy of their SEC licence. These often arrive by email in days and are
   enough to unblock your lawyer's opinion while the full SLA is in process.

**Two things to avoid.**

*Do not let "it's temporary" become the reason nothing gets signed.* Interim integrations become
permanent, and the unsigned window is exactly when the business is most exposed. Sign an
agreement scoped to the relationship now; add the successor as a schedule later.

*Do not commit further engineering to any end state that involves Clusteer holding custody* until
you have the entity-of-record answer and the legal opinion. If the destination is own-custody,
own-settlement, the licence requirement is ₦2bn and the current funding plan does not cover it —
that has to be known before the investor conversation, not after.

---

## 5. Draft email

> **Subject:** Clusteer × Quidax — partner agreement and SLA
>
> Hi [name],
>
> Thanks again for getting us set up with widget access — the integration work is underway.
>
> We're closing an investment round and our investor's diligence requires the executed partner
> agreement and SLA, so I'd like to get the paperwork finalised. Could you send across your
> standard partner agreement and SLA schedule? We're happy to work from your paper.
>
> Three things we'd want to confirm alongside it, and I'd be grateful for a written answer on the
> first even ahead of the full agreement, as our counsel needs it:
>
> 1. For transactions originated through Clusteer, which entity is the exchange of record and the
>    regulated VASP, and under whose licence is the activity conducted?
> 2. Your rate card and volume tiers.
> 3. A copy of your SEC licence and its current standing.
>
> One structural note: we're live on the widget now but expect to move to a deeper integration
> as we scale. Rather than paper the widget alone, we'd like the agreement to cover the
> relationship, with the widget as a schedule and the successor integration added as another when
> we get there — so we're not renegotiating from scratch mid-flight.
>
> Beyond that we have a small number of points — notice period on termination, a customer
> non-solicit, notice before any repricing, and service credits against the SLA. Happy to cover
> those in a short addendum rather than redlining your standard terms.
>
> Is there a good time this week for a call?
>
> Best,
> [name]

---

## 6. Before you next speak to the investor

He has been told the Quidax partnership is "done and cleared." Widget access is real and it is
genuine progress — but it is not a signed agreement, and if he asks to see the contract during
diligence, the gap between what he heard and what exists will do more damage than the gap itself
warrants.

The fix is cheap and it is available now: tell him the integration is live and the commercial
agreement is being papered, and give him a date. Volunteering that reads as rigour. Having it
discovered reads as something else — and this is a cofounder's former boss, where the
relationship outlives the deal.
