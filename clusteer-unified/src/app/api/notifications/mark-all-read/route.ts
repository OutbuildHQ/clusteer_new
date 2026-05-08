/**
 * Notifications Mark-All-Read API
 * PUT /api/notifications/mark-all-read - Mark all notifications as read for the current user
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/api-helpers";

/**
 * PUT - Mark all notifications as read
 */
export async function PUT(request: NextRequest) {
	// Verify user authentication
	const auth = getAuthFromRequest(request);
	if (!auth) {
		return NextResponse.json(
			{ status: false, message: "Unauthorized" },
			{ status: 401 }
		);
	}

	try {
		const { token } = auth;

		const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

		// Forward mark-all-read request to Spring Boot
		const response = await fetch(`${apiUrl}/v1/notifications/read-all`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			const errBody = await response.json().catch(() => ({}));
			return NextResponse.json(
				{ status: false, message: errBody.message || "Failed to mark notifications as read" },
				{ status: response.status }
			);
		}

		return NextResponse.json({ success: true });
	} catch (error: any) {
		console.error("Notifications mark-all-read API error:", error);

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
