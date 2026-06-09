import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, djangoFetch } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
	const auth = getAuthFromRequest(request);
	if (!auth) return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });

	try {
		const res = await djangoFetch(`/user/${auth.userId}/notifications/`);
		if (!res.ok) {
			// Backend endpoint may not exist yet — return empty list gracefully
			return NextResponse.json({ status: true, data: [] });
		}
		const data = await res.json();
		return NextResponse.json({ status: true, data: data.data ?? data.results ?? data ?? [] });
	} catch {
		return NextResponse.json({ status: true, data: [] });
	}
}
