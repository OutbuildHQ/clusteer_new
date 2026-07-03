"use client";

import { useMarketingRate } from "@/hooks/use-marketing-rate";

/** Replaces the big ₦ rate number + caption pair on buy/page.tsx's "Live rate" card. */
export function RateValue({ type, fallback }: { type: "buy" | "sell"; fallback: number }) {
	const { rate, isLive } = useMarketingRate(type);
	const display = rate ? Math.round(rate).toLocaleString() : fallback.toLocaleString();

	return (
		<>
			<div className="f-mono text-[40px] font-bold tracking-[-1px] leading-none">₦{display}</div>
			<div className="text-[13px] text-[rgba(244,241,234,0.6)] mt-[6px]">
				{isLive ? "per USDT · updates every few seconds" : "per USDT · illustrative, live rate shows in the app"}
			</div>
		</>
	);
}
