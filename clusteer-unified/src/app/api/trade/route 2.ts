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
		const { side, amount, chain, privateKey } = body;

		// Validate input
		if (!side || !amount || !chain) {
			return NextResponse.json(
				{ status: false, message: "Missing required fields" },
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

		const tradeResponse = await fetch(`${blockchainEngineUrl}/api/v1/manual-trade/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-API-KEY": blockchainEngineApiKey,
			},
			body: JSON.stringify({
				user_id: authUser.id,
				chain: chain.toLowerCase(),
				private_key: privateKey,
				side: side.toLowerCase(),
				amount: parseFloat(amount),
			}),
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
