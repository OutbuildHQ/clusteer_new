import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const token = request.cookies.get("auth_token")?.value;

		if (!token) {
			return NextResponse.json(
				{ status: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

		if (authError || !authUser) {
			return NextResponse.json(
				{ status: false, message: "Invalid token" },
				{ status: 401 }
			);
		}

		const body = await request.json();
		const { side, amount, chain, signedTransaction, walletAddress } = body;

		// Validate input
		if (!side || !amount || !chain) {
			return NextResponse.json(
				{ status: false, message: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Validate amount
		const parsedAmount = parseFloat(amount);
		if (isNaN(parsedAmount) || parsedAmount <= 0) {
			return NextResponse.json(
				{ status: false, message: "Amount must be a positive number" },
				{ status: 400 }
			);
		}

		if (parsedAmount > 1000000) {
			return NextResponse.json(
				{ status: false, message: "Amount exceeds maximum limit" },
				{ status: 400 }
			);
		}

		// Validate side
		if (!["buy", "sell"].includes(side.toLowerCase())) {
			return NextResponse.json(
				{ status: false, message: "Invalid side. Must be 'buy' or 'sell'" },
				{ status: 400 }
			);
		}

		// Validate chain
		const validChains = ["solana", "tron", "bsc", "ethereum"];
		if (!validChains.includes(chain.toLowerCase())) {
			return NextResponse.json(
				{ status: false, message: `Invalid chain. Must be one of: ${validChains.join(", ")}` },
				{ status: 400 }
			);
		}

		// SECURITY: For sell orders, require signed transaction (no private keys transmitted)
		// For buy orders, the backend handles the transaction since we're sending crypto to user
		if (side.toLowerCase() === "sell" && !signedTransaction) {
			return NextResponse.json(
				{ status: false, message: "Signed transaction required for sell orders" },
				{ status: 400 }
			);
		}

		if (side.toLowerCase() === "buy" && !walletAddress) {
			return NextResponse.json(
				{ status: false, message: "Wallet address required for buy orders" },
				{ status: 400 }
			);
		}

		// Call blockchain engine API
		const blockchainEngineUrl = process.env.BLOCKCHAIN_ENGINE_URL || "http://localhost:8000";
		const blockchainEngineApiKey = process.env.BLOCKCHAIN_ENGINE_API_KEY;

		if (!blockchainEngineApiKey) {
			console.error("BLOCKCHAIN_ENGINE_API_KEY not configured");
			return NextResponse.json(
				{ status: false, message: "Blockchain engine not configured" },
				{ status: 500 }
			);
		}

		// Prepare request payload based on trade type
		const tradePayload = {
			user_id: authUser.id,
			chain: chain.toLowerCase(),
			side: side.toLowerCase(),
			amount: parsedAmount,
			...(side.toLowerCase() === "sell"
				? { signed_transaction: signedTransaction } // Client-signed transaction for sells
				: { destination_address: walletAddress }), // Destination for buys
		};

		const tradeResponse = await fetch(`${blockchainEngineUrl}/api/v1/trade/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-API-KEY": blockchainEngineApiKey,
			},
			body: JSON.stringify(tradePayload),
		});

		const tradeData = await tradeResponse.json();

		if (!tradeResponse.ok) {
			return NextResponse.json(
				{
					status: false,
					message: tradeData.error || "Trade failed",
					details: tradeData,
				},
				{ status: tradeResponse.status }
			);
		}

		return NextResponse.json({
			status: true,
			message: `${side.charAt(0).toUpperCase() + side.slice(1)} order successful`,
			data: tradeData,
		});
	} catch (error) {
		console.error("Trade error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
