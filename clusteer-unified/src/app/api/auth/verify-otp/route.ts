/**
 * OTP verification is handled client-side via Firebase Auth.
 * This route is kept for legacy compatibility but redirects callers
 * to use the Firebase SDK directly.
 */
import { NextResponse } from "next/server";

export async function POST() {
	return NextResponse.json(
		{ status: false, message: "OTP verification is handled via Firebase Auth. Use the client SDK." },
		{ status: 410 }
	);
}
