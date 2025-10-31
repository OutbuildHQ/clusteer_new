import { supabaseAdmin } from "@/lib/supabase";
import { getSupabaseUserWithRetry } from "@/lib/supabase-helpers";
import { NextRequest, NextResponse } from "next/server";

// TEMPORARY ENDPOINT FOR TESTING - REMOVE IN PRODUCTION
export async function POST(request: NextRequest) {
	try {
		// Get the auth token from cookies
		const token = request.cookies.get("auth_token")?.value;

		if (!token) {
			return NextResponse.json(
				{ status: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Get user from Supabase with retry logic
		const { user: authUser, error: authError } = await getSupabaseUserWithRetry(token);

		if (authError || !authUser) {
			return NextResponse.json(
				{ status: false, message: "Invalid or expired token" },
				{ status: 401 }
			);
		}

		// Reset user's is_verified status using admin client (bypasses RLS)
		const { error: updateError } = await supabaseAdmin
			.from("users")
			.update({
				is_verified: false,
				updated_at: new Date().toISOString(),
			})
			.eq("id", authUser.id);

		if (updateError) {
			console.error("Error resetting user verification status:", updateError);
			return NextResponse.json(
				{ status: false, message: "Failed to reset verification status" },
				{ status: 500 }
			);
		}

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
