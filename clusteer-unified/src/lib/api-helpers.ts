/**
 * Shared helpers for Next.js API routes that proxy to Django.
 * Eliminates duplicated JWT decoding and Django fetch logic across 10+ route files.
 */

const DJANGO_BASE = process.env.BLOCKCHAIN_ENGINE_URL || "http://localhost:8000";
const DJANGO_API_KEY = process.env.BLOCKCHAIN_ENGINE_API_KEY || process.env.NEXT_PUBLIC_BLOCKCHAIN_ENGINE_API_KEY || "";

if (!DJANGO_API_KEY) {
	console.warn("[api-helpers] BLOCKCHAIN_ENGINE_API_KEY not configured — Django requests will fail");
}

/**
 * Decode Firebase JWT payload to extract user_id.
 * No verification needed — middleware already validated the token.
 */
export function getUserIdFromToken(token: string): string | null {
	try {
		const parts = token.split(".");
		if (parts.length !== 3) return null;
		const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
		return payload.user_id || payload.sub || null;
	} catch {
		return null;
	}
}

/**
 * Extract auth_token from request cookies and decode user ID.
 * Returns { userId, token } or null if no valid token.
 */
export function getAuthFromRequest(request: Request): { userId: string; token: string } | null {
	const cookieHeader = request.headers.get("cookie") || "";
	const match = cookieHeader.match(/auth_token=([^;]+)/);
	if (!match) return null;

	const token = match[1];
	const userId = getUserIdFromToken(token);
	if (!userId) return null;

	return { userId, token };
}

/**
 * Fetch from Django Blockchain Engine with API key header.
 * Automatically prepends /api/v1/ to the path.
 */
export async function djangoFetch(
	path: string,
	options: RequestInit = {}
): Promise<Response> {
	const url = `${DJANGO_BASE}/api/v1${path.startsWith("/") ? path : `/${path}`}`;

	return fetch(url, {
		...options,
		headers: {
			"Content-Type": "application/json",
			"X-API-KEY": DJANGO_API_KEY,
			...(options.headers || {}),
		},
	});
}

/**
 * Django base URL for server-side routes.
 */
export const DJANGO_URL = DJANGO_BASE;

/**
 * Django API key for server-side routes.
 */
export const API_KEY = DJANGO_API_KEY;
