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
		"Active": "bg-[var(--cl-up-soft)] text-[var(--cl-up)] border-[var(--cl-up)]",
		"Inactive": "bg-[var(--cl-bg)] text-[var(--cl-text-2)] border-[var(--cl-line)]",
		"Suspended": "bg-[var(--cl-down-soft)] text-[var(--cl-down)] border-[var(--cl-down)]",

		// KYC statuses
		"Pending": "bg-orange-50 text-orange-700 border-orange-200",
		"Approved": "bg-[var(--cl-up-soft)] text-[var(--cl-up)] border-[var(--cl-up)]",
		"Rejected": "bg-[var(--cl-down-soft)] text-[var(--cl-down)] border-[var(--cl-down)]",

		// Transaction/Operation statuses
		"Completed": "bg-[var(--cl-up-soft)] text-[var(--cl-up)] border-[var(--cl-up)]",
		"Failed": "bg-[var(--cl-down-soft)] text-[var(--cl-down)] border-[var(--cl-down)]",
		"In Progress": "bg-[var(--cl-info-soft)] text-[var(--cl-brand-700)] border-[var(--cl-brand-200)]",

		// API Key/Integration statuses
		"Expired": "bg-orange-50 text-orange-700 border-orange-200",
		"Revoked": "bg-[var(--cl-down-soft)] text-[var(--cl-down)] border-[var(--cl-down)]",

		// General statuses
		"Success": "bg-[var(--cl-up-soft)] text-[var(--cl-up)] border-[var(--cl-up)]",
		"Warning": "bg-orange-50 text-orange-700 border-orange-200",
		"Error": "bg-[var(--cl-down-soft)] text-[var(--cl-down)] border-[var(--cl-down)]",

		// Integration statuses
		"Connected": "bg-[var(--cl-up-soft)] text-[var(--cl-up)] border-[var(--cl-up)]",
		"Not Connected": "bg-[var(--cl-bg)] text-[var(--cl-text-2)] border-[var(--cl-line)]",
	};

	return statusMap[status] || "bg-[var(--cl-bg)] text-[var(--cl-text-2)] border-[var(--cl-line)]";
};

export const getRoleColor = (role: RoleType): string => {
	const roleMap: Record<RoleType, string> = {
		"Super Admin": "bg-purple-50 text-purple-700 border-purple-200",
		"Admin": "bg-[var(--cl-info-soft)] text-[var(--cl-brand-700)] border-[var(--cl-brand-200)]",
		"Moderator": "bg-[var(--cl-up-soft)] text-[var(--cl-up)] border-[var(--cl-up)]",
		"Support": "bg-orange-50 text-orange-700 border-orange-200",
		"User": "bg-[var(--cl-bg)] text-[var(--cl-text-2)] border-[var(--cl-line)]",
	};

	return roleMap[role] || "bg-[var(--cl-bg)] text-[var(--cl-text-2)] border-[var(--cl-line)]";
};

export const getKYCStatusColor = (status: string): string => {
	const statusMap: Record<string, string> = {
		"Approved": "bg-[var(--cl-up-soft)] text-[var(--cl-up)] border-[var(--cl-up)]",
		"Pending": "bg-orange-50 text-orange-700 border-orange-200",
		"Rejected": "bg-[var(--cl-down-soft)] text-[var(--cl-down)] border-[var(--cl-down)]",
		"Under Review": "bg-[var(--cl-info-soft)] text-[var(--cl-brand-700)] border-[var(--cl-brand-200)]",
	};

	return statusMap[status] || "bg-[var(--cl-bg)] text-[var(--cl-text-2)] border-[var(--cl-line)]";
};

export const getTransactionStatusColor = (status: string): string => {
	const statusMap: Record<string, string> = {
		"Completed": "bg-[var(--cl-up-soft)] text-[var(--cl-up)] border-[var(--cl-up)]",
		"Pending": "bg-orange-50 text-orange-700 border-orange-200",
		"Failed": "bg-[var(--cl-down-soft)] text-[var(--cl-down)] border-[var(--cl-down)]",
		"Processing": "bg-[var(--cl-info-soft)] text-[var(--cl-brand-700)] border-[var(--cl-brand-200)]",
		"Cancelled": "bg-[var(--cl-bg)] text-[var(--cl-text-2)] border-[var(--cl-line)]",
	};

	return statusMap[status] || "bg-[var(--cl-bg)] text-[var(--cl-text-2)] border-[var(--cl-line)]";
};

export const getSeverityColor = (severity: "low" | "medium" | "high" | "critical"): string => {
	const severityMap: Record<string, string> = {
		"low": "bg-[var(--cl-info-soft)] text-[var(--cl-brand-700)] border-[var(--cl-brand-200)]",
		"medium": "bg-orange-50 text-orange-700 border-orange-200",
		"high": "bg-[var(--cl-down-soft)] text-[var(--cl-down)] border-[var(--cl-down)]",
		"critical": "bg-[var(--cl-down-soft)] text-[var(--cl-down)] border-red-300",
	};

	return severityMap[severity] || "bg-[var(--cl-bg)] text-[var(--cl-text-2)] border-[var(--cl-line)]";
};

export const getPriorityColor = (priority: "low" | "medium" | "high" | "urgent"): string => {
	const priorityMap: Record<string, string> = {
		"low": "bg-[var(--cl-bg)] text-[var(--cl-text-2)] border-[var(--cl-line)]",
		"medium": "bg-[var(--cl-info-soft)] text-[var(--cl-brand-700)] border-[var(--cl-brand-200)]",
		"high": "bg-orange-50 text-orange-700 border-orange-200",
		"urgent": "bg-[var(--cl-down-soft)] text-[var(--cl-down)] border-[var(--cl-down)]",
	};

	return priorityMap[priority] || "bg-[var(--cl-bg)] text-[var(--cl-text-2)] border-[var(--cl-line)]";
};
