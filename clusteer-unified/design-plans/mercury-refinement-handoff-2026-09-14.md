# Clusteer refinement — 14 September 2026

Local branch: `codex/mercury-inspired-design-revamp`. No push or deployment. Existing unrelated changes preserved. This pass improves the homepage after the 7/10 critique; it is not a new score or a whole-product operational certification.

## What changed

- Original architectural waterfront image with a live HTML laptop foreground. A native scroll camera push enlarges scene and interface at different rates; the physical chassis recedes as the working interface becomes readable.
- The scroll region shrank from 310svh to 240svh. At a fixed viewport this reduces required sticky traversal by one third (210vh to 140vh). An overview skip remains available throughout. Small, short and reduced-motion views use normal flow.
- Direct headline: “Stablecoins to naira. And back again.” The product is understandable before the visitor scrolls.
- Editorial work scene and accessible two-direction quote replace the currency-symbol cards. Switching direction changes the fee treatment, destination labels and relevant product link using the shared QuoteSummary.
- Fund-flow copy now focuses on the destination and the order details Clusteer brings together. No price advantage, customer testimonial, speed claim or partner identity was invented.
- Intro focusability now ends at its zero-opacity threshold. Reverse scroll moves focus out of disappearing product/caption controls to the named scene without scrolling the document. The previous invisible-focus regression is covered by a new test.
- Caption placed below the interface; decorative bottom wrapper cannot intercept the full-demo link. Skip control retains contrast while the scene fades. Short desktop composition keeps primary CTAs above the laptop (24.4px measured gap at 1280×720, excluding chassis extension).
- Mobile headline fits in two lines at 390px. Demonstration disclosure increased from 8px to 10px. Public buttons retain 999px radii; no dashboard source or dashboard button styling was edited in this pass.

## Evidence

- 19 tests passed across five focused suites. New tests cover disappearing/reverse-scroll focus and keyboard switching of both quote directions, including totals and destinations.
- Customer and admin production builds passed. Existing configuration warnings remain (backend keys absent in local build environment, middleware convention, metadataBase); live transaction execution was not tested.
- Scoped Impeccable detector returned no findings. Git whitespace check passed.
- Parent browser inspection: 1280×800, 1280×720 and 390×844. At mobile width, no horizontal overflow; normal-flow fallback active. Reduced-motion change verified in the regression suite, not by changing the OS setting.
- Browser reverse-scroll test: after entering 250 USDT, scrolling back moved focus to the named scene; intro and product were inert with copy opacity zero. Sample amount reset to 100 afterwards.
- Browser hit test confirms the Open full demo link receives pointer targeting after the overlap fix.
- Independent finish reviewer examined source plus saved desktop/mobile captures. Its browser provider had no available browser, so intermediate-frame interaction checks were performed by the parent. It identified pointer overlap and the small mobile disclosure; both addressed.
- Hot-refresh hydration warnings occurred while component trees were being edited. Stable refreshed controls and associations were inspected; no claim of cross-device performance benchmarking is made.

## Artifacts

- `refinement-desktop.png`: opening composition at 1280×800.
- `refinement-product.png`: readable product arrival at 1280×800.
- `refinement-short-desktop.png`: compact opening at 1280×720.
- `refinement-mobile.png`: normal-flow mobile view at 390×844.
- `mercury-refinement-assets-2026-09-14.md`: exact generation prompts, original paths and optimized asset details.

Both optimized image files total 265,480 bytes before Next Image delivery transforms. No video, WebGL or animation dependency was added. This is photographic staging with HTML/CSS depth, not a rendered 3D video sequence.

## Remaining product evidence

Customer proof, operational conversion timing, final launch rates/fees and publishable partner/regulatory details still require real evidence. The page uses accurate launch-stage language and clearly labelled examples. The unchanged three-node fund-flow graphic remains an explanatory diagram rather than a second cinematic sequence.
