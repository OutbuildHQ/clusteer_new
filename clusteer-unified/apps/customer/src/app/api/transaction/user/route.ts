import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, djangoFetch } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
	try {
		const auth = getAuthFromRequest(request);
		if (!auth) {
			return NextResponse.json(
				{ status: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { userId } = auth;

		// Get pagination params
		const searchParams = request.nextUrl.searchParams;
		const page = searchParams.get("page") || "1";
		const size = searchParams.get("size") || "10";

		// Build query parameters
		const queryParams = new URLSearchParams({ page, size });

		// Fetch orders from Django backend
		const response = await djangoFetch(`/user/${userId}/orders/?${queryParams.toString()}`);

		if (!response.ok) {
			// Gracefully return empty list for any backend error
			return NextResponse.json({
				status: true,
				data: [],
				metadata: { page: 1, size: 10, totalItems: 0, totalPages: 1 },
			});
		}

		const responseData = await response.json();

		// Map orders to transaction format
		if (responseData.status && responseData.data) {
			const transactions = responseData.data.map((order: any) => ({
				id: order.order_id,
				type: order.type === "buy" ? "deposit" : "withdrawal",
				status: order.status,
				amount: order.fiat_amount,
				currency: order.fiat_currency,
				crypto_amount: order.crypto_amount,
				crypto_currency: order.crypto_currency,
				crypto_network: order.crypto_network,
				exchange_rate: order.exchange_rate,
				platform_fee: order.platform_fee,
				total_amount: order.total_amount,
				payment_method: order.payment_method,
				blockchain_tx_hash: order.blockchain_tx_hash,
				created_at: order.created_at,
				updated_at: order.updated_at,
				completed_at: order.completed_at,
			}));

			return NextResponse.json({
				status: true,
				data: transactions,
				metadata: responseData.metadata,
			});
		}

		return NextResponse.json(responseData);
	} catch (error: any) {
		console.error("Transaction fetch error:", error);

		// Backend down or any unexpected error — return empty list gracefully
		return NextResponse.json({
			status: true,
			data: [],
			metadata: { page: 1, size: 10, totalItems: 0, totalPages: 1 },
		});
	}
}
