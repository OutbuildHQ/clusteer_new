# Clusteer brand illustration family

Implemented locally on `codex/mercury-inspired-design-revamp`.

## Files
- Generated sculpture: `apps/customer/public/images/brand/clusteer-conversion-sculpture.webp` (1200 × 800, 25,396 bytes).
- Product illustrations and playback: `packages/ui/src/components/brand/brand-assets.tsx`.
- Responsive composition and motion: `packages/ui/src/brand-assets.css`.
- Placement: homepage, the existing `#trust` section.

## Source and production
Original sculpture generated using the built-in image generation tool. Original PNG retained in `/Users/saintlammy/.codex/generated_images/01a0a0a6-3140-7fe0-bd15-6487b00fabf3/exec-8fa24b01-c5e6-4188-a8e2-6cd64acd15e1.png`. Exported as optimized WebP for the website. No Mercury artwork copied. Product text, icons, logo geometry and animations are rendered in code.

## Generation prompt
Use case: stylized-concept. Create one premium 3:2 horizontal editorial 3D brand illustration for Clusteer, a refined Nigerian stablecoin conversion fintech. No text, numbers, currency symbols or typography. A mathematically precise upright solid semicircular slab, curved edge on left and flat vertical edge facing right, deep forest-green satin ceramic, sits on a warm ivory seamless studio surface. To the right of its flat edge: exactly four small satin green spheres, three in a vertical column and a fourth further right level with the middle sphere, echoing Clusteer's existing logo geometry. The shape must be a solid HALF DISC, not an arch, ring, crescent, donut or full circle. Front three-quarter orthographic camera, subtle thickness and bevel, carefully separated parts, sculpture occupies central 60% of image with generous surrounding negative space. One of the four spheres has a muted light chartreuse finish, other spheres green. Soft broad light from upper left, realistic long soft contact shadows trailing right, tactility and refined quiet depth, warm offwhite background #f0eee6, forest #163b2f. High-end industrial product still life, Mercury-level restrained financial editorial art, absolutely no chrome, neon, glow, floating coins, extra shapes, plinth, UI cards, watermark or logos other than the geometry described.

## Verification
- Customer production build passed.
- Existing 33 design tests passed; two new playback/reduced-motion tests passed.
- Manual design detector: no findings on the new component and homepage.
- Browser inspected at desktop, 390px and 320px. Fixed destination/payout overlap and small-screen aspect-ratio overflow.
- Pause/play state verified in the browser; offscreen and reduced-motion behaviour covered by targeted tests.
- Not deployed or pushed.
