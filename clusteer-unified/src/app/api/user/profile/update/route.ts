import { supabase, supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
	try {
		const token = request.cookies.get("auth_token")?.value;

		if (!token) {
			return NextResponse.json(
				{ status: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

		if (authError || !authUser) {
			return NextResponse.json(
				{ status: false, message: "Invalid token" },
				{ status: 401 }
			);
		}

		const body = await request.json();
		const { firstName, lastName, username, email, phone } = body;

		// Use upsert to handle both insert and update
		const { data: updatedProfile, error: upsertError } = await supabaseAdmin
			.from("users")
			.upsert({
				id: authUser.id,
				first_name: firstName || null,
				last_name: lastName || null,
				username: username,
				phone: phone || null,
				is_verified: authUser.email_confirmed_at ? true : false,
			}, {
				onConflict: 'id'
			})
			.select()
			.single();

		if (upsertError) {
			console.error("Error upserting user profile:", upsertError);
			return NextResponse.json(
				{ status: false, message: "Failed to update profile" },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			status: true,
			message: "Profile updated successfully",
			data: {
				id: authUser.id,
				firstName: updatedProfile.first_name,
				lastName: updatedProfile.last_name,
				username: updatedProfile.username,
				email: authUser.email,
				phone: updatedProfile.phone,
				is_verified: authUser.email_confirmed_at ? true : false,
				created_at: updatedProfile.created_at,
				updated_at: updatedProfile.updated_at,
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
