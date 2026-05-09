import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, djangoFetch } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
	const auth = getAuthFromRequest(request);
	if (!auth) return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });

	const body = await request.json();
	const { from_currency, to_currency, amount, chain } = body;

	if (!from_currency || !to_currency || !amount) {
		return NextResponse.json({ status: false, message: "Missing required fields: from_currency, to_currency, amount" }, { status: 400 });
	}

	try {
		const res = await djangoFetch(`/user/${auth.userId}/wallet/crypto/swap/`, {
			method: "POST",
			body: JSON.stringify({ from_currency, to_currency, amount, chain }),
		});

		const data = await res.json();

		if (!res.ok) {
			// Graceful degradation: backend endpoint not yet implemented
			if (res.status === 404 || res.status === 405) {
				return NextResponse.json(
					{ status: false, message: "Crypto-to-crypto swap is coming soon. Check back later!", code: "COMING_SOON" },
					{ status: 503 }
				);
			}
			return NextResponse.json({ status: false, message: data.message || "Swap failed" }, { status: res.status });
		}

		return NextResponse.json({ status: true, data: data.data ?? data, message: data.message });
	} catch {
		return NextResponse.json({ status: false, message: "Service unavailable. Please try again later." }, { status: 503 });
	}
}
