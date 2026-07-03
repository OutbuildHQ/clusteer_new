import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, djangoFetch } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
	const auth = getAuthFromRequest(request);
	if (!auth) return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });

	const res = await djangoFetch(`/user/${auth.userId}/kyc-verification/`);
	const data = await res.json();
	if (!res.ok) return NextResponse.json({ status: false, message: data.message || "Failed" }, { status: res.status });
	return NextResponse.json({ status: true, data: data.data ?? data });
}
