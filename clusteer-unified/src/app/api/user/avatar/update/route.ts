import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, DJANGO_URL, API_KEY } from "@/lib/api-helpers";

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

		const { userId } = auth;

		// Forward the multipart FormData to Django (don't use djangoFetch — it sets Content-Type: application/json)
		const forwardFormData = new FormData();
		forwardFormData.append("avatar", avatarFile);

		try {
			const djangoRes = await fetch(
				`${DJANGO_URL}/api/v1/user/${userId}/avatar/update/`,
				{
					method: "POST",
					headers: { "X-API-KEY": API_KEY },
					body: forwardFormData,
				}
			);

			const djangoData = await djangoRes.json();

			if (!djangoRes.ok) {
				return NextResponse.json(
					{ status: false, message: djangoData.message || djangoData.error || "Avatar upload failed" },
					{ status: djangoRes.status }
				);
			}

			return NextResponse.json({
				status: true,
				message: "Avatar updated successfully",
				data: { avatar: djangoData.avatar_url || djangoData.avatar || "" },
			});
		} catch (error) {
			console.error("Django avatar upload error:", error);
			return NextResponse.json(
				{ status: false, message: "Unable to connect to upload service. Please try again later." },
				{ status: 503 }
			);
		}
	} catch (error) {
		console.error("Avatar update error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
