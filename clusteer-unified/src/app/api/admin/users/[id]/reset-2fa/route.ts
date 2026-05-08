/**
 * Admin User 2FA Reset API
 * POST /api/admin/users/[id]/reset-2fa - Clear all MFA enrollment for a user
 */

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import { updateUser, getAdminDb } from "@/lib/firebase-admin";

interface RouteParams {
	params: Promise<{
		id: string;
	}>;
}

/**
 * POST - Reset 2FA (clear all enrolled MFA factors) for the given user
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
	// Verify admin authentication and permissions
	const adminOrError = await requirePermission("users.manage");
	if (adminOrError instanceof Response) {
		return adminOrError;
	}

	try {
		const { id } = await params;

		// Clear all enrolled MFA factors via Firebase Admin
		const updatedUser = await updateUser(id, {
			multiFactor: { enrolledFactors: [] },
		});

		if (!updatedUser) {
			return NextResponse.json(
				{ error: "Failed to reset 2FA for user" },
				{ status: 500 }
			);
		}

		// Reflect the change in Firestore
		const db = getAdminDb();
		await db.collection("users").doc(id).set(
			{
				twoFactorEnabled: false,
				lastUpdated: new Date().toISOString(),
			},
			{ merge: true }
		);

		// Log admin action
		await db.collection("admin_actions").add({
			adminId: (adminOrError as any).uid,
			adminEmail: (adminOrError as any).email,
			action: "reset_2fa",
			targetUserId: id,
			timestamp: new Date().toISOString(),
		});

		return NextResponse.json({
			success: true,
			message: "2FA reset successfully",
			userId: id,
		});
	} catch (error) {
		console.error("Admin reset 2FA API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
