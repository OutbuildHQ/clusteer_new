/**
 * Firebase Admin SDK with Realtime Database
 * Alternative to Firestore for storing user profiles
 */

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getDatabase, Database } from "firebase-admin/database";

let adminApp: App;
let adminAuth: Auth;
let adminDb: Database;

/**
 * Initialize Firebase Admin SDK with Realtime Database
 */
function initializeFirebaseAdmin() {
	if (getApps().length === 0) {
		adminApp = initializeApp({
			credential: cert({
				projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
				clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
				privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
			}),
			projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
			databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
		});

		adminAuth = getAuth(adminApp);
		adminDb = getDatabase(adminApp);
	} else {
		adminApp = getApps()[0];
		adminAuth = getAuth(adminApp);
		adminDb = getDatabase(adminApp);
	}

	return { adminApp, adminAuth, adminDb };
}

/**
 * Get Firebase Admin Auth instance
 */
export function getAdminAuth(): Auth {
	if (!adminAuth) {
		initializeFirebaseAdmin();
	}
	return adminAuth;
}

/**
 * Get Realtime Database Admin instance
 */
export function getRealtimeDb(): Database {
	if (!adminDb) {
		initializeFirebaseAdmin();
	}
	return adminDb;
}

/**
 * User management functions (same as before)
 */
export async function verifyIdToken(token: string) {
	try {
		const auth = getAdminAuth();
		const decodedToken = await auth.verifyIdToken(token);
		return decodedToken;
	} catch (error) {
		console.error("Token verification error:", error);
		return null;
	}
}

export async function getUserByUid(uid: string) {
	try {
		const auth = getAdminAuth();
		const userRecord = await auth.getUser(uid);
		return userRecord;
	} catch (error) {
		console.error("Get user error:", error);
		return null;
	}
}

export async function getUserByEmail(email: string) {
	try {
		const auth = getAdminAuth();
		const userRecord = await auth.getUserByEmail(email);
		return userRecord;
	} catch (error) {
		console.error("Get user by email error:", error);
		return null;
	}
}

export async function listUsers(maxResults: number = 1000, pageToken?: string) {
	try {
		const auth = getAdminAuth();
		const listUsersResult = await auth.listUsers(maxResults, pageToken);
		return listUsersResult;
	} catch (error) {
		console.error("List users error:", error);
		return null;
	}
}

export async function updateUser(uid: string, properties: any) {
	try {
		const auth = getAdminAuth();
		const userRecord = await auth.updateUser(uid, properties);
		return userRecord;
	} catch (error) {
		console.error("Update user error:", error);
		return null;
	}
}

export async function deleteUser(uid: string) {
	try {
		const auth = getAdminAuth();
		await auth.deleteUser(uid);
		return true;
	} catch (error) {
		console.error("Delete user error:", error);
		return false;
	}
}

export async function setCustomUserClaims(uid: string, customClaims: any) {
	try {
		const auth = getAdminAuth();
		await auth.setCustomUserClaims(uid, customClaims);
		return true;
	} catch (error) {
		console.error("Set custom claims error:", error);
		return false;
	}
}

/**
 * Realtime Database helpers for user profiles
 */

export async function getUserProfile(uid: string) {
	try {
		const db = getRealtimeDb();
		const snapshot = await db.ref(`users/${uid}`).once("value");
		return snapshot.val();
	} catch (error) {
		console.error("Get user profile error:", error);
		return null;
	}
}

export async function updateUserProfile(uid: string, data: any) {
	try {
		const db = getRealtimeDb();
		await db.ref(`users/${uid}`).update({
			...data,
			lastUpdated: new Date().toISOString(),
		});
		return true;
	} catch (error) {
		console.error("Update user profile error:", error);
		return false;
	}
}

export async function createUserProfile(uid: string, data: any) {
	try {
		const db = getRealtimeDb();
		await db.ref(`users/${uid}`).set({
			...data,
			createdAt: new Date().toISOString(),
			lastUpdated: new Date().toISOString(),
		});
		return true;
	} catch (error) {
		console.error("Create user profile error:", error);
		return false;
	}
}

export async function deleteUserProfile(uid: string) {
	try {
		const db = getRealtimeDb();
		await db.ref(`users/${uid}`).remove();
		return true;
	} catch (error) {
		console.error("Delete user profile error:", error);
		return false;
	}
}

export async function getAllUserProfiles() {
	try {
		const db = getRealtimeDb();
		const snapshot = await db.ref("users").once("value");
		return snapshot.val() || {};
	} catch (error) {
		console.error("Get all user profiles error:", error);
		return {};
	}
}
