import { NextRequest, NextResponse } from "next/server";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limiter";
import { getAuthFromRequest, djangoFetch } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
	try {
		const rateLimitResponse = await rateLimit(request, RateLimitPresets.moderate);
		if (rateLimitResponse) {
			return rateLimitResponse;
		}

		const auth = getAuthFromRequest(request);
		if (!auth) {
			return NextResponse.json(
				{ status: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		let body;
		try {
			body = await request.json();
		} catch {
			return NextResponse.json(
				{ status: false, message: "Invalid request body" },
				{ status: 400 }
			);
		}

		const { bank_code, account_number } = body;

		if (!bank_code || !account_number) {
			return NextResponse.json(
				{ status: false, message: "bank_code and account_number are required" },
				{ status: 400 }
			);
		}

		if (account_number.length < 10) {
			return NextResponse.json(
				{ status: false, message: "Account number must be at least 10 digits" },
				{ status: 400 }
			);
		}

		// Try Django endpoint first
		try {
			const djangoResponse = await djangoFetch("/bank/verify-account/", {
				method: "POST",
				body: JSON.stringify({ bank_code, account_number }),
			});

			if (djangoResponse.ok) {
				const data = await djangoResponse.json();
				return NextResponse.json({
					status: true,
					data: {
						account_name: data.account_name || data.data?.account_name,
						account_number,
						bank_code,
					},
				});
			}
		} catch (djangoErr) {
			console.warn("Django bank verify unavailable, falling back to Paystack:", djangoErr);
		}

		// Fallback: Paystack bank resolution API
		const paystackKey = process.env.PAYSTACK_SECRET_KEY;
		if (!paystackKey) {
			return NextResponse.json(
				{ status: false, message: "Bank verification service unavailable" },
				{ status: 503 }
			);
		}

		const paystackRes = await fetch(
			`https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
			{
				headers: {
					Authorization: `Bearer ${paystackKey}`,
				},
			}
		);

		const paystackData = await paystackRes.json();

		if (!paystackRes.ok || !paystackData.status) {
			return NextResponse.json(
				{ status: false, message: paystackData.message || "Could not verify account" },
				{ status: 400 }
			);
		}

		return NextResponse.json({
			status: true,
			data: {
				account_name: paystackData.data.account_name,
				account_number: paystackData.data.account_number,
				bank_code,
			},
		});
	} catch (error) {
		console.error("Bank verify error:", error);
		return NextResponse.json(
			{ status: false, message: "An error occurred verifying the account" },
			{ status: 500 }
		);
	}
}
