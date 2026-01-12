import { NextRequest, NextResponse } from "next/server";
import { registerWithFirebase } from "@/lib/auth-firebase";
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
    const { username, email, phone, password } = await request.json();

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
