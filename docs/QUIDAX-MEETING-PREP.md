# Meeting Prep — Clusteer × Quidax, Legal Agreement Conversation

**Wed 26 August 2026, 16:00–16:30 WAT.** Thirty minutes. Likely on the call: Emmanuel Omiwole
(Enterprise Sales), possibly Al-Ameen and Tobenna from the email thread, and — given the title —
someone from Legal.

---

## The one outcome

**Get a definitive answer to: will Quidax Technologies Limited, the SEC licence holder, confirm
in writing that Outbuild operates under its licence?**

Yes, no, or "here's what we can do instead" — any of those is a win. Ambiguity is the only
failure. Everything else on your list is worth less than this one answer, and thirty minutes is
not enough to do two things properly.

The fact that they set up a *legal* conversation within days is a good sign. They have escalated
it internally. Do not spend that goodwill relitigating the contract.

---

## Frame it right in the first minute

You are a customer who wants to send them volume and has hit a blocker. You are not a
counterparty complaining about their paper.

> "Thanks for setting this up. We're happy with the agreement commercially and we want to get
> live — but we've hit one blocker on our side that we can't solve without you, and I'd rather
> raise it now than work around it. It's about how we evidence our regulatory position to our
> KYC provider."

That does three things: signals you're not reopening the deal, makes the problem concrete and
external, and gives Legal something specific to solve rather than a grievance to defend against.

---

## The three questions, in priority order

**1. The entity question.** *(This is the meeting. Ask it first.)*

> "The agreement is with Quidax Technologies FZCO in Dubai. Our understanding is the Nigerian
> SEC Digital Assets Exchange licence sits with Quidax Technologies Limited. Our KYC provider,
> QoreID, won't activate BVN for us unless we can evidence that we're licensed or operating
> under a licensed entity — and without BVN we can't verify Nigerian customers, so we can't go
> live at all. Can Quidax Technologies Limited either come onto the agreement, or issue a short
> letter confirming we operate under its SEC licence for activity conducted through your API?"

**2. The positioning question.** *(Only after you have an answer to 1.)*

> "Related — clause 16.1 says we're an independent contractor with no agency, and 8.1(d) has us
> warrant we hold the required licences and approvals. Taken together those read as though we're
> expected to be separately licensed. Is that Quidax's position? Because if it is, that's useful
> to know now — it changes our timeline, not our commitment."

