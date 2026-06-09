import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, djangoFetch } from "@/lib/api-helpers";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const auth = getAuthFromRequest(request);
	if (!auth) return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });

	const { id } = await params;
	const body = await request.json();
	const res = await djangoFetch(`/user/${auth.userId}/bank-accounts/${id}/`, {
		method: "PUT",
		body: JSON.stringify(body),
	});
	const data = await res.json();
	if (!res.ok) return NextResponse.json({ status: false, message: data.message || "Failed" }, { status: res.status });
	return NextResponse.json({ status: true, data: data.data ?? data, message: data.message });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const auth = getAuthFromRequest(request);
	if (!auth) return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });

	const { id } = await params;
	const res = await djangoFetch(`/user/${auth.userId}/bank-accounts/${id}/`, { method: "DELETE" });
	const data = await res.json();
	if (!res.ok) return NextResponse.json({ status: false, message: data.message || "Failed" }, { status: res.status });
	return NextResponse.json({ status: true, message: data.message });
}
