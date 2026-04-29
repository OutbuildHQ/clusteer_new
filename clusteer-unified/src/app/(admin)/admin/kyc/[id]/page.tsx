"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
	ChevronRight,
	Mail,
	Phone,
	CheckCircle2,
	XCircle,
	Flag,
	FileText,
	Download,
	Eye,
	Check,
	X,
	AlertTriangle,
} from "lucide-react";

interface KYCDetail {
	id: string;
	user: {
		id: string;
		name: string;
		email: string;
	};
	phone: string;
	faceMatch: "Pass" | "Fail";
	autoChecks: string;
	status: "Approved" | "Pending" | "Rejected";
	documents: {
		types: string[];
		submissionDate: string;
	};
	complianceNotes: Array<{
		date: string;
		note: string;
	}>;
}

const mockKYCDetail: KYCDetail = {
	id: "1",
	user: {
		id: "1",
		name: "Jacob Jones",
		email: "jacobjones@gmail.com",
	},
	phone: "+234 4405765",
	faceMatch: "Pass",
	autoChecks: "BVN Verified, NIN Valid",
	status: "Pending",
	documents: {
		types: ["NIN", "Passport Photo", "Utility Bill"],
		submissionDate: "July 18, 2025; 12:45PM",
	},
	complianceNotes: [
		{
			date: "July 9",
			note: "NIN verified manually, no risk flagged.",
		},
		{
			date: "July 8",
			note: "Face match auto-pass, awaiting utility bill check.",
		},
	],
};

