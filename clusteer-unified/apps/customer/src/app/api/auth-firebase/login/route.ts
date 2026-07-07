import { NextRequest, NextResponse } from "next/server";
import { loginWithFirebase } from "@/lib/auth-firebase";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limiter";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  springLogin,
  getSpringTokenFromRequest,
  isSpringBridgeBlocked,
  SPRING_SESSION_COOKIE,
  SPRING_BRIDGE_BLOCKED_COOKIE,
} from "@/lib/spring-boot-server";

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

    // ── 3. Auth bridge: also authenticate against Spring, so Spring-calling
    // routes (API keys, eventually trade/orders) have a token that actually
    // passes its JwtAuthenticationFilter — a Firebase ID token never will.
    // Best-effort and non-fatal: a user with no (or out-of-sync) Spring
    // account still gets a normal Firebase session; they just can't reach
    // Spring-backed features until reconciled.
    //
    // Only attempted when there's a reason to: skip entirely if this browser
    // already has a live Spring session (auth_token expires hourly and forces
    // frequent re-logins — re-calling springLogin on every single one would
    // be both wasteful and, more importantly, dangerous, see below) or if a
    // prior login already recorded a real rejection from Spring. Spring
    // deactivates an account after 3 failed login attempts with no automatic
    // reset — if this ran unconditionally on every login, any user whose
    // Spring-side password has drifted out of sync with Firebase (e.g. after
    // a Firebase-only password reset — Spring has no way to be told about
    // that today) would rack up one failed Spring attempt per re-login and
    // eventually get their Spring account locked purely by continuing to use
    // the app normally. A "rejected" result is therefore recorded and never
    // auto-retried; only a genuinely transient failure (network/parse error)
    // is safe to retry on a later login.
    if (!getSpringTokenFromRequest(request) && !isSpringBridgeBlocked(request)) {
      try {
        const springResult = await springLogin(email, password);
        if (springResult.ok) {
          response.cookies.set(SPRING_SESSION_COOKIE, springResult.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30, // matches Spring's own 30-day token expiry
            path: "/",
          });
        } else {
          console.warn(`[login] Spring auth bridge failed for ${email}: ${springResult.reason}`);
          if (springResult.reason === "rejected") {
            response.cookies.set(SPRING_BRIDGE_BLOCKED_COOKIE, "1", {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 60 * 60 * 24 * 30,
              path: "/",
            });
          }
        }
      } catch (error) {
        console.error("[login] Spring auth bridge threw:", error);
      }
    }

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    console.error("Firebase login error:", error);
    return NextResponse.json({ status: false, message }, { status: 401 });
  }
}
