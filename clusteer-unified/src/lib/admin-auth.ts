/**
 * Admin Authentication Helper
 * Verifies admin session and permissions using Firebase Admin SDK
 */

import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase-admin";

export interface AdminUser {
	uid: string;
	email: string;
	role: "super_admin" | "admin" | "moderator";
	permissions: string[];
}

/**
 * Verify admin authentication from request cookies
 * Uses Firebase Admin SDK to verify the token and check custom claims
 */
export async function verifyAdminAuth(): Promise<AdminUser | null> {
	try {
		const cookieStore = await cookies();
		const adminToken = cookieStore.get("admin_token")?.value;

		if (!adminToken) {
			return null;
		}

		// Verify token with Firebase Admin SDK
		const auth = getAdminAuth();
		const decodedToken = await auth.verifyIdToken(adminToken);

		if (!decodedToken.uid) {
			return null;
		}

		// Check for admin custom claims
		const role = decodedToken.role as AdminUser["role"] | undefined;
		const isAdmin = decodedToken.admin === true || role === "super_admin" || role === "admin" || role === "moderator";

		if (!isAdmin) {
			return null;
		}

		// Derive permissions from role
		const permissions = getPermissionsForRole(role || "admin");

		return {
			uid: decodedToken.uid,
			email: decodedToken.email || "",
			role: role || "admin",
			permissions,
		};
	} catch (error) {
		console.error("Admin auth verification error:", error);
		return null;
	}
}

/**
 * Get permissions based on admin role
 */
function getPermissionsForRole(role: AdminUser["role"]): string[] {
	switch (role) {
		case "super_admin":
			return ["*"];
		case "admin":
			return [
				"users.read", "users.write",
				"transactions.read", "transactions.write",
				"orders.read", "orders.write",
				"kyc.read", "kyc.write",
				"settings.read", "settings.write",
			];
		case "moderator":
			return [
				"users.read",
				"transactions.read",
				"orders.read",
				"kyc.read", "kyc.write",
			];
		default:
			return [];
	}
}

/**
 * Check if admin has specific permission
 */
export function hasPermission(admin: AdminUser, permission: string): boolean {
	if (admin.permissions.includes("*")) {
		return true;
	}
	return admin.permissions.includes(permission);
}

/**
 * Require admin authentication middleware
 * Returns 401 if not authenticated
 */
export async function requireAdmin() {
	const admin = await verifyAdminAuth();

	if (!admin) {
		return Response.json(
			{ error: "Unauthorized. Admin access required." },
			{ status: 401 }
		);
	}

	return admin;
}

/**
 * Require specific permission
 * Returns 403 if permission denied
 */
export async function requirePermission(permission: string) {
	const admin = await verifyAdminAuth();

	if (!admin) {
		return Response.json(
			{ error: "Unauthorized. Admin access required." },
			{ status: 401 }
		);
	}

	if (!hasPermission(admin, permission)) {
		return Response.json(
			{ error: "Forbidden. Insufficient permissions." },
			{ status: 403 }
		);
	}

	return admin;
}
