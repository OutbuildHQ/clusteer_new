# Clusteer website implementation — local handoff

Branch: `codex/mercury-inspired-design-revamp`. No push or deployment.

## What changed

- A bounded desktop scroll sequence takes the original estuary into the customer conversion interface, then transfer and receipt. The scene uses image transforms and fades with actual HTML product components; it is not a scrubbed video or a Mercury asset.
- Public demonstration at `/demo` supports Buy/Sell, editable example amounts, keyboard-operated stages and a persistent quote. It makes no transaction/API calls.
- Restored Products, Company and Resources navigation on desktop and mobile, with an explicitly labelled in-development group.
- Rebuilt Buy, Sell, About, Help/FAQ, Contact, Press, Careers and planned-feature pages. Added Fees and Safety/Fund flow pages. Restyled the status page around real reachability results and removed unsupported incident/settlement statistics.
- Shared public content reconciles custody, pricing, network and launch claims. Pricing implementation and legal-document wording were not changed.
- Fully rounded public website buttons. Dashboard buttons retain their original 10px radius.
- Order API failures now remain failures instead of becoming successful empty history results.

## Verification

Customer and admin production builds passed. All 17 focused test cases passed across conversion, website interaction, static-motion fallback and order-error coverage. The scoped design detector returned no findings. All 22 public routes checked returned HTTP 200.

Desktop browser checks covered the opening, scroll approach, transfer/receipt, navigation, Buy and Help search. Mobile checks at 390 × 844 covered homepage, expanded navigation and Buy. A desktop-to-mobile transition restores visible hero content. Website button radius measured 999px; dashboard radius measured 10px.

The independent finish review identified static-fallback opacity retention, keyboard focus loss and invalid-amount receipt access. All three were corrected; regression tests cover them.

## Limits and remaining product decisions

This is a local website implementation, not validation of live money movement. Exact launch fees, supported asset/network/bank combinations, partner publication details and settlement expectations remain operational decisions recorded in `mercury-implementation-contract.md`. The website uses quote-dependent language rather than inventing those facts.

Small/short viewports and reduced-motion preferences use normal document flow and manual controls. Reduced-motion switching was tested with a simulated media query, not an operating-system setting. Slow-network/device performance was not benchmarked. No customer testimonials, partner endorsements or adoption figures were invented.

The original landscape is reused; no additional generated media or video was necessary for this implementation. All demonstration financial text remains HTML.
