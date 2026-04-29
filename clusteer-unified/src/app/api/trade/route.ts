import { NextRequest, NextResponse } from "next/server";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limiter";

/**
 * Helper to extract user ID from Firebase JWT (already verified by middleware)
 */
function getUserIdFromToken(token: string): string | null {
	try {
		const parts = token.split(".");
		if (parts.length !== 3) return null;
		const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
		return payload.user_id || payload.sub || null;
	} catch {
		return null;
	}
}

export async function POST(request: NextRequest) {
	try {
		const rateLimitResponse = rateLimit(request, RateLimitPresets.moderate);
		if (rateLimitResponse) {
			return rateLimitResponse;
		}

		const token = request.cookies.get("auth_token")?.value;

		if (!token) {
			return NextResponse.json(
				{ status: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const userId = getUserIdFromToken(token);
		if (!userId) {
			return NextResponse.json(
				{ status: false, message: "Invalid token" },
				{ status: 401 }
			);
		}

		let body;
		try {
			body = await request.json();
		} catch {
			return NextResponse.json(
				{ status: false, message: "Invalid request body" },
				{ status: 400 }
			);
		}

		const { side, amount, chain, signedTransaction, walletAddress } = body;

		// Validate input
		if (!side || !amount || !chain) {
			return NextResponse.json(
				{ status: false, message: "Missing required fields" },
				{ status: 400 }
			);
		}

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

		if (!["buy", "sell"].includes(side.toLowerCase())) {
			return NextResponse.json(
				{ status: false, message: "Invalid side. Must be 'buy' or 'sell'" },
				{ status: 400 }
			);
		}

		const validChains = ["solana", "tron", "bsc", "ethereum"];
		if (!validChains.includes(chain.toLowerCase())) {
			return NextResponse.json(
				{ status: false, message: `Invalid chain. Must be one of: ${validChains.join(", ")}` },
				{ status: 400 }
			);
		}

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

		const blockchainEngineUrl = process.env.BLOCKCHAIN_ENGINE_URL || "http://localhost:8000";
		const blockchainEngineApiKey = process.env.BLOCKCHAIN_ENGINE_API_KEY;

		if (!blockchainEngineApiKey) {
			return NextResponse.json(
				{ status: false, message: "Service temporarily unavailable" },
				{ status: 503 }
			);
		}

		const tradePayload = {
			user_id: userId,
			chain: chain.toLowerCase(),
			side: side.toLowerCase(),
			amount: parsedAmount,
			...(side.toLowerCase() === "sell"
				? { signed_transaction: signedTransaction }
				: { destination_address: walletAddress }),
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
