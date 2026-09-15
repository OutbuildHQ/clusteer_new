# Mercury-inspired local design revamp

Branch: `codex/mercury-inspired-design-revamp`
Date: 2026-09-14

## Review

- Homepage: http://localhost:3000/
- Waitlist: http://localhost:3000/early-access
- Customer, conversion and admin review: http://localhost:3000/design-preview

The review route is development-only and returns 404 in production. It uses isolated, illustrative fixtures and does not bypass account authentication.

## Delivered

An original cinematic estuary image anchors an editorial homepage. Forest ink, paper surfaces, lime actions, restrained typography and motion carry into the existing product. Homepage product demonstrations reuse the quote summary and settlement-progress components from the dashboard design.

Redesigned surfaces: homepage, early-access form, shared header/footer, customer overview, conversion flow, and admin wallet transaction detail. Shared colors and spacing also carry through the existing app shells. Other secondary marketing pages retain their existing composition.

The generated hero image is a fictional landscape produced with native image generation; it makes no claim to depict an actual place. The direction board is saved alongside this report.

## Behavior and scope

- The existing waitlist endpoint remains connected. Test submissions were mocked; no real email was submitted.
- Customer overview uses existing account, rate and order queries; fallback rates are identified and invented account statistics were removed.
- The existing conversion wizard and admin transaction-detail screen were already demonstrations. Their redesign explicitly labels simulated instructions, receipt, notes and status changes.
- Buy totals include fees consistently through entry, review and the example payment instructions; changing buy/sell resets the amount instead of reinterpreting NGN as USDT.
- No new payment backend or operational action was implemented.
- Authentication middleware and production hosting were not changed. No deployment or push was performed.

## Validation

Customer and admin production builds pass, including their TypeScript checks. Browser review covered desktop and 390-pixel mobile layouts, homepage navigation, quote updates, keyboard tab navigation, customer overview, full sell preview through receipt, and admin status/notes in light and dark themes. No horizontal overflow remained in the tested mobile conversion screens.

Production HTTP checks: homepage and waitlist 200; design-preview 404; dashboard redirects to login. The focused test suite covers quote arithmetic, amount validation, keyboard navigation, completed progress, waitlist success/error, and buy-budget consistency.

Existing environment warnings remain: local backend API keys are missing, some metadata lacks metadataBase, and Next reports the older middleware convention. Production build success does not establish live payment readiness.

## Follow-through

Review this direction locally before extending it to all secondary marketing pages and additional dashboard screens. Live payment integration and operational admin data require separate backend work and verification.
