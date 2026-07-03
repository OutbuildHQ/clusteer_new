import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, revokeUserSessions } from "@/lib/firebase-admin";
import { isFirebaseConfigured } from "@/lib/firebase";

// Called after a client-side password reset (confirmPasswordReset) completes,
// so any session issued before the reset stops working — otherwise the old
// auth_token stays valid until its natural 1-hour expiry.
export async function POST(request: NextRequest) {
	if (!isFirebaseConfigured) {
		return NextResponse.json(
			{ status: false, message: "Firebase authentication is not configured" },
			{ status: 503 }
		);
	}

	try {
		const { email } = await request.json();
		if (!email) {
			return NextResponse.json({ status: false, message: "Email is required" }, { status: 400 });
		}

		const user = await getUserByEmail(email);
		if (user) {
			await revokeUserSessions(user.uid);
		}

		const response = NextResponse.json({ status: true });
		response.cookies.delete("auth_token");
		return response;
	} catch (error) {
		console.error("Invalidate sessions error:", error);
		// Best-effort — still clear this browser's cookie even if revocation failed.
		const response = NextResponse.json({ status: false, message: "Failed to invalidate sessions" }, { status: 500 });
		response.cookies.delete("auth_token");
		return response;
	}
}
