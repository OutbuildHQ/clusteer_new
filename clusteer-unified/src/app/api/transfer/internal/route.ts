import { NextRequest, NextResponse } from "next/server";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limiter";
import { getAuthFromRequest, djangoFetch } from "@/lib/api-helpers";

const MAX_TRANSFER_AMOUNT = Number(process.env.MAX_TRANSFER_AMOUNT) || 1_000_000;

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

		const { recipient_user_id, asset, amount, note, chain } = body;

		if (!recipient_user_id || !asset || !amount) {
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

		if (parsedAmount > MAX_TRANSFER_AMOUNT) {
			return NextResponse.json(
				{ status: false, message: "Amount exceeds maximum transfer limit" },
				{ status: 400 }
			);
		}

		if (recipient_user_id === userId) {
			return NextResponse.json(
				{ status: false, message: "Cannot send to yourself" },
				{ status: 400 }
			);
		}

		// Verify sender balance
		let senderBalance = 0;
		try {
			const balancesResponse = await djangoFetch(`/user/${userId}/balance/`);

			if (balancesResponse.ok) {
				const balancesData = await balancesResponse.json();
				Object.entries(balancesData.balances || {}).forEach(([chainKey, balance]) => {
					const parts = chainKey.toLowerCase().split("_");
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

		// Execute P2P transfer via blockchain engine
		const transferResponse = await djangoFetch("/p2p-transfer/", {
			method: "POST",
			body: JSON.stringify({
				sender_user_id: userId,
				recipient_user_id,
				asset: asset.toUpperCase(),
				amount: parsedAmount,
				chain: chain?.toLowerCase() || null,
				note: note || null,
			}),
		});

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
				recipient: transferData.recipient_username || recipient_user_id,
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
