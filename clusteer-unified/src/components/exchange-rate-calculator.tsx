"use client";

import { useState, useEffect } from "react";
import { ArrowDownUp, TrendingUp } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

interface ExchangeRate {
	rate: number;
	timestamp: string;
}

const CURRENCIES = [
	{ code: "USD", symbol: "$", flag: "🇺🇸" },
	{ code: "NGN", symbol: "₦", flag: "🇳🇬" },
	{ code: "USDT", symbol: "$", flag: "💲" },
	{ code: "USDC", symbol: "$", flag: "💵" },
];

const STABLE_COINS = ["USD", "USDT", "USDC"];

export default function ExchangeRateCalculator() {
	const [fromCurrency, setFromCurrency] = useState("USD");
	const [toCurrency, setToCurrency] = useState("NGN");
	const [amount, setAmount] = useState(1);

	// Auto-correct invalid currency pairs
	useEffect(() => {
		const isFromStable = STABLE_COINS.includes(fromCurrency);
		const isToStable = STABLE_COINS.includes(toCurrency);

		// If both are stablecoins or neither is NGN, auto-correct
		if (isFromStable && isToStable) {
			// Both are stablecoins, change toCurrency to NGN
			setToCurrency("NGN");
		} else if (fromCurrency === "NGN" && toCurrency === "NGN") {
			// Both are NGN, change toCurrency to a stablecoin
			setToCurrency("USD");
		}
	}, [fromCurrency, toCurrency]);

	// Fetch exchange rate
	const { data: rateData, isLoading } = useQuery({
		queryKey: ["exchange-rate", fromCurrency, toCurrency],
		queryFn: async () => {
			// Only allow conversions between stablecoins and NGN
			// Stablecoins can only convert to NGN, NGN can only convert to stablecoins
			const isValidConversion =
				(STABLE_COINS.includes(fromCurrency) && toCurrency === "NGN") ||
				(fromCurrency === "NGN" && STABLE_COINS.includes(toCurrency));

			if (!isValidConversion) {
				throw new Error("Invalid conversion pair");
			}

			// For stablecoin to NGN conversion
			if (toCurrency === "NGN") {
				const response = await fetch(
					`/api/system/exchange-rate?targetCurrency=NGN&amount=1`
				);
				if (!response.ok) {
					throw new Error("Failed to fetch exchange rate");
				}
				const result = await response.json();
				return {
					rate: result.rate,
					timestamp: new Date().toISOString(),
				};
			}

			// For NGN to stablecoin conversion
			if (fromCurrency === "NGN") {
				const response = await fetch(
					`/api/system/exchange-rate?targetCurrency=NGN&amount=1`
				);
				if (!response.ok) {
					throw new Error("Failed to fetch exchange rate");
				}
				const result = await response.json();
				return {
					rate: 1 / result.rate,
					timestamp: new Date().toISOString(),
				};
			}

			// Fallback
			return { rate: 0, timestamp: new Date().toISOString() };
		},
		refetchInterval: 60000, // Refetch every minute
		enabled: fromCurrency !== toCurrency,
	});

	const exchangeRate = rateData?.rate || 0;
	const convertedAmount = amount * exchangeRate;

	const handleSwapCurrencies = () => {
		setFromCurrency(toCurrency);
		setToCurrency(fromCurrency);
	};

	const fromCurrencyData = CURRENCIES.find((c) => c.code === fromCurrency);
	const toCurrencyData = CURRENCIES.find((c) => c.code === toCurrency);

	return (
		<div className="bg-white rounded-2xl border border-[#E9EAEB] p-6">
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-xl font-bold text-[#0D0D0D]">
					Transfer calculator
				</h3>
				<div className="flex items-center gap-2 text-sm text-[#667085]">
					<TrendingUp className="w-4 h-4" />
					<span>Live rate</span>
				</div>
			</div>

			{/* Exchange Rate Display */}
			<div className="mb-6 p-4 bg-[#F9FAFB] rounded-xl">
				<p className="text-lg font-semibold text-[#0D0D0D]">
					1 {fromCurrency} = {formatNumber(exchangeRate)} {toCurrency}
				</p>
				{isLoading && (
					<p className="text-xs text-[#667085] mt-1">Updating rate...</p>
				)}
			</div>

			{/* Rate Chart Placeholder */}
			<div className="mb-6 h-24 bg-[#F9FAFB] rounded-xl flex items-center justify-center relative overflow-hidden">
				{/* Simple visual line chart effect */}
				<svg
					className="w-full h-full opacity-20"
					viewBox="0 0 400 100"
					preserveAspectRatio="none"
				>
					<path
						d="M 0,80 L 50,60 L 100,70 L 150,40 L 200,50 L 250,30 L 300,45 L 350,35 L 400,40"
						stroke="currentColor"
						strokeWidth="2"
						fill="none"
						className="text-dark-green"
					/>
				</svg>
				<div className="absolute inset-0 flex items-center justify-center">
					<p className="text-xs text-[#667085]">Historical rate trend</p>
				</div>
			</div>

			{/* Currency Converter */}
			<div className="space-y-3">
				{/* From Currency */}
				<div className="flex items-center gap-3">
					<input
						type="number"
						value={amount}
						onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
						className="flex-1 px-4 py-3 border border-[#E9EAEB] rounded-xl font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-dark-green"
						min="0"
						step="0.01"
					/>
					<select
						value={fromCurrency}
						onChange={(e) => setFromCurrency(e.target.value)}
						className="px-4 py-3 border border-[#E9EAEB] rounded-xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-dark-green min-w-[120px]"
					>
						{CURRENCIES.map((currency) => (
							<option key={currency.code} value={currency.code}>
								{currency.flag} {currency.code}
							</option>
						))}
					</select>
				</div>

				{/* Swap Button */}
				<div className="flex justify-center">
					<button
						onClick={handleSwapCurrencies}
						className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors"
						aria-label="Swap currencies"
					>
						<ArrowDownUp className="w-5 h-5 text-[#667085]" />
					</button>
				</div>

				{/* To Currency */}
				<div className="flex items-center gap-3">
					<div className="flex-1 px-4 py-3 border border-[#E9EAEB] rounded-xl bg-[#F9FAFB]">
						<p className="font-semibold text-lg text-[#0D0D0D]">
							{formatNumber(convertedAmount)}
						</p>
					</div>
					<select
						value={toCurrency}
						onChange={(e) => setToCurrency(e.target.value)}
						className="px-4 py-3 border border-[#E9EAEB] rounded-xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-dark-green min-w-[120px]"
					>
						{CURRENCIES.map((currency) => (
							<option key={currency.code} value={currency.code}>
								{currency.flag} {currency.code}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Convert Button */}
			<Button className="w-full mt-6 bg-dark-green text-white hover:bg-opacity-90">
				Convert now
			</Button>
		</div>
	);
}
