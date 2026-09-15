# Hero customer screen audit and implementation

## Findings

The earlier laptop contained a bespoke conversion illustration. Enlarging its frame to 16:10 exposed a large central void: a short marketing headline on the left and a small quote on the right. It lacked the customer's actual navigation, recent orders, account context and hierarchy. The CTA looked secondary, and network and recipient details appeared too late. The keyboard was a thin decorative strip whose geometry had not been adjusted with the screen.

The user directed the final implementation to use the actual customer dashboard layout.

## Result

The hero now renders `CustomerOverview`, the same component used by the authenticated dashboard page. Production `Sidebar` and the public frame share `SidebarFrame`; production `TopBar` and the public frame share `TopBarFrame`. The account-query wrappers remain in the authenticated application. The public showcase passes local presentation data directly to the pure views.

The screen includes the real dashboard navigation, welcome heading, conversion entry, three orders, pending/completed status, conversion rate and verification guidance. USDC appears in the Ethereum order. No sample/demo labels are added. All public overview and sidebar actions now stay inside the laptop. Conversion, orders and order details, history, billing, notifications, identity, referrals, settings and support use local frame navigation with a Back control; production defaults retain their existing routes. The public page uses a subordinate heading rather than introducing a second h1.

The 16:10 screen remains stable. Frame-scoped density rules fit the dashboard on smaller desktop screens; mobile retains the conversion entry and activity list. The base includes a keyboard deck and trackpad, and the starting position accommodates its depth. No new image assets were required.

The embedded public conversion also now groups amount, selected network and recipient separately from the quote summary, and uses an explicit primary action. Transfer details show the selected route; receipt records preserve the asset and network. USDC resolves to Ethereum, while USDT offers the three existing trade channels. These are public presentation controls, not operational API changes.

## Boundaries

No authentication bypass, account fetching, order creation or payment submission was introduced. The operational API asset type remains USDT; the overview's presentation type additionally accepts USDC. Existing production sidebar identity queries and topbar interactions remain in their original wrappers. This is a local branch change, not a deployment.

## Verification

- 25 tests passed across six suites, including rendering the shared dashboard without an account-query provider and preserving/resetting selected conversion networks.
- Customer TypeScript check and both customer/admin production builds passed.
- Design scan returned no findings; whitespace validation passed.
- Desktop opening, enlarged dashboard and linked conversion inspected. The keyboard deck stays within the 1280×720 opening composition. Mobile checked at 390px and 320px; at 320px the page width is 305px with no horizontal overflow.
- Local development server restarted after the production build and the working site verified again.
- Captures: `actual-dashboard-laptop.png`, `actual-dashboard-hero-desktop.png`, `actual-dashboard-hero-mobile.png`.

## In-frame navigation follow-up

Shared controls use an optional navigation callback and render buttons inside the showcase, preventing ordinary and modified clicks from opening application routes. Internal section history drives Back, active navigation, breadcrumbs, focus and scroll reset. Conversion progress and local settings persist when switching sections. Mobile uses a labelled section selector. Order filters, details, notification read state, preference saving and searchable help work locally.

The updated suite passes 27 tests across six suites. Desktop conversion → receipt → orders → USDC detail and Back were checked in the browser. Mobile section switching was checked at 390px with no horizontal overflow, no anchors inside the showcase and an unchanged homepage URL.

Both customer and admin production builds passed after the navigation changes. The local development server was restarted and the homepage loaded successfully. Whitespace validation also passed.
