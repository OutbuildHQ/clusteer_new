# Clusteer

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product Purpose

Clusteer connects stablecoins and Nigerian naira. The public acquisition journey covers buying stablecoins to an external wallet and selling to a Nigerian bank account. Launch-stage copy must not imply every asset/network route is available. The existing customer app supports buy/sell orders, verification and support; the admin app supports transaction operations.

## Users

The accepted design brief prioritizes Nigerian customers converting stablecoins into usable naira, and the staff supporting their transactions. Freelancers and people receiving global income are positioning hypotheses, not validated customer segments.

## Capabilities and Constraints

Public signup currently leads to an early-access waitlist. Preserve that launch state and the existing authentication and transaction protections. Marketing examples are illustrative and must not imply executable quotes. Fees, networks, timing, limits, custody and partner claims require approved operational facts; do not invent them. Existing account information must come from its API, with explicit unavailable and empty states.

## Brand Commitments

The user approved a Mercury-inspired local redesign on a separate branch: atmospheric imagery, restrained presentation, clear product demonstrations and quieter dashboards. Preserve the Clusteer name and mark; retain lime as a selective accent. Public website buttons are fully rounded; dashboard buttons retain the existing 10px shape. Work locally first; no deployment or push is part of this request.

## Evidence on Hand

Existing customer and admin routes, shared UI, APIs and the landing review at the workspace's design-plans/landing-page-review-2026-09-14.md. No verified testimonials or adoption statistics are supplied. Generated imagery is decorative, not documentary proof.

## Product Principles

- Make the amount, fees, destination and next action understandable.
- Keep marketing demonstrations and real transactions clearly distinguished.
- Share product components between demonstrations and operational screens.
- Preserve working workflows and give errors a useful recovery action.

## Current public content contract — 14 September 2026

The shared source is `packages/ui/src/lib/marketing-content.ts`. Access is invitation-only pending public launch. Custodial wallet operations are parked; do not promise stored Clusteer balances. Settlement partners process transfers. The website explains the conversion concept and separates demonstration from execution.

Do not publish a flat tariff, zero spread, guaranteed settlement time, universal bank coverage or a complete asset/network list until operationally verified. The rate endpoint and previous copy conflict. Keep the existing pricing implementation intact; treat the 0.75% demo fee and ₦1,450 example rate as illustrations only. Payment requests, mobile, alerts and market views remain explicitly in development. A public demo has no auth bypass, API calls or transaction submission.

## User-directed refinements — current pass

The user explicitly removed the requirement for visible demo/illustration labels and asked for realistic names in the public product walkthrough. The walkthrough remains an inert presentation with local state; it does not gain transaction capabilities. Use existing fixture names and masked destinations, without implying a customer endorsement. Do not require testimonials or partner names for this pre-launch surface. Retain the disclaimer currently published on clusteer.com, as requested.

Verified transaction-channel scope: the current buy/sell interface and trade API accept TRC20, BEP20 and ERC20. The backend seeds SOL among other channels and the older wallet engine contains Solana support, but that alone does not expose Solana in the current trade flow. Website availability copy follows the current transaction path. Current buy/sell asset selector offers USDT; USDC remains configured elsewhere in the product.

The user explicitly requested USDC in the website. Its logo appears beside USDT, separately from the network logos, and both currencies can be selected in the public walkthrough. This presentation change does not expand the operational dashboard/API asset selector. USDC walkthrough transfer instructions use Ethereum (ERC-20).

Settlement timing is callback-driven. Existing copy mentions 1–15 minute network confirmation, 1–5 minute bank payout and other inconsistent estimates. No measured end-to-end service guarantee was verified in this pass. Public copy explains confirmation then payout rather than inventing a deadline.
