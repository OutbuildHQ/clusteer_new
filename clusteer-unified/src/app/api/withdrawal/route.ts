import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, djangoFetch } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
	const auth = getAuthFromRequest(request);
	if (!auth) {
		return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { bank_account_id, amount, currency } = body;

		if (!bank_account_id || !amount) {
			return NextResponse.json(
				{ status: "error", message: "bank_account_id and amount are required" },
				{ status: 400 }
			);
		}

		if (typeof amount !== "number" || amount <= 0) {
			return NextResponse.json(
				{ status: "error", message: "Amount must be a positive number" },
				{ status: 400 }
			);
		}

		const res = await djangoFetch("/withdrawal-request/", {
			method: "POST",
			body: JSON.stringify({
				user_id: auth.userId,
				bank_account_id,
				amount,
				currency: currency || "NGN",
			}),
		});

		const data = await res.json();

		if (!res.ok) {
			return NextResponse.json(
				{ status: "error", message: data.message || data.error || "Withdrawal failed" },
				{ status: res.status }
			);
		}

		return NextResponse.json({ status: "ok", data });
	} catch (err) {
		const isNetwork = err instanceof TypeError && (err.message.includes("ECONNREFUSED") || err.message.includes("fetch failed"));
		if (isNetwork) {
			return NextResponse.json(
				{ status: "error", message: "Service temporarily unavailable" },
				{ status: 503 }
			);
		}
		return NextResponse.json(
			{ status: "error", message: "An error occurred processing your withdrawal" },
			{ status: 500 }
		);
	}
}
