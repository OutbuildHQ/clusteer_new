import { NextRequest, NextResponse } from "next/server";
import { loginWithFirebase } from "@/lib/auth-firebase";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limiter";
import { isFirebaseConfigured } from "@/lib/firebase";
import { djangoFetch } from "@/lib/api-helpers";
import { signPendingToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!isFirebaseConfigured) {
    return NextResponse.json(
      { status: false, message: "Firebase authentication is not configured" },
      { status: 503 }
    );
  }

  const rateLimitResponse = rateLimit(request, RateLimitPresets.strict);
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

    const { firebaseUser, token } = await loginWithFirebase(email, password);

    // ── 1. Email verification gate ──────────────────────────────────────────
    if (!firebaseUser.emailVerified) {
      return NextResponse.json(
        {
          status: false,
          requiresEmailVerification: true,
          message: "Please verify your email before logging in. Check your inbox for the verification link.",
        },
        { status: 403 }
      );
    }

    // ── 2. 2FA check ────────────────────────────────────────────────────────
    const userId = firebaseUser.uid;
    let twoFactorEnabled = false;
    try {
      const r = await djangoFetch(`/user/${userId}/2fa/status/`);
      if (r.ok) {
        const d = await r.json();
        twoFactorEnabled = d.enabled === true;
      }
    } catch {
      // Django endpoint may not exist yet — default to disabled
    }

    if (twoFactorEnabled) {
      const pendingToken = await signPendingToken({ userId, email }, "5m");
      const response = NextResponse.json({
        status: true,
        requiresTwoFactor: true,
        message: "2FA verification required",
      });
      response.cookies.set("pending_2fa_token", pendingToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 300,
        path: "/",
      });
      return response;
    }

    // ── 3. Normal login ─────────────────────────────────────────────────────
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
