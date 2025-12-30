import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { username, otp } = body;

		console.log("Verifying OTP for username:", username, "OTP:", otp);

		// Validate input
		if (!username || !otp) {
			return NextResponse.json(
				{ status: false, message: "Username and OTP are required" },
				{ status: 400 }
			);
		}

		// Find user
		const { data: user, error } = await supabase
			.from("users")
			.select("*")
			.eq("username", username)
			.single();

		if (error || !user) {
			console.log("User not found:", username, error);
			return NextResponse.json(
				{ status: false, message: "User not found" },
				{ status: 404 }
			);
		}

		console.log("User found. Is verified:", user.is_verified, "Stored OTP:", user.otp, "OTP expires at:", user.otp_expires_at);

		// Check if already verified
		if (user.is_verified) {
			return NextResponse.json(
				{ status: false, message: "Account is already verified. You can login now." },
				{ status: 400 }
			);
		}

		// Check if OTP is expired - Fixed timezone issue
		if (user.otp_expires_at) {
			const expiryTime = new Date(user.otp_expires_at).getTime();
			const currentTime = Date.now();

			console.log("Expiry timestamp:", expiryTime, "Current timestamp:", currentTime, "Expired:", currentTime > expiryTime);

			if (currentTime > expiryTime) {
				console.log("OTP expired. Expiry:", user.otp_expires_at, "Current:", new Date().toISOString());
				return NextResponse.json(
					{ status: false, message: "OTP has expired. Please register again or request a new OTP." },
					{ status: 400 }
				);
			}
		}

		// Verify OTP
		if (user.otp !== otp) {
			console.log("Invalid OTP. Expected:", user.otp, "Received:", otp);
			return NextResponse.json(
				{ status: false, message: "Invalid OTP. Please check and try again." },
				{ status: 400 }
			);
		}

		// Update user as verified
		const { error: updateError } = await supabase
			.from("users")
			.update({
				is_verified: true,
				otp: null,
				otp_expires_at: null,
			})
			.eq("id", user.id);

		if (updateError) {
			console.error("Error updating user:", updateError);
			return NextResponse.json(
				{ status: false, message: "Failed to verify account" },
				{ status: 500 }
			);
		}

		console.log("User verified successfully:", username);
		return NextResponse.json({
			status: true,
			message: "Account verified successfully. You can now login.",
		});
	} catch (error) {
		console.error("OTP verification error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
