import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/api-helpers";
import { springFetch, getSpringTokenFromRequest } from "@/lib/spring-boot-server";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const auth = getAuthFromRequest(request);
	if (!auth) return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });

	const springToken = getSpringTokenFromRequest(request);
	if (!springToken) {
		return NextResponse.json({ status: false, message: "Your account isn't linked yet — please log out and back in" }, { status: 409 });
	}

	const { id } = await params;
	try {
		const res = await springFetch(`/user/api-keys/${id}`, { method: "DELETE" }, springToken);
		const data = await res.json();
		if (!res.ok) return NextResponse.json({ status: false, message: data.message || "Failed" }, { status: res.status });
		return NextResponse.json({ status: true, message: data.message });
	} catch (error) {
		console.error("API key revoke error:", error);
		return NextResponse.json({ status: false, message: "Failed to revoke API key" }, { status: 502 });
	}
}
