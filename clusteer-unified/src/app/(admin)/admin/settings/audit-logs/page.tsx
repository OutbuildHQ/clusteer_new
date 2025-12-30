"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	FileText,
	Search,
	Filter,
	Download,
	Calendar,
	User,
	Shield,
	Settings,
	Database,
	Key,
	Users,
	DollarSign,
	AlertCircle,
	CheckCircle,
	XCircle,
	Eye,
	Clock,
	Globe,
} from "lucide-react";

interface AuditLog {
	id: string;
	timestamp: string;
	user: {
		name: string;
		email: string;
		role: string;
	};
	action: string;
	category: "Authentication" | "User Management" | "Settings" | "Transactions" | "Security" | "System";
	status: "Success" | "Failed" | "Warning";
	ipAddress: string;
	userAgent: string;
	details: string;
	metadata?: Record<string, any>;
}

export default function AuditLogsPage() {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("All");
	const [selectedStatus, setSelectedStatus] = useState<string>("All");
	const [showFilters, setShowFilters] = useState(false);
	const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
	const [dateRange, setDateRange] = useState({ start: "", end: "" });

	const [auditLogs] = useState<AuditLog[]>([
		{
			id: "log-1",
			timestamp: "2025-01-16 10:45:32",
			user: { name: "Admin User", email: "admin@clusteer.com", role: "Super Admin" },
			action: "User Account Created",
			category: "User Management",
			status: "Success",
			ipAddress: "192.168.1.100",
			userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
			details: "Created new user account for john.doe@example.com",
			metadata: { userId: "user-123", email: "john.doe@example.com" },
		},
		{
			id: "log-2",
			timestamp: "2025-01-16 10:30:15",
			user: { name: "System", email: "system@clusteer.com", role: "System" },
			action: "Automatic Backup Completed",
			category: "System",
			status: "Success",
			ipAddress: "127.0.0.1",
			userAgent: "System/1.0",
			details: "Daily incremental backup completed successfully (420 MB)",
			metadata: { backupId: "bak-456", size: "420 MB" },
		},
		{
			id: "log-3",
			timestamp: "2025-01-16 09:15:42",
			user: { name: "Jacob Jones", email: "jacob@example.com", role: "User" },
			action: "Login Failed",
			category: "Authentication",
			status: "Failed",
			ipAddress: "203.45.67.89",
			userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
			details: "Invalid password attempt (3rd attempt)",
			metadata: { attemptCount: 3 },
		},
		{
			id: "log-4",
			timestamp: "2025-01-16 08:50:20",
			user: { name: "Admin User", email: "admin@clusteer.com", role: "Super Admin" },
			action: "Transaction Fee Updated",
			category: "Settings",
			status: "Success",
			ipAddress: "192.168.1.100",
			userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
			details: "Updated transaction fee from 2.0% to 2.5%",
			metadata: { oldValue: "2.0%", newValue: "2.5%" },
		},
		{
			id: "log-5",
			timestamp: "2025-01-16 08:20:10",
			user: { name: "Sarah Wilson", email: "sarah@example.com", role: "User" },
			action: "Large Transaction Detected",
			category: "Transactions",
			status: "Warning",
			ipAddress: "45.123.67.200",
			userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
			details: "Transaction amount ($15,000) exceeds normal pattern",
			metadata: { amount: "$15,000", avgAmount: "$500" },
		},
		{
			id: "log-6",
			timestamp: "2025-01-16 07:45:55",
			user: { name: "Admin User", email: "admin@clusteer.com", role: "Super Admin" },
			action: "API Key Generated",
			category: "Security",
			status: "Success",
			ipAddress: "192.168.1.100",
			userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
			details: "New API key created: Production API Key",
			metadata: { keyId: "key-789", keyName: "Production API Key" },
		},
		{
			id: "log-7",
			timestamp: "2025-01-16 07:10:30",
			user: { name: "Mike Chen", email: "mike@example.com", role: "User" },
			action: "Password Changed",
			category: "Authentication",
			status: "Success",
			ipAddress: "78.90.12.34",
			userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
			details: "User successfully changed account password",
		},
		{
			id: "log-8",
			timestamp: "2025-01-16 06:30:12",
			user: { name: "System", email: "system@clusteer.com", role: "System" },
			action: "Security Scan Completed",
			category: "Security",
			status: "Success",
			ipAddress: "127.0.0.1",
			userAgent: "System/1.0",
			details: "Automated security scan found no vulnerabilities",
			metadata: { scanDuration: "45s", issuesFound: 0 },
		},
	]);

	const categories = ["All", "Authentication", "User Management", "Settings", "Transactions", "Security", "System"];
	const statuses = ["All", "Success", "Failed", "Warning"];

	const filteredLogs = auditLogs.filter((log) => {
		const matchesSearch =
			log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
			log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			log.details.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesCategory = selectedCategory === "All" || log.category === selectedCategory;
		const matchesStatus = selectedStatus === "All" || log.status === selectedStatus;

		return matchesSearch && matchesCategory && matchesStatus;
	});

	const getCategoryIcon = (category: AuditLog["category"]) => {
		switch (category) {
			case "Authentication":
				return <Shield className="w-4 h-4" />;
			case "User Management":
				return <Users className="w-4 h-4" />;
			case "Settings":
				return <Settings className="w-4 h-4" />;
			case "Transactions":
				return <DollarSign className="w-4 h-4" />;
			case "Security":
				return <Key className="w-4 h-4" />;
			case "System":
				return <Database className="w-4 h-4" />;
		}
	};

	const getCategoryColor = (category: AuditLog["category"]) => {
		switch (category) {
			case "Authentication":
				return "bg-blue-50 text-blue-700 border-blue-200";
			case "User Management":
				return "bg-purple-50 text-purple-700 border-purple-200";
			case "Settings":
				return "bg-gray-50 text-gray-700 border-gray-200";
			case "Transactions":
				return "bg-green-50 text-green-700 border-green-200";
			case "Security":
				return "bg-red-50 text-red-700 border-red-200";
			case "System":
				return "bg-orange-50 text-orange-700 border-orange-200";
		}
	};

	const getStatusColor = (status: AuditLog["status"]) => {
		switch (status) {
			case "Success":
				return "bg-green-50 text-green-700 border-green-200";
			case "Failed":
				return "bg-red-50 text-red-700 border-red-200";
			case "Warning":
				return "bg-orange-50 text-orange-700 border-orange-200";
		}
	};

	const getStatusIcon = (status: AuditLog["status"]) => {
		switch (status) {
			case "Success":
				return <CheckCircle className="w-4 h-4" />;
			case "Failed":
				return <XCircle className="w-4 h-4" />;
			case "Warning":
				return <AlertCircle className="w-4 h-4" />;
		}
	};

	const handleExport = () => {
		const csvContent = [
			["Timestamp", "User", "Action", "Category", "Status", "IP Address", "Details"],
			...filteredLogs.map((log) => [
				log.timestamp,
				log.user.name,
				log.action,
				log.category,
				log.status,
				log.ipAddress,
				log.details,
			]),
		]
			.map((row) => row.join(","))
			.join("\n");

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
		a.click();
		window.URL.revokeObjectURL(url);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button
						onClick={() => router.push("/admin/settings")}
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
					>
						<ArrowLeft className="w-5 h-5 text-gray-600" />
					</button>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
						<p className="text-sm text-gray-600 mt-1">Track all system activities and changes</p>
					</div>
				</div>
				<button
					onClick={handleExport}
					className="flex items-center gap-2 px-4 py-2 bg-[#014F01] text-white rounded-lg hover:bg-[#013d01] transition-colors shadow-sm"
				>
					<Download className="w-4 h-4" />
					Export Logs
				</button>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-blue-50 rounded-lg">
							<FileText className="w-6 h-6 text-blue-600" />
						</div>
					</div>
					<h3 className="text-sm text-gray-600 font-medium mb-1">Total Logs</h3>
					<p className="text-2xl font-bold text-gray-900">{auditLogs.length}</p>
				</div>

				<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-green-50 rounded-lg">
							<CheckCircle className="w-6 h-6 text-green-600" />
						</div>
					</div>
					<h3 className="text-sm text-gray-600 font-medium mb-1">Success</h3>
					<p className="text-2xl font-bold text-gray-900">
						{auditLogs.filter((l) => l.status === "Success").length}
					</p>
				</div>

				<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-red-50 rounded-lg">
							<XCircle className="w-6 h-6 text-red-600" />
						</div>
					</div>
					<h3 className="text-sm text-gray-600 font-medium mb-1">Failed</h3>
					<p className="text-2xl font-bold text-gray-900">
						{auditLogs.filter((l) => l.status === "Failed").length}
					</p>
				</div>

				<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-orange-50 rounded-lg">
							<AlertCircle className="w-6 h-6 text-orange-600" />
						</div>
					</div>
					<h3 className="text-sm text-gray-600 font-medium mb-1">Warnings</h3>
					<p className="text-2xl font-bold text-gray-900">
						{auditLogs.filter((l) => l.status === "Warning").length}
					</p>
				</div>
			</div>

			{/* Filters */}
			<div className="bg-white rounded-lg border border-[#E9EAEB] p-4">
				<div className="flex flex-col md:flex-row items-start md:items-center gap-4">
					{/* Search */}
					<div className="flex-1 relative">
						<Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search logs by action, user, or details..."
							className="w-full pl-10 pr-4 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01] text-sm"
						/>
					</div>

					{/* Category Filter */}
					<select
						value={selectedCategory}
						onChange={(e) => setSelectedCategory(e.target.value)}
						className="px-4 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01] text-sm"
					>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>

					{/* Status Filter */}
					<select
						value={selectedStatus}
						onChange={(e) => setSelectedStatus(e.target.value)}
						className="px-4 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01] text-sm"
					>
						{statuses.map((status) => (
							<option key={status} value={status}>
								{status}
							</option>
						))}
					</select>

					<button
						onClick={() => setShowFilters(!showFilters)}
						className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
							showFilters
								? "bg-[#E7F6EC] border-[#014F01] text-[#014F01]"
								: "bg-white border-[#E9EAEB] text-gray-700 hover:bg-[#FAFAFA]"
						}`}
					>
						<Filter className="w-4 h-4" />
						More Filters
					</button>
				</div>

				{/* Advanced Filters */}
				{showFilters && (
					<div className="mt-4 pt-4 border-t border-[#E9EAEB]">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
								<input
									type="date"
									value={dateRange.start}
									onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
									className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01] text-sm"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
								<input
									type="date"
									value={dateRange.end}
									onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
									className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01] text-sm"
								/>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Audit Logs Table */}
			<div className="bg-white rounded-lg border border-[#E9EAEB]">
				<div className="p-6 border-b border-[#E9EAEB]">
					<h2 className="text-lg font-semibold text-gray-900">Activity Log</h2>
					<p className="text-sm text-gray-600 mt-1">
						Showing {filteredLogs.length} of {auditLogs.length} logs
					</p>
				</div>

				<div className="divide-y divide-[#E9EAEB]">
					{filteredLogs.map((log) => (
						<div key={log.id} className="p-6 hover:bg-[#FAFAFA] transition-colors">
							<div className="flex items-start justify-between mb-3">
								<div className="flex items-start gap-4 flex-1">
									<div className={`p-3 rounded-lg ${getCategoryColor(log.category)}`}>
										{getCategoryIcon(log.category)}
									</div>
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-2">
											<h3 className="text-sm font-semibold text-gray-900">{log.action}</h3>
											<span
												className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border rounded ${getCategoryColor(
													log.category
												)}`}
											>
												{log.category}
											</span>
											<span
												className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border rounded ${getStatusColor(
													log.status
												)}`}
											>
												{getStatusIcon(log.status)}
												{log.status}
											</span>
										</div>
										<p className="text-sm text-gray-600 mb-2">{log.details}</p>
										<div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
											<div className="flex items-center gap-1">
												<User className="w-3 h-3" />
												<span>
													{log.user.name} ({log.user.role})
												</span>
											</div>
											<div className="flex items-center gap-1">
												<Clock className="w-3 h-3" />
												<span>{log.timestamp}</span>
											</div>
											<div className="flex items-center gap-1">
												<Globe className="w-3 h-3" />
												<span>{log.ipAddress}</span>
											</div>
										</div>
									</div>
								</div>
								<button
									onClick={() => setSelectedLog(log)}
									className="p-2 hover:bg-gray-100 rounded transition-colors"
									title="View Details"
								>
									<Eye className="w-4 h-4 text-gray-600" />
								</button>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Log Detail Modal */}
			{selectedLog && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
					<div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6 border-b border-[#E9EAEB]">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-bold text-gray-900">Log Details</h2>
								<span
									className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded ${getStatusColor(
										selectedLog.status
									)}`}
								>
									{getStatusIcon(selectedLog.status)}
									{selectedLog.status}
								</span>
							</div>
						</div>

						<div className="p-6 space-y-6">
							<div>
								<h3 className="text-sm font-semibold text-gray-900 mb-3">Action</h3>
								<div className="flex items-center gap-3">
									<div className={`p-3 rounded-lg ${getCategoryColor(selectedLog.category)}`}>
										{getCategoryIcon(selectedLog.category)}
									</div>
									<div>
										<p className="text-sm font-medium text-gray-900">{selectedLog.action}</p>
										<p className="text-xs text-gray-600">{selectedLog.category}</p>
									</div>
								</div>
							</div>

							<div>
								<h3 className="text-sm font-semibold text-gray-900 mb-3">Details</h3>
								<p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
									{selectedLog.details}
								</p>
							</div>

							<div>
								<h3 className="text-sm font-semibold text-gray-900 mb-3">User Information</h3>
								<div className="space-y-2 text-sm">
									<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
										<span className="text-gray-600">Name:</span>
										<span className="font-medium text-gray-900">{selectedLog.user.name}</span>
									</div>
									<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
										<span className="text-gray-600">Email:</span>
										<span className="font-medium text-gray-900">{selectedLog.user.email}</span>
									</div>
									<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
										<span className="text-gray-600">Role:</span>
										<span className="font-medium text-gray-900">{selectedLog.user.role}</span>
									</div>
								</div>
							</div>

							<div>
								<h3 className="text-sm font-semibold text-gray-900 mb-3">Technical Details</h3>
								<div className="space-y-2 text-sm">
									<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
										<span className="text-gray-600">Timestamp:</span>
										<span className="font-medium text-gray-900">{selectedLog.timestamp}</span>
									</div>
									<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
										<span className="text-gray-600">IP Address:</span>
										<span className="font-medium text-gray-900">{selectedLog.ipAddress}</span>
									</div>
									<div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg">
										<span className="text-gray-600">User Agent:</span>
										<span className="font-medium text-gray-900 text-xs break-all">
											{selectedLog.userAgent}
										</span>
									</div>
								</div>
							</div>

							{selectedLog.metadata && (
								<div>
									<h3 className="text-sm font-semibold text-gray-900 mb-3">Additional Metadata</h3>
									<pre className="text-xs bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-auto">
										{JSON.stringify(selectedLog.metadata, null, 2)}
									</pre>
								</div>
							)}
						</div>

						<div className="p-6 border-t border-[#E9EAEB] flex justify-end">
							<button
								onClick={() => setSelectedLog(null)}
								className="px-4 py-2 bg-[#014F01] text-white rounded-lg hover:bg-[#013d01] transition-colors"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
