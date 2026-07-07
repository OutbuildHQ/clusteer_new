import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/api-helpers";
import { springFetch } from "@/lib/spring-boot-server";

export async function GET(request: NextRequest) {
	const auth = getAuthFromRequest(request);
	if (!auth) return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });

	try {
		const res = await springFetch("/user/api-keys", {}, auth.token);
		const data = await res.json();
		if (!res.ok) return NextResponse.json({ status: false, message: data.message || "Failed" }, { status: res.status });
		// Spring's HttpResponse wraps the payload as `responseData`, not `data`.
		return NextResponse.json({ status: true, data: data.responseData ?? data });
	} catch (error) {
		console.error("API keys list error:", error);
		return NextResponse.json({ status: false, message: "Failed to load API keys" }, { status: 502 });
	}
}

export async function POST(request: NextRequest) {
	const auth = getAuthFromRequest(request);
	if (!auth) return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });

	try {
		const body = await request.json();
		const res = await springFetch("/user/api-keys", {
			method: "POST",
			body: JSON.stringify(body),
		}, auth.token);
		const data = await res.json();
		if (!res.ok) return NextResponse.json({ status: false, message: data.message || "Failed" }, { status: res.status });
		return NextResponse.json({ status: true, data: data.responseData ?? data, message: data.message });
	} catch (error) {
		console.error("API key create error:", error);
		return NextResponse.json({ status: false, message: "Failed to create API key" }, { status: 502 });
	}
}
