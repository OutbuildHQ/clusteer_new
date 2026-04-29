"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Calendar,
	Download,
	Shield,
	CheckCircle,
	XCircle,
	Clock,
	AlertTriangle,
	FileText,
	ChevronRight,
	Flag,
	Search,
	Users,
} from "lucide-react";

interface KYCStatus {
	status: "Approved" | "Pending" | "Rejected";
	count: number;
	percentage: number;
	color: string;
}

interface FlaggedAccount {
	userId: string;
	name: string;
	email: string;
	reason: string;
	flaggedDate: string;
	riskLevel: "Low" | "Medium" | "High";
	status: "Under Review" | "Resolved" | "Escalated";
}

interface ComplianceMetric {
	title: string;
	value: string;
	icon: React.ReactNode;
	color: string;
}

export default function ComplianceReportPage() {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [riskFilter, setRiskFilter] = useState<"All" | "Low" | "Medium" | "High">("All");

	const kycStats: KYCStatus[] = [
		{ status: "Approved", count: 2187, percentage: 67.3, color: "bg-[var(--cl-up-soft)]0" },
		{ status: "Pending", count: 892, percentage: 27.5, color: "bg-orange-500" },
		{ status: "Rejected", count: 166, percentage: 5.2, color: "bg-[var(--cl-down-soft)]0" },
	];

	const metrics: ComplianceMetric[] = [
		{
			title: "Total KYC Submissions",
			value: "3,245",
			icon: <FileText className="w-6 h-6" />,
			color: "bg-[var(--cl-info-soft)] text-[var(--cl-brand-600)]",
		},
		{
			title: "Compliance Rate",
			value: "94.8%",
			icon: <CheckCircle className="w-6 h-6" />,
			color: "bg-[var(--cl-up-soft)] text-[var(--cl-up)]",
		},
		{
			title: "Flagged Accounts",
			value: "47",
			icon: <Flag className="w-6 h-6" />,
			color: "bg-[var(--cl-down-soft)] text-[var(--cl-down)]",
		},
		{
			title: "Pending Reviews",
			value: "892",
			icon: <Clock className="w-6 h-6" />,
			color: "bg-orange-50 text-orange-600",
		},
	];

	const flaggedAccounts: FlaggedAccount[] = [
		{
			userId: "USR-145",
			name: "John Smith",
			email: "john.smith@example.com",
			reason: "Multiple failed verification attempts",
			flaggedDate: "Jan 28, 2025",
			riskLevel: "High",
			status: "Under Review",
		},
		{
			userId: "USR-267",
			name: "Maria Garcia",
			email: "maria.g@example.com",
			reason: "Suspicious transaction pattern",
			flaggedDate: "Jan 27, 2025",
			riskLevel: "Medium",
			status: "Escalated",
		},
		{
			userId: "USR-389",
			name: "Ahmed Hassan",
			email: "ahmed.h@example.com",
			reason: "Document authenticity concerns",
			flaggedDate: "Jan 26, 2025",
			riskLevel: "High",
			status: "Under Review",
		},
		{
			userId: "USR-412",
			name: "Sarah Johnson",
			email: "sarah.j@example.com",
			reason: "Unusual login locations",
			flaggedDate: "Jan 25, 2025",
			riskLevel: "Low",
			status: "Resolved",
		},
		{
			userId: "USR-523",
			name: "David Chen",
			email: "david.c@example.com",
			reason: "High-value transactions review",
			flaggedDate: "Jan 24, 2025",
			riskLevel: "Medium",
			status: "Under Review",
		},
	];

	const filteredAccounts = flaggedAccounts.filter((account) => {
		const matchesSearch =
			account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			account.userId.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesRisk = riskFilter === "All" || account.riskLevel === riskFilter;
		return matchesSearch && matchesRisk;
	});

	const handleExport = () => {
		const csvContent = [
			["KYC Status Summary"],
			["Status", "Count", "Percentage"],
			...kycStats.map(s => [s.status, s.count.toString(), `${s.percentage}%`]),
			[],
			["Flagged Accounts"],
			["User ID", "Name", "Email", "Reason", "Risk Level", "Status", "Flagged Date"],
			...filteredAccounts.map(a => [
				a.userId,
				a.name,
				a.email,
				a.reason,
				a.riskLevel,
				a.status,
				a.flaggedDate
			])
		].map(row => row.join(",")).join("\n");

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `compliance-report-${new Date().toISOString().split('T')[0]}.csv`;
		a.click();
		window.URL.revokeObjectURL(url);
	};

	const getRiskColor = (risk: string) => {
		switch (risk) {
			case "High":
				return "bg-[var(--cl-down-soft)] text-[var(--cl-down)] border-[var(--cl-down)]";
			case "Medium":
				return "bg-orange-50 text-orange-700 border-orange-200";
			case "Low":
				return "bg-[var(--cl-warn-soft)] text-[var(--cl-warn)] border-[var(--cl-warn)]";
			default:
				return "bg-[var(--cl-bg)] text-[var(--cl-text-2)] border-[var(--cl-line)]";
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Under Review":
				return "bg-[var(--cl-info-soft)] text-[var(--cl-brand-700)] border-[var(--cl-brand-200)]";
			case "Resolved":
				return "bg-[var(--cl-up-soft)] text-[var(--cl-up)] border-[var(--cl-up)]";
			case "Escalated":
				return "bg-[var(--cl-down-soft)] text-[var(--cl-down)] border-[var(--cl-down)]";
			default:
				return "bg-[var(--cl-bg)] text-[var(--cl-text-2)] border-[var(--cl-line)]";
		}
	};

	return (
		<div className="space-y-6">
			{/* Breadcrumb */}
			<nav className="flex items-center gap-2 text-sm text-[var(--cl-text-3)]">
				<button onClick={() => router.push("/admin")} className="hover:text-[var(--cl-text)]">
					Dashboard
				</button>
				<ChevronRight className="w-4 h-4" />
				<button onClick={() => router.push("/admin/reports")} className="hover:text-[var(--cl-text)]">
					Reports
				</button>
				<ChevronRight className="w-4 h-4" />
				<span className="font-medium text-[var(--cl-text)]">Compliance Report</span>
			</nav>

			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button
						onClick={() => router.push("/admin/reports")}
						className="p-2 hover:bg-[var(--cl-bg)] rounded-lg transition-colors"
					>
						<ArrowLeft className="w-5 h-5 text-[var(--cl-text-2)]" />
					</button>
					<div>
						<h1 className="text-2xl font-bold text-[var(--cl-text)]">Compliance Report</h1>
						<p className="text-sm text-[var(--cl-text-2)] mt-1">
							KYC status, flagged accounts, and regulatory compliance data
						</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<button
						onClick={handleExport}
						className="flex items-center gap-2 px-4 py-2 bg-[#014F01] text-white rounded-lg hover:bg-[#013d01] transition-colors shadow-sm"
					>
						<Download className="w-4 h-4" />
						Export CSV
					</button>
				</div>
			</div>

			{/* Period Selector */}
			<div className="bg-[var(--cl-surface)] rounded-lg border border-[var(--cl-line)] p-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Calendar className="w-5 h-5 text-[var(--cl-text-3)]" />
						<span className="text-sm font-medium text-[var(--cl-text-2)]">Report Period:</span>
					</div>
					<div className="flex gap-2">
						{["Today", "Week", "Month", "Quarter", "Year"].map((period) => (
							<button
								key={period}
								className="px-4 py-2 text-sm font-medium bg-[var(--cl-surface-2)] text-[var(--cl-text-2)] hover:bg-[var(--cl-surface-2)] rounded-lg transition-colors"
							>
								{period}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Key Metrics */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				{metrics.map((metric, index) => (
					<div key={index} className="bg-[var(--cl-surface)] rounded-lg border border-[var(--cl-line)] p-6">
						<div className="flex items-center justify-between mb-4">
							<div className={`p-3 rounded-lg ${metric.color}`}>
								{metric.icon}
							</div>
						</div>
						<h3 className="text-sm text-[var(--cl-text-2)] font-medium mb-1">{metric.title}</h3>
						<p className="text-2xl font-bold text-[var(--cl-text)]">{metric.value}</p>
					</div>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* KYC Status Breakdown */}
				<div className="lg:col-span-2 bg-[var(--cl-surface)] rounded-lg border border-[var(--cl-line)] p-6">
					<h2 className="text-lg font-semibold text-[var(--cl-text)] mb-6 flex items-center gap-2">
						<Shield className="w-5 h-5 text-[var(--cl-text-2)]" />
						KYC Status Distribution
					</h2>

					<div className="space-y-4">
						{kycStats.map((stat, index) => (
							<div key={index}>
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										<div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
										<span className="text-sm font-medium text-[var(--cl-text-2)]">{stat.status}</span>
									</div>
									<div className="flex items-center gap-3">
										<span className="text-sm text-[var(--cl-text-2)]">{stat.count.toLocaleString()}</span>
										<span className="text-sm font-semibold text-[var(--cl-text)] min-w-[50px] text-right">
											{stat.percentage}%
										</span>
									</div>
								</div>
								<div className="w-full bg-[var(--cl-surface-2)] rounded-full h-3">
									<div
										className={`${stat.color} h-full rounded-full transition-all duration-500`}
										style={{ width: `${stat.percentage}%` }}
									></div>
								</div>
							</div>
						))}
					</div>

					<div className="mt-6 pt-6 border-t border-[var(--cl-line)] grid grid-cols-3 gap-4">
						<div className="text-center">
							<div className="flex items-center justify-center gap-2 mb-2">
								<CheckCircle className="w-5 h-5 text-[var(--cl-up)]" />
								<span className="text-sm font-medium text-[var(--cl-text-2)]">Approved</span>
							</div>
							<p className="text-2xl font-bold text-[var(--cl-text)]">{kycStats[0].count.toLocaleString()}</p>
						</div>
						<div className="text-center border-x border-[var(--cl-line)]">
							<div className="flex items-center justify-center gap-2 mb-2">
								<Clock className="w-5 h-5 text-orange-600" />
								<span className="text-sm font-medium text-[var(--cl-text-2)]">Pending</span>
							</div>
							<p className="text-2xl font-bold text-[var(--cl-text)]">{kycStats[1].count.toLocaleString()}</p>
						</div>
						<div className="text-center">
							<div className="flex items-center justify-center gap-2 mb-2">
								<XCircle className="w-5 h-5 text-[var(--cl-down)]" />
								<span className="text-sm font-medium text-[var(--cl-text-2)]">Rejected</span>
							</div>
							<p className="text-2xl font-bold text-[var(--cl-text)]">{kycStats[2].count.toLocaleString()}</p>
						</div>
					</div>
				</div>

				{/* Compliance Overview */}
				<div className="bg-[var(--cl-surface)] rounded-lg border border-[var(--cl-line)] p-6">
					<h2 className="text-lg font-semibold text-[var(--cl-text)] mb-6">Compliance Overview</h2>

					<div className="space-y-4">
						<div className="p-4 bg-[var(--cl-up-soft)] border border-[var(--cl-up)] rounded-lg">
							<div className="flex items-center gap-2 mb-2">
								<CheckCircle className="w-5 h-5 text-[var(--cl-up)]" />
								<span className="text-sm font-semibold text-[var(--cl-up)]">Compliant</span>
							</div>
							<p className="text-2xl font-bold text-[var(--cl-up)]">94.8%</p>
							<p className="text-xs text-[var(--cl-up)] mt-1">3,079 users</p>
						</div>

						<div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
							<div className="flex items-center gap-2 mb-2">
								<Clock className="w-5 h-5 text-orange-600" />
								<span className="text-sm font-semibold text-orange-900">Pending Review</span>
							</div>
							<p className="text-2xl font-bold text-orange-900">27.5%</p>
							<p className="text-xs text-orange-700 mt-1">892 submissions</p>
						</div>

						<div className="p-4 bg-[var(--cl-down-soft)] border border-[var(--cl-down)] rounded-lg">
							<div className="flex items-center gap-2 mb-2">
								<AlertTriangle className="w-5 h-5 text-[var(--cl-down)]" />
								<span className="text-sm font-semibold text-[var(--cl-down)]">Flagged</span>
							</div>
							<p className="text-2xl font-bold text-[var(--cl-down)]">47</p>
							<p className="text-xs text-[var(--cl-down)] mt-1">Requires attention</p>
						</div>
					</div>
				</div>
			</div>

			{/* Flagged Accounts */}
			<div className="bg-[var(--cl-surface)] rounded-lg border border-[var(--cl-line)] p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-lg font-semibold text-[var(--cl-text)] flex items-center gap-2">
						<Flag className="w-5 h-5 text-[var(--cl-down)]" />
						Flagged Accounts
					</h2>
					<div className="flex items-center gap-3">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--cl-text-3)]" />
							<input
								type="text"
								placeholder="Search..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9 pr-4 py-2 border border-[var(--cl-line)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent"
							/>
						</div>
						<select
							value={riskFilter}
							onChange={(e) => setRiskFilter(e.target.value as any)}
							className="px-4 py-2 border border-[var(--cl-line)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent"
						>
							<option value="All">All Risk Levels</option>
							<option value="High">High</option>
							<option value="Medium">Medium</option>
							<option value="Low">Low</option>
						</select>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-[var(--cl-bg)] border-b border-[var(--cl-line)]">
							<tr>
								<th className="text-left py-4 px-6 text-xs font-semibold text-[var(--cl-text-2)] uppercase">
									User
								</th>
								<th className="text-left py-4 px-6 text-xs font-semibold text-[var(--cl-text-2)] uppercase">
									Reason
								</th>
								<th className="text-left py-4 px-6 text-xs font-semibold text-[var(--cl-text-2)] uppercase">
									Risk Level
								</th>
								<th className="text-left py-4 px-6 text-xs font-semibold text-[var(--cl-text-2)] uppercase">
									Status
								</th>
								<th className="text-left py-4 px-6 text-xs font-semibold text-[var(--cl-text-2)] uppercase">
									Flagged Date
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-[#E9EAEB]">
							{filteredAccounts.map((account) => (
								<tr
									key={account.userId}
									className="hover:bg-[var(--cl-bg)] transition-colors cursor-pointer"
									onClick={() => router.push(`/admin/users/${account.userId}`)}
								>
									<td className="py-4 px-6">
										<div>
											<p className="text-sm font-medium text-[var(--cl-text)]">{account.name}</p>
											<p className="text-xs text-[var(--cl-text-3)]">{account.email}</p>
										</div>
									</td>
									<td className="py-4 px-6">
										<span className="text-sm text-[var(--cl-text-2)]">{account.reason}</span>
									</td>
									<td className="py-4 px-6">
										<span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getRiskColor(account.riskLevel)}`}>
											{account.riskLevel}
										</span>
									</td>
									<td className="py-4 px-6">
										<span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(account.status)}`}>
											{account.status}
										</span>
									</td>
									<td className="py-4 px-6">
										<span className="text-sm text-[var(--cl-text-2)]">{account.flaggedDate}</span>
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
