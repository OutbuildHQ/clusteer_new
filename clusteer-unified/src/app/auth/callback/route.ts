import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get("code");

	if (code) {
		// Exchange the code for a session
		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (error) {
			console.error("Error exchanging code for session:", error);
			return NextResponse.redirect(
				`${requestUrl.origin}/login?error=verification_failed`
			);
		}

		// Update user verification status
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (user) {
			await supabase
				.from("users")
				.update({ is_verified: true })
				.eq("id", user.id);
		}

		// Redirect to login with success message
		return NextResponse.redirect(
			`${requestUrl.origin}/login?verified=true`
		);
	}

	// No code present, redirect to login
	return NextResponse.redirect(`${requestUrl.origin}/login`);
}
