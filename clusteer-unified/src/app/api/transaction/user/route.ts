import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Firebase JWT decoding
function decodeFirebaseToken(token: string) {
	try {
		const parts = token.split('.');
		if (parts.length !== 3) return null;

		const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
		return payload;
	} catch (error) {
		return null;
	}
}

export async function GET(request: NextRequest) {
	try {
		const token = request.cookies.get("auth_token")?.value;
		if (!token) {
			return NextResponse.json(
				{ status: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Decode Firebase token to get user ID
		const payload = decodeFirebaseToken(token);
		const userId = payload?.user_id || payload?.sub;

		if (!userId) {
			return NextResponse.json(
				{ status: false, message: "Invalid authentication token" },
				{ status: 401 }
			);
		}

		// Get pagination params
		const searchParams = request.nextUrl.searchParams;
		const page = searchParams.get("page") || "1";
		const size = searchParams.get("size") || "10";

		// Build Django API URL
		const blockchainEngineUrl = process.env.NEXT_PUBLIC_BLOCKCHAIN_ENGINE_URL || "http://localhost:8000/api/v1";
		const apiKey = process.env.NEXT_PUBLIC_BLOCKCHAIN_ENGINE_API_KEY;

		// Build query parameters
		const queryParams = new URLSearchParams({
			page,
			size,
		});

		// Fetch orders from Django backend (primary transaction source)
		// TODO: Later aggregate from multiple sources:
		// - Orders (buy/sell)
		// - P2P transfers
		// - Withdrawals
		// - Deposits
		const response = await axios.get(
			`${blockchainEngineUrl}/user/${userId}/orders/?${queryParams.toString()}`,
			{
				headers: {
					"X-API-KEY": apiKey,
					"Authorization": `Bearer ${token}`,
				},
				timeout: 10000,
			}
		);

		// Map orders to transaction format
		if (response.data.status && response.data.data) {
			const transactions = response.data.data.map((order: any) => ({
				id: order.order_id,
				type: order.type === 'buy' ? 'deposit' : 'withdrawal',
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
				metadata: response.data.metadata,
			});
		}

		return NextResponse.json(response.data);
	} catch (error: any) {
		console.error("Transaction fetch error:", error);

		// Handle Django backend errors
		if (error.response) {
			return NextResponse.json(
				{
					status: false,
					message: error.response.data?.message || "Failed to fetch transactions from backend",
				},
				{ status: error.response.status }
			);
		}

		// Handle network errors (backend down)
		if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
			return NextResponse.json(
				{
					status: false,
					message: "Backend service temporarily unavailable",
				},
				{ status: 503 }
			);
		}

		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
