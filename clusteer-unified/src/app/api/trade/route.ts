import { NextRequest, NextResponse } from "next/server";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limiter";
import { getAuthFromRequest, djangoFetch } from "@/lib/api-helpers";

const MAX_TRADE_AMOUNT = Number(process.env.MAX_TRADE_AMOUNT) || 1_000_000;

export async function POST(request: NextRequest) {
	try {
		const rateLimitResponse = rateLimit(request, RateLimitPresets.moderate);
		if (rateLimitResponse) {
			return rateLimitResponse;
		}

		const auth = getAuthFromRequest(request);
		if (!auth) {
			return NextResponse.json(
				{ status: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { userId } = auth;

		let body;
		try {
			body = await request.json();
		} catch {
			return NextResponse.json(
				{ status: false, message: "Invalid request body" },
				{ status: 400 }
			);
		}

		const { side, amount, chain } = body;

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

		if (parsedAmount > MAX_TRADE_AMOUNT) {
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

		const tradePayload = {
			user_id: userId,
			chain: chain.toLowerCase(),
			side: side.toLowerCase(),
			amount: parsedAmount,
		};

		const tradeResponse = await djangoFetch("/manual-trade/", {
			method: "POST",
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
