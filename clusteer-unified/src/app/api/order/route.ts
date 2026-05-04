import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, djangoFetch } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
	try {
		const auth = getAuthFromRequest(request);
		if (!auth) {
			return NextResponse.json(
				{ status: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { userId } = auth;

		// Get pagination and filter params
		const searchParams = request.nextUrl.searchParams;
		const page = searchParams.get("page") || "1";
		const size = searchParams.get("size") || "10";
		const type = searchParams.get("type");
		const status = searchParams.get("status");

		// Build query parameters
		const queryParams = new URLSearchParams({ page, size });
		if (type) queryParams.append("type", type);
		if (status) queryParams.append("status", status);

		// Fetch orders from Django backend
		const response = await djangoFetch(`/user/${userId}/orders/?${queryParams.toString()}`);

		if (!response.ok) {
			if (response.status === 404) {
				return NextResponse.json({
					status: true,
					data: [],
					metadata: { page: 1, size: 10, total: 0 },
				});
			}
			const errBody = await response.json().catch(() => ({}));
			return NextResponse.json(
				{ status: false, message: errBody.message || "Failed to fetch orders from backend" },
				{ status: response.status }
			);
		}

		const responseData = await response.json();
		return NextResponse.json(responseData);
	} catch (error: any) {
		console.error("Order fetch error:", error);

		// Handle network errors (backend down)
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
