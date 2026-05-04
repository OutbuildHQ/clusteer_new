import { NextRequest, NextResponse } from "next/server";
import { djangoFetch } from "@/lib/api-helpers";

// Public endpoint — no auth required. Anyone needs to verify a recipient before sending.
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ userId: string }> }
) {
	try {
		const { userId: recipientUserId } = await params;

		if (!recipientUserId) {
			return NextResponse.json(
				{ status: false, message: "User ID is required" },
				{ status: 400 }
			);
		}

		const response = await djangoFetch(`/user/${recipientUserId}/profile/`);

		if (response.status === 404) {
			return NextResponse.json({
				status: true,
				data: { exists: false },
			});
		}

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			return NextResponse.json(
				{ status: false, message: errorData.error || "Failed to verify recipient" },
				{ status: response.status }
			);
		}

		const data = await response.json();

		return NextResponse.json({
			status: true,
			data: {
				exists: true,
				username: data.username,
				is_verified: data.kyc_status === "approved",
			},
		});
	} catch (error) {
		console.error("Verify recipient error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
