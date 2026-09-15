# Clusteer × Mercury: comparative design, motion, content and repository audit

**Date:** 14 September 2026
**Local branch:** `codex/mercury-inspired-design-revamp`
**Scope:** Read-only audit. No application changes, deployment or production transactions.

## Verdict

The new Clusteer homepage is an atmospheric first pass, not yet a complete Mercury-level website system. It captures quiet colour, scenery, generous spacing and a cleaner product preview. It does not yet capture Mercury’s most effective move: turning the brand scene into the product experience as the visitor scrolls.

The larger shortcoming is structural. The redesign simplified navigation before reconciling the existing product catalogue, left secondary pages in the previous visual language, and focused the homepage on selling stablecoins even though the product direction includes buying as well.

**Implementation integrity: fail at whole-site level.** The new components provide a useful foundation, but the website does not yet express one coherent product contract or visual system. This is a judgement about the inspected implementation, not a claim that every part of the product is defective.

## Evidence and limits

The comparison separates five sources:

1. **Mercury’s live site:** desktop and mobile browser inspection, scrolling, menus, product selectors, rendered DOM, media sources and computed styles.
2. **Clusteer production:** the original page currently loading at [clusteer.com](https://clusteer.com).
3. **Local redesign:** the homepage, early-access implementation, shared components, dashboard preview context and secondary-page comparison.
4. **Pre-redesign repository HEAD:** original navigation and footer, distinguished from currently edited files.
5. **Repository and handoffs:** active customer/admin applications, shared UI, backend routes and services, legacy projects, PRD/README material, and the supplied standalone HTML handoffs.

The repository inventory found 40 customer page files and 42 customer API handlers; 38 admin page files and 15 admin API handlers; and 126 shared UI TypeScript/TSX/CSS files. Backend and legacy projects were inventoried, with targeted traces through pricing, order, wallet, payment-request and identity-provider code. The sibling mobile repository was inventoried, not deeply audited.

This was **repository-wide discovery plus targeted code tracing**, not a line-by-line review of every source file, a security assessment, or certification of live settlement. No real funds, identity verification or authenticated production transaction was exercised.

Browser reference sizes included 1280 × 720 desktop and 390 × 844 mobile. Mercury’s reduced-motion alternatives were verified in rendered classes; the operating-system preference was not toggled. Network-throttled performance, screen-reader behaviour and exhaustive viewport coverage remain unmeasured.

The scoped Impeccable implementation detector returned no findings for the inspected new homepage/brand/header files. That result does not detect content contradictions, removed navigation, missing choreography or whole-site design drift.

## 1. Mercury’s scroll effect: what actually happens

### Observed sequence

| Stage | Observed Mercury behaviour | Current Clusteer behaviour |
|---|---|---|
| Arrival | Landscape, desk, chair and laptop form one scene behind the proposition and application controls. | Static estuary image behind the proposition and links. |
| Initial scroll | The scene stays in a sticky viewport while the headline leaves and the view approaches the desk. | The entire hero scrolls away normally. |
| Approach | The laptop becomes the main subject; the surrounding environment recedes through framing and depth. | No change of framing or connection to the interface below. |
| Product handoff | The screen occupies the visual field; the physical laptop framing gives way to an isolated interface. | A separate conversion card appears later in ordinary page flow. |
| Explanation | Product media shifts into a text-and-demo composition with selectable capabilities. | Three manual preview tabs replace a panel with a short entrance animation. |
| Continuing down | Section reveals, alternating surfaces, product demonstrations and customer evidence keep changing the pace. | Mostly static sections with similar explanatory copy and repeated waitlist invitations. |

At the inspected desktop viewport, Mercury’s initial hero section measured **1800 pixels, equivalent to 250vh**. A child uses a full-height, motion-safe sticky viewport. The mobile hero initially measured **2110 pixels at an 844-pixel viewport**, also 250vh.

Approximate desktop observation points were around 430 pixels for the approach, 860 pixels for the laptop close-up, and 1330 pixels for the isolated interface. These are observations from this session, **not stable implementation milestones to copy**. The wrapper changed height after passage, so later document coordinates were not directly comparable.

### Verified implementation signals

- The hero contains responsive video sources named `hero-scrub-lg.mp4`, `hero-scrub-md.mp4` and `hero-scrub-sm.mp4`.
- Responsive still-image sources provide the starting scene.
- The scene uses a sticky viewport, masking and layered composition.
- The video has reduced-motion hiding classes; the scene also has a reduced-motion single-screen-height alternative.
- Product demonstrations use separate video clips, posters, play/pause controls and visibility transitions.
- A small Three.js canvas was present elsewhere in the DOM. Its role was not established, and it was not the hero-sized scene.

**Conclusion:** video scrubbing plus sticky composition is supported by the evidence. Calling the hero a real-time 3D scene, a GSAP implementation or a Lenis implementation would be speculation.

This matters for scope: Clusteer does not need an expensive real-time 3D world to achieve a comparable narrative transition. A well-directed rendered clip or restrained image transformation can supply the environment; real HTML can supply the readable product interface.

### Other verified motion details

| Interaction | Mercury evidence | Gap to close in Clusteer |
|---|---|---|
| Product selector | Selecting a capability updates expanded copy and the matching product clip. | Tie navigation, explanation and demonstration to the same state. |
| Media transition | Opacity/filter transition around 400ms; inactive media is moved out of the active composition. | Preserve continuity between preview states rather than replacing the whole visual identity. |
| Desktop composition change | A 600ms transition with cubic-bezier(.76, 0, .24, 1) was present. | Define a deliberate timing hierarchy. |
| Section entrances | Computed translate/opacity animations around 670ms, with separate easing curves. | Use selective entrances to establish reading order. |
| Accordion | Grid-row expansion around 300ms. | Smooth expansion without hiding content from keyboard users. |
| Navigation | Caret/colour transitions, menu-container animation and separate content animation. | A complete menu interaction model, not only a toggled list. |
| Testimonials | Portrait, role and quote states change with fade/blur/translation. | Introduce evidence only when Clusteer has real, publishable evidence. |
| Logo strip | Visible movement between observations. | Optional later; never fill it with unapproved partner or customer marks. |
| Mobile menu | Full-screen hierarchy, category accordions, bottom account actions and an explicit close control. | Preserve product discovery on mobile. |
| Header | Stays available and adapts to dark and light surfaces. | Current Clusteer header is relative/absolute and leaves with the hero. |

Motion values are measurements of this reference, not prescriptions to reproduce every duration. The useful lesson is that different actions have different tempos and purposes. [Reference: Mercury homepage](https://mercury.com/).

## 2. Broader design comparison

| Area | Mercury’s useful principle | Current Clusteer gap | Appropriate response |
|---|---|---|---|
| Art direction | The opening scene leads into actual use of the product. | The estuary creates atmosphere but has no visual consequence later. | Establish one clear bridge from the opening image to the conversion workspace. |
| Typography | Custom Arcadia Display/Arcadia, controlled scale, consistent supporting hierarchy. | Sora/Inter are usable, but the 74px local desktop hero overwhelms the information beneath it; secondary pages use a different weight and style. | Tune hierarchy and line length across page families before shopping for another font. |
| Layout | Alternates cinematic, split, demonstration, evidence and information layouts. | The middle of the page repeats abstract explanatory sections. | Let each section answer a different buyer question. |
| Product assets | Demonstrations are tied to concrete tasks. | One conversion card and decorative Unicode symbols carry most of the explanation. | Build a small family of real UI crops: quote, destination, transfer progress and receipt. |
| Surface design | Dark/light changes support the narrative, with navigation responding. | Surface changes are decorative and disconnected from navigation behaviour. | Make surface, header and section transitions work together. |
| Information architecture | Navigation exposes product depth and decision support. | New navigation removes most product/company discovery. | Restore useful hierarchy, with explicit availability labels. |
| Conversion | Demo, application, product details and pricing support different readiness levels. | Repeated waitlist links provide little new reason to act. | Pair waitlist with a clearly labelled product demonstration and specific FAQs. |
| Trust | Evidence and qualification sit near relevant claims. | Many older claims were removed, but little concrete reassurance replaced them. | Explain the actual fund flow, fee presentation, support and launch access. |
| Mobile | Dedicated art direction and full navigation hierarchy. | Responsive stacking exists; an equivalent motion composition has not been designed. | Design the mobile story separately, keeping the useful content equivalent. |
| Website-to-product continuity | The website reveals recognisable product screens. | The mini preview is much narrower than the existing dashboard experience. | Reuse the actual customer workspace and shared transaction components. |
| Cross-page continuity | Product, pricing and security pages extend the same design language. | Local /buy still has heavy typography, lime highlights, thick outlines and offset shadows under the new quiet header. | Complete the website system across routes. |

Mercury’s current homepage uses custom sans-serif typography. Reducing its direction to “editorial serif plus beige” would be inaccurate. The premium effect comes from composition, control and product specificity.

Mercury’s [payments page](https://mercury.com/business-payments) also demonstrates a useful structural lesson: give visitors practical method comparisons and answers to likely objections. Its [pricing](https://mercury.com/pricing) and [security](https://mercury.com/security) destinations make these decisions discoverable. Their claims and business model must not be copied into Clusteer.

## 3. What disappeared from Clusteer’s navigation

The original repository header contained Products, Company and Resources groups. The new header exposes only How it works, Our approach and Help & support, plus account actions.

| Destination | Original header | New header/footer | Recommended treatment |
|---|---|---|---|
| Buy stablecoins | Products | Footer only | Restore prominent product discovery. |
| Sell stablecoins | Products | Footer only | Restore prominent product discovery. |
| Live markets | Products | Removed from both | Route currently presents coming-soon content; do not imply a live market tool. |
| Payment requests | Products | Removed from both | Resolve readiness; describe as planned if retained. |
| Mobile app | Products | Removed from both | Coming-soon placement until a usable release exists. |
| How it works | Products | Direct header + footer | Keep direct and make the explanation genuinely two-way. |
| About | Company | Footer only | Restore within Company. |
| Careers | Company | Removed from both | Footer/company placement if the page remains maintained. |
| Press | Company | Removed from both | Footer/company placement if useful and maintained. |
| Contact | Company | Footer only | Keep readily discoverable. |
| Help | Resources | Direct header + footer | Keep. |
| Security / trust | Resources anchor | Dedicated entry removed | Create an accurate trust explanation and a working destination. |
| Rate alerts | Resources | Removed from both | Label planned until the service is verified. |
| Service status | Footer, with fetched badge | Static footer link | Preserve the destination; restore status display only with reliable data and failure states. |
| Developer API | Present in supplied HTML handoff, absent in pre-redesign HEAD | Absent | This was not removed by this redesign. Treat as handoff intent, not a shipped product. |

The standalone HTML materials matter: they reveal a broader intended website and a Developer API concept. They are not evidence that those services are operational. The developer handoff itself contains a coming-soon fallback.

### Proposed navigation

**Products · How it works · Company · Resources**, followed by **Sign in · Join the waitlist**.

- **Products:** Buy stablecoins, Sell stablecoins. Put planned features in a clearly labelled secondary area only if still on the roadmap.
- **Company:** About, Contact. Careers and Press may live here or in the footer.
- **Resources:** Help centre, Fees and rates, Safety and fund flow, Service status.
- **How it works:** direct access to the core explanation.

This is a proposal for Clusteer’s scope. Mercury’s much larger catalogue does not justify a similarly large mega-menu here.

## 4. Product truth: what the repository changes about the design brief

The strongest current direction is a **stablecoin ↔ naira ramp**, with delivery to external wallets or Nigerian bank accounts through settlement infrastructure. It should not be presented as a general-purpose bank or a wallet holding customer balances merely because old mockups show a balance.

| Topic | Verified repository evidence | Consequence for the website |
|---|---|---|
| Buy and sell | Customer trade flow contains both directions. | Homepage should make both core jobs discoverable, even if one leads the story. |
| Custodial balances | WalletServiceImpl explicitly parks custodial operations and throws for those methods. Help says users cannot hold a Clusteer balance. | Remove unqualified “hold” promises and balance-led mockups. |
| Partner fund flow | Quidax service uses partner endpoints named custodial on/off-ramp transactions. | Explain who receives and settles funds. A “non-custodial” label alone is insufficient; this audit does not establish a legal classification. |
| Contradictory FAQ | /faq says Clusteer includes a custodial wallet; /help says it does not. | Resolve the contradiction before styling or amplifying either claim. |
| Pricing | Exchange-rate route applies 2% and 2.5% adjustments to a base rate; public pages say no markup/spread and a flat 0.75%. | Establish one approved pricing explanation. The source conflict does not establish the actual production charge. |
| Assets and networks | Active QxChannel type exposes TRC20, BEP20 and ERC20; the trade state is narrower than broad marketing claims. FAQ lists five networks. | Publish a verified asset-by-network matrix. Do not infer availability from a general Chain type or a mock selector. |
| Identity checks | Provider factory selects a configured provider, defaulting to Smile Identity. | Existing “parallel providers” language is not supported by this implementation alone. |
| Payment requests | Marketing page exists; request UI constructs a sample handle/link; sidebar entry is intentionally hidden. Backend CRUD exists. | Do not describe this as a verified end-to-end public payment product. |
| Referrals | Backend schema/controller exists, while the customer route remains stubbed and the page says coming soon. | Older PRD statements that no schema exists are stale; the feature still needs end-to-end verification. |
| Developer API | Handoff concept and API-key code exist; public developer documentation/onboarding is not established. | API keys are not proof of a launched developer platform. |
| Live markets, mobile, alerts | Public surfaces contain placeholders or coming-soon treatment. | Preserve roadmap context without presenting it as current availability. |
| Launch access | Signup is gated toward early access, with invitation handling. | Keep the clear waitlist/access language. |
| Demo versus live flow | Review component still creates a mock order; other stages include simulated progress. | A polished preview must remain explicitly demonstrative. |
| Dashboard reliability | Orders proxy turns upstream errors into successful empty results. | A “no orders” state can conceal a service failure; visual polish cannot correct this semantic error. |

The PRD, README and older projects contain conflicting custody, P2P, hosting and feature-status descriptions. They are useful history, not a single reliable current specification. Current source also does not prove deployment configuration or partner availability.

### Source anchors

- [Rate adjustments](</Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/clusteer-unified/apps/customer/src/app/api/system/exchange-rate/route.ts:15>)
- [Custody contradiction in FAQ](</Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/clusteer-unified/apps/customer/src/app/(marketing)/faq/page.tsx:65>)
- [No-balance explanation in Help](</Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/clusteer-unified/apps/customer/src/app/(marketing)/help/page.tsx:100>)
- [Parked wallet service](</Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/Clusteer-Api/src/main/java/com/outbuild/clusteer/services/impls/WalletServiceImpl.java:14>)
- [Partner ramp integration](</Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/Clusteer-Api/src/main/java/com/outbuild/clusteer/services/external/QuidaxServiceImpl.java:62>)
- [Network channel type](</Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/clusteer-unified/packages/ui/src/lib/types.ts:3>)
- [Identity-provider selection](</Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/clusteer-unified/packages/ui/src/lib/kyc-provider.ts:316>)
- [Sample request link](</Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/clusteer-unified/apps/customer/src/app/(dashboard)/request/page.tsx:15>)
- [Hidden request navigation](</Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/clusteer-unified/apps/customer/src/components/app/sidebar.tsx:17>)
- [Mock order creation](</Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/clusteer-unified/apps/customer/src/components/trade/order-review.tsx:45>)
- [Orders error converted to empty success](</Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/clusteer-unified/apps/customer/src/app/api/order/route.ts:32>)
- [Stale “hold” metadata](</Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/clusteer-unified/apps/customer/src/app/layout.tsx:30>)

## 5. Copy and sales assessment

The original copy was more specific about the transaction but inconsistent about fees, timing, custody and supported networks. The new copy is more restrained and clearer about launch status, but becomes vague too often.

Repeated ideas such as “clarity,” “your next chapter,” “what comes next” and “the life you’re building” do not explain why someone should trust this product with a conversion. One emotional line can establish tone. Several sections saying similar things consume the space needed for answers.

### Recommended message hierarchy

1. **Job:** what can I convert, and where will it arrive?
2. **Economics:** what rate, fee and final amount will I see?
3. **Process:** what do I provide, what happens next, and how do I track it?
4. **Trust:** who handles settlement, what does Clusteer control, and where do I get help?
5. **Availability:** can I use it now, and what does joining the waitlist mean?

### Draft copy directions — subject to the product contract

| Placement | Suggested direction | Why |
|---|---|---|
| Hero headline | “Stablecoins to naira. Naira to stablecoins.” | States the two core jobs without implying a bank or holding wallet. |
| Supporting line | “Buy to your own wallet or sell to your Nigerian bank account. Review the quote before you continue.” | Names destinations and a concrete behaviour. Validate supported assets before naming them. |
| Product section | “See the rate. Check the fee. Know what arrives.” | Gives the demonstration a specific purpose. |
| Trust section | “Follow the money, from quote to settlement.” | Introduces an actual fund-flow explanation. |
| Waitlist | “Join the waitlist. We’ll email you when access opens.” | Sets an understandable expectation without manufactured urgency. |

The current brand line can remain as an expressive secondary statement if desired. It should not have to carry the entire product explanation.

Do not publish “best rate,” guaranteed minutes, zero spread, universal bank coverage, parallel verification, or licensed-partner assertions without a maintained source for the exact claim. The remedy is factual specificity, not adding generic disclaimers everywhere.

## 6. How the existing dashboards should fit

Keep the dashboard a usable financial workspace. Use it as the website’s evidence.

- Reuse the shared quote summary, destination information and settlement progress rather than drawing a separate fictional app.
- Show a recognisable customer frame briefly, then crop into the relevant task so text remains legible.
- Preserve the selected example amount, asset and destination as the story moves through its stages.
- Show a receipt as the destination of the story, with a clear demonstration label.
- Provide both buy and sell examples if both are in the approved launch scope.
- Keep admin screens out of the main consumer story. Operational views are relevant to an operations audience, not proof of what a customer can do.
- Do not revive the old total-balance concept when current custody architecture does not support it.

The current shared components are a good starting point. The issue is how they are composed and connected, not a need to discard the dashboard work.

## 7. Proposed Clusteer scroll storyboard

This is a proposed next implementation, not a description of work already completed.

| Beat | Visual | Information | Interaction |
|---|---|---|---|
| 1 — Arrival | Original Clusteer environment, carefully framed around a product focal point. | Concise two-way proposition and access status. | Normal page navigation; direct demo/skip link. |
| 2 — Approach | Environment yields to a recognisable customer workspace. | “Your quote, before you commit.” | Short sticky sequence on capable desktop layouts. |
| 3 — Quote | Real HTML quote panel stays readable as surrounding framing recedes. | Amount, rate, fee, final receive amount. | Manual buy/sell selection remains available. |
| 4 — Transfer | The same example moves to the relevant network/destination and progress view. | What the customer provides and what happens next. | Scroll may reveal explanation; it never performs a transaction. |
| 5 — Receipt | The same order resolves into a receipt and history context. | What the user can track and retain. | Exit the sticky sequence into normal content flow. |
| 6 — Decision support | Ordinary sections with purposeful reveals. | Fees, fund flow, supported routes, help and launch access. | Fully usable without animation. |

### Guardrails for the motion design

- Use one meaningful pinned sequence; do not pin every section.
- Keep real text and financial values in HTML. Generated assets should not contain baked-in dashboard numbers or unreadable interface lettering.
- Design still posters before motion, so the page makes sense before media loads.
- Make the mobile sequence shorter and independently composed. Manual controls must preserve all the information.
- Reduced motion should show stable ordered content and manual state changes; do not require scrubbing to discover the product.
- A failed video should reveal the poster and product content, not a blank or permanently pinned region.
- Do not steal scrolling, move keyboard focus on scroll, or automatically submit/confirm any action.
- Set a media budget after measuring target devices and connections. Lazy-load nonessential clips and avoid loading every product video at once.
- Verify resize, reverse scroll, anchor navigation and browser-back behaviour.
- Avoid rotating coins, arbitrary particles and endless decorative loops. Every effect should establish place, explain a step or confirm an interaction.

## 8. Prioritized findings

**Count:** 0 P0, 6 P1, 5 P2, 1 P3. Priorities describe the inspected website/product experience. No untested WCAG violation is asserted.

| ID | Priority / category | Finding and evidence | User impact | Recommended action |
|---|---|---|---|---|
| F01 | P1 · Integrity | Product contract conflicts across FAQ, Help, metadata, homepage and parked wallet code. | Users can form the wrong expectation about custody, supported assets and what Clusteer does. | Reconcile scope and availability in one maintained content contract; apply it to all public surfaces. `$impeccable clarify` |
| F02 | P1 · Integrity | Flat/no-markup copy conflicts with rate adjustments in the exchange-rate route. | Price expectations may be wrong before a user begins. | Trace the actual quote source and publish the approved rate/fee explanation. `$impeccable clarify` |
| F03 | P1 · Integrity | Header removes both core product routes and most company/resources hierarchy. | Visitors have difficulty discovering the full proposition and decision support. | Restore useful hierarchy with planned/live distinctions. `$impeccable shape` |
| F04 | P1 · Theming | /buy and other retained pages use the old visual language under the new header; revamp CSS mixes literals with shared tokens. | The website feels like multiple products and becomes harder to maintain. | Complete shared semantic tokens and route-family migration. `$impeccable colorize`, `$impeccable layout` |
| F05 | P1 · Integrity | Payment-request marketing outpaces the sample UI and intentionally hidden navigation; live-rate links can lead to placeholders. | Visitors encounter implied capabilities without a verified usable path. | Audit every CTA destination and label unfinished features accurately. `$impeccable harden` |
| F06 | P1 · Integrity | Orders API reports successful empty data when the backend fails. | A user may believe their order history is empty during an outage. | Preserve failure status and provide retry/recovery states. `$impeccable harden` |
| F07 | P2 · Integrity / motion | Static hero has no scroll connection to the interface. | The requested Mercury-inspired experience is missing its defining narrative. | Implement the bounded storyboard above after content reconciliation. `$impeccable animate` |
| F08 | P2 · Integrity | Single preview is detached from the full customer workspace; /design-preview is development-only. | Visitors see limited evidence of the actual experience. | Compose a clearly labelled public demonstration from the shared components. `$impeccable shape` |
| F09 | P2 · Integrity | New design principles replace much of the old trust content without a substantive fund-flow explanation. | The page leaves settlement and support objections unanswered. | Add accurate fund-flow, fee and support sections; use real proof when available. `$impeccable clarify` |
| F10 | P2 · Integrity / copy | Several sections repeat abstract clarity/life/chapter language. | The page gets longer without making the decision easier. | Give each section a distinct question to answer; remove repetition. `$impeccable distill` |
| F11 | P2 · Responsive / motion | No equivalent desktop/mobile scroll composition or motion timing system exists; current reduced-motion handling simply disables transitions. | A future animated pass risks inconsistent or incomplete experiences across inputs and preferences. | Design responsive and reduced-motion alternatives before adding media. Current static content remains available. `$impeccable adapt` |
| F12 | P3 · Visual polish | Asset family is limited; decorative Unicode marks and mixed type treatment do not yet establish a distinctive system. | The new identity feels less complete than the reference. | Art-direct a coherent set of product-led assets and refine type hierarchy. `$impeccable polish` |

### Key implementation locations

- [New header](</Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/clusteer-unified/packages/ui/src/components/app/site-header.tsx:7>)
- [Header positioning](</Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/clusteer-unified/packages/ui/src/revamp.css:99>)
- [Homepage](</Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/clusteer-unified/apps/customer/src/app/page.tsx:61>)
- [Preview and example rates](</Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/clusteer-unified/packages/ui/src/components/brand/conversion-preview.tsx:5>)
- [Preview entrance animation](</Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/clusteer-unified/packages/ui/src/revamp.css:385>)
- [Reduced-motion handling](</Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/clusteer-unified/packages/ui/src/revamp.css:1612>)
- [Buy page and fee language](</Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/clusteer-unified/apps/customer/src/app/(marketing)/buy/page.tsx:169>)
- [Footer](</Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/clusteer-unified/packages/ui/src/components/app/footer.tsx>)

## 9. Provisional technical health score

These are inspection ratings for the new public surfaces and their integration. They are **not measured performance results, WCAG certification, or a score for every repository module**.

| Dimension | Score | Basis and limitation |
|---|---:|---|
| Accessibility | 3/4 provisional | Skip link, labelled fields, semantic tab roles, keyboard tab navigation code and reduced-motion handling exist. Full assistive-technology and contrast verification remains outstanding. |
| Performance | 3/4 provisional | Current implementation is relatively simple, uses an image-based hero and does not run a heavy scroll scene. No network/device benchmark was performed; future media changes need new measurement. |
| Responsive design | 3/4 provisional | Breakpoint-specific layout and navigation exist. Exhaustive zoom, touch-target and device verification remains outstanding. |
| Theming | 2/4 | Shared tokens exist, but new literals and retained old page styles create verified inconsistency. |
| Implementation integrity | 1/4 | Repeated verified scope/content contradictions, removed discovery paths and cross-page drift. |
| **Total** | **12/20** | **Acceptable foundation; significant work needed. Provisional, not a release gate.** |

The most consequential problems here are product integrity and completeness. More animation would not by itself improve those dimensions.

## 10. What to preserve

- The original Clusteer landscape is a useful identity asset.
- The quieter palette and improved spacing are a sound direction.
- Explicit launch status and illustrative-rate labels improve honesty.
- The preview uses labelled controls, semantic tabs and keyboard handling.
- Shared quote/progress components can connect marketing and the customer workspace.
- Development-only preview isolation avoids treating fixture data as real customer activity.
- The legal/support/status destinations retained in the footer are worth keeping.

## 11. Delivery sequence and acceptance criteria

| Phase | Owner discipline | Concrete deliverable | Acceptance condition |
|---|---|---|---|
| 1 — Product contract | Product + engineering + copy | One matrix for routes, assets/networks, custody/fund flow, fees, limits, timing and launch status. | Homepage, FAQ, Help, metadata and product routes no longer contradict it. Unverified claims are explicitly marked for resolution. |
| 2 — Structure | Product design + copy | Navigation, route map and section-by-section content plan. | Both buy/sell jobs are discoverable; every CTA leads to a useful and accurately labelled destination. |
| 3 — Website system | Design + frontend | Shared type, colour, spacing, button, menu and page templates across public routes. | Homepage-to-Buy/Sell/About/Help/early-access transitions feel like one site on desktop and mobile. |
| 4 — Product story | Motion + frontend + asset production | Storyboard, static compositions, media and actual shared UI integration. | The example remains coherent from quote through receipt; all content remains accessible without motion/media. |
| 5 — Verification | Frontend + QA | Keyboard, reduced motion, responsive, loading/error and measured media-performance checks. | No scroll traps, blank media states, false order emptiness or misleading demo behaviour; documented results before release. |
| 6 — Finish | Design + copy | Final hierarchy, alignment, wording and interaction polish. | No redundant sections, stray old styles or unsupported promises. |

Recommended Impeccable sequence: **clarify → shape → colorize/layout → harden → adapt → animate → audit → polish**. Run these individually or together; repeat the audit after fixes. This report does not execute those changes.

## Reference index

- [Mercury homepage: visual, navigation and scroll reference](https://mercury.com/)
- [Mercury payments: product explanation and decision support](https://mercury.com/business-payments)
- [Mercury pricing](https://mercury.com/pricing)
- [Mercury security](https://mercury.com/security)
- [Clusteer production](https://clusteer.com)
- [Local Clusteer homepage](http://localhost:3000/)
- [Existing design handoff](</Users/saintlammy/Documents/Clusteer/Website/Clusteer App/clusteer-app/clusteer-unified/design-plans/mercury-revamp-handoff.md>)

Mercury observations describe the site inspected on the audit date. Recommendations are original design judgements for Clusteer; they do not imply access to Mercury’s private design files, analytics or implementation repository.
