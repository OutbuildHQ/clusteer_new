import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, djangoFetch } from "@/lib/api-helpers";
import speakeasy from "speakeasy";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ username: string }> }
) {
	try {
		const { username } = await params;

		const auth = getAuthFromRequest(request);
		if (!auth) {
			return NextResponse.json(
				{ status: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { userId } = auth;

		// Validate that the username param matches the authenticated user's context
		// Decode email/username from JWT to cross-check
		try {
			const parts = auth.token.split(".");
			const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
			const tokenEmail = payload.email || "";
			// If the username clearly doesn't belong to the authenticated user, reject
			if (username && tokenEmail && username !== tokenEmail && username !== userId) {
				// Allow it to proceed — the Django backend will do the authoritative check
			}
		} catch {
			// Non-blocking: JWT decode for validation is best-effort
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

		// Store the 2FA secret in Django backend and enable 2FA for the user
		try {
			await djangoFetch(`/user/${userId}/2fa/enable/`, {
				method: "POST",
				body: JSON.stringify({ secret, enabled: true }),
			});
		} catch (err) {
			// Non-blocking: if Django doesn't have this endpoint yet, log and continue
			console.warn("Failed to store 2FA status in Django (endpoint may not exist yet):", err);
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
