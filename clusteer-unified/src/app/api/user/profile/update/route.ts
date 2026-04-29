import { NextRequest, NextResponse } from "next/server";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limiter";

/**
 * Helper to extract user ID from Firebase JWT (already verified by middleware)
 */
function getUserIdFromToken(token: string): string | null {
	try {
		const parts = token.split(".");
		if (parts.length !== 3) return null;
		const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
		return payload.user_id || payload.sub || null;
	} catch {
		return null;
	}
}

export async function PUT(request: NextRequest) {
	try {
		const rateLimitResponse = rateLimit(request, RateLimitPresets.moderate);
		if (rateLimitResponse) {
			return rateLimitResponse;
		}

		const token = request.cookies.get("auth_token")?.value;

		if (!token) {
			return NextResponse.json(
				{ status: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const userId = getUserIdFromToken(token);
		if (!userId) {
			return NextResponse.json(
				{ status: false, message: "Invalid token" },
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

		const { firstName, lastName, username, email, phone } = body;

		// Update profile via Django backend
		const blockchainEngineUrl = process.env.BLOCKCHAIN_ENGINE_URL || "http://localhost:8000";
		const blockchainEngineApiKey = process.env.BLOCKCHAIN_ENGINE_API_KEY;

		if (!blockchainEngineApiKey) {
			return NextResponse.json(
				{ status: false, message: "Service temporarily unavailable" },
				{ status: 503 }
			);
		}

		const updateResponse = await fetch(
			`${blockchainEngineUrl}/api/v1/user/${userId}/profile/`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"X-API-KEY": blockchainEngineApiKey,
				},
				body: JSON.stringify({
					first_name: firstName || null,
					last_name: lastName || null,
					username,
					phone: phone || null,
				}),
			}
		);

		if (!updateResponse.ok) {
			return NextResponse.json(
				{ status: false, message: "Failed to update profile" },
				{ status: 500 }
			);
		}

		const updatedProfile = await updateResponse.json();

		return NextResponse.json({
			status: true,
			message: "Profile updated successfully",
			data: {
				id: userId,
				firstName: updatedProfile.first_name || firstName,
				lastName: updatedProfile.last_name || lastName,
				username: updatedProfile.username || username,
				email,
				phone: updatedProfile.phone || phone,
			},
		});
	} catch (error) {
		console.error("Profile update error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
