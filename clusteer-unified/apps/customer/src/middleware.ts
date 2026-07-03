import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

async function verifyAuthToken(token: string): Promise<boolean> {
	try {
		if (!token || typeof token !== "string") return false;

		const parts = token.split(".");
		if (parts.length !== 3) return false;

		// Fail closed: if signature verification throws for any reason — bad
		// signature, expired token, or Firebase Admin being unreachable — the
		// token is treated as invalid. There must be no unverified fallback
		// decode here; that previously let a forged token with a future `exp`
		// and an arbitrary `user_id` pass whenever verifyIdToken merely errored.
		const { getAdminAuth } = await import("@/lib/firebase-admin");
		const auth = getAdminAuth();
		// checkRevoked: true so a session revoked by a password reset
		// (see invalidate-sessions/route.ts) is rejected even if the token's
		// own exp claim hasn't passed yet.
		const decodedToken = await auth.verifyIdToken(token, true);
		return !!decodedToken.uid;
	} catch (error) {
		console.error("Auth verification failed:", error);
		return false;
	}
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (PUBLIC_FILE.test(pathname)) return NextResponse.next();

	// Pre-launch gate: account creation is closed. Send /signup to the
	// early-access waitlist. /login stays open for internal testing.
	// Remove this block to re-open public signup.
	//
	// Preview bypass: an invited reviewer (e.g. compliance) reaches the live
	// signup flow via /signup?key=<WAITLIST_BYPASS_SECRET>. A valid key sets an
	// httpOnly cookie and we strip the key from the URL; the cookie then lets
	// them through on later navigation. Rotate WAITLIST_BYPASS_SECRET to revoke.
	if (pathname === "/signup" || pathname.startsWith("/signup/")) {
		const bypassSecret = process.env.WAITLIST_BYPASS_SECRET;
		if (bypassSecret) {
			const keyParam = request.nextUrl.searchParams.get("key");
			if (keyParam && keyParam === bypassSecret) {
				const response = NextResponse.redirect(new URL(pathname, request.url));
				response.cookies.set("cl_preview", bypassSecret, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "lax",
					maxAge: 60 * 60 * 24 * 30, // 30 days
					path: "/",
				});
				return response;
			}
			if (request.cookies.get("cl_preview")?.value === bypassSecret) {
				return NextResponse.next();
			}
		}
		return NextResponse.redirect(new URL("/early-access", request.url));
	}

	const publicPaths = [
		"/",
		"/login",
		"/early-access",
		"/signup",
		"/forgot-password",
		"/reset-password",
		"/verify-email",
		"/privacy-policy",
		"/terms-of-service",
	];

	if (publicPaths.includes(pathname)) return NextResponse.next();

	const userToken = request.cookies.get("auth_token")?.value;

	const protectedPaths = [
		"/dashboard",
		"/trade",
		"/request",
		"/orders",
		"/transaction-history",
		"/identity-verification",
		"/settings",
		"/billing",
		"/support",
		"/notifications",
		"/referrals",
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
