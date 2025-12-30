import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import rateLimiter, { RATE_LIMITS, getClientIdentifier } from "@/lib/rate-limiter";

export async function POST(request: NextRequest) {
	try {
		// Rate limiting check
		const identifier = getClientIdentifier(request);
		if (rateLimiter.isRateLimited(identifier, RATE_LIMITS.LOGIN.limit, RATE_LIMITS.LOGIN.windowMs)) {
			const resetTime = rateLimiter.getResetTime(identifier);
			const retryAfter = resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : 900;

			return NextResponse.json(
				{
					status: false,
					message: "Too many login attempts. Please try again later.",
					retryAfter,
				},
				{
					status: 429,
					headers: {
						"Retry-After": retryAfter.toString(),
						"X-RateLimit-Limit": RATE_LIMITS.LOGIN.limit.toString(),
						"X-RateLimit-Remaining": "0",
					},
				}
			);
		}

		const body = await request.json();
		const { email, password } = body;

		// Validate input
		if (!email || !password) {
			return NextResponse.json(
				{ status: false, message: "Email and password are required" },
				{ status: 400 }
			);
		}

		// Use Supabase Auth to sign in
		const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (authError) {
			console.error("Supabase Auth error:", authError);
			return NextResponse.json(
				{ status: false, message: authError.message },
				{ status: 401 }
			);
		}

		if (!authData.user || !authData.session) {
			return NextResponse.json(
				{ status: false, message: "Invalid credentials" },
				{ status: 401 }
			);
		}

		// Check if email is verified
		if (!authData.user.email_confirmed_at) {
			return NextResponse.json(
				{
					status: false,
					message: "Please verify your email first. Check your inbox for the verification link.",
					requiresVerification: true,
				},
				{ status: 403 }
			);
		}

		// Get user profile data
		const { data: userProfile } = await supabase
			.from("users")
			.select("*")
			.eq("id", authData.user.id)
			.single();

		const response = NextResponse.json({
			status: true,
			message: "Login successful",
			token: authData.session.access_token,
			data: {
				id: authData.user.id,
				username: userProfile?.username || authData.user.user_metadata?.username,
				email: authData.user.email,
				phone: userProfile?.phone || authData.user.user_metadata?.phone,
			},
		});

		// Set access token as an HttpOnly cookie with security flags
		response.cookies.set("auth_token", authData.session.access_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60, // 7 days
			path: "/",
		});

		// Add rate limit headers
		const remaining = rateLimiter.getRemaining(identifier, RATE_LIMITS.LOGIN.limit);
		response.headers.set("X-RateLimit-Limit", RATE_LIMITS.LOGIN.limit.toString());
		response.headers.set("X-RateLimit-Remaining", remaining.toString());

		return response;
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
