"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowUpRight,
	ArrowDownRight,
	Copy,
	Eye,
	RefreshCw,
	CheckCircle2,
	XCircle,
	Clock,
} from "lucide-react";
import { useToast } from "@/components/admin/Toast";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import Modal from "@/components/admin/Modal";
import Pagination from "@/components/admin/Pagination";
import SearchBar from "@/components/admin/SearchBar";
import BatchActions, { useBatchSelection, SelectCheckbox } from "@/components/admin/BatchActions";
import { exportTableData } from "@/lib/export-utils";
import { getTransactionStatusColor } from "@/lib/status-utils";
import { formatDate, formatTime, formatSmartDate } from "@/lib/date-utils";

interface Transaction {
	id: string;
	type: "Buy" | "Sell";
	user: {
		id: string;
		name: string;
		email: string;
	};
	amount: number;
	fees: number;
	paymentMethod: string;
	transactionHash: string;
	date: string;
	time: string;
	notes: string;
	status: "Success" | "Pending" | "Failed";
}

const mockTransactions: Transaction[] = [
	{
		id: "TX0001220",
		type: "Buy",
		user: { id: "1", name: "Jacob Jones", email: "jacob@clusteer.com" },
		amount: -18.99,
		fees: 0.5,
		paymentMethod: "Wallet",
		transactionHash: "0x3a5f79f1e2d4c8b3a1f6e9d2c5b8a4f7e1d3c6b9",
		date: "2025-01-16",
		time: "13:00:00",
		notes: "N/A",
		status: "Success",
	},
	{
		id: "TX0001221",
		type: "Sell",
		user: { id: "2", name: "Marting Rios", email: "martin@clusteer.com" },
		amount: -4.5,
		fees: 1,
		paymentMethod: "Wallet",
		transactionHash: "0x9e1f4c38d7a2b5e8f1c4d6a9b2e5f8c1d4a7b3e6",
		date: "2025-01-16",
		time: "07:20:00",
		notes: "N/A",
		status: "Success",
	},
	{
		id: "TX0001222",
		type: "Buy",
		user: { id: "3", name: "Will Copper", email: "will@clusteer.com" },
		amount: 88.0,
		fees: 1,
		paymentMethod: "Wallet",
		transactionHash: "0xa5b7cd48e9f2d1b6c3a8e5d2f9b4c7e1a6d3b8f5",
		date: "2025-01-16",
		time: "02:45:00",
		notes: "N/A",
		status: "Success",
	},
	{
		id: "TX0001223",
		type: "Sell",
		user: { id: "4", name: "Marco Kelly", email: "marco@clusteer.com" },
		amount: -15.0,
		fees: 0.5,
		paymentMethod: "Wallet",
		transactionHash: "0xc8923e4fd1a7b5e2f9c6d3a8e1b4f7c2d5a9b6e3",
		date: "2025-01-15",
		time: "18:10:00",
		notes: "N/A",
		status: "Success",
	},
	{
		id: "TX0001224",
		type: "Buy",
		user: { id: "5", name: "Alex Morrison", email: "alex@clusteer.com" },
		amount: -12.5,
		fees: 1,
		paymentMethod: "Wallet",
		transactionHash: "0xd491e5c1b8f3a6d2e9c4f7b1a5d8e2c6f9b3a7d4",
		date: "2025-01-15",
		time: "07:52:00",
		notes: "N/A",
		status: "Success",
	},
	{
		id: "TX0001225",
		type: "Buy",
		user: { id: "6", name: "Mikey Lawrence", email: "mikey@clusteer.com" },
		amount: -40.2,
		fees: 1,
		paymentMethod: "Wallet",
		transactionHash: "0x71a3efc3d5b9e2f6a8c4d1e7b3f9c6a2d5e8b1f4",
		date: "2025-01-15",
		time: "12:15:00",
		notes: "N/A",
		status: "Failed",
	},
	{
		id: "TX0001226",
		type: "Buy",
		user: { id: "7", name: "Freya Browning", email: "freya@clusteer.com" },
		amount: 88.0,
		fees: 1,
		paymentMethod: "Wallet",
		transactionHash: "0xf2d5b93ce8a1f6d4b7c2e9f5a3d8c1b6e4f7a2d9",
		date: "2025-01-15",
		time: "05:40:00",
		notes: "N/A",
		status: "Pending",
	},
];

