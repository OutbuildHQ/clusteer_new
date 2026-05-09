import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/api-helpers";

// Dev-only endpoint for resetting KYC status during testing
export async function POST(request: NextRequest) {
	if (process.env.NODE_ENV === "production") {
		return NextResponse.json({ status: false, message: "Not found" }, { status: 404 });
	}

	try {
		const auth = getAuthFromRequest(request);
		if (!auth) {
			return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });
		}

		// TODO: Call Django endpoint to reset KYC when available
		return NextResponse.json({
			status: true,
			message: "KYC reset stub (dev only)",
			data: { is_verified: false },
		});
	} catch (error) {
		console.error("KYC reset error:", error);
		return NextResponse.json({ status: false, message: "An unexpected error occurred" }, { status: 500 });
	}
}
