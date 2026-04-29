import { NextRequest, NextResponse } from "next/server";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limiter";

/**
 * Legacy register route — redirects to Firebase auth
 * Use /api/auth-firebase/register instead
 */
export async function POST(request: NextRequest) {
	const rateLimitResponse = rateLimit(request, RateLimitPresets.strict);
	if (rateLimitResponse) {
		return rateLimitResponse;
	}

	return NextResponse.json(
		{
			status: false,
			message: "This endpoint is deprecated. Use /api/auth-firebase/register instead.",
		},
		{ status: 410 }
	);
}
