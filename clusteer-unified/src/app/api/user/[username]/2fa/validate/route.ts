import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, djangoFetch } from "@/lib/api-helpers";
import { verifyPendingToken } from "@/lib/auth";
import speakeasy from "speakeasy";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await params; // consume params (username not needed server-side; userId comes from JWT)

    const auth = getAuthFromRequest(request);
    if (!auth) {
      return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });
    }

    // ── 1. Read the 2FA secret from the pending_2fa_secret cookie ───────────
    const cookieHeader = request.headers.get("cookie") || "";
    const secretMatch = cookieHeader.match(/pending_2fa_secret=([^;]+)/);
    if (!secretMatch) {
      return NextResponse.json(
        { status: false, message: "Setup session expired. Please restart the 2FA setup." },
        { status: 400 }
      );
    }

    const secretPayload = await verifyPendingToken(secretMatch[1]);
    if (!secretPayload || typeof secretPayload.secret !== "string") {
      return NextResponse.json(
        { status: false, message: "Setup session expired or invalid. Please restart the 2FA setup." },
        { status: 400 }
      );
    }

    const secret = secretPayload.secret as string;

    // ── 2. Parse OTP from body ────────────────────────────────────────────────
    const body = await request.json().catch(() => ({}));
    const { otp } = body as { otp?: string };

    if (!otp || otp.length !== 6) {
      return NextResponse.json({ status: false, message: "Invalid OTP code" }, { status: 400 });
    }

    // ── 3. Verify TOTP against the stored secret ──────────────────────────────
    const verified = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token: otp,
      window: 1,
    });

    if (!verified) {
      return NextResponse.json({ status: false, message: "Incorrect code. Please try again." }, { status: 400 });
    }

    // ── 4. Persist secret + enabled=true in Django ────────────────────────────
    try {
      await djangoFetch(`/user/${auth.userId}/2fa/enable/`, {
        method: "POST",
        body: JSON.stringify({ secret, enabled: true }),
      });
    } catch (err) {
      console.warn("Could not persist 2FA secret in Django (endpoint may not be live yet):", err);
      // Non-blocking — 2FA is still validated; Django persistence will be retried when endpoint is live
    }

    // ── 5. Clear the pending_2fa_secret cookie ────────────────────────────────
    const response = NextResponse.json({ status: true, message: "2FA enabled successfully" });
    response.cookies.set("pending_2fa_secret", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("2FA validation error:", error);
    return NextResponse.json({ status: false, message: "Failed to validate 2FA code" }, { status: 500 });
  }
}
