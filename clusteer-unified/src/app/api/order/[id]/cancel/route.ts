/**
 * Order Cancellation API
 * POST /api/order/[id]/cancel - Cancel an order for the currently authenticated user
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/api-helpers";

interface RouteParams {
	params: Promise<{
		id: string;
	}>;
}

/**
 * POST - Cancel an order by ID
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
	// Verify user authentication
	const auth = getAuthFromRequest(request);
	if (!auth) {
		return NextResponse.json(
			{ status: false, message: "Unauthorized" },
			{ status: 401 }
		);
	}

	try {
		const { id } = await params;
		const { token } = auth;

		const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

		// Forward cancellation request to Spring Boot
		const response = await fetch(`${apiUrl}/v1/order/${id}/cancel`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			const errBody = await response.json().catch(() => ({}));
			return NextResponse.json(
				{ status: false, message: errBody.message || "Failed to cancel order" },
				{ status: response.status }
			);
		}

		const responseData = await response.json().catch(() => ({}));
		return NextResponse.json(responseData);
	} catch (error: any) {
		console.error("Order cancel API error:", error);

		if (error.cause?.code === "ECONNREFUSED" || error.cause?.code === "ETIMEDOUT") {
			return NextResponse.json(
				{ status: false, message: "Backend service temporarily unavailable" },
				{ status: 503 }
			);
		}

		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
