import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, djangoFetch } from "@/lib/api-helpers";
import { getAdminAuth } from "@/lib/firebase-admin";

export async function DELETE(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });
    }

    const { userId } = auth;

    // Delete user data from Django (non-blocking if endpoint not yet live)
    try {
      await djangoFetch(`/user/${userId}/delete/`, { method: "DELETE" });
    } catch (err) {
      console.warn("Django user delete failed (non-blocking):", err);
    }

    // Delete Firebase Auth account
    const adminAuth = getAdminAuth();
    await adminAuth.deleteUser(userId);

    // Clear auth cookie
    const response = NextResponse.json({ status: true, message: "Account deleted successfully" });
    response.cookies.set("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { status: false, message: "Failed to delete account. Please try again." },
      { status: 500 }
    );
  }
}