export default function KYCDetailPage() {
	const router = useRouter();
	const params = useParams();
	const kycId = params.id as string;

	const [showRejectModal, setShowRejectModal] = useState(false);
	const [showApproveModal, setShowApproveModal] = useState(false);
	const [showFlagModal, setShowFlagModal] = useState(false);
	const [newNote, setNewNote] = useState("");
	const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

	const kyc = mockKYCDetail;

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Approved":
				return "text-[var(--cl-up)] bg-[var(--cl-up-soft)]";
			case "Pending":
				return "text-orange-600 bg-orange-50";
			case "Rejected":
				return "text-[var(--cl-down)] bg-[var(--cl-down-soft)]";
			default:
				return "text-[var(--cl-text-2)] bg-[var(--cl-bg)]";
		}
	};

	return (
		<div className="space-y-6">
			{/* Breadcrumb */}
			<nav className="flex items-center gap-2 text-sm text-[var(--cl-text-3)]">
				<button
					onClick={() => router.push("/admin")}
					className="hover:text-[var(--cl-text)]"
				>
					Dashboard
				</button>
				<ChevronRight className="w-4 h-4" />
				<button
					onClick={() => router.push("/admin/kyc")}
					className="hover:text-[var(--cl-text)]"
				>
					KYC
				</button>
				<ChevronRight className="w-4 h-4" />
				<span className="font-medium text-[var(--cl-text)]">KYC {kyc.user.name}</span>
			</nav>

			{/* Header */}
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-[var(--cl-text)]">KYC Detail</h1>

				<div className="flex items-center gap-2">
					<button
						onClick={() => setShowFlagModal(true)}
						className="flex items-center gap-2 px-4 py-2 border border-[var(--cl-line)] rounded-lg hover:bg-[var(--cl-bg)] transition-colors"
					>
						<Flag className="w-4 h-4" />
						Flag risk
					</button>
					<button className="flex items-center gap-2 px-4 py-2 border border-[var(--cl-line)] rounded-lg hover:bg-[var(--cl-bg)] transition-colors">
						<Mail className="w-4 h-4" />
						Add Compliance note
					</button>
					<button
						onClick={() => setShowRejectModal(true)}
						className="flex items-center gap-2 px-4 py-2 border border-[var(--cl-line)] rounded-lg hover:bg-[var(--cl-bg)] transition-colors"
					>
						<XCircle className="w-4 h-4" />
						Reject
					</button>
					<button
						onClick={() => setShowApproveModal(true)}
						className="flex items-center gap-2 px-4 py-2 bg-[var(--cl-brand-50)] text-[#014F01] rounded-lg hover:bg-[#d4f0dd] transition-colors"
					>
						<CheckCircle2 className="w-4 h-4" />
						Approve
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Column - User Info */}
				<div className="space-y-6">
					{/* User Card */}
					<div className="bg-[var(--cl-surface)] rounded-lg border border-[var(--cl-line)] p-6">
						<h2 className="text-2xl font-bold text-[var(--cl-text)] mb-4">
							{kyc.user.name}
						</h2>

						<div className="space-y-4">
							<div className="flex items-center gap-2 text-[var(--cl-text-2)]">
								<Mail className="w-5 h-5" />
								<span className="text-sm">{kyc.user.email}</span>
							</div>

							<div className="pt-4 border-t border-[var(--cl-line)]">
								<label className="text-sm font-medium text-[var(--cl-text-2)]">
									Phone number
								</label>
								<p className="text-base font-medium text-[var(--cl-text)] mt-1">
									{kyc.phone}
								</p>
							</div>

							<div className="pt-4 border-t border-[var(--cl-line)]">
								<label className="text-sm font-medium text-[var(--cl-text-2)]">
									Face match
								</label>
								<div className="flex items-center gap-2 mt-1">
									{kyc.faceMatch === "Pass" ? (
										<Check className="w-5 h-5 text-[var(--cl-up)]" />
									) : (
										<X className="w-5 h-5 text-[var(--cl-down)]" />
									)}
									<span
										className={`text-base font-medium ${
											kyc.faceMatch === "Pass"
												? "text-[var(--cl-up)]"
												: "text-[var(--cl-down)]"
										}`}
									>
										{kyc.faceMatch}
									</span>
								</div>
							</div>

							<div className="pt-4 border-t border-[var(--cl-line)]">
								<label className="text-sm font-medium text-[var(--cl-text-2)]">
									Auto-checks
								</label>
								<p className="text-base font-medium text-[var(--cl-text)] mt-1">
									{kyc.autoChecks}
								</p>
							</div>

							<div className="pt-4 border-t border-[var(--cl-line)]">
								<label className="text-sm font-medium text-[var(--cl-text-2)]">
									Status
								</label>
								<p
									className={`text-base font-medium mt-1 ${
										kyc.status === "Approved"
											? "text-[var(--cl-up)]"
											: kyc.status === "Pending"
											? "text-orange-600"
											: "text-[var(--cl-down)]"
									}`}
								>
									{kyc.status}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Right Column - Documents & Notes */}
				<div className="lg:col-span-2 space-y-6">
					{/* Documents Section */}
					<div className="bg-[var(--cl-surface)] rounded-lg border border-[var(--cl-line)] p-6">
						<div className="mb-6">
							<h2 className="text-lg font-semibold text-[var(--cl-text)]">
								KYC Documents
							</h2>
							<p className="text-sm text-[var(--cl-text-2)] mt-1">
								{kyc.documents.types.join(", ")}
							</p>
						</div>

						<div className="mb-6">
							<label className="text-sm font-medium text-[var(--cl-text-2)]">
								Submission Date
							</label>
							<p className="text-base text-[var(--cl-text)] mt-1">
								{kyc.documents.submissionDate}
							</p>
						</div>

						{/* Document Cards */}
						<div className="grid grid-cols-3 gap-4">
							{kyc.documents.types.map((docType, idx) => (
								<button
									key={idx}
									onClick={() => setSelectedDocument(docType)}
									className="flex flex-col items-center justify-center p-6 border-2 border-[var(--cl-line)] rounded-lg hover:border-[#014F01] hover:bg-[var(--cl-bg)] transition-all group"
								>
									{docType === "NIN" && (
										<div className="w-16 h-16 bg-[var(--cl-surface-2)] rounded-lg flex items-center justify-center mb-3 group-hover:bg-[var(--cl-brand-50)] transition-colors">
											<FileText className="w-8 h-8 text-[var(--cl-text-2)] group-hover:text-[#014F01]" />
										</div>
									)}
									{docType === "Passport Photo" && (
										<div className="w-16 h-16 bg-[var(--cl-surface-2)] rounded-full flex items-center justify-center mb-3 group-hover:bg-[var(--cl-brand-50)] transition-colors overflow-hidden">
											<div className="w-12 h-12 bg-[var(--cl-surface-3)] rounded-full" />
										</div>
									)}
									{docType === "Utility Bill" && (
										<div className="w-16 h-16 bg-[var(--cl-surface-2)] rounded-lg flex items-center justify-center mb-3 group-hover:bg-[var(--cl-brand-50)] transition-colors">
											<FileText className="w-8 h-8 text-[var(--cl-text-2)] group-hover:text-[#014F01]" />
										</div>
									)}
									<p className="text-sm font-medium text-[var(--cl-text)] text-center">
										{docType}
									</p>
								</button>
							))}
						</div>

						{/* Quick Actions */}
						<div className="flex gap-3 mt-6 pt-6 border-t border-[var(--cl-line)]">
							<button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-[var(--cl-line)] rounded-lg hover:bg-[var(--cl-bg)] transition-colors">
								<Eye className="w-4 h-4" />
								View All
							</button>
							<button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-[var(--cl-line)] rounded-lg hover:bg-[var(--cl-bg)] transition-colors">
								<Download className="w-4 h-4" />
								Download ZIP
							</button>
						</div>
					</div>

					{/* Compliance Note History */}
					<div className="bg-[var(--cl-surface)] rounded-lg border border-[var(--cl-line)] p-6">
						<h2 className="text-lg font-semibold text-[var(--cl-text)] mb-4">
							Compliance Note History
						</h2>

						<div className="space-y-3 mb-6">
							{kyc.complianceNotes.map((note, idx) => (
								<div key={idx} className="flex gap-3 text-sm">
									<span className="font-medium text-[var(--cl-text)] min-w-[60px]">
										{note.date}
									</span>
									<span className="text-[var(--cl-text-2)]">–</span>
									<span className="text-[var(--cl-text-2)] flex-1">{note.note}</span>
								</div>
							))}
						</div>

						<div className="flex gap-2">
							<input
								type="text"
								placeholder="Add a note..."
								value={newNote}
								onChange={(e) => setNewNote(e.target.value)}
								className="flex-1 px-4 py-2 border border-[var(--cl-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent"
							/>
							<button className="px-6 py-2 bg-[#014F01] text-white rounded-lg hover:bg-[#013d01] transition-colors">
								Save
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Document Viewer Modal */}
			{selectedDocument && (
				<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
					<div className="bg-[var(--cl-surface)] rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-bold text-[var(--cl-text)]">
								{selectedDocument}
							</h2>
							<button
								onClick={() => setSelectedDocument(null)}
								className="p-2 hover:bg-[var(--cl-surface-2)] rounded-lg transition-colors"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						{/* Document Preview */}
						<div className="aspect-[3/4] bg-[var(--cl-surface-2)] rounded-lg flex items-center justify-center mb-4">
							<div className="text-center">
								<FileText className="w-24 h-24 text-[var(--cl-text-3)] mx-auto mb-4" />
								<p className="text-[var(--cl-text-2)]">Document Preview</p>
								<p className="text-sm text-[var(--cl-text-3)] mt-1">
									{selectedDocument} - View or download
								</p>
							</div>
						</div>

						{/* Actions */}
						<div className="flex gap-3">
							<button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#014F01] text-white rounded-lg hover:bg-[#013d01] transition-colors">
								<Download className="w-4 h-4" />
								Download
							</button>
							<button
								onClick={() => setSelectedDocument(null)}
								className="flex-1 px-4 py-2.5 border border-[var(--cl-line)] text-[var(--cl-text-2)] rounded-lg hover:bg-[var(--cl-bg)] transition-colors"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Approve Modal */}
			{showApproveModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-[var(--cl-surface)] rounded-lg max-w-md w-full p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-12 h-12 bg-[var(--cl-up-soft)] rounded-full flex items-center justify-center">
								<CheckCircle2 className="w-6 h-6 text-[var(--cl-up)]" />
							</div>
							<div>
								<h3 className="text-lg font-semibold text-[var(--cl-text)]">
									Approve KYC
								</h3>
								<p className="text-sm text-[var(--cl-text-3)]">
									Confirm approval for {kyc.user.name}
								</p>
							</div>
						</div>

						<div className="mb-6">
							<label className="block text-sm font-medium text-[var(--cl-text-2)] mb-2">
								Add approval note (optional)
							</label>
							<textarea
								className="w-full px-4 py-2 border border-[var(--cl-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent"
								rows={3}
								placeholder="Enter any notes..."
							/>
						</div>

						<div className="flex gap-3">
							<button
								onClick={() => setShowApproveModal(false)}
								className="flex-1 px-4 py-2 border border-[var(--cl-line)] rounded-lg hover:bg-[var(--cl-bg)] transition-colors"
							>
								Cancel
							</button>
							<button className="flex-1 px-4 py-2 bg-[var(--cl-up)] text-white rounded-lg hover:bg-[var(--cl-up)]/90 transition-colors">
								Approve KYC
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Reject Modal */}
			{showRejectModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-[var(--cl-surface)] rounded-lg max-w-md w-full p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-12 h-12 bg-[var(--cl-down-soft)] rounded-full flex items-center justify-center">
								<XCircle className="w-6 h-6 text-[var(--cl-down)]" />
							</div>
							<div>
								<h3 className="text-lg font-semibold text-[var(--cl-text)]">
									Reject KYC
								</h3>
								<p className="text-sm text-[var(--cl-text-3)]">
									Provide reason for rejection
								</p>
							</div>
						</div>

						<div className="mb-6">
							<label className="block text-sm font-medium text-[var(--cl-text-2)] mb-2">
								Rejection reason
							</label>
							<select className="w-full px-4 py-2 border border-[var(--cl-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent mb-3">
								<option>Document not clear</option>
								<option>Information mismatch</option>
								<option>Expired document</option>
								<option>Suspected fraud</option>
								<option>Other</option>
							</select>
							<textarea
								className="w-full px-4 py-2 border border-[var(--cl-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent"
								rows={3}
								placeholder="Additional details..."
							/>
						</div>

						<div className="flex gap-3">
							<button
								onClick={() => setShowRejectModal(false)}
								className="flex-1 px-4 py-2 border border-[var(--cl-line)] rounded-lg hover:bg-[var(--cl-bg)] transition-colors"
							>
								Cancel
							</button>
							<button className="flex-1 px-4 py-2 bg-[var(--cl-down)] text-white rounded-lg hover:bg-[var(--cl-down)]/90 transition-colors">
								Reject KYC
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Flag Modal */}
			{showFlagModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-[var(--cl-surface)] rounded-lg max-w-md w-full p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
								<Flag className="w-6 h-6 text-orange-600" />
							</div>
							<div>
								<h3 className="text-lg font-semibold text-[var(--cl-text)]">
									Flag Risk Level
								</h3>
								<p className="text-sm text-[var(--cl-text-3)]">
									Update risk assessment
								</p>
							</div>
						</div>

						<div className="mb-6">
							<label className="block text-sm font-medium text-[var(--cl-text-2)] mb-2">
								Risk level
							</label>
							<select className="w-full px-4 py-2 border border-[var(--cl-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent mb-3">
								<option>Low</option>
								<option>Medium</option>
								<option>High</option>
							</select>
							<textarea
								className="w-full px-4 py-2 border border-[var(--cl-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent"
								rows={3}
								placeholder="Reason for flagging..."
							/>
						</div>

						<div className="flex gap-3">
							<button
								onClick={() => setShowFlagModal(false)}
								className="flex-1 px-4 py-2 border border-[var(--cl-line)] rounded-lg hover:bg-[var(--cl-bg)] transition-colors"
							>
								Cancel
							</button>
							<button className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
								Update Risk
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
