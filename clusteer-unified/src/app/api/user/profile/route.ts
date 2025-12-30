import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		// Get the auth token from cookies (already verified by middleware)
		const token = request.cookies.get("auth_token")?.value;

		if (!token) {
			return NextResponse.json(
				{ status: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Decode the Firebase JWT to get user data
		const parts = token.split('.');
		if (parts.length !== 3) {
			return NextResponse.json(
				{ status: false, message: "Invalid token format" },
				{ status: 401 }
			);
		}

		let userProfile;
		try {
			// Decode the payload (base64)
			const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

			// Extract user data from Firebase JWT
			const userId = payload.user_id || payload.sub;
			const email = payload.email || '';
			const emailVerified = payload.email_verified || false;

			// Create user profile from JWT data
			userProfile = {
				id: userId,
				email: email,
				username: email.split('@')[0], // Use email prefix as username
				is_verified: emailVerified,
				two_factor_enabled: false,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};

			console.log("User profile from Firebase JWT:", {
				userId: userProfile.id,
				email: userProfile.email,
				username: userProfile.username,
				is_verified: userProfile.is_verified,
			});
		} catch (error) {
			console.error("Failed to decode token payload:", error);
			return NextResponse.json(
				{ status: false, message: "Invalid token" },
				{ status: 401 }
			);
		}

		// Return user profile data from Firebase JWT
		return NextResponse.json({
			status: true,
			data: {
				id: userProfile.id,
				username: userProfile.username,
				firstName: "",
				lastName: "",
				email: userProfile.email,
				phone: "",
				avatar: "",
				is_verified: userProfile.is_verified,
				emailVerified: userProfile.is_verified,
				twoFactorEnabled: userProfile.two_factor_enabled,
				dateJoined: userProfile.created_at,
				created_at: userProfile.created_at,
				updated_at: userProfile.updated_at,
			},
		});
	} catch (error) {
		console.error("Profile fetch error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
