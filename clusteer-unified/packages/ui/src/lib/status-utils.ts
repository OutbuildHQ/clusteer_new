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
		"Active": "bg-success/10 text-success border-success",
		"Inactive": "bg-background text-muted-foreground border-border",
		"Suspended": "bg-danger/10 text-danger border-danger",

		// KYC statuses
		"Pending": "bg-orange-50 text-orange-700 border-orange-200",
		"Approved": "bg-success/10 text-success border-success",
		"Rejected": "bg-danger/10 text-danger border-danger",

		// Transaction/Operation statuses
		"Completed": "bg-success/10 text-success border-success",
		"Failed": "bg-danger/10 text-danger border-danger",
		"In Progress": "bg-primary/10 text-primary border-primary/30",

		// API Key/Integration statuses
		"Expired": "bg-orange-50 text-orange-700 border-orange-200",
		"Revoked": "bg-danger/10 text-danger border-danger",

		// General statuses
		"Success": "bg-success/10 text-success border-success",
		"Warning": "bg-orange-50 text-orange-700 border-orange-200",
		"Error": "bg-danger/10 text-danger border-danger",

		// Integration statuses
		"Connected": "bg-success/10 text-success border-success",
		"Not Connected": "bg-background text-muted-foreground border-border",
	};

	return statusMap[status] || "bg-background text-muted-foreground border-border";
};

export const getRoleColor = (role: RoleType): string => {
	const roleMap: Record<RoleType, string> = {
		"Super Admin": "bg-purple-50 text-purple-700 border-purple-200",
		"Admin": "bg-primary/10 text-primary border-primary/30",
		"Moderator": "bg-success/10 text-success border-success",
		"Support": "bg-orange-50 text-orange-700 border-orange-200",
		"User": "bg-background text-muted-foreground border-border",
	};

	return roleMap[role] || "bg-background text-muted-foreground border-border";
};

export const getKYCStatusColor = (status: string): string => {
	const statusMap: Record<string, string> = {
		"Approved": "bg-success/10 text-success border-success",
		"Pending": "bg-orange-50 text-orange-700 border-orange-200",
		"Rejected": "bg-danger/10 text-danger border-danger",
		"Under Review": "bg-primary/10 text-primary border-primary/30",
	};

	return statusMap[status] || "bg-background text-muted-foreground border-border";
};

export const getTransactionStatusColor = (status: string): string => {
	const statusMap: Record<string, string> = {
		"Completed": "bg-success/10 text-success border-success",
		"Pending": "bg-orange-50 text-orange-700 border-orange-200",
		"Failed": "bg-danger/10 text-danger border-danger",
		"Processing": "bg-primary/10 text-primary border-primary/30",
		"Cancelled": "bg-background text-muted-foreground border-border",
	};

	return statusMap[status] || "bg-background text-muted-foreground border-border";
};

export const getSeverityColor = (severity: "low" | "medium" | "high" | "critical"): string => {
	const severityMap: Record<string, string> = {
		"low": "bg-primary/10 text-primary border-primary/30",
		"medium": "bg-orange-50 text-orange-700 border-orange-200",
		"high": "bg-danger/10 text-danger border-danger",
		"critical": "bg-danger/10 text-danger border-red-300",
	};

	return severityMap[severity] || "bg-background text-muted-foreground border-border";
};

export const getPriorityColor = (priority: "low" | "medium" | "high" | "urgent"): string => {
	const priorityMap: Record<string, string> = {
		"low": "bg-background text-muted-foreground border-border",
		"medium": "bg-primary/10 text-primary border-primary/30",
		"high": "bg-orange-50 text-orange-700 border-orange-200",
		"urgent": "bg-danger/10 text-danger border-danger",
	};

	return priorityMap[priority] || "bg-background text-muted-foreground border-border";
};
