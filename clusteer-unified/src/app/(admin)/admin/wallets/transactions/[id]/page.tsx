"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
	ArrowLeft,
	Copy,
	ExternalLink,
	User,
	Calendar,
	Clock,
	CheckCircle2,
	XCircle,
	AlertTriangle,
	FileText,
	Download,
	RefreshCw,
	Flag,
	Ban,
	DollarSign,
	Wallet,
	TrendingUp,
	TrendingDown,
	Mail,
	Phone,
	Shield,
	Edit,
	Trash2,
	Plus,
	X,
} from "lucide-react";

interface TransactionDetail {
	id: string;
	type: "Deposit" | "Withdrawal" | "Admin Credit";
	status: "Success" | "Failed" | "Pending";
	user: {
		id: string;
		name: string;
		email: string;
		phone: string;
		kycStatus: "Approved" | "Pending" | "Rejected";
	};
	amount: number;
	fees: number;
	netAmount: number;
	currency: "Naira" | "USDT" | "USDC";
	network?: "TRC20" | "BEP20" | "SOL";
	paymentMethod?: string;
	bankAccount?: {
		bank: string;
		accountNumber: string;
		accountName: string;
	};
	blockchain?: {
		hash: string;
		confirmations: number;
		explorerUrl: string;
		gasUsed?: string;
		fromAddress?: string;
		toAddress?: string;
	};
	timestamps: {
		initiated: string;
		completed?: string;
		failed?: string;
	};
	notes: string;
	adminNotes?: {
		note: string;
		addedBy: string;
		addedAt: string;
	}[];
}

const mockTransaction: TransactionDetail = {
	id: "TXN1023",
	type: "Deposit",
	status: "Success",
	user: {
		id: "USER001",
		name: "Jacob Jones",
		email: "jacob@clusteer.com",
		phone: "+234 4405765",
		kycStatus: "Approved",
	},
	amount: 300,
	fees: 3,
	netAmount: 297,
	currency: "USDT",
	network: "TRC20",
	blockchain: {
		hash: "0x3a5f79f1e8d2c4b9a7e6f3d1c8b5a2e9f4d7c1b8a5e2f9d6c3b0a7e4f1d8c5b2",
		confirmations: 42,
		explorerUrl: "https://tronscan.org/#/transaction/0x3a5f79f1...",
		gasUsed: "0.00021 TRX",
		fromAddress: "TWd8...9Kx2",
		toAddress: "TPqE...4Mn7",
	},
	timestamps: {
		initiated: "Jan 16, 2025, 2:30 PM",
		completed: "Jan 16, 2025, 2:35 PM",
	},
	notes: "N/A",
	adminNotes: [
		{
			note: "User contacted support regarding this transaction",
			addedBy: "Admin User",
			addedAt: "Jan 16, 2025, 3:00 PM",
		},
	],
};

