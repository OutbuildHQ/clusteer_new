import { NextRequest, NextResponse } from "next/server";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limiter";

/**
 * Legacy login route — redirects to Firebase auth
 * Use /api/auth-firebase/login instead
 */
export async function POST(request: NextRequest) {
	const rateLimitResponse = rateLimit(request, RateLimitPresets.strict);
	if (rateLimitResponse) {
		return rateLimitResponse;
	}

	return NextResponse.json(
		{
			status: false,
			message: "This endpoint is deprecated. Use /api/auth-firebase/login instead.",
		},
		{ status: 410 }
	);
}
