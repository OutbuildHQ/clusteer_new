import { NextRequest, NextResponse } from "next/server";
import { resetPassword } from "@/lib/auth-firebase";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { status: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Send password reset email via Firebase
    await resetPassword(email);

    return NextResponse.json({
      status: true,
      message: "Password reset email sent. Please check your inbox.",
    });
  } catch (error: any) {
    console.error("Firebase password reset error:", error);

    return NextResponse.json(
      {
        status: false,
        message: error.message || "Failed to send password reset email",
      },
      { status: 400 }
    );
  }
}
