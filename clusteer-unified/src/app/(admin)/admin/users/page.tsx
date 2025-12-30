"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, MoreVertical, RefreshCw, User, Phone, Mail, Lock, Shuffle } from "lucide-react";
import { useToast } from "@/components/admin/Toast";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import Modal, { ConfirmModal } from "@/components/admin/Modal";
import Pagination from "@/components/admin/Pagination";
import SearchBar from "@/components/admin/SearchBar";
import BatchActions, { useBatchSelection, SelectCheckbox } from "@/components/admin/BatchActions";
import { exportTableData } from "@/lib/export-utils";
import { getKYCStatusColor, getStatusColor } from "@/lib/status-utils";
import { formatDate } from "@/lib/date-utils";

interface User {
	id: string;
	name: string;
	email: string;
	phone: string;
	kycStatus: "Approved" | "Pending" | "Rejected";
	accountStatus: "Active" | "Suspended";
	dateJoined: string;
}

const mockUsers: User[] = [
	{
		id: "1",
		name: "Jacob Jones",
		email: "jacob@clusteer.com",
		phone: "+234 4405765",
		kycStatus: "Approved",
		accountStatus: "Active",
		dateJoined: "2025-01-16",
	},
	{
		id: "2",
		name: "Marting Rios",
		email: "marting@clusteer.com",
		phone: "+234 4405766",
		kycStatus: "Approved",
		accountStatus: "Active",
		dateJoined: "2025-01-16",
	},
	{
		id: "3",
		name: "Will Copper",
		email: "will@clusteer.com",
		phone: "+234 4405767",
		kycStatus: "Approved",
		accountStatus: "Active",
		dateJoined: "2025-01-15",
	},
	{
		id: "4",
		name: "Marco Kelly",
		email: "marco@clusteer.com",
		phone: "+234 4405768",
		kycStatus: "Approved",
		accountStatus: "Active",
		dateJoined: "2025-01-14",
	},
	{
		id: "5",
		name: "Alex Morrison",
		email: "alex@clusteer.com",
		phone: "+234 4405769",
		kycStatus: "Approved",
		accountStatus: "Suspended",
		dateJoined: "2025-01-14",
	},
	{
		id: "6",
		name: "Mikey Lawrence",
		email: "mikey@clusteer.com",
		phone: "+234 4405770",
		kycStatus: "Pending",
		accountStatus: "Active",
		dateJoined: "2025-01-14",
	},
	{
		id: "7",
		name: "Freya Browning",
		email: "freya@clusteer.com",
		phone: "+234 4405771",
		kycStatus: "Rejected",
		accountStatus: "Active",
		dateJoined: "2025-01-14",
	},
];

