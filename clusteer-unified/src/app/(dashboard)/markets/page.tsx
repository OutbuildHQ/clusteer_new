"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Search, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/toast";

interface Market {
	id: string;
	rank: number;
	name: string;
	symbol: string;
	icon: string;
	price: number;
	change24h: number;
	volume: number;
	marketCap: number;
	high24h: number;
	low24h: number;
}

export default function Page() {
	const [searchQuery, setSearchQuery] = useState("");
	const [markets, setMarkets] = useState<Market[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

	const fetchMarkets = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch("/api/markets?limit=20");
			const data = await response.json();

			if (!data.status) {
				throw new Error(data.message || "Failed to fetch market data");
			}

			setMarkets(data.data);
			setLastUpdated(new Date());

			if (data.cached) {
				Toast.info("Showing cached market data");
			}
		} catch (err: any) {
			console.error("Error fetching markets:", err);
			setError(err.message || "Failed to load market data");
			Toast.error("Failed to load market data");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMarkets();

		// Auto-refresh every 5 minutes
		const interval = setInterval(fetchMarkets, 5 * 60 * 1000);

		return () => clearInterval(interval);
	}, []);

	const filteredMarkets = markets.filter(
		(market) =>
			market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			market.symbol.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(price);
	};

	const formatLargeNumber = (num: number) => {
		if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
		if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
		return formatPrice(num);
	};

	return (
		<div className="font-avenir-next pb-6 lg:pt-[50px]">
			<header className="mb-6">
				<div className="flex justify-between items-start">
					<div>
						<h1 className="text-2xl lg:text-[32px] font-bold text-[#0D0D0D]">
							Markets
						</h1>
						<p className="text-sm lg:text-base text-[#667085] mt-1">
							Track cryptocurrency prices and market trends
						</p>
						{lastUpdated && (
							<p className="text-xs text-[#98A2B3] mt-1">
								Last updated: {lastUpdated.toLocaleTimeString()}
							</p>
						)}
					</div>
					<Button
						onClick={fetchMarkets}
						disabled={loading}
						variant="outline"
						size="sm"
						className="gap-2"
					>
						{loading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<RefreshCw className="h-4 w-4" />
						)}
						Refresh
					</Button>
				</div>
			</header>

			<div className="mb-6">
				<div className="relative max-w-md">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
					<Input
						type="text"
						placeholder="Search cryptocurrencies..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 h-11 rounded-[12px] border-[#E9EAEB]"
					/>
				</div>
			</div>

			{error && (
				<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
					<p className="text-sm text-red-600">{error}</p>
				</div>
			)}

			<Card className="rounded-[20px] border-[#E9EAEB] overflow-hidden">
				{loading && markets.length === 0 ? (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="h-8 w-8 animate-spin text-[#667085]" />
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-[#FAFAFA] border-b border-[#E9EAEB]">
								<tr>
									<th className="text-left py-4 px-6 text-sm font-semibold text-[#667085]">
										#
									</th>
									<th className="text-left py-4 px-6 text-sm font-semibold text-[#667085]">
										Name
									</th>
									<th className="text-right py-4 px-6 text-sm font-semibold text-[#667085]">
										Price
									</th>
									<th className="text-right py-4 px-6 text-sm font-semibold text-[#667085]">
										24h Change
									</th>
									<th className="text-right py-4 px-6 text-sm font-semibold text-[#667085]">
										24h Volume
									</th>
									<th className="text-right py-4 px-6 text-sm font-semibold text-[#667085]">
										Market Cap
									</th>
								</tr>
							</thead>
							<tbody>
								{filteredMarkets.map((market) => (
									<tr
										key={market.id}
										className="border-b border-[#E9EAEB] hover:bg-[#FAFAFA] transition-colors cursor-pointer"
									>
										<td className="py-4 px-6 text-sm text-[#414651]">{market.rank}</td>
										<td className="py-4 px-6">
											<div className="flex items-center gap-3">
												<Image
													src={market.icon}
													alt={market.name}
													width={32}
													height={32}
													className="rounded-full"
												/>
												<div>
													<div className="font-semibold text-[#0D0D0D]">
														{market.name}
													</div>
													<div className="text-sm text-[#667085]">
														{market.symbol}
													</div>
												</div>
											</div>
										</td>
										<td className="py-4 px-6 text-right font-semibold text-[#0D0D0D]">
											{formatPrice(market.price)}
										</td>
										<td className="py-4 px-6 text-right">
											<span
												className={`font-semibold ${
													market.change24h >= 0
														? "text-green-600"
														: "text-red-600"
												}`}
											>
												{market.change24h >= 0 ? "+" : ""}
												{market.change24h.toFixed(2)}%
											</span>
										</td>
										<td className="py-4 px-6 text-right text-[#414651]">
											{formatLargeNumber(market.volume)}
										</td>
										<td className="py-4 px-6 text-right text-[#414651]">
											{formatLargeNumber(market.marketCap)}
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{!loading && filteredMarkets.length === 0 && markets.length > 0 && (
							<div className="text-center py-12 text-[#667085]">
								No cryptocurrencies found matching your search.
							</div>
						)}

						{!loading && markets.length === 0 && !error && (
							<div className="text-center py-12 text-[#667085]">
								No market data available. Please try refreshing.
							</div>
						)}
					</div>
				)}
			</Card>
		</div>
	);
}
