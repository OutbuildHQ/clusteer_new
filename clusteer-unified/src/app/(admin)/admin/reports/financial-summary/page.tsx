"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Calendar,
	Download,
	DollarSign,
	TrendingUp,
	TrendingDown,
	ArrowUpRight,
	ArrowDownRight,
	Activity,
	CreditCard,
	Wallet,
	ChevronRight,
	Percent,
} from "lucide-react";

interface FinancialMetric {
	title: string;
	value: string;
	change: number;
	trend: "up" | "down";
	icon: React.ReactNode;
	color: string;
}

interface RevenueBreakdown {
	category: string;
	amount: number;
	percentage: number;
	color: string;
}

interface DailyRevenue {
	date: string;
	revenue: number;
	transactions: number;
	fees: number;
}

export default function FinancialSummaryReportPage() {
	const router = useRouter();

	const metrics: FinancialMetric[] = [
		{
			title: "Total Revenue",
			value: "$245,890",
			change: 15.3,
			trend: "up",
			icon: <DollarSign className="w-6 h-6" />,
			color: "bg-success/10 text-success",
		},
		{
			title: "Transaction Fees",
			value: "$45,230",
			change: 12.1,
			trend: "up",
			icon: <Percent className="w-6 h-6" />,
			color: "bg-primary/10 text-primary",
		},
		{
			title: "Processing Volume",
			value: "$2,450,000",
			change: 8.5,
			trend: "up",
			icon: <Activity className="w-6 h-6" />,
			color: "bg-purple-50 text-purple-600",
		},
		{
			title: "Net Profit",
			value: "$198,450",
			change: -2.3,
			trend: "down",
			icon: <TrendingUp className="w-6 h-6" />,
			color: "bg-orange-50 text-orange-600",
		},
	];

	const revenueBreakdown: RevenueBreakdown[] = [
		{ category: "Buy Transaction Fees", amount: 25430, percentage: 56.3, color: "bg-success/100" },
		{ category: "Sell Transaction Fees", amount: 15680, percentage: 34.7, color: "bg-primary/100" },
		{ category: "Withdrawal Fees", amount: 4120, percentage: 9.0, color: "bg-purple-500" },
	];

	const dailyRevenue: DailyRevenue[] = [
		{ date: "Jan 1", revenue: 12540, transactions: 234, fees: 2250 },
		{ date: "Jan 8", revenue: 15680, transactions: 289, fees: 2890 },
		{ date: "Jan 15", revenue: 13920, transactions: 256, fees: 2560 },
		{ date: "Jan 22", revenue: 18450, transactions: 312, fees: 3400 },
		{ date: "Jan 29", revenue: 21230, transactions: 389, fees: 4100 },
	];

	const maxRevenue = Math.max(...dailyRevenue.map(d => d.revenue));

	const handleExport = () => {
		const csvContent = [
			["Metric", "Value", "Change (%)", "Trend"],
			...metrics.map(m => [m.title, m.value, m.change.toString(), m.trend]),
			[],
			["Revenue Breakdown"],
			["Category", "Amount", "Percentage"],
			...revenueBreakdown.map(r => [r.category, `$${r.amount.toLocaleString()}`, `${r.percentage}%`]),
			[],
			["Daily Revenue"],
			["Date", "Revenue", "Transactions", "Fees"],
			...dailyRevenue.map(d => [d.date, `$${d.revenue.toLocaleString()}`, d.transactions.toString(), `$${d.fees.toLocaleString()}`])
		].map(row => row.join(",")).join("\n");

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `financial-summary-${new Date().toISOString().split('T')[0]}.csv`;
		a.click();
		window.URL.revokeObjectURL(url);
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
				<span className="font-medium text-foreground">Financial Summary</span>
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
						<h1 className="text-2xl font-bold text-foreground">Financial Summary Report</h1>
						<p className="text-sm text-muted-foreground mt-1">
							Complete overview of revenue, fees, and financial metrics
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
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{metrics.map((metric, index) => (
					<div key={index} className="bg-card rounded-lg border border-border p-6">
						<div className="flex items-center justify-between mb-4">
							<div className={`p-3 rounded-lg ${metric.color}`}>
								{metric.icon}
							</div>
							<div className={`flex items-center gap-1 text-sm font-medium ${
								metric.trend === "up" ? "text-success" : "text-danger"
							}`}>
								{metric.trend === "up" ? (
									<ArrowUpRight className="w-4 h-4" />
								) : (
									<ArrowDownRight className="w-4 h-4" />
								)}
								{Math.abs(metric.change)}%
							</div>
						</div>
						<h3 className="text-sm text-muted-foreground font-medium mb-1">{metric.title}</h3>
						<p className="text-2xl font-bold text-foreground">{metric.value}</p>
						<p className="text-xs text-muted-foreground mt-2">vs. previous period</p>
					</div>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Daily Revenue Chart */}
				<div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
					<h2 className="text-lg font-semibold text-foreground mb-6">Daily Revenue Trend</h2>

					<div className="space-y-4">
						{dailyRevenue.map((data, index) => (
							<div key={index}>
								<div className="flex items-center justify-between mb-2">
									<span className="text-sm font-medium text-muted-foreground">{data.date}</span>
									<div className="flex items-center gap-4">
										<span className="text-xs text-muted-foreground">{data.transactions} txns</span>
										<span className="text-sm font-semibold text-foreground">
											${data.revenue.toLocaleString()}
										</span>
									</div>
								</div>
								<div className="w-full bg-muted rounded-full h-10 relative overflow-hidden">
									<div
										className="bg-primary h-full rounded-full transition-all duration-500 flex items-center justify-between px-4"
										style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
									>
										<span className="text-xs font-medium text-white">
											Revenue
										</span>
										<span className="text-xs font-medium text-white">
											Fees: ${data.fees.toLocaleString()}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="mt-6 pt-6 border-t border-border">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
							<span className="text-xl font-bold text-foreground">
								${dailyRevenue.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}
							</span>
						</div>
					</div>
				</div>

				{/* Revenue Breakdown */}
				<div className="bg-card rounded-lg border border-border p-6">
					<h2 className="text-lg font-semibold text-foreground mb-6">Revenue Breakdown</h2>

					<div className="space-y-4">
						{revenueBreakdown.map((item, index) => (
							<div key={index}>
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										<div className={`w-3 h-3 rounded-full ${item.color}`}></div>
										<span className="text-sm font-medium text-muted-foreground">{item.category}</span>
									</div>
									<span className="text-sm font-semibold text-foreground">
										{item.percentage}%
									</span>
								</div>
								<div className="w-full bg-muted rounded-full h-2">
									<div
										className={`${item.color} h-full rounded-full transition-all duration-500`}
										style={{ width: `${item.percentage}%` }}
									></div>
								</div>
								<div className="flex items-center justify-between mt-1">
									<span className="text-xs text-muted-foreground">${item.amount.toLocaleString()}</span>
								</div>
							</div>
						))}
					</div>

					<div className="mt-6 pt-6 border-t border-border">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-muted-foreground">Total Fees</span>
							<span className="text-lg font-bold text-foreground">
								${revenueBreakdown.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Financial Details Table */}
			<div className="bg-card rounded-lg border border-border p-6">
				<h2 className="text-lg font-semibold text-foreground mb-6">Detailed Breakdown</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Income */}
					<div>
						<h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
							<TrendingUp className="w-4 h-4 text-success" />
							Income
						</h3>
						<div className="space-y-3">
							<div className="flex items-center justify-between py-2 border-b border-border">
								<span className="text-sm text-muted-foreground">Buy Fees</span>
								<span className="text-sm font-semibold text-foreground">$25,430</span>
							</div>
							<div className="flex items-center justify-between py-2 border-b border-border">
								<span className="text-sm text-muted-foreground">Sell Fees</span>
								<span className="text-sm font-semibold text-foreground">$15,680</span>
							</div>
							<div className="flex items-center justify-between py-2 border-b border-border">
								<span className="text-sm text-muted-foreground">Withdrawal Fees</span>
								<span className="text-sm font-semibold text-foreground">$4,120</span>
							</div>
							<div className="flex items-center justify-between py-2 border-b border-border">
								<span className="text-sm text-muted-foreground">Interest Income</span>
								<span className="text-sm font-semibold text-foreground">$660</span>
							</div>
							<div className="flex items-center justify-between py-2 pt-4">
								<span className="text-sm font-semibold text-foreground">Total Income</span>
								<span className="text-lg font-bold text-success">$45,890</span>
							</div>
						</div>
					</div>

					{/* Expenses */}
					<div>
						<h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
							<TrendingDown className="w-4 h-4 text-danger" />
							Expenses
						</h3>
						<div className="space-y-3">
							<div className="flex items-center justify-between py-2 border-b border-border">
								<span className="text-sm text-muted-foreground">Payment Gateway</span>
								<span className="text-sm font-semibold text-foreground">$12,340</span>
							</div>
							<div className="flex items-center justify-between py-2 border-b border-border">
								<span className="text-sm text-muted-foreground">Infrastructure</span>
								<span className="text-sm font-semibold text-foreground">$8,500</span>
							</div>
							<div className="flex items-center justify-between py-2 border-b border-border">
								<span className="text-sm text-muted-foreground">Operations</span>
								<span className="text-sm font-semibold text-foreground">$15,200</span>
							</div>
							<div className="flex items-center justify-between py-2 border-b border-border">
								<span className="text-sm text-muted-foreground">Other Expenses</span>
								<span className="text-sm font-semibold text-foreground">$11,400</span>
							</div>
							<div className="flex items-center justify-between py-2 pt-4">
								<span className="text-sm font-semibold text-foreground">Total Expenses</span>
								<span className="text-lg font-bold text-danger">$47,440</span>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-8 pt-6 border-t-2 border-border">
					<div className="flex items-center justify-between">
						<span className="text-lg font-semibold text-foreground">Net Profit/Loss</span>
						<span className="text-2xl font-bold text-danger">-$1,550</span>
					</div>
					<p className="text-xs text-muted-foreground mt-2">This period</p>
				</div>
			</div>
		</div>
	);
}