export default function TransactionDetailPage() {
	const router = useRouter();
	const params = useParams();
	const [transaction] = useState<TransactionDetail>(mockTransaction);
	const [showNoteModal, setShowNoteModal] = useState(false);
	const [newNote, setNewNote] = useState("");
	const [showRefundModal, setShowRefundModal] = useState(false);
	const [copied, setCopied] = useState<string | null>(null);

	const handleCopy = (text: string, label: string) => {
		navigator.clipboard.writeText(text);
		setCopied(label);
		setTimeout(() => setCopied(null), 2000);
	};

	const getStatusIcon = () => {
		switch (transaction.status) {
			case "Success":
				return <CheckCircle2 className="w-6 h-6 text-[var(--cl-up)]" />;
			case "Failed":
				return <XCircle className="w-6 h-6 text-[var(--cl-down)]" />;
			case "Pending":
				return <Clock className="w-6 h-6 text-orange-600" />;
		}
	};

	const getStatusColor = () => {
		switch (transaction.status) {
			case "Success":
				return "bg-[var(--cl-up-soft)] text-[var(--cl-up)] border-[var(--cl-up)]";
			case "Failed":
				return "bg-[var(--cl-down-soft)] text-[var(--cl-down)] border-[var(--cl-down)]";
			case "Pending":
				return "bg-orange-50 text-orange-700 border-orange-200";
		}
	};

	return (
		<div className="space-y-6 pb-20">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button
						onClick={() => router.back()}
						className="p-2 hover:bg-[var(--cl-surface-2)] rounded-lg transition-all hover:scale-110 active:scale-95"
					>
						<ArrowLeft className="w-5 h-5 text-[var(--cl-text-2)]" />
					</button>
					<div>
						<h1 className="text-2xl font-bold text-[var(--cl-text)]">Transaction Details</h1>
						<p className="text-sm text-[var(--cl-text-2)] mt-1">
							Transaction ID: {transaction.id}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<button className="flex items-center gap-2 px-4 py-2 bg-[var(--cl-surface)] border border-[var(--cl-line)] text-[var(--cl-text-2)] rounded-lg hover:bg-[var(--cl-bg)] transition-all hover:scale-105 active:scale-95">
						<Download className="w-4 h-4" />
						Export
					</button>
					<button className="flex items-center gap-2 px-4 py-2 bg-[var(--cl-surface)] border border-[var(--cl-line)] text-[var(--cl-text-2)] rounded-lg hover:bg-[var(--cl-bg)] transition-all hover:scale-105 active:scale-95">
						<RefreshCw className="w-4 h-4" />
						Refresh
					</button>
				</div>
			</div>

			{/* Status Banner */}
			<div className={`p-6 rounded-lg border-2 ${getStatusColor()} transition-all hover:shadow-md`}>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="p-3 bg-[var(--cl-surface)] rounded-full shadow-sm">
							{getStatusIcon()}
						</div>
						<div>
							<p className="text-sm font-medium uppercase tracking-wide opacity-75">
								Transaction Status
							</p>
							<p className="text-2xl font-bold mt-1">{transaction.status}</p>
						</div>
					</div>
					<div className="text-right">
						<p className="text-sm font-medium opacity-75">Amount</p>
						<p className="text-3xl font-bold mt-1">
							{transaction.type === "Deposit" ? "+" : "-"}
							{transaction.currency === "Naira" ? "₦" : "$"}
							{transaction.amount.toLocaleString()}
						</p>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Details */}
				<div className="lg:col-span-2 space-y-6">
					{/* Transaction Information */}
					<div className="bg-[var(--cl-surface)] rounded-lg border border-[var(--cl-line)] p-6">
						<h2 className="text-lg font-semibold text-[var(--cl-text)] mb-6">
							Transaction Information
						</h2>
						<div className="grid grid-cols-2 gap-6">
							<div>
								<label className="text-sm text-[var(--cl-text-2)] font-medium">Transaction Type</label>
								<div className="flex items-center gap-2 mt-2">
									{transaction.type === "Deposit" ? (
										<TrendingUp className="w-5 h-5 text-[var(--cl-up)]" />
									) : (
										<TrendingDown className="w-5 h-5 text-[var(--cl-down)]" />
									)}
									<p className="text-base font-semibold text-[var(--cl-text)]">{transaction.type}</p>
								</div>
							</div>
							<div>
								<label className="text-sm text-[var(--cl-text-2)] font-medium">Currency</label>
								<div className="flex items-center gap-2 mt-2">
									<DollarSign className="w-5 h-5 text-[var(--cl-text-3)]" />
									<p className="text-base font-semibold text-[var(--cl-text)]">
										{transaction.currency}
										{transaction.network && ` (${transaction.network})`}
									</p>
								</div>
							</div>
							<div>
								<label className="text-sm text-[var(--cl-text-2)] font-medium">Amount</label>
								<p className="text-base font-semibold text-[var(--cl-text)] mt-2">
									{transaction.currency === "Naira" ? "₦" : "$"}
									{transaction.amount.toLocaleString()}
								</p>
							</div>
							<div>
								<label className="text-sm text-[var(--cl-text-2)] font-medium">Fees</label>
								<p className="text-base font-semibold text-[var(--cl-text)] mt-2">
									{transaction.currency === "Naira" ? "₦" : "$"}
									{transaction.fees.toLocaleString()}
								</p>
							</div>
							<div>
								<label className="text-sm text-[var(--cl-text-2)] font-medium">Net Amount</label>
								<p className="text-base font-bold text-[#014F01] mt-2">
									{transaction.currency === "Naira" ? "₦" : "$"}
									{transaction.netAmount.toLocaleString()}
								</p>
							</div>
							{transaction.paymentMethod && (
								<div>
									<label className="text-sm text-[var(--cl-text-2)] font-medium">Payment Method</label>
									<p className="text-base font-semibold text-[var(--cl-text)] mt-2">
										{transaction.paymentMethod}
									</p>
								</div>
							)}
						</div>

						{/* Bank Account Details (if applicable) */}
						{transaction.bankAccount && (
							<div className="mt-6 pt-6 border-t border-[var(--cl-line)]">
								<h3 className="text-sm font-semibold text-[var(--cl-text)] mb-4">Bank Account</h3>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="text-sm text-[var(--cl-text-2)]">Bank</label>
										<p className="text-base font-semibold text-[var(--cl-text)] mt-1">
											{transaction.bankAccount.bank}
										</p>
									</div>
									<div>
										<label className="text-sm text-[var(--cl-text-2)]">Account Number</label>
										<div className="flex items-center gap-2 mt-1">
											<p className="text-base font-semibold text-[var(--cl-text)]">
												{transaction.bankAccount.accountNumber}
											</p>
											<button
												onClick={() =>
													handleCopy(transaction.bankAccount!.accountNumber, "account")
												}
												className="p-1 hover:bg-[var(--cl-surface-2)] rounded transition-colors"
											>
												<Copy className="w-4 h-4 text-[var(--cl-text-3)]" />
											</button>
										</div>
									</div>
									<div className="col-span-2">
										<label className="text-sm text-[var(--cl-text-2)]">Account Name</label>
										<p className="text-base font-semibold text-[var(--cl-text)] mt-1">
											{transaction.bankAccount.accountName}
										</p>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Blockchain Details */}
					{transaction.blockchain && (
						<div className="bg-[var(--cl-surface)] rounded-lg border border-[var(--cl-line)] p-6">
							<h2 className="text-lg font-semibold text-[var(--cl-text)] mb-6">
								Blockchain Information
							</h2>
							<div className="space-y-4">
								<div>
									<label className="text-sm text-[var(--cl-text-2)] font-medium">Transaction Hash</label>
									<div className="flex items-center gap-2 mt-2 p-3 bg-[var(--cl-bg)] rounded-lg">
										<p className="text-sm font-mono text-[var(--cl-text)] flex-1 truncate">
											{transaction.blockchain.hash}
										</p>
										<button
											onClick={() => handleCopy(transaction.blockchain!.hash, "hash")}
											className="p-1.5 hover:bg-[var(--cl-surface-2)] rounded transition-all hover:scale-110"
											title="Copy hash"
										>
											<Copy className="w-4 h-4 text-[var(--cl-text-2)]" />
										</button>
										<a
											href={transaction.blockchain.explorerUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="p-1.5 hover:bg-[var(--cl-surface-2)] rounded transition-all hover:scale-110"
											title="View on explorer"
										>
											<ExternalLink className="w-4 h-4 text-[var(--cl-text-2)]" />
										</a>
									</div>
									{copied === "hash" && (
										<p className="text-xs text-[var(--cl-up)] mt-1 animate-in fade-in">
											Copied to clipboard!
										</p>
									)}
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="text-sm text-[var(--cl-text-2)] font-medium">Confirmations</label>
										<div className="flex items-center gap-2 mt-2">
											<CheckCircle2 className="w-5 h-5 text-[var(--cl-up)]" />
											<p className="text-base font-semibold text-[var(--cl-text)]">
												{transaction.blockchain.confirmations}
											</p>
										</div>
									</div>
									{transaction.blockchain.gasUsed && (
										<div>
											<label className="text-sm text-[var(--cl-text-2)] font-medium">Gas Used</label>
											<p className="text-base font-semibold text-[var(--cl-text)] mt-2">
												{transaction.blockchain.gasUsed}
											</p>
										</div>
									)}
								</div>

								{transaction.blockchain.fromAddress && (
									<div>
										<label className="text-sm text-[var(--cl-text-2)] font-medium">From Address</label>
										<div className="flex items-center gap-2 mt-2 p-3 bg-[var(--cl-bg)] rounded-lg">
											<p className="text-sm font-mono text-[var(--cl-text)]">
												{transaction.blockchain.fromAddress}
											</p>
											<button
												onClick={() =>
													handleCopy(transaction.blockchain!.fromAddress!, "from")
												}
												className="p-1.5 hover:bg-[var(--cl-surface-2)] rounded transition-colors"
											>
												<Copy className="w-4 h-4 text-[var(--cl-text-2)]" />
											</button>
										</div>
									</div>
								)}

								{transaction.blockchain.toAddress && (
									<div>
										<label className="text-sm text-[var(--cl-text-2)] font-medium">To Address</label>
										<div className="flex items-center gap-2 mt-2 p-3 bg-[var(--cl-bg)] rounded-lg">
											<p className="text-sm font-mono text-[var(--cl-text)]">
												{transaction.blockchain.toAddress}
											</p>
											<button
												onClick={() => handleCopy(transaction.blockchain!.toAddress!, "to")}
												className="p-1.5 hover:bg-[var(--cl-surface-2)] rounded transition-colors"
											>
												<Copy className="w-4 h-4 text-[var(--cl-text-2)]" />
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Timeline */}
					<div className="bg-[var(--cl-surface)] rounded-lg border border-[var(--cl-line)] p-6">
						<h2 className="text-lg font-semibold text-[var(--cl-text)] mb-6">Timeline</h2>
						<div className="space-y-4">
							<div className="flex items-start gap-4">
								<div className="w-10 h-10 bg-[var(--cl-info-soft)] rounded-full flex items-center justify-center flex-shrink-0">
									<Clock className="w-5 h-5 text-[var(--cl-brand-600)]" />
								</div>
								<div className="flex-1">
									<p className="text-sm font-semibold text-[var(--cl-text)]">Transaction Initiated</p>
									<p className="text-sm text-[var(--cl-text-2)] mt-1">{transaction.timestamps.initiated}</p>
								</div>
							</div>
							{transaction.timestamps.completed && (
								<div className="flex items-start gap-4">
									<div className="w-10 h-10 bg-[var(--cl-up-soft)] rounded-full flex items-center justify-center flex-shrink-0">
										<CheckCircle2 className="w-5 h-5 text-[var(--cl-up)]" />
									</div>
									<div className="flex-1">
										<p className="text-sm font-semibold text-[var(--cl-text)]">Transaction Completed</p>
										<p className="text-sm text-[var(--cl-text-2)] mt-1">
											{transaction.timestamps.completed}
										</p>
									</div>
								</div>
							)}
							{transaction.timestamps.failed && (
								<div className="flex items-start gap-4">
									<div className="w-10 h-10 bg-[var(--cl-down-soft)] rounded-full flex items-center justify-center flex-shrink-0">
										<XCircle className="w-5 h-5 text-[var(--cl-down)]" />
									</div>
									<div className="flex-1">
										<p className="text-sm font-semibold text-[var(--cl-text)]">Transaction Failed</p>
										<p className="text-sm text-[var(--cl-text-2)] mt-1">{transaction.timestamps.failed}</p>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Admin Notes */}
					<div className="bg-[var(--cl-surface)] rounded-lg border border-[var(--cl-line)] p-6">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-lg font-semibold text-[var(--cl-text)]">Admin Notes</h2>
							<button
								onClick={() => setShowNoteModal(true)}
								className="flex items-center gap-2 px-4 py-2 bg-[#014F01] text-white rounded-lg hover:bg-[#013d01] transition-all hover:scale-105 active:scale-95"
							>
								<Plus className="w-4 h-4" />
								Add Note
							</button>
						</div>
						<div className="space-y-3">
							{transaction.adminNotes && transaction.adminNotes.length > 0 ? (
								transaction.adminNotes.map((note, index) => (
									<div
										key={index}
										className="p-4 bg-[var(--cl-bg)] rounded-lg border border-[var(--cl-line)] hover:shadow-sm transition-all"
									>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<p className="text-sm text-[var(--cl-text)]">{note.note}</p>
												<div className="flex items-center gap-2 mt-2 text-xs text-[var(--cl-text-2)]">
													<span className="font-medium">{note.addedBy}</span>
													<span>•</span>
													<span>{note.addedAt}</span>
												</div>
											</div>
											<button className="p-1 hover:bg-[var(--cl-surface-2)] rounded transition-colors">
												<Trash2 className="w-4 h-4 text-[var(--cl-text-3)]" />
											</button>
										</div>
									</div>
								))
							) : (
								<div className="text-center py-8">
									<FileText className="w-12 h-12 text-[var(--cl-text-3)] mx-auto mb-3" />
									<p className="text-sm text-[var(--cl-text-2)]">No admin notes yet</p>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* User Information */}
					<div className="bg-[var(--cl-surface)] rounded-lg border border-[var(--cl-line)] p-6">
						<h2 className="text-lg font-semibold text-[var(--cl-text)] mb-6">User Information</h2>
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 bg-gradient-to-br from-[#014F01] to-[#B8E632] rounded-full flex items-center justify-center text-white font-bold text-lg">
									{transaction.user.name.charAt(0)}
								</div>
								<div>
									<p className="text-base font-semibold text-[var(--cl-text)]">{transaction.user.name}</p>
									<p className="text-sm text-[var(--cl-text-2)]">{transaction.user.email}</p>
								</div>
							</div>

							<div className="pt-4 border-t border-[var(--cl-line)] space-y-3">
								<div className="flex items-center gap-3">
									<Mail className="w-4 h-4 text-[var(--cl-text-3)]" />
									<span className="text-sm text-[var(--cl-text)]">{transaction.user.email}</span>
								</div>
								<div className="flex items-center gap-3">
									<Phone className="w-4 h-4 text-[var(--cl-text-3)]" />
									<span className="text-sm text-[var(--cl-text)]">{transaction.user.phone}</span>
								</div>
								<div className="flex items-center gap-3">
									<Shield className="w-4 h-4 text-[var(--cl-text-3)]" />
									<span
										className={`text-sm font-medium ${
											transaction.user.kycStatus === "Approved"
												? "text-[var(--cl-up)]"
												: transaction.user.kycStatus === "Pending"
												? "text-orange-600"
												: "text-[var(--cl-down)]"
										}`}
									>
										KYC: {transaction.user.kycStatus}
									</span>
								</div>
							</div>

							<button
								onClick={() => router.push(`/admin/users/${transaction.user.id}`)}
								className="w-full mt-4 px-4 py-2 bg-[var(--cl-brand-50)] text-[#014F01] rounded-lg hover:bg-[#d4f0dd] transition-all hover:scale-105 active:scale-95 font-medium"
							>
								View User Profile
							</button>
						</div>
					</div>

					{/* Admin Actions */}
					<div className="bg-[var(--cl-surface)] rounded-lg border border-[var(--cl-line)] p-6">
						<h2 className="text-lg font-semibold text-[var(--cl-text)] mb-6">Admin Actions</h2>
						<div className="space-y-3">
							<button
								onClick={() => setShowRefundModal(true)}
								className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--cl-surface)] border border-[var(--cl-line)] rounded-lg hover:bg-[var(--cl-bg)] transition-all hover:scale-105 active:scale-95 text-left"
							>
								<RefreshCw className="w-5 h-5 text-[var(--cl-text-2)]" />
								<span className="text-sm font-medium text-[var(--cl-text-2)]">Refund Transaction</span>
							</button>
							<button className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--cl-surface)] border border-[var(--cl-line)] rounded-lg hover:bg-[var(--cl-bg)] transition-all hover:scale-105 active:scale-95 text-left">
								<Flag className="w-5 h-5 text-[var(--cl-text-2)]" />
								<span className="text-sm font-medium text-[var(--cl-text-2)]">Flag for Review</span>
							</button>
							<button className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--cl-surface)] border border-orange-200 text-orange-700 rounded-lg hover:bg-orange-50 transition-all hover:scale-105 active:scale-95 text-left">
								<Ban className="w-5 h-5" />
								<span className="text-sm font-medium">Freeze User Wallet</span>
							</button>
							<button className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--cl-surface)] border border-[var(--cl-brand-200)] text-[var(--cl-brand-700)] rounded-lg hover:bg-[var(--cl-info-soft)] transition-all hover:scale-105 active:scale-95 text-left">
								<Mail className="w-5 h-5" />
								<span className="text-sm font-medium">Contact User</span>
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Add Note Modal */}
			{showNoteModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
					<div className="bg-[var(--cl-surface)] rounded-lg max-w-md w-full p-6 animate-in slide-in-from-bottom duration-300">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-lg font-semibold text-[var(--cl-text)]">Add Admin Note</h3>
							<button
								onClick={() => setShowNoteModal(false)}
								className="p-2 hover:bg-[var(--cl-surface-2)] rounded-lg transition-all hover:scale-110 active:scale-90"
							>
								<X className="w-5 h-5 text-[var(--cl-text-3)]" />
							</button>
						</div>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-[var(--cl-text-2)] mb-2">Note</label>
								<textarea
									value={newNote}
									onChange={(e) => setNewNote(e.target.value)}
									className="w-full px-3 py-2 border border-[var(--cl-line)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent"
									rows={4}
									placeholder="Enter admin note..."
								/>
							</div>
						</div>
						<div className="flex items-center gap-3 mt-6">
							<button
								onClick={() => setShowNoteModal(false)}
								className="flex-1 px-4 py-2 bg-[var(--cl-surface)] border border-[var(--cl-line)] text-[var(--cl-text-2)] rounded-lg hover:bg-[var(--cl-bg)] transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={() => {
									// Add note logic here
									setShowNoteModal(false);
									setNewNote("");
								}}
								className="flex-1 px-4 py-2 bg-[#014F01] text-white rounded-lg hover:bg-[#013d01] transition-all hover:scale-105 active:scale-95"
							>
								Add Note
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Refund Modal */}
			{showRefundModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
					<div className="bg-[var(--cl-surface)] rounded-lg max-w-md w-full p-6 animate-in slide-in-from-bottom duration-300">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
								<AlertTriangle className="w-6 h-6 text-orange-600" />
							</div>
							<div>
								<h3 className="text-lg font-semibold text-[var(--cl-text)]">Confirm Refund</h3>
								<p className="text-sm text-[var(--cl-text-2)]">This action cannot be undone</p>
							</div>
						</div>
						<div className="space-y-4">
							<div className="p-4 bg-[var(--cl-bg)] rounded-lg">
								<div className="flex justify-between text-sm mb-2">
									<span className="text-[var(--cl-text-2)]">Transaction ID</span>
									<span className="font-semibold text-[var(--cl-text)]">{transaction.id}</span>
								</div>
								<div className="flex justify-between text-sm mb-2">
									<span className="text-[var(--cl-text-2)]">Amount</span>
									<span className="font-semibold text-[var(--cl-text)]">
										{transaction.currency === "Naira" ? "₦" : "$"}
										{transaction.amount.toLocaleString()}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-[var(--cl-text-2)]">User</span>
									<span className="font-semibold text-[var(--cl-text)]">{transaction.user.name}</span>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-[var(--cl-text-2)] mb-2">
									Reason for Refund
								</label>
								<textarea
									className="w-full px-3 py-2 border border-[var(--cl-line)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent"
									rows={3}
									placeholder="Enter reason for refund..."
								/>
							</div>
						</div>
						<div className="flex items-center gap-3 mt-6">
							<button
								onClick={() => setShowRefundModal(false)}
								className="flex-1 px-4 py-2 bg-[var(--cl-surface)] border border-[var(--cl-line)] text-[var(--cl-text-2)] rounded-lg hover:bg-[var(--cl-bg)] transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={() => {
									// Refund logic here
									setShowRefundModal(false);
								}}
								className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all hover:scale-105 active:scale-95"
							>
								Process Refund
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
