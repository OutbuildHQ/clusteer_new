import { supabase, supabaseAdmin } from "@/lib/supabase";
import { getSupabaseUserWithRetry } from "@/lib/supabase-helpers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		// Get the auth token from cookies
		const token = request.cookies.get("auth_token")?.value;

		if (!token) {
			return NextResponse.json(
				{ status: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Get user from Supabase with retry logic
		const { user: authUser, error: authError, isNetworkError } = await getSupabaseUserWithRetry(token);

		if (authError || !authUser) {
			// Return 503 for network errors, 401 for auth errors
			if (isNetworkError) {
				console.error("Supabase network error:", authError);
				return NextResponse.json(
					{ status: false, message: "Authentication service temporarily unavailable" },
					{ status: 503 }
				);
			}

			return NextResponse.json(
				{ status: false, message: "Invalid or expired token" },
				{ status: 401 }
			);
		}

		// Get user profile from users table using admin client to bypass RLS
		let { data: userProfile, error: profileError } = await supabaseAdmin
			.from("users")
			.select("*")
			.eq("id", authUser.id)
			.single();

		console.log("Fetched user profile:", {
			userId: authUser.id,
			is_verified: userProfile?.is_verified,
			username: userProfile?.username,
		});

		// If user profile doesn't exist, create it using admin client to bypass RLS
		if (profileError && profileError.code === 'PGRST116') {
			console.log("User profile not found, creating one...");

			const { data: newProfile, error: insertError } = await supabaseAdmin
				.from("users")
				.insert({
					id: authUser.id,
					username: authUser.user_metadata?.username || authUser.email?.split('@')[0],
					phone: authUser.user_metadata?.phone || null,
					is_verified: false, // KYC verification status (not email verification)
				})
				.select()
				.single();

			if (insertError) {
				console.error("Error creating user profile:", insertError);
				// If insert fails, still return auth user data
				return NextResponse.json({
					status: true,
					data: {
						id: authUser.id,
						username: authUser.user_metadata?.username || authUser.email?.split('@')[0],
						email: authUser.email,
						phone: authUser.user_metadata?.phone,
						is_verified: false,
						emailVerified: authUser.email_confirmed_at ? true : false,
						created_at: authUser.created_at,
						updated_at: authUser.updated_at,
					},
				});
			}

			userProfile = newProfile;
		} else if (profileError) {
			console.error("Error fetching user profile:", profileError);
			return NextResponse.json(
				{ status: false, message: "Failed to fetch user profile" },
				{ status: 500 }
			);
		}

		// Return user data in the expected format
		return NextResponse.json({
			status: true,
			data: {
				id: authUser.id,
				username: userProfile?.username || authUser.user_metadata?.username,
				firstName: userProfile?.first_name || "",
				lastName: userProfile?.last_name || "",
				email: authUser.email,
				phone: userProfile?.phone || authUser.user_metadata?.phone,
				avatar: userProfile?.avatar || "",
				is_verified: userProfile?.is_verified || false,
				emailVerified: authUser.email_confirmed_at ? true : false,
				twoFactorEnabled: userProfile?.two_factor_enabled || false,
				dateJoined: userProfile?.created_at,
				created_at: userProfile?.created_at,
				updated_at: userProfile?.updated_at,
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
