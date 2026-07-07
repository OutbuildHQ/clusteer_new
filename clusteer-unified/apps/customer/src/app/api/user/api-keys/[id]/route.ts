import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/api-helpers";
import { springFetch } from "@/lib/spring-boot-server";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const auth = getAuthFromRequest(request);
	if (!auth) return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });

	const { id } = await params;
	const res = await springFetch(`/user/api-keys/${id}`, { method: "DELETE" }, auth.token);
	const data = await res.json();
	if (!res.ok) return NextResponse.json({ status: false, message: data.message || "Failed" }, { status: res.status });
	return NextResponse.json({ status: true, message: data.message });
}