export default function UsersPage() {
	const router = useRouter();
	const toast = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [kycFilter, setKycFilter] = useState<string>("all");
	const [accountFilter, setAccountFilter] = useState<string>("all");
	const [showFilters, setShowFilters] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState<string | null>(null);
	const [confirmReason, setConfirmReason] = useState("");
	const [showAddUserModal, setShowAddUserModal] = useState(false);
	const [newUser, setNewUser] = useState({
		name: "",
		email: "",
		phone: "",
		password: "",
		sendWelcomeEmail: true,
	});

	const {
		selectedIds,
		isSelected,
		toggleSelect,
		toggleSelectAll,
		clearSelection,
		isAllSelected,
		isSomeSelected,
	} = useBatchSelection(mockUsers);

	// Filter users based on search and filters
	const filteredUsers = mockUsers.filter((user) => {
		const matchesSearch =
			user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.phone.includes(searchQuery);

		const matchesKyc = kycFilter === "all" || user.kycStatus === kycFilter;
		const matchesAccount = accountFilter === "all" || user.accountStatus === accountFilter;

		return matchesSearch && matchesKyc && matchesAccount;
	});

	// Pagination
	const totalItems = filteredUsers.length;
	const totalPages = Math.ceil(totalItems / pageSize);
	const paginatedUsers = filteredUsers.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	);

	const handleExport = (format: 'csv' | 'json' | 'xlsx') => {
		const usersToExport = selectedIds.length > 0
			? filteredUsers.filter(u => selectedIds.includes(u.id))
			: filteredUsers;

		exportTableData({
			filename: `users-export-${new Date().toISOString().split('T')[0]}`,
			columns: [
				{ key: 'name', label: 'Name' },
				{ key: 'email', label: 'Email' },
				{ key: 'phone', label: 'Phone' },
				{ key: 'kycStatus', label: 'KYC Status' },
				{ key: 'accountStatus', label: 'Account Status' },
				{ key: 'dateJoined', label: 'Date Joined', format: (val) => formatDate(val) },
			],
			data: usersToExport,
			format,
		});

		toast.success('Export successful', `Exported ${usersToExport.length} users to ${format.toUpperCase()}`);
	};

	const handleBulkAction = async (action: string) => {
		setShowConfirmModal(action);
	};

	const confirmAction = async () => {
		if (!confirmReason.trim()) {
			toast.error('Reason required', 'Please provide a reason for this action');
			return;
		}

		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1500));

			console.log(`Bulk ${showConfirmModal} for users:`, selectedIds);
			console.log("Reason:", confirmReason);

			toast.success(`Action completed`, `Successfully ${showConfirmModal}ed ${selectedIds.length} users`);
			setShowConfirmModal(null);
			setConfirmReason("");
			clearSelection();
		} catch (error) {
			toast.error('Action failed', 'An error occurred while processing the action');
		} finally {
			setIsLoading(false);
		}
	};

	const generatePassword = () => {
		const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*";
		let password = "";
		for (let i = 0; i < 16; i++) {
			password += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		setNewUser({ ...newUser, password });
	};

	const handleAddUser = async () => {
		if (!newUser.name.trim() || !newUser.email.trim() || !newUser.phone.trim() || !newUser.password.trim()) {
			toast.error('Validation error', 'Please fill in all required fields');
			return;
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(newUser.email)) {
			toast.error('Invalid email', 'Please enter a valid email address');
			return;
		}

		// Phone validation (basic)
		const phoneRegex = /^\+?[\d\s-()]+$/;
		if (!phoneRegex.test(newUser.phone)) {
			toast.error('Invalid phone', 'Please enter a valid phone number');
			return;
		}

		// Password strength check
		if (newUser.password.length < 8) {
			toast.error('Weak password', 'Password must be at least 8 characters long');
			return;
		}

		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1500));

			console.log("Creating new user:", {
				...newUser,
				password: "***hidden***",
			});

			// TODO: Send to backend API
			// await fetch('/api/admin/users', { method: 'POST', body: JSON.stringify(newUser) })

			// Reset form
			setNewUser({
				name: "",
				email: "",
				phone: "",
				password: "",
				sendWelcomeEmail: true,
			});
			setShowAddUserModal(false);

			toast.success('User created', 'The user account has been created successfully');
		} catch (error) {
			toast.error('Creation failed', 'An error occurred while creating the user');
		} finally {
			setIsLoading(false);
		}
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		setCurrentPage(1); // Reset to first page on search
	};

	const clearFilters = () => {
		setKycFilter("all");
		setAccountFilter("all");
		setShowFilters(false);
		setSearchQuery("");
		setCurrentPage(1);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-gray-900">Users</h1>
					<p className="text-sm text-gray-600 mt-1">
						{filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
						{selectedIds.length > 0 && ` (${selectedIds.length} selected)`}
					</p>
				</div>
				<button
					onClick={() => setShowAddUserModal(true)}
					className="flex items-center gap-2 px-4 py-2 bg-[#014F01] text-white rounded-lg hover:bg-[#013d01] transition-colors shadow-sm"
				>
					<UserPlus className="w-4 h-4" style={{ color: 'white', stroke: 'white' }} />
					Add user
				</button>
			</div>

			{/* Search and Filters */}
			<div className="bg-white rounded-lg border border-[#E9EAEB] p-4">
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
						className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
							showFilters || kycFilter !== "all" || accountFilter !== "all"
								? "bg-[#E7F6EC] border-[#014F01] text-[#014F01]"
								: "bg-white border-[#E9EAEB] text-gray-900 hover:bg-[#FAFAFA]"
						}`}
					>
						Filters
						{(kycFilter !== "all" || accountFilter !== "all") && (
							<span className="w-2 h-2 bg-[#014F01] rounded-full"></span>
						)}
					</button>
				</div>

				{/* Filter Dropdowns */}
				{showFilters && (
					<div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#E9EAEB]">
						<div className="flex-1">
							<label className="block text-xs font-medium text-gray-600 mb-2">KYC Status</label>
							<select
								value={kycFilter}
								onChange={(e) => setKycFilter(e.target.value)}
								className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent"
							>
								<option value="all">All KYC Status</option>
								<option value="Approved">Approved</option>
								<option value="Pending">Pending</option>
								<option value="Rejected">Rejected</option>
							</select>
						</div>

						<div className="flex-1">
							<label className="block text-xs font-medium text-gray-600 mb-2">Account Status</label>
							<select
								value={accountFilter}
								onChange={(e) => setAccountFilter(e.target.value)}
								className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent"
							>
								<option value="all">All Account Status</option>
								<option value="Active">Active</option>
								<option value="Suspended">Suspended</option>
							</select>
						</div>

						<div className="pt-6">
							<button
								onClick={clearFilters}
								className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
							>
								Clear filters
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Batch Actions */}
			{selectedIds.length > 0 && (
				<BatchActions
					
				selectedIds={selectedIds}
				totalItems={filteredUsers?.length ?? 0}
					onClearSelection={clearSelection}
					actions={[
						{

							id: "action-1",

							label: "Suspend",
							onExecute: () => handleBulkAction("suspend"),
							variant: "warning",
						},
						{

							id: "action-2",

							label: "Flag for Review",
							onExecute: () => handleBulkAction("flag"),
							variant: "default",
						},
						{

							id: "action-3",

							label: "Send Email",
							onExecute: () => handleBulkAction("email"),
							variant: "default",
						},
						{

							id: "action-4",

							label: "Export Selected",
							onExecute: () => handleExport('csv'),
							variant: "success",
						},
					]}
				/>
			)}

			{/* Users Table */}
			<div className="bg-white rounded-lg border border-[#E9EAEB]">
				{isLoading ? (
					<div className="py-16">
						<LoadingSpinner size="lg" text="Loading users..." />
					</div>
				) : filteredUsers.length === 0 ? (
					<div className="text-center py-16">
						<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<User className="w-8 h-8 text-gray-400" />
						</div>
						<p className="text-gray-900 font-medium mb-2">No users found</p>
						<p className="text-sm text-gray-500 mb-4">
							Try adjusting your search or filters
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
							<thead>
								<tr className="border-b border-[#E9EAEB]">
									<th className="text-left py-4 px-6">
										<SelectCheckbox
											checked={isAllSelected}
											indeterminate={isSomeSelected}
											onChange={toggleSelectAll}
										/>
									</th>
									<th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
										Users
									</th>
									<th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
										Email
									</th>
									<th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
										Phone No.
									</th>
									<th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
										KYC Status
									</th>
									<th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
										Account Status
									</th>
									<th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
										Date Joined
									</th>
									<th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
										Action
									</th>
								</tr>
							</thead>
							<tbody>
								{paginatedUsers.map((user) => (
									<tr
										key={user.id}
										onClick={(e) => {
											const target = e.target as HTMLElement;
											if (!target.closest('input[type="checkbox"]') && !target.closest('button')) {
												router.push(`/admin/users/${user.id}`);
											}
										}}
										className="border-b border-[#E9EAEB] last:border-b-0 hover:bg-[#FAFAFA] transition-colors cursor-pointer"
									>
										<td className="py-4 px-6">
											<SelectCheckbox
												checked={isSelected(user.id)}
												onChange={() => toggleSelect(user.id)}
											/>
										</td>
										<td className="py-4 px-6">
											<span className="text-sm font-medium text-gray-900">
												{user.name}
											</span>
										</td>
										<td className="py-4 px-6">
											<span className="text-sm text-gray-600">{user.email}</span>
										</td>
										<td className="py-4 px-6">
											<span className="text-sm text-gray-600">{user.phone}</span>
										</td>
										<td className="py-4 px-6">
											<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getKYCStatusColor(user.kycStatus)}`}>
												{user.kycStatus}
											</span>
										</td>
										<td className="py-4 px-6">
											<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.accountStatus)}`}>
												<span className={`w-1.5 h-1.5 rounded-full ${user.accountStatus === "Active" ? "bg-green-600" : "bg-orange-600"}`} />
												{user.accountStatus}
											</span>
										</td>
										<td className="py-4 px-6">
											<span className="text-sm text-gray-600">
												{formatDate(user.dateJoined)}
											</span>
										</td>
										<td className="py-4 px-6">
											<div className="relative">
												<button
													onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
													className="p-1 hover:bg-gray-100 rounded transition-colors"
												>
													<MoreVertical className="w-4 h-4 text-gray-600" />
												</button>

												{showActionMenu === user.id && (
													<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#E9EAEB] py-1 z-10">
														<button
															onClick={() => router.push(`/admin/users/${user.id}`)}
															className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#FAFAFA] transition-colors"
														>
															View Details
														</button>
														<button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#FAFAFA] transition-colors">
															View Transactions
														</button>
														<button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#FAFAFA] transition-colors">
															View KYC Documents
														</button>
														<div className="border-t border-[#E9EAEB] my-1" />
														<button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#FAFAFA] transition-colors">
															Suspend Account
														</button>
														<button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#FAFAFA] transition-colors">
															Freeze Transactions
														</button>
														<button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#FAFAFA] transition-colors">
															Flag for Review
														</button>
														<div className="border-t border-[#E9EAEB] my-1" />
														<button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#FAFAFA] transition-colors">
															Send Notification
														</button>
														<button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#FAFAFA] transition-colors">
															Reset Password
														</button>
														<div className="border-t border-[#E9EAEB] my-1" />
														<button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
															Ban User
														</button>
													</div>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{/* Pagination */}
				{filteredUsers.length > 0 && (
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

			{/* Add User Modal */}
			<Modal
				isOpen={showAddUserModal}
				onClose={() => setShowAddUserModal(false)}
				title="Add New User"
				description="Create a new user account"
				size="lg"
				footer={
					<div className="flex items-center gap-3">
						<button
							onClick={() => {
								setShowAddUserModal(false);
								setNewUser({
									name: "",
									email: "",
									phone: "",
									password: "",
									sendWelcomeEmail: true,
								});
							}}
							className="flex-1 px-4 py-2.5 bg-white border border-[#E9EAEB] text-gray-700 rounded-lg hover:bg-[#FAFAFA] transition-colors font-medium"
							disabled={isLoading}
						>
							Cancel
						</button>
						<button
							onClick={handleAddUser}
							className="flex-1 px-4 py-2.5 bg-[#014F01] text-white rounded-lg hover:bg-[#013d01] transition-colors font-medium shadow-sm"
							disabled={isLoading}
						>
							{isLoading ? 'Creating...' : 'Create User'}
						</button>
					</div>
				}
			>
				<div className="space-y-4">
					{/* Full Name */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Full Name <span className="text-red-600">*</span>
						</label>
						<div className="relative">
							<User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
							<input
								type="text"
								value={newUser.name}
								onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
								placeholder="John Doe"
								className="w-full pl-10 pr-4 py-2.5 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent"
							/>
						</div>
					</div>

					{/* Email */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Email Address <span className="text-red-600">*</span>
						</label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
							<input
								type="email"
								value={newUser.email}
								onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
								placeholder="john@example.com"
								className="w-full pl-10 pr-4 py-2.5 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent"
							/>
						</div>
					</div>

					{/* Phone */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Phone Number <span className="text-red-600">*</span>
						</label>
						<div className="relative">
							<Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
							<input
								type="tel"
								value={newUser.phone}
								onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
								placeholder="+234 XXX XXX XXXX"
								className="w-full pl-10 pr-4 py-2.5 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent"
							/>
						</div>
					</div>

					{/* Password */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Password <span className="text-red-600">*</span>
						</label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
							<input
								type="text"
								value={newUser.password}
								onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
								placeholder="Enter secure password"
								className="w-full pl-10 pr-24 py-2.5 border border-[#E9EAEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#014F01] focus:border-transparent font-mono"
							/>
							<button
								type="button"
								onClick={generatePassword}
								className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-3 py-1 bg-[#E7F6EC] text-[#014F01] rounded text-xs font-medium hover:bg-[#d4f0dd] transition-colors"
							>
								<Shuffle className="w-3 h-3" />
								Generate
							</button>
						</div>
						<p className="text-xs text-gray-500 mt-1">
							Minimum 8 characters. Use letters, numbers, and symbols.
						</p>
					</div>

					{/* Send Welcome Email */}
					<div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
						<input
							type="checkbox"
							id="sendWelcomeEmail"
							checked={newUser.sendWelcomeEmail}
							onChange={(e) => setNewUser({ ...newUser, sendWelcomeEmail: e.target.checked })}
							className="w-4 h-4 rounded border-gray-300 text-[#014F01] focus:ring-[#014F01]"
						/>
						<label htmlFor="sendWelcomeEmail" className="flex-1">
							<span className="text-sm font-medium text-gray-900 block">Send welcome email</span>
							<span className="text-xs text-gray-600">User will receive login credentials via email</span>
						</label>
					</div>
				</div>
			</Modal>

			{/* Confirmation Modal */}
			<ConfirmModal
				isOpen={!!showConfirmModal}
				onClose={() => {
					setShowConfirmModal(null);
					setConfirmReason("");
				}}
				onConfirm={confirmAction}
				title={`Confirm Bulk ${showConfirmModal}`}
				message={`This will affect ${selectedIds.length} ${selectedIds.length === 1 ? 'user' : 'users'}. Please provide a reason for this action.`}
				confirmText={`Confirm ${showConfirmModal}`}
				variant="warning"
				isLoading={isLoading}
			/>
		</div>
	);
}

