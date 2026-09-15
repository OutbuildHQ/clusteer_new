# Landing-page refinement

Implemented from the 15 September homepage critique on codex/mercury-inspired-design-revamp.

- Hero and scene-caption exploration buttons reveal the existing embedded dashboard, hand focus to its named region and preserve the URL. Reduced-motion/static layouts use immediate scrolling. Standalone walkthrough remains accessible through explicitly labelled links.
- Shared overview accepts an optional resume state. The showcase uses Return to conversion after first opening; buy/sell direction, amount, asset and stage remain mounted across local navigation. Operational overview defaults remain intact.
- Embedded overview primary text/amounts increased to 13px and supporting metadata/status to 11px. Spacing was adjusted rather than shrinking the physical screen.
- Embedded transfer/receipt source amount now uses a compact row. At 1280×720, overview, transfer and receipt fit the internal viewport without scrolling. The receipt action is fully visible. Buy/USDC flow inspected at 1024×768 and 1440×900.
- Closing message now leads with Get the launch email and a concise public-access notification promise. No new settlement, pricing, launch-date or partner claims.
- Waitlist input locks while pending, confirmation identifies the submitted address, and failure restores editing without losing the address. Tests use mocked requests; no real signup was submitted.

## Verification

31 tests passed across seven suites, including preserved buy/receipt navigation, static hero focus/scroll, pending signup and failure recovery. Customer TypeScript check passed. Targeted design scan returned zero findings; whitespace check passed. Mobile reviewed at 390px and 320px, without horizontal overflow. Browser viewport restored and temporary review tab closed.

Desktop evidence: landing-polish-transfer-2026-09-15.png. Local only, with no deployment or push.

Both customer and admin production builds passed after these changes.

## Receipt and closing-copy follow-up

Completed public conversions now create a shared local record with a unique reference. Receipt, recent activity, history, order details, network destination, amounts and fees agree. Revisiting the same receipt does not duplicate the record; Start another conversion creates a fresh reference on completion. The showcase overview is limited to three rows to preserve the device layout; operational overview defaults remain unchanged. Orders uses Open conversion to describe returning to the retained flow.

The buy summary's repeated You receive label is now Asset. The final call to action is shorter and no longer repeats the trust section.

Verified a completed 250 USDC buy through receipt, activity and details in the browser at 1280×720 and checked the longer reference and detail layout at 390px. All 33 design tests across seven suites passed, including shared completion data and duplicate prevention. Customer type checking and both production builds passed. Temporary viewport restored and inspection tab closed. Changes remain local.

## Mobile arrival and editorial follow-up

Implemented the four priorities from the 10:58 UTC critique. Public-content and page-level main scroll margins prevent the waitlist opening label from landing behind the sticky header. The scrolled-homepage header path was verified at 320px and 390px: arrival now has scrollY 0, label top 138px and header bottom 73px.

The mobile trust section now uses full-width explanations under short labels, concise copy and tighter diagram/section spacing. At 390px it measures 1514px rather than 1834px, approximately 17% shorter. Body type, support links, operator information and the legal footer remain intact. Desktop balance was visually checked at 1280×720.

The buy story now leads with Top up the wallet you already use and explicitly describes buying USDT or USDC with naira for an external wallet. Desktop menu featured links are contextual: Explore the walkthrough → /demo; Meet Clusteer → /about; Find an answer → /help.

All 33 design tests passed. Targeted design scan and whitespace check passed. Browser viewport restored and temporary inspection tab closed. No deployment or push.

Customer and admin production builds both passed after this follow-up.
