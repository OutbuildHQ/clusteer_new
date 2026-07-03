"use client";

import { useMarketingRate } from "@/hooks/use-marketing-rate";

/** "You receive" line on buy/page.tsx's order-ticket example — computed from the live buy rate. */
export function BuyReceiveAmount() {
	const { rate } = useMarketingRate("buy");
	const usdt = rate ? 500_000 / rate : 310.05;
	return <>{usdt.toFixed(2)} USDT</>;
}

/** "You receive" line on sell/page.tsx's sell-ticket example — computed from the live sell rate. */
export function SellReceiveAmount() {
	const { rate } = useMarketingRate("sell");
	const ngn = rate ? Math.round(310 * rate) : 499_000;
	return <>₦{ngn.toLocaleString()}</>;
}
