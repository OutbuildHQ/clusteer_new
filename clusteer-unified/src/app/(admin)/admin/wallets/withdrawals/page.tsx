"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	Search,
	Filter,
	Download,
	RefreshCw,
	Clock,
	CheckCircle2,
	XCircle,
	AlertTriangle,
	User,
	DollarSign,
	Wallet,
	TrendingDown,
	Eye,
	X,
	Ban,
	Check,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";

interface Withdrawal {
	id: string;
	user: {
		id: string;
		name: string;
		email: string;
	};
	amount: number;
	currency: "Naira" | "USDT" | "USDC";
	network?: "TRC20" | "BEP20" | "SOL";
	destination: {
		type: "Bank Account" | "Crypto Wallet";
		details: string;
	};
	status: "Pending" | "Approved" | "Rejected" | "Processing" | "Completed";
	requestedAt: string;
	priority: "High" | "Normal" | "Low";
	riskScore: number;
	kycStatus: "Approved" | "Pending" | "Rejected";
}

const mockWithdrawals: Withdrawal[] = [
	{
		id: "WD001",
		user: { id: "U001", name: "Jacob Jones", email: "jacob@clusteer.com" },
		amount: 500000,
		currency: "Naira",
		destination: { type: "Bank Account", details: "GTBank - 0123456789" },
		status: "Pending",
		requestedAt: "Jan 16, 2025, 2:30 PM",
		priority: "High",
		riskScore: 15,
		kycStatus: "Approved",
	},
	{
		id: "WD002",
		user: { id: "U002", name: "Martin Rios", email: "martin@clusteer.com" },
		amount: 300,
		currency: "USDT",
		network: "TRC20",
		destination: { type: "Crypto Wallet", details: "TWd8...9Kx2" },
		status: "Pending",
		requestedAt: "Jan 16, 2025, 1:45 PM",
		priority: "Normal",
		riskScore: 8,
		kycStatus: "Approved",
	},
	{
		id: "WD003",
		user: { id: "U003", name: "Will Copper", email: "will@clusteer.com" },
		amount: 150000,
		currency: "Naira",
		destination: { type: "Bank Account", details: "Opay - 9876543210" },
		status: "Pending",
		requestedAt: "Jan 16, 2025, 12:15 PM",
		priority: "High",
		riskScore: 42,
		kycStatus: "Pending",
	},
	{
		id: "WD004",
		user: { id: "U004", name: "Marco Kelly", email: "marco@clusteer.com" },
		amount: 1000,
		currency: "USDC",
		network: "BEP20",
		destination: { type: "Crypto Wallet", details: "0xAb3...7Cd9" },
		status: "Processing",
		requestedAt: "Jan 16, 2025, 11:00 AM",
		priority: "Normal",
		riskScore: 5,
		kycStatus: "Approved",
	},
];

