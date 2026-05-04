import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/api-helpers";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

export async function GET(request: NextRequest) {
	try {
		const auth = getAuthFromRequest(request);
		if (!auth) {
			return NextResponse.json(
				{ status: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Decode email from JWT for the TOTP label
		let email = "";
		try {
			const parts = auth.token.split(".");
			const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
			email = payload.email || "";
		} catch {
			// email stays empty
		}

		// Generate a secret for 2FA
		const secret = speakeasy.generateSecret({
			name: `Clusteer (${email})`,
			issuer: "Clusteer",
		});

		// Generate QR code
		const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url || "");

		// Return the secret and QR to the client.
		// The secret should be stored server-side when the user validates.
		// For now, it's returned to the client for the validation step.
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
