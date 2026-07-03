import { NextRequest, NextResponse } from "next/server";

// firebase-admin needs the Node runtime; never prerender this route.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Mint a short-lived OAuth token from the service-account credential.
 * We use the RTDB REST API rather than the firebase-admin Realtime Database
 * SDK because the SDK's persistent WebSocket fails to establish in the App
 * Hosting (Cloud Run) environment and the call hangs. REST is plain HTTPS and
 * works reliably. The credential is reused via the default app singleton.
 */
async function rtdbAccessToken(): Promise<string> {
	const { getApps, initializeApp, cert } = await import("firebase-admin/app");
	const app =
		getApps()[0] ||
		initializeApp({
			credential: cert({
				projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
				clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
				privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
			}),
			databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
		});
	const credential = app.options.credential as { getAccessToken(): Promise<{ access_token: string }> };
	const { access_token } = await credential.getAccessToken();
	return access_token;
}

/**
 * Early-access waitlist capture.
 * Stores entries in Realtime Database under `waitlist/<base64url(email)>`
 * (the project uses RTDB; Firestore is in Datastore Mode). The key is derived
 * from the email so re-submits dedupe instead of duplicating. No email sent.
 */
export async function POST(request: NextRequest) {
	const { rateLimit, RateLimitPresets } = await import("@/lib/rate-limiter");
	const limited = await rateLimit(request, RateLimitPresets.strict);
	if (limited) return limited;

	let body: { email?: string };
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ status: false, message: "Invalid request body" }, { status: 400 });
	}

	const email = (body.email || "").trim().toLowerCase();
	if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
		return NextResponse.json({ status: false, message: "Enter a valid email address." }, { status: 400 });
	}

	const dbUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL?.replace(/\/$/, "");
	if (!dbUrl) {
		return NextResponse.json({ status: false, message: "Waitlist is temporarily unavailable." }, { status: 503 });
	}

	try {
		const token = await rtdbAccessToken();
		const key = Buffer.from(email).toString("base64url");
		const url = `${dbUrl}/waitlist/${key}.json?access_token=${token}`;

		// Dedupe: if this email is already recorded, treat as success.
		const existing = await fetch(url, { method: "GET" });
		if (existing.ok && (await existing.json()) !== null) {
			return NextResponse.json({ status: true, message: "You're already on the list — we'll be in touch." });
		}

		const res = await fetch(url, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email,
				createdAt: new Date().toISOString(),
				source: "early-access",
				referrer: request.headers.get("referer") || null,
				userAgent: request.headers.get("user-agent") || null,
			}),
		});
		if (!res.ok) throw new Error(`RTDB REST write failed: ${res.status}`);

		return NextResponse.json({ status: true, message: "You're on the list. We'll reach out when access opens." });
	} catch (error) {
		console.error("[waitlist] write failed:", error);
		return NextResponse.json(
			{ status: false, message: "Something went wrong on our end. Please try again." },
			{ status: 500 },
		);
	}
}
