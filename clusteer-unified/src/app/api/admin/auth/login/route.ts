import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Admin credentials (in production, this should be in a secure database)
// For now, we'll use environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@clusteer.io";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123456";

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json();

		// Validate input
		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 }
			);
		}

		// Check credentials
		if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
			// Log failed attempt (in production, send to monitoring system)
			console.warn(`Failed admin login attempt for: ${email}`);

			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		}

		// Create admin session token (simple JWT-like token)
		const sessionData = {
			email,
			role: "admin",
			loginTime: new Date().toISOString(),
		};

		const token = Buffer.from(JSON.stringify(sessionData)).toString("base64");

		// Set admin cookie
		const cookieStore = await cookies();
		cookieStore.set("admin_token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 60 * 60 * 8, // 8 hours
			path: "/admin",
		});

		// Log successful login
		console.log(`Admin login successful: ${email} at ${new Date().toISOString()}`);

		return NextResponse.json({
			success: true,
			message: "Login successful",
			user: { email, role: "admin" },
		});
	} catch (error) {
		console.error("Admin login error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
