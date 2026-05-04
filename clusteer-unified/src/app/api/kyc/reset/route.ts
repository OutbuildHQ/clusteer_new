import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, djangoFetch } from "@/lib/api-helpers";

// TEMPORARY ENDPOINT FOR TESTING - REMOVE IN PRODUCTION
export async function POST(request: NextRequest) {
	try {
		const auth = getAuthFromRequest(request);
		if (!auth) {
			return NextResponse.json(
				{ status: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		// TODO: Call Django endpoint to reset KYC when available
		// For now, return success stub
		return NextResponse.json({
			status: true,
			message: "KYC verification status has been reset to false for testing.",
			data: {
				is_verified: false,
			},
		});
	} catch (error) {
		console.error("KYC reset error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
