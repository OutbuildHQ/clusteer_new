import { getSupabaseUserWithRetry } from "@/lib/supabase-helpers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		// Get the auth token from cookies
		const token = request.cookies.get("auth_token")?.value;

		if (!token) {
			return NextResponse.json(
				{ status: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Get user from Supabase with retry logic
		const { user: authUser, error: authError, isNetworkError } = await getSupabaseUserWithRetry(token);

		if (authError || !authUser) {
			// Return 503 for network errors, 401 for auth errors
			if (isNetworkError) {
				console.error("Supabase network error:", authError);
				return NextResponse.json(
					{ status: false, message: "Authentication service temporarily unavailable" },
					{ status: 503 }
				);
			}

			return NextResponse.json(
				{ status: false, message: "Invalid or expired token" },
				{ status: 401 }
			);
		}

		// Get blockchain engine URL and API key
		const blockchainEngineUrl = process.env.BLOCKCHAIN_ENGINE_URL || "http://localhost:8000";
		const blockchainEngineApiKey = process.env.BLOCKCHAIN_ENGINE_API_KEY;

		if (!blockchainEngineApiKey) {
			console.error("BLOCKCHAIN_ENGINE_API_KEY not configured");
			return NextResponse.json(
				{ status: false, message: "Blockchain engine not configured" },
				{ status: 500 }
			);
		}

		// First, try to create wallets for the user if they don't exist
		try {
			await fetch(`${blockchainEngineUrl}/api/v1/wallet/create/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-API-KEY": blockchainEngineApiKey,
				},
				body: JSON.stringify({
					user_id: authUser.id,
				}),
			});
			// Ignore errors - wallet might already exist
		} catch (error) {
			console.log("Wallet creation attempt (might already exist):", error);
		}

		// Fetch user balances from blockchain engine
		let balancesResponse;
		try {
			balancesResponse = await fetch(`${blockchainEngineUrl}/api/v1/user/${authUser.id}/balance/`, {
				method: "GET",
				headers: {
					"X-API-KEY": blockchainEngineApiKey,
				},
			});

			if (!balancesResponse.ok) {
				// If user doesn't have wallets yet, return empty array
				if (balancesResponse.status === 404) {
					return NextResponse.json({
						status: true,
						walletAssets: [],
						pinSet: false,
					});
				}

				throw new Error(`Blockchain engine returned ${balancesResponse.status}`);
			}
		} catch (error) {
			console.log("Wallet fetch error:", error);
			// If blockchain engine is not available, return demo wallets with zero balance
			// This allows the app to function without the backend
			return NextResponse.json({
				status: true,
				walletAssets: [
					{
						name: "USDT Wallet",
						type: "CRYPTO" as const,
						currency: "USDT" as const,
						address: "",
						balance: 0,
					},
					{
						name: "USDC Wallet",
						type: "CRYPTO" as const,
						currency: "USDC" as const,
						address: "",
						balance: 0,
					},
					{
						name: "NGN Wallet",
						type: "FIAT" as const,
						currency: "NGN" as const,
						address: "",
						balance: 0,
					},
				],
				pinSet: false,
				message: "Blockchain engine temporarily unavailable. Showing wallets with zero balance.",
			});
		}

		const balancesData = await balancesResponse.json();
		console.log("Blockchain engine balances data:", balancesData);

		// Aggregate balances by stablecoin type across all networks
		const stablecoinBalances: Record<string, number> = {};

		Object.entries(balancesData.balances || {}).forEach(([chain, balance]) => {
			const balanceNum = parseFloat(balance as string) || 0;

			// Extract stablecoin type from chain name
			// e.g., "sol_usdt" -> "usdt", "tron_usdt" -> "usdt"
			const parts = chain.toLowerCase().split('_');
			const stablecoin = parts[parts.length - 1]; // Get last part (usdt, usdc, etc.)

			// Aggregate balance for this stablecoin
			if (!stablecoinBalances[stablecoin]) {
				stablecoinBalances[stablecoin] = 0;
			}
			stablecoinBalances[stablecoin] += balanceNum;

			console.log(`Chain: ${chain}, Stablecoin: ${stablecoin}, Balance: ${balanceNum}`);
		});

		// Transform aggregated balances to wallet assets
		const walletAssets = Object.entries(stablecoinBalances).map(([stablecoin, balance]) => {
			const currency = stablecoin.toUpperCase() as "NGN" | "USDT" | "USDC";

			return {
				name: `${currency} Wallet`,
				type: 'CRYPTO' as const,
				currency,
				address: '', // Address would need to be fetched separately if needed
				balance,
			};
		});

		// If no wallets found, return default wallets with zero balance
		const finalWallets = walletAssets.length > 0 ? walletAssets : [
			{
				name: "USDT Wallet",
				type: "CRYPTO" as const,
				currency: "USDT" as const,
				address: "",
				balance: 0,
			},
			{
				name: "USDC Wallet",
				type: "CRYPTO" as const,
				currency: "USDC" as const,
				address: "",
				balance: 0,
			},
			{
				name: "NGN Wallet",
				type: "FIAT" as const,
				currency: "NGN" as const,
				address: "",
				balance: 0,
			},
		];

		console.log("Aggregated wallet assets:", finalWallets);

		// Return wallets data in the expected format
		return NextResponse.json({
			status: true,
			walletAssets: finalWallets,
			pinSet: false,
		});
	} catch (error) {
		console.error("Wallet fetch error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
