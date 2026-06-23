import { NextRequest, NextResponse } from "next/server";

// firebase-admin needs the Node runtime; never prerender this route.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Early-access waitlist capture.
 * Stores entries in Realtime Database under `waitlist/<base64url(email)>`
 * (the project uses RTDB for data — Firestore is in Datastore Mode). The key
 * is derived from the email so re-submits dedupe instead of duplicating.
 * No email is sent — we just collect.
 */
export async function POST(request: NextRequest) {
	const { rateLimit, RateLimitPresets } = await import("@/lib/rate-limiter");
	const limited = rateLimit(request, RateLimitPresets.strict);
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

	try {
		const { getRealtimeDb } = await import("@/lib/firebase-admin-realtime");
		const db = getRealtimeDb();
		const key = Buffer.from(email).toString("base64url");
		const ref = db.ref(`waitlist/${key}`);

		const snapshot = await ref.once("value");
		if (snapshot.exists()) {
			return NextResponse.json({ status: true, message: "You're already on the list — we'll be in touch." });
		}

		await ref.set({
			email,
			createdAt: new Date().toISOString(),
			source: "early-access",
			referrer: request.headers.get("referer") || null,
			userAgent: request.headers.get("user-agent") || null,
		});

		return NextResponse.json({ status: true, message: "You're on the list. We'll reach out when access opens." });
	} catch (error) {
		console.error("[waitlist] write failed:", error);
		return NextResponse.json(
			{ status: false, message: "Something went wrong on our end. Please try again." },
			{ status: 500 },
		);
	}
}
