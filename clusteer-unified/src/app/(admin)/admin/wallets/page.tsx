"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	Search,
	Settings,
	TrendingUp,
	TrendingDown,
	ChevronDown,
	Download,
	RefreshCw,
	Send,
	Filter,
	X,
	ArrowUpRight,
	ArrowDownLeft,
	Eye,
	Mail,
	Plus,
	Menu,
	Clock,
	CheckCircle2,
	Zap,
	Building2,
	Users,
	ArrowRightLeft,
	Network,
	Sliders,
} from "lucide-react";
import {
	ManualTopupModal,
	ExportTransactionsModal,
	TransferModal,
	ReconcileModal,
} from "@/components/admin/WalletModals";

interface Transaction {
	id: string;
	user: string;
	type: "Deposit" | "Withdrawal" | "Admin Credit";
	amount: number;
	method?: string;
	network?: string;
	date: string;
	status: "Success" | "Failed" | "Pending";
}

const mockNairaTransactions: Transaction[] = [
	{ id: "NAIR001", user: "Jacob Jones", type: "Deposit", amount: 100000, method: "GTBank Transfer", date: "Jan 16, 2025", status: "Success" },
	{ id: "NAIR002", user: "Marting Rios", type: "Withdrawal", amount: 100000, method: "Opay Wallet", date: "Jan 16, 2025", status: "Success" },
	{ id: "NAIR003", user: "Will Copper", type: "Admin Credit", amount: 100000, method: "Manual Top-up", date: "Jan 15, 2025", status: "Success" },
	{ id: "NAIR004", user: "Marco Kelly", type: "Deposit", amount: 100000, method: "GTBank", date: "Jan 14, 2025", status: "Success" },
	{ id: "NAIR004", user: "Alex Morrison", type: "Deposit", amount: 100000, method: "GTBank", date: "Jan 14, 2025", status: "Success" },
	{ id: "NAIR004", user: "Mikey Lawrence", type: "Withdrawal", amount: 100000, method: "GTBank", date: "Jan 14, 2025", status: "Failed" },
	{ id: "NAIR004", user: "Freya Browning", type: "Deposit", amount: 100000, method: "GTBank", date: "Jan 14, 2025", status: "Pending" },
];

const mockUSDTTransactions: Transaction[] = [
	{ id: "TXN1023", user: "Jacob Jones", type: "Deposit", amount: 300, network: "TRC20", date: "Jan 16, 2025", status: "Success" },
	{ id: "TXN1025", user: "Marting Rios", type: "Withdrawal", amount: 100, network: "BEP20", date: "Jan 16, 2025", status: "Success" },
	{ id: "TXN1025", user: "Will Copper", type: "Admin Credit", amount: 12, network: "BEP20", date: "Jan 15, 2025", status: "Success" },
	{ id: "TXN1025", user: "Marco Kelly", type: "Deposit", amount: 210, network: "TRC20", date: "Jan 14, 2025", status: "Success" },
	{ id: "TXN1025", user: "Alex Morrison", type: "Deposit", amount: 10, network: "SOL", date: "Jan 14, 2025", status: "Success" },
	{ id: "TXN1025", user: "Mikey Lawrence", type: "Withdrawal", amount: 151, network: "SOL", date: "Jan 14, 2025", status: "Failed" },
	{ id: "TXN1025", user: "Freya Browning", type: "Deposit", amount: 115, network: "TRC20", date: "Jan 16, 2025", status: "Pending" },
];

// Mini sparkline data
const sparklineData = [65, 72, 68, 80, 85, 78, 90];

