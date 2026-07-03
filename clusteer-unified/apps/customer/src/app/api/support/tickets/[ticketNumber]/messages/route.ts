import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, djangoFetch } from "@/lib/api-helpers";

export async function POST(request: NextRequest, { params }: { params: Promise<{ ticketNumber: string }> }) {
	const auth = getAuthFromRequest(request);
	if (!auth) return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });

	const { ticketNumber } = await params;
	const body = await request.json();
	// sender_id is derived from the authenticated session, not trusted from the client body.
	const res = await djangoFetch(`/user/${auth.userId}/support/tickets/${ticketNumber}/messages/`, {
		method: "POST",
		body: JSON.stringify({ ...body, sender_id: auth.userId }),
	});
	const data = await res.json();
	if (!res.ok) return NextResponse.json({ status: false, message: data.message || "Failed" }, { status: res.status });
	return NextResponse.json({ status: true, data: data.data ?? data, message: data.message });
}
