"use client";

import { useQuery } from "@tanstack/react-query";

interface ExchangeRateResponse {
	buyRate?: number;
	sellRate?: number;
	source?: "live" | "fallback";
}

/**
 * Shared live-rate fetch for marketing pages (buy/sell). Mirrors the
 * homepage's isLive/source pattern so "LIVE" only shows when the backend
 * actually reached the upstream forex/crypto APIs, not the hardcoded fallback.
 */
export function useMarketingRate(type: "buy" | "sell") {
	const { data, isError } = useQuery({
		queryKey: ["marketing-rate", type],
		queryFn: async (): Promise<ExchangeRateResponse> => {
			const r = await fetch(`/api/system/exchange-rate?targetCurrency=NGN&amount=1&type=${type}`);
			return r.json();
		},
		refetchInterval: 30_000,
		staleTime: 10_000,
	});

	const rate = type === "buy" ? data?.buyRate : data?.sellRate;
	const isLive = !isError && !!rate && data?.source !== "fallback";

	return { rate, isLive };
}
