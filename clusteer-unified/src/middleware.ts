import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const PUBLIC_FILE = /\.(.*)$/;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Verify Supabase auth token
 */
async function verifyAuthToken(token: string): Promise<boolean> {
	try {
		const supabase = createClient(supabaseUrl, supabaseAnonKey);

		const { data: { user }, error } = await supabase.auth.getUser(token);

		if (error || !user) {
			return false;
		}

		return true;
	} catch (error) {
		console.error("Auth verification failed:", error);
		return false;
	}
}

export async function middleware(request: NextRequest) {
	const token = request.cookies.get("auth_token")?.value;
	const { pathname } = request.nextUrl;

	if (PUBLIC_FILE.test(pathname)) {
		return NextResponse.next();
	}

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
	];

	if (publicPaths.includes(pathname)) {
		return NextResponse.next();
	}

	// Protected routes - dashboard and related pages require authentication
	const protectedPaths = [
		"/dashboard",
		"/profile",
		"/security",
		"/assets",
		"/transaction-history",
		"/identity-verification",
	];

	const isProtectedRoute = protectedPaths.some((path) => pathname.startsWith(path));

	// If not a protected route, allow access
	if (!isProtectedRoute) {
		return NextResponse.next();
	}

	// Protected routes - require authentication
	if (!token) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// Verify token validity
	const isValid = await verifyAuthToken(token);
	if (!isValid) {
		// Token is invalid or expired - clear cookie and redirect to login
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
