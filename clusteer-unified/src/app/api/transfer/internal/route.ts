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

		if (amount <= 0) {
			return NextResponse.json(
				{ status: false, message: "Amount must be greater than 0" },
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
			.select("id, username")
			.eq("id", recipientUserId)
			.single();

		if (recipientError || !recipient) {
			return NextResponse.json(
				{ status: false, message: "Recipient not found" },
				{ status: 404 }
			);
		}

		// Create internal transfer record
		const { data: transfer, error: transferError } = await supabaseAdmin
			.from("internal_transfers")
			.insert({
				sender_id: authUser.id,
				recipient_id: recipientUserId,
				asset: asset.toUpperCase(),
				amount: amount,
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

		// In a real application, you would:
		// 1. Check sender's balance
		// 2. Deduct from sender's wallet
		// 3. Add to recipient's wallet
		// 4. Create transaction records
		// For now, we're just creating the transfer record

		return NextResponse.json({
			status: true,
			message: "Transfer completed successfully",
			data: {
				transferId: transfer.id,
				recipient: recipient.username,
				amount: amount,
				asset: asset,
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
