"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Calendar,
	Download,
	Users,
	TrendingUp,
	Clock,
	Activity,
	LogIn,
	UserCheck,
	MapPin,
	Smartphone,
	ChevronRight,
	Search,
	Filter,
} from "lucide-react";

interface UserActivity {
	userId: string;
	name: string;
	email: string;
	lastActive: string;
	loginCount: number;
	transactionCount: number;
	avgSessionDuration: string;
	deviceType: string;
	location: string;
	status: "Active" | "Inactive" | "New";
}

export default function UserActivityReportPage() {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive" | "New">("All");

	const mockUserActivity: UserActivity[] = [
		{
			userId: "USR-001",
			name: "Jacob Jones",
			email: "jacob@example.com",
			lastActive: "2 hours ago",
			loginCount: 45,
			transactionCount: 128,
			avgSessionDuration: "12m 34s",
			deviceType: "Mobile",
			location: "Lagos, Nigeria",
			status: "Active",
		},
		{
			userId: "USR-002",
			name: "Sarah Wilson",
			email: "sarah@example.com",
			lastActive: "5 hours ago",
			loginCount: 32,
			transactionCount: 89,
			avgSessionDuration: "8m 12s",
			deviceType: "Desktop",
			location: "Abuja, Nigeria",
			status: "Active",
		},
		{
			userId: "USR-003",
			name: "Mike Chen",
			email: "mike@example.com",
			lastActive: "1 day ago",
			loginCount: 28,
			transactionCount: 67,
			avgSessionDuration: "15m 45s",
			deviceType: "Mobile",
			location: "Port Harcourt, Nigeria",
			status: "Active",
		},
		{
			userId: "USR-004",
			name: "Emma Davis",
			email: "emma@example.com",
			lastActive: "3 days ago",
			loginCount: 12,
			transactionCount: 34,
			avgSessionDuration: "6m 22s",
			deviceType: "Desktop",
			location: "Ibadan, Nigeria",
			status: "Inactive",
		},
		{
			userId: "USR-005",
			name: "Alex Brown",
			email: "alex@example.com",
			lastActive: "1 hour ago",
			loginCount: 2,
			transactionCount: 5,
			avgSessionDuration: "4m 15s",
			deviceType: "Mobile",
			location: "Lagos, Nigeria",
			status: "New",
		},
	];

	const stats = {
		totalUsers: 3245,
		activeUsers: 2187,
		newUsers: 124,
		avgSessionDuration: "10m 23s",
	};

	const filteredUsers = mockUserActivity.filter((user) => {
		const matchesSearch =
			user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.userId.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === "All" || user.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const handleExport = () => {
		const csvContent = [
			["User ID", "Name", "Email", "Last Active", "Login Count", "Transactions", "Avg Session", "Device", "Location", "Status"],
			...filteredUsers.map(u => [
				u.userId,
				u.name,
				u.email,
				u.lastActive,
				u.loginCount.toString(),
				u.transactionCount.toString(),
				u.avgSessionDuration,
				u.deviceType,
				u.location,
				u.status
			])
		].map(row => row.join(",")).join("\n");

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `user-activity-report-${new Date().toISOString().split('T')[0]}.csv`;
		a.click();
		window.URL.revokeObjectURL(url);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Active":
				return "bg-success/10 text-success border-success";
			case "Inactive":
				return "bg-orange-50 text-orange-700 border-orange-200";
			case "New":
				return "bg-[var(--c-lime-500)]/10 text-[var(--c-lime-500)] border-primary/30";
			default:
				return "bg-background text-[var(--c-text-3)] border-[var(--c-line)]";
		}
	};

	return (
		<div className="space-y-6">
			{/* Breadcrumb */}
			<nav className="flex items-center gap-2 text-sm text-[var(--c-text-3)]">
				<button onClick={() => router.push("/admin")} className="hover:text-[var(--c-text)]">
					Dashboard
				</button>
				<ChevronRight className="w-4 h-4" />
				<button onClick={() => router.push("/admin/reports")} className="hover:text-[var(--c-text)]">
					Reports
				</button>
				<ChevronRight className="w-4 h-4" />
				<span className="font-medium text-[var(--c-text)]">User Activity Report</span>
			</nav>

			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button
						onClick={() => router.push("/admin/reports")}
						className="p-2 hover:bg-background rounded-lg transition-colors"
					>
						<ArrowLeft className="w-5 h-5 text-[var(--c-text-3)]" />
					</button>
					<div>
						<h1 className="text-2xl font-bold text-[var(--c-text)]">User Activity Report</h1>
						<p className="text-sm text-[var(--c-text-3)] mt-1">
							Detailed user engagement and activity patterns
						</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<button
						onClick={handleExport}
						className="flex items-center gap-2 px-4 py-2 bg-[var(--c-lime-500)] text-white rounded-lg hover:bg-[var(--c-lime-500)]/90 transition-colors shadow-sm"
					>
						<Download className="w-4 h-4" />
						Export CSV
					</button>
				</div>
			</div>

			{/* Period Selector */}
			<div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Calendar className="w-5 h-5 text-[var(--c-text-3)]" />
						<span className="text-sm font-medium text-[var(--c-text-3)]">Report Period:</span>
					</div>
					<div className="flex gap-2">
						{["Today", "Week", "Month", "Year"].map((period) => (
							<button
								key={period}
								className="px-4 py-2 text-sm font-medium bg-[var(--c-surface-2)] text-[var(--c-text-3)] hover:bg-[var(--c-surface-2)] rounded-lg transition-colors"
							>
								{period}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-[var(--c-lime-500)]/10 rounded-lg">
							<Users className="w-6 h-6 text-[var(--c-lime-500)]" />
						</div>
					</div>
					<h3 className="text-sm text-[var(--c-text-3)] font-medium mb-1">Total Users</h3>
					<p className="text-2xl font-bold text-[var(--c-text)]">{stats.totalUsers.toLocaleString()}</p>
				</div>

				<div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-success/10 rounded-lg">
							<Activity className="w-6 h-6 text-success" />
						</div>
					</div>
					<h3 className="text-sm text-[var(--c-text-3)] font-medium mb-1">Active Users</h3>
					<p className="text-2xl font-bold text-[var(--c-text)]">{stats.activeUsers.toLocaleString()}</p>
					<p className="text-xs text-success mt-1">
						{((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of total
					</p>
				</div>

				<div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-purple-50 rounded-lg">
							<UserCheck className="w-6 h-6 text-purple-600" />
						</div>
					</div>
					<h3 className="text-sm text-[var(--c-text-3)] font-medium mb-1">New Users</h3>
					<p className="text-2xl font-bold text-[var(--c-text)]">{stats.newUsers}</p>
					<p className="text-xs text-[var(--c-text-3)] mt-1">Last 30 days</p>
				</div>

				<div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-orange-50 rounded-lg">
							<Clock className="w-6 h-6 text-orange-600" />
						</div>
					</div>
					<h3 className="text-sm text-[var(--c-text-3)] font-medium mb-1">Avg Session</h3>
					<p className="text-2xl font-bold text-[var(--c-text)]">{stats.avgSessionDuration}</p>
					<p className="text-xs text-[var(--c-text-3)] mt-1">Per user</p>
				</div>
			</div>

			{/* Filters and Search */}
			<div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-4">
				<div className="flex items-center gap-3">
					<div className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--c-text-3)]" />
						<input
							type="text"
							placeholder="Search by name, email, or user ID..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2.5 border border-[var(--c-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
						/>
					</div>
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value as any)}
						className="px-4 py-2.5 border border-[var(--c-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
					>
						<option value="All">All Status</option>
						<option value="Active">Active</option>
						<option value="Inactive">Inactive</option>
						<option value="New">New</option>
					</select>
				</div>
			</div>

			{/* User Activity Table */}
			<div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)]">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-background border-b border-[var(--c-line)]">
							<tr>
								<th className="text-left py-4 px-6 text-xs font-semibold text-[var(--c-text-3)] uppercase">
									User
								</th>
								<th className="text-left py-4 px-6 text-xs font-semibold text-[var(--c-text-3)] uppercase">
									Last Active
								</th>
								<th className="text-left py-4 px-6 text-xs font-semibold text-[var(--c-text-3)] uppercase">
									Logins
								</th>
								<th className="text-left py-4 px-6 text-xs font-semibold text-[var(--c-text-3)] uppercase">
									Transactions
								</th>
								<th className="text-left py-4 px-6 text-xs font-semibold text-[var(--c-text-3)] uppercase">
									Avg Session
								</th>
								<th className="text-left py-4 px-6 text-xs font-semibold text-[var(--c-text-3)] uppercase">
									Device
								</th>
								<th className="text-left py-4 px-6 text-xs font-semibold text-[var(--c-text-3)] uppercase">
									Location
								</th>
								<th className="text-left py-4 px-6 text-xs font-semibold text-[var(--c-text-3)] uppercase">
									Status
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{filteredUsers.map((user) => (
								<tr
									key={user.userId}
									className="hover:bg-background transition-colors cursor-pointer"
									onClick={() => router.push(`/admin/users/${user.userId}`)}
								>
									<td className="py-4 px-6">
										<div>
											<p className="text-sm font-medium text-[var(--c-text)]">{user.name}</p>
											<p className="text-xs text-[var(--c-text-3)]">{user.email}</p>
										</div>
									</td>
									<td className="py-4 px-6">
										<div className="flex items-center gap-2">
											<Clock className="w-4 h-4 text-[var(--c-text-3)]" />
											<span className="text-sm text-[var(--c-text-3)]">{user.lastActive}</span>
										</div>
									</td>
									<td className="py-4 px-6">
										<div className="flex items-center gap-2">
											<LogIn className="w-4 h-4 text-[var(--c-text-3)]" />
											<span className="text-sm font-medium text-[var(--c-text)]">{user.loginCount}</span>
										</div>
									</td>
									<td className="py-4 px-6">
										<div className="flex items-center gap-2">
											<Activity className="w-4 h-4 text-[var(--c-text-3)]" />
											<span className="text-sm font-medium text-[var(--c-text)]">{user.transactionCount}</span>
										</div>
									</td>
									<td className="py-4 px-6">
										<span className="text-sm text-[var(--c-text-3)]">{user.avgSessionDuration}</span>
									</td>
									<td className="py-4 px-6">
										<div className="flex items-center gap-2">
											<Smartphone className="w-4 h-4 text-[var(--c-text-3)]" />
											<span className="text-sm text-[var(--c-text-3)]">{user.deviceType}</span>
										</div>
									</td>
									<td className="py-4 px-6">
										<div className="flex items-center gap-2">
											<MapPin className="w-4 h-4 text-[var(--c-text-3)]" />
											<span className="text-sm text-[var(--c-text-3)]">{user.location}</span>
										</div>
									</td>
									<td className="py-4 px-6">
										<span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(user.status)}`}>
											{user.status}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
