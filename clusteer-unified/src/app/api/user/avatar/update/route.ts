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

		// Get form data
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
		const maxSize = 5 * 1024 * 1024; // 5MB
		if (avatarFile.size > maxSize) {
			return NextResponse.json(
				{ status: false, message: "File too large. Maximum size is 5MB" },
				{ status: 400 }
			);
		}

		// Get file extension
		const fileExt = avatarFile.name.split('.').pop();
		const fileName = `${authUser.id}-${Date.now()}.${fileExt}`;
		const filePath = `avatars/${fileName}`;

		// Convert File to ArrayBuffer then to Buffer
		const arrayBuffer = await avatarFile.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Delete old avatar if exists
		const { data: existingProfile } = await supabaseAdmin
			.from("users")
			.select("avatar")
			.eq("id", authUser.id)
			.single();

		if (existingProfile?.avatar) {
			// Extract file path from URL
			const oldFilePath = existingProfile.avatar.split('/').slice(-2).join('/');
			await supabase.storage.from("user-uploads").remove([oldFilePath]);
		}

		// Upload to Supabase Storage
		const { data: uploadData, error: uploadError } = await supabase.storage
			.from("user-uploads")
			.upload(filePath, buffer, {
				contentType: avatarFile.type,
				upsert: true,
			});

		if (uploadError) {
			console.error("Upload error:", uploadError);
			return NextResponse.json(
				{ status: false, message: "Failed to upload avatar" },
				{ status: 500 }
			);
		}

		// Get public URL
		const { data: { publicUrl } } = supabase.storage
			.from("user-uploads")
			.getPublicUrl(filePath);

		// Update user profile with new avatar URL
		const { error: updateError } = await supabaseAdmin
			.from("users")
			.update({ avatar: publicUrl })
			.eq("id", authUser.id);

		if (updateError) {
			console.error("Profile update error:", updateError);
			return NextResponse.json(
				{ status: false, message: "Failed to update profile" },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			status: true,
			message: "Avatar updated successfully",
			data: {
				avatar: publicUrl,
			},
		});
	} catch (error) {
		console.error("Avatar update error:", error);
		return NextResponse.json(
			{ status: false, message: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
