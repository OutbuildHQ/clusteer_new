import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, djangoFetch } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
	try {
		const auth = getAuthFromRequest(request);
		if (!auth) {
			return NextResponse.json(
				{ status: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { userId } = auth;

		// Ensure wallets exist (ignore errors — wallet might already exist)
		try {
			await djangoFetch("/wallet/create/", {
				method: "POST",
				body: JSON.stringify({ user_id: userId }),
			});
		} catch {
			// wallet might already exist
		}

		// Fetch user balances from blockchain engine
		let balancesData: any;
		try {
			const balancesResponse = await djangoFetch(`/user/${userId}/balance/`);

			if (!balancesResponse.ok) {
				if (balancesResponse.status === 404) {
					return NextResponse.json({ status: true, walletAssets: [] });
				}
				throw new Error(`Blockchain engine returned ${balancesResponse.status}`);
			}

			balancesData = await balancesResponse.json();
		} catch (error) {
			console.error("Wallet fetch error:", error);
			return NextResponse.json({
				status: true,
				walletAssets: [
					{ name: "USDT Wallet", type: "CRYPTO" as const, currency: "USDT" as const, address: "", balance: 0, addresses: [] },
					{ name: "USDC Wallet", type: "CRYPTO" as const, currency: "USDC" as const, address: "", balance: 0, addresses: [] },
					{ name: "NGN Wallet", type: "FIAT" as const, currency: "NGN" as const, address: "", balance: 0, addresses: [] },
				],
				message: "Blockchain engine temporarily unavailable. Showing wallets with zero balance.",
			});
		}

		// Try to fetch wallet details for addresses
		let walletDetails: any = null;
		try {
			const walletResponse = await djangoFetch(`/user/${userId}/wallets/`);
			if (walletResponse.ok) {
				walletDetails = await walletResponse.json();
			}
		} catch {
			// wallet details unavailable — addresses will be empty
		}

		// Build a map of chain -> address from wallet details
		const addressMap: Record<string, { chain: string; address: string }[]> = {};
		if (walletDetails?.wallets || walletDetails?.data) {
			const wallets = walletDetails.wallets || walletDetails.data || [];
			for (const w of wallets) {
				const chain = (w.chain || w.network || "").toLowerCase();
				const address = w.address || w.wallet_address || "";
				if (!chain || !address) continue;

				// Extract stablecoin from chain name (e.g., "sol_usdt" -> "usdt")
				const parts = chain.split("_");
				const stablecoin = parts[parts.length - 1];
				const chainName = parts.length > 1 ? parts[0] : chain;

				if (!addressMap[stablecoin]) addressMap[stablecoin] = [];
				addressMap[stablecoin].push({ chain: chainName, address });
			}
		}

		// Also check if balance response itself contains address data
		if (balancesData.wallets) {
			for (const w of balancesData.wallets) {
				const chain = (w.chain || w.network || "").toLowerCase();
				const address = w.address || w.wallet_address || "";
				if (!chain || !address) continue;

				const parts = chain.split("_");
				const stablecoin = parts[parts.length - 1];
				const chainName = parts.length > 1 ? parts[0] : chain;

				if (!addressMap[stablecoin]) addressMap[stablecoin] = [];
				// Avoid duplicates
				if (!addressMap[stablecoin].some((a) => a.chain === chainName)) {
					addressMap[stablecoin].push({ chain: chainName, address });
				}
			}
		}

		// Aggregate balances by stablecoin type across all networks
		const stablecoinBalances: Record<string, number> = {};

		Object.entries(balancesData.balances || {}).forEach(([chain, balance]) => {
			const balanceNum = parseFloat(balance as string) || 0;
			const parts = chain.toLowerCase().split("_");
			const stablecoin = parts[parts.length - 1];

			if (!stablecoinBalances[stablecoin]) {
				stablecoinBalances[stablecoin] = 0;
			}
			stablecoinBalances[stablecoin] += balanceNum;
		});

		// Transform aggregated balances to wallet assets with addresses
		const walletAssets = Object.entries(stablecoinBalances).map(([stablecoin, balance]) => {
			const currency = stablecoin.toUpperCase() as "NGN" | "USDT" | "USDC";
			const addresses = addressMap[stablecoin] || [];
			// Use the first available address as the primary address
			const primaryAddress = addresses.length > 0 ? addresses[0].address : "";

			return {
				name: `${currency} Wallet`,
				type: "CRYPTO" as const,
				currency,
				address: primaryAddress,
				balance,
				addresses,
			};
		});

		const finalWallets = walletAssets.length > 0 ? walletAssets : [
			{ name: "USDT Wallet", type: "CRYPTO" as const, currency: "USDT" as const, address: "", balance: 0, addresses: [] },
			{ name: "USDC Wallet", type: "CRYPTO" as const, currency: "USDC" as const, address: "", balance: 0, addresses: [] },
			{ name: "NGN Wallet", type: "FIAT" as const, currency: "NGN" as const, address: "", balance: 0, addresses: [] },
		];

		return NextResponse.json({
			status: true,
			walletAssets: finalWallets,
		});
	} catch (error) {
		console.error("Wallet fetch error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
