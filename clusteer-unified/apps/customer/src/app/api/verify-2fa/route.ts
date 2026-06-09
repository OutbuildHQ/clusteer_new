import { NextRequest, NextResponse } from "next/server";
import { verifyPendingToken } from "@/lib/auth";
import { djangoFetch } from "@/lib/api-helpers";
import { getAdminAuth } from "@/lib/firebase-admin";
import speakeasy from "speakeasy";

export async function POST(request: NextRequest) {
  try {
    // ── 1. Validate the pending_2fa_token cookie ────────────────────────────
    const cookieHeader = request.headers.get("cookie") || "";
    const pendingMatch = cookieHeader.match(/pending_2fa_token=([^;]+)/);
    if (!pendingMatch) {
      return NextResponse.json(
        { status: false, message: "Session expired. Please log in again." },
        { status: 401 }
      );
    }

    const pendingPayload = await verifyPendingToken(pendingMatch[1]);
    if (!pendingPayload || typeof pendingPayload.userId !== "string") {
      return NextResponse.json(
        { status: false, message: "Session expired. Please log in again." },
        { status: 401 }
      );
    }

    const userId = pendingPayload.userId as string;

    // ── 2. Get OTP from request body ────────────────────────────────────────
    const { code } = await request.json().catch(() => ({}));
    if (!code || typeof code !== "string" || code.length !== 6) {
      return NextResponse.json({ status: false, message: "Enter a valid 6-digit code" }, { status: 400 });
    }

    // ── 3. Fetch stored 2FA secret from Django ──────────────────────────────
    let secret: string | null = null;
    try {
      const r = await djangoFetch(`/user/${userId}/2fa/secret/`);
      if (r.ok) {
        const d = await r.json();
        secret = d.secret ?? null;
      }
    } catch {
      // Endpoint may not be live yet
    }

    if (!secret) {
      return NextResponse.json(
        { status: false, message: "2FA is not set up for this account. Please contact support." },
        { status: 400 }
      );
    }

    // ── 4. Verify TOTP ──────────────────────────────────────────────────────
    const verified = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    if (!verified) {
      return NextResponse.json({ status: false, message: "Incorrect code. Please try again." }, { status: 400 });
    }

    // ── 5. Get a fresh Firebase ID token for this user ──────────────────────
    // We use Firebase Admin to create a custom token, then exchange it for an ID token
    const adminAuth = getAdminAuth();
    const customToken = await adminAuth.createCustomToken(userId);

    // Exchange custom token for ID token via Firebase REST API
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const tokenRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: customToken, returnSecureToken: true }),
      }
    );

    if (!tokenRes.ok) {
      return NextResponse.json({ status: false, message: "Authentication failed. Please log in again." }, { status: 500 });
    }

    const tokenData = await tokenRes.json();
    const idToken: string = tokenData.idToken;

    // ── 6. Issue auth_token, clear pending_2fa_token ────────────────────────
    const response = NextResponse.json({ status: true, message: "2FA verified successfully" });

    response.cookies.set("auth_token", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600,
      path: "/",
    });

    response.cookies.set("pending_2fa_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "2FA verification failed";
    console.error("verify-2fa error:", error);
    return NextResponse.json({ status: false, message }, { status: 500 });
  }
}
