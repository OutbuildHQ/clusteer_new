/**
 * Admin User Password Reset API
 * POST /api/admin/users/[id]/reset-password - Trigger a Firebase password reset email for a user
 */

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

interface RouteParams {
	params: Promise<{
		id: string;
	}>;
}

/**
 * POST - Send a Firebase password reset email for the given user
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
	// Verify admin authentication and permissions
	const adminOrError = await requirePermission("users.manage");
	if (adminOrError instanceof Response) {
		return adminOrError;
	}

	try {
		const { id } = await params;

		// Look up the Firebase user to get their email
		const auth = getAdminAuth();
		let userRecord;
		try {
			userRecord = await auth.getUser(id);
		} catch {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		if (!userRecord.email) {
			return NextResponse.json(
				{ error: "User does not have an email address on file" },
				{ status: 400 }
			);
		}

		// Generate a password reset link via Firebase Admin
		await auth.generatePasswordResetLink(userRecord.email);

		// Log admin action
		const db = getAdminDb();
		await db.collection("admin_actions").add({
			adminId: (adminOrError as any).uid,
			adminEmail: (adminOrError as any).email,
			action: "reset_password",
			targetUserId: id,
			targetEmail: userRecord.email,
			timestamp: new Date().toISOString(),
		});

		return NextResponse.json({
			success: true,
			message: "Password reset email sent successfully",
			userId: id,
		});
	} catch (error) {
		console.error("Admin reset password API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
