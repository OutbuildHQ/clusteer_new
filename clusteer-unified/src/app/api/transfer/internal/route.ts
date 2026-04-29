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

		const { recipientUserId, asset, amount, note } = body;

		if (!recipientUserId || !asset || !amount) {
			return NextResponse.json(
				{ status: false, message: "Missing required fields" },
				{ status: 400 }
			);
		}

		const parsedAmount = parseFloat(amount);

		if (isNaN(parsedAmount) || parsedAmount <= 0) {
			return NextResponse.json(
				{ status: false, message: "Amount must be greater than 0" },
				{ status: 400 }
			);
		}

		if (parsedAmount > 1000000) {
			return NextResponse.json(
				{ status: false, message: "Amount exceeds maximum transfer limit" },
				{ status: 400 }
			);
		}

		if (recipientUserId === userId) {
			return NextResponse.json(
				{ status: false, message: "Cannot send to yourself" },
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

		// Verify sender balance
		let senderBalance = 0;
		try {
			const balancesResponse = await fetch(
				`${blockchainEngineUrl}/api/v1/user/${userId}/balance/`,
				{
					method: "GET",
					headers: { "X-API-KEY": blockchainEngineApiKey },
				}
			);

			if (balancesResponse.ok) {
				const balancesData = await balancesResponse.json();
				Object.entries(balancesData.balances || {}).forEach(([chain, balance]) => {
					const parts = chain.toLowerCase().split("_");
					const stablecoin = parts[parts.length - 1];
					if (stablecoin === asset.toLowerCase()) {
						senderBalance += parseFloat(balance as string) || 0;
					}
				});
			}
		} catch (error) {
			console.error("Balance fetch error:", error);
			return NextResponse.json(
				{ status: false, message: "Unable to verify balance. Please try again." },
				{ status: 503 }
			);
		}

		if (senderBalance < parsedAmount) {
			return NextResponse.json(
				{
					status: false,
					message: `Insufficient balance. You have ${senderBalance.toFixed(2)} ${asset.toUpperCase()}, but tried to send ${parsedAmount.toFixed(2)} ${asset.toUpperCase()}`,
				},
				{ status: 400 }
			);
		}

		// Execute internal transfer via blockchain engine
		const transferResponse = await fetch(
			`${blockchainEngineUrl}/api/v1/transfer/internal/`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-API-KEY": blockchainEngineApiKey,
				},
				body: JSON.stringify({
					sender_id: userId,
					recipient_id: recipientUserId,
					asset: asset.toUpperCase(),
					amount: parsedAmount,
					note: note || null,
				}),
			}
		);

		if (!transferResponse.ok) {
			const errorData = await transferResponse.json().catch(() => ({}));
			return NextResponse.json(
				{ status: false, message: errorData.error || "Failed to create transfer" },
				{ status: 500 }
			);
		}

		const transferData = await transferResponse.json();

		return NextResponse.json({
			status: true,
			message: "Transfer completed successfully",
			data: {
				transferId: transferData.id,
				recipient: transferData.recipient_username || recipientUserId,
				amount: parsedAmount,
				asset: asset.toUpperCase(),
			},
		});
	} catch (error) {
		console.error("Internal transfer error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
