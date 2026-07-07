import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, revokeUserSessions } from "@/lib/firebase-admin";
import { isFirebaseConfigured } from "@/lib/firebase";
import { SPRING_SESSION_COOKIE } from "@/lib/spring-boot-server";

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

		// Also clear the Spring bridge cookie: it's now stale (Spring's own
		// password hash is untouched by a Firebase-only reset — see the Module H
		// auth-bridge finding in the RRR doc for why that can't be fixed here),
		// so keeping it around would let this browser make Spring calls under a
		// token whose underlying credential no longer matches Firebase's.
		const response = NextResponse.json({ status: true });
		response.cookies.delete("auth_token");
		response.cookies.delete(SPRING_SESSION_COOKIE);
		return response;
	} catch (error) {
		console.error("Invalidate sessions error:", error);
		// Best-effort — still clear this browser's cookies even if revocation failed.
		const response = NextResponse.json({ status: false, message: "Failed to invalidate sessions" }, { status: 500 });
		response.cookies.delete("auth_token");
		response.cookies.delete(SPRING_SESSION_COOKIE);
		return response;
	}
}
