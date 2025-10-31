import { NextRequest, NextResponse } from "next/server";

// Cache exchange rates for 5 minutes to avoid hitting API limits
let rateCache: {
	buyRate: number; // Rate when users BUY crypto (2% premium - better for users)
	sellRate: number; // Rate when users SELL crypto (2.5% premium - standard market rate)
	usdtToUsd: number;
	timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Clusteer premium strategy
const BUY_PREMIUM = 0.02; // 2% - Attractive rate for users buying USDT
const SELL_PREMIUM = 0.025; // 2.5% - Standard market rate for users selling USDT

async function fetchLiveRates() {
	// Check cache first
	if (rateCache && Date.now() - rateCache.timestamp < CACHE_DURATION) {
		return rateCache;
	}

	try {
		// Clusteer P2P rate calculation with dual premium strategy
		// Buy Rate (2%): Better rate when users BUY USDT - attracts customers
		// Sell Rate (2.5%): Standard rate when users SELL USDT - market competitive

		// Step 1: Fetch official USD/NGN rate from forex API
		const ngnResponse = await fetch("https://open.er-api.com/v6/latest/USD");
		const ngnData = await ngnResponse.json();
		const officialUsdToNgn = ngnData.rates?.NGN || 1420; // Official forex rate (fallback: ₦1,420)

		// Step 2: Fetch USDT/USD rate (typically 1:1, but can vary slightly)
		const cryptoResponse = await fetch(
			"https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd"
		);
		const cryptoData = await cryptoResponse.json();
		const usdtToUsd = cryptoData.tether?.usd || 1.0; // USDT is pegged to USD

		// Step 3: Calculate base rate
		const baseRate = usdtToUsd * officialUsdToNgn;

		// Step 4: Calculate separate buy and sell rates
		const buyRate = baseRate * (1 + BUY_PREMIUM); // 2% premium - competitive for buyers
		const sellRate = baseRate * (1 + SELL_PREMIUM); // 2.5% premium - standard market rate

		// Cache the results
		rateCache = {
			buyRate,
			sellRate,
			usdtToUsd,
			timestamp: Date.now(),
		};

		console.log("Clusteer P2P rates calculated:", {
			officialRate: officialUsdToNgn.toFixed(2),
			buyRate: buyRate.toFixed(2),
			sellRate: sellRate.toFixed(2),
			buyPremium: `${(BUY_PREMIUM * 100).toFixed(1)}%`,
			sellPremium: `${(SELL_PREMIUM * 100).toFixed(1)}%`,
			spread: `₦${(sellRate - buyRate).toFixed(2)}`,
		});

		return rateCache;
	} catch (error) {
		console.error("Failed to calculate rates:", error);
		// Return fallback rates
		return {
			buyRate: 1447.68, // 2% premium on ₦1,420
			sellRate: 1455.50, // 2.5% premium on ₦1,420
			usdtToUsd: 1,
			timestamp: Date.now(),
		};
	}
}

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const targetCurrency = searchParams.get("targetCurrency");
		const amount = parseFloat(searchParams.get("amount") || "1");
		const type = searchParams.get("type") || "buy"; // 'buy' or 'sell'

		if (!targetCurrency) {
			return NextResponse.json(
				{ status: false, message: "targetCurrency is required" },
				{ status: 400 }
			);
		}

		// Fetch live rates
		const rates = await fetchLiveRates();
		let rate = 1;

		if (targetCurrency === "NGN") {
			// USDT to NGN: Use appropriate rate based on transaction type
			// 'buy' = user buying USDT (platform selling) = lower rate (2%)
			// 'sell' = user selling USDT (platform buying) = higher rate (2.5%)
			rate = type === "buy" ? rates.buyRate : rates.sellRate;
		} else if (targetCurrency === "USDT" || targetCurrency === "USDC") {
			// NGN to USDT: Inverse of the rate
			const ngnRate = type === "buy" ? rates.buyRate : rates.sellRate;
			rate = 1 / ngnRate;
		} else if (targetCurrency === "USD") {
			// USDT to USD
			rate = rates.usdtToUsd;
		}

		return NextResponse.json({
			status: true,
			rate: rate,
			buyRate: rates.buyRate, // Always include both rates for reference
			sellRate: rates.sellRate,
			type: type,
			targetCurrency,
			amount,
			convertedAmount: amount * rate,
			timestamp: new Date().toISOString(),
			source: "live",
		});
	} catch (error) {
		console.error("Exchange rate error:", error);
		return NextResponse.json(
			{ status: false, message: "Failed to fetch exchange rate" },
			{ status: 500 }
		);
	}
}
