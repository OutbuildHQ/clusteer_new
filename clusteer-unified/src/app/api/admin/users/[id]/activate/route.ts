/**
 * Admin User Activation API
 * POST /api/admin/users/[id]/activate - Activate suspended user account
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
 * POST - Activate user account (remove suspension)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
	// Verify admin authentication and permissions
	const adminOrError = await requirePermission("users.activate");
	if (adminOrError instanceof Response) {
		return adminOrError;
	}

	try {
		const { id } = await params;

		// Enable user in Firebase Auth
		const updatedUser = await updateUser(id, { disabled: false });
		if (!updatedUser) {
			return NextResponse.json(
				{ error: "Failed to activate user" },
				{ status: 500 }
			);
		}

		// Update activation details in Firestore
		const db = getAdminDb();
		await db.collection("users").doc(id).set(
			{
				accountStatus: "Active",
				suspendedAt: null,
				suspensionReason: null,
				activatedAt: new Date().toISOString(),
				lastUpdated: new Date().toISOString(),
			},
			{ merge: true }
		);

		// Log admin action
		await db.collection("admin_actions").add({
			adminId: (adminOrError as any).uid,
			adminEmail: (adminOrError as any).email,
			action: "activate_user",
			targetUserId: id,
			timestamp: new Date().toISOString(),
		});

		return NextResponse.json({
			message: "User activated successfully",
			userId: id,
			activatedAt: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Admin activate user API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
