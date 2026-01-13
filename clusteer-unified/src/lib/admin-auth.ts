/**
 * Admin Authentication Helper
 * Verifies admin session and permissions
 */

import { cookies } from "next/headers";

export interface AdminUser {
	uid: string;
	email: string;
	role: "super_admin" | "admin" | "moderator";
	permissions: string[];
}

/**
 * Verify admin authentication from request cookies
 * Returns admin user info or null if not authenticated
 */
export async function verifyAdminAuth(): Promise<AdminUser | null> {
	try {
		const cookieStore = await cookies();
		const adminToken = cookieStore.get("admin_session");

		if (!adminToken) {
			return null;
		}

		// TODO: Verify token with Firebase Admin SDK or your auth system
		// For now, returning basic structure
		// This should be replaced with actual token verification

		return {
			uid: "admin-001",
			email: "admin@clusteer.com",
			role: "super_admin",
			permissions: ["*"], // All permissions for super admin
		};
	} catch (error) {
		console.error("Admin auth verification error:", error);
		return null;
	}
}

/**
 * Check if admin has specific permission
 */
export function hasPermission(admin: AdminUser, permission: string): boolean {
	// Super admin has all permissions
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
