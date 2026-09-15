# Comprehension and persuasion refinement

Local implementation on `codex/mercury-inspired-design-revamp`. No deployment or push performed.

## Result

- Native scroll still reveals and enlarges the product, but visitors now control Quote, Transfer and Receipt. Scrolling cannot advance or rewind the selected stage.
- The amount editor sits beside its calculated payout. Mobile shows the input, net amount, rate, fee and next action together.
- Important financial labels and illustration disclosures use 14px source text. At the verified 1280 × 720 desktop fitting scale, this renders around 12.5px; mobile remains 14px.
- The supporting photo section explains buying and selling scenarios rather than repeating a second quote. The redundant details section is removed; relevant destinations remain in navigation, contextual links and footer.
- The fund-flow section names the existing operator, explains the conversion model and links to company/contact information.
- Shared FAQs plainly state that the public launch network list and standard settlement estimate have not yet been published. No partner endorsements, testimonials, operational prices or speed promises were invented.
- The demo consistently preserves up to four decimal places, and rejects greater precision with a visible explanation.
- Public pill buttons remain; dashboard button styling is unchanged. The shared QuoteSummary source row remains enabled by default for existing consumers.

## Verification

- Focused Jest suite: **20 tests passed across 5 suites**. Covers user-controlled stages, focus/inert behavior, fallback mode, conversion amounts, decimal consistency, scenario tabs and order error handling.
- Customer and admin TypeScript checks: **both passed**, with no emit and incremental disabled.
- Impeccable detector: **no findings** on the inspected changed surfaces.
- `git diff --check`: passed.
- Browser: checked 1280 × 720 desktop, 390 × 844 mobile and 320 × 740 small mobile. Maximum illustrative amount fits the smallest tested width without horizontal overflow. Mobile input and net-result label have approximately 50px separation.
- Independent finish review found no material remaining visual issues in the supplied desktop/mobile captures. The earlier decimal inconsistency it identified is fixed and regression-tested.
- Production build: **not verified**. Two normal attempts failed while Next.js/Turbopack downloaded Google Fonts (Inter, Sora and JetBrains Mono). An independent request reached a font URL only after roughly 12 seconds. No font mocks, certificate bypasses or unrelated font-system changes were introduced. Retry the normal build once those downloads are reliable.

## Current visual evidence

- `comprehension-mobile-390.png`
- `comprehension-desktop-1280.png`
- `comprehension-use-cases.png`

These supersede the earlier refinement captures for this pass. The prior refinement handoff remains historical context.
