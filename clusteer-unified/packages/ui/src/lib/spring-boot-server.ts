/**
 * Server-side fetch utility for Spring Boot API (Clusteer-Api).
 * Used by Next.js API routes to proxy requests.
 * Mirrors the djangoFetch() pattern in api-helpers.ts.
 */

// Prefer the absolute server-side backend URL (SPRING_BOOT_URL → Cloud Run).
// NEXT_PUBLIC_API_URL is "/api" for the browser→Next routes and is only a
// last-resort fallback here, since a relative base can't be fetched server-side.
const SPRING_BASE =
	process.env.SPRING_BOOT_URL ||
	process.env.NEXT_PUBLIC_API_URL ||
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

export type SpringLoginResult =
	| { ok: true; accessToken: string }
	| { ok: false; reason: "not_found" | "error" };

/**
 * Authenticate against Spring's own login (POST /v1/user/login), issuing a
 * Spring-signed JWT distinct from the Firebase ID token this app otherwise
 * uses. Spring's JwtAuthenticationFilter only accepts its own HS256 tokens —
 * a Firebase token passed as Bearer auth fails signature verification — so
 * any customer-facing Spring call needs this token instead of auth_token.
 *
 * Only reliably distinguishes "no Spring account for this email" (400) from
 * every other failure (bad password, locked account, 500) — Spring's own
 * error handling doesn't expose a cleaner signal (see
 * docs/RELEASE_READINESS_REMEDIATION.md, Module H auth-bridge finding).
 * Never retried automatically: Spring deactivates an account after 3 failed
 * login attempts, so callers must not loop this on failure.
 */
export async function springLogin(email: string, password: string): Promise<SpringLoginResult> {
	try {
		const res = await springFetch("/user/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
		});
		if (!res.ok) {
			return { ok: false, reason: res.status === 400 ? "not_found" : "error" };
		}
		const json = await res.json();
		const accessToken = json?.responseData?.accessToken;
		if (!accessToken) return { ok: false, reason: "error" };
		return { ok: true, accessToken };
	} catch (error) {
		console.error("[spring-boot-server] springLogin failed:", error);
		return { ok: false, reason: "error" };
	}
}

/**
 * Read the Spring bridge token from a request's cookies. Returns null if the
 * user has no Spring session — either they haven't logged in since the
 * bridge was added, or the bridge login failed for them (see springLogin's
 * doc comment). Callers must treat null as "Spring-backed feature
 * unavailable for this user," not as an auth error — the user's primary
 * (Firebase) session may still be perfectly valid.
 */
export function getSpringTokenFromRequest(request: Request): string | null {
	const cookieHeader = request.headers.get("cookie") || "";
	const match = cookieHeader.match(/spring_auth_token=([^;]+)/);
	return match ? match[1] : null;
}