export default function WithdrawalsPage() {
	const router = useRouter();
	const [withdrawals, setWithdrawals] = useState(mockWithdrawals);
	const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("All");
	const [currencyFilter, setCurrencyFilter] = useState<string>("All");
	const [showFilters, setShowFilters] = useState(false);
	const [isLiveUpdating, setIsLiveUpdating] = useState(true);
	const [lastUpdate, setLastUpdate] = useState(new Date());
	const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
	const [showRejectModal, setShowRejectModal] = useState(false);
	const [rejectReason, setRejectReason] = useState("");
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		if (!isLiveUpdating) return;
		const interval = setInterval(() => {
			setLastUpdate(new Date());
		}, 30000);
		return () => clearInterval(interval);
	}, [isLiveUpdating]);

	const filteredWithdrawals = withdrawals.filter((w) => {
		const matchesSearch =
			w.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
			w.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			w.user.email.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === "All" || w.status === statusFilter;
		const matchesCurrency = currencyFilter === "All" || w.currency === currencyFilter;
		return matchesSearch && matchesStatus && matchesCurrency;
	});

	const pendingCount = withdrawals.filter((w) => w.status === "Pending").length;
	const processingCount = withdrawals.filter((w) => w.status === "Processing").length;
	const highRiskCount = withdrawals.filter((w) => w.riskScore > 30).length;

	const getStatusColor = (status: Withdrawal["status"]) => {
		switch (status) {
			case "Pending":
				return "bg-orange-50 text-orange-700 border-orange-200";
			case "Approved":
				return "bg-primary/10 text-primary border-primary/30";
			case "Processing":
				return "bg-purple-50 text-purple-700 border-purple-200";
			case "Completed":
				return "bg-success/10 text-success border-success";
			case "Rejected":
				return "bg-danger/10 text-danger border-danger";
		}
	};

	const getRiskColor = (score: number) => {
		if (score < 20) return "text-success bg-success/10";
		if (score < 40) return "text-orange-700 bg-orange-50";
		return "text-danger bg-danger/10";
	};

	const handleApprove = (withdrawal: Withdrawal) => {
		console.log("Approving withdrawal:", withdrawal.id);
		// API call here
	};

	const handleReject = () => {
		if (!selectedWithdrawal || !rejectReason.trim()) return;
		console.log("Rejecting withdrawal:", selectedWithdrawal.id, rejectReason);
		setShowRejectModal(false);
		setRejectReason("");
		setSelectedWithdrawal(null);
	};

	const handleBulkApprove = () => {
		console.log("Bulk approving:", Array.from(selectedRows));
		setSelectedRows(new Set());
	};

	return (
		<div className="space-y-6 pb-20">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<div className="flex items-center gap-3">
						<h1 className="text-2xl font-bold text-foreground">Withdrawal Management</h1>
						{isLiveUpdating && (
							<div className="flex items-center gap-2 px-3 py-1 bg-success/10 border border-success rounded-full">
								<span className="relative flex h-2 w-2">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
									<span className="relative inline-flex rounded-full h-2 w-2 bg-success/100"></span>
								</span>
								<span className="text-xs font-medium text-success">Live</span>
							</div>
						)}
					</div>
					<p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
						<Clock className="w-3 h-3" />
						Last updated {lastUpdate.toLocaleTimeString()}
					</p>
				</div>
				<div className="flex items-center gap-3">
					<button
						onClick={() => setIsLiveUpdating(!isLiveUpdating)}
						className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-muted-foreground rounded-lg hover:bg-background transition-all hover:scale-105 active:scale-95"
					>
						<RefreshCw className={`w-4 h-4 ${isLiveUpdating ? "animate-spin" : ""}`} />
						{isLiveUpdating ? "Auto-refresh" : "Paused"}
					</button>
					<button className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-muted-foreground rounded-lg hover:bg-background transition-all hover:scale-105 active:scale-95">
						<Download className="w-4 h-4" />
						Export
					</button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-card rounded-lg border-2 border-orange-200 p-6 hover:shadow-lg transition-all hover:scale-[1.02]">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm text-muted-foreground font-medium">Pending</span>
						<Clock className="w-5 h-5 text-orange-600" />
					</div>
					<p className="text-3xl font-bold text-foreground">{pendingCount}</p>
					<p className="text-xs text-orange-600 mt-1">Requires action</p>
				</div>

				<div className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-all hover:scale-[1.02]">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm text-muted-foreground font-medium">Processing</span>
						<RefreshCw className="w-5 h-5 text-purple-600" />
					</div>
					<p className="text-3xl font-bold text-foreground">{processingCount}</p>
					<p className="text-xs text-purple-600 mt-1">In progress</p>
				</div>

				<div className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-all hover:scale-[1.02]">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm text-muted-foreground font-medium">High Risk</span>
						<AlertTriangle className="w-5 h-5 text-danger" />
					</div>
					<p className="text-3xl font-bold text-foreground">{highRiskCount}</p>
					<p className="text-xs text-danger mt-1">Needs review</p>
				</div>

				<div className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-all hover:scale-[1.02]">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm text-muted-foreground font-medium">Total Today</span>
						<TrendingDown className="w-5 h-5 text-muted-foreground" />
					</div>
					<p className="text-3xl font-bold text-foreground">{withdrawals.length}</p>
					<p className="text-xs text-muted-foreground mt-1">All requests</p>
				</div>
			</div>

			{/* Search and Filters */}
			<div className="bg-card rounded-lg border border-border p-4 space-y-4">
				<div className="flex items-center gap-3">
					<div className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
						<input
							type="text"
							placeholder="Search by ID, user name, or email..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
						/>
					</div>
					<button
						onClick={() => setShowFilters(!showFilters)}
						className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-all ${
							showFilters
								? "bg-primary text-white border-primary"
								: "border-border hover:bg-background"
						}`}
					>
						<Filter className="w-4 h-4" />
						Filters
					</button>
				</div>

				{showFilters && (
					<div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
						<div className="flex items-center gap-2">
							<span className="text-sm font-medium text-muted-foreground">Status:</span>
							<div className="flex gap-2">
								{["All", "Pending", "Processing", "Approved", "Rejected"].map((status) => (
									<button
										key={status}
										onClick={() => setStatusFilter(status)}
										className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
											statusFilter === status
												? "bg-primary text-white"
												: "bg-card text-muted-foreground hover:bg-muted"
										}`}
									>
										{status}
									</button>
								))}
							</div>
						</div>

						<div className="h-6 w-px bg-muted" />

						<div className="flex items-center gap-2">
							<span className="text-sm font-medium text-muted-foreground">Currency:</span>
							<div className="flex gap-2">
								{["All", "Naira", "USDT", "USDC"].map((currency) => (
									<button
										key={currency}
										onClick={() => setCurrencyFilter(currency)}
										className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
											currencyFilter === currency
												? "bg-primary text-white"
												: "bg-card text-muted-foreground hover:bg-muted"
										}`}
									>
										{currency}
									</button>
								))}
							</div>
						</div>
					</div>
				)}

				<div className="flex items-center justify-between text-sm">
					<p className="text-muted-foreground">
						Showing <span className="font-semibold">{filteredWithdrawals.length}</span> withdrawals
					</p>
					{selectedRows.size > 0 && (
						<div className="flex items-center gap-2">
							<span className="text-muted-foreground">{selectedRows.size} selected</span>
							<button
								onClick={handleBulkApprove}
								className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-lg hover:bg-[#d4f0dd] transition-all hover:scale-105 active:scale-95"
							>
								Approve Selected
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Withdrawals Table */}
			<div className="bg-card rounded-lg border border-border overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-background">
							<tr>
								<th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
									<input
										type="checkbox"
										className="rounded border-border"
										onChange={(e) => {
											if (e.target.checked) {
												setSelectedRows(new Set(filteredWithdrawals.map((w) => w.id)));
											} else {
												setSelectedRows(new Set());
											}
										}}
									/>
								</th>
								<th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
									<div className="flex items-center gap-2">
										ID
										<ChevronDown className="w-4 h-4" />
									</div>
								</th>
								<th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
									User
								</th>
								<th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
									Amount
								</th>
								<th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
									Destination
								</th>
								<th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
									Risk Score
								</th>
								<th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
									Status
								</th>
								<th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{filteredWithdrawals.map((withdrawal) => (
								<tr
									key={withdrawal.id}
									className="hover:bg-background transition-all group"
								>
									<td className="py-4 px-6">
										<input
											type="checkbox"
											className="rounded border-border"
											checked={selectedRows.has(withdrawal.id)}
											onChange={(e) => {
												const newSelected = new Set(selectedRows);
												if (e.target.checked) {
													newSelected.add(withdrawal.id);
												} else {
													newSelected.delete(withdrawal.id);
												}
												setSelectedRows(newSelected);
											}}
										/>
									</td>
									<td className="py-4 px-6 text-sm font-medium text-foreground">
										{withdrawal.id}
									</td>
									<td className="py-4 px-6">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-gradient-to-br from-brand-800 to-light-green rounded-full flex items-center justify-center text-white font-bold">
												{withdrawal.user.name.charAt(0)}
											</div>
											<div>
												<p className="text-sm font-medium text-foreground">
													{withdrawal.user.name}
												</p>
												<p className="text-xs text-muted-foreground">{withdrawal.user.email}</p>
											</div>
										</div>
									</td>
									<td className="py-4 px-6">
										<div className="flex items-center gap-2">
											<DollarSign className="w-4 h-4 text-muted-foreground" />
											<div>
												<p className="text-sm font-semibold text-foreground">
													{withdrawal.currency === "Naira" ? "₦" : "$"}
													{withdrawal.amount.toLocaleString()}
												</p>
												<p className="text-xs text-muted-foreground">
													{withdrawal.currency}
													{withdrawal.network && ` (${withdrawal.network})`}
												</p>
											</div>
										</div>
									</td>
									<td className="py-4 px-6">
										<div>
											<p className="text-sm font-medium text-foreground">
												{withdrawal.destination.type}
											</p>
											<p className="text-xs text-muted-foreground font-mono">
												{withdrawal.destination.details}
											</p>
										</div>
									</td>
									<td className="py-4 px-6">
										<span
											className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getRiskColor(
												withdrawal.riskScore
											)}`}
										>
											{withdrawal.riskScore}%
										</span>
									</td>
									<td className="py-4 px-6">
										<span
											className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
												withdrawal.status
											)}`}
										>
											{withdrawal.status === "Pending" && <Clock className="w-3.5 h-3.5" />}
											{withdrawal.status === "Approved" && <CheckCircle2 className="w-3.5 h-3.5" />}
											{withdrawal.status === "Rejected" && <XCircle className="w-3.5 h-3.5" />}
											{withdrawal.status === "Processing" && (
												<RefreshCw className="w-3.5 h-3.5" />
											)}
											{withdrawal.status === "Completed" && (
												<CheckCircle2 className="w-3.5 h-3.5" />
											)}
											{withdrawal.status}
										</span>
									</td>
									<td className="py-4 px-6">
										<div className="flex items-center gap-2">
											{withdrawal.status === "Pending" && (
												<>
													<button
														onClick={() => handleApprove(withdrawal)}
														className="p-2 bg-success/10 text-success rounded-lg hover:bg-success/10 transition-all hover:scale-110 active:scale-95"
														title="Approve"
													>
														<Check className="w-4 h-4" />
													</button>
													<button
														onClick={() => {
															setSelectedWithdrawal(withdrawal);
															setShowRejectModal(true);
														}}
														className="p-2 bg-danger/10 text-danger rounded-lg hover:bg-danger/10 transition-all hover:scale-110 active:scale-95"
														title="Reject"
													>
														<X className="w-4 h-4" />
													</button>
												</>
											)}
											<button
												onClick={() =>
													router.push(`/admin/wallets/transactions/${withdrawal.id}`)
												}
												className="p-2 bg-background text-muted-foreground rounded-lg hover:bg-muted transition-all hover:scale-110 active:scale-95"
												title="View details"
											>
												<Eye className="w-4 h-4" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className="flex items-center justify-between px-6 py-4 border-t border-border">
					<button
						onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
						disabled={currentPage === 1}
						className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-background rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<ChevronLeft className="w-4 h-4" />
						Previous
					</button>

					<div className="flex items-center gap-2">
						{[1, 2, 3, "...", 8, 9, 10].map((page, idx) => (
							<button
								key={idx}
								onClick={() => typeof page === "number" && setCurrentPage(page)}
								disabled={page === "..."}
								className={`px-3 py-1 text-sm font-medium rounded-lg transition-all ${
									currentPage === page
										? "bg-primary text-white shadow-md"
										: "text-muted-foreground hover:bg-background"
								} ${page === "..." ? "cursor-default" : ""}`}
							>
								{page}
							</button>
						))}
					</div>

					<button
						onClick={() => setCurrentPage(currentPage + 1)}
						className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-background rounded-lg transition-colors"
					>
						Next
						<ChevronRight className="w-4 h-4" />
					</button>
				</div>
			</div>

			{/* Reject Modal */}
			{showRejectModal && selectedWithdrawal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
					<div className="bg-card rounded-lg max-w-md w-full p-6 animate-in slide-in-from-bottom duration-300">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center">
								<XCircle className="w-6 h-6 text-danger" />
							</div>
							<div>
								<h3 className="text-lg font-semibold text-foreground">Reject Withdrawal</h3>
								<p className="text-sm text-muted-foreground">ID: {selectedWithdrawal.id}</p>
							</div>
						</div>

						<div className="space-y-4">
							<div className="p-4 bg-background rounded-lg">
								<div className="flex justify-between text-sm mb-2">
									<span className="text-muted-foreground">User</span>
									<span className="font-semibold text-foreground">
										{selectedWithdrawal.user.name}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Amount</span>
									<span className="font-semibold text-foreground">
										{selectedWithdrawal.currency === "Naira" ? "₦" : "$"}
										{selectedWithdrawal.amount.toLocaleString()}
									</span>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-muted-foreground mb-2">
									Reason for Rejection <span className="text-danger">*</span>
								</label>
								<textarea
									value={rejectReason}
									onChange={(e) => setRejectReason(e.target.value)}
									placeholder="Enter reason..."
									className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
									rows={4}
								/>
							</div>
						</div>

						<div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
							<button
								onClick={() => {
									setShowRejectModal(false);
									setRejectReason("");
									setSelectedWithdrawal(null);
								}}
								className="flex-1 px-4 py-2 bg-card border border-border text-muted-foreground rounded-lg hover:bg-background transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handleReject}
								disabled={!rejectReason.trim()}
								className="flex-1 px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Confirm Rejection
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
