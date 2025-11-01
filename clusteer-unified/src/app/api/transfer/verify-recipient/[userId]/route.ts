import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ userId: string }> }
) {
	try {
		const { userId } = await params;

		if (!userId) {
			return NextResponse.json(
				{ status: false, message: "User ID is required" },
				{ status: 400 }
			);
		}

		// Get user from database
		const { data: user, error } = await supabaseAdmin
			.from("users")
			.select("username, is_verified")
			.eq("id", userId)
			.single();

		if (error || !user) {
			return NextResponse.json(
				{ status: false, message: "User not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			status: true,
			data: {
				username: user.username,
				is_verified: user.is_verified,
			},
		});
	} catch (error) {
		console.error("Verify recipient error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
