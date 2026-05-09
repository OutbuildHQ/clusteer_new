import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, djangoFetch } from "@/lib/api-helpers";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const auth = getAuthFromRequest(request);
	if (!auth) {
		return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });
	}

	try {
		const { id } = await params;

		// Cancel via Django: PATCH order to cancelled status
		const res = await djangoFetch(`/user/${auth.userId}/orders/${id}/`, {
			method: "PATCH",
			body: JSON.stringify({ status: "cancelled" }),
		});

		if (!res.ok) {
			const errBody = await res.json().catch(() => ({}));
			return NextResponse.json(
				{ status: false, message: errBody.message || errBody.error || "Failed to cancel order" },
				{ status: res.status }
			);
		}

		const data = await res.json().catch(() => ({}));
		return NextResponse.json({ status: true, message: "Order cancelled", data });
	} catch (error: unknown) {
		const isNetwork = error instanceof TypeError && (error.message.includes("ECONNREFUSED") || error.message.includes("fetch failed"));
		if (isNetwork) {
			return NextResponse.json({ status: false, message: "Service temporarily unavailable" }, { status: 503 });
		}
		return NextResponse.json({ status: false, message: "An unexpected error occurred" }, { status: 500 });
	}
}
