import { NextRequest, NextResponse } from "next/server";
import { logoutFirebase } from "@/lib/auth-firebase";
import { isFirebaseConfigured } from "@/lib/firebase";

export async function POST(request: NextRequest) {
  // Check if Firebase is configured
  if (!isFirebaseConfigured) {
    return NextResponse.json(
      { status: false, message: "Firebase authentication is not configured" },
      { status: 503 }
    );
  }

  try {
    // Logout from Firebase
    await logoutFirebase();

    // Create response
    const response = NextResponse.json({
      status: true,
      message: "Logged out successfully",
    });

    // Clear auth cookie
    response.cookies.delete("auth_token");

    return response;
  } catch (error: any) {
    console.error("Firebase logout error:", error);

    return NextResponse.json(
      {
        status: false,
        message: error.message || "Logout failed",
      },
      { status: 500 }
    );
  }
}
