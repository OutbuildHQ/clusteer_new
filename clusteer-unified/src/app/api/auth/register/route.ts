import { supabase, supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { username, email, phone, password } = body;

		// Validate input
		if (!username || !email || !phone || !password) {
			return NextResponse.json(
				{ status: false, message: "All fields are required" },
				{ status: 400 }
			);
		}

		// Use Supabase Auth to create user
		const { data: authData, error: authError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					username,
					phone,
				},
				emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/auth/callback`,
			},
		});

		if (authError) {
			console.error("Supabase Auth error:", authError);
			return NextResponse.json(
				{ status: false, message: authError.message },
				{ status: 400 }
			);
		}

		if (!authData.user) {
			return NextResponse.json(
				{ status: false, message: "Failed to create user" },
				{ status: 500 }
			);
		}

		// Store additional user data in users table using admin client to bypass RLS
		const { error: dbError } = await supabaseAdmin
			.from("users")
			.insert({
				id: authData.user.id,
				username,
				phone,
				is_verified: false,
			});

		if (dbError) {
			console.error("Error creating user profile:", dbError);
			// User is created in auth, but profile failed - they can still login
		}

		return NextResponse.json({
			status: true,
			message: "Registration successful! Please check your email to verify your account.",
			data: {
				username,
				email,
				phone,
			},
		});
	} catch (error) {
		console.error("Registration error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
