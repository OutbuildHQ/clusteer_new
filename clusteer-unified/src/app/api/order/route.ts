import { supabase } from "@/lib/supabase";
import { getSupabaseUserWithRetry } from "@/lib/supabase-helpers";
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

		// Get user from Supabase with retry logic
		const { user: authUser, error: authError, isNetworkError } = await getSupabaseUserWithRetry(token);

		if (authError || !authUser) {
			// Return 503 for network errors, 401 for auth errors
			if (isNetworkError) {
				console.error("Supabase network error:", authError);
				return NextResponse.json(
					{ status: false, message: "Authentication service temporarily unavailable" },
					{ status: 503 }
				);
			}

			return NextResponse.json(
				{ status: false, message: "Invalid or expired token" },
				{ status: 401 }
			);
		}

		// Get pagination params
		const searchParams = request.nextUrl.searchParams;
		const page = parseInt(searchParams.get("page") || "1");
		const size = parseInt(searchParams.get("size") || "10");
		const offset = (page - 1) * size;

		// Get orders from database
		const { data: orders, error: ordersError, count } = await supabase
			.from("orders")
			.select("*", { count: "exact" })
			.eq("user_id", authUser.id)
			.order("created_at", { ascending: false })
			.range(offset, offset + size - 1);

		if (ordersError) {
			console.error("Error fetching orders:", ordersError);
			return NextResponse.json(
				{ status: false, message: "Failed to fetch orders" },
				{ status: 500 }
			);
		}

		const totalPages = count ? Math.ceil(count / size) : 0;

		// Format orders to match expected structure
		const formattedOrders = (orders || []).map((order: any) => ({
			id: order.id,
			type: order.type || "buy",
			chain: order.chain || "USDT",
			amount: order.amount || 0,
			rate: order.rate || 0,
			paymentMethod: order.payment_method || null,
			number: order.order_number || order.id,
			status: order.status || "pending",
			dateOrdered: new Date(order.created_at).toLocaleDateString(),
			dateSettled: order.settled_at ? new Date(order.settled_at).toLocaleDateString() : null,
		}));

		return NextResponse.json({
			status: true,
			data: formattedOrders,
			metadata: {
				page,
				size,
				totalItems: count || 0,
				totalPages,
			},
		});
	} catch (error) {
		console.error("Order fetch error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
