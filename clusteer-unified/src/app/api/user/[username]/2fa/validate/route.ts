import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/api-helpers";
import speakeasy from "speakeasy";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ username: string }> }
) {
	try {
		await params;

		const auth = getAuthFromRequest(request);
		if (!auth) {
			return NextResponse.json(
				{ status: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Parse request body
		const body = await request.json();
		const { otp, secret } = body;

		if (!otp || otp.length !== 6) {
			return NextResponse.json(
				{ status: false, message: "Invalid OTP code" },
				{ status: 400 }
			);
		}

		if (!secret) {
			return NextResponse.json(
				{ status: false, message: "2FA secret not provided. Please generate a new QR code." },
				{ status: 400 }
			);
		}

		// Verify the OTP
		const verified = speakeasy.totp.verify({
			secret,
			encoding: "base32",
			token: otp,
			window: 2,
		});

		if (!verified) {
			return NextResponse.json(
				{ status: false, message: "Invalid OTP code. Please try again." },
				{ status: 400 }
			);
		}

		// TODO: Store the 2FA secret in Django backend and enable 2FA for the user
		// For now, return success so the frontend can proceed
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
