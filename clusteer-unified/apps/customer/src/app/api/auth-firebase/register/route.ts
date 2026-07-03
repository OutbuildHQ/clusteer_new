import { NextRequest, NextResponse } from "next/server";
import { registerWithFirebase } from "@/lib/auth-firebase";
import { isFirebaseConfigured } from "@/lib/firebase";
import { springFetch } from "@/lib/spring-boot-server";

export async function POST(request: NextRequest) {
  // Rate limiting
  const { rateLimit, RateLimitPresets } = await import("@/lib/rate-limiter");
  const rateLimitResponse = await rateLimit(request, RateLimitPresets.strict);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // Pre-launch waitlist gate — mirror the /signup → /early-access page gate at the API
  // layer so registration can't be driven by a direct POST while signup is closed.
  // Set SIGNUP_OPEN=true at public launch to lift this. Invited reviewers pass via the
  // cl_preview cookie set by /signup?key=<WAITLIST_BYPASS_SECRET>.
  const bypassSecret = process.env.WAITLIST_BYPASS_SECRET;
  const hasPreviewAccess =
    !!bypassSecret && request.cookies.get("cl_preview")?.value === bypassSecret;
  if (process.env.SIGNUP_OPEN !== "true" && !hasPreviewAccess) {
    return NextResponse.json(
      { status: false, message: "Signups aren't open yet — join the waitlist at /early-access." },
      { status: 403 }
    );
  }

  // Check if Firebase is configured
  if (!isFirebaseConfigured) {
    return NextResponse.json(
      { status: false, message: "Firebase authentication is not configured" },
      { status: 503 }
    );
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { status: false, message: "Invalid request body" },
        { status: 400 }
      );
    }
    const { username, email, phone, password } = body;

    // Validate input
    if (!username || !email || !phone || !password) {
      return NextResponse.json(
        { status: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Register with Firebase and create profile in Spring Boot
    const { user, token } = await registerWithFirebase({
      username,
      email,
      phone,
      password,
    });

    // Create the user record in the Clusteer-Api backend. Firebase holds the
    // credential; the backend holds the profile/KYC, linked by email. Legal
    // name is collected later at KYC, so register only needs the basics.
    try {
      const res = await springFetch("/user/register", {
        method: "POST",
        body: JSON.stringify({ username, email, phone, password }),
      });
      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        console.error("[register] backend record creation failed:", res.status, detail);
      }
    } catch (e) {
      console.error("[register] backend register error (non-blocking):", e);
    }

    return NextResponse.json({
      status: true,
      message: "Registration successful! Please check your email to verify your account.",
      data: {
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    console.error("Firebase registration error:", error);

    return NextResponse.json(
      {
        status: false,
        message: error.message || "Registration failed",
      },
      { status: 400 }
    );
  }
}
