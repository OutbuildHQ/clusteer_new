"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, DollarSign, TrendingUp, ArrowUpDown, RefreshCw, Clock, AlertCircle, CheckCircle, XCircle, Shield, LifeBuoy, Bell, ChevronRight, UserPlus, FileCheck, ArrowRight, X, TrendingDown, Zap } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import TransactionChart from "@/components/admin/TransactionChart";

interface Alert {
	id: number;
	type: "security" | "system" | "transaction";
	message: string;
	time: string;
	severity: "high" | "medium" | "low";
}

// Mini sparkline data
const sparklineData = [65, 72, 68, 80, 85, 78, 90];

export default function AdminDashboardPage() {
	const router = useRouter();
	const [chartPeriod, setChartPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");
	const [lastRefresh, setLastRefresh] = useState(new Date());
	const [isLiveUpdating, setIsLiveUpdating] = useState(true);
	const [expandedCard, setExpandedCard] = useState<string | null>(null);
	const [alerts, setAlerts] = useState<Alert[]>([
		{ id: 1, type: "security", message: "Failed login attempt", time: "2 min ago", severity: "high" },
		{ id: 2, type: "system", message: "Backup completed", time: "1 hour ago", severity: "low" },
		{ id: 3, type: "transaction", message: "High volume detected", time: "3 hours ago", severity: "medium" },
	]);

	// Simulated live updates
	useEffect(() => {
		if (!isLiveUpdating) return;

		const interval = setInterval(() => {
			setLastRefresh(new Date());
		}, 30000); // 30 seconds

		return () => clearInterval(interval);
	}, [isLiveUpdating]);

	const handleRefresh = () => {
		setLastRefresh(new Date());
		console.log("Refreshing dashboard data...");
	};

	const dismissAlert = (id: number) => {
		setAlerts(alerts.filter(alert => alert.id !== id));
	};

	const getAlertIcon = (type: Alert["type"]) => {
		switch (type) {
			case "security": return Shield;
			case "system": return CheckCircle;
			case "transaction": return ArrowUpDown;
		}
	};

	const getAlertColor = (severity: Alert["severity"]) => {
		switch (severity) {
			case "high": return "text-red-600 bg-red-50 border-red-200";
			case "medium": return "text-orange-600 bg-orange-50 border-orange-200";
			case "low": return "text-blue-600 bg-blue-50 border-blue-200";
		}
	};

	// Mini Sparkline Component
	const MiniSparkline = ({ data, color = "#014F01" }: { data: number[], color?: string }) => {
		const max = Math.max(...data);
		const min = Math.min(...data);
		const points = data.map((value, index) => {
			const x = (index / (data.length - 1)) * 100;
			const y = 100 - ((value - min) / (max - min)) * 100;
			return `${x},${y}`;
		}).join(' ');

		return (
			<svg width="60" height="24" className="inline-block ml-2">
				<polyline
					points={points}
					fill="none"
					stroke={color}
					strokeWidth="2"
					vectorEffect="non-scaling-stroke"
				/>
			</svg>
		);
	};

	// Trend indicator component
	const TrendIndicator = ({ value, isPositive }: { value: number, isPositive: boolean }) => (
		<div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
			{isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
			<span>{value}%</span>
		</div>
	);

	return (
		<div className="space-y-6 pb-20">
			{/* Page Header with Live Status */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex-1">
					<div className="flex items-center gap-3 flex-wrap">
						<h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
						{isLiveUpdating && (
							<div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
								<span className="relative flex h-2 w-2">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
									<span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
								</span>
								<span className="text-xs font-medium text-green-700">Live</span>
							</div>
						)}
					</div>
					<p className="text-sm text-gray-600 mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
						<span>Welcome back, Admin! Here's what's happening with Clusteer today.</span>
						<span className="inline-flex items-center gap-1 text-xs text-gray-500">
							<Clock className="w-3 h-3" />
							Updated {lastRefresh.toLocaleTimeString()}
						</span>
					</p>
				</div>
				<div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
					<button
						onClick={() => setIsLiveUpdating(!isLiveUpdating)}
						className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-[#E9EAEB] text-gray-700 rounded-lg hover:bg-[#FAFAFA] transition-colors text-sm"
					>
						<RefreshCw className={`w-4 h-4 ${isLiveUpdating ? 'animate-spin' : ''}`} />
						<span className="hidden sm:inline">{isLiveUpdating ? 'Auto-refresh' : 'Paused'}</span>
					</button>
					<button
						onClick={() => router.push("/admin/users")}
						className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#014F01] text-white rounded-lg hover:bg-[#013d01] transition-colors shadow-sm hover:shadow-md hover:scale-105 active:scale-95 text-sm whitespace-nowrap"
					>
						<UserPlus className="w-4 h-4" style={{ color: 'white', stroke: 'white' }} />
						<span className="hidden sm:inline">Add User</span>
					</button>
				</div>
			</div>

			{/* Enhanced Stats Grid with Sparklines and Trends */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div
					onClick={() => router.push("/admin/users")}
					className="cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
					onMouseEnter={() => setExpandedCard("users")}
					onMouseLeave={() => setExpandedCard(null)}
				>
					<div className="bg-white rounded-lg border-2 border-[#B8E632] p-6 transition-all hover:shadow-lg h-full flex flex-col min-h-[180px]">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-gray-600 font-medium">Total Users</span>
							<TrendIndicator value={2.4} isPositive={true} />
						</div>
						<div className="mb-2 flex items-end gap-2">
							<p className="text-3xl font-bold text-gray-900">10,486</p>
							<MiniSparkline data={sparklineData} />
						</div>
						<p className="text-xs text-gray-500">8,290 verified</p>
						{expandedCard === "users" && (
							<div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">New today</span>
									<span className="font-semibold text-green-600">+42</span>
								</div>
							</div>
						)}
					</div>
				</div>

				<div
					onClick={() => router.push("/admin/wallets")}
					className="cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
					onMouseEnter={() => setExpandedCard("usdt")}
					onMouseLeave={() => setExpandedCard(null)}
				>
					<div className="bg-white rounded-lg border border-[#E9EAEB] p-6 transition-all hover:shadow-lg hover:border-[#014F01]/20 h-full flex flex-col min-h-[180px]">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-gray-600 font-medium">USDT Liquidity</span>
							<TrendIndicator value={6.2} isPositive={true} />
						</div>
						<div className="mb-2 flex items-end gap-2">
							<p className="text-3xl font-bold text-gray-900">$258,000</p>
							<MiniSparkline data={[50, 55, 60, 70, 75, 80, 85]} color="#B8E632" />
						</div>
						{expandedCard === "usdt" && (
							<div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Available</span>
									<span className="font-semibold">$180K</span>
								</div>
							</div>
						)}
					</div>
				</div>

				<div
					onClick={() => router.push("/admin/wallets")}
					className="cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
					onMouseEnter={() => setExpandedCard("naira")}
					onMouseLeave={() => setExpandedCard(null)}
				>
					<div className="bg-white rounded-lg border border-[#E9EAEB] p-6 transition-all hover:shadow-lg hover:border-[#014F01]/20 h-full flex flex-col min-h-[180px]">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-gray-600 font-medium">Naira Float</span>
							<TrendIndicator value={0.8} isPositive={true} />
						</div>
						<div className="mb-2 flex items-end gap-2">
							<p className="text-3xl font-bold text-gray-900">₦15.2M</p>
							<MiniSparkline data={[60, 65, 62, 70, 72, 75, 78]} />
						</div>
						{expandedCard === "naira" && (
							<div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Threshold</span>
									<span className="font-semibold text-green-600">Above min</span>
								</div>
							</div>
						)}
					</div>
				</div>

				<div
					onClick={() => router.push("/admin/transactions")}
					className="cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
					onMouseEnter={() => setExpandedCard("transactions")}
					onMouseLeave={() => setExpandedCard(null)}
				>
					<div className="bg-white rounded-lg border border-[#E9EAEB] p-6 transition-all hover:shadow-lg hover:border-[#014F01]/20 h-full flex flex-col min-h-[180px]">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-gray-600 font-medium">Transactions</span>
							<TrendIndicator value={2.4} isPositive={true} />
						</div>
						<div className="mb-2 flex items-end gap-2">
							<p className="text-3xl font-bold text-gray-900">1,580</p>
							<MiniSparkline data={[40, 50, 45, 60, 65, 70, 75]} />
						</div>
						<p className="text-xs text-gray-500">Last 30 days</p>
						{expandedCard === "transactions" && (
							<div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Today</span>
									<span className="font-semibold">52 txns</span>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Transaction Flow Chart */}
			<div className="bg-white rounded-lg border border-[#E9EAEB] p-6 transition-all duration-200 hover:shadow-md hover:border-[#014F01]/20">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-lg font-semibold text-gray-900">
							Transaction Flow
						</h2>
						<p className="text-sm text-gray-600 mt-1">
							Monthly transaction volume
						</p>
					</div>
					<div className="flex items-center gap-4">
						{/* Time Period Selector */}
						<div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
							{(["7d", "30d", "90d", "1y"] as const).map((period) => (
								<button
									key={period}
									onClick={() => setChartPeriod(period)}
									className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
										chartPeriod === period
											? "bg-white text-gray-900 shadow-sm scale-105"
											: "text-gray-600 hover:text-gray-900"
									}`}
								>
									{period === "7d" ? "7 Days" : period === "30d" ? "30 Days" : period === "90d" ? "90 Days" : "1 Year"}
								</button>
							))}
						</div>
						<div className="text-right">
							<p className="text-2xl font-bold text-gray-900">$1.2M</p>
							<p className="text-sm text-gray-600">Total Volume</p>
						</div>
						<div className="flex items-center gap-1 text-[#014F01]">
							<TrendingUp className="w-4 h-4" />
							<span className="text-sm font-medium">+12.5%</span>
						</div>
					</div>
				</div>

				{/* Transaction Chart */}
				<TransactionChart />
			</div>

			{/* Bottom Cards Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* KYC Status Card */}
				<div className="bg-white rounded-lg border border-[#E9EAEB] p-6 transition-all duration-200 hover:shadow-md hover:border-[#014F01]/20">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-base font-semibold text-gray-900">
							KYC Status
						</h3>
						<button
							onClick={() => router.push("/admin/kyc")}
							className="text-sm text-[#014F01] hover:underline flex items-center gap-1 transition-all hover:gap-2"
						>
							View all
							<ChevronRight className="w-4 h-4" />
						</button>
					</div>
					<div className="space-y-4">
						<div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg transition-all hover:shadow-sm hover:scale-[1.02]">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
									<CheckCircle className="w-5 h-5 text-green-600" />
								</div>
								<div>
									<span className="text-xs text-green-700 font-medium">Approved</span>
									<p className="text-2xl font-bold text-green-900">760</p>
								</div>
							</div>
						</div>
						<div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg transition-all hover:shadow-sm hover:scale-[1.02]">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
									<Clock className="w-5 h-5 text-orange-600" />
								</div>
								<div>
									<span className="text-xs text-orange-700 font-medium">Pending</span>
									<p className="text-2xl font-bold text-orange-900">245</p>
								</div>
							</div>
							<button
								onClick={() => router.push("/admin/kyc?status=pending")}
								className="px-3 py-1.5 bg-orange-600 text-white text-xs font-medium rounded-lg hover:bg-orange-700 transition-all hover:scale-105 active:scale-95"
							>
								Review
							</button>
						</div>
						<div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg transition-all hover:shadow-sm hover:scale-[1.02]">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
									<XCircle className="w-5 h-5 text-red-600" />
								</div>
								<div>
									<span className="text-xs text-red-700 font-medium">Rejected</span>
									<p className="text-2xl font-bold text-red-900">28</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Support Tickets Card */}
				<div className="bg-white rounded-lg border border-[#E9EAEB] p-6 transition-all duration-200 hover:shadow-md hover:border-[#014F01]/20">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-base font-semibold text-gray-900">
							Support Tickets
						</h3>
						<button
							onClick={() => router.push("/admin/support")}
							className="text-sm text-[#014F01] hover:underline flex items-center gap-1 transition-all hover:gap-2"
						>
							View all
							<ChevronRight className="w-4 h-4" />
						</button>
					</div>
					<div className="space-y-4">
						<div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg transition-all hover:shadow-sm hover:scale-[1.02]">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
									<LifeBuoy className="w-5 h-5 text-blue-600" />
								</div>
								<div>
									<span className="text-xs text-blue-700 font-medium">Open Tickets</span>
									<p className="text-2xl font-bold text-blue-900">15</p>
								</div>
							</div>
							<button
								onClick={() => router.push("/admin/support?status=open")}
								className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
							>
								Respond
							</button>
						</div>
						<div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg transition-all hover:shadow-sm hover:scale-[1.02]">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
									<CheckCircle className="w-5 h-5 text-gray-600" />
								</div>
								<div>
									<span className="text-xs text-gray-700 font-medium">Closed Today</span>
									<p className="text-2xl font-bold text-gray-900">10</p>
								</div>
							</div>
						</div>
						<div className="p-3 bg-white border border-gray-200 rounded-lg transition-all hover:shadow-sm">
							<div className="flex items-center justify-between text-xs">
								<span className="text-gray-600">Avg Response Time</span>
								<span className="font-semibold text-gray-900">2.5 hrs</span>
							</div>
						</div>
					</div>
				</div>

				{/* Alerts Panel with Animations */}
				<div className="bg-white rounded-lg border border-[#E9EAEB] p-6 transition-all duration-200 hover:shadow-md hover:border-[#014F01]/20">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-2">
							<h3 className="text-base font-semibold text-gray-900">
								Alerts
							</h3>
							{alerts.length > 0 && (
								<span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full animate-pulse">
									{alerts.length}
								</span>
							)}
						</div>
						<button className="text-sm text-gray-600 hover:text-gray-900">
							Settings
						</button>
					</div>
					<div className="space-y-3">
						{alerts.length === 0 ? (
							<div className="text-center py-8 animate-in fade-in duration-300">
								<div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
									<CheckCircle className="w-6 h-6 text-green-600" />
								</div>
								<p className="text-sm text-gray-600 font-medium">All clear!</p>
								<p className="text-xs text-gray-500 mt-1">No alerts at the moment</p>
							</div>
						) : (
							alerts.map((alert) => {
								const Icon = getAlertIcon(alert.type);
								return (
									<div
										key={alert.id}
										className={`flex items-start justify-between p-3 border rounded-lg ${getAlertColor(alert.severity)} animate-in slide-in-from-right duration-300 transition-all hover:shadow-sm`}
									>
										<div className="flex items-start gap-3 flex-1">
											<div className={`p-1.5 rounded-lg ${
												alert.severity === "high" ? "bg-red-100" :
												alert.severity === "medium" ? "bg-orange-100" :
												"bg-blue-100"
											}`}>
												<Icon className="w-4 h-4" />
											</div>
											<div className="flex-1">
												<p className="text-sm font-medium capitalize">
													{alert.type}: {alert.message}
												</p>
												<p className="text-xs opacity-75 mt-1">{alert.time}</p>
											</div>
										</div>
										<button
											onClick={() => dismissAlert(alert.id)}
											className="p-1 hover:bg-black/5 rounded transition-all hover:scale-110 active:scale-90"
										>
											<X className="w-4 h-4" />
										</button>
									</div>
								);
							})
						)}
					</div>
					{alerts.length > 0 && (
						<button className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
							View all alerts
						</button>
					)}
				</div>
			</div>

			{/* Recent Transactions Preview with Enhanced Interactions */}
			<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
						<p className="text-sm text-gray-600 mt-1">Latest platform activity</p>
					</div>
					<button
						onClick={() => router.push("/admin/transactions")}
						className="flex items-center gap-2 px-4 py-2 text-sm text-[#014F01] hover:bg-[#E7F6EC] rounded-lg transition-all hover:gap-3 hover:scale-105 active:scale-95"
					>
						View all
						<ArrowRight className="w-4 h-4" />
					</button>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-[#E9EAEB]">
								<th className="text-left py-3 px-4 text-sm font-medium text-gray-600">User</th>
								<th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
								<th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
								<th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
								<th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Time</th>
							</tr>
						</thead>
						<tbody>
							{[
								{ user: "John Doe", type: "Buy", amount: 250, status: "Success", time: "2 min ago" },
								{ user: "Jane Smith", type: "Sell", amount: 180, status: "Success", time: "5 min ago" },
								{ user: "Mike Johnson", type: "Buy", amount: 420, status: "Pending", time: "8 min ago" },
								{ user: "Sarah Wilson", type: "Sell", amount: 150, status: "Success", time: "12 min ago" },
								{ user: "Tom Brown", type: "Buy", amount: 300, status: "Failed", time: "15 min ago" },
							].map((tx, i) => (
								<tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-all cursor-pointer group">
									<td className="py-3 px-4 text-sm text-gray-900 group-hover:text-[#014F01] transition-colors">{tx.user}</td>
									<td className="py-3 px-4">
										<span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
											tx.type === "Buy" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
										}`}>
											{tx.type}
										</span>
									</td>
									<td className="py-3 px-4 text-sm font-semibold text-gray-900">${tx.amount}</td>
									<td className="py-3 px-4">
										<span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
											tx.status === "Success" ? "bg-green-50 text-green-700" :
											tx.status === "Pending" ? "bg-orange-50 text-orange-700" :
											"bg-red-50 text-red-700"
										}`}>
											<span className={`w-1.5 h-1.5 rounded-full ${
												tx.status === "Success" ? "bg-green-600" :
												tx.status === "Pending" ? "bg-orange-600" :
												"bg-red-600"
											}`}></span>
											{tx.status}
										</span>
									</td>
									<td className="py-3 px-4 text-sm text-gray-600">{tx.time}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
