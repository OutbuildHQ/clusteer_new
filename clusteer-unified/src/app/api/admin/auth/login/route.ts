import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limiter";

export async function POST(request: NextRequest) {
	try {
		// Rate limiting — strict for admin login
		const rateLimitResponse = rateLimit(request, RateLimitPresets.strict);
		if (rateLimitResponse) {
			return rateLimitResponse;
		}

		let body;
		try {
			body = await request.json();
		} catch {
			return NextResponse.json(
				{ error: "Invalid request body" },
				{ status: 400 }
			);
		}

		const { idToken } = body;

		if (!idToken) {
			return NextResponse.json(
				{ error: "Firebase ID token is required" },
				{ status: 400 }
			);
		}

		// Verify the Firebase ID token server-side
		const { getAdminAuth } = await import("@/lib/firebase-admin");
		const auth = getAdminAuth();
		const decodedToken = await auth.verifyIdToken(idToken);

		// Check for admin custom claims
		const role = decodedToken.role as string | undefined;
		const isAdmin = decodedToken.admin === true || role === "super_admin" || role === "admin" || role === "moderator";

		if (!isAdmin) {
			return NextResponse.json(
				{ error: "Access denied. Admin privileges required." },
				{ status: 403 }
			);
		}

		// Set admin cookie with the verified Firebase token
		const cookieStore = await cookies();
		cookieStore.set("admin_token", idToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 60 * 60 * 8, // 8 hours
			path: "/admin",
		});

		return NextResponse.json({
			success: true,
			message: "Login successful",
			user: { email: decodedToken.email, role: role || "admin" },
		});
	} catch (error) {
		console.error("Admin login error:", error);
		return NextResponse.json(
			{ error: "Authentication failed" },
			{ status: 401 }
		);
	}
}
