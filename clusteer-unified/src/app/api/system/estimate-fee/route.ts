import { NextRequest, NextResponse } from "next/server";
import { djangoFetch } from "@/lib/api-helpers";

const VALID_CHAINS = ["tron", "bsc", "ethereum", "solana"];

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const chain = searchParams.get("chain");
		const amount = searchParams.get("amount");

		if (!chain || !amount) {
			return NextResponse.json(
				{ status: false, message: "Missing required query params: chain, amount" },
				{ status: 400 }
			);
		}

		if (!VALID_CHAINS.includes(chain.toLowerCase())) {
			return NextResponse.json(
				{ status: false, message: `Invalid chain. Must be one of: ${VALID_CHAINS.join(", ")}` },
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

		// Django's estimate-fee endpoint uses POST (accepts body params for chain + amount)
		const response = await djangoFetch("/estimate-fee/", {
			method: "POST",
			body: JSON.stringify({
				chain: chain.toLowerCase(),
				amount: parsedAmount,
			}),
		});

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json(
				{ status: false, message: data.error || "Fee estimation failed" },
				{ status: response.status }
			);
		}

		return NextResponse.json({
			status: true,
			data,
		});
	} catch (error) {
		console.error("Fee estimation error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
