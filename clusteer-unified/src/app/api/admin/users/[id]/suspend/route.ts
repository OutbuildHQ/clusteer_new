/**
 * Admin User Suspension API
 * POST /api/admin/users/[id]/suspend - Suspend user account
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
 * POST - Suspend user account
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
	// Verify admin authentication and permissions
	const adminOrError = await requirePermission("users.suspend");
	if (adminOrError instanceof Response) {
		return adminOrError;
	}

	try {
		const { id } = await params;
		const body = await request.json();
		const { reason } = body;

		if (!reason || reason.trim() === "") {
			return NextResponse.json(
				{ error: "Suspension reason is required" },
				{ status: 400 }
			);
		}

		// Disable user in Firebase Auth
		const updatedUser = await updateUser(id, { disabled: true });
		if (!updatedUser) {
			return NextResponse.json(
				{ error: "Failed to suspend user" },
				{ status: 500 }
			);
		}

		// Update suspension details in Firestore
		const db = getAdminDb();
		await db.collection("users").doc(id).set(
			{
				accountStatus: "Suspended",
				suspendedAt: new Date().toISOString(),
				suspensionReason: reason,
				lastUpdated: new Date().toISOString(),
			},
			{ merge: true }
		);

		// Log admin action
		await db.collection("admin_actions").add({
			adminId: (adminOrError as any).uid,
			adminEmail: (adminOrError as any).email,
			action: "suspend_user",
			targetUserId: id,
			reason: reason,
			timestamp: new Date().toISOString(),
		});

		return NextResponse.json({
			message: "User suspended successfully",
			userId: id,
			suspendedAt: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Admin suspend user API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
