"use client";

import { useParams, useRouter } from "next/navigation";
import {
	ArrowLeft,
	Calendar,
	Filter,
	Copy,
	Download,
	AlertTriangle,
	Shield,
	Clock,
	Monitor,
	MapPin,
	X,
	Check,
	ZoomIn,
	User,
	Mail,
	Phone,
	CheckCircle2,
	CalendarDays,
	TrendingUp
} from "lucide-react";
import { useState } from "react";

interface Transaction {
	id: string;
	type: "Buy" | "Sell";
	amount: number;
	date: string;
	status: "Success" | "Failed" | "Pending";
}

interface SupportTicket {
	id: string;
	subject: string;
	amount: string;
	dateOpened: string;
	status: "Resolved" | "Pending" | "Open";
}

interface AdminNote {
	id: string;
	author: string;
	content: string;
	timestamp: string;
}

const mockTransactions: Transaction[] = [
	{ id: "TX0001220", type: "Buy", amount: 18.99, date: "Wed 1:00pm", status: "Success" },
	{ id: "TX0001221", type: "Sell", amount: 4.50, date: "Wed 7:20am", status: "Success" },
	{ id: "TX0001222", type: "Buy", amount: 88.00, date: "Wed 2:45am", status: "Success" },
	{ id: "TX0001223", type: "Sell", amount: 15.00, date: "Tue 6:10pm", status: "Success" },
	{ id: "TX0001224", type: "Buy", amount: 12.50, date: "Tue 7:52am", status: "Success" },
	{ id: "TX0001225", type: "Buy", amount: 40.20, date: "Tue 12:15pm", status: "Failed" },
	{ id: "TX0001226", type: "Buy", amount: 88.00, date: "Tue 5:40am", status: "Pending" },
];

const mockSupportTickets: SupportTicket[] = [
	{
		id: "ST-1008",
		subject: "Unable to receive USDT",
		amount: "$18.99",
		dateOpened: "July 9, 2025",
		status: "Resolved",
	},
];

const mockAdminNotes: AdminNote[] = [
	{
		id: "1",
		author: "Admin Sarah",
		content: "Flagged once for suspected scam transaction",
		timestamp: "July 8, 2025 - 2:30 PM"
	},
	{
		id: "2",
		author: "Admin John",
		content: "Initial document mismatch, now resolved",
		timestamp: "July 4, 2025 - 10:15 AM"
	},
];

