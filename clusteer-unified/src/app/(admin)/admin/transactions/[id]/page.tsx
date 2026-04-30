"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
	ChevronRight,
	Mail,
	Copy,
	ExternalLink,
	Lock,
	RotateCcw,
	Flag,
	MessageSquare,
	FileText,
	Download,
	User,
	CheckCircle2,
	Clock,
	AlertTriangle,
	XCircle,
	Shield,
	CreditCard,
	Calendar,
	Hash,
	TrendingUp,
	Eye,
	Plus,
	Check,
} from "lucide-react";

interface TransactionDetail {
	id: string;
	type: "Buy" | "Sell";
	amount: number;
	date: string;
	time: string;
	status: "Success" | "Pending" | "Failed";
	user: {
		id: string;
		name: string;
		email: string;
		accountStatus: "Active" | "Suspended";
		kycStatus: "Approved" | "Pending" | "Rejected";
	};
	counterParty: {
		merchant: string;
		paymentMethod: string;
		uploadDate: string;
		faceMatch: string;
	};
	transactionHash: string;
	fees: number;
	network: string;
	confirmations: number;
	blockNumber: string;
	gasUsed: string;
	riskScore: number;
	notes: Array<{
		date: string;
		note: string;
	}>;
	timeline: Array<{
		event: string;
		timestamp: string;
		status: "completed" | "pending" | "failed";
	}>;
	relatedTransactions: Array<{
		id: string;
		type: string;
		amount: number;
		date: string;
		status: string;
	}>;
}

const mockTransaction: TransactionDetail = {
	id: "TX0001220",
	type: "Buy",
	amount: 250,
	date: "July 18, 2025",
	time: "12:45PM",
	status: "Success",
	user: {
		id: "1",
		name: "Jacob Jones",
		email: "jacobjones@gmail.com",
		accountStatus: "Active",
		kycStatus: "Approved",
	},
	counterParty: {
		merchant: "Clusteer",
		paymentMethod: "Wallet",
		uploadDate: "July 5, 2025",
		faceMatch: "Passed",
	},
	transactionHash: "0x3a5f79f1bc8d4e2a9c7f8b6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f",
	fees: 2.5,
	network: "Ethereum",
	confirmations: 45,
	blockNumber: "18234567",
	gasUsed: "21000",
	riskScore: 15,
	notes: [
		{
			date: "July 8",
			note: "Flagged once for suspected scam transaction",
		},
		{
			date: "July 4",
			note: "Initial document mismatch, now resolved",
		},
	],
	timeline: [
		{
			event: "Transaction created",
			timestamp: "July 18, 2025, 12:30 PM",
			status: "completed",
		},
		{
			event: "Payment confirmed",
			timestamp: "July 18, 2025, 12:40 PM",
			status: "completed",
		},
		{
			event: "USDT released",
			timestamp: "July 18, 2025, 12:45 PM",
			status: "completed",
		},
	],
	relatedTransactions: [
		{
			id: "TX0001215",
			type: "Buy",
			amount: 180,
			date: "July 15, 2025",
			status: "Success",
		},
		{
			id: "TX0001210",
			type: "Sell",
			amount: 90,
			date: "July 12, 2025",
			status: "Success",
		},
		{
			id: "TX0001205",
			type: "Buy",
			amount: 320,
			date: "July 10, 2025",
			status: "Success",
		},
	],
};

