"use client";

import { formatNumber } from "@/lib/utils";
import { useWallets } from "@/store/wallet";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useMemo, useState, useEffect } from "react";

export default function PortfolioSummary() {
	const router = useRouter();
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
			{/* Simple balance header like Wise */}
			<div className="mb-6">
				<h1 className="text-5xl font-bold text-custom-black">
					{formatNumber(totalNGN)}
				</h1>
			</div>

			{/* Action buttons - matching Wise style */}
			<div className="flex items-center gap-3">
				<Button
					onClick={() => router.push("/send")}
					className="px-6 py-2 bg-[#9FE870] text-custom-black hover:bg-[#8DD659] font-medium rounded-lg transition-colors"
				>
					Send
				</Button>
				<Button
					onClick={() => router.push("/receive")}
					className="px-6 py-2 bg-[#E8F5E9] text-custom-black hover:bg-[#D0EBD6] font-medium rounded-lg transition-colors"
				>
					Add money
				</Button>
				<Button
					onClick={() => router.push("/request")}
					className="px-6 py-2 bg-[#E8F5E9] text-custom-black hover:bg-[#D0EBD6] font-medium rounded-lg transition-colors"
				>
					Request
				</Button>
			</div>
		</div>
	);
}
