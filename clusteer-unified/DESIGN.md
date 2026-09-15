# Clusteer — composed, connected, clear

## Approved direction

Mercury-inspired restraint and atmospheric art direction, with Clusteer's own identity. Public pages persuade through a quiet cinematic opening and a concrete product demonstration. Customer screens prioritize conversion and order progress. Admin screens prioritize scanning and exceptions. This direction was approved in the conversation before implementation; routine composition decisions are delegated to the agent.

## Visual system

- Paper: #F7F8F5. White working surfaces. Forest ink: #172B26. Secondary text: #59645F. Fine borders: #DCE2DC. Brand accent: #D4EF8A with forest text.
- Use the existing Inter body and Sora display fonts, with lighter display weights and controlled proportions. Tabular figures for financial comparisons. Monospace only for identifiers.
- Marketing headings up to 64px, mobile 44px; body 16–19px. Operational body 14–16px, headings 24–32px. Keep paragraphs compact and line lengths readable.
- Marketing max width 1200px; use expansive section spacing and flat editorial groupings. Dashboard content uses a clear primary workspace and secondary context column. Tables preserve useful density.
- Public website buttons: fully rounded (999px), as requested by the user. Dashboard controls retain 10px radius; working panels: 14px. Fine border or soft shadow, not both. No offset brutalist shadows or floating claim badges.
- Brand lime never substitutes for semantic success. Success, pending, error and information use labelled semantic tokens. Every control has visible focus and disabled/loading states.

## Imagery and motion

Original architectural waterfront workspace and Lagos fashion-studio photography extend the approved forest/paper world. Both are generated scenes. Per the user’s explicit direction, no illustration labels are displayed; provenance is kept in the asset notes. The homepage opens on an HTML laptop on the architectural desk: a native scroll camera push enlarges the image and product at different rates, then the chassis recedes into a readable conversion interface. The sequence is bounded to 240svh, with an always-available overview skip action, then the actual customer overview, rendered from the shared production components. The hero conversion action opens the visitor-controlled quote → transfer → receipt flow inside the same screen. Sidebar navigation, order details and account sections also stay inside the frame, with local Back history. Scroll never changes conversion state. Supporting imagery accompanies two concrete use scenarios; the hero owns the interactive quote so later sections do not repeat it.

Desktop motion is enabled only on viewports at least 1000px wide and 720px tall with no reduced-motion preference; other views use ordinary document flow and manual controls. Intro controls become inert at their visibility cutoff; focus moves to the named scene before its subtree is hidden in either scroll direction. The customer overview becomes interactive only at reading scale. In the embedded conversion flow, the amount input and computed result are adjacent, including on mobile; financial labels use 14px, with a compact desktop layout that reaches full size at the tested desktop viewports. The shared quote keeps its default source display in dashboards. UI transitions are short and respect reduced motion. No simulated activity labelled live. The live site’s existing legal footer is retained at the user’s request. Website assets use optimized WebP files; imagery is not a reason to add video or animation dependencies.

## Cross-surface contract

Shared quote summary and transaction progress primitives are used in marketing previews and operational flows. The user explicitly requested realistic presentation without demo or illustration labels. The public walkthrough uses existing fictional fixture identity Aisha Bello and masked destinations, stays local-state-only, and never creates an order or issues payment instructions. Authentication is never bypassed to show a dashboard. A development-only design preview may render isolated presentational components with labelled fixtures and no transaction submission capability.

## First implementation

Homepage and waitlist; shared product/company/resources navigation; Buy, Sell, About, Help/FAQ, Fees, Safety, Contact, Press, Careers and planned-feature pages; public isolated demonstration; existing customer overview and conversion styling, admin transaction detail, and a development-only review route. Preserve all API and authentication boundaries. Reuse the existing trade state machine. Default to accurate empty/unavailable states rather than invented account balances or verification.
# Desktop hero laptop proportions

The physical laptop screen in the animated hero retains a 16:10 aspect ratio, independent of the selected conversion stage. Its width fits the available viewport height, up to 1080px, so the enlarged surface remains readable. The sticky scene clips overflow without becoming an internally scrollable container. These rules are scoped to the animated desktop hero; mobile and standalone conversion pages retain their existing layouts.

## Actual customer layout in the hero

The hero uses CustomerOverview with the production SidebarFrame and TopBarFrame. Account/API wrappers stay in the real dashboard; the public showcase supplies local data, including a USDC order. Preserve this reuse rather than rebuilding a marketing approximation. Frame-specific density changes adapt the native layout to 16:10; the keyboard deck and trackpad scale with the screen.

