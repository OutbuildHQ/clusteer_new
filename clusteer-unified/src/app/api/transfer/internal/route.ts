import { supabase, supabaseAdmin } from "@/lib/supabase";
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

		const {
			data: { user: authUser },
			error: authError,
		} = await supabase.auth.getUser(token);

		if (authError || !authUser) {
			return NextResponse.json(
				{ status: false, message: "Invalid token" },
				{ status: 401 }
			);
		}

		const body = await request.json();
		const { recipientUserId, asset, amount, note } = body;

		// Validate input
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

		// Validate amount is reasonable (max 1 million per transfer)
		if (parsedAmount > 1000000) {
			return NextResponse.json(
				{ status: false, message: "Amount exceeds maximum transfer limit" },
				{ status: 400 }
			);
		}

		// Check if sender is trying to send to themselves
		if (recipientUserId === authUser.id) {
			return NextResponse.json(
				{ status: false, message: "Cannot send to yourself" },
				{ status: 400 }
			);
		}

		// Verify recipient exists
		const { data: recipient, error: recipientError } = await supabaseAdmin
			.from("users")
			.select("id, username, is_verified")
			.eq("id", recipientUserId)
			.single();

		if (recipientError || !recipient) {
			return NextResponse.json(
				{ status: false, message: "Recipient not found" },
				{ status: 404 }
			);
		}

		// Check if recipient is verified
		if (!recipient.is_verified) {
			return NextResponse.json(
				{ status: false, message: "Recipient must complete identity verification to receive transfers" },
				{ status: 403 }
			);
		}

		// CRITICAL: Validate sender has sufficient balance
		// Fetch sender's balance from blockchain engine
		const blockchainEngineUrl = process.env.BLOCKCHAIN_ENGINE_URL || "http://localhost:8000";
		const blockchainEngineApiKey = process.env.BLOCKCHAIN_ENGINE_API_KEY;

		if (!blockchainEngineApiKey) {
			console.error("BLOCKCHAIN_ENGINE_API_KEY not configured");
			return NextResponse.json(
				{ status: false, message: "Unable to verify balance" },
				{ status: 500 }
			);
		}

		let senderBalance = 0;
		try {
			const balancesResponse = await fetch(
				`${blockchainEngineUrl}/api/v1/user/${authUser.id}/balance/`,
				{
					method: "GET",
					headers: {
						"X-API-KEY": blockchainEngineApiKey,
					},
				}
			);

			if (balancesResponse.ok) {
				const balancesData = await balancesResponse.json();

				// Aggregate balance for the specific asset across all chains
				Object.entries(balancesData.balances || {}).forEach(([chain, balance]) => {
					const parts = chain.toLowerCase().split('_');
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

		// Check if sender has sufficient balance
		if (senderBalance < parsedAmount) {
			return NextResponse.json(
				{
					status: false,
					message: `Insufficient balance. You have ${senderBalance.toFixed(2)} ${asset.toUpperCase()}, but tried to send ${parsedAmount.toFixed(2)} ${asset.toUpperCase()}`
				},
				{ status: 400 }
			);
		}

		// Create internal transfer record
		const { data: transfer, error: transferError } = await supabaseAdmin
			.from("internal_transfers")
			.insert({
				sender_id: authUser.id,
				recipient_id: recipientUserId,
				asset: asset.toUpperCase(),
				amount: parsedAmount,
				note: note || null,
				status: "completed",
			})
			.select()
			.single();

		if (transferError) {
			console.error("Transfer error:", transferError);
			return NextResponse.json(
				{ status: false, message: "Failed to create transfer" },
				{ status: 500 }
			);
		}

		// TODO: Update wallet balances in blockchain engine
		// For production, you should:
		// 1. Deduct from sender's wallet via blockchain engine API
		// 2. Add to recipient's wallet via blockchain engine API
		// 3. Make these operations atomic (transaction)
		// 4. Handle rollback if any step fails

		return NextResponse.json({
			status: true,
			message: "Transfer completed successfully",
			data: {
				transferId: transfer.id,
				recipient: recipient.username,
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
