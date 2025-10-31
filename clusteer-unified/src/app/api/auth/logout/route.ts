import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
	try {
		// Clear the auth token cookie
		const cookieStore = await cookies();
		cookieStore.delete("auth_token");

		return NextResponse.json(
			{
				status: true,
				message: "Logged out successfully",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Logout error:", error);
		return NextResponse.json(
			{
				status: false,
				message: "Failed to logout",
			},
			{ status: 500 }
		);
	}
}
