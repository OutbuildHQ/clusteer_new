# Review — Executed Quidax API as a Service Agreement

**Document:** *API as a Service Agreement — Quidax Technologies FZCO × Outbuild Ltd*
**Dated:** 13 August 2026 · **Received countersigned:** 19 August 2026
**Signatories:** Adetolani Balogun (COO, Quidax Technologies FZCO) · Agboola Olamide (Director, Outbuild Ltd)

**Not legal advice.** This is a plain reading of what the document says. A Nigerian lawyer, and
for the arbitration clause an English-law lawyer, should review before any further step.

---

## Verdict

This is a **standard aggregator/reseller supply contract**, drafted for Quidax, and it is now
executed. It gives Outbuild contractual API access across a broad scope — wallets, crypto
on/off-ramp, liquidity, fiat on/off-ramp — which is genuinely useful and means the widget-to-API
migration is not blocked on scope.

It is **not** the partnership agreement the funding plan is built on. It provides no regulatory
umbrella, no service levels, no pricing certainty and no customer protection. Of the six
deal-breakers in `QUIDAX-SLA-CHECKLIST.md`, **it satisfies none.**

Most urgently, **clause 8.1(d) contains a warranty that is likely untrue**, and it has been
signed.

---

## The three findings that block the plan

### 1 · Wrong entity — the counterparty is not the SEC-licensed company

Two different companies share the Quidax brand:

| | Holds the SEC licence | Signed this agreement |
|---|---|---|
| **Name** | Quidax Technologies **Limited** | Quidax Technologies **FZCO** |
| **Jurisdiction** | Nigeria | Dubai, UAE (Dubai Silicon Oasis) |
| **Basis** | SEC provisional Digital Assets Exchange licence under ARIP, 29 August 2024 | — |

A UAE free-zone company cannot hold a Nigerian SEC licence — those are granted to CAC-registered
Nigerian companies. **The entity that signed is not the entity that holds the licence.**

The tell is inside the document itself: the contracting party is Dubai-registered, but the
notices address for Quidax is 1 Adedeji Adekola Street, Lekki, Lagos. Two addresses because
there are two companies.

This is probably deliberate and unremarkable — many African fintechs route international and API
business through a UAE entity for tax and FX reasons. It is not a trick. But it means the
document does not give Outbuild any linkage to the Nigerian licence, and rights under it run
only against the Dubai company, enforceable in London arbitration under English law.

The fix may be straightforward: a letter from Quidax Technologies Limited, or adding it as a
party to the arrangement.

### 2 · The agreement says the opposite of what QoreID needs

The plan was: execute the Quidax SLA → submit to QoreID as evidence of operating under a licence
→ QoreID activates BVN. This document defeats that at three separate points:

| Clause | What it says |
|---|---|
| Recital C | Outbuild will "use the API **independently** for its business operations" |
| 16.1 | Outbuild "is an **independent contractor**"; nothing constitutes "a joint venture, **agency**, partnership" |
| 6.4 | **Both** parties responsible for "obtaining and maintaining all relevant permits, licenses and approvals" |
| 3.2 | "**The Aggregator** shall be responsible for carrying out sufficient Know Your Customer (KYC) procedures" |

Clause 16.1 is the killer: it expressly denies agency. "Appointed representative operating under
Quidax's licence" is the one reading this document forecloses.

> **Do not submit this to QoreID as evidence of licensed status.** It does not evidence that. At
> best it fails; at worst it is submitted alongside an implied representation that Outbuild is
> licensed, which is the problem in finding 3.

### 3 · Clause 8.1(d) — a signed warranty that is probably untrue

> *"Aggregator represents and warrants that … **it has the required licenses and regulatory
> approvals to conduct its business and participate in this transaction.**"*

Outbuild has no SEC registration. Whether this warranty is true depends entirely on whether one
is required — **which is precisely the question the legal opinion was commissioned to answer.**
The warranty has been given before the answer exists.

Consequences if it is untrue:

- **Breach** → immediate termination under 14.1.3, no notice.
- **Indemnity** → 12.1(a) and 12.1(b) make Outbuild liable, uncapped, for any loss Quidax suffers
  from the breach or from regulatory violations arising out of Outbuild's performance.
- **Misrepresentation** → an independent claim under English law, which governs.

This is the single item to address first, and it is a reason to raise the licensing question with
Quidax directly rather than quietly.

---

## Deal-breaker scorecard

| # | Required | In the agreement | Result |
|---|---|---|---|
| 1 | Regulated entity of record | 16.1 denies agency; 8.1(d) puts licences on Outbuild | **Failed — inverted** |
| 2 | 90+ days notice, attestation survives | **30 days** either side (14.9), plus immediate termination at Quidax's "absolute discretion" (14.1.5–14.1.7) | **Failed** |
| 3 | Scope survives migration | Broad API scope (1.1.2) covers the migration; no successor schedule or timeline | **Partial** |
| 4 | Customer non-solicit | Absent. And 3.3 obliges Outbuild to hand over customer details on request | **Failed** |
| 5 | Fixed fees, repricing notice | 3.4 — "such fees as may be prescribed by Quidax **from time to time**". Unilateral, no rate card, no notice | **Failed** |
| 6 | Service credits | No service levels exist at all | **Failed** |

**On the sixth:** despite the filename, this is not an SLA. Quidax's entire obligation set is
clause 5.1 — provide integration assistance, and "ensure that the Service is consistent with
industry standards." There is no uptime commitment, no latency or rate-validity window, no
settlement-time guarantee, no support response times, and therefore nothing to credit against.

---

