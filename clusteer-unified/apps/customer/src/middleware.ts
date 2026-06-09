import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

async function verifyAuthToken(token: string): Promise<boolean> {
	try {
		if (!token || typeof token !== "string") return false;

		const parts = token.split(".");
		if (parts.length !== 3) return false;

		try {
			const { getAdminAuth } = await import("@/lib/firebase-admin");
			const auth = getAdminAuth();
			const decodedToken = await auth.verifyIdToken(token);
			return !!decodedToken.uid;
		} catch {
			try {
				const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
				const exp = payload.exp;
				if (exp && typeof exp === "number") {
					return exp * 1000 > Date.now();
				}
				return !!payload.user_id || !!payload.sub;
			} catch {
				return false;
			}
		}
	} catch (error) {
		console.error("Auth verification failed:", error);
		return false;
	}
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (PUBLIC_FILE.test(pathname)) return NextResponse.next();

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
	];

	if (publicPaths.includes(pathname)) return NextResponse.next();

	const userToken = request.cookies.get("auth_token")?.value;

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

	if (!isProtectedRoute) return NextResponse.next();

	if (!userToken) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	const isValid = await verifyAuthToken(userToken);
	if (!isValid) {
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