The embedded screen supplies an optional navigation callback to shared dashboard controls. In this context controls render buttons and update local navigation state; production consumers retain normal application links. Conversion progress and local preferences persist across frame navigation. Mobile exposes the same sections through a compact selector.

## Landing-page refinement — 15 September 2026

The hero's Explore dashboard buttons reveal and focus the existing on-page workspace. Desktop uses the established camera approach; static/mobile views scroll directly to the screen. Standalone walkthrough links are labelled separately. The overview's first entry starts a sell quote; after exploration it says Return to conversion, preserving direction, amount, asset and stage. Production overview consumers retain their existing defaults.

At reading scale, overview amounts and primary labels are 13px and metadata/status labels are 11px. Transfer and receipt use a compact inline source amount while keeping the payout, rate, fee and next action visible. The 16:10 device remains stable. The close leads with Get the launch email and a concise public-access notification promise. Waitlist submissions lock the input while pending and identify the submitted address in confirmation.

The public walkthrough creates a local completion snapshot with a unique reference. Its receipt, embedded activity, history and order details share the same transaction data. Revisiting an unchanged receipt preserves the record; Start another conversion creates a distinct reference on completion. The overview shows three activity rows to preserve the device composition, while Orders retains the full list. These records remain presentation state and never submit an operational order. Buy summaries label the asset row Asset, reserving You receive for the amount.

Public content and its page-level main element reserve an 88px scroll margin for navigation and skip-link arrivals below the sticky header. Mobile trust details put short labels above full-width explanations; the diagram, section spacing and operator note use tighter spacing without shrinking body type. The buy story explains topping up an existing external wallet with naira. Featured desktop menu links name and lead to their own context: walkthrough, company introduction and help.

## Brand illustration family — 15 September 2026

The homepage assurance section now alternates a generated sculpture of the Clusteer semicircle/four-dot mark with crisp quote, progress and receipt illustrations. Four 3:2 compositions form a two-column desktop gallery; mobile uses a single column with taller product frames to preserve legibility. Compact wallet/bank and support motifs retain the fund-flow and support explanations below. The cinematic hero and embedded customer dashboard are unchanged.

Use forest, warm ivory and restrained chartreuse. Keep financial lettering in HTML rather than generated imagery. The illustration values share one inert USDC fixture, aligned with the existing walkthrough rate and fee. They do not submit transactions. Animations pause offscreen and through labelled 44px controls; reduced motion shows the completed static composition. Preserve the exact public footer disclaimer.

Illustration playback uses a shared 12-second duration for the outer button ring and artwork. Progress stages reveal at 15%, 30%, 45% and 60%, hold until 94%, then reset together. The duration ring freezes when paused or offscreen and is omitted for reduced motion.

## Product comprehension — 15 September 2026

The homepage hero explicitly states both outcomes: stablecoins to a bank account, or naira to an existing wallet. The conversion section retains its photography and accessible direction tabs, but now explains each route in three ordered steps, lists prerequisites and identity checks, and opens the walkthrough with the selected direction. On mobile the task comes before the supporting photograph.

The brand gallery captions explain custody, total cost, confirmation timing and recordkeeping. Keep settlement timing conditional; no guaranteed tariff or delivery deadline has been added. The homepage close distinguishes launch notifications from a trading account. The FAQ includes identity verification and uses “conversion” rather than “settlement” in its timing question.

Short-desktop hero spacing extends through 850px height so the laptop does not cover primary actions. After the initial scene layout is established, incoming section hashes are aligned again; navigation to How it works uses native anchors, including when its hash is already present.

## Hero conversion lift — 15 September 2026

The opening retains the complete customer dashboard, sidebar and 16:10 laptop. On desktop, the camera reaches the dashboard at 30% of the existing 240svh scene. A persistent Buy/Sell card appears inside the screen from 32%, comes forward through 70%, and remains interactive for the rest of the scene. The surrounding dashboard, bezel and keyboard fade out. The card has its own public website design, as explicitly requested: larger amount and result fields, asset/network icons, a pill direction switch and a fully rounded action. It shares the walkthrough's conversion state, validation and completion records, rather than the dashboard layout.

Scrolling changes presentation only. Direction, amount, asset, network and receipt survive reversal and local dashboard navigation. An actively focused converter stays at reading scale until focus leaves it. Hidden dashboard and in-flight card controls are inert; arrival actions move focus without scrolling the document unexpectedly. The normal page scroll continues below the scene. Smaller screens and reduced motion use explicit dashboard/conversion controls and ordinary document flow. Switching between these modes preserves an open converter, and ordinary mobile viewport resizes do not dismiss it.
