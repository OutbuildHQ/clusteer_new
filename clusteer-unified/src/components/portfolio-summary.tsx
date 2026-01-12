"use client";

import { formatNumber } from "@/lib/utils";
import { useWallets } from "@/store/wallet";
import { useMemo, useState, useEffect } from "react";

export default function PortfolioSummary() {
	const wallets = useWallets() || [];
	const [usdToNgnRate, setUsdToNgnRate] = useState(1575); // Default fallback rate

	// Fetch live USD to NGN exchange rate
	useEffect(() => {
		const fetchExchangeRate = async () => {
			try {
				const response = await fetch("/api/system/exchange-rate?targetCurrency=NGN&amount=1");
				const data = await response.json();
				if (data.status && data.rate) {
					setUsdToNgnRate(data.rate);
				}
			} catch (error) {
				console.error("Failed to fetch exchange rate:", error);
				// Keep using fallback rate
			}
		};

		fetchExchangeRate();
		// Refresh rate every 5 minutes
		const interval = setInterval(fetchExchangeRate, 5 * 60 * 1000);
		return () => clearInterval(interval);
	}, []);

	// Calculate total balance in NGN
	const { totalNGN } = useMemo(() => {
		let ngnTotal = 0;

		wallets.forEach((wallet) => {
			if (wallet.currency === "NGN") {
				ngnTotal += wallet.balance || 0;
			} else if (wallet.currency === "USDT" || wallet.currency === "USDC") {
				// Use live exchange rate
				const balanceUSD = wallet.balance || 0;
				ngnTotal += balanceUSD * usdToNgnRate;
			}
		});

		return { totalNGN: ngnTotal };
	}, [wallets, usdToNgnRate]);

	return (
		<div className="mb-6">
			{/* Simple balance header */}
			<h1 className="text-5xl font-bold text-custom-black">
				{formatNumber(totalNGN)}
			</h1>
		</div>
	);
}
