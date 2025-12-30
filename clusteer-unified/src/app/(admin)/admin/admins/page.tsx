"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Shield,
	Plus,
	Search,
	Filter,
	MoreVertical,
	Edit,
	Trash2,
	Lock,
	Unlock,
	Mail,
	Phone,
	Calendar,
	Activity,
	CheckCircle,
	XCircle,
	Clock,
	User,
	Key,
	AlertCircle,
} from "lucide-react";
import { useToast } from "@/components/admin/Toast";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import Modal, { ConfirmModal } from "@/components/admin/Modal";
import SearchBar from "@/components/admin/SearchBar";
import { getRoleColor, getStatusColor } from "@/lib/status-utils";
import { formatDate, formatRelativeTime } from "@/lib/date-utils";

interface Admin {
	id: string;
	name: string;
	email: string;
	phone: string;
	role: "Super Admin" | "Admin" | "Moderator" | "Support";
	status: "Active" | "Inactive" | "Suspended";
	createdDate: string;
	lastLogin: string;
	permissions: string[];
	avatar?: string;
}

export default function AdminsPage() {
	const router = useRouter();
	const toast = useToast();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedRole, setSelectedRole] = useState<string>("All");
	const [selectedStatus, setSelectedStatus] = useState<string>("All");
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState<Admin | null>(null);
	const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// Form state
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		role: "Admin" as Admin["role"],
		permissions: [] as string[],
	});

	const [admins, setAdmins] = useState<Admin[]>([
		{
			id: "admin-1",
			name: "Admin User",
			email: "admin@clusteer.com",
			phone: "+234 801 234 5678",
			role: "Super Admin",
			status: "Active",
			createdDate: "2024-01-15",
			lastLogin: "2025-01-16 10:30 AM",
			permissions: ["all"],
			avatar: "AD",
		},
		{
			id: "admin-2",
			name: "Sarah Wilson",
			email: "sarah.wilson@clusteer.com",
			phone: "+234 802 345 6789",
			role: "Admin",
			status: "Active",
			createdDate: "2024-03-20",
			lastLogin: "2025-01-16 09:15 AM",
			permissions: ["users", "kyc", "transactions", "reports"],
			avatar: "SW",
		},
		{
			id: "admin-3",
			name: "Mike Chen",
			email: "mike.chen@clusteer.com",
			phone: "+234 803 456 7890",
			role: "Moderator",
			status: "Active",
			createdDate: "2024-06-10",
			lastLogin: "2025-01-15 04:20 PM",
			permissions: ["content", "support"],
			avatar: "MC",
		},
		{
			id: "admin-4",
			name: "Emma Davis",
			email: "emma.davis@clusteer.com",
			phone: "+234 804 567 8901",
			role: "Support",
			status: "Active",
			createdDate: "2024-08-05",
			lastLogin: "2025-01-16 08:00 AM",
			permissions: ["support", "users"],
			avatar: "ED",
		},
		{
			id: "admin-5",
			name: "John Doe",
			email: "john.doe@clusteer.com",
			phone: "+234 805 678 9012",
			role: "Admin",
			status: "Suspended",
			createdDate: "2024-02-28",
			lastLogin: "2025-01-10 02:30 PM",
			permissions: ["users", "kyc"],
			avatar: "JD",
		},
	]);

	const roles = ["All", "Super Admin", "Admin", "Moderator", "Support"];
	const statuses = ["All", "Active", "Inactive", "Suspended"];

	const availablePermissions = [
		{ id: "users", label: "User Management", description: "Create, edit, and delete users" },
		{ id: "kyc", label: "KYC Management", description: "Approve/reject KYC submissions" },
		{ id: "transactions", label: "Transaction Management", description: "View and manage transactions" },
		{ id: "wallets", label: "Wallet Management", description: "Manage wallets and liquidity" },
		{ id: "support", label: "Support Management", description: "Handle support tickets" },
		{ id: "content", label: "Content Management", description: "Create and manage content" },
		{ id: "reports", label: "Reports & Analytics", description: "View reports and analytics" },
		{ id: "settings", label: "System Settings", description: "Modify system settings" },
		{ id: "admins", label: "Admin Management", description: "Manage admin accounts" },
	];

	const filteredAdmins = admins.filter((admin) => {
		const matchesSearch =
			admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			admin.email.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesRole = selectedRole === "All" || admin.role === selectedRole;
		const matchesStatus = selectedStatus === "All" || admin.status === selectedStatus;
		return matchesSearch && matchesRole && matchesStatus;
	});

	const getStatusIcon = (status: Admin["status"]) => {
		switch (status) {
			case "Active":
				return <CheckCircle className="w-4 h-4" />;
			case "Inactive":
				return <XCircle className="w-4 h-4" />;
			case "Suspended":
				return <AlertCircle className="w-4 h-4" />;
		}
	};

	const handleCreateAdmin = async () => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));

			const newAdmin: Admin = {
				id: `admin-${Date.now()}`,
				name: formData.name,
				email: formData.email,
				phone: formData.phone,
				role: formData.role,
				status: "Active",
				createdDate: new Date().toISOString().split("T")[0],
				lastLogin: "Never",
				permissions: formData.permissions,
				avatar: formData.name
					.split(" ")
					.map((n) => n[0])
					.join("")
					.toUpperCase(),
			};
			setAdmins([...admins, newAdmin]);
			setShowCreateModal(false);
			setFormData({ name: "", email: "", phone: "", role: "Admin", permissions: [] });
			toast.success('Admin created', `${formData.name} has been added successfully`);
		} catch (error) {
			toast.error('Failed to create admin', 'An error occurred while creating the admin account');
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpdateAdmin = async () => {
		if (!showEditModal) return;
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));

			setAdmins(
				admins.map((admin) =>
					admin.id === showEditModal.id
						? {
								...admin,
								name: formData.name,
								email: formData.email,
								phone: formData.phone,
								role: formData.role,
								permissions: formData.permissions,
						  }
						: admin
				)
			);
			setShowEditModal(null);
			setFormData({ name: "", email: "", phone: "", role: "Admin", permissions: [] });
			toast.success('Admin updated', 'Admin account has been updated successfully');
		} catch (error) {
			toast.error('Failed to update admin', 'An error occurred while updating the admin account');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteAdmin = async (adminId: string) => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));

			setAdmins(admins.filter((admin) => admin.id !== adminId));
			setShowDeleteModal(null);
			toast.success('Admin deleted', 'Admin account has been permanently deleted');
		} catch (error) {
			toast.error('Failed to delete admin', 'An error occurred while deleting the admin account');
		} finally {
			setIsLoading(false);
		}
	};

	const handleSuspendAdmin = async (adminId: string) => {
		const admin = admins.find(a => a.id === adminId);
		if (!admin) return;

		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 800));

			setAdmins(
				admins.map((a) =>
					a.id === adminId ? { ...a, status: a.status === "Suspended" ? "Active" : "Suspended" as Admin["status"] } : a
				)
			);
			const action = admin.status === "Suspended" ? "activated" : "suspended";
			toast.success(`Admin ${action}`, `${admin.name} has been ${action} successfully`);
		} catch (error) {
			toast.error('Action failed', 'An error occurred while updating the admin status');
		} finally {
			setIsLoading(false);
		}
	};

	const openEditModal = (admin: Admin) => {
		setFormData({
			name: admin.name,
			email: admin.email,
			phone: admin.phone,
			role: admin.role,
			permissions: admin.permissions,
		});
		setShowEditModal(admin);
	};

	const togglePermission = (permissionId: string) => {
		setFormData({
			...formData,
			permissions: formData.permissions.includes(permissionId)
				? formData.permissions.filter((p) => p !== permissionId)
				: [...formData.permissions, permissionId],
		});
	};

	return (
		<div className="space-y-6">
			{isLoading && <LoadingSpinner overlay />}

			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
					<p className="text-sm text-gray-600 mt-1">Manage administrator accounts and permissions</p>
				</div>
				<button
					onClick={() => setShowCreateModal(true)}
					className="flex items-center gap-2 px-4 py-2 bg-[#014F01] text-white rounded-lg hover:bg-[#013d01] transition-colors shadow-sm"
				>
					<Plus className="w-4 h-4" />
					Add Admin
				</button>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100 p-6 hover:shadow-lg transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-purple-100 rounded-lg">
							<Shield className="w-6 h-6 text-purple-600" />
						</div>
					</div>
					<p className="text-sm text-gray-600 font-medium mb-1">Total Admins</p>
					<p className="text-3xl font-bold text-gray-900 mb-2">{admins.length}</p>
					<p className="text-xs text-purple-600 font-medium">All administrators</p>
				</div>

				<div className="bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100 p-6 hover:shadow-lg transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-green-100 rounded-lg">
							<CheckCircle className="w-6 h-6 text-green-600" />
						</div>
					</div>
					<p className="text-sm text-gray-600 font-medium mb-1">Active</p>
					<p className="text-3xl font-bold text-gray-900 mb-2">
						{admins.filter((a) => a.status === "Active").length}
					</p>
					<p className="text-xs text-green-600 font-medium">Currently active</p>
				</div>

				<div className="bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-100 p-6 hover:shadow-lg transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-red-100 rounded-lg">
							<AlertCircle className="w-6 h-6 text-red-600" />
						</div>
					</div>
					<p className="text-sm text-gray-600 font-medium mb-1">Suspended</p>
					<p className="text-3xl font-bold text-gray-900 mb-2">
						{admins.filter((a) => a.status === "Suspended").length}
					</p>
					<p className="text-xs text-red-600 font-medium">Temporarily blocked</p>
				</div>

				<div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 p-6 hover:shadow-lg transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-blue-100 rounded-lg">
							<Activity className="w-6 h-6 text-blue-600" />
						</div>
					</div>
					<p className="text-sm text-gray-600 font-medium mb-1">Online Now</p>
					<p className="text-3xl font-bold text-gray-900 mb-2">3</p>
					<p className="text-xs text-blue-600 font-medium">Currently online</p>
				</div>
			</div>

			{/* Filters */}
			<div className="bg-white rounded-lg border border-[#E9EAEB] p-4">
				<div className="flex flex-col md:flex-row items-start md:items-center gap-4">
					<div className="flex-1">
						<SearchBar
							value={searchQuery}
							onChange={setSearchQuery}
							placeholder="Search by name or email..."
						/>
					</div>

					<select
						value={selectedRole}
						onChange={(e) => setSelectedRole(e.target.value)}
						className="px-4 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01] text-sm"
					>
						{roles.map((role) => (
							<option key={role} value={role}>
								{role}
							</option>
						))}
					</select>

					<select
						value={selectedStatus}
						onChange={(e) => setSelectedStatus(e.target.value)}
						className="px-4 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01] text-sm"
					>
						{statuses.map((status) => (
							<option key={status} value={status}>
								{status}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Admins Table */}
			<div className="bg-white rounded-lg border border-[#E9EAEB]">
				<div className="p-6 border-b border-[#E9EAEB]">
					<h2 className="text-lg font-semibold text-gray-900">Administrator Accounts</h2>
					<p className="text-sm text-gray-600 mt-1">
						Showing {filteredAdmins.length} of {admins.length} admins
					</p>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-[#E9EAEB] bg-gray-50">
								<th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
									Admin
								</th>
								<th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
									Contact
								</th>
								<th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">Role</th>
								<th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
									Status
								</th>
								<th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
									Last Login
								</th>
								<th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
									Permissions
								</th>
								<th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-[#E9EAEB]">
							{filteredAdmins.map((admin) => (
								<tr key={admin.id} className="hover:bg-[#FAFAFA] transition-colors">
									<td className="py-4 px-6">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-gradient-to-br from-[#014F01] to-[#013d01] rounded-full flex items-center justify-center">
												<span className="text-white font-semibold text-sm">{admin.avatar}</span>
											</div>
											<div>
												<div className="text-sm font-medium text-gray-900">{admin.name}</div>
												<div className="text-xs text-gray-500">Joined {formatDate(admin.createdDate)}</div>
											</div>
										</div>
									</td>
									<td className="py-4 px-6">
										<div className="space-y-1">
											<div className="flex items-center gap-2 text-sm text-gray-900">
												<Mail className="w-3 h-3 text-gray-400" />
												{admin.email}
											</div>
											<div className="flex items-center gap-2 text-sm text-gray-600">
												<Phone className="w-3 h-3 text-gray-400" />
												{admin.phone}
											</div>
										</div>
									</td>
									<td className="py-4 px-6">
										<span
											className={`inline-flex items-center px-2 py-1 text-xs font-medium border rounded ${getRoleColor(
												admin.role
											)}`}
										>
											{admin.role}
										</span>
									</td>
									<td className="py-4 px-6">
										<span
											className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded ${getStatusColor(
												admin.status
											)}`}
										>
											{getStatusIcon(admin.status)}
											{admin.status}
										</span>
									</td>
									<td className="py-4 px-6">
										<div className="flex items-center gap-2 text-sm text-gray-900">
											<Clock className="w-3 h-3 text-gray-400" />
											{admin.lastLogin}
										</div>
									</td>
									<td className="py-4 px-6">
										<div className="flex flex-wrap gap-1">
											{admin.permissions.slice(0, 2).map((permission) => (
												<span
													key={permission}
													className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200"
												>
													{permission}
												</span>
											))}
											{admin.permissions.length > 2 && (
												<span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200">
													+{admin.permissions.length - 2}
												</span>
											)}
										</div>
									</td>
									<td className="py-4 px-6">
										<div className="flex items-center gap-2">
											<button
												onClick={() => openEditModal(admin)}
												className="p-1.5 hover:bg-gray-100 rounded transition-colors"
												title="Edit"
											>
												<Edit className="w-4 h-4 text-gray-600" />
											</button>
											<button
												onClick={() => handleSuspendAdmin(admin.id)}
												className="p-1.5 hover:bg-gray-100 rounded transition-colors"
												title={admin.status === "Suspended" ? "Activate" : "Suspend"}
											>
												{admin.status === "Suspended" ? (
													<Unlock className="w-4 h-4 text-green-600" />
												) : (
													<Lock className="w-4 h-4 text-orange-600" />
												)}
											</button>
											<button
												onClick={() => setShowDeleteModal(admin.id)}
												className="p-1.5 hover:bg-gray-100 rounded transition-colors"
												title="Delete"
											>
												<Trash2 className="w-4 h-4 text-red-600" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Create/Edit Admin Modal */}
			{(showCreateModal || showEditModal) && (
				<Modal
					isOpen={showCreateModal || !!showEditModal}
					onClose={() => {
						setShowCreateModal(false);
						setShowEditModal(null);
						setFormData({ name: "", email: "", phone: "", role: "Admin", permissions: [] });
					}}
					title={showEditModal ? "Edit Admin" : "Create New Admin"}
					size="xl"
				>
					<div className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
									<input
										type="text"
										value={formData.name}
										onChange={(e) => setFormData({ ...formData, name: e.target.value })}
										placeholder="e.g., John Doe"
										className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
									<select
										value={formData.role}
										onChange={(e) => setFormData({ ...formData, role: e.target.value as Admin["role"] })}
										className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
									>
										<option value="Admin">Admin</option>
										<option value="Super Admin">Super Admin</option>
										<option value="Moderator">Moderator</option>
										<option value="Support">Support</option>
									</select>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
								<input
									type="email"
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									placeholder="admin@clusteer.com"
									className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
								<input
									type="tel"
									value={formData.phone}
									onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
									placeholder="+234 801 234 5678"
									className="w-full px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01]"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-3">
									Permissions ({formData.permissions.length} selected)
								</label>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-3 bg-gray-50 rounded-lg">
									{availablePermissions.map((permission) => (
										<label
											key={permission.id}
											className="flex items-start gap-3 p-3 border border-[#E9EAEB] bg-white rounded-lg cursor-pointer hover:border-[#014F01]/20 transition-colors"
										>
											<input
												type="checkbox"
												checked={formData.permissions.includes(permission.id)}
												onChange={() => togglePermission(permission.id)}
												className="mt-1"
											/>
											<div>
												<div className="text-sm font-medium text-gray-900">{permission.label}</div>
												<div className="text-xs text-gray-600">{permission.description}</div>
											</div>
										</label>
									))}
								</div>
							</div>

							<div className="flex items-center justify-end gap-3 pt-4">
								<button
									onClick={() => {
										setShowCreateModal(false);
										setShowEditModal(null);
										setFormData({ name: "", email: "", phone: "", role: "Admin", permissions: [] });
									}}
									className="px-4 py-2 text-gray-700 bg-white border border-[#E9EAEB] rounded-lg hover:bg-gray-50 transition-colors"
								>
									Cancel
								</button>
								<button
									onClick={showEditModal ? handleUpdateAdmin : handleCreateAdmin}
									disabled={
										!formData.name.trim() ||
										!formData.email.trim() ||
										!formData.phone.trim() ||
										formData.permissions.length === 0
									}
									className="px-4 py-2 bg-[#014F01] text-white rounded-lg hover:bg-[#013d01] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{showEditModal ? "Update Admin" : "Create Admin"}
								</button>
							</div>
					</div>
				</Modal>
			)}

			{/* Delete Confirmation Modal */}
			<ConfirmModal
				isOpen={!!showDeleteModal}
				onClose={() => setShowDeleteModal(null)}
				onConfirm={() => showDeleteModal && handleDeleteAdmin(showDeleteModal)}
				title="Delete Admin Account?"
				message="This action cannot be undone. This will permanently delete the admin account and remove all associated permissions."
				confirmText="Delete Admin"
				confirmVariant="danger"
			/>
		</div>
	);
}