export default function TransactionDetailPage() {
	const router = useRouter();
	const params = useParams();
	const transactionId = params.id as string;

	const [showLockModal, setShowLockModal] = useState(false);
	const [showRefundModal, setShowRefundModal] = useState(false);
	const [showFlagModal, setShowFlagModal] = useState(false);
	const [newNote, setNewNote] = useState("");
	const [chatMessage, setChatMessage] = useState("");

	const transaction = mockTransaction;

	const handleCopyHash = () => {
		navigator.clipboard.writeText(transaction.transactionHash);
		// Add toast notification
	};

	const handleCopyTxId = () => {
		navigator.clipboard.writeText(transaction.id);
	};

	const getStatusBadge = (status: string) => {
		const styles = {
			Success: "bg-primary/10 text-primary border-[#0D4222]",
			Pending: "bg-orange-50 text-orange-700 border-orange-700",
			Failed: "bg-danger/10 text-danger border-red-700",
		};
		return styles[status as keyof typeof styles] || styles.Success;
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
				return <CheckCircle2 className="w-5 h-5 text-success" />;
			case "pending":
				return <Clock className="w-5 h-5 text-orange-600" />;
			case "failed":
				return <XCircle className="w-5 h-5 text-danger" />;
			default:
				return null;
		}
	};

	const getRiskScoreColor = (score: number) => {
		if (score < 30) return "text-success bg-success/10";
		if (score < 70) return "text-orange-600 bg-orange-50";
		return "text-danger bg-danger/10";
	};

	return (
		<div className="space-y-6">
			{/* Breadcrumb */}
			<nav className="flex items-center gap-2 text-sm text-muted-foreground">
				<button
					onClick={() => router.push("/admin")}
					className="hover:text-foreground"
				>
					Dashboard
				</button>
				<ChevronRight className="w-4 h-4" />
				<button
					onClick={() => router.push("/admin/transactions")}
					className="hover:text-foreground"
				>
					Transactions
				</button>
				<ChevronRight className="w-4 h-4" />
				<span className="font-medium text-foreground">{transactionId}</span>
			</nav>

			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-foreground">
						Transaction Detail
					</h1>
					<div className="flex items-center gap-3 mt-2">
						<span className="text-sm text-muted-foreground">ID: {transaction.id}</span>
						<button
							onClick={handleCopyTxId}
							className="p-1 hover:bg-muted rounded"
						>
							<Copy className="w-3.5 h-3.5 text-muted-foreground" />
						</button>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<button
						onClick={() => setShowLockModal(true)}
						className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-background transition-colors"
					>
						<Lock className="w-4 h-4" />
						Lock transaction
					</button>
					<button
						onClick={() => setShowRefundModal(true)}
						className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-background transition-colors"
					>
						<RotateCcw className="w-4 h-4" />
						Refund transaction
					</button>
					<button
						onClick={() => setShowFlagModal(true)}
						className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-background transition-colors"
					>
						<Flag className="w-4 h-4" />
						Flag as suspicious
					</button>
					<button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-[#d4f0dd] transition-colors">
						<MessageSquare className="w-4 h-4" />
						Message user
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Column - Main Details */}
				<div className="lg:col-span-2 space-y-6">
					{/* Transaction Overview */}
					<div className="bg-card rounded-lg border border-border p-6">
						<h2 className="text-lg font-semibold text-foreground mb-4">
							Transaction Overview
						</h2>

						<div className="grid grid-cols-2 gap-6">
							{/* Transaction Amount */}
							<div className="p-4 bg-background rounded-lg">
								<label className="text-xs font-medium text-muted-foreground uppercase">
									Transaction Amount
								</label>
								<p className="text-3xl font-bold text-foreground mt-1">
									${transaction.amount}
								</p>
								<span
									className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border mt-2 ${getStatusBadge(
										transaction.status
									)}`}
								>
									{transaction.status === "Success" && (
										<CheckCircle2 className="w-3.5 h-3.5" />
									)}
									{transaction.status === "Pending" && (
										<Clock className="w-3.5 h-3.5" />
									)}
									{transaction.status === "Failed" && (
										<XCircle className="w-3.5 h-3.5" />
									)}
									{transaction.status}
								</span>
							</div>

							{/* Date */}
							<div className="p-4 bg-background rounded-lg">
								<label className="text-xs font-medium text-muted-foreground uppercase">
									Date & Time
								</label>
								<p className="text-lg font-bold text-foreground mt-1">
									{transaction.date}
								</p>
								<p className="text-sm text-muted-foreground">{transaction.time}</p>
							</div>
						</div>

						{/* Transaction Details Grid */}
						<div className="grid grid-cols-2 gap-4 mt-6">
							<div>
								<label className="text-xs font-medium text-muted-foreground uppercase">
									Type
								</label>
								<p className="text-sm font-medium text-foreground mt-1">
									{transaction.type}
								</p>
							</div>
							<div>
								<label className="text-xs font-medium text-muted-foreground uppercase">
									Fees
								</label>
								<p className="text-sm font-medium text-foreground mt-1">
									${transaction.fees}
								</p>
							</div>
							<div>
								<label className="text-xs font-medium text-muted-foreground uppercase">
									Network
								</label>
								<p className="text-sm font-medium text-foreground mt-1">
									{transaction.network}
								</p>
							</div>
							<div>
								<label className="text-xs font-medium text-muted-foreground uppercase">
									Confirmations
								</label>
								<p className="text-sm font-medium text-foreground mt-1">
									{transaction.confirmations}
								</p>
							</div>
							<div>
								<label className="text-xs font-medium text-muted-foreground uppercase">
									Block Number
								</label>
								<p className="text-sm font-medium text-foreground mt-1">
									{transaction.blockNumber}
								</p>
							</div>
							<div>
								<label className="text-xs font-medium text-muted-foreground uppercase">
									Gas Used
								</label>
								<p className="text-sm font-medium text-foreground mt-1">
									{transaction.gasUsed}
								</p>
							</div>
						</div>

						{/* Transaction Hash */}
						<div className="mt-6 p-4 bg-background rounded-lg">
							<div className="flex items-center justify-between mb-2">
								<label className="text-xs font-medium text-muted-foreground uppercase">
									Transaction Hash
								</label>
								<div className="flex items-center gap-2">
									<button
										onClick={handleCopyHash}
										className="p-1.5 hover:bg-muted rounded transition-colors"
										title="Copy hash"
									>
										<Copy className="w-4 h-4 text-muted-foreground" />
									</button>
									<button
										className="p-1.5 hover:bg-muted rounded transition-colors"
										title="View on blockchain explorer"
									>
										<ExternalLink className="w-4 h-4 text-muted-foreground" />
									</button>
								</div>
							</div>
							<p className="text-sm font-mono text-foreground break-all">
								{transaction.transactionHash}
							</p>
						</div>
					</div>

					{/* Counter Party */}
					<div className="bg-card rounded-lg border border-border p-6">
						<h2 className="text-lg font-semibold text-foreground mb-4">
							CounterParty
						</h2>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="text-xs font-medium text-muted-foreground uppercase">
									Merchant
								</label>
								<p className="text-sm font-medium text-foreground mt-1">
									{transaction.counterParty.merchant}
								</p>
							</div>
							<div>
								<label className="text-xs font-medium text-muted-foreground uppercase">
									Payment Method
								</label>
								<p className="text-sm font-medium text-foreground mt-1">
									{transaction.counterParty.paymentMethod}
								</p>
							</div>
							<div>
								<label className="text-xs font-medium text-muted-foreground uppercase">
									Upload Date
								</label>
								<p className="text-sm font-medium text-foreground mt-1">
									{transaction.counterParty.uploadDate}
								</p>
							</div>
							<div>
								<label className="text-xs font-medium text-muted-foreground uppercase">
									Face Match
								</label>
								<p className="text-sm font-medium text-success mt-1 flex items-center gap-1">
									<Check className="w-4 h-4" />
									{transaction.counterParty.faceMatch}
								</p>
							</div>
						</div>
					</div>

					{/* Related Transactions */}
					<div className="bg-card rounded-lg border border-border p-6">
						<h2 className="text-lg font-semibold text-foreground mb-4">
							Related Transactions
						</h2>

						<div className="space-y-3">
							{transaction.relatedTransactions.map((tx) => (
								<div
									key={tx.id}
									onClick={() => router.push(`/admin/transactions/${tx.id}`)}
									className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-background cursor-pointer transition-colors"
								>
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
											<CreditCard className="w-5 h-5 text-muted-foreground" />
										</div>
										<div>
											<p className="text-sm font-medium text-foreground">
												{tx.id}
											</p>
											<p className="text-xs text-muted-foreground">
												{tx.type} • {tx.date}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="text-sm font-semibold text-foreground">
											${tx.amount}
										</p>
										<p className="text-xs text-success">{tx.status}</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Admin Notes */}
					<div className="bg-card rounded-lg border border-border p-6">
						<h2 className="text-lg font-semibold text-foreground mb-4">
							Admin Notes
						</h2>

						<div className="space-y-3 mb-4">
							{transaction.notes.map((note, idx) => (
								<div key={idx} className="flex gap-3 text-sm text-muted-foreground">
									<span className="font-medium text-foreground">{note.date}</span>
									<span>–</span>
									<span>{note.note}</span>
								</div>
							))}
						</div>

						<div className="flex gap-2">
							<input
								type="text"
								placeholder="Add a note..."
								value={newNote}
								onChange={(e) => setNewNote(e.target.value)}
								className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
							/>
							<button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
								Save
							</button>
						</div>
					</div>

					{/* Transaction Timeline */}
					<div className="bg-card rounded-lg border border-border p-6">
						<h2 className="text-lg font-semibold text-foreground mb-4">
							Transaction Timeline
						</h2>

						<div className="space-y-4">
							{transaction.timeline.map((item, idx) => (
								<div key={idx} className="flex gap-4">
									<div className="flex flex-col items-center">
										{getStatusIcon(item.status)}
										{idx < transaction.timeline.length - 1 && (
											<div className="w-0.5 h-12 bg-muted my-2" />
										)}
									</div>
									<div className="flex-1 pb-4">
										<p className="text-sm font-medium text-foreground">
											{item.event}
										</p>
										<p className="text-xs text-muted-foreground mt-1">
											{item.timestamp}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Chats */}
					<div className="bg-card rounded-lg border border-border p-6">
						<h2 className="text-lg font-semibold text-foreground mb-4">Chats</h2>

						<div className="mb-4">
							<p className="text-sm text-muted-foreground">No messages</p>
						</div>

						<div className="flex gap-2">
							<input
								type="text"
								placeholder="Type a message..."
								value={chatMessage}
								onChange={(e) => setChatMessage(e.target.value)}
								className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
							/>
							<button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
								Send
							</button>
						</div>
					</div>
				</div>

				{/* Right Column - User & Stats */}
				<div className="space-y-6">
					{/* User Card */}
					<div className="bg-card rounded-lg border border-border p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
								<User className="w-6 h-6 text-muted-foreground" />
							</div>
							<div className="flex-1">
								<h3 className="text-lg font-semibold text-foreground">
									{transaction.user.name}
								</h3>
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Mail className="w-4 h-4" />
									{transaction.user.email}
								</div>
							</div>
						</div>

						<div className="space-y-3">
							<div>
								<label className="text-xs font-medium text-muted-foreground uppercase">
									Account status
								</label>
								<p
									className={`text-sm font-medium mt-1 ${
										transaction.user.accountStatus === "Active"
											? "text-success"
											: "text-danger"
									}`}
								>
									{transaction.user.accountStatus}
								</p>
							</div>

							<div>
								<label className="text-xs font-medium text-muted-foreground uppercase">
									KYC status
								</label>
								<p
									className={`text-sm font-medium mt-1 ${
										transaction.user.kycStatus === "Approved"
											? "text-success"
											: transaction.user.kycStatus === "Pending"
											? "text-orange-600"
											: "text-danger"
									}`}
								>
									{transaction.user.kycStatus}
								</p>
							</div>
						</div>

						<button
							onClick={() => router.push(`/admin/users/${transaction.user.id}`)}
							className="w-full mt-4 px-4 py-2 border border-border rounded-lg hover:bg-background transition-colors text-sm font-medium"
						>
							View Profile
						</button>
					</div>

					{/* Risk Score */}
					<div className="bg-card rounded-lg border border-border p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-foreground">Risk Score</h3>
							<Shield className="w-5 h-5 text-muted-foreground" />
						</div>

						<div className="flex items-center justify-center mb-4">
							<div
								className={`w-24 h-24 rounded-full flex items-center justify-center ${getRiskScoreColor(
									transaction.riskScore
								)}`}
							>
								<span className="text-3xl font-bold">
									{transaction.riskScore}
								</span>
							</div>
						</div>

						<div className="text-center">
							<p className="text-sm text-muted-foreground">
								{transaction.riskScore < 30
									? "Low Risk"
									: transaction.riskScore < 70
									? "Medium Risk"
									: "High Risk"}
							</p>
							<p className="text-xs text-muted-foreground mt-1">
								Based on transaction patterns and user behavior
							</p>
						</div>
					</div>

					{/* Quick Stats */}
					<div className="bg-card rounded-lg border border-border p-6">
						<h3 className="text-lg font-semibold text-foreground mb-4">
							Quick Stats
						</h3>

						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<TrendingUp className="w-4 h-4 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">User Total Volume</span>
								</div>
								<span className="text-sm font-semibold text-foreground">
									$8,450
								</span>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<CreditCard className="w-4 h-4 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">Total Transactions</span>
								</div>
								<span className="text-sm font-semibold text-foreground">28</span>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Calendar className="w-4 h-4 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">Member Since</span>
								</div>
								<span className="text-sm font-semibold text-foreground">
									Jan 2025
								</span>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">Success Rate</span>
								</div>
								<span className="text-sm font-semibold text-success">
									96.4%
								</span>
							</div>
						</div>
					</div>

					{/* Quick Actions */}
					<div className="bg-card rounded-lg border border-border p-6">
						<h3 className="text-lg font-semibold text-foreground mb-4">
							Quick Actions
						</h3>

						<div className="space-y-2">
							<button className="w-full flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-background transition-colors text-sm">
								<Download className="w-4 h-4" />
								Export PDF
							</button>
							<button className="w-full flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-background transition-colors text-sm">
								<FileText className="w-4 h-4" />
								View Receipt
							</button>
							<button className="w-full flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-background transition-colors text-sm">
								<Eye className="w-4 h-4" />
								View Documents
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Lock Transaction Modal */}
			{showLockModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-card rounded-lg max-w-md w-full p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
								<Lock className="w-6 h-6 text-orange-600" />
							</div>
							<div>
								<h3 className="text-lg font-semibold text-foreground">
									Lock Transaction
								</h3>
								<p className="text-sm text-muted-foreground">
									This will prevent any further actions
								</p>
							</div>
						</div>

						<div className="mb-6">
							<label className="block text-sm font-medium text-muted-foreground mb-2">
								Reason for locking
							</label>
							<textarea
								className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
								rows={3}
								placeholder="Enter reason..."
							/>
						</div>

						<div className="flex gap-3">
							<button
								onClick={() => setShowLockModal(false)}
								className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-background transition-colors"
							>
								Cancel
							</button>
							<button className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
								Lock Transaction
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Refund Modal */}
			{showRefundModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-card rounded-lg max-w-md w-full p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
								<RotateCcw className="w-6 h-6 text-primary" />
							</div>
							<div>
								<h3 className="text-lg font-semibold text-foreground">
									Refund Transaction
								</h3>
								<p className="text-sm text-muted-foreground">
									Process refund for ${transaction.amount}
								</p>
							</div>
						</div>

						<div className="mb-6 space-y-4">
							<div>
								<label className="block text-sm font-medium text-muted-foreground mb-2">
									Refund Amount
								</label>
								<input
									type="number"
									defaultValue={transaction.amount}
									className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-muted-foreground mb-2">
									Reason
								</label>
								<textarea
									className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
									rows={3}
									placeholder="Enter reason for refund..."
								/>
							</div>
						</div>

						<div className="flex gap-3">
							<button
								onClick={() => setShowRefundModal(false)}
								className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-background transition-colors"
							>
								Cancel
							</button>
							<button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
								Process Refund
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Flag Modal */}
			{showFlagModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-card rounded-lg max-w-md w-full p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center">
								<Flag className="w-6 h-6 text-danger" />
							</div>
							<div>
								<h3 className="text-lg font-semibold text-foreground">
									Flag as Suspicious
								</h3>
								<p className="text-sm text-muted-foreground">
									Mark this transaction for review
								</p>
							</div>
						</div>

						<div className="mb-6">
							<label className="block text-sm font-medium text-muted-foreground mb-2">
								Reason for flagging
							</label>
							<select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent mb-3">
								<option>Suspected fraud</option>
								<option>Unusual transaction pattern</option>
								<option>User reported issue</option>
								<option>Payment verification failed</option>
								<option>Other</option>
							</select>
							<textarea
								className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
								rows={3}
								placeholder="Additional details..."
							/>
						</div>

						<div className="flex gap-3">
							<button
								onClick={() => setShowFlagModal(false)}
								className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-background transition-colors"
							>
								Cancel
							</button>
							<button className="flex-1 px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90 transition-colors">
								Flag Transaction
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