export default function UserDetailPage() {
	const params = useParams();
	const router = useRouter();
	const [showKycModal, setShowKycModal] = useState(false);
	const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
	const [showConfirmModal, setShowConfirmModal] = useState<string | null>(null);
	const [confirmReason, setConfirmReason] = useState("");
	const [showReleaseFundsModal, setShowReleaseFundsModal] = useState(false);

	// Mock user data - in real app, fetch based on params.id
	const user = {
		name: "Jacob Jones",
		email: "jacobjones@gmail.com",
		phone: "+234 802 4489",
		status: "Active",
		kycStatus: "Approved",
		joinDate: "Jan 5, 2025",
		volume: "$3,502,304",
		usdtWallet: "$1,250.44",
		usdtChange: "+ 6.2%",
		nairaWallet: "₦505.0",
		frozenFund: "₦50,000",
		frozenReason: "Suspicious transaction pattern detected",
		frozenDate: "July 10, 2025",
		frozenBy: "Admin Sarah",
		kycDocumentType: "NIN",
		kycIdNumber: "2345-114-21",
		kycUploadDate: "July 5, 2025",
		kycFaceMatch: "Passed",
		riskScore: "Low",
		lastLogin: "2 hours ago",
		deviceInfo: "Chrome on MacOS",
		ipAddress: "197.210.76.45",
		location: "Lagos, Nigeria",
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	const handleAction = (action: string) => {
		setShowConfirmModal(action);
		setConfirmReason("");
	};

	const confirmAction = () => {
		console.log(`Action: ${showConfirmModal}, Reason: ${confirmReason}`);
		setShowConfirmModal(null);
		setConfirmReason("");
	};

	const handleReleaseFunds = () => {
		console.log("Releasing frozen funds");
		setShowReleaseFundsModal(false);
	};

	return (
		<div className="space-y-6">
			{/* Breadcrumb */}
			<div className="flex items-center gap-2 text-sm text-gray-600">
				<button
					onClick={() => router.push("/admin")}
					className="hover:text-gray-900 transition-colors"
				>
					Dashboard
				</button>
				<span>/</span>
				<button
					onClick={() => router.push("/admin/users")}
					className="hover:text-gray-900 transition-colors"
				>
					Users
				</button>
				<span>/</span>
				<span className="text-gray-900 font-medium">Jacob</span>
			</div>

			{/* Header with Back Button and User Info */}
			<div className="flex items-start justify-between">
				<div className="flex items-start gap-4">
					<button
						onClick={() => router.push("/admin/users")}
						className="p-2 hover:bg-[#FAFAFA] rounded-lg transition-colors"
					>
						<ArrowLeft className="w-5 h-5 text-gray-600" />
					</button>
					<div className="flex items-start gap-3">
						<div className="relative">
							<div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
								<User className="w-8 h-8 text-gray-500" />
							</div>
							<div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
								<Check className="w-3 h-3 text-white" strokeWidth={3} />
							</div>
						</div>
						<div>
							<h1 className="text-2xl font-semibold text-gray-900">{user.name}</h1>
							<div className="flex items-center gap-2 mt-1">
								<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
									user.status === "Active"
										? "bg-green-50 text-green-700"
										: "bg-orange-50 text-orange-700"
								}`}>
									<span className={`w-1.5 h-1.5 rounded-full ${
										user.status === "Active" ? "bg-green-600" : "bg-orange-600"
									}`} />
									{user.status}
								</span>
								<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
									user.kycStatus === "Approved"
										? "bg-green-50 text-green-700"
										: user.kycStatus === "Pending"
										? "bg-orange-50 text-orange-700"
										: "bg-red-50 text-red-700"
								}`}>
									<CheckCircle2 className="w-3 h-3" />
									KYC {user.kycStatus}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex items-center gap-3">
					<button
						onClick={() => handleAction("archive")}
						className="px-4 py-2 bg-white border border-[#E9EAEB] text-gray-700 rounded-lg hover:bg-[#FAFAFA] transition-colors"
					>
						Archive
					</button>
					<button
						onClick={() => handleAction("suspend")}
						className="px-4 py-2 bg-white border border-[#E9EAEB] text-gray-700 rounded-lg hover:bg-[#FAFAFA] transition-colors"
					>
						Suspend
					</button>
					<button
						onClick={() => handleAction("reject-kyc")}
						className="px-4 py-2 bg-white border border-[#E9EAEB] text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
					>
						<X className="w-4 h-4" />
						Reject KYC
					</button>
					<button className="px-4 py-2 bg-[#9EE76E] text-gray-900 rounded-lg hover:bg-[#9EE76E]/90 transition-colors flex items-center gap-2">
						<Check className="w-4 h-4" />
						Verify KYC
					</button>
				</div>
			</div>

			{/* Account Health & Risk Score */}
			<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
						<Shield className="w-5 h-5 text-gray-600" />
						Account Health & Security
					</h2>
					<span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
						user.riskScore === "Low"
							? "bg-green-50 text-green-700 border border-green-200"
							: user.riskScore === "Medium"
							? "bg-orange-50 text-orange-700 border border-orange-200"
							: "bg-red-50 text-red-700 border border-red-200"
					}`}>
						<Shield className="w-4 h-4" />
						Risk: {user.riskScore}
					</span>
				</div>

				<div className="grid grid-cols-4 gap-6">
					<div className="flex items-start gap-3">
						<div className="p-2 bg-blue-50 rounded-lg">
							<Clock className="w-5 h-5 text-blue-600" />
						</div>
						<div>
							<p className="text-xs text-gray-600 mb-1">Last Login</p>
							<p className="text-sm font-medium text-gray-900">{user.lastLogin}</p>
						</div>
					</div>
					<div className="flex items-start gap-3">
						<div className="p-2 bg-purple-50 rounded-lg">
							<Monitor className="w-5 h-5 text-purple-600" />
						</div>
						<div>
							<p className="text-xs text-gray-600 mb-1">Device</p>
							<p className="text-sm font-medium text-gray-900">{user.deviceInfo}</p>
						</div>
					</div>
					<div className="flex items-start gap-3">
						<div className="p-2 bg-green-50 rounded-lg">
							<MapPin className="w-5 h-5 text-green-600" />
						</div>
						<div>
							<p className="text-xs text-gray-600 mb-1">Location</p>
							<p className="text-sm font-medium text-gray-900">{user.location}</p>
						</div>
					</div>
					<div className="flex items-start gap-3">
						<div className="p-2 bg-orange-50 rounded-lg">
							<MapPin className="w-5 h-5 text-orange-600" />
						</div>
						<div>
							<p className="text-xs text-gray-600 mb-1">IP Address</p>
							<p className="text-sm font-medium text-gray-900">{user.ipAddress}</p>
						</div>
					</div>
				</div>
			</div>

			{/* User Info Card - Grid Layout */}
			<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h2>
				<div className="grid grid-cols-2 gap-6">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-gray-50 rounded-lg">
							<Mail className="w-5 h-5 text-gray-600" />
						</div>
						<div className="flex-1">
							<p className="text-xs text-gray-600 mb-1">Email Address</p>
							<p className="text-sm font-medium text-gray-900">{user.email}</p>
						</div>
						<button
							onClick={() => copyToClipboard(user.email)}
							className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<Copy className="w-4 h-4 text-gray-400" />
						</button>
					</div>
					<div className="flex items-center gap-3">
						<div className="p-2 bg-gray-50 rounded-lg">
							<Phone className="w-5 h-5 text-gray-600" />
						</div>
						<div className="flex-1">
							<p className="text-xs text-gray-600 mb-1">Phone Number</p>
							<p className="text-sm font-medium text-gray-900">{user.phone}</p>
						</div>
						<button
							onClick={() => copyToClipboard(user.phone)}
							className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<Copy className="w-4 h-4 text-gray-400" />
						</button>
					</div>
					<div className="flex items-center gap-3">
						<div className="p-2 bg-gray-50 rounded-lg">
							<CalendarDays className="w-5 h-5 text-gray-600" />
						</div>
						<div className="flex-1">
							<p className="text-xs text-gray-600 mb-1">Member Since</p>
							<p className="text-sm font-medium text-gray-900">{user.joinDate}</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="p-2 bg-gray-50 rounded-lg">
							<TrendingUp className="w-5 h-5 text-gray-600" />
						</div>
						<div className="flex-1">
							<p className="text-xs text-gray-600 mb-1">Total Volume</p>
							<p className="text-sm font-medium text-gray-900">{user.volume}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Wallets with Frozen Funds Warning */}
			<div className="grid grid-cols-2 gap-6">
				{/* USDT Wallet */}
				<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
					<div className="flex items-center justify-between mb-4">
						<span className="text-sm text-gray-600">USDT Wallet</span>
						<button
							onClick={() => copyToClipboard(user.usdtWallet)}
							className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
							title="Copy balance"
						>
							<Copy className="w-4 h-4 text-gray-400" />
						</button>
					</div>
					<div className="text-3xl font-bold text-gray-900 mb-1">
						{user.usdtWallet}
					</div>
					<div className="text-sm text-green-600 font-medium">{user.usdtChange}</div>
				</div>

				{/* Naira Wallet with Frozen Funds */}
				<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
					<div className="flex items-center justify-between mb-4">
						<span className="text-sm text-gray-600">Naira Wallet</span>
						<button
							onClick={() => copyToClipboard(user.nairaWallet)}
							className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
							title="Copy balance"
						>
							<Copy className="w-4 h-4 text-gray-400" />
						</button>
					</div>
					<div className="text-3xl font-bold text-gray-900 mb-1">
						{user.nairaWallet}
					</div>

					{/* Frozen Funds Warning */}
					<div className="mt-4 pt-4 border-t border-[#E9EAEB]">
						<div className="flex items-center justify-between mb-2">
							<div className="flex items-center gap-2">
								<AlertTriangle className="w-4 h-4 text-orange-600" />
								<span className="text-sm font-medium text-gray-900">Frozen Funds</span>
							</div>
							<span className="text-lg font-bold text-orange-600">{user.frozenFund}</span>
						</div>
						<div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-2">
							<p className="text-xs text-orange-800 mb-1">
								<strong>Reason:</strong> {user.frozenReason}
							</p>
							<p className="text-xs text-orange-700 mb-2">
								Frozen by {user.frozenBy} on {user.frozenDate}
							</p>
							<button
								onClick={() => setShowReleaseFundsModal(true)}
								className="text-xs font-medium text-orange-600 hover:text-orange-700 underline"
							>
								Release Funds
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* KYC Documents with Click to View */}
			<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-6">KYC Documents</h2>
				<div className="grid grid-cols-2 gap-8">
					<div className="space-y-3">
						<div className="flex justify-between items-center py-2 border-b border-gray-100">
							<span className="text-sm text-gray-600">Document Type</span>
							<span className="text-sm font-medium text-gray-900">{user.kycDocumentType}</span>
						</div>
						<div className="flex justify-between items-center py-2 border-b border-gray-100">
							<span className="text-sm text-gray-600">ID Number</span>
							<span className="text-sm font-medium text-gray-900">{user.kycIdNumber}</span>
						</div>
						<div className="flex justify-between items-center py-2 border-b border-gray-100">
							<span className="text-sm text-gray-600">Upload Date</span>
							<span className="text-sm font-medium text-gray-900">{user.kycUploadDate}</span>
						</div>
						<div className="flex justify-between items-center py-2">
							<span className="text-sm text-gray-600">Face Match</span>
							<span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700">
								<Check className="w-4 h-4" />
								{user.kycFaceMatch}
							</span>
						</div>
					</div>
					<div className="flex gap-3">
						<button
							onClick={() => {
								setSelectedDocument("document");
								setShowKycModal(true);
							}}
							className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-[#014F01] transition-all group"
						>
							<div className="w-full h-full flex flex-col items-center justify-center">
								<ZoomIn className="w-6 h-6 text-gray-400 group-hover:text-[#014F01] mb-2" />
								<span className="text-xs text-gray-600 group-hover:text-[#014F01]">View Document</span>
							</div>
						</button>
						<button
							onClick={() => {
								setSelectedDocument("selfie");
								setShowKycModal(true);
							}}
							className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-[#014F01] transition-all group"
						>
							<div className="w-full h-full flex flex-col items-center justify-center">
								<ZoomIn className="w-6 h-6 text-gray-400 group-hover:text-[#014F01] mb-2" />
								<span className="text-xs text-gray-600 group-hover:text-[#014F01]">View Selfie</span>
							</div>
						</button>
					</div>
				</div>
			</div>

			{/* Recent Transactions - Fixed Amount Display */}
			<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
					<div className="flex items-center gap-3">
						<button className="flex items-center gap-2 px-3 py-2 border border-[#E9EAEB] rounded-lg text-sm text-gray-700 hover:bg-[#FAFAFA] transition-colors">
							<Calendar className="w-4 h-4" />
							Select dates
						</button>
						<button className="flex items-center gap-2 px-3 py-2 border border-[#E9EAEB] rounded-lg text-sm text-gray-700 hover:bg-[#FAFAFA] transition-colors">
							<Filter className="w-4 h-4" />
							Apply filter
						</button>
					</div>
				</div>

				{mockTransactions.length > 0 ? (
					<>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-[#E9EAEB]">
										<th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Txn ID</th>
										<th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Type</th>
										<th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Amount</th>
										<th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Date</th>
										<th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Status</th>
										<th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Action</th>
									</tr>
								</thead>
								<tbody>
									{mockTransactions.map((tx, index) => (
										<tr key={index} className="border-b border-[#E9EAEB] last:border-b-0 hover:bg-[#FAFAFA] transition-colors">
											<td className="py-3 px-4 text-sm text-gray-900">{tx.id}</td>
											<td className="py-3 px-4">
												<span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
													tx.type === "Buy"
														? "bg-green-50 text-green-700"
														: "bg-red-50 text-red-700"
												}`}>
													{tx.type}
												</span>
											</td>
											<td className="py-3 px-4">
												<span className={`text-sm font-semibold ${
													tx.type === "Buy"
														? "text-green-600"
														: "text-red-600"
												}`}>
													{tx.type === "Buy" ? "+" : "-"}${tx.amount.toFixed(2)}
												</span>
											</td>
											<td className="py-3 px-4 text-sm text-gray-900">{tx.date}</td>
											<td className="py-3 px-4">
												<span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
													tx.status === 'Success' ? 'text-green-700' :
													tx.status === 'Failed' ? 'text-red-600' :
													'text-orange-600'
												}`}>
													<span className={`w-1.5 h-1.5 rounded-full ${
														tx.status === 'Success' ? 'bg-green-600' :
														tx.status === 'Failed' ? 'bg-red-600' :
														'bg-orange-600'
													}`} />
													{tx.status}
												</span>
											</td>
											<td className="py-3 px-4">
												<button className="text-gray-400 hover:text-gray-600">
													<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 4 16">
														<circle cx="2" cy="2" r="2"/>
														<circle cx="2" cy="8" r="2"/>
														<circle cx="2" cy="14" r="2"/>
													</svg>
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* Pagination */}
						<div className="flex items-center justify-between mt-6 pt-6 border-t border-[#E9EAEB]">
							<button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#FAFAFA] rounded-lg transition-colors">
								<ArrowLeft className="w-4 h-4" />
								Previous
							</button>
							<div className="flex items-center gap-2">
								{[1, 2, 3, "...", 8, 9, 10].map((page, index) => (
									<button
										key={index}
										disabled={page === "..."}
										className={`w-8 h-8 text-sm rounded-lg transition-colors ${
											page === 1
												? "bg-[#E7F6EC] text-[#0D4222] font-medium"
												: "text-gray-700 hover:bg-[#FAFAFA]"
										} ${page === "..." ? "cursor-default" : ""}`}
									>
										{page}
									</button>
								))}
							</div>
							<button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#FAFAFA] rounded-lg transition-colors">
								Next
								<ArrowLeft className="w-4 h-4 rotate-180" />
							</button>
						</div>
					</>
				) : (
					<div className="text-center py-12">
						<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<TrendingUp className="w-8 h-8 text-gray-400" />
						</div>
						<p className="text-gray-600 font-medium mb-2">No transactions yet</p>
						<p className="text-sm text-gray-500">This user hasn't made any transactions</p>
					</div>
				)}
			</div>

			{/* Support Tickets */}
			<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-6">Support Tickets</h2>
				{mockSupportTickets.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-[#E9EAEB]">
									<th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Ticket ID</th>
									<th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Subject</th>
									<th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Amount</th>
									<th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Date Opened</th>
									<th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Status</th>
								</tr>
							</thead>
							<tbody>
								{mockSupportTickets.map((ticket) => (
									<tr key={ticket.id} className="border-b border-[#E9EAEB] last:border-b-0 hover:bg-[#FAFAFA] transition-colors">
										<td className="py-3 px-4 text-sm text-gray-900">{ticket.id}</td>
										<td className="py-3 px-4 text-sm text-gray-900">{ticket.subject}</td>
										<td className="py-3 px-4 text-sm text-gray-900">{ticket.amount}</td>
										<td className="py-3 px-4 text-sm text-gray-900">{ticket.dateOpened}</td>
										<td className="py-3 px-4">
											<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
												ticket.status === "Resolved"
													? "bg-green-50 text-green-700"
													: ticket.status === "Pending"
													? "bg-orange-50 text-orange-700"
													: "bg-blue-50 text-blue-700"
											}`}>
												<span className={`w-1.5 h-1.5 rounded-full ${
													ticket.status === "Resolved" ? "bg-green-600" :
													ticket.status === "Pending" ? "bg-orange-600" : "bg-blue-600"
												}`} />
												{ticket.status}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="text-center py-12">
						<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<AlertTriangle className="w-8 h-8 text-gray-400" />
						</div>
						<p className="text-gray-600 font-medium mb-2">No support tickets</p>
						<p className="text-sm text-gray-500">This user hasn't created any support tickets</p>
					</div>
				)}
			</div>

			{/* Internal Admin Notes - Timeline Format */}
			<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-lg font-semibold text-gray-900">Internal Admin Notes</h2>
					<button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E9EAEB] text-gray-700 rounded-lg hover:bg-[#FAFAFA] transition-colors">
						<span className="text-lg leading-none">+</span>
						Add a note
					</button>
				</div>
				<div className="space-y-4">
					{mockAdminNotes.map((note, index) => (
						<div key={note.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
							<div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
								<span className="text-xs font-medium text-gray-600">
									{note.author.split(' ')[1].charAt(0)}
								</span>
							</div>
							<div className="flex-1">
								<div className="flex items-center justify-between mb-1">
									<span className="text-sm font-medium text-gray-900">{note.author}</span>
									<span className="text-xs text-gray-500">{note.timestamp}</span>
								</div>
								<p className="text-sm text-gray-700">{note.content}</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* KYC Document Modal */}
			{showKycModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-4xl w-full p-6">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-lg font-semibold text-gray-900">
								KYC Document - {selectedDocument === "document" ? "ID Card" : "Selfie"}
							</h3>
							<div className="flex items-center gap-3">
								<button className="flex items-center gap-2 px-3 py-2 border border-[#E9EAEB] rounded-lg text-sm text-gray-700 hover:bg-[#FAFAFA] transition-colors">
									<Download className="w-4 h-4" />
									Download
								</button>
								<button
									onClick={() => setShowKycModal(false)}
									className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
								>
									<X className="w-5 h-5 text-gray-600" />
								</button>
							</div>
						</div>
						<div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
							<div className="text-center">
								<ZoomIn className="w-16 h-16 text-gray-400 mx-auto mb-3" />
								<p className="text-gray-600">KYC Document Preview</p>
								<p className="text-sm text-gray-500 mt-1">Document would be displayed here</p>
							</div>
						</div>
						<div className="flex items-center justify-end gap-3 mt-6">
							<button
								onClick={() => handleAction("reject-kyc")}
								className="px-4 py-2 bg-white border border-[#E9EAEB] text-red-600 rounded-lg hover:bg-red-50 transition-colors"
							>
								Reject Document
							</button>
							<button className="px-4 py-2 bg-[#9EE76E] text-gray-900 rounded-lg hover:bg-[#9EE76E]/90 transition-colors">
								Approve Document
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Confirmation Modal for Actions */}
			{showConfirmModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-md w-full p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
								<AlertTriangle className="w-6 h-6 text-orange-600" />
							</div>
							<div>
								<h3 className="text-lg font-semibold text-gray-900 capitalize">
									Confirm {showConfirmModal.replace("-", " ")}
								</h3>
								<p className="text-sm text-gray-600">This action requires confirmation</p>
							</div>
						</div>
						<div className="mb-6">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Reason (required)
							</label>
							<textarea
								value={confirmReason}
								onChange={(e) => setConfirmReason(e.target.value)}
								className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent"
								rows={3}
								placeholder="Enter reason for this action..."
							/>
						</div>
						<div className="flex items-center gap-3">
							<button
								onClick={() => setShowConfirmModal(null)}
								className="flex-1 px-4 py-2 bg-white border border-[#E9EAEB] text-gray-700 rounded-lg hover:bg-[#FAFAFA] transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={confirmAction}
								disabled={!confirmReason.trim()}
								className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Confirm
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Release Frozen Funds Modal */}
			{showReleaseFundsModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-md w-full p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
								<Check className="w-6 h-6 text-green-600" />
							</div>
							<div>
								<h3 className="text-lg font-semibold text-gray-900">Release Frozen Funds</h3>
								<p className="text-sm text-gray-600">Confirm to release {user.frozenFund}</p>
							</div>
						</div>
						<div className="bg-gray-50 rounded-lg p-4 mb-6">
							<div className="flex justify-between mb-2">
								<span className="text-sm text-gray-600">Amount to release:</span>
								<span className="text-sm font-semibold text-gray-900">{user.frozenFund}</span>
							</div>
							<div className="flex justify-between mb-2">
								<span className="text-sm text-gray-600">Frozen by:</span>
								<span className="text-sm text-gray-900">{user.frozenBy}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-gray-600">Frozen on:</span>
								<span className="text-sm text-gray-900">{user.frozenDate}</span>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<button
								onClick={() => setShowReleaseFundsModal(false)}
								className="flex-1 px-4 py-2 bg-white border border-[#E9EAEB] text-gray-700 rounded-lg hover:bg-[#FAFAFA] transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handleReleaseFunds}
								className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
							>
								Release Funds
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
