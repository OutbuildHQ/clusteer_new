"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, CheckCircle2, XCircle, Flag, FileText, RefreshCw } from "lucide-react";
import { useToast } from "@/components/admin/Toast";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import Modal, { ConfirmModal } from "@/components/admin/Modal";
import Pagination from "@/components/admin/Pagination";
import SearchBar from "@/components/admin/SearchBar";
import BatchActions, { useBatchSelection, SelectCheckbox } from "@/components/admin/BatchActions";
import { exportTableData } from "@/lib/export-utils";
import { getKYCStatusColor } from "@/lib/status-utils";
import { formatDate } from "@/lib/date-utils";

interface KYCSubmission {
	id: string;
	user: {
		id: string;
		name: string;
		email: string;
	};
	phone: string;
	kycStatus: "Approved" | "Pending" | "Rejected";
	riskLevel: "Low" | "Medium" | "High";
	submissionDate: string;
}

const mockKYCSubmissions: KYCSubmission[] = [
	{
		id: "1",
		user: { id: "1", name: "Jacob Jones", email: "jacob@clusteer.com" },
		phone: "+234 4405765",
		kycStatus: "Approved",
		riskLevel: "Low",
		submissionDate: "2025-01-16",
	},
	{
		id: "2",
		user: { id: "2", name: "Marting Rios", email: "marting@clusteer.com" },
		phone: "+234 4405766",
		kycStatus: "Approved",
		riskLevel: "High",
		submissionDate: "2025-01-16",
	},
	{
		id: "3",
		user: { id: "3", name: "Will Copper", email: "will@clusteer.com" },
		phone: "+234 4405767",
		kycStatus: "Approved",
		riskLevel: "Medium",
		submissionDate: "2025-01-15",
	},
	{
		id: "4",
		user: { id: "4", name: "Marco Kelly", email: "marco@clusteer.com" },
		phone: "+234 4405768",
		kycStatus: "Approved",
		riskLevel: "Medium",
		submissionDate: "2025-01-14",
	},
	{
		id: "5",
		user: { id: "5", name: "Alex Morrison", email: "alex@clusteer.com" },
		phone: "+234 4405769",
		kycStatus: "Approved",
		riskLevel: "Low",
		submissionDate: "2025-01-14",
	},
	{
		id: "6",
		user: { id: "6", name: "Mikey Lawrence", email: "mikey@clusteer.com" },
		phone: "+234 4405770",
		kycStatus: "Pending",
		riskLevel: "Low",
		submissionDate: "2025-01-14",
	},
	{
		id: "7",
		user: { id: "7", name: "Freya Browning", email: "freya@clusteer.com" },
		phone: "+234 4405771",
		kycStatus: "Rejected",
		riskLevel: "Low",
		submissionDate: "2025-01-14",
	},
];

