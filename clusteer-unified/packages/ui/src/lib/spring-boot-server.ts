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

// Deliberately does NOT contain "auth_token" as a substring — api-helpers.ts's
// getAuthFromRequest regex-matches "auth_token=", and an earlier version of
// this cookie (spring_auth_token) collided with it, corrupting the primary
// Firebase auth check. Keep any future rename equally distinct.
export const SPRING_SESSION_COOKIE = "spring_session";
// Marks a browser where a real (non-transient) Spring login rejection has
// already happened, so login never auto-retries springLogin for it again.
// Spring deactivates an account after 3 failed login attempts with no
// automatic reset — see springLogin's doc comment — so silently retrying on
// every future login (e.g. every hourly auth_token refresh) guarantees an
// eventual lockout for any user whose Spring-side password has drifted out
// of sync (e.g. after a Firebase-only password reset). One recorded failure
// permanently opts a browser out of further attempts until this cookie is
// cleared some other way (there is currently no UI to do that on purpose —
// see the RRR doc's auth-bridge gaps).
export const SPRING_BRIDGE_BLOCKED_COOKIE = "spring_bridge_blocked";

export type SpringLoginResult =
	| { ok: true; accessToken: string }
	// Spring responded and said no — this IS the account, but the login was
	// genuinely rejected (wrong password, locked, etc). Callers must not
	// retry this automatically.
	| { ok: false; reason: "rejected" }
	// Spring responded 400 — no account exists for this email at all.
	| { ok: false; reason: "not_found" }
	// Never got a clean, decodable response from Spring (network error,
	// timeout, malformed JSON, unexpected shape). Transient by nature —
	// safe to retry on a later login, unlike "rejected".
	| { ok: false; reason: "network_error" };

/**
 * Authenticate against Spring's own login (POST /v1/user/login), issuing a
 * Spring-signed JWT distinct from the Firebase ID token this app otherwise
 * uses. Spring's JwtAuthenticationFilter only accepts its own HS256 tokens —
 * a Firebase token passed as Bearer auth fails signature verification — so
 * any customer-facing Spring call needs this token instead of auth_token.
 *
 * Only reliably distinguishes "no Spring account for this email" (400) from
 * a genuine login rejection (any other non-ok status) — Spring's own error
 * handling doesn't expose a cleaner signal for e.g. wrong-password vs locked
 * account (see docs/RELEASE_READINESS_REMEDIATION.md, Module H auth-bridge
 * finding). CALLERS MUST NOT retry a "rejected" result automatically — see
 * SPRING_BRIDGE_BLOCKED_COOKIE.
 *
 * If Spring-side 2FA/email-factor is ever enabled for an account, Spring
 * returns success:true with no accessToken (a pending-2FA state this bridge
 * doesn't handle) — that currently surfaces as "network_error" here, since
 * no accessToken means no clean success. Dormant today: nothing in this app
 * enables Spring-side 2FA for any customer.
 */
export async function springLogin(email: string, password: string): Promise<SpringLoginResult> {
	let res: Response;
	try {
		res = await springFetch("/user/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
		});
	} catch (error) {
		console.error("[spring-boot-server] springLogin request failed:", error);
		return { ok: false, reason: "network_error" };
	}

	if (!res.ok) {
		return { ok: false, reason: res.status === 400 ? "not_found" : "rejected" };
	}

	try {
		const json = await res.json();
		const accessToken = json?.responseData?.accessToken;
		if (!accessToken) return { ok: false, reason: "network_error" };
		return { ok: true, accessToken };
	} catch (error) {
		console.error("[spring-boot-server] springLogin response parse failed:", error);
		return { ok: false, reason: "network_error" };
	}
}

/** Extract a single cookie's value, anchored so it can't match as a
 * substring of a differently-named cookie sharing a suffix (e.g.
 * "spring_session" must not match inside a hypothetical "other_session"). */
function readCookie(request: Request, name: string): string | null {
	const cookieHeader = request.headers.get("cookie") || "";
	const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
	return match ? match[1] : null;
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
	return readCookie(request, SPRING_SESSION_COOKIE);
}

/** True if this browser already recorded a genuine Spring login rejection —
 * login must not attempt springLogin again when this is set. */
export function isSpringBridgeBlocked(request: Request): boolean {
	return readCookie(request, SPRING_BRIDGE_BLOCKED_COOKIE) === "1";
}