**3. The mechanism question.** *(For Legal specifically, if they're on.)*

> "Does the SEC's ARIP framework actually allow a licensed DAX to extend coverage to a partner —
> an appointed representative or agent arrangement? If it doesn't exist as a mechanism, we'd
> rather know and go the registration route."

Question 3 matters because a letter is only useful if the framework permits the arrangement.
Quidax's legal team will know this better than almost anyone in Nigeria. It's a genuinely useful
free consultation, and asking it signals you're serious rather than fishing.

---

## Reading their answer

| What they say | What it means | What you do |
|---|---|---|
| "Yes, Quidax Technologies Limited can confirm that" | **Win.** The umbrella exists and they'll stand behind it | Pin the form (letter or addendum), the owner, and the date. Get it in the follow-up email today |
| "You don't need a licence — you're just using our API" — but no written confirmation | **The trap.** Their opinion is not evidence. QoreID cannot act on it, the SEC will not accept it, your lawyer cannot rely on it | Push once: "That's helpful — what can you put in writing to that effect?" If the answer is nothing, plan as though it's the row below |
| "We can't take regulatory responsibility for your business" | Honest, and probably means no umbrella | Ask directly: "So your position is we need our own registration?" Then treat as below |
| "You'd need your own SEC registration" | **Clarity, not disaster.** Now you can plan | Ask which category — ancillary (~₦300m) or full DAX (₦2bn) — and whether they'll support the application as a partner |
| "Let us look into it" | Normal | "Who owns it, and by when? We have a KYC provider and an investor both waiting." |

**The single most important line in this brief:** reassurance is not evidence. The most likely
way this meeting goes wrong is that everyone is friendly, you're told not to worry, and you leave
with nothing written down. That feels like a win in the room and is worth nothing on Monday.

---

## Anticipated pushback, and answers

**"FZCO is our contracting entity for all API partners — it's standard."**
> "That's fine, and we're not asking to move the commercial agreement. What we need is separate
> and narrow: a confirmation from the Nigerian entity about regulatory coverage. The two don't
> conflict."

**"Your lawyer should advise you on this, it's not our call."**
> "We have counsel engaged. But whether Quidax regards us as operating under its licence is your
> call, not theirs — our lawyer can only advise on facts you give us."

**"We've never had a partner ask for this."**
> "Possibly because most partners are already licensed, or aren't doing BVN-gated onboarding.
> QoreID's requirement is specific and it's the thing standing between us and going live."

**"Can't you just use our KYC through the widget?"**
> "That's what we're doing today, and it works. But we're building toward the direct API, and we
> need our own BVN access for that. We'd rather set the structure up correctly now than migrate
> twice." *(Note: this is a legitimate fallback — if the licence answer is no, the widget still
> works. Say so. It signals you're not making a threat.)*

**"Why is this urgent?"**
> "We're closing an investment round and diligence covers our regulatory position. I'd rather
> show the investor an accurate picture than a comfortable one."

---

## What not to do

- **Don't open with the clause-by-clause critique.** You'll put Legal on the defensive and lose
  the thirty minutes. Raise 16.1 and 8.1(d) only as question 2, framed as "help us read this
  correctly," not "your contract contradicts itself."
- **Don't say the agreement is bad or one-sided.** Say counsel flagged specific clauses.
- **Don't accept a verbal assurance as closure.** Warm words, no paper, no progress.
- **Don't agree to anything on the call.** "Let me take that back to my team" is always available.
- **Don't lead with the commercial asks.** They're worth real money but they are not today's job.

---

## Secondary list — only if time remains

Mention these exist, offer to send a one-pager, and move on. Do not negotiate them live.

| Item | Ask |
|---|---|
| Fee schedule | Rate card in writing; 60 days' notice before any change *(3.4 currently lets Quidax reprice at will)* |
| Termination | 30 days → 90 days, with the licence attestation surviving wind-down *(14.9)* |
| Service levels | Uptime, settlement time, support response — none currently exist |
| Customer non-solicit | Term + 12 months |
| **Change of control** | **14.1.2 triggers immediate termination on a change of control in Outbuild's ownership. Raise this one — it's quick, it's clearly unintended as applied to a funding round, and it directly affects your raise** |

Change of control is the one secondary item genuinely worth thirty seconds today, because Legal
is in the room and it's an easy fix they're unlikely to resist.

---

## Close the meeting with this

> "So to make sure I've got it — [restate what they committed to]. Who's the right person to own
> that, and what's a realistic date? I'll send a short summary after this so we're working from
> the same note."

Three things to leave with: **a named owner, a date, and the form the answer takes.**

---

## Immediately after — send the summary email today

This is the step that converts a friendly conversation into a record. Same day, while it's fresh.

> **Subject:** Clusteer × Quidax — summary of today's call
>
> Hi all,
>
> Thanks for the time today. Summarising so we're working from the same note:
>
> - [What they said about the entity / licence question]
> - [What they committed to, who owns it, by when]
> - [Anything left open]
>
> I'll send through a short one-pager on the commercial points we mentioned — fee schedule and
> notice, termination notice, service levels, a customer non-solicit, and the change-of-control
> clause at 14.1.2 — for a brief addendum rather than reopening the agreement.
>
> Shout if I've mischaracterised anything.
>
> Best,
> Olamide

If they later contradict what was said, this email is your record. If they don't reply
correcting it, silence works in your favour.

---

## Five-minute pre-call checklist

- [ ] Agreement open, clauses **8.1(d), 16.1, 3.2, 6.4, 14.1.2** flagged
- [ ] Both entity names to hand: **Quidax Technologies FZCO** (signed) vs **Quidax Technologies
      Limited** (SEC licence, ARIP approval 29 Aug 2024)
- [ ] QoreID's stated requirement, if they've replied
- [ ] Know your one outcome and ask for it in the first five minutes
- [ ] Notepad open for the summary email — write it while they're still talking
