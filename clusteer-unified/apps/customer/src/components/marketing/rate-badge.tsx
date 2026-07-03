"use client";

import { useMarketingRate } from "@/hooks/use-marketing-rate";

/** Renders inside the existing styled <span> wrapper on buy/page.tsx — just the dot + label. */
export function RateBadge({ type }: { type: "buy" | "sell" }) {
	const { isLive } = useMarketingRate(type);
	return (
		<>
			{isLive && <span className="live-dot w-[7px] h-[7px] rounded-full bg-[#9fe870]"></span>}
			{isLive ? "LIVE" : "SAMPLE"}
		</>
	);
}
