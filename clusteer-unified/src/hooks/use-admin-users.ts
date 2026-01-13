/**
 * Custom hook for admin users data fetching
 */

import { useState, useEffect, useCallback } from "react";

export interface AdminUser {
	id: string;
	name: string;
	email: string;
	phone: string;
	kycStatus: "Approved" | "Pending" | "Rejected" | "Verified";
	accountStatus: "Active" | "Suspended";
	dateJoined: string;
	lastLogin?: string;
	emailVerified: boolean;
}

export interface UsersResponse {
	users: AdminUser[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

interface UseAdminUsersOptions {
	page?: number;
	limit?: number;
	search?: string;
	kycStatus?: string;
	accountStatus?: string;
}

export function useAdminUsers(options: UseAdminUsersOptions = {}) {
	const [data, setData] = useState<UsersResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchUsers = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			// Build query parameters
			const params = new URLSearchParams();
			if (options.page) params.append("page", options.page.toString());
			if (options.limit) params.append("limit", options.limit.toString());
			if (options.search) params.append("search", options.search);
			if (options.kycStatus && options.kycStatus !== "all") params.append("kycStatus", options.kycStatus);
			if (options.accountStatus && options.accountStatus !== "all") params.append("accountStatus", options.accountStatus);

			const response = await fetch(`/api/admin/users?${params.toString()}`);

			if (!response.ok) {
				throw new Error(`Failed to fetch users: ${response.statusText}`);
			}

			const result: UsersResponse = await response.json();

			// Map Firestore kycStatus to component expected values
			const mappedUsers = result.users.map(user => ({
				...user,
				name: user.name || "N/A",
				kycStatus: (user.kycStatus === "Verified" ? "Approved" : user.kycStatus) as "Approved" | "Pending" | "Rejected",
			}));

			setData({
				...result,
				users: mappedUsers,
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			console.error("Admin users fetch error:", err);
		} finally {
			setIsLoading(false);
		}
	}, [options.page, options.limit, options.search, options.kycStatus, options.accountStatus]);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	return {
		users: data?.users || [],
		pagination: data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
		isLoading,
		error,
		refetch: fetchUsers,
	};
}

/**
 * Hook for user detail operations
 */
export function useAdminUser(userId: string | null) {
	const [user, setUser] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchUser = useCallback(async () => {
		if (!userId) return;

		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/admin/users/${userId}`);

			if (!response.ok) {
				throw new Error(`Failed to fetch user: ${response.statusText}`);
			}

			const result = await response.json();
			setUser(result.user);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			console.error("Admin user fetch error:", err);
		} finally {
			setIsLoading(false);
		}
	}, [userId]);

	const updateUser = async (updates: any) => {
		if (!userId) return;

		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/admin/users/${userId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updates),
			});

			if (!response.ok) {
				throw new Error(`Failed to update user: ${response.statusText}`);
			}

			const result = await response.json();
			setUser(result.user);
			return result;
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			console.error("Admin user update error:", err);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const suspendUser = async (reason: string) => {
		if (!userId) return;

		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/admin/users/${userId}/suspend`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ reason }),
			});

			if (!response.ok) {
				throw new Error(`Failed to suspend user: ${response.statusText}`);
			}

			const result = await response.json();
			await fetchUser(); // Refresh user data
			return result;
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			console.error("Admin user suspend error:", err);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const activateUser = async () => {
		if (!userId) return;

		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/admin/users/${userId}/activate`, {
				method: "POST",
			});

			if (!response.ok) {
				throw new Error(`Failed to activate user: ${response.statusText}`);
			}

			const result = await response.json();
			await fetchUser(); // Refresh user data
			return result;
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			console.error("Admin user activate error:", err);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const deleteUser = async () => {
		if (!userId) return;

		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/admin/users/${userId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error(`Failed to delete user: ${response.statusText}`);
			}

			const result = await response.json();
			return result;
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			console.error("Admin user delete error:", err);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	return {
		user,
		isLoading,
		error,
		updateUser,
		suspendUser,
		activateUser,
		deleteUser,
		refetch: fetchUser,
	};
}
