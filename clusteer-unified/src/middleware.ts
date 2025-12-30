import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

/**
 * Verify Firebase auth token (JWT) for regular users
 * For now, just check if token exists - full verification will be done by Spring Boot API
 */
async function verifyAuthToken(token: string): Promise<boolean> {
	try {
		// Basic check: token should be a valid JWT format (header.payload.signature)
		if (!token || typeof token !== 'string') {
			return false;
		}

		const parts = token.split('.');
		if (parts.length !== 3) {
			return false;
		}

		// Decode payload to check expiration
		const payload = JSON.parse(
			Buffer.from(parts[1], "base64").toString("utf-8")
		);

		// Check if token is expired
		const now = Math.floor(Date.now() / 1000);
		if (payload.exp && payload.exp < now) {
			return false;
		}

		// Token format is valid - actual verification happens in API calls
		// Firebase tokens are verified by Spring Boot backend
		return true;
	} catch (error) {
		console.error("Auth verification failed:", error);
		return false;
	}
}

/**
 * Verify admin session token (separate from user auth)
 */
async function verifyAdminToken(token: string): Promise<boolean> {
	try {
		if (!token || typeof token !== 'string') {
			return false;
		}

		// Decode admin session token
		const sessionData = JSON.parse(
			Buffer.from(token, "base64").toString("utf-8")
		);

		// Verify it's an admin role
		if (sessionData.role !== "admin") {
			return false;
		}

		// Check session age (8 hours max)
		const loginTime = new Date(sessionData.loginTime).getTime();
		const now = Date.now();
		const eightHours = 8 * 60 * 60 * 1000;

		if (now - loginTime > eightHours) {
			return false; // Session expired
		}

		return true;
	} catch (error) {
		console.error("Admin token verification failed:", error);
		return false;
	}
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (PUBLIC_FILE.test(pathname)) {
		return NextResponse.next();
	}

	// Public paths (no authentication required)
	const publicPaths = [
		"/",
		"/login",
		"/signup",
		"/reset-password",
		"/change-password",
		"/verify-otp",
		"/verify-email",
		"/security-info",
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
		"/transaction-history",
		"/identity-verification",
		"/wallet",
		"/settings",
		"/billing",
		"/help",
		"/notifications",
		"/bank-accounts",
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
