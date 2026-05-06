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

		const { userId, token } = auth;

		// Decode JWT for baseline profile data
		let jwtEmail = "";
		let jwtEmailVerified = false;
		try {
			const parts = token.split(".");
			const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
			jwtEmail = payload.email || "";
			jwtEmailVerified = payload.email_verified || false;
		} catch {
			// fallback — userId is still valid from getAuthFromRequest
		}

		// Base profile from JWT
		const baseProfile = {
			id: userId,
			email: jwtEmail,
			username: jwtEmail.split("@")[0],
			firstName: "",
			lastName: "",
			phone: "",
			avatar: "",
			is_verified: jwtEmailVerified,
			emailVerified: jwtEmailVerified,
			twoFactorEnabled: false,
			kyc_status: "not_started",
			dateJoined: new Date().toISOString(),
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};

		// Try to fetch richer profile from Django backend
		try {
			const djangoResponse = await djangoFetch(`/user/${userId}/profile/`);
			if (djangoResponse.ok) {
				const djangoData = await djangoResponse.json();
				const profile = djangoData.data || djangoData;

				// Merge Django fields over JWT defaults (Django takes priority)
				return NextResponse.json({
					status: true,
					data: {
						...baseProfile,
						username: profile.username || baseProfile.username,
						firstName: profile.first_name || profile.firstName || baseProfile.firstName,
						lastName: profile.last_name || profile.lastName || baseProfile.lastName,
						phone: profile.phone || profile.phone_number || baseProfile.phone,
						avatar: profile.avatar || profile.avatar_url || baseProfile.avatar,
						is_verified: profile.is_verified ?? baseProfile.is_verified,
						emailVerified: profile.email_verified ?? profile.is_verified ?? baseProfile.emailVerified,
						twoFactorEnabled: profile.two_factor_enabled ?? profile.twoFactorEnabled ?? baseProfile.twoFactorEnabled,
						kyc_status: profile.kyc_status || baseProfile.kyc_status,
						dateJoined: profile.date_joined || profile.created_at || baseProfile.dateJoined,
						created_at: profile.created_at || baseProfile.created_at,
						updated_at: profile.updated_at || baseProfile.updated_at,
					},
				});
			}
		} catch {
			// Django unavailable — fall back to JWT-derived profile below
		}

		// Fallback: return JWT-derived profile
		return NextResponse.json({
			status: true,
			data: baseProfile,
		});
	} catch (error) {
		console.error("Profile fetch error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