## Other terms worth knowing

| Clause | Effect |
|---|---|
| 13.1.1 | Quidax's liability capped at roughly **one month of Outbuild's own fees**. An outage that costs more than a month's revenue is uncompensable |
| 13.4, 14.6 | No lost profits, consequential or exemplary damages — including on termination |
| 14.7, 14.8 | No termination indemnity of any kind. Outbuild expressly acknowledges no expectation the relationship continues and no recovery of investment made in acquiring customers |
| 12.1 | Outbuild indemnifies Quidax broadly and **uncapped**, including for regulatory violations. No reciprocal indemnity |
| 14.1.2 | **Change of control in Outbuild's ownership triggers immediate termination.** Check this against the investment structure before closing the round |
| 14.1.6 | Quidax may terminate immediately if it "in its absolute discretion, determines that the relationship … represents increased risk of loss or liability" |
| 11.1–11.5 | All data-protection liability on Outbuild. No controller/processor allocation, which NDPA compliance will require |
| 19, 20 | **English law; LCIA arbitration, seat London, one arbitrator.** For a company this size, an LCIA reference costs more than most disputes are worth — this is a practical bar to enforcing anything |
| 9.2 | Right to identify as an authorised Aggregator for Quidax — non-exclusive, limited, revocable |
| 2.1 | Appointment is **non-exclusive**, and no minimum volume commitment is imposed. Genuinely useful: nothing prevents adding a second liquidity provider later |

---

## What this does and does not change

**Does not change:** the $250k figure, the use of funds, the unit economics, the float
requirement, the break-even timing. Those all hold.

**Does change:**

- **Tranche 1's regulatory gate is now harder, not easier.** The executed agreement is evidence
  *against* the umbrella position, and the legal opinion must now be written with it in view.
- **The BVN route is blocked** until the licensing question is resolved. Onboarding cannot go
  live without BVN, so this is on the critical path.
- **Termination risk is worse than modelled.** 30 days, plus discretionary immediate termination.
  Risk 9.9 in `FUNDING-REQUIREMENTS.md` assumed this could be negotiated to 90–180 days.
- **Change of control (14.1.2)** is a new item to check against the investment terms.

---

## What to do, in order

1. **Do not submit the agreement to QoreID yet.** It does not evidence licensed status.
2. **Reply to Emmanuel this week** — draft below. Lead with the QoreID/BVN blocker, because it is
   a concrete go-live requirement rather than a legal argument, and sales contacts move on those.
3. **Instruct the lawyer now**, with this agreement in hand. Two questions: does Outbuild require
   its own SEC registration given clauses 16.1, 3.2 and 6.4; and is warranty 8.1(d) currently
   accurate? Do not wait for funding — this is the item everything else waits on.
4. **Ask Quidax for an addendum** covering the fee schedule, notice period, termination notice,
   service levels and a customer non-solicit. Post-signature addenda are normal, and goodwill is
   highest right now.
5. **Check 14.1.2 against the investment structure** before agreeing terms with the investor.
6. **Tell the investor accurately.** "Commercial agreement executed; regulatory structuring in
   progress" is true and fine. "Partnership done and cleared" is not supported by this document.

---

## Draft reply to Emmanuel

Keep it warm and narrow. The goal is one answer — which entity, and what regulatory position —
not a renegotiation by email.

> **Subject:** Re: Countersigned agreement — one item before we can go live
>
> Hi Emmanuel,
>
> Thank you — good to have this closed out, and thanks for moving it quickly.
>
> One item I need your help with before we can complete onboarding, and it is a blocker on our
> side rather than a commercial point.
>
> Our KYC provider, QoreID, will not activate BVN for us unless we can evidence that we are
> licensed, or that we operate under a licensed entity. Without BVN we cannot verify Nigerian
> customers, so we cannot go live.
>
> We had expected to use this agreement as that evidence, but two things in it mean we cannot:
>
> 1. The agreement is signed by **Quidax Technologies FZCO** in Dubai. Our understanding is that
>    the Nigerian SEC Digital Assets Exchange licence is held by **Quidax Technologies Limited**,
>    a separate Nigerian company. Could Quidax Technologies Limited either come onto the
>    agreement as a party, or issue us a short letter confirming that Outbuild operates under its
>    SEC licence for the activity we conduct through the API? Either would satisfy QoreID.
> 2. Clause 16.1 describes us as an independent contractor and states there is no agency, and
>    clause 8.1(d) has us warrant that we hold the required licences and approvals ourselves. We
>    want to be sure we are reading these the way you intend, because taken together they suggest
>    we are expected to be separately licensed. Our counsel has flagged it.
>
> If Quidax's position is that we do need our own SEC registration, that is useful to know now —
> it changes our timeline rather than our commitment.
>
> Separately, and less urgently, there are a few points we would like to cover in a short
> addendum rather than reopening the agreement: the fee schedule and notice before any change,
> the termination notice period given the customer obligations we will be carrying, basic service
> levels, and a customer non-solicit. Happy to send a one-pager.
>
> Could we get fifteen minutes this week with whoever owns the regulatory side? I would rather
> resolve the licensing question properly than work around it.
>
> Best,
> Olamide

## Holding note to QoreID

Do **not** send the agreement. If they are expecting it:

> Hi [name],
>
> Quick update — our agreement with Quidax is executed, but we are confirming one point with them
> on the licensing structure before we submit it, so that what we send you actually meets your
> requirement. Could you confirm in the meantime exactly what evidence and wording you need to
> activate BVN for a partner operating under a licensed exchange? That way we can get it right
> first time.
>
> Best,
> [name]
