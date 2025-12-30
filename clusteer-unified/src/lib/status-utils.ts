/**
 * Status Utility Functions
 * Provides consistent status colors and icons across the admin dashboard
 */

export type StatusType =
	| "Active" | "Inactive" | "Suspended" | "Pending" | "Approved" | "Rejected"
	| "Completed" | "Failed" | "In Progress" | "Expired" | "Revoked"
	| "Success" | "Warning" | "Error" | "Connected" | "Not Connected";

export type RoleType = "Super Admin" | "Admin" | "Moderator" | "Support" | "User";

export const getStatusColor = (status: StatusType): string => {
	const statusMap: Record<string, string> = {
		// User/Admin statuses
		"Active": "bg-green-50 text-green-700 border-green-200",
		"Inactive": "bg-gray-50 text-gray-700 border-gray-200",
		"Suspended": "bg-red-50 text-red-700 border-red-200",

		// KYC statuses
		"Pending": "bg-orange-50 text-orange-700 border-orange-200",
		"Approved": "bg-green-50 text-green-700 border-green-200",
		"Rejected": "bg-red-50 text-red-700 border-red-200",

		// Transaction/Operation statuses
		"Completed": "bg-green-50 text-green-700 border-green-200",
		"Failed": "bg-red-50 text-red-700 border-red-200",
		"In Progress": "bg-blue-50 text-blue-700 border-blue-200",

		// API Key/Integration statuses
		"Expired": "bg-orange-50 text-orange-700 border-orange-200",
		"Revoked": "bg-red-50 text-red-700 border-red-200",

		// General statuses
		"Success": "bg-green-50 text-green-700 border-green-200",
		"Warning": "bg-orange-50 text-orange-700 border-orange-200",
		"Error": "bg-red-50 text-red-700 border-red-200",

		// Integration statuses
		"Connected": "bg-green-50 text-green-700 border-green-200",
		"Not Connected": "bg-gray-50 text-gray-700 border-gray-200",
	};

	return statusMap[status] || "bg-gray-50 text-gray-700 border-gray-200";
};

export const getRoleColor = (role: RoleType): string => {
	const roleMap: Record<RoleType, string> = {
		"Super Admin": "bg-purple-50 text-purple-700 border-purple-200",
		"Admin": "bg-blue-50 text-blue-700 border-blue-200",
		"Moderator": "bg-green-50 text-green-700 border-green-200",
		"Support": "bg-orange-50 text-orange-700 border-orange-200",
		"User": "bg-gray-50 text-gray-700 border-gray-200",
	};

	return roleMap[role] || "bg-gray-50 text-gray-700 border-gray-200";
};

export const getKYCStatusColor = (status: string): string => {
	const statusMap: Record<string, string> = {
		"Approved": "bg-green-50 text-green-700 border-green-200",
		"Pending": "bg-orange-50 text-orange-700 border-orange-200",
		"Rejected": "bg-red-50 text-red-700 border-red-200",
		"Under Review": "bg-blue-50 text-blue-700 border-blue-200",
	};

	return statusMap[status] || "bg-gray-50 text-gray-700 border-gray-200";
};

export const getTransactionStatusColor = (status: string): string => {
	const statusMap: Record<string, string> = {
		"Completed": "bg-green-50 text-green-700 border-green-200",
		"Pending": "bg-orange-50 text-orange-700 border-orange-200",
		"Failed": "bg-red-50 text-red-700 border-red-200",
		"Processing": "bg-blue-50 text-blue-700 border-blue-200",
		"Cancelled": "bg-gray-50 text-gray-700 border-gray-200",
	};

	return statusMap[status] || "bg-gray-50 text-gray-700 border-gray-200";
};

export const getSeverityColor = (severity: "low" | "medium" | "high" | "critical"): string => {
	const severityMap: Record<string, string> = {
		"low": "bg-blue-50 text-blue-700 border-blue-200",
		"medium": "bg-orange-50 text-orange-700 border-orange-200",
		"high": "bg-red-50 text-red-700 border-red-200",
		"critical": "bg-red-100 text-red-800 border-red-300",
	};

	return severityMap[severity] || "bg-gray-50 text-gray-700 border-gray-200";
};

export const getPriorityColor = (priority: "low" | "medium" | "high" | "urgent"): string => {
	const priorityMap: Record<string, string> = {
		"low": "bg-gray-50 text-gray-700 border-gray-200",
		"medium": "bg-blue-50 text-blue-700 border-blue-200",
		"high": "bg-orange-50 text-orange-700 border-orange-200",
		"urgent": "bg-red-50 text-red-700 border-red-200",
	};

	return priorityMap[priority] || "bg-gray-50 text-gray-700 border-gray-200";
};
