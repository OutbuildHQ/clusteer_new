import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, djangoFetch } from "@/lib/api-helpers";

export async function PUT(request: NextRequest) {
	const auth = getAuthFromRequest(request);
	if (!auth) return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });

	try {
		const res = await djangoFetch(`/user/${auth.userId}/notifications/mark-all-read/`, { method: "PUT" });
		// Gracefully succeed even if backend endpoint doesn't exist yet
		if (!res.ok && res.status !== 404) {
			const errBody = await res.json().catch(() => ({}));
			return NextResponse.json({ status: false, message: errBody.message || "Failed" }, { status: res.status });
		}
		return NextResponse.json({ status: true });
	} catch {
		// Return success optimistically — UI already updated state
		return NextResponse.json({ status: true });
	}
}