export default function KYCPage() {
	const router = useRouter();
	const toast = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedStatus, setSelectedStatus] = useState<string>("All");
	const [selectedRisk, setSelectedRisk] = useState<string>("All");
	const [showFilters, setShowFilters] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [showConfirmModal, setShowConfirmModal] = useState<"approve" | "reject" | null>(null);
	const [rejectReason, setRejectReason] = useState("");

	const {
		selectedIds,
		isSelected,
		toggleSelect,
		toggleSelectAll,
		clearSelection,
		isAllSelected,
		isSomeSelected,
	} = useBatchSelection(mockKYCSubmissions);

	const statusOptions = ["All", "Approved", "Pending", "Rejected"];
	const riskOptions = ["All", "Low", "Medium", "High"];

	// Filter submissions
	const filteredSubmissions = mockKYCSubmissions.filter((submission) => {
		const matchesSearch =
			submission.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			submission.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			submission.phone.includes(searchQuery);

		const matchesStatus = selectedStatus === "All" || submission.kycStatus === selectedStatus;
		const matchesRisk = selectedRisk === "All" || submission.riskLevel === selectedRisk;

		return matchesSearch && matchesStatus && matchesRisk;
	});

	// Pagination
	const totalItems = filteredSubmissions.length;
	const totalPages = Math.ceil(totalItems / pageSize);
	const paginatedSubmissions = filteredSubmissions.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	);

	const selectedPending = filteredSubmissions.filter(
		(s) => selectedIds.includes(s.id) && s.kycStatus === "Pending"
	).length;

	const getRiskColor = (risk: string) => {
		const styles = {
			Low: "bg-green-50 text-green-700 border-green-200",
			Medium: "bg-orange-50 text-orange-700 border-orange-200",
			High: "bg-red-50 text-red-700 border-red-200",
		};
		return styles[risk as keyof typeof styles] || styles.Low;
	};

	const handleExport = (format: 'csv' | 'json' | 'xlsx') => {
		const submissionsToExport = selectedIds.length > 0
			? filteredSubmissions.filter(s => selectedIds.includes(s.id))
			: filteredSubmissions;

		exportTableData({
			filename: `kyc-submissions-${new Date().toISOString().split('T')[0]}`,
			columns: [
				{ key: 'user', label: 'User', format: (val) => val.name },
				{ key: 'user', label: 'Email', format: (val) => val.email },
				{ key: 'phone', label: 'Phone' },
				{ key: 'kycStatus', label: 'KYC Status' },
				{ key: 'riskLevel', label: 'Risk Level' },
				{ key: 'submissionDate', label: 'Submission Date', format: (val) => formatDate(val) },
			],
			data: submissionsToExport,
			format,
		});

		toast.success('Export successful', `Exported ${submissionsToExport.length} submissions to ${format.toUpperCase()}`);
	};

	const handleBulkApprove = async () => {
		setShowConfirmModal("approve");
	};

	const handleBulkReject = async () => {
		setShowConfirmModal("reject");
	};

	const confirmAction = async () => {
		if (showConfirmModal === "reject" && !rejectReason.trim()) {
			toast.error('Reason required', 'Please provide a reason for rejection');
			return;
		}

		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1500));

			console.log(`Bulk ${showConfirmModal} for KYC:`, selectedIds);
			if (showConfirmModal === "reject") {
				console.log("Reason:", rejectReason);
			}

			toast.success(
				`KYC ${showConfirmModal}d`,
				`Successfully ${showConfirmModal}d ${selectedIds.length} submissions`
			);
			setShowConfirmModal(null);
			setRejectReason("");
			clearSelection();
		} catch (error) {
			toast.error('Action failed', 'An error occurred while processing the action');
		} finally {
			setIsLoading(false);
		}
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		setCurrentPage(1);
	};

	const clearFilters = () => {
		setSelectedStatus("All");
		setSelectedRisk("All");
		setShowFilters(false);
		setSearchQuery("");
		setCurrentPage(1);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">KYC & Compliance</h1>
					<p className="text-sm text-gray-500 mt-1">
						Review and manage user verification submissions
					</p>
				</div>
			</div>

			{/* Search and Filters */}
			<div className="bg-white rounded-lg border border-[#E9EAEB] p-4 space-y-4">
				<div className="flex items-center gap-3">
					<div className="flex-1">
						<SearchBar
							value={searchQuery}
							onChange={handleSearch}
							placeholder="Search by name, email, or phone..."
						/>
					</div>
					<button
						onClick={() => setShowFilters(!showFilters)}
						className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors ${
							showFilters || selectedStatus !== "All" || selectedRisk !== "All"
								? "bg-[#E7F6EC] border-[#014F01] text-[#014F01]"
								: "border-[#E9EAEB] hover:bg-gray-50"
						}`}
					>
						Filters
						{(selectedStatus !== "All" || selectedRisk !== "All") && (
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
							<span className="text-sm font-medium text-gray-700">Risk:</span>
							<div className="flex gap-2">
								{riskOptions.map((risk) => (
									<button
										key={risk}
										onClick={() => setSelectedRisk(risk)}
										className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
											selectedRisk === risk
												? "bg-[#014F01] text-white"
												: "bg-white text-gray-600 hover:bg-gray-100"
										}`}
									>
										{risk}
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
						Showing <span className="font-semibold">{filteredSubmissions.length}</span> submissions
					</p>
					{selectedIds.length > 0 && (
						<p className="text-gray-600">
							<span className="font-semibold">{selectedIds.length}</span> selected
							{selectedPending > 0 && ` (${selectedPending} pending)`}
						</p>
					)}
				</div>
			</div>

			{/* Batch Actions */}
			{selectedIds.length > 0 && (
				<BatchActions
					
				selectedIds={selectedIds}
				totalItems={filteredSubmissions?.length ?? 0}
					onClearSelection={clearSelection}
					actions={[
						{

							id: "action-1",

							label: `Approve (${selectedPending})`,
							onExecute: handleBulkApprove,
							variant: "success"
						},
						{

							id: "action-2",

							label: `Reject (${selectedIds.length})`,
							onExecute: handleBulkReject,
							variant: "danger",
						},
						{

							id: "action-3",

							label: "Export Selected",
							onExecute: () => handleExport('csv'),
							variant: "default",
						},
					]}
				/>
			)}

			{/* KYC Table */}
			<div className="bg-white rounded-lg border border-[#E9EAEB]">
				{isLoading ? (
					<div className="py-16">
						<LoadingSpinner size="lg" text="Loading KYC submissions..." />
					</div>
				) : filteredSubmissions.length === 0 ? (
					<div className="text-center py-16">
						<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<FileText className="w-8 h-8 text-gray-400" />
						</div>
						<p className="text-gray-900 font-medium mb-2">No KYC submissions found</p>
						<p className="text-sm text-gray-500 mb-4">
							{searchQuery || selectedStatus !== "All" || selectedRisk !== "All"
								? "Try adjusting your filters"
								: "KYC submissions will appear here"}
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
										User
									</th>
									<th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
										Email
									</th>
									<th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
										Phone No.
									</th>
									<th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
										KYC Status
									</th>
									<th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
										Risk Level
									</th>
									<th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
										Submission Date
									</th>
									<th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
										Action
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-[#E9EAEB]">
								{paginatedSubmissions.map((submission) => (
									<tr
										key={submission.id}
										onClick={(e) => {
											const target = e.target as HTMLElement;
											if (!target.closest('input[type="checkbox"]') && !target.closest('button')) {
												router.push(`/admin/kyc/${submission.id}`);
											}
										}}
										className="hover:bg-gray-50 cursor-pointer transition-colors"
									>
										<td className="px-6 py-4">
											<SelectCheckbox
												checked={isSelected(submission.id)}
												onChange={() => toggleSelect(submission.id)}
											/>
										</td>
										<td className="px-6 py-4">
											<span className="text-sm font-medium text-gray-900">
												{submission.user.name}
											</span>
										</td>
										<td className="px-6 py-4 text-sm text-gray-600">
											{submission.user.email}
										</td>
										<td className="px-6 py-4 text-sm text-gray-600">
											{submission.phone}
										</td>
										<td className="px-6 py-4">
											<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getKYCStatusColor(submission.kycStatus)}`}>
												{submission.kycStatus === "Approved" && <CheckCircle2 className="w-3.5 h-3.5" />}
												{submission.kycStatus === "Rejected" && <XCircle className="w-3.5 h-3.5" />}
												{submission.kycStatus}
											</span>
										</td>
										<td className="px-6 py-4">
											<span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRiskColor(submission.riskLevel)}`}>
												{submission.riskLevel}
											</span>
										</td>
										<td className="px-6 py-4 text-sm text-gray-600">
											{formatDate(submission.submissionDate)}
										</td>
										<td className="px-6 py-4">
											<button
												onClick={() => router.push(`/admin/kyc/${submission.id}`)}
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
				{filteredSubmissions.length > 0 && (
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

			{/* Approve Confirmation Modal */}
			<ConfirmModal
				isOpen={showConfirmModal === "approve"}
				onClose={() => setShowConfirmModal(null)}
				onConfirm={confirmAction}
				title="Approve KYC Submissions"
				message={`Are you sure you want to approve ${selectedPending} pending submission${selectedPending !== 1 ? 's' : ''}? Users will be notified and granted full platform access.`}
				confirmText="Approve"
				variant="info"
				isLoading={isLoading}
			/>

			{/* Reject Confirmation Modal */}
			<ConfirmModal
				isOpen={showConfirmModal === "reject"}
				onClose={() => {
					setShowConfirmModal(null);
					setRejectReason("");
				}}
				onConfirm={confirmAction}
				title="Reject KYC Submissions"
				message={`Are you sure you want to reject ${selectedIds.length} submission${selectedIds.length !== 1 ? 's' : ''}? Please provide a reason for rejection.`}
				confirmText="Reject"
				variant="danger"
				isLoading={isLoading}
			/>
		</div>
	);
}

