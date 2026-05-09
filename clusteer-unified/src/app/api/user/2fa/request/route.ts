import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/api-helpers";
import { signPendingToken } from "@/lib/auth";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });
    }

    // Decode email from Firebase JWT for the TOTP label
    let email = "";
    try {
      const parts = auth.token.split(".");
      const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
      email = payload.email || "";
    } catch { /* email stays empty */ }

    // Generate TOTP secret
    const secret = speakeasy.generateSecret({
      name: `Clusteer${email ? ` (${email})` : ""}`,
      issuer: "Clusteer",
    });

    // Generate QR code image — this embeds the secret in the QR URL
    // The raw secret is NOT returned to the client; it stays server-side
    const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url || "");

    // Store secret in a short-lived httpOnly cookie so the validate step can read it
    // signed as a pending token so it can't be tampered with
    const secretToken = await signPendingToken(
      { secret: secret.base32, userId: auth.userId },
      "10m"
    );

    const response = NextResponse.json({
      status: true,
      data: { twoFactorQR: qrCodeDataURL },
    });

    response.cookies.set("pending_2fa_secret", secretToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes to complete setup
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("2FA request error:", error);
    return NextResponse.json(
      { status: false, message: "Failed to generate 2FA secret" },
      { status: 500 }
    );
  }
}
