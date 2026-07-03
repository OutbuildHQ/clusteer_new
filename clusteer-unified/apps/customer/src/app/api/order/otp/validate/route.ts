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

		const { orderId, otpCode } = body;
		if (!orderId || !otpCode) {
			return NextResponse.json({ status: false, message: "orderId and otpCode are required" }, { status: 400 });
		}

		const res = await springFetch("/order/otp/validate", {
			method: "POST",
			body: JSON.stringify({ orderId, otpCode }),
		}, auth.token);

		const data = await res.json();

		if (!res.ok) {
			return NextResponse.json(
				{ status: false, message: data.message || "OTP validation failed" },
				{ status: res.status },
			);
		}

		return NextResponse.json({ status: true, message: "OTP verified", data });
	} catch (error) {
		console.error("OTP validate error:", error);
		return NextResponse.json({ status: false, message: "An unexpected error occurred" }, { status: 500 });
	}
}
