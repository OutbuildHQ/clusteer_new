import { NextRequest, NextResponse } from "next/server";
import { loginWithFirebase } from "@/lib/auth-firebase";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limiter";
import { isFirebaseConfigured } from "@/lib/firebase";

export async function POST(request: NextRequest) {
  // Check if Firebase is configured
  if (!isFirebaseConfigured) {
    return NextResponse.json(
      { status: false, message: "Firebase authentication is not configured" },
      { status: 503 }
    );
  }

  // Apply strict rate limiting (5 requests/minute)
  const rateLimitResponse = rateLimit(request, RateLimitPresets.strict);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { status: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Login with Firebase and get user profile from Spring Boot
    const { user, token } = await loginWithFirebase(email, password);

    // Create response
    const response = NextResponse.json({
      status: true,
      message: "Login successful",
      token,
      data: user,
    });

    // Set Firebase ID token as HttpOnly cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1 hour (Firebase tokens expire after 1 hour)
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Firebase login error:", error);

    return NextResponse.json(
      {
        status: false,
        message: error.message || "Login failed",
      },
      { status: 401 }
    );
  }
}
