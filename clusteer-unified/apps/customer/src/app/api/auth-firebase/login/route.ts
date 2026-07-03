import { NextRequest, NextResponse } from "next/server";
import { loginWithFirebase } from "@/lib/auth-firebase";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limiter";
import { isFirebaseConfigured } from "@/lib/firebase";

export async function POST(request: NextRequest) {
  if (!isFirebaseConfigured) {
    return NextResponse.json(
      { status: false, message: "Firebase authentication is not configured" },
      { status: 503 }
    );
  }

  const rateLimitResponse = await rateLimit(request, RateLimitPresets.strict);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    let body: { email?: string; password?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ status: false, message: "Invalid request body" }, { status: 400 });
    }

    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        { status: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const { token } = await loginWithFirebase(email, password);

    // ── 1. Email verification gate (bypassed until Resend is configured) ────
    // TODO: re-enable once Resend email service is active
    // if (!firebaseUser.emailVerified) { ... }

    // 2FA was removed (2026-07-03) — no second factor exists on the backend,
    // email verification above is the only gate. See Module D decision in
    // docs/RELEASE_READINESS_REMEDIATION.md.

    // ── 2. Normal login ─────────────────────────────────────────────────────
    const response = NextResponse.json({
      status: true,
      message: "Login successful",
      token,
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    console.error("Firebase login error:", error);
    return NextResponse.json({ status: false, message }, { status: 401 });
  }
}
