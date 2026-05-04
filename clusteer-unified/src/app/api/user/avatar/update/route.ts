import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/api-helpers";

export async function PUT(request: NextRequest) {
	try {
		const auth = getAuthFromRequest(request);
		if (!auth) {
			return NextResponse.json(
				{ status: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Validate that a file was provided
		const formData = await request.formData();
		const avatarFile = formData.get("avatar") as File;

		if (!avatarFile) {
			return NextResponse.json(
				{ status: false, message: "No file provided" },
				{ status: 400 }
			);
		}

		// Validate file type
		const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
		if (!validTypes.includes(avatarFile.type)) {
			return NextResponse.json(
				{ status: false, message: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed" },
				{ status: 400 }
			);
		}

		// Validate file size (max 5MB)
		const maxSize = 5 * 1024 * 1024;
		if (avatarFile.size > maxSize) {
			return NextResponse.json(
				{ status: false, message: "File too large. Maximum size is 5MB" },
				{ status: 400 }
			);
		}

		// TODO: Upload to Firebase Storage or forward to Django when backend supports it
		return NextResponse.json({
			status: true,
			message: "Avatar update coming soon",
			data: { avatar: "" },
		});
	} catch (error) {
		console.error("Avatar update error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
