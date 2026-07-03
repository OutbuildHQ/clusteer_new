import { NextRequest, NextResponse } from "next/server";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limiter";
import { getAuthFromRequest } from "@/lib/api-helpers";
import { springFetch } from "@/lib/spring-boot-server";

const MAX_TRADE_AMOUNT = Number(process.env.MAX_TRADE_AMOUNT) || 1_000_000;
const VALID_CHANNELS = ["TRC20", "BEP20", "ERC20"];

export async function POST(request: NextRequest) {
	try {
		const rateLimitResponse = await rateLimit(request, RateLimitPresets.moderate);
		if (rateLimitResponse) return rateLimitResponse;

		const auth = getAuthFromRequest(request);
		if (!auth) {
			return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });
		}

		let body;
		try {
			body = await request.json();
		} catch {
			return NextResponse.json({ status: false, message: "Invalid request body" }, { status: 400 });
		}

		const { side, amount, channel, destinationAddress, bankCode, accountNumber } = body;

		if (!side || !amount || !channel) {
			return NextResponse.json({ status: false, message: "Missing required fields: side, amount, channel" }, { status: 400 });
		}

		const parsedAmount = parseFloat(amount);
		if (isNaN(parsedAmount) || parsedAmount <= 0) {
			return NextResponse.json({ status: false, message: "Amount must be a positive number" }, { status: 400 });
		}
		if (parsedAmount > MAX_TRADE_AMOUNT) {
			return NextResponse.json({ status: false, message: "Amount exceeds maximum limit" }, { status: 400 });
		}

		if (!["buy", "sell"].includes(side)) {
			return NextResponse.json({ status: false, message: "Side must be 'buy' or 'sell'" }, { status: 400 });
		}

		if (!VALID_CHANNELS.includes(channel)) {
			return NextResponse.json({ status: false, message: `Channel must be one of: ${VALID_CHANNELS.join(", ")}` }, { status: 400 });
		}

		if (side === "buy" && !destinationAddress) {
			return NextResponse.json({ status: false, message: "Destination wallet address is required for buy orders" }, { status: 400 });
		}

		if (side === "sell" && (!bankCode || !accountNumber)) {
			return NextResponse.json({ status: false, message: "Bank code and account number are required for sell orders" }, { status: 400 });
		}

		const endpoint = side === "buy"
			? "/order/purchase/create"
			: "/order/sale/create";

		const payload = side === "buy"
			? { amount: parsedAmount, channel, destinationAddress }
			: { amount: parsedAmount, channel, bankCode, accountNumber };

		const res = await springFetch(endpoint, {
			method: "POST",
			body: JSON.stringify(payload),
		}, auth.token);

		const data = await res.json();

		if (!res.ok) {
			return NextResponse.json(
				{ status: false, message: data.message || data.error || "Order creation failed" },
				{ status: res.status },
			);
		}

		return NextResponse.json({
			status: true,
			message: "Order created — OTP verification required",
			data,
		});
	} catch (error) {
		console.error("Trade error:", error);
		return NextResponse.json({ status: false, message: "An unexpected error occurred" }, { status: 500 });
	}
}
