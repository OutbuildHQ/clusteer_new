import { NextRequest, NextResponse } from "next/server";
import { logoutFirebase } from "@/lib/auth-firebase";
import { isFirebaseConfigured } from "@/lib/firebase";
import { springFetch, getSpringTokenFromRequest, SPRING_SESSION_COOKIE } from "@/lib/spring-boot-server";

export async function POST(request: NextRequest) {
  // Check if Firebase is configured
  if (!isFirebaseConfigured) {
    return NextResponse.json(
      { status: false, message: "Firebase authentication is not configured" },
      { status: 503 }
    );
  }

  // Logout from Firebase — best-effort. A throw here (e.g. from a transient
  // upstream issue) must not skip the Spring logout attempt or leave either
  // session cookie in place; the user still needs to be logged out locally.
  try {
    await logoutFirebase();
  } catch (error) {
    console.error("Firebase logout error:", error);
  }

  // Also invalidate the Spring-side session (PUT /v1/user/logout clears
  // security.token, so the bridge JWT stops passing isTokenValid checks)
  // — best-effort, a user without a Spring session has nothing to clear.
  const springToken = getSpringTokenFromRequest(request);
  if (springToken) {
    try {
      await springFetch("/user/logout", { method: "PUT" }, springToken);
    } catch (error) {
      console.error("Spring logout error:", error);
    }
  }

  // Create response
  const response = NextResponse.json({
    status: true,
    message: "Logged out successfully",
  });

  // Clear auth cookies
  response.cookies.delete("auth_token");
  response.cookies.delete(SPRING_SESSION_COOKIE);

  return response;
}
