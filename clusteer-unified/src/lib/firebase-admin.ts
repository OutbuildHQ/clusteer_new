/**
 * Firebase Admin SDK Configuration
 * For server-side operations (API routes)
 */

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let adminApp: App;
let adminAuth: Auth;
let adminDb: Firestore;

/**
 * Initialize Firebase Admin SDK
 * Only initializes once (singleton pattern)
 */
function initializeFirebaseAdmin() {
	if (getApps().length === 0) {
		// Initialize with environment variables
		// For production, use service account JSON
		adminApp = initializeApp({
			credential: cert({
				projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
				// Note: In production, use proper service account credentials
				// For now, using basic auth (should be replaced)
				clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
				privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
			}),
			projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
			databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
		});

		adminAuth = getAuth(adminApp);
		adminDb = getFirestore(adminApp);
	} else {
		adminApp = getApps()[0];
		adminAuth = getAuth(adminApp);
		adminDb = getFirestore(adminApp);
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
 * Get Firestore Admin instance
 */
export function getAdminDb(): Firestore {
	if (!adminDb) {
		initializeFirebaseAdmin();
	}
	return adminDb;
}

/**
 * Verify Firebase ID token (from client)
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

/**
 * Get user by UID
 */
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

/**
 * Get user by email
 */
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

/**
 * List all users (paginated)
 */
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

/**
 * Update user
 */
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

/**
 * Delete user
 */
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

/**
 * Set custom user claims (for roles/permissions)
 */
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
