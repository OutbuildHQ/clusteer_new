⚠️ DEGRADED: single-context (sub-agent spawn failed: agent thread limit reached)

# Clusteer homepage — review and comprehension improvements

Reviewed 15 September 2026. Target: apps/customer/src/app/page.tsx and its homepage components. Branch: codex/mercury-inspired-design-revamp. Local preview: http://localhost:3000/.

## Grade

Before this pass: **8.5/10**. After implementation and layout verification: **8.9/10**. These are editorial design judgments, not measured conversion or usability results.

| Area | Before | Assessment |
| --- | --- | --- |
| Visual identity | 9.2 | The semicircle/four-dot sculpture gives Clusteer a recognisable asset family. Forest, paper and selective lime feel cohesive. |
| Typography and composition | 9.0 | Consistent hierarchy, generous spacing and readable editorial groupings. The full page remains long. |
| Hero and product presentation | 8.7 | The real customer layout makes the proposition tangible. At 1280 × 800 the device overlapped the actions; corrected in this pass. |
| Motion | 9.0 | The camera approach is purposeful; 12-second artwork loops have pause controls and duration rings. The hero has a static fallback. |
| Product explanation | 8.0 | The basic direction was evident, but the sequence and prerequisites required assembly across several sections. |
| Choosing a next step | 7.8 | The route tab explained a scenario but sent visitors to another explanation before the matching walkthrough. |
| Copy | 8.3 | Grounded tone, but wallet/bank and quote/progress/receipt promises were repeated without enough new information. |
| Navigation | 8.4 | Core routes are organised sensibly; future products remain separated. Two walkthrough links in the Products menu are redundant. |
| Mobile | 8.2 | Readable surfaces, but a tall photograph came before the Buy/Sell choice. This pass puts the task first. |
| Trust and practical detail | 8.3 | Operator identity, fund flow and support are present. Exact tariffs and timing remain quote-dependent; the homepage should not manufacture guarantees. |

## Design specificity

This feels authored for Clusteer. The logo-derived sculpture, local work setting, stablecoin-to-naira examples and actual customer interface are stronger evidence of identity than colour alone. The weakest element was the information sequence: several sections restated the same conversion promise.

The automated detector returned zero findings before and after changes across the homepage, hero, conversion stories, brand gallery, FAQ/close and navigation. That result does not establish conversion effectiveness or complete accessibility compliance.

## Usability health

| Heuristic | Before /4 | After /4 | Reason |
| --- | --- | --- | --- |
| Visibility of system status | 3 | 3 | Launch state, progress, playback and waitlist feedback are available. |
| Match with the real world | 3 | 4 | Outcomes and bank/wallet destinations are now explicit. |
| User control and freedom | 3 | 4 | Existing keyboard tabs and pause controls retained; section navigation repaired. |
| Consistency and standards | 4 | 4 | Shared product UI, repeated control conventions and stable palette. |
| Error prevention | 3 | 3 | Required network/destination checks are explained; account-dependent details remain in the order. |
| Recognition rather than recall | 2 | 3 | Prerequisites and route sequence are now visible together. |
| Flexibility and efficiency | 3 | 3 | Route-specific walkthrough shortcuts reduce an unnecessary detour. |
| Aesthetic and minimalist design | 3 | 3 | Strong craft; long page and some navigational repetition remain. |
| Error recovery | 3 | 3 | Existing waitlist retry and preserved input covered by regression tests. |
| Help and documentation | 3 | 3 | Verification FAQ and order-specific support are easier to understand. |
| Total | 30/40 | 33/40 | Good. All ten heuristics apply because the page includes an interactive product and form. |

## Priority findings and implementation

1. **P1 — Direction selection did not explain the whole task.** Replaced the short source/destination table with a three-step sequence for each direction, a prerequisites block and a walkthrough link carrying the selected Buy/Sell state. Existing product detail links remain. Addresses clarify/onboard.
2. **P2 — Important decisions were buried under repeated promises.** Reworked gallery captions around stored balance, total payout and charges, confirmation timing, and the receipt. Added identity verification to the homepage FAQ. Addresses clarify/distill.
3. **P2 — Mobile reading order delayed the task.** Moved the conversion controls before the supporting photograph at small widths and reduced the photograph to a 4:3 composition. Addresses adapt.
4. **P2 — Hero actions overlapped the device at an 800px desktop height.** Extended the short-desktop spacing rule through 850px. Addresses layout.
5. **P2 — Section links could land before the correct position.** Realigned incoming hashes after initial hero layout; changed How it works navigation to native anchors so an existing hash can be activated again. Addresses harden.

The hero now plainly states both conversion outcomes. The homepage close confirms that joining requests a launch email and does not create a trading account. Website button shapes, dashboards, generated artwork, duration rings, local transaction boundaries and the legal footer remain intact.

## Persona checks

- **First-time visitor:** Now sees what arrives, where it arrives, what is needed and how the process proceeds. A visitor unfamiliar with stablecoins may still need category education.
- **Distracted mobile visitor:** Can reach the direction tabs without passing the large photograph. Both tabs remain comfortably tappable at 320px and switch with keyboard arrows.
- **Deliberate evaluator:** Can follow the selected direction into the walkthrough, inspect costs and understand conditional timing. The site still cannot substantiate a fastest/cheapest claim; none was added.

## Remaining opportunities

- Check comprehension with people new to the product: what does Clusteer do, what would they need, and what happens after joining? Observe whether they can answer without opening help.
- Simplify the duplicate walkthrough entries in the Products menu if usage evidence shows confusion. Preserve all product destinations.
- Validate the public asset/network availability matrix against the operational launch selector. The project notes distinguish USDC presentation/configuration from the current USDT trade selector; imagery alone is not availability evidence.
- Measure production mobile performance before assigning a performance score. Development screenshots and successful type checks are not Core Web Vitals measurements.

No customer testimonials or partner names are required to complete this prelaunch design pass. The current opportunity is comprehension and product choice, not another change of visual style.

## Verification and run notes

- Browser review: complete desktop journey, hero at 1280 × 800, narrow layouts at 390px and 320px, product menu, mobile menu, keyboard tabs, selected Buy walkthrough, closing form, footer and section anchors.
- Direct #how load verified after the viewport settled, with the section at the 100px navigation offset. No page-width overflow at 320px; direction controls were 59px high.
- All 35 design/interaction tests passed across eight suites. After the anchor fix, all three scroll regression tests passed again. Customer TypeScript check passed after the code changes.
- Clean fresh browser load had no console errors. An earlier hot-refresh tab reported useId hydration mismatches during edits; this did not reproduce on a fresh load. Development image-size warnings remain.
- No live waitlist submission, trade execution or deployment was performed.
- Target slug: apps-customer-src-app-page-tsx. No ignore.md file was present. Independent assessment attempt failed at the agent limit; design review was completed before the detector ran.
- Detector: zero findings on both scans. Read-only browser evaluation prevented overlay injection; no overlay or auxiliary live server was created. Screenshots, accessible state and computed geometry supplied the fallback evidence.
- Existing development server retained. Temporary review tabs closed and viewport overrides reset. No generated temporary report file was needed; this report is the durable artifact.
