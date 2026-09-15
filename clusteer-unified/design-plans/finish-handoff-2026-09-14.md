# Website finishing pass

Implemented locally on `codex/mercury-inspired-design-revamp`; no push or deployment.

## Delivered

- USDT and USDC asset logos, separate from Tron, BNB Smart Chain and Ethereum network logos. Names are accessible and appear on hover/focus. Existing SVG artwork is reused.
- USDC selection throughout the public quote, transfer and receipt; Buy/Sell context preserved from product pages.
- More legible desktop walkthrough, stable focus without scroll jumps, invalid amounts represented as unavailable rather than zero payouts, and useful connection-error recovery.
- Lagos studio editorial asset, more concrete conversion copy, clearer fund-flow section, stronger hero text contrast and rounded public buttons.
- Removed visible demo/illustration/sample labels per explicit user direction. Existing fixture identity and masked destinations are used without adding transaction capabilities or endorsements.
- Footer disclaimer retained from the live website. No guaranteed settlement deadline or invented customer evidence added.

## Verification

- 23 tests passed across five design suites.
- Customer and admin production builds both passed. The earlier font-download build limitation is resolved.
- Latest CSS-only refinement visually checked after the build: mobile quote-link alignment and tooltip boundaries.
- Desktop 1280×720 and mobile down to 320×740 inspected. At 320px, all five logo tooltips remain inside the viewport; content width is 305px. A 1,000,000 USDC quote remains readable without horizontal overflow.
- USDC and Buy context verified in the browser. Tests cover currency persistence through transfer and receipt, invalid amounts and error recovery.
- Independent detector scan returned no findings. `git diff --check` passed.

## Evidence and boundaries

Current public network scope follows TRC20/BEP20/ERC20 in the trade interface and API. SOL exists elsewhere in the repository but is not exposed in that flow. USDC is configured in backend seed data; this change does not implement its operational trading support. Settlement documentation contains conflicting estimates, so public copy explains confirmation and payout stages without publishing a guarantee.

Fresh captures: `finish-hero.png`, `finish-demo-desktop.png`, `finish-demo-mobile.png`, `finish-logos-desktop.png`, `finish-logos-mobile.png`, `finish-editorial-desktop.png`. Older handoffs and critiques are historical rather than updated scores.

Generated asset provenance is recorded in `lagos-studio-asset.md`.
