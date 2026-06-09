/**
 * Admin User Detail API
 * GET /api/admin/users/[id] - Get user details
 * PUT /api/admin/users/[id] - Update user
 * DELETE /api/admin/users/[id] - Delete user
 */

import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import { getUserByUid, updateUser, deleteUser, getAdminDb } from "@/lib/firebase-admin";

interface RouteParams {
	params: Promise<{
		id: string;
	}>;
}

/**
 * GET - Fetch single user details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
	// Verify admin authentication and permissions
	const adminOrError = await requirePermission("users.read");
	if (adminOrError instanceof Response) {
		return adminOrError;
	}

	try {
		const { id } = await params;

		// Get user from Firebase Auth
		const authUser = await getUserByUid(id);
		if (!authUser) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		// Get additional profile data from Firestore
		const db = getAdminDb();
		const userDoc = await db.collection("users").doc(id).get();
		const profile = (userDoc.exists ? userDoc.data() : {}) as Record<string, any>;

		// Get user's transactions count
		const transactionsSnapshot = await db
			.collection("transactions")
			.where("userId", "==", id)
			.count()
			.get();

		// Get user's wallet balances
		const walletsSnapshot = await db
			.collection("wallets")
			.where("userId", "==", id)
			.get();

		const wallets = walletsSnapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data()
		}));

		// Get user's bank accounts
		const bankAccountsSnapshot = await db
			.collection("bank_accounts")
			.where("userId", "==", id)
			.get();

		const bankAccounts = bankAccountsSnapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data()
		}));

		// Combine all data
		const userDetails = {
			// Firebase Auth data
			id: authUser.uid,
			email: authUser.email || "N/A",
			emailVerified: authUser.emailVerified,
			phoneNumber: authUser.phoneNumber || profile.phone || "N/A",
			displayName: authUser.displayName || profile.username || "N/A",
			photoURL: authUser.photoURL || null,
			disabled: authUser.disabled,
			createdAt: authUser.metadata.creationTime,
			lastSignIn: authUser.metadata.lastSignInTime,

			// Firestore profile data
			username: profile.username || "N/A",
			firstName: profile.firstName || "",
			lastName: profile.lastName || "",
			dateOfBirth: profile.dateOfBirth || null,
			address: profile.address || null,
			city: profile.city || null,
			state: profile.state || null,
			country: profile.country || "Nigeria",
			zipCode: profile.zipCode || null,

			// KYC data
			kycStatus: profile.kycStatus || "Pending",
			kycLevel: profile.kycLevel || 0,
			kycDocuments: profile.kycDocuments || [],
			kycVerifiedAt: profile.kycVerifiedAt || null,

			// Account status
			accountStatus: authUser.disabled ? "Suspended" : "Active",
			suspendedAt: profile.suspendedAt || null,
			suspensionReason: profile.suspensionReason || null,

			// 2FA
			twoFactorEnabled: profile.twoFactorEnabled || false,

			// Statistics
			totalTransactions: transactionsSnapshot.data().count || 0,
			wallets: wallets,
			bankAccounts: bankAccounts,

			// Metadata
			lastUpdated: profile.lastUpdated || null,
			customClaims: authUser.customClaims || {},
		};

		return NextResponse.json({ user: userDetails });
	} catch (error) {
		console.error("Admin user detail API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

/**
 * PUT - Update user details
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
	// Verify admin authentication and permissions
	const adminOrError = await requirePermission("users.update");
	if (adminOrError instanceof Response) {
		return adminOrError;
	}

	try {
		const { id } = await params;
		const body = await request.json();

		const {
			email,
			phoneNumber,
			displayName,
			username,
			firstName,
			lastName,
			dateOfBirth,
			address,
			city,
			state,
			country,
			zipCode,
			kycStatus,
			kycLevel,
			emailVerified,
		} = body;

		// Update Firebase Auth user
		const authUpdates: any = {};
		if (email !== undefined) authUpdates.email = email;
		if (phoneNumber !== undefined) authUpdates.phoneNumber = phoneNumber;
		if (displayName !== undefined) authUpdates.displayName = displayName;
		if (emailVerified !== undefined) authUpdates.emailVerified = emailVerified;

		if (Object.keys(authUpdates).length > 0) {
			const updatedAuthUser = await updateUser(id, authUpdates);
			if (!updatedAuthUser) {
				return NextResponse.json(
					{ error: "Failed to update user authentication" },
					{ status: 500 }
				);
			}
		}

		// Update Firestore profile
		const db = getAdminDb();
		const profileUpdates: any = {
			lastUpdated: new Date().toISOString(),
		};

		if (username !== undefined) profileUpdates.username = username;
		if (firstName !== undefined) profileUpdates.firstName = firstName;
		if (lastName !== undefined) profileUpdates.lastName = lastName;
		if (dateOfBirth !== undefined) profileUpdates.dateOfBirth = dateOfBirth;
		if (address !== undefined) profileUpdates.address = address;
		if (city !== undefined) profileUpdates.city = city;
		if (state !== undefined) profileUpdates.state = state;
		if (country !== undefined) profileUpdates.country = country;
		if (zipCode !== undefined) profileUpdates.zipCode = zipCode;
		if (kycStatus !== undefined) {
			profileUpdates.kycStatus = kycStatus;
			if (kycStatus === "Verified") {
				profileUpdates.kycVerifiedAt = new Date().toISOString();
			}
		}
		if (kycLevel !== undefined) profileUpdates.kycLevel = kycLevel;

		await db.collection("users").doc(id).set(profileUpdates, { merge: true });

		// Fetch updated user data
		const authUser = await getUserByUid(id);
		const userDoc = await db.collection("users").doc(id).get();
		const profile = userDoc.exists ? userDoc.data() : {};

		return NextResponse.json({
			message: "User updated successfully",
			user: {
				id: authUser?.uid,
				email: authUser?.email,
				displayName: authUser?.displayName,
				...profile,
			},
		});
	} catch (error) {
		console.error("Admin user update API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

/**
 * DELETE - Delete user
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
	// Verify admin authentication and permissions
	const adminOrError = await requirePermission("users.delete");
	if (adminOrError instanceof Response) {
		return adminOrError;
	}

	try {
		const { id } = await params;

		// Delete from Firebase Auth
		const deleted = await deleteUser(id);
		if (!deleted) {
			return NextResponse.json(
				{ error: "Failed to delete user from authentication" },
				{ status: 500 }
			);
		}

		// Delete from Firestore (user profile)
		const db = getAdminDb();
		await db.collection("users").doc(id).delete();

		// Optionally: Delete or archive related data
		// - Transactions (keep for audit trail, mark as deleted user)
		// - Wallets (should be transferred or zeroed)
		// - Bank accounts (delete)
		const bankAccountsSnapshot = await db
			.collection("bank_accounts")
			.where("userId", "==", id)
			.get();

		const deletePromises = bankAccountsSnapshot.docs.map(doc =>
			doc.ref.delete()
		);
		await Promise.all(deletePromises);

		return NextResponse.json({
			message: "User deleted successfully",
			deletedUserId: id,
		});
	} catch (error) {
		console.error("Admin user delete API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
