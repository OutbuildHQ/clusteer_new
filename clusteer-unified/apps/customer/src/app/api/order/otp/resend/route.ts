import { NextRequest, NextResponse } from "next/server";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limiter";
import { getAuthFromRequest } from "@/lib/api-helpers";
import { springFetch } from "@/lib/spring-boot-server";

export async function POST(request: NextRequest) {
	try {
		const rateLimitResponse = await rateLimit(request, RateLimitPresets.strict);
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

		const { orderId } = body;
		if (!orderId) {
			return NextResponse.json({ status: false, message: "orderId is required" }, { status: 400 });
		}

		const res = await springFetch("/order/otp/resend", {
			method: "POST",
			body: JSON.stringify({ orderId }),
		}, auth.token);

		const data = await res.json();

		if (!res.ok) {
			return NextResponse.json(
				{ status: false, message: data.message || "Failed to resend OTP" },
				{ status: res.status },
			);
		}

		return NextResponse.json({ status: true, message: "OTP resent" });
	} catch (error) {
		console.error("OTP resend error:", error);
		return NextResponse.json({ status: false, message: "An unexpected error occurred" }, { status: 500 });
	}
}
