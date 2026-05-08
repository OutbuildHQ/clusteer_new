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

		const { asset, amount, recipient_address, network, bank_code, account_number, account_name, narration } = body;

		// Determine send type: bank (NGN) or crypto
		const isBankSend = asset === "NGN" || bank_code;

		if (!asset || !amount) {
			return NextResponse.json(
				{ status: false, message: "Missing required fields: asset and amount" },
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

		// Validate type-specific fields
		if (isBankSend) {
			if (!bank_code || !account_number) {
				return NextResponse.json(
					{ status: false, message: "bank_code and account_number are required for bank transfers" },
					{ status: 400 }
				);
			}
		} else {
			if (!recipient_address) {
				return NextResponse.json(
					{ status: false, message: "recipient_address is required for crypto transfers" },
					{ status: 400 }
				);
			}
		}

		// Verify sender balance
		let senderBalance = 0;
		try {
			const balancesResponse = await djangoFetch(`/user/${userId}/balance/`);

			if (balancesResponse.ok) {
				const balancesData = await balancesResponse.json();

				if (isBankSend) {
					// For NGN, look for NGN balance directly
					senderBalance = parseFloat(balancesData.balances?.NGN as string) || 0;
				} else {
					Object.entries(balancesData.balances || {}).forEach(([chainKey, balance]) => {
						const parts = chainKey.toLowerCase().split("_");
						const stablecoin = parts[parts.length - 1];
						if (stablecoin === asset.toLowerCase()) {
							senderBalance += parseFloat(balance as string) || 0;
						}
					});
				}
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

		if (isBankSend) {
			// Bank withdrawal via Django
			const withdrawResponse = await djangoFetch("/withdrawal-request/", {
				method: "POST",
				body: JSON.stringify({
					user_id: userId,
					bank_code,
					account_number,
					account_name: account_name || null,
					amount: parsedAmount,
					currency: "NGN",
					narration: narration || null,
				}),
			});

			if (!withdrawResponse.ok) {
				const errorData = await withdrawResponse.json().catch(() => ({}));
				return NextResponse.json(
					{ status: false, message: errorData.error || errorData.message || "Bank transfer failed" },
					{ status: 500 }
				);
			}

			const withdrawData = await withdrawResponse.json();

			return NextResponse.json({
				status: true,
				message: "Bank transfer submitted successfully",
				data: {
					transferId: withdrawData.id || withdrawData.reference,
					amount: parsedAmount,
					asset: "NGN",
					bank_code,
					account_number,
				},
			});
		} else {
			// Crypto external transfer via Django
			const transferResponse = await djangoFetch("/external-transfer/", {
				method: "POST",
				body: JSON.stringify({
					sender_user_id: userId,
					recipient_address,
					asset: asset.toUpperCase(),
					amount: parsedAmount,
					chain: network?.toLowerCase() || null,
				}),
			});

			if (!transferResponse.ok) {
				const errorData = await transferResponse.json().catch(() => ({}));
				return NextResponse.json(
					{ status: false, message: errorData.error || errorData.message || "Crypto transfer failed" },
					{ status: 500 }
				);
			}

			const transferData = await transferResponse.json();

			return NextResponse.json({
				status: true,
				message: "Transfer broadcast successfully",
				data: {
					transferId: transferData.id || transferData.tx_hash,
					recipient: recipient_address,
					amount: parsedAmount,
					asset: asset.toUpperCase(),
					chain: network,
					tx_hash: transferData.tx_hash || null,
				},
			});
		}
	} catch (error) {
		console.error("Send transfer error:", error);
		const isNetwork = error instanceof TypeError && ((error as TypeError).message.includes("ECONNREFUSED") || (error as TypeError).message.includes("fetch failed"));
		if (isNetwork) {
			return NextResponse.json(
				{ status: false, message: "Service temporarily unavailable" },
				{ status: 503 }
			);
		}
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
