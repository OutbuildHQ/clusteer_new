"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Calendar,
	Download,
	TrendingUp,
	TrendingDown,
	DollarSign,
	Users,
	Activity,
	CreditCard,
	ArrowUpRight,
	ArrowDownRight,
	Filter,
	FileText,
	BarChart3,
	PieChart,
	Clock,
	CheckCircle,
	XCircle,
	AlertCircle,
} from "lucide-react";
import { useToast } from "@/components/admin/Toast";
import LoadingSpinner from "@/components/admin/LoadingSpinner";

type ReportPeriod = "today" | "week" | "month" | "year" | "custom";

interface MetricCard {
	title: string;
	value: string;
	change: number;
	trend: "up" | "down";
	icon: React.ReactNode;
	color: string;
}

interface TransactionData {
	date: string;
	volume: number;
	count: number;
}

interface TopUser {
	name: string;
	email: string;
	volume: string;
	transactions: number;
}

export default function ReportsPage() {
	const router = useRouter();
	const toast = useToast();
	const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>("month");
	const [showFilters, setShowFilters] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Mock data
	const metrics: MetricCard[] = [
		{
			title: "Total Transaction Volume",
			value: "$2,450,000",
			change: 12.5,
			trend: "up",
			icon: <DollarSign className="w-6 h-6" />,
			color: "bg-green-50 text-green-600",
		},
		{
			title: "Total Transactions",
			value: "8,542",
			change: 8.3,
			trend: "up",
			icon: <Activity className="w-6 h-6" />,
			color: "bg-blue-50 text-blue-600",
		},
		{
			title: "Active Users",
			value: "3,245",
			change: -2.1,
			trend: "down",
			icon: <Users className="w-6 h-6" />,
			color: "bg-purple-50 text-purple-600",
		},
		{
			title: "Success Rate",
			value: "98.7%",
			change: 1.2,
			trend: "up",
			icon: <CheckCircle className="w-6 h-6" />,
			color: "bg-green-50 text-green-600",
		},
	];

	const transactionData: TransactionData[] = [
		{ date: "Jan 1", volume: 125000, count: 450 },
		{ date: "Jan 8", volume: 145000, count: 520 },
		{ date: "Jan 15", volume: 132000, count: 480 },
		{ date: "Jan 22", volume: 168000, count: 590 },
		{ date: "Jan 29", volume: 195000, count: 680 },
	];

	const topUsers: TopUser[] = [
		{ name: "Jacob Jones", email: "jacob@example.com", volume: "$125,450", transactions: 245 },
		{ name: "Sarah Wilson", email: "sarah@example.com", volume: "$98,320", transactions: 187 },
		{ name: "Mike Chen", email: "mike@example.com", volume: "$87,650", transactions: 156 },
		{ name: "Emma Davis", email: "emma@example.com", volume: "$76,890", transactions: 142 },
		{ name: "Alex Brown", email: "alex@example.com", volume: "$65,430", transactions: 128 },
	];

	const transactionBreakdown = [
		{ type: "Buy USDT", count: 4521, percentage: 52.9, color: "bg-green-500" },
		{ type: "Sell USDT", count: 3124, percentage: 36.6, color: "bg-blue-500" },
		{ type: "Withdrawals", count: 897, percentage: 10.5, color: "bg-orange-500" },
	];

	const handleExport = async (type: string) => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));

			console.log(`Exporting ${type} report for period:`, selectedPeriod);
			toast.success('Export successful', `${type.toUpperCase()} report exported for ${selectedPeriod} period`);
		} catch (error) {
			toast.error('Export failed', 'An error occurred while exporting the report');
		} finally {
			setIsLoading(false);
		}
	};

	const maxVolume = Math.max(...transactionData.map(d => d.volume));

	return (
		<div className="space-y-6">
			{isLoading && <LoadingSpinner overlay />}

			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
					<p className="text-sm text-gray-600 mt-1">
						Track performance and generate insights
					</p>
				</div>
				<div className="flex items-center gap-3">
					<button
						onClick={() => setShowFilters(!showFilters)}
						className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
							showFilters
								? "bg-[#E7F6EC] border-[#014F01] text-[#014F01]"
								: "bg-white border-[#E9EAEB] text-gray-700 hover:bg-[#FAFAFA]"
						}`}
					>
						<Filter className="w-4 h-4" />
						Filters
					</button>
					<button
						onClick={() => handleExport("pdf")}
						className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E9EAEB] text-gray-700 rounded-lg hover:bg-[#FAFAFA] transition-colors"
					>
						<Download className="w-4 h-4" />
						Export PDF
					</button>
					<button
						onClick={() => handleExport("csv")}
						className="flex items-center gap-2 px-4 py-2 bg-[#014F01] text-white rounded-lg hover:bg-[#013d01] transition-colors shadow-sm"
					>
						<Download className="w-4 h-4" />
						Export CSV
					</button>
				</div>
			</div>

			{/* Period Selector */}
			<div className="bg-white rounded-lg border border-[#E9EAEB] p-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Calendar className="w-5 h-5 text-gray-400" />
						<span className="text-sm font-medium text-gray-700">Time Period:</span>
					</div>
					<div className="flex gap-2">
						{(["today", "week", "month", "year", "custom"] as ReportPeriod[]).map((period) => (
							<button
								key={period}
								onClick={() => setSelectedPeriod(period)}
								className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
									selectedPeriod === period
										? "bg-[#014F01] text-white"
										: "bg-gray-100 text-gray-700 hover:bg-gray-200"
								}`}
							>
								{period.charAt(0).toUpperCase() + period.slice(1)}
							</button>
						))}
					</div>
				</div>

				{/* Custom Date Range */}
				{showFilters && (
					<div className="mt-4 pt-4 border-t border-[#E9EAEB]">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Start Date
								</label>
								<input
									type="date"
									className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									End Date
								</label>
								<input
									type="date"
									className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent"
								/>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Key Metrics */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{metrics.map((metric, index) => (
					<div key={index} className="bg-white rounded-lg border border-[#E9EAEB] p-6">
						<div className="flex items-center justify-between mb-4">
							<div className={`p-3 rounded-lg ${metric.color}`}>
								{metric.icon}
							</div>
							<div className={`flex items-center gap-1 text-sm font-medium ${
								metric.trend === "up" ? "text-green-600" : "text-red-600"
							}`}>
								{metric.trend === "up" ? (
									<ArrowUpRight className="w-4 h-4" />
								) : (
									<ArrowDownRight className="w-4 h-4" />
								)}
								{Math.abs(metric.change)}%
							</div>
						</div>
						<h3 className="text-sm text-gray-600 font-medium mb-1">{metric.title}</h3>
						<p className="text-2xl font-bold text-gray-900">{metric.value}</p>
						<p className="text-xs text-gray-500 mt-2">vs. previous period</p>
					</div>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Transaction Volume Chart */}
				<div className="lg:col-span-2 bg-white rounded-lg border border-[#E9EAEB] p-6">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
								<BarChart3 className="w-5 h-5 text-gray-600" />
								Transaction Volume Trend
							</h2>
							<p className="text-sm text-gray-600 mt-1">Daily transaction volume over time</p>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<div className="flex items-center gap-1">
								<div className="w-3 h-3 bg-[#014F01] rounded"></div>
								<span className="text-gray-600">Volume</span>
							</div>
						</div>
					</div>

					{/* Simple Bar Chart */}
					<div className="space-y-4">
						{transactionData.map((data, index) => (
							<div key={index}>
								<div className="flex items-center justify-between mb-1">
									<span className="text-sm font-medium text-gray-700">{data.date}</span>
									<span className="text-sm font-semibold text-gray-900">
										${data.volume.toLocaleString()}
									</span>
								</div>
								<div className="w-full bg-gray-100 rounded-full h-8 relative overflow-hidden">
									<div
										className="bg-[#014F01] h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3"
										style={{ width: `${(data.volume / maxVolume) * 100}%` }}
									>
										<span className="text-xs font-medium text-white">
											{data.count} txns
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Transaction Breakdown */}
				<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
						<PieChart className="w-5 h-5 text-gray-600" />
						Transaction Breakdown
					</h2>

					<div className="space-y-4">
						{transactionBreakdown.map((item, index) => (
							<div key={index}>
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										<div className={`w-3 h-3 rounded-full ${item.color}`}></div>
										<span className="text-sm font-medium text-gray-700">{item.type}</span>
									</div>
									<span className="text-sm font-semibold text-gray-900">
										{item.percentage}%
									</span>
								</div>
								<div className="w-full bg-gray-100 rounded-full h-2">
									<div
										className={`${item.color} h-full rounded-full transition-all duration-500`}
										style={{ width: `${item.percentage}%` }}
									></div>
								</div>
								<p className="text-xs text-gray-500 mt-1">{item.count.toLocaleString()} transactions</p>
							</div>
						))}
					</div>

					<div className="mt-6 pt-6 border-t border-[#E9EAEB]">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-gray-700">Total</span>
							<span className="text-lg font-bold text-gray-900">
								{transactionBreakdown.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Top Users by Volume */}
			<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-lg font-semibold text-gray-900">Top Users by Volume</h2>
					<button className="text-sm text-[#014F01] hover:text-[#013d01] font-medium">
						View All →
					</button>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-[#E9EAEB]">
								<th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
									Rank
								</th>
								<th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
									User
								</th>
								<th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
									Email
								</th>
								<th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
									Total Volume
								</th>
								<th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
									Transactions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-[#E9EAEB]">
							{topUsers.map((user, index) => (
								<tr key={index} className="hover:bg-[#FAFAFA] transition-colors">
									<td className="py-4 px-4">
										<div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
											index === 0 ? "bg-yellow-100 text-yellow-700" :
											index === 1 ? "bg-gray-100 text-gray-700" :
											index === 2 ? "bg-orange-100 text-orange-700" :
											"bg-gray-50 text-gray-600"
										}`}>
											{index + 1}
										</div>
									</td>
									<td className="py-4 px-4">
										<span className="text-sm font-medium text-gray-900">{user.name}</span>
									</td>
									<td className="py-4 px-4">
										<span className="text-sm text-gray-600">{user.email}</span>
									</td>
									<td className="py-4 px-4">
										<span className="text-sm font-semibold text-gray-900">{user.volume}</span>
									</td>
									<td className="py-4 px-4">
										<span className="text-sm text-gray-600">{user.transactions}</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Quick Reports */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<button
					onClick={() => router.push("/admin/reports/user-activity")}
					className="bg-white border border-[#E9EAEB] rounded-lg p-6 hover:border-[#014F01] hover:shadow-md transition-all text-left group"
				>
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
							<Users className="w-6 h-6 text-blue-600" />
						</div>
						<ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-[#014F01] transition-colors" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-1">User Activity Report</h3>
					<p className="text-sm text-gray-600">
						Detailed breakdown of user engagement and activity patterns
					</p>
				</button>

				<button
					onClick={() => router.push("/admin/reports/financial-summary")}
					className="bg-white border border-[#E9EAEB] rounded-lg p-6 hover:border-[#014F01] hover:shadow-md transition-all text-left group"
				>
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
							<DollarSign className="w-6 h-6 text-green-600" />
						</div>
						<ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-[#014F01] transition-colors" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-1">Financial Summary</h3>
					<p className="text-sm text-gray-600">
						Complete overview of revenue, fees, and financial metrics
					</p>
				</button>

				<button
					onClick={() => router.push("/admin/reports/compliance")}
					className="bg-white border border-[#E9EAEB] rounded-lg p-6 hover:border-[#014F01] hover:shadow-md transition-all text-left group"
				>
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
							<FileText className="w-6 h-6 text-purple-600" />
						</div>
						<ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-[#014F01] transition-colors" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-1">Compliance Report</h3>
					<p className="text-sm text-gray-600">
						KYC status, flagged accounts, and regulatory compliance data
					</p>
				</button>
			</div>
		</div>
	);
}
