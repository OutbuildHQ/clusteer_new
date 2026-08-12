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

## 1c. The BVN dependency chain

**Confirmed with the backend cofounder:** the constraint was never price. It was **eligibility**.

QoreID — the KYC provider Clusteer has already signed an SLA with — will supply document and ID
verification but **will not activate BVN**, because BVN access is gated to licensed financial
institutions or entities operating under one. QoreID is accountable to NIBSS for who it resells
that access to, so it has to gate it. Clusteer has no licence, so no BVN, so the only compliant
route to onboarding was Quidax's own BVN provider — which is what activated the widget.

That is a sound decision, correctly reasoned. The widget was not a shortcut; it was the only
lawful option available.

### The plan, and why it works

1. Execute the **Quidax SLA**, establishing that Clusteer operates under Quidax's SEC licence.
2. Submit that SLA to **QoreID** as evidence of licensed status.
3. QoreID **activates BVN** on Clusteer's account.
4. Clusteer migrates off the widget to **Quidax's direct API**, with its own native KYC flow.

This is coherent and it is the right destination. Four consequences follow that are not obvious
from the plan as stated.

### 1 · This revises the earlier warning about in-house KYC — in your favour

An earlier version of this document scored the migration as weakening the regulatory position,
on the basis that performing customer due diligence in-house moves Clusteer toward being the
obliged entity. **That analysis does not hold in this configuration, and the correction matters.**

Because BVN is granted *on the strength of operating under Quidax's licence*, Clusteer's CDD is
explicitly **derivative authority**, not independent obliged-entity activity. QoreID's own gating
enforces it: the access exists only while the umbrella exists. So the migration does **not** strip
the compliance shelter — it formalises it. The outsourced-CDD structure recommended earlier is no
longer optional advice; it is structurally what is already happening, and it needs to be written
down to match.

### 2 · Your ability to onboard customers now dies with the Quidax agreement

This is the significant new risk. BVN access is contingent on the SLA. If Quidax terminates,
QoreID must deactivate BVN, and Clusteer **cannot onboard a single new customer** — not
degraded service, no service.

Termination is therefore not a commercial inconvenience. It is an extinction event, and it
outranks almost everything else in this document. Two specific requirements follow:

- **90–180 days' notice minimum**, per deal-breaker 2.
- **Survival of the licence-status attestation through the wind-down period**, so BVN stays live
  while you migrate. A wind-down that keeps liquidity flowing but kills onboarding is not a
  wind-down.

### 3 · The SLA must say what QoreID needs it to say — find out first

A generic partner agreement about API access will not satisfy QoreID. It needs language
explicitly stating that Clusteer operates under Quidax's SEC Digital Assets Exchange licence as
an appointed representative or distribution partner, and that Quidax's AML programme covers
Clusteer's onboarding.

> **Sequence this correctly.** Ask QoreID **in writing, now, before the Quidax SLA is finalised**:
> *"What specific evidence and wording do you require to activate BVN for a partner operating
> under a licensed exchange?"* Then negotiate the Quidax SLA to satisfy it.
>
> Do it the other way round — sign with Quidax, submit to QoreID, get rejected — and you are
> reopening a signed agreement from the weakest possible position.

This is the highest-value tactical move available this week, and it costs one email.

### 4 · Expect Quidax to resist the wording, and expect to pay for it

Attesting that Clusteer operates under their licence transfers real regulatory responsibility to
Quidax. They will not grant it casually. Anticipate them asking for oversight rights, audit
rights, compliance reporting obligations, approval over the onboarding flow, possibly higher fees
or volume commitments.

**Accept those.** They are the price of the umbrella, and they are also what makes the umbrella
credible to a regulator and to your investor. A licence attestation Quidax gives away without
conditions is one they have not thought about, which makes it worth less than it looks.

### The critical path

Everything is now serialised behind one document:

```
Quidax SLA (with licence attestation)   4-10 weeks   <- the long pole
        v
QoreID activates BVN                     1-3 weeks
        v
Widget -> direct API migration           3-6 weeks
        v
Native onboarding flow live
```

Roughly **2–5 months end to end**, which fits inside Tranche 1 but with little slack. The legal
opinion runs in parallel and depends on the same document.

> **Start the Quidax SLA conversation now, before the funding closes.** It is the long pole, it
> gates the legal opinion, BVN activation, the API migration and the Tranche 1 gate — and it
> costs nothing to begin. Waiting for the money to land before starting adds two to three months
> to the launch date for no reason.

### One engineering note

`clusteer-unified/src/lib/kyc-provider.ts` implements Smile Identity, Youverify and Prembly.
There is **no QoreID adapter**. It is a small piece of work, but it is real, it is unbudgeted, and
it should be scheduled to land before BVN activation rather than after.

---

## 2. The six deal-breakers

If you get nothing else, get these. Each one is individually capable of making the company
uninvestable or worthless.

### 1 · Regulated entity of record
The agreement states, per transaction type, which party is the licensed VASP and under whose
licence the activity is conducted — and, if it is Quidax's, acknowledges Clusteer as an appointed
distribution partner operating under it.

> This clause now has two consumers, not one. Your lawyer cannot write the legal opinion
> without it, and **QoreID cannot activate BVN without it** — so it gates the raise and the
> ability to onboard customers at all. Confirm QoreID's required wording before finalising.

### 2 · Termination notice of 90+ days, with the licence attestation surviving wind-down
Termination for convenience on 30 days' notice or less is fatal. Target **90–180 days**, plus a
**60–90 day wind-down period** in which Quidax continues serving existing customers — and in
which **the licence-status attestation remains valid**, so QoreID keeps BVN active while you
migrate.

> Since BVN access derives from this agreement (§1c), termination does not degrade the business
> — it stops onboarding dead. A wind-down that preserves liquidity but kills customer
> verification is not a wind-down.

### 3 · Scope that survives the migration off the widget
The agreement governs the **relationship** — Quidax as liquidity, execution and custody provider
— with the widget as one schedule beneath it, and a committed timeline for the successor
integration as another. Not an agreement about a widget.

> The widget is interim. An agreement scoped to it expires in usefulness precisely when volume
> is highest and your leverage is lowest.

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

### And send this one to QoreID first — it costs one email and it sets the wording

> **Subject:** BVN activation — evidence requirements
>
> Hi [name],
>
> Following our SLA, we're finalising a partnership agreement with Quidax, under whose SEC
> Digital Assets Exchange licence we'll be operating.
>
> Before we close that agreement, could you confirm **exactly what evidence and what wording you
> require** in order to activate BVN for a partner operating under a licensed exchange? We'd
> rather draft the Quidax agreement to meet your requirements the first time than come back to
> renegotiate it.
>
> If it's helpful, happy to get on a call with your compliance team.
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
