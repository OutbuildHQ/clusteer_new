"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import { Search } from "lucide-react";

// Mock market data - replace with real API
const mockMarkets = [
	{
		id: "bitcoin",
		name: "Bitcoin",
		symbol: "BTC",
		icon: "/assets/images/bitcoin.svg",
		price: 67234.52,
		change24h: 2.34,
		volume: 28500000000,
		marketCap: 1320000000000,
	},
	{
		id: "ethereum",
		name: "Ethereum",
		symbol: "ETH",
		icon: "/assets/images/ethereum.svg",
		price: 3456.78,
		change24h: -1.23,
		volume: 15200000000,
		marketCap: 415000000000,
	},
	{
		id: "usdt",
		name: "Tether",
		symbol: "USDT",
		icon: "/assets/images/tether.svg",
		price: 1.00,
		change24h: 0.01,
		volume: 35000000000,
		marketCap: 95000000000,
	},
	{
		id: "bnb",
		name: "BNB",
		symbol: "BNB",
		icon: "/assets/images/binance.svg",
		price: 312.45,
		change24h: 3.67,
		volume: 1200000000,
		marketCap: 48000000000,
	},
	{
		id: "solana",
		name: "Solana",
		symbol: "SOL",
		icon: "/assets/images/solana.svg",
		price: 145.23,
		change24h: 5.12,
		volume: 2500000000,
		marketCap: 62000000000,
	},
];

export default function Page() {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredMarkets = mockMarkets.filter(
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
				<h1 className="text-2xl lg:text-[32px] font-bold text-[#0D0D0D]">
					Markets
				</h1>
				<p className="text-sm lg:text-base text-[#667085] mt-1">
					Track cryptocurrency prices and market trends
				</p>
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

			<Card className="rounded-[20px] border-[#E9EAEB] overflow-hidden">
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
							{filteredMarkets.map((market, index) => (
								<tr
									key={market.id}
									className="border-b border-[#E9EAEB] hover:bg-[#FAFAFA] transition-colors cursor-pointer"
								>
									<td className="py-4 px-6 text-sm text-[#414651]">{index + 1}</td>
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
				</div>

				{filteredMarkets.length === 0 && (
					<div className="text-center py-12 text-[#667085]">
						No cryptocurrencies found matching your search.
					</div>
				)}
			</Card>
		</div>
	);
}
