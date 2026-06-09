/**
 * Simple Firebase Admin test without Firestore
 * GET /api/admin/test-simple
 */

import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";

export async function GET() {
	try {
		const auth = getAdminAuth();

		// List users from Firebase Auth
		const listUsersResult = await auth.listUsers(10); // Get first 10 users

		const users = listUsersResult.users.map(user => ({
			uid: user.uid,
			email: user.email,
			displayName: user.displayName || "No name",
			emailVerified: user.emailVerified,
			disabled: user.disabled,
			createdAt: user.metadata.creationTime,
			lastSignIn: user.metadata.lastSignInTime,
		}));

		return NextResponse.json({
			status: "✅ Firebase Admin Auth Working!",
			totalUsers: users.length,
			users: users,
			message: "Firebase Admin SDK is working correctly. Users can be retrieved from Firebase Auth.",
		});
	} catch (error: any) {
		console.error("Firebase Admin test error:", error);
		return NextResponse.json(
			{
				status: "❌ Failed",
				error: error.message,
				code: error.code,
			},
			{ status: 500 }
		);
	}
}
