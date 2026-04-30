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
		<div className=" pb-6 lg:pt-[50px]">
			<header className="mb-6">
				<div className="flex justify-between items-start">
					<div>
						<h1 className="text-2xl lg:text-[32px] font-bold text-foreground">
							Markets
						</h1>
						<p className="text-sm lg:text-base text-muted-foreground mt-1">
							Track stablecoin rates and market trends
						</p>
						{lastUpdated && (
							<p className="text-xs text-muted-foreground mt-1">
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
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						type="text"
						placeholder="Search stablecoins..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 h-11 rounded-[12px] border-border"
					/>
				</div>
			</div>

			{error && (
				<div className="mb-6 p-4 bg-danger/10 border border-danger rounded-lg">
					<p className="text-sm text-danger">{error}</p>
				</div>
			)}

			<Card className="rounded-[20px] border-border overflow-hidden">
				{loading && markets.length === 0 ? (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-background border-b border-border">
								<tr>
									<th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">
										#
									</th>
									<th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">
										Name
									</th>
									<th className="text-right py-4 px-6 text-sm font-semibold text-muted-foreground">
										Price
									</th>
									<th className="text-right py-4 px-6 text-sm font-semibold text-muted-foreground">
										24h Change
									</th>
									<th className="text-right py-4 px-6 text-sm font-semibold text-muted-foreground">
										24h Volume
									</th>
									<th className="text-right py-4 px-6 text-sm font-semibold text-muted-foreground">
										Market Cap
									</th>
								</tr>
							</thead>
							<tbody>
								{filteredMarkets.map((market) => (
									<tr
										key={market.id}
										className="border-b border-border hover:bg-background transition-colors cursor-pointer"
									>
										<td className="py-4 px-6 text-sm text-muted-foreground">{market.rank}</td>
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
													<div className="font-semibold text-foreground">
														{market.name}
													</div>
													<div className="text-sm text-muted-foreground">
														{market.symbol}
													</div>
												</div>
											</div>
										</td>
										<td className="py-4 px-6 text-right font-semibold text-foreground">
											{formatPrice(market.price)}
										</td>
										<td className="py-4 px-6 text-right">
											<span
												className={`font-semibold ${
													market.change24h >= 0
														? "text-success"
														: "text-danger"
												}`}
											>
												{market.change24h >= 0 ? "+" : ""}
												{market.change24h.toFixed(2)}%
											</span>
										</td>
										<td className="py-4 px-6 text-right text-muted-foreground">
											{formatLargeNumber(market.volume)}
										</td>
										<td className="py-4 px-6 text-right text-muted-foreground">
											{formatLargeNumber(market.marketCap)}
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{!loading && filteredMarkets.length === 0 && markets.length > 0 && (
							<div className="text-center py-12 text-muted-foreground">
								No stablecoins found matching your search.
							</div>
						)}

						{!loading && markets.length === 0 && !error && (
							<div className="text-center py-12 text-muted-foreground">
								No market data available. Please try refreshing.
							</div>
						)}
					</div>
				)}
			</Card>
		</div>
	);
}
