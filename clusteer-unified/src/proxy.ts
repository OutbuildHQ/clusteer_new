import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

/**
 * Verify Firebase auth token (JWT) using Firebase Admin SDK
 * Performs full cryptographic signature verification
 */
async function verifyAuthToken(token: string): Promise<boolean> {
	try {
		if (!token || typeof token !== "string") {
			return false;
		}

		const parts = token.split(".");
		if (parts.length !== 3) {
			return false;
		}

		// Verify via Firebase Admin SDK (full cryptographic signature check)
		try {
			const { getAdminAuth } = await import("@/lib/firebase-admin");
			const auth = getAdminAuth();
			const decodedToken = await auth.verifyIdToken(token);
			return !!decodedToken.uid;
		} catch {
			// Firebase Admin unavailable — fail closed. Do NOT fall back to
			// expiry-only checks: an unsigned token could bypass auth.
			return false;
		}
	} catch (error) {
		console.error("Auth verification failed:", error);
		return false;
	}
}

/**
 * Verify admin session token using Firebase Admin SDK custom claims
 * Admin users must have the "admin" custom claim set on their Firebase account
 */
async function verifyAdminToken(token: string): Promise<boolean> {
	try {
		if (!token || typeof token !== "string") {
			return false;
		}

		const parts = token.split(".");
		if (parts.length !== 3) {
			return false;
		}

		try {
			const { getAdminAuth } = await import("@/lib/firebase-admin");
			const auth = getAdminAuth();
			const decodedToken = await auth.verifyIdToken(token);
			// Verify admin role via custom claims
			if (!decodedToken.admin && !decodedToken.role?.includes("admin")) {
				return false;
			}
			return true;
		} catch {
			// Firebase Admin unavailable — fail closed for admin routes.
			return false;
		}
	} catch (error) {
		console.error("Admin token verification failed:", error);
		return false;
	}
}

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (PUBLIC_FILE.test(pathname)) {
		return NextResponse.next();
	}

	// Public paths (no authentication required)
	const publicPaths = [
		"/",
		"/login",
		"/signup",
		"/forgot-password",
		"/reset-password",
		"/change-password",
		"/verify-otp",
		"/verify-email",
		"/security-info",
		"/privacy-policy",
		"/terms-of-service",
		"/auth/callback",
		"/admin/login", // Admin login is public
	];

	if (publicPaths.includes(pathname)) {
		return NextResponse.next();
	}

	// Admin routes - use separate admin_token cookie
	if (pathname.startsWith("/admin")) {
		const adminToken = request.cookies.get("admin_token")?.value;

		if (!adminToken) {
			return NextResponse.redirect(new URL("/admin/login", request.url));
		}

		const isValidAdmin = await verifyAdminToken(adminToken);

		if (!isValidAdmin) {
			// Admin session is invalid or expired
			const response = NextResponse.redirect(new URL("/admin/login", request.url));
			response.cookies.delete("admin_token");
			return response;
		}

		// Admin is authenticated
		return NextResponse.next();
	}

	// Regular user routes - use auth_token cookie
	const userToken = request.cookies.get("auth_token")?.value;

	// Protected routes - dashboard and related pages require user authentication
	const protectedPaths = [
		"/dashboard",
		"/profile",
		"/security",
		"/assets",
		"/trade",
		"/send",
		"/receive",
		"/request",
		"/orders",
		"/transactions",
		"/transaction-history",
		"/identity-verification",
		"/wallet",
		"/settings",
		"/billing",
		"/support",
		"/notifications",
		"/bank-accounts",
		"/markets",
	];

	const isProtectedRoute = protectedPaths.some((path) => pathname.startsWith(path));

	// If not a protected route, allow access
	if (!isProtectedRoute) {
		return NextResponse.next();
	}

	// Protected routes - require user authentication
	if (!userToken) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// Verify user token validity
	const isValidUser = await verifyAuthToken(userToken);
	if (!isValidUser) {
		// User token is invalid or expired - clear cookie and redirect to login
		const response = NextResponse.redirect(new URL("/login", request.url));
		response.cookies.delete("auth_token");
		return response;
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
	],
};
