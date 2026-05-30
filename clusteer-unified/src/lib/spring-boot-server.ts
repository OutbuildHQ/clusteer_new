/**
 * Server-side fetch utility for Spring Boot API (Clusteer-Api).
 * Used by Next.js API routes to proxy requests.
 * Mirrors the djangoFetch() pattern in api-helpers.ts.
 */

const SPRING_BASE =
	process.env.NEXT_PUBLIC_API_URL ||
	process.env.SPRING_BOOT_URL ||
	"http://localhost:8080/api";

const SPRING_API_KEY =
	process.env.SPRING_BOOT_API_KEY ||
	process.env.NEXT_PUBLIC_SPRING_BOOT_API_KEY ||
	"";

if (!SPRING_API_KEY) {
	console.warn("[spring-boot-server] SPRING_BOOT_API_KEY not configured — requests will fail");
}

export async function springFetch(
	path: string,
	options: RequestInit = {},
	userToken?: string,
): Promise<Response> {
	const url = `${SPRING_BASE}/v1${path.startsWith("/") ? path : `/${path}`}`;

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		"X-API-KEY": SPRING_API_KEY,
		...(options.headers as Record<string, string> || {}),
	};

	if (userToken) {
		headers["Authorization"] = `Bearer ${userToken}`;
	}

	return fetch(url, {
		...options,
		headers,
	});
}

export const SPRING_URL = SPRING_BASE;
