/**
 * Live system status — real reachability probes, not hardcoded.
 *
 * We can definitively verify the public-facing dependencies (this web app,
 * Firebase Auth, the Realtime Database). The Spring Boot backend and the
 * blockchain engine sit behind private/unset URLs, so a failed probe there
 * means "can't verify from here", not "down" — those degrade to "pre-launch"
 * rather than showing a misleading red. Result is cached ~60s per instance.
 */

export type ServiceStatus = "operational" | "degraded" | "down" | "pre-launch";

export type ServiceCheck = {
	key: string;
	name: string;
	description: string;
	status: ServiceStatus;
	latencyMs: number | null;
};

export type SystemStatus = {
	overall: "operational" | "degraded" | "down";
	services: ServiceCheck[];
	checkedAt: string;
	apiLatencyMs: number | null;
	operationalCount: number;
	monitoredCount: number;
};

const TIMEOUT_MS = 4000;
const DEGRADED_MS = 2000;
const CACHE_MS = 60_000;

async function probe(url: string): Promise<{ ok: boolean; ms: number }> {
	const t0 = Date.now();
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
	try {
		// HEAD where possible; any HTTP response (incl. 401/403/404) = reachable.
		const res = await fetch(url, { method: "GET", signal: ctrl.signal, cache: "no-store" });
		clearTimeout(timer);
		return { ok: res.status > 0, ms: Date.now() - t0 };
	} catch {
		clearTimeout(timer);
		return { ok: false, ms: Date.now() - t0 };
	}
}

/** failMode: how to read an unreachable probe — public deps are truly "down",
 *  private/unverifiable deps fall back to "pre-launch". */
function classify(r: { ok: boolean; ms: number } | null, failMode: ServiceStatus): ServiceStatus {
	if (!r) return "pre-launch";
	if (!r.ok) return failMode;
	return r.ms > DEGRADED_MS ? "degraded" : "operational";
}

let cache: { at: number; data: SystemStatus } | null = null;

export async function getSystemStatus(): Promise<SystemStatus> {
	if (cache && Date.now() - cache.at < CACHE_MS) return cache.data;

	const dbUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL?.replace(/\/$/, "");
	const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
	const chainUrl = (process.env.BLOCKCHAIN_ENGINE_URL || process.env.NEXT_PUBLIC_BLOCKCHAIN_ENGINE_URL)?.replace(/\/$/, "");
	const backendUrl = (process.env.SPRING_BOOT_URL || process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
	const backendAbsolute = /^https?:\/\//.test(backendUrl);

	const [auth, db, chain, backend] = await Promise.all([
		apiKey ? probe(`https://identitytoolkit.googleapis.com/v1/recaptchaParams?key=${apiKey}`) : Promise.resolve(null),
		dbUrl ? probe(`${dbUrl}/.json?shallow=true`) : Promise.resolve(null),
		chainUrl ? probe(chainUrl) : Promise.resolve(null),
		backendAbsolute ? probe(`${backendUrl}/actuator/health`) : Promise.resolve(null),
	]);

	const services: ServiceCheck[] = [
		{ key: "web", name: "Web platform", description: "clusteer.com and the trading app", status: "operational", latencyMs: 0 },
		{ key: "auth", name: "Authentication", description: "Login, signup, and 2FA", status: classify(auth, "down"), latencyMs: auth?.ms ?? null },
		{ key: "database", name: "Realtime database", description: "Accounts, orders, and notifications", status: classify(db, "down"), latencyMs: db?.ms ?? null },
		{ key: "chain", name: "Blockchain networks", description: "Tron, BSC, and Ethereum settlement", status: classify(chain, "pre-launch"), latencyMs: chain?.ms ?? null },
		{ key: "backend", name: "Trading & bank payouts", description: "Orders, rates, and NIP payouts", status: classify(backend, "pre-launch"), latencyMs: backend?.ms ?? null },
	];

	const monitored = services.filter((s) => s.status !== "pre-launch");
	const operationalCount = monitored.filter((s) => s.status === "operational").length;
	const overall: SystemStatus["overall"] = monitored.some((s) => s.status === "down")
		? "down"
		: monitored.some((s) => s.status === "degraded")
			? "degraded"
			: "operational";

	const lats = [auth, db].filter((x): x is { ok: boolean; ms: number } => !!x && x.ok).map((x) => x.ms);
	const apiLatencyMs = lats.length ? Math.round(lats.reduce((a, b) => a + b, 0) / lats.length) : null;

	const data: SystemStatus = {
		overall,
		services,
		checkedAt: new Date().toISOString(),
		apiLatencyMs,
		operationalCount,
		monitoredCount: monitored.length,
	};
	cache = { at: Date.now(), data };
	return data;
}
