/**
 * Test endpoint to verify Firebase Admin SDK is working
 * GET /api/admin/test-firebase
 */

import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

export async function GET() {
	try {
		// Test Firebase Admin Auth
		const auth = getAdminAuth();
		const authTest = auth ? "✅ Firebase Admin Auth initialized" : "❌ Firebase Admin Auth failed";

		// Test Firebase Admin Firestore
		const db = getAdminDb();
		const dbTest = db ? "✅ Firestore Admin initialized" : "❌ Firestore Admin failed";

		// Try to list users (will fail if credentials are invalid)
		let userCount = 0;
		let userTestMessage = "";
		try {
			const listUsersResult = await auth.listUsers(1);
			userCount = listUsersResult.users.length;
			userTestMessage = `✅ Successfully connected to Firebase Auth (${userCount} user(s) found in first page)`;
		} catch (error: any) {
			userTestMessage = `❌ Failed to list users: ${error.message}`;
		}

		// Try to access Firestore
		let firestoreTestMessage = "";
		try {
			await db.collection("users").limit(1).get();
			firestoreTestMessage = "✅ Successfully connected to Firestore";
		} catch (error: any) {
			firestoreTestMessage = `❌ Failed to access Firestore: ${error.message}`;
		}

		// Check environment variables
		const envCheck = {
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? "✅ Set" : "❌ Missing",
			privateKey: process.env.FIREBASE_PRIVATE_KEY ? "✅ Set" : "❌ Missing",
			projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✅ Set" : "❌ Missing",
		};

		return NextResponse.json({
			status: "Firebase Admin SDK Test",
			timestamp: new Date().toISOString(),
			tests: {
				authInitialization: authTest,
				firestoreInitialization: dbTest,
				authConnection: userTestMessage,
				firestoreConnection: firestoreTestMessage,
			},
			environmentVariables: envCheck,
			credentials: {
				clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "Not set",
				projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "Not set",
				privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
			},
		});
	} catch (error: any) {
		console.error("Firebase Admin test error:", error);
		return NextResponse.json(
			{
				status: "Failed",
				error: error.message,
				stack: error.stack,
			},
			{ status: 500 }
		);
	}
}
