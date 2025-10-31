"use client";

import { cn, formatNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";

interface RealTimeRatesProps {
	transactionType?: "buy" | "sell";
}

export default function RealTimeRates({ transactionType = "buy" }: RealTimeRatesProps) {
	const { data, isLoading, refetch, isRefetching } = useQuery({
		queryKey: ["exchange-rate", "USDT", "NGN", transactionType],
		queryFn: async () => {
			const response = await fetch(`/api/system/exchange-rate?targetCurrency=NGN&amount=1&type=${transactionType}`);
			if (!response.ok) {
				throw new Error("Failed to fetch exchange rate");
			}
			const result = await response.json();
			return result;
		},
		refetchInterval: 60000, // Auto-refresh every 60 seconds
	});

	const buyRate = data?.buyRate || 0;
	const sellRate = data?.sellRate || 0;

	// Use appropriate rate based on transaction type
	const rate = transactionType === "buy" ? buyRate : sellRate;

	// Format rate with exactly 2 decimal places
	const formattedRate = rate.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	const handleRefresh = () => {
		refetch();
	};

	return (
		<div className="flex gap-x-4 sm:gap-x-6 lg:gap-x-12 justify-between items-center font-avenir-next">
			<div>
				<p className="text-sm sm:text-base font-medium text-[#414651] mb-2.5">
					Rates (Real-time update)
				</p>
				<span className="text-2xl font-bold">
					1 USDT = {isLoading ? "..." : `${formattedRate} NGN`}
				</span>
			</div>
			<button onClick={handleRefresh} disabled={isRefetching || isLoading}>
				<RefreshCw
					className={cn({
						"animate-spin": isRefetching || isLoading,
					})}
					strokeWidth={2}
					width={24}
					height={24}
				/>
			</button>
		</div>
	);
}
