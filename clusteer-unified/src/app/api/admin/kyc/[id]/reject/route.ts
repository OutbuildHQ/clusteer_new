/**
 * Admin KYC Rejection API
 * POST /api/admin/kyc/[id]/reject - Reject a KYC submission for a user
 */

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import { getAdminDb } from "@/lib/firebase-admin";
import { djangoFetch } from "@/lib/api-helpers";

interface RouteParams {
	params: Promise<{
		id: string;
	}>;
}

/**
 * POST - Reject KYC submission
 * Body: { reason: string }
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
	// Verify admin authentication and permissions
	const adminOrError = await requirePermission("kyc.manage");
	if (adminOrError instanceof Response) {
		return adminOrError;
	}

	try {
		const { id } = await params;
		const body = await request.json();
		const { reason } = body;

		if (!reason || reason.trim() === "") {
			return NextResponse.json(
				{ error: "Rejection reason is required" },
				{ status: 400 }
			);
		}

		// Notify Django backend of the rejection
		const djangoResponse = await djangoFetch(`/user/${id}/kyc-verification/`, {
			method: "PUT",
			body: JSON.stringify({
				status: "rejected",
				rejection_reason: reason,
			}),
		});

		if (!djangoResponse.ok) {
			const errBody = await djangoResponse.json().catch(() => ({}));
			return NextResponse.json(
				{ error: errBody.message || "Failed to update KYC status in backend" },
				{ status: djangoResponse.status }
			);
		}

		// Mirror status in Firestore
		const db = getAdminDb();
		await db.collection("users").doc(id).set(
			{
				kycStatus: "rejected",
				kycRejectionReason: reason,
				kycRejectedAt: new Date().toISOString(),
				lastUpdated: new Date().toISOString(),
			},
			{ merge: true }
		);

		// Log admin action
		await db.collection("admin_actions").add({
			adminId: (adminOrError as any).uid,
			adminEmail: (adminOrError as any).email,
			action: "reject_kyc",
			targetUserId: id,
			reason,
			timestamp: new Date().toISOString(),
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Admin KYC reject API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
