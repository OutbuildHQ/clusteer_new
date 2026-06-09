import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

async function verifyAdminToken(token: string): Promise<boolean> {
	try {
		if (!token || typeof token !== "string") return false;
		const parts = token.split(".");
		if (parts.length !== 3) return false;

		try {
			const { getAdminAuth } = await import("@/lib/firebase-admin");
			const auth = getAdminAuth();
			const decodedToken = await auth.verifyIdToken(token);
			if (!decodedToken.admin && !decodedToken.role?.includes("admin")) {
				return false;
			}
			return true;
		} catch {
			return false;
		}
	} catch (error) {
		console.error("Admin token verification failed:", error);
		return false;
	}
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (PUBLIC_FILE.test(pathname)) return NextResponse.next();

	if (pathname === "/login") return NextResponse.next();

	const adminToken = request.cookies.get("admin_token")?.value;

	if (!adminToken) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	const isValid = await verifyAdminToken(adminToken);
	if (!isValid) {
		const response = NextResponse.redirect(new URL("/login", request.url));
		response.cookies.delete("admin_token");
		return response;
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|robots.txt|.*\\..*).*)",
	],
};
