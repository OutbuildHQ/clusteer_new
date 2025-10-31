import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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

		// Get pagination params
		const searchParams = request.nextUrl.searchParams;
		const page = parseInt(searchParams.get("page") || "1");
		const size = parseInt(searchParams.get("size") || "10");
		const offset = (page - 1) * size;

		// Get transactions from database
		const { data: transactions, error: transactionsError, count } = await supabase
			.from("transactions")
			.select("*", { count: "exact" })
			.eq("user_id", authUser.id)
			.order("created_at", { ascending: false })
			.range(offset, offset + size - 1);

		if (transactionsError) {
			console.error("Error fetching transactions:", transactionsError);
			return NextResponse.json(
				{ status: false, message: "Failed to fetch transactions" },
				{ status: 500 }
			);
		}

		const totalPages = count ? Math.ceil(count / size) : 0;

		// Format transactions to match expected structure
		const formattedTransactions = (transactions || []).map((tx: any) => ({
			id: tx.id,
			type: tx.type || "buy",
			currency: tx.currency || "USDT",
			amount: tx.amount || 0,
			rate: tx.rate || 0,
			flow: tx.flow || "Crypto Purchase",
			orderNumber: tx.order_number || tx.id,
			status: tx.status || "pending",
			dateCreated: new Date(tx.created_at).toLocaleDateString(),
		}));

		return NextResponse.json({
			status: true,
			data: formattedTransactions,
			metadata: {
				page,
				size,
				totalItems: count || 0,
				totalPages,
			},
		});
	} catch (error) {
		console.error("Transaction fetch error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
