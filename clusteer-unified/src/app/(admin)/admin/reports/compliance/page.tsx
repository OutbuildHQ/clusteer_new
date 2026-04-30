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
		{ status: "Approved", count: 2187, percentage: 67.3, color: "bg-success/100" },
		{ status: "Pending", count: 892, percentage: 27.5, color: "bg-orange-500" },
		{ status: "Rejected", count: 166, percentage: 5.2, color: "bg-danger/100" },
	];

	const metrics: ComplianceMetric[] = [
		{
			title: "Total KYC Submissions",
			value: "3,245",
			icon: <FileText className="w-6 h-6" />,
			color: "bg-primary/10 text-primary",
		},
		{
			title: "Compliance Rate",
			value: "94.8%",
			icon: <CheckCircle className="w-6 h-6" />,
			color: "bg-success/10 text-success",
		},
		{
			title: "Flagged Accounts",
			value: "47",
			icon: <Flag className="w-6 h-6" />,
			color: "bg-danger/10 text-danger",
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
				return "bg-danger/10 text-danger border-danger";
			case "Medium":
				return "bg-orange-50 text-orange-700 border-orange-200";
			case "Low":
				return "bg-warning/10 text-warning border-warning";
			default:
				return "bg-background text-muted-foreground border-border";
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Under Review":
				return "bg-primary/10 text-primary border-primary/30";
			case "Resolved":
				return "bg-success/10 text-success border-success";
			case "Escalated":
				return "bg-danger/10 text-danger border-danger";
			default:
				return "bg-background text-muted-foreground border-border";
		}
	};

	return (
		<div className="space-y-6">
			{/* Breadcrumb */}
			<nav className="flex items-center gap-2 text-sm text-muted-foreground">
				<button onClick={() => router.push("/admin")} className="hover:text-foreground">
					Dashboard
				</button>
				<ChevronRight className="w-4 h-4" />
				<button onClick={() => router.push("/admin/reports")} className="hover:text-foreground">
					Reports
				</button>
				<ChevronRight className="w-4 h-4" />
				<span className="font-medium text-foreground">Compliance Report</span>
			</nav>

			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button
						onClick={() => router.push("/admin/reports")}
						className="p-2 hover:bg-background rounded-lg transition-colors"
					>
						<ArrowLeft className="w-5 h-5 text-muted-foreground" />
					</button>
					<div>
						<h1 className="text-2xl font-bold text-foreground">Compliance Report</h1>
						<p className="text-sm text-muted-foreground mt-1">
							KYC status, flagged accounts, and regulatory compliance data
						</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<button
						onClick={handleExport}
						className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
					>
						<Download className="w-4 h-4" />
						Export CSV
					</button>
				</div>
			</div>

			{/* Period Selector */}
			<div className="bg-card rounded-lg border border-border p-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Calendar className="w-5 h-5 text-muted-foreground" />
						<span className="text-sm font-medium text-muted-foreground">Report Period:</span>
					</div>
					<div className="flex gap-2">
						{["Today", "Week", "Month", "Quarter", "Year"].map((period) => (
							<button
								key={period}
								className="px-4 py-2 text-sm font-medium bg-muted text-muted-foreground hover:bg-muted rounded-lg transition-colors"
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
					<div key={index} className="bg-card rounded-lg border border-border p-6">
						<div className="flex items-center justify-between mb-4">
							<div className={`p-3 rounded-lg ${metric.color}`}>
								{metric.icon}
							</div>
						</div>
						<h3 className="text-sm text-muted-foreground font-medium mb-1">{metric.title}</h3>
						<p className="text-2xl font-bold text-foreground">{metric.value}</p>
					</div>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* KYC Status Breakdown */}
				<div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
					<h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
						<Shield className="w-5 h-5 text-muted-foreground" />
						KYC Status Distribution
					</h2>

					<div className="space-y-4">
						{kycStats.map((stat, index) => (
							<div key={index}>
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										<div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
										<span className="text-sm font-medium text-muted-foreground">{stat.status}</span>
									</div>
									<div className="flex items-center gap-3">
										<span className="text-sm text-muted-foreground">{stat.count.toLocaleString()}</span>
										<span className="text-sm font-semibold text-foreground min-w-[50px] text-right">
											{stat.percentage}%
										</span>
									</div>
								</div>
								<div className="w-full bg-muted rounded-full h-3">
									<div
										className={`${stat.color} h-full rounded-full transition-all duration-500`}
										style={{ width: `${stat.percentage}%` }}
									></div>
								</div>
							</div>
						))}
					</div>

					<div className="mt-6 pt-6 border-t border-border grid grid-cols-3 gap-4">
						<div className="text-center">
							<div className="flex items-center justify-center gap-2 mb-2">
								<CheckCircle className="w-5 h-5 text-success" />
								<span className="text-sm font-medium text-muted-foreground">Approved</span>
							</div>
							<p className="text-2xl font-bold text-foreground">{kycStats[0].count.toLocaleString()}</p>
						</div>
						<div className="text-center border-x border-border">
							<div className="flex items-center justify-center gap-2 mb-2">
								<Clock className="w-5 h-5 text-orange-600" />
								<span className="text-sm font-medium text-muted-foreground">Pending</span>
							</div>
							<p className="text-2xl font-bold text-foreground">{kycStats[1].count.toLocaleString()}</p>
						</div>
						<div className="text-center">
							<div className="flex items-center justify-center gap-2 mb-2">
								<XCircle className="w-5 h-5 text-danger" />
								<span className="text-sm font-medium text-muted-foreground">Rejected</span>
							</div>
							<p className="text-2xl font-bold text-foreground">{kycStats[2].count.toLocaleString()}</p>
						</div>
					</div>
				</div>

				{/* Compliance Overview */}
				<div className="bg-card rounded-lg border border-border p-6">
					<h2 className="text-lg font-semibold text-foreground mb-6">Compliance Overview</h2>

					<div className="space-y-4">
						<div className="p-4 bg-success/10 border border-success rounded-lg">
							<div className="flex items-center gap-2 mb-2">
								<CheckCircle className="w-5 h-5 text-success" />
								<span className="text-sm font-semibold text-success">Compliant</span>
							</div>
							<p className="text-2xl font-bold text-success">94.8%</p>
							<p className="text-xs text-success mt-1">3,079 users</p>
						</div>

						<div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
							<div className="flex items-center gap-2 mb-2">
								<Clock className="w-5 h-5 text-orange-600" />
								<span className="text-sm font-semibold text-orange-900">Pending Review</span>
							</div>
							<p className="text-2xl font-bold text-orange-900">27.5%</p>
							<p className="text-xs text-orange-700 mt-1">892 submissions</p>
						</div>

						<div className="p-4 bg-danger/10 border border-danger rounded-lg">
							<div className="flex items-center gap-2 mb-2">
								<AlertTriangle className="w-5 h-5 text-danger" />
								<span className="text-sm font-semibold text-danger">Flagged</span>
							</div>
							<p className="text-2xl font-bold text-danger">47</p>
							<p className="text-xs text-danger mt-1">Requires attention</p>
						</div>
					</div>
				</div>
			</div>

			{/* Flagged Accounts */}
			<div className="bg-card rounded-lg border border-border p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
						<Flag className="w-5 h-5 text-danger" />
						Flagged Accounts
					</h2>
					<div className="flex items-center gap-3">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<input
								type="text"
								placeholder="Search..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
							/>
						</div>
						<select
							value={riskFilter}
							onChange={(e) => setRiskFilter(e.target.value as any)}
							className="px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
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
						<thead className="bg-background border-b border-border">
							<tr>
								<th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase">
									User
								</th>
								<th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase">
									Reason
								</th>
								<th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase">
									Risk Level
								</th>
								<th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase">
									Status
								</th>
								<th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase">
									Flagged Date
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{filteredAccounts.map((account) => (
								<tr
									key={account.userId}
									className="hover:bg-background transition-colors cursor-pointer"
									onClick={() => router.push(`/admin/users/${account.userId}`)}
								>
									<td className="py-4 px-6">
										<div>
											<p className="text-sm font-medium text-foreground">{account.name}</p>
											<p className="text-xs text-muted-foreground">{account.email}</p>
										</div>
									</td>
									<td className="py-4 px-6">
										<span className="text-sm text-muted-foreground">{account.reason}</span>
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
										<span className="text-sm text-muted-foreground">{account.flaggedDate}</span>
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