export default function WalletsPage() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<"Naira" | "USDT" | "USDC">("Naira");
	const [networkFilter, setNetworkFilter] = useState<"All" | "TRC20" | "BEP20" | "SOL">("All");
	const [transactionActivityEnabled, setTransactionActivityEnabled] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [showFilters, setShowFilters] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [hoveredRow, setHoveredRow] = useState<number | null>(null);
	const [showAdminDrawer, setShowAdminDrawer] = useState(false);
	const [isLiveUpdating, setIsLiveUpdating] = useState(true);
	const [lastUpdate, setLastUpdate] = useState(new Date());
	const [showBulkActions, setShowBulkActions] = useState(false);
	const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
	const [expandedCard, setExpandedCard] = useState<string | null>(null);
	const [showQuickAccessMenu, setShowQuickAccessMenu] = useState(false);
	const [showTopupModal, setShowTopupModal] = useState(false);
	const [showExportModal, setShowExportModal] = useState(false);
	const [showTransferModal, setShowTransferModal] = useState(false);
	const [showReconcileModal, setShowReconcileModal] = useState(false);
	const [showContactModal, setShowContactModal] = useState(false);
	const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

	const totalPages = 10;
	const transactions = activeTab === "Naira" ? mockNairaTransactions : mockUSDTTransactions;

	// Network transaction counts
	const networkCounts = {
		All: mockUSDTTransactions.length,
		TRC20: mockUSDTTransactions.filter(t => t.network === "TRC20").length,
		BEP20: mockUSDTTransactions.filter(t => t.network === "BEP20").length,
		SOL: mockUSDTTransactions.filter(t => t.network === "SOL").length,
	};

	// Simulated live updates
	useEffect(() => {
		if (!isLiveUpdating) return;

		const interval = setInterval(() => {
			setLastUpdate(new Date());
		}, 30000); // 30 seconds

		return () => clearInterval(interval);
	}, [isLiveUpdating]);

	const getStatusColor = (status: Transaction["status"]) => {
		switch (status) {
			case "Success": return "text-green-700 bg-green-50";
			case "Failed": return "text-red-700 bg-red-50";
			case "Pending": return "text-orange-700 bg-orange-50";
		}
	};

	const handleBulkSelect = (index: number) => {
		const newSelected = new Set(selectedRows);
		if (newSelected.has(index)) {
			newSelected.delete(index);
		} else {
			newSelected.add(index);
		}
		setSelectedRows(newSelected);
		setShowBulkActions(newSelected.size > 0);
	};

	const handleSelectAll = () => {
		if (selectedRows.size === transactions.length) {
			setSelectedRows(new Set());
			setShowBulkActions(false);
		} else {
			setSelectedRows(new Set(transactions.map((_, i) => i)));
			setShowBulkActions(true);
		}
	};

	const handleDownloadReceipt = (transaction: Transaction) => {
		// Generate receipt PDF
		console.log("Downloading receipt for:", transaction.id);

		// Create a simple receipt text
		const receiptContent = `
CLUSTEER TRANSACTION RECEIPT
============================

Transaction ID: ${transaction.id}
User: ${transaction.user}
Type: ${transaction.type}
Amount: ${activeTab === "Naira" ? `₦${transaction.amount.toLocaleString()}` : `$${transaction.amount}`}
${transaction.method ? `Method: ${transaction.method}` : ""}
${transaction.network ? `Network: ${transaction.network}` : ""}
Date: ${transaction.date}
Status: ${transaction.status}

============================
Generated by Clusteer Admin Dashboard
		`;

		// Create blob and download
		const blob = new Blob([receiptContent], { type: "text/plain" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `receipt-${transaction.id}.txt`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	};

	const handleContactUser = (transaction: Transaction) => {
		setSelectedTransaction(transaction);
		setShowContactModal(true);
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
			<div className="flex items-center justify-between">
				<div>
					<div className="flex items-center gap-3">
						<h1 className="text-2xl font-bold text-gray-900">Wallets & Liquidity</h1>
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
					<p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
						<Clock className="w-3 h-3" />
						Last updated {lastUpdate.toLocaleTimeString()}
					</p>
				</div>
				<div className="flex items-center gap-3">
					<button
						onClick={() => setIsLiveUpdating(!isLiveUpdating)}
						className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E9EAEB] text-gray-700 rounded-lg hover:bg-[#FAFAFA] transition-colors"
					>
						<RefreshCw className={`w-4 h-4 ${isLiveUpdating ? 'animate-spin' : ''}`} />
						{isLiveUpdating ? 'Auto-refresh' : 'Paused'}
					</button>
					<div className="relative">
						<button
							onClick={() => setShowQuickAccessMenu(!showQuickAccessMenu)}
							className="flex items-center gap-2 px-4 py-2 bg-[#014F01] text-white rounded-lg hover:bg-[#013800] transition-colors"
						>
							<Menu className="w-4 h-4" />
							Quick Access
							<ChevronDown className="w-4 h-4" />
						</button>

						{/* Quick Access Dropdown */}
						{showQuickAccessMenu && (
							<>
								<div
									className="fixed inset-0 z-10"
									onClick={() => setShowQuickAccessMenu(false)}
								/>
								<div className="absolute right-0 mt-2 w-72 bg-white rounded-lg border border-[#E9EAEB] shadow-lg z-20 animate-in fade-in slide-in-from-top-2 duration-200">
									<div className="p-2">
										<div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
											Management
										</div>
										<button
											onClick={() => {
												router.push('/admin/wallets/withdrawals');
												setShowQuickAccessMenu(false);
											}}
											className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left group"
										>
											<ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-[#014F01]" />
											<div>
												<p className="text-sm font-medium text-gray-900">Withdrawals</p>
												<p className="text-xs text-gray-500">Manage pending withdrawals</p>
											</div>
										</button>
										<button
											onClick={() => {
												router.push('/admin/wallets/bank-accounts');
												setShowQuickAccessMenu(false);
											}}
											className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left group"
										>
											<Building2 className="w-5 h-5 text-gray-600 group-hover:text-[#014F01]" />
											<div>
												<p className="text-sm font-medium text-gray-900">Bank Accounts</p>
												<p className="text-xs text-gray-500">Manage connected accounts</p>
											</div>
										</button>
										<button
											onClick={() => {
												router.push('/admin/wallets/networks');
												setShowQuickAccessMenu(false);
											}}
											className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left group"
										>
											<Network className="w-5 h-5 text-gray-600 group-hover:text-[#014F01]" />
											<div>
												<p className="text-sm font-medium text-gray-900">Networks</p>
												<p className="text-xs text-gray-500">Configure blockchain networks</p>
											</div>
										</button>

										<div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2 border-t border-[#E9EAEB]">
											Monitoring
										</div>
										<button
											onClick={() => {
												router.push('/admin/wallets/reconciliation');
												setShowQuickAccessMenu(false);
											}}
											className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left group"
										>
											<RefreshCw className="w-5 h-5 text-gray-600 group-hover:text-[#014F01]" />
											<div>
												<p className="text-sm font-medium text-gray-900">Reconciliation</p>
												<p className="text-xs text-gray-500">Balance verification</p>
											</div>
										</button>
										<button
											onClick={() => {
												router.push('/admin/wallets/settlements');
												setShowQuickAccessMenu(false);
											}}
											className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left group"
										>
											<ArrowRightLeft className="w-5 h-5 text-gray-600 group-hover:text-[#014F01]" />
											<div>
												<p className="text-sm font-medium text-gray-900">Settlements</p>
												<p className="text-xs text-gray-500">Monitor bank settlements</p>
											</div>
										</button>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</div>

			{/* Currency Tabs */}
			<div className="flex items-center gap-2 border-b border-[#E9EAEB]">
				{(["Naira", "USDT", "USDC"] as const).map((tab) => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={`px-4 py-2 text-sm font-semibold relative transition-all ${
							activeTab === tab
								? "text-[#014F01]"
								: "text-gray-600 hover:text-gray-900"
						}`}
					>
						{tab}
						{activeTab === tab && (
							<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#014F01] transition-all" />
						)}
					</button>
				))}
			</div>

			{/* Network Filters with Transaction Counts (USDT/USDC only) */}
			{(activeTab === "USDT" || activeTab === "USDC") && (
				<div className="flex items-center gap-2">
					{(["All", "TRC20", "BEP20", "SOL"] as const).map((network) => (
						<button
							key={network}
							onClick={() => setNetworkFilter(network)}
							className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
								networkFilter === network
									? "bg-gray-900 shadow-md"
									: "bg-white border border-[#E9EAEB] text-gray-700 hover:bg-[#FAFAFA]"
							}`}
						>
							<span style={networkFilter === network ? { color: '#B8E632' } : {}}>{network}</span>
							<span
								className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
									networkFilter === network
										? ""
										: "bg-gray-100 text-gray-700"
								}`}
								style={networkFilter === network ? { backgroundColor: 'rgba(184, 230, 50, 0.2)', color: '#B8E632' } : {}}
							>
								{networkCounts[network]}
							</span>
						</button>
					))}
				</div>
			)}

			{/* Enhanced Cards with Trends and Interactions */}
			{activeTab === "Naira" ? (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Total Float Card */}
					<div
						className="bg-white rounded-lg border-2 border-[#B8E632] p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
						onClick={() => setExpandedCard(expandedCard === "float" ? null : "float")}
					>
						<div className="flex items-center justify-between mb-2">
							<div className="flex items-center gap-2">
								<span className="text-sm text-gray-600 font-medium">Total Float</span>
								<ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedCard === "float" ? 'rotate-180' : ''}`} />
							</div>
							<TrendIndicator value={12.5} isPositive={true} />
						</div>
						<div className="mb-2 flex items-end gap-2">
							<p className="text-3xl font-bold text-gray-900">₦15,200,000</p>
							<MiniSparkline data={sparklineData} />
						</div>
						{expandedCard === "float" && (
							<div className="mt-4 pt-4 border-t border-gray-100 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Yesterday</span>
									<span className="font-semibold">₦13.5M</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Last Week</span>
									<span className="font-semibold">₦14.2M</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Last Month</span>
									<span className="font-semibold">₦12.8M</span>
								</div>
							</div>
						)}
						<div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<Settings className="w-4 h-4" />
								<span>Transaction activity</span>
							</div>
							<button
								onClick={(e) => {
									e.stopPropagation();
									setTransactionActivityEnabled(!transactionActivityEnabled);
								}}
								className={`relative w-11 h-6 rounded-full transition-colors ${
									transactionActivityEnabled ? "bg-[#014F01]" : "bg-gray-300"
								}`}
							>
								<div
									className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
										transactionActivityEnabled ? "translate-x-5" : ""
									}`}
								/>
							</button>
						</div>
					</div>

					{/* Bank Balances Card */}
					<div className="bg-white rounded-lg border border-[#E9EAEB] p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
						<div className="flex items-center justify-between mb-4">
							<span className="text-sm text-gray-600 font-medium">Bank Balances</span>
							<TrendIndicator value={3.2} isPositive={true} />
						</div>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600">GTBank</span>
								<p className="text-xl font-bold text-gray-900">₦6.5M</p>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600">Opay</span>
								<p className="text-xl font-bold text-gray-900">₦3.1M</p>
							</div>
						</div>
						<div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<Settings className="w-4 h-4" />
							</div>
							<button className="px-4 py-2 bg-[#014F01] text-white text-sm font-medium rounded-lg hover:bg-[#013d01] transition-colors">
								View report
							</button>
						</div>
					</div>

					{/* Threshold Alert Card with Status */}
					<div className="bg-white rounded-lg border border-[#E9EAEB] p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
						<div className="flex items-center justify-between mb-4">
							<span className="text-sm text-gray-600 font-medium">Threshold Alert (Min)</span>
							<div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-full">
								<CheckCircle2 className="w-3 h-3 text-green-600" />
								<span className="text-xs font-medium text-green-700">Healthy</span>
							</div>
						</div>
						<div className="mb-6">
							<p className="text-3xl font-bold text-gray-900">₦1,000,000</p>
							<p className="text-xs text-gray-500 mt-1">Current: ₦15.2M (15.2x above)</p>
						</div>
						<div className="flex items-center justify-between pt-4 border-t border-gray-100">
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<Settings className="w-4 h-4" />
							</div>
							<button className="px-4 py-2 bg-white border border-[#E9EAEB] text-gray-700 text-sm font-medium rounded-lg hover:bg-[#FAFAFA] transition-colors">
								Configure
							</button>
						</div>
					</div>
				</div>
			) : (
				// USDT/USDC Cards
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Total Balance Card */}
					<div className="bg-white rounded-lg border-2 border-[#B8E632] p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
						<div className="flex items-center justify-between mb-2">
							<div className="flex items-center gap-2">
								<span className="text-sm text-gray-600 font-medium">Total Balance</span>
								<ChevronDown className="w-4 h-4 text-gray-400" />
							</div>
							<TrendIndicator value={8.4} isPositive={true} />
						</div>
						<div className="mb-2 flex items-end gap-2">
							<p className="text-3xl font-bold text-gray-900">$15,200</p>
							<MiniSparkline data={sparklineData} color="#B8E632" />
						</div>
						<div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<Settings className="w-4 h-4" />
								<span>Transaction activity</span>
							</div>
							<button
								onClick={(e) => {
									e.stopPropagation();
									setTransactionActivityEnabled(!transactionActivityEnabled);
								}}
								className={`relative w-11 h-6 rounded-full transition-colors ${
									transactionActivityEnabled ? "bg-[#014F01]" : "bg-gray-300"
								}`}
							>
								<div
									className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
										transactionActivityEnabled ? "translate-x-5" : ""
									}`}
								/>
							</button>
						</div>
					</div>

					{/* Available for Settlement Card */}
					<div className="bg-white rounded-lg border border-[#E9EAEB] p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
						<div className="flex items-center justify-between mb-4">
							<span className="text-sm text-gray-600 font-medium">Available for Settlement</span>
							<TrendIndicator value={2.1} isPositive={false} />
						</div>
						<div className="mb-6">
							<p className="text-3xl font-bold text-gray-900">$1,640</p>
							<p className="text-xs text-gray-500 mt-1">10.8% of total balance</p>
						</div>
						<div className="flex items-center justify-between pt-4 border-t border-gray-100">
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<Settings className="w-4 h-4" />
							</div>
							<button className="px-4 py-2 bg-[#014F01] text-white text-sm font-medium rounded-lg hover:bg-[#013d01] transition-colors">
								View report
							</button>
						</div>
					</div>

					{/* Total User Wallets Card */}
					<div className="bg-white rounded-lg border border-[#E9EAEB] p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
						<div className="flex items-center justify-between mb-4">
							<span className="text-sm text-gray-600 font-medium">Total User Wallets</span>
							<TrendIndicator value={15.7} isPositive={true} />
						</div>
						<div className="mb-6">
							<p className="text-3xl font-bold text-gray-900">21,320</p>
							<p className="text-xs text-gray-500 mt-1">+342 new this week</p>
						</div>
						<div className="flex items-center justify-between pt-4 border-t border-gray-100">
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<Settings className="w-4 h-4" />
							</div>
							<button className="px-4 py-2 bg-white border border-[#E9EAEB] text-gray-700 text-sm font-medium rounded-lg hover:bg-[#FAFAFA] transition-colors">
								View details
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Enhanced Transactions Table */}
			<div className="bg-white rounded-lg border border-[#E9EAEB] overflow-hidden">
				{/* Table Header with Advanced Search */}
				<div className="p-6 border-b border-[#E9EAEB]">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-3">
							<h2 className="text-lg font-semibold text-gray-900">
								{activeTab} Wallet Transactions
							</h2>
							{activeTab !== "Naira" && (
								<span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
									{networkFilter}
								</span>
							)}
						</div>
						<div className="flex items-center gap-3">
							{/* Search Bar */}
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
								<input
									type="text"
									placeholder="Search transactions..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10 pr-20 py-2 w-80 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent transition-all"
								/>
								<kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded border border-gray-300">
									⌘K
								</kbd>
							</div>
							<button
								onClick={() => setShowFilters(!showFilters)}
								className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
									showFilters
										? "bg-[#014F01] text-white border-[#014F01]"
										: "bg-white text-gray-700 border-[#E9EAEB] hover:bg-[#FAFAFA]"
								}`}
							>
								<Filter className="w-4 h-4" />
								Filters
							</button>
						</div>
					</div>

					{/* Advanced Filters Dropdown */}
					{showFilters && (
						<div className="mt-4 p-4 bg-gray-50 rounded-lg border border-[#E9EAEB] animate-in fade-in slide-in-from-top-2 duration-200">
							<div className="grid grid-cols-4 gap-4">
								<div>
									<label className="block text-xs font-medium text-gray-700 mb-2">Date Range</label>
									<select className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01]">
										<option>Last 7 days</option>
										<option>Last 30 days</option>
										<option>Last 90 days</option>
										<option>Custom range</option>
									</select>
								</div>
								<div>
									<label className="block text-xs font-medium text-gray-700 mb-2">Amount Range</label>
									<select className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01]">
										<option>All amounts</option>
										<option>$0 - $100</option>
										<option>$100 - $1,000</option>
										<option>$1,000+</option>
									</select>
								</div>
								<div>
									<label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
									<select className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01]">
										<option>All statuses</option>
										<option>Success</option>
										<option>Pending</option>
										<option>Failed</option>
									</select>
								</div>
								<div>
									<label className="block text-xs font-medium text-gray-700 mb-2">Type</label>
									<select className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01]">
										<option>All types</option>
										<option>Deposit</option>
										<option>Withdrawal</option>
										<option>Admin Credit</option>
									</select>
								</div>
							</div>
							<div className="flex items-center justify-between mt-4">
								<button className="text-sm text-gray-600 hover:text-gray-900">
									Clear all filters
								</button>
								<button className="px-4 py-2 bg-[#014F01] text-white text-sm font-medium rounded-lg hover:bg-[#013d01] transition-colors">
									Apply filters
								</button>
							</div>
						</div>
					)}

					{/* Bulk Actions Bar */}
					{showBulkActions && (
						<div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
							<span className="text-sm font-medium text-blue-900">
								{selectedRows.size} transaction{selectedRows.size > 1 ? 's' : ''} selected
							</span>
							<div className="flex items-center gap-2">
								<button className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors">
									Export selected
								</button>
								<button className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors">
									Mark as reviewed
								</button>
								<button
									onClick={() => {
										setSelectedRows(new Set());
										setShowBulkActions(false);
									}}
									className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors"
								>
									<X className="w-4 h-4 text-blue-700" />
								</button>
							</div>
						</div>
					)}
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-[#FAFAFA]">
							<tr>
								<th className="text-left py-3 px-6 text-xs font-medium text-gray-600 uppercase tracking-wider">
									<div className="flex items-center gap-2">
										Txn ID
										<ChevronDown className="w-4 h-4" />
									</div>
								</th>
								<th className="text-left py-3 px-6 text-xs font-medium text-gray-600 uppercase tracking-wider">
									<input
										type="checkbox"
										className="w-4 h-4 rounded border-gray-300 cursor-pointer"
										checked={selectedRows.size === transactions.length}
										onChange={handleSelectAll}
									/>
								</th>
								<th className="text-left py-3 px-6 text-xs font-medium text-gray-600 uppercase tracking-wider">
									<div className="flex items-center gap-2">
										User
										<ChevronDown className="w-4 h-4" />
									</div>
								</th>
								{activeTab !== "Naira" && (
									<th className="text-left py-3 px-6 text-xs font-medium text-gray-600 uppercase tracking-wider">
										Network
									</th>
								)}
								<th className="text-left py-3 px-6 text-xs font-medium text-gray-600 uppercase tracking-wider">
									<div className="flex items-center gap-2">
										Type
										<ChevronDown className="w-4 h-4" />
									</div>
								</th>
								<th className="text-left py-3 px-6 text-xs font-medium text-gray-600 uppercase tracking-wider">
									<div className="flex items-center gap-2">
										Amount
										<ChevronDown className="w-4 h-4" />
									</div>
								</th>
								{activeTab === "Naira" && (
									<th className="text-left py-3 px-6 text-xs font-medium text-gray-600 uppercase tracking-wider">
										Method
									</th>
								)}
								<th className="text-left py-3 px-6 text-xs font-medium text-gray-600 uppercase tracking-wider">
									Date
								</th>
								<th className="text-left py-3 px-6 text-xs font-medium text-gray-600 uppercase tracking-wider">
									Status
								</th>
								<th className="text-left py-3 px-6 text-xs font-medium text-gray-600 uppercase tracking-wider">
									Action
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{transactions.map((tx, index) => (
								<tr
									key={index}
									className="hover:bg-gray-50 transition-colors group"
									onMouseEnter={() => setHoveredRow(index)}
									onMouseLeave={() => setHoveredRow(null)}
								>
									<td className="py-4 px-6 text-sm font-medium text-gray-900">{tx.id}</td>
									<td className="py-4 px-6">
										<input
											type="checkbox"
											className="w-4 h-4 rounded border-gray-300 cursor-pointer"
											checked={selectedRows.has(index)}
											onChange={() => handleBulkSelect(index)}
										/>
									</td>
									<td className="py-4 px-6">
										<div className="flex items-center gap-3">
											{tx.type === "Deposit" ? (
												<ArrowDownLeft className="w-5 h-5 text-green-600" />
											) : (
												<ArrowUpRight className="w-5 h-5 text-red-600" />
											)}
											<span className="text-sm text-gray-900 font-medium">{tx.user}</span>
										</div>
									</td>
									{activeTab !== "Naira" && (
										<td className="py-4 px-6">
											<span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
												{tx.network}
											</span>
										</td>
									)}
									<td className="py-4 px-6 text-sm text-gray-900">{tx.type}</td>
									<td className="py-4 px-6 text-sm font-semibold text-gray-900">
										{activeTab === "Naira" ? `₦${tx.amount.toLocaleString()}` : `$${tx.amount}`}
									</td>
									{activeTab === "Naira" && (
										<td className="py-4 px-6 text-sm text-gray-600">{tx.method}</td>
									)}
									<td className="py-4 px-6 text-sm text-gray-600">{tx.date}</td>
									<td className="py-4 px-6">
										<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
											<span className={`w-1.5 h-1.5 rounded-full ${
												tx.status === "Success" ? "bg-green-600" :
												tx.status === "Failed" ? "bg-red-600" :
												"bg-orange-600"
											}`}></span>
											{tx.status}
										</span>
									</td>
									<td className="py-4 px-6">
										{hoveredRow === index ? (
											<div className="flex items-center gap-1 animate-in fade-in slide-in-from-left-2 duration-200">
												<button
													onClick={() => router.push(`/admin/wallets/transactions/${tx.id}`)}
													className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
													title="View details"
												>
													<Eye className="w-4 h-4 text-gray-600" />
												</button>
												<button
													onClick={() => handleDownloadReceipt(tx)}
													className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
													title="Download receipt"
												>
													<Download className="w-4 h-4 text-gray-600" />
												</button>
												<button
													onClick={() => handleContactUser(tx)}
													className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
													title="Contact user"
												>
													<Mail className="w-4 h-4 text-gray-600" />
												</button>
											</div>
										) : (
											<div className="w-full h-8"></div>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className="p-4 border-t border-[#E9EAEB] flex items-center justify-between">
					<button
						onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
						disabled={currentPage === 1}
						className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
						Previous
					</button>

					<div className="flex items-center gap-1">
						{[1, 2, 3, "...", 8, 9, 10].map((page, index) => (
							<button
								key={index}
								onClick={() => typeof page === "number" && setCurrentPage(page)}
								disabled={page === "..."}
								className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
									currentPage === page
										? "bg-[#014F01] text-white shadow-md"
										: page === "..."
										? "text-gray-400 cursor-default"
										: "text-gray-700 hover:bg-gray-50"
								}`}
							>
								{page}
							</button>
						))}
					</div>

					<button
						onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
						disabled={currentPage === totalPages}
						className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Next
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</div>
			</div>

			{/* Floating Action Button (FAB) for Transfer */}
			<button
				className="fixed bottom-8 right-8 w-14 h-14 bg-[#B8E632] text-gray-900 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group z-50"
				onClick={() => setShowTransferModal(true)}
			>
				<Send className="w-6 h-6" />
				<span className="absolute right-16 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
					Transfer USDT/USDC
				</span>
			</button>

			{/* Admin Actions Drawer */}
			<button
				onClick={() => setShowAdminDrawer(!showAdminDrawer)}
				className="fixed bottom-24 right-8 w-14 h-14 bg-white border-2 border-[#E9EAEB] text-gray-700 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-50"
			>
				<Menu className="w-6 h-6" />
			</button>

			{/* Admin Actions Sidebar Drawer */}
			{showAdminDrawer && (
				<>
					<div
						className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
						onClick={() => setShowAdminDrawer(false)}
					/>
					<div className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-300">
						<div className="p-6 border-b border-[#E9EAEB] flex items-center justify-between">
							<h3 className="text-lg font-semibold text-gray-900">Admin Actions</h3>
							<button
								onClick={() => setShowAdminDrawer(false)}
								className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
							>
								<X className="w-5 h-5 text-gray-600" />
							</button>
						</div>
						<div className="p-6 space-y-3">
							<button
								onClick={() => {
									setShowExportModal(true);
									setShowAdminDrawer(false);
								}}
								className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-[#E9EAEB] rounded-lg hover:bg-[#FAFAFA] transition-colors text-left group"
							>
								<Download className="w-5 h-5 text-gray-600 group-hover:text-[#014F01] transition-colors" />
								<div className="flex-1">
									<span className="text-sm font-medium text-gray-700 block">Export Transactions</span>
									<span className="text-xs text-gray-500">Download as CSV or PDF</span>
								</div>
								<kbd className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded border border-gray-300">E</kbd>
							</button>
							<button
								onClick={() => {
									setShowReconcileModal(true);
									setShowAdminDrawer(false);
								}}
								className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-[#E9EAEB] rounded-lg hover:bg-[#FAFAFA] transition-colors text-left group"
							>
								<RefreshCw className="w-5 h-5 text-gray-600 group-hover:text-[#014F01] transition-colors" />
								<div className="flex-1">
									<span className="text-sm font-medium text-gray-700 block">Reconcile Bank Float</span>
									<span className="text-xs text-gray-500">Last reconciled 2h ago</span>
								</div>
								<kbd className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded border border-gray-300">R</kbd>
							</button>
							<button
								onClick={() => {
									setShowTransferModal(true);
									setShowAdminDrawer(false);
								}}
								className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-[#E9EAEB] rounded-lg hover:bg-[#FAFAFA] transition-colors text-left group"
							>
								<Send className="w-5 h-5 text-gray-600 group-hover:text-[#014F01] transition-colors" />
								<div className="flex-1">
									<span className="text-sm font-medium text-gray-700 block">Transfer USDT/USDC</span>
									<span className="text-xs text-gray-500">Send crypto funds</span>
								</div>
								<kbd className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded border border-gray-300">W</kbd>
							</button>
							<button
								onClick={() => {
									setShowTopupModal(true);
									setShowAdminDrawer(false);
								}}
								className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-[#E9EAEB] rounded-lg hover:bg-[#FAFAFA] transition-colors text-left group"
							>
								<TrendingUp className="w-5 h-5 text-gray-600 group-hover:text-[#014F01] transition-colors" />
								<div className="flex-1">
									<span className="text-sm font-medium text-gray-700 block">Manual Top-up</span>
									<span className="text-xs text-gray-500">Add funds manually</span>
								</div>
								<kbd className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded border border-gray-300">T</kbd>
							</button>
						</div>
						<div className="p-6 border-t border-[#E9EAEB]">
							<h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Actions</h4>
							<div className="space-y-2">
								<div className="flex items-start gap-2 text-xs">
									<Zap className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
									<div>
										<p className="text-gray-900 font-medium">Reconciliation completed</p>
										<p className="text-gray-500">2 hours ago</p>
									</div>
								</div>
								<div className="flex items-start gap-2 text-xs">
									<Zap className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
									<div>
										<p className="text-gray-900 font-medium">Export generated (234 transactions)</p>
										<p className="text-gray-500">5 hours ago</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</>
			)}

			{/* Modals */}
			<ManualTopupModal isOpen={showTopupModal} onClose={() => setShowTopupModal(false)} />
			<ExportTransactionsModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} />
			<TransferModal isOpen={showTransferModal} onClose={() => setShowTransferModal(false)} />
			<ReconcileModal isOpen={showReconcileModal} onClose={() => setShowReconcileModal(false)} />

			{/* Contact User Modal */}
			{showContactModal && selectedTransaction && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
					<div className="bg-white rounded-lg max-w-2xl w-full p-6 animate-in slide-in-from-bottom duration-300">
						<div className="flex items-center justify-between mb-6">
							<div>
								<h3 className="text-lg font-semibold text-gray-900">Contact User</h3>
								<p className="text-sm text-gray-600 mt-1">Send a message regarding transaction {selectedTransaction.id}</p>
							</div>
							<button
								onClick={() => {
									setShowContactModal(false);
									setSelectedTransaction(null);
								}}
								className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
							>
								<X className="w-5 h-5 text-gray-600" />
							</button>
						</div>

						{/* User Info */}
						<div className="bg-gray-50 rounded-lg p-4 mb-6">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-xs text-gray-600 mb-1">User</p>
									<p className="font-medium text-gray-900">{selectedTransaction.user}</p>
								</div>
								<div>
									<p className="text-xs text-gray-600 mb-1">Transaction</p>
									<p className="font-medium text-gray-900">{selectedTransaction.type}</p>
								</div>
								<div>
									<p className="text-xs text-gray-600 mb-1">Amount</p>
									<p className="font-medium text-gray-900">
										{activeTab === "Naira" ? `₦${selectedTransaction.amount.toLocaleString()}` : `$${selectedTransaction.amount}`}
									</p>
								</div>
								<div>
									<p className="text-xs text-gray-600 mb-1">Status</p>
									<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTransaction.status)}`}>
										{selectedTransaction.status}
									</span>
								</div>
							</div>
						</div>

						{/* Message Form */}
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Message Template
								</label>
								<select className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]">
									<option value="">Custom Message</option>
									<option value="verification">Request Verification</option>
									<option value="update">Transaction Update</option>
									<option value="issue">Report Issue</option>
									<option value="confirmation">Request Confirmation</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Subject
								</label>
								<input
									type="text"
									placeholder="e.g., Regarding your transaction..."
									defaultValue={`Regarding Transaction ${selectedTransaction.id}`}
									className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Message
								</label>
								<textarea
									rows={6}
									placeholder="Type your message here..."
									className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
								></textarea>
							</div>

							<div>
								<label className="flex items-center gap-2">
									<input type="checkbox" className="w-4 h-4 text-[#014F01] rounded" defaultChecked />
									<span className="text-sm text-gray-700">Send copy to my email</span>
								</label>
							</div>

							<div>
								<label className="flex items-center gap-2">
									<input type="checkbox" className="w-4 h-4 text-[#014F01] rounded" />
									<span className="text-sm text-gray-700">Mark as urgent</span>
								</label>
							</div>
						</div>

						{/* Actions */}
						<div className="flex items-center gap-3 mt-6 pt-6 border-t border-[#E9EAEB]">
							<button
								onClick={() => {
									setShowContactModal(false);
									setSelectedTransaction(null);
								}}
								className="flex-1 px-4 py-2 border border-[#E9EAEB] text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={() => {
									console.log("Sending message to user:", selectedTransaction.user);
									// API call to send email/notification
									setShowContactModal(false);
									setSelectedTransaction(null);
								}}
								className="flex-1 px-4 py-2 bg-[#014F01] text-white rounded-lg hover:bg-[#013800] transition-colors flex items-center justify-center gap-2"
							>
								<Mail className="w-4 h-4" />
								Send Message
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