export default function TransactionsPage() {
	const router = useRouter();
	const toast = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedStatus, setSelectedStatus] = useState<string>("All");
	const [selectedType, setSelectedType] = useState<string>("All");
	const [showFilters, setShowFilters] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
	const [showDetailsModal, setShowDetailsModal] = useState(false);

	const {
		selectedIds,
		isSelected,
		toggleSelect,
		toggleSelectAll,
		clearSelection,
		isAllSelected,
		isSomeSelected,
	} = useBatchSelection(mockTransactions);

	const statusOptions = ["All", "Success", "Pending", "Failed"];
	const typeOptions = ["All", "Buy", "Sell"];

	// Filter transactions
	const filteredTransactions = mockTransactions.filter((tx) => {
		const matchesSearch =
			tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
			tx.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			tx.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			tx.transactionHash.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesStatus = selectedStatus === "All" || tx.status === selectedStatus;
		const matchesType = selectedType === "All" || tx.type === selectedType;

		return matchesSearch && matchesStatus && matchesType;
	});

	// Pagination
	const totalItems = filteredTransactions.length;
	const totalPages = Math.ceil(totalItems / pageSize);
	const paginatedTransactions = filteredTransactions.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	);

	// Calculate stats
	const stats = {
		total: filteredTransactions.length,
		success: filteredTransactions.filter(t => t.status === "Success").length,
		pending: filteredTransactions.filter(t => t.status === "Pending").length,
		failed: filteredTransactions.filter(t => t.status === "Failed").length,
		totalVolume: filteredTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0),
		totalFees: filteredTransactions.reduce((sum, t) => sum + t.fees, 0),
	};

	const handleExport = (format: 'csv' | 'json' | 'excel') => {
		const txToExport = selectedIds.length > 0
			? filteredTransactions.filter(t => selectedIds.includes(t.id))
			: filteredTransactions;

		exportTableData({
			filename: `transactions-${new Date().toISOString().split('T')[0]}`,
			columns: [
				{ key: 'id', label: 'Transaction ID' },
				{ key: 'type', label: 'Type' },
				{ key: 'user', label: 'User', format: (val) => val.name },
				{ key: 'user', label: 'Email', format: (val) => val.email },
				{ key: 'amount', label: 'Amount', format: (val) => `$${val.toFixed(2)}` },
				{ key: 'fees', label: 'Fees', format: (val) => `$${val.toFixed(2)}` },
				{ key: 'paymentMethod', label: 'Payment Method' },
				{ key: 'transactionHash', label: 'Transaction Hash' },
				{ key: 'status', label: 'Status' },
				{ key: 'date', label: 'Date', format: (val) => formatDate(val) },
				{ key: 'time', label: 'Time', format: (val) => formatTime(val) },
			],
			data: txToExport,
			format,
		});

		toast.success('Export successful', `Exported ${txToExport.length} transactions to ${format.toUpperCase()}`);
	};

	const copyToClipboard = (text: string, label: string) => {
		navigator.clipboard.writeText(text);
		toast.success('Copied!', `${label} copied to clipboard`);
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		setCurrentPage(1);
	};

	const clearFilters = () => {
		setSelectedStatus("All");
		setSelectedType("All");
		setShowFilters(false);
		setSearchQuery("");
		setCurrentPage(1);
	};

	const viewDetails = (tx: Transaction) => {
		setSelectedTransaction(tx);
		setShowDetailsModal(true);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
					<p className="text-sm text-gray-500 mt-1">
						Monitor and manage all platform transactions
					</p>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="bg-white rounded-lg border border-[#E9EAEB] p-4">
					<p className="text-sm text-gray-600">Total Transactions</p>
					<p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
				</div>
				<div className="bg-white rounded-lg border border-[#E9EAEB] p-4">
					<p className="text-sm text-gray-600">Success Rate</p>
					<p className="text-2xl font-bold text-green-600 mt-1">
						{stats.total > 0 ? ((stats.success / stats.total) * 100).toFixed(1) : 0}%
					</p>
				</div>
				<div className="bg-white rounded-lg border border-[#E9EAEB] p-4">
					<p className="text-sm text-gray-600">Total Volume</p>
					<p className="text-2xl font-bold text-gray-900 mt-1">${stats.totalVolume.toFixed(2)}</p>
				</div>
				<div className="bg-white rounded-lg border border-[#E9EAEB] p-4">
					<p className="text-sm text-gray-600">Total Fees</p>
					<p className="text-2xl font-bold text-gray-900 mt-1">${stats.totalFees.toFixed(2)}</p>
				</div>
			</div>

			{/* Search and Filters */}
			<div className="bg-white rounded-lg border border-[#E9EAEB] p-4 space-y-4">
				<div className="flex items-center gap-3">
					<div className="flex-1">
						<SearchBar
							value={searchQuery}
							onChange={handleSearch}
							placeholder="Search by ID, user, email, or hash..."
						/>
					</div>
					<button
						onClick={() => setShowFilters(!showFilters)}
						className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors ${
							showFilters || selectedStatus !== "All" || selectedType !== "All"
								? "bg-[#E7F6EC] border-[#014F01] text-[#014F01]"
								: "border-[#E9EAEB] hover:bg-gray-50"
						}`}
					>
						Filters
						{(selectedStatus !== "All" || selectedType !== "All") && (
							<span className="w-2 h-2 bg-[#014F01] rounded-full"></span>
						)}
					</button>
				</div>

				{/* Filter Chips */}
				{showFilters && (
					<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
						<div className="flex items-center gap-2">
							<span className="text-sm font-medium text-gray-700">Status:</span>
							<div className="flex gap-2">
								{statusOptions.map((status) => (
									<button
										key={status}
										onClick={() => setSelectedStatus(status)}
										className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
											selectedStatus === status
												? "bg-[#014F01] text-white"
												: "bg-white text-gray-600 hover:bg-gray-100"
										}`}
									>
										{status}
									</button>
								))}
							</div>
						</div>

						<div className="h-6 w-px bg-gray-300" />

						<div className="flex items-center gap-2">
							<span className="text-sm font-medium text-gray-700">Type:</span>
							<div className="flex gap-2">
								{typeOptions.map((type) => (
									<button
										key={type}
										onClick={() => setSelectedType(type)}
										className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
											selectedType === type
												? "bg-[#014F01] text-white"
												: "bg-white text-gray-600 hover:bg-gray-100"
										}`}
									>
										{type}
									</button>
								))}
							</div>
						</div>

						<button
							onClick={clearFilters}
							className="ml-auto px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
						>
							Clear all
						</button>
					</div>
				)}

				{/* Results Count */}
				<div className="flex items-center justify-between text-sm">
					<p className="text-gray-600">
						Showing <span className="font-semibold">{filteredTransactions.length}</span> transactions
					</p>
					{selectedIds.length > 0 && (
						<p className="text-gray-600">
							<span className="font-semibold">{selectedIds.length}</span> selected
						</p>
					)}
				</div>
			</div>

			{/* Batch Actions */}
			{selectedIds.length > 0 && (
				<BatchActions
					selectedCount={selectedIds.length}
					onClear={clearSelection}
					actions={[
						{
							label: "Export Selected",
							onClick: () => handleExport('csv'),
							variant: "default",
						},
						{
							label: "Export as Excel",
							onClick: () => handleExport('excel'),
							variant: "success",
						},
					]}
				/>
			)}

			{/* Transactions Table */}
			<div className="bg-white rounded-lg border border-[#E9EAEB]">
				{isLoading ? (
					<div className="py-16">
						<LoadingSpinner size="lg" text="Loading transactions..." />
					</div>
				) : filteredTransactions.length === 0 ? (
					<div className="text-center py-16">
						<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<RefreshCw className="w-8 h-8 text-gray-400" />
						</div>
						<p className="text-gray-900 font-medium mb-2">No transactions found</p>
						<p className="text-sm text-gray-500 mb-4">
							{searchQuery || selectedStatus !== "All" || selectedType !== "All"
								? "Try adjusting your filters"
								: "Transactions will appear here"}
						</p>
						<button
							onClick={clearFilters}
							className="inline-flex items-center gap-2 px-4 py-2 text-sm text-[#014F01] hover:bg-[#E7F6EC] rounded-lg transition-colors"
						>
							<RefreshCw className="w-4 h-4" />
							Clear all filters
						</button>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-[#FAFAFA] border-b border-[#E9EAEB]">
								<tr>
									<th className="text-left px-6 py-4">
										<SelectCheckbox
											checked={isAllSelected}
											indeterminate={isSomeSelected}
											onChange={toggleSelectAll}
										/>
									</th>
									<th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
										Transaction ID
									</th>
									<th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
										Type
									</th>
									<th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
										User
									</th>
									<th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
										Amount
									</th>
									<th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
										Fees
									</th>
									<th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
										Status
									</th>
									<th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
										Date
									</th>
									<th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
										Action
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-[#E9EAEB]">
								{paginatedTransactions.map((tx) => (
									<tr
										key={tx.id}
										onClick={(e) => {
											const target = e.target as HTMLElement;
											if (!target.closest('input[type="checkbox"]') && !target.closest('button')) {
												viewDetails(tx);
											}
										}}
										className="hover:bg-gray-50 cursor-pointer transition-colors"
									>
										<td className="px-6 py-4">
											<SelectCheckbox
												checked={isSelected(tx.id)}
												onChange={() => toggleSelect(tx.id)}
											/>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-2">
												<span className="text-sm font-medium text-gray-900 font-mono">
													{tx.id}
												</span>
												<button
													onClick={(e) => {
														e.stopPropagation();
														copyToClipboard(tx.id, 'Transaction ID');
													}}
													className="p-1 hover:bg-gray-100 rounded transition-colors"
												>
													<Copy className="w-3.5 h-3.5 text-gray-400" />
												</button>
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-1.5">
												{tx.type === "Buy" ? (
													<ArrowUpRight className="w-4 h-4 text-green-600" />
												) : (
													<ArrowDownRight className="w-4 h-4 text-orange-600" />
												)}
												<span className={`text-sm font-medium ${
													tx.type === "Buy" ? "text-green-700" : "text-orange-700"
												}`}>
													{tx.type}
												</span>
											</div>
										</td>
										<td className="px-6 py-4">
											<div>
												<p className="text-sm font-medium text-gray-900">{tx.user.name}</p>
												<p className="text-xs text-gray-500">{tx.user.email}</p>
											</div>
										</td>
										<td className="px-6 py-4">
											<span className={`text-sm font-medium ${
												tx.amount < 0 ? "text-red-600" : "text-green-600"
											}`}>
												{tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount).toFixed(2)}
											</span>
										</td>
										<td className="px-6 py-4">
											<span className="text-sm text-gray-600">
												${tx.fees.toFixed(2)}
											</span>
										</td>
										<td className="px-6 py-4">
											<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getTransactionStatusColor(tx.status)}`}>
												{tx.status === "Success" && <CheckCircle2 className="w-3.5 h-3.5" />}
												{tx.status === "Pending" && <Clock className="w-3.5 h-3.5" />}
												{tx.status === "Failed" && <XCircle className="w-3.5 h-3.5" />}
												{tx.status}
											</span>
										</td>
										<td className="px-6 py-4">
											<div>
												<p className="text-sm text-gray-900">{formatSmartDate(tx.date)}</p>
												<p className="text-xs text-gray-500">{formatTime(tx.time)}</p>
											</div>
										</td>
										<td className="px-6 py-4">
											<button
												onClick={(e) => {
													e.stopPropagation();
													viewDetails(tx);
												}}
												className="p-1 hover:bg-gray-100 rounded transition-colors"
											>
												<Eye className="w-4 h-4 text-gray-600" />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{/* Pagination */}
				{filteredTransactions.length > 0 && (
					<div className="border-t border-[#E9EAEB]">
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							pageSize={pageSize}
							totalItems={totalItems}
							onPageChange={setCurrentPage}
							onPageSizeChange={(newSize) => {
								setPageSize(newSize);
								setCurrentPage(1);
							}}
						/>
					</div>
				)}
			</div>

			{/* Transaction Details Modal */}
			{selectedTransaction && (
				<Modal
					isOpen={showDetailsModal}
					onClose={() => {
						setShowDetailsModal(false);
						setSelectedTransaction(null);
					}}
					title="Transaction Details"
					description={`Transaction ID: ${selectedTransaction.id}`}
					size="lg"
				>
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-xs text-gray-500 mb-1">Transaction ID</p>
								<div className="flex items-center gap-2">
									<p className="text-sm font-mono font-medium">{selectedTransaction.id}</p>
									<button
										onClick={() => copyToClipboard(selectedTransaction.id, 'Transaction ID')}
										className="p-1 hover:bg-gray-100 rounded"
									>
										<Copy className="w-3.5 h-3.5 text-gray-400" />
									</button>
								</div>
							</div>
							<div>
								<p className="text-xs text-gray-500 mb-1">Type</p>
								<div className="flex items-center gap-1.5">
									{selectedTransaction.type === "Buy" ? (
										<ArrowUpRight className="w-4 h-4 text-green-600" />
									) : (
										<ArrowDownRight className="w-4 h-4 text-orange-600" />
									)}
									<p className="text-sm font-medium">{selectedTransaction.type}</p>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-xs text-gray-500 mb-1">User</p>
								<p className="text-sm font-medium">{selectedTransaction.user.name}</p>
								<p className="text-xs text-gray-500">{selectedTransaction.user.email}</p>
							</div>
							<div>
								<p className="text-xs text-gray-500 mb-1">Status</p>
								<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getTransactionStatusColor(selectedTransaction.status)}`}>
									{selectedTransaction.status === "Success" && <CheckCircle2 className="w-3.5 h-3.5" />}
									{selectedTransaction.status === "Pending" && <Clock className="w-3.5 h-3.5" />}
									{selectedTransaction.status === "Failed" && <XCircle className="w-3.5 h-3.5" />}
									{selectedTransaction.status}
								</span>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-xs text-gray-500 mb-1">Amount</p>
								<p className={`text-sm font-medium ${
									selectedTransaction.amount < 0 ? "text-red-600" : "text-green-600"
								}`}>
									{selectedTransaction.amount < 0 ? "-" : "+"}${Math.abs(selectedTransaction.amount).toFixed(2)}
								</p>
							</div>
							<div>
								<p className="text-xs text-gray-500 mb-1">Fees</p>
								<p className="text-sm font-medium">${selectedTransaction.fees.toFixed(2)}</p>
							</div>
						</div>

						<div>
							<p className="text-xs text-gray-500 mb-1">Payment Method</p>
							<p className="text-sm font-medium">{selectedTransaction.paymentMethod}</p>
						</div>

						<div>
							<p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
							<div className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200">
								<p className="text-xs font-mono flex-1 truncate">{selectedTransaction.transactionHash}</p>
								<button
									onClick={() => copyToClipboard(selectedTransaction.transactionHash, 'Transaction Hash')}
									className="p-1 hover:bg-gray-200 rounded"
								>
									<Copy className="w-3.5 h-3.5 text-gray-400" />
								</button>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-xs text-gray-500 mb-1">Date</p>
								<p className="text-sm font-medium">{formatDate(selectedTransaction.date)}</p>
							</div>
							<div>
								<p className="text-xs text-gray-500 mb-1">Time</p>
								<p className="text-sm font-medium">{formatTime(selectedTransaction.time)}</p>
							</div>
						</div>

						{selectedTransaction.notes && selectedTransaction.notes !== "N/A" && (
							<div>
								<p className="text-xs text-gray-500 mb-1">Notes</p>
								<p className="text-sm">{selectedTransaction.notes}</p>
							</div>
						)}
					</div>
				</Modal>
			)}
		</div>
	);
}
