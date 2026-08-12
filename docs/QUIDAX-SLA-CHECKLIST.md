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

## 1. Resolve this fork first — it changes everything

"Widget access" is ambiguous, and the two things it could mean are different businesses. Before
negotiating anything, establish in writing **which one you have been granted.**

| | **Model A — Embedded widget** | **Model B — API integration** |
|---|---|---|
| Who owns the customer | Quidax | **Clusteer** |
| Who does KYC | Quidax | Clusteer (via your KYC provider) |
| Who holds custody | Quidax | Quidax |
| Who sets the rate shown | Quidax | **Clusteer** |
| Whose brand is in the flow | Quidax's, or co-branded | Clusteer's |
| Clusteer's economics | Referral commission, ~0.1–0.4% | **Spread over wholesale, ~0.9%** |
| Float required | None — Quidax settles | **$80k, as budgeted** |
| Regulatory exposure | Minimal; you're a marketing channel | Grey — needs the legal opinion |
| What Clusteer is worth | A lead-gen channel | A business |

**The funding plan assumes Model B.** If what you have been granted is Model A, the $250k ask is
wrong in both directions: you need less money, and you have much less company.

There is also **Model C** — Clusteer holds custody and is the exchange of record, with Quidax as
liquidity only. That is what the current codebase actually does, and it requires Clusteer's own
SEC DAX licence at ₦2bn paid-up capital. It is not viable. Migrating off it is a Tranche 1 gate.

**Ask Quidax directly, in writing:** *"For transactions originated through Clusteer, which entity
is the exchange of record and the regulated VASP, and under whose licence is the activity
conducted?"* Their answer determines everything downstream. Get it in an email at minimum,
in the contract ideally.

---

## 2. The five deal-breakers

If you get nothing else, get these. Each one is individually capable of making the company
uninvestable or worthless.

### 1 · Regulated entity of record
The agreement states, per transaction type, which party is the licensed VASP and under whose
licence the activity is conducted — and, if it is Quidax's, acknowledges Clusteer as an appointed
distribution partner operating under it.

> Without this, your lawyer cannot write the legal opinion, and without the opinion your
> Tranche 1 gate fails and the raise stalls.

### 2 · Termination notice of at least 90 days, with transition assistance
Termination for convenience on 30 days' notice or less is fatal. Target **90–180 days**, plus a
**60–90 day wind-down period** in which Quidax continues serving existing customers while you
migrate.

> An investor will not fund a company whose core dependency can vanish inside a month.

### 3 · Customer non-solicit
Quidax will not directly solicit merchants or users introduced through Clusteer, for the term
plus 12 months. Push for segment exclusivity too — you likely won't get it, but ask.

> Quidax runs a competing retail app and a competing enterprise stablecoin business, and the
> integration shows them every merchant you acquire.

### 4 · Fixed commercial terms with a repricing notice period
Their take rate in writing, tiered by volume, with a minimum **60 days' notice** before any
change. No unilateral repricing.

> Your entire margin is the difference between their rate and yours. If they can move theirs on
> a week's notice, you have no business model — you have their business model.

### 5 · Service credits tied to the service levels
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
| 39 | Sandbox / test environment access | Permanent |
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
3. **Negotiate a short addendum covering only the five deal-breakers.** A one-page addendum gets
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

**One thing to avoid:** do not build the Model B integration deeper until you have the
entity-of-record answer. If it comes back "Quidax is not the entity of record for your
transactions," you are in Model C, you need your own licence, and the architecture and the
funding plan both change.

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
> On the agreement itself we have a small number of points — notice period on termination, a
> customer non-solicit, notice before any repricing, and service credits against the SLA. Happy
> to cover those in a short addendum rather than redlining your standard terms.
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
