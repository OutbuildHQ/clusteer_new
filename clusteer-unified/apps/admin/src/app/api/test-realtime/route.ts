/**
 * Test Firebase Realtime Database connection
 * GET /api/admin/test-realtime
 */

import { NextResponse } from "next/server";
import { getRealtimeDb } from "@/lib/firebase-admin-realtime";

export async function GET() {
	try {
		const db = getRealtimeDb();

		// Test reading from root
		const testRef = db.ref("test");
		await testRef.set({
			message: "Firebase Realtime Database is working!",
			timestamp: new Date().toISOString(),
		});

		const snapshot = await testRef.once("value");
		const data = snapshot.val();

		// Try to read users
		const usersRef = db.ref("users");
		const usersSnapshot = await usersRef.once("value");
		const users = usersSnapshot.val();

		return NextResponse.json({
			status: "✅ Firebase Realtime Database Working!",
			testData: data,
			usersCount: users ? Object.keys(users).length : 0,
			users: users || "No users in Realtime Database yet",
			databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
		});
	} catch (error: any) {
		console.error("Realtime Database test error:", error);
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
