/**
 * Admin Users API
 * GET /api/admin/users - List all users with filters
 */

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import { listUsers, getAdminDb } from "@/lib/firebase-admin";

export async function GET(request: NextRequest) {
	// Verify admin authentication and permissions
	const adminOrError = await requirePermission("users.read");
	if (adminOrError instanceof Response) {
		return adminOrError; // Return error response
	}

	try {
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "20");
		const search = searchParams.get("search") || "";
		const kycStatus = searchParams.get("kycStatus") || "";
		const accountStatus = searchParams.get("accountStatus") || "";

		// Get users from Firebase Auth
		const usersResult = await listUsers(1000); // Get up to 1000 users

		if (!usersResult) {
			return NextResponse.json(
				{ error: "Failed to fetch users" },
				{ status: 500 }
			);
		}

		// Get additional user data from Firestore
		const db = getAdminDb();
		const usersCollection = db.collection("users");
		const usersSnapshot = await usersCollection.get();

		// Create a map of user profiles from Firestore
		const userProfiles = new Map();
		usersSnapshot.forEach((doc) => {
			userProfiles.set(doc.id, { id: doc.id, ...doc.data() });
		});

		// Combine Firebase Auth users with Firestore profiles
		let users = usersResult.users.map((user) => {
			const profile = userProfiles.get(user.uid) || {};

			return {
				id: user.uid,
				name: user.displayName || profile.username || "N/A",
				email: user.email || "N/A",
				phone: user.phoneNumber || profile.phone || "N/A",
				kycStatus: profile.kycStatus || "Pending",
				accountStatus: user.disabled ? "Suspended" : "Active",
				dateJoined: user.metadata.creationTime,
				lastLogin: user.metadata.lastSignInTime,
				emailVerified: user.emailVerified,
				photoURL: user.photoURL || null,
				// Additional profile data
				...profile,
			};
		});

		// Apply filters
		if (search) {
			const searchLower = search.toLowerCase();
			users = users.filter(
				(user) =>
					user.name.toLowerCase().includes(searchLower) ||
					user.email.toLowerCase().includes(searchLower) ||
					user.phone.includes(search)
			);
		}

		if (kycStatus) {
			users = users.filter((user) => user.kycStatus === kycStatus);
		}

		if (accountStatus) {
			users = users.filter((user) => user.accountStatus === accountStatus);
		}

		// Pagination
		const total = users.length;
		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;
		const paginatedUsers = users.slice(startIndex, endIndex);

		return NextResponse.json({
			users: paginatedUsers,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error("Admin users API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
