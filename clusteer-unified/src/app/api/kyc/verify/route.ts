import { supabaseAdmin } from "@/lib/supabase";
import { getSupabaseUserWithRetry } from "@/lib/supabase-helpers";
import { NextRequest, NextResponse } from "next/server";

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

		const body = await request.json();
		const { verificationType, data } = body;

		// Validate input
		if (!verificationType || !data) {
			return NextResponse.json(
				{ status: false, message: "Verification type and data are required" },
				{ status: 400 }
			);
		}

		// TODO: In production, you would:
		// 1. Store the verification data (BVN, NIN image, etc.) in a verification_requests table
		// 2. Call a third-party verification service (e.g., Smile Identity, Youverify)
		// 3. Set is_verified to true only after manual/automated approval
		// For now, we'll immediately mark the user as verified for demo purposes

		// Update user's is_verified status using admin client (bypasses RLS)
		const { data: updatedUser, error: updateError } = await supabaseAdmin
			.from("users")
			.update({
				is_verified: true,
				updated_at: new Date().toISOString(),
			})
			.eq("id", authUser.id)
			.select()
			.single();

		if (updateError) {
			console.error("Error updating user verification status:", updateError);
			return NextResponse.json(
				{ status: false, message: "Failed to update verification status" },
				{ status: 500 }
			);
		}

		console.log("User verification status updated successfully:", {
			userId: authUser.id,
			is_verified: updatedUser?.is_verified,
			updated_at: updatedUser?.updated_at,
		});

		return NextResponse.json({
			status: true,
			message: "Verification submitted successfully. Your account has been verified.",
			data: {
				is_verified: true,
			},
		});
	} catch (error) {
		console.error("KYC verification error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
