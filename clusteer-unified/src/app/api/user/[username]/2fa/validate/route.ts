import { supabaseAdmin } from "@/lib/supabase";
import { getSupabaseUserWithRetry } from "@/lib/supabase-helpers";
import { NextRequest, NextResponse } from "next/server";
import speakeasy from "speakeasy";

export async function POST(
	request: NextRequest,
	{ params }: { params: { username: string } }
) {
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
		const { user: authUser, error: authError, isNetworkError } = await getSupabaseUserWithRetry(token);

		if (authError || !authUser) {
			if (isNetworkError) {
				console.error("Supabase network error:", authError);
				return NextResponse.json(
					{ status: false, message: "Authentication service temporarily unavailable" },
					{ status: 503 }
				);
			}

			return NextResponse.json(
				{ status: false, message: "Invalid or expired token" },
				{ status: 401 }
			);
		}

		// Parse request body
		const body = await request.json();
		const { otp } = body;

		if (!otp || otp.length !== 6) {
			return NextResponse.json(
				{ status: false, message: "Invalid OTP code" },
				{ status: 400 }
			);
		}

		// Get user profile to retrieve 2FA secret
		const { data: userProfile, error: profileError } = await supabaseAdmin
			.from("users")
			.select("two_factor_secret")
			.eq("id", authUser.id)
			.single();

		if (profileError || !userProfile?.two_factor_secret) {
			return NextResponse.json(
				{ status: false, message: "2FA secret not found. Please generate a new QR code." },
				{ status: 400 }
			);
		}

		// Verify the OTP
		const verified = speakeasy.totp.verify({
			secret: userProfile.two_factor_secret,
			encoding: "base32",
			token: otp,
			window: 2, // Allow 2 time steps before/after
		});

		if (!verified) {
			return NextResponse.json(
				{ status: false, message: "Invalid OTP code. Please try again." },
				{ status: 400 }
			);
		}

		// Enable 2FA for the user
		const { error: updateError } = await supabaseAdmin
			.from("users")
			.update({
				two_factor_enabled: true,
				updated_at: new Date().toISOString(),
			})
			.eq("id", authUser.id);

		if (updateError) {
			console.error("Error enabling 2FA:", updateError);
			return NextResponse.json(
				{ status: false, message: "Failed to enable 2FA" },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			status: true,
			message: "2FA enabled successfully",
		});
	} catch (error) {
		console.error("2FA validation error:", error);
		return NextResponse.json(
			{ status: false, message: "Failed to validate 2FA code" },
			{ status: 500 }
		);
	}
}
