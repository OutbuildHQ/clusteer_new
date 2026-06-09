"use client";

import { useQuery } from "@tanstack/react-query";
import { AssetLogo } from "@/components/primitives/asset-logo";

async function fetchLiveRates() {
	const res = await fetch("/api/system/exchange-rate?targetCurrency=NGN&amount=1&type=buy");
	if (!res.ok) throw new Error("Failed to fetch rates");
	return res.json();
}

export function RateTicker() {
	const { data, isLoading } = useQuery({
		queryKey: ["ticker-rates"],
		queryFn: fetchLiveRates,
		refetchInterval: 30_000,
		staleTime: 10_000,
	});

	const buyRate = data?.buyRate ? Math.round(data.buyRate) : null;
	const sellRate = data?.sellRate ? Math.round(data.sellRate) : null;
	const loading = isLoading || !buyRate;

	return (
		<div id="rates" className="sticky top-16 z-40 border-b border-border bg-custom-black text-light-green">
			<div className="mx-auto max-w-6xl flex items-center justify-between px-3 sm:px-6 h-9 sm:h-10">
				<div className="flex items-center gap-3 sm:gap-8 text-[11px] sm:text-sm font-mono overflow-x-auto no-scrollbar">
					{/* USDT */}
					<div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
						<AssetLogo symbol="USDT" size="sm" />
						<span className="font-semibold hidden sm:inline">USDT/NGN</span>
						<span className="font-semibold sm:hidden">USDT</span>
						{loading ? (
							<span className="tabular-nums text-light-green/50">---</span>
						) : (
							<span className="tabular-nums">₦{buyRate.toLocaleString()}</span>
						)}
					</div>
					{/* USDC */}
					<div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
						<AssetLogo symbol="USDC" size="sm" />
						<span className="font-semibold hidden sm:inline">USDC/NGN</span>
						<span className="font-semibold sm:hidden">USDC</span>
						{loading ? (
							<span className="tabular-nums text-light-green/50">---</span>
						) : (
							<span className="tabular-nums">₦{(buyRate - 2).toLocaleString()}</span>
						)}
					</div>
					{/* Spread — desktop only */}
					{sellRate && buyRate && (
						<div className="hidden md:flex items-center gap-2 shrink-0 text-[10px] text-light-green/50">
							Spread: ₦{(sellRate - buyRate).toLocaleString()}
						</div>
					)}
				</div>
				<div className="flex items-center gap-1.5 text-[10px] text-light-green/40 shrink-0 ml-2 sm:ml-4">
					<span className="size-1.5 rounded-full bg-light-green animate-pulse" />
					<span className="hidden sm:inline">Live</span>
				</div>
			</div>
		</div>
	);
}
