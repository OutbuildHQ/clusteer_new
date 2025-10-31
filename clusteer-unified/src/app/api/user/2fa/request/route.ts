import { supabaseAdmin } from "@/lib/supabase";
import { getSupabaseUserWithRetry } from "@/lib/supabase-helpers";
import { NextRequest, NextResponse } from "next/server";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

export async function GET(request: NextRequest) {
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

		// Generate a secret for 2FA
		const secret = speakeasy.generateSecret({
			name: `Clusteer (${authUser.email})`,
			issuer: "Clusteer",
		});

		// Generate QR code
		const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url || "");

		// Store the secret in the database (but don't enable 2FA yet)
		const { error: updateError } = await supabaseAdmin
			.from("users")
			.update({
				two_factor_secret: secret.base32,
				updated_at: new Date().toISOString(),
			})
			.eq("id", authUser.id);

		if (updateError) {
			console.error("Error storing 2FA secret:", JSON.stringify(updateError, null, 2));
			return NextResponse.json(
				{ status: false, message: `Failed to store 2FA secret: ${updateError.message}` },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			status: true,
			data: {
				twoFactorQR: qrCodeDataURL,
				twoFactorSecret: secret.base32,
			},
		});
	} catch (error) {
		console.error("2FA request error:", error);
		return NextResponse.json(
			{ status: false, message: "Failed to generate 2FA secret" },
			{ status: 500 }
		);
	}
}
