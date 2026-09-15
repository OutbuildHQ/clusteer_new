import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, djangoFetch } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
	try {
		const auth = getAuthFromRequest(request);
		if (!auth) {
			return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });
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
			return NextResponse.json(
				{ status: false, message: "We couldn’t load your orders. Please try again." },
				{ status: response.status === 401 || response.status === 403 ? response.status : 502 }
			);
		}

		const responseData = await response.json();
		return NextResponse.json(responseData);
	} catch {
		return NextResponse.json(
			{ status: false, message: "Your orders are temporarily unavailable. Please try again." },
			{ status: 503 }
		);
	}
}
