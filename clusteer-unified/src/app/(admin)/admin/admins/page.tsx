"use client";

import { useState } from "react";
import {
	Shield, Plus, Search, Mail, Phone,
	CheckCircle, AlertCircle, Lock, Unlock,
	Trash2, Edit, X,
} from "lucide-react";
import { toast } from "sonner";

/* ─── types ─── */
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

/* ─── color helpers ─── */
function roleStyle(r: string) {
	return r === "Super Admin"
		? { background: "var(--c-info-soft)", color: "var(--c-info)" }
		: r === "Admin"
		? { background: "var(--c-up-soft)", color: "var(--c-up)" }
		: r === "Moderator"
		? { background: "var(--c-warn-soft)", color: "var(--c-warn)" }
		: { background: "var(--c-surface-3)", color: "var(--c-text-3)" };
}

function statusStyle(s: string) {
	return s === "Active"
		? { background: "var(--c-up-soft)", color: "var(--c-up)" }
		: s === "Suspended"
		? { background: "var(--c-down-soft)", color: "var(--c-down)" }
		: { background: "var(--c-surface-3)", color: "var(--c-text-3)" };
}

/* ─── avatar initials ─── */
function initials(name: string) {
	return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

/* ─── page ─── */
export default function AdminsPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedRole, setSelectedRole] = useState<string>("All");
	const [selectedStatus, setSelectedStatus] = useState<string>("All");
	const [showCreateDrawer, setShowCreateDrawer] = useState(false);
	const [showEditDrawer, setShowEditDrawer] = useState<Admin | null>(null);
	const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	/* form state */
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
		{ id: "users",        label: "User Management",        description: "Create, edit, and delete users" },
		{ id: "kyc",          label: "KYC Management",         description: "Approve/reject KYC submissions" },
		{ id: "transactions", label: "Transaction Management",  description: "View and manage transactions" },
		{ id: "wallets",      label: "Wallet Management",       description: "Manage wallets and liquidity" },
		{ id: "support",      label: "Support Management",      description: "Handle support tickets" },
		{ id: "content",      label: "Content Management",      description: "Create and manage content" },
		{ id: "reports",      label: "Reports & Analytics",     description: "View reports and analytics" },
		{ id: "settings",     label: "System Settings",         description: "Modify system settings" },
		{ id: "admins",       label: "Admin Management",        description: "Manage admin accounts" },
	];

	const filteredAdmins = admins.filter((admin) => {
		const matchesSearch =
			admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			admin.email.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesRole = selectedRole === "All" || admin.role === selectedRole;
		const matchesStatus = selectedStatus === "All" || admin.status === selectedStatus;
		return matchesSearch && matchesRole && matchesStatus;
	});

	/* ─── handlers ─── */
	const handleCreateAdmin = async () => {
		setIsLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
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
				avatar: formData.name.split(" ").map((n) => n[0]).join("").toUpperCase(),
			};
			setAdmins([...admins, newAdmin]);
			setShowCreateDrawer(false);
			setFormData({ name: "", email: "", phone: "", role: "Admin", permissions: [] });
			toast.success(`${formData.name} has been added successfully`);
		} catch {
			toast.error("An error occurred while creating the admin account");
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpdateAdmin = async () => {
		if (!showEditDrawer) return;
		setIsLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setAdmins(
				admins.map((admin) =>
					admin.id === showEditDrawer.id
						? { ...admin, name: formData.name, email: formData.email, phone: formData.phone, role: formData.role, permissions: formData.permissions }
						: admin
				)
			);
			setShowEditDrawer(null);
			setFormData({ name: "", email: "", phone: "", role: "Admin", permissions: [] });
			toast.success("Admin account has been updated successfully");
		} catch {
			toast.error("An error occurred while updating the admin account");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteAdmin = async (adminId: string) => {
		setIsLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setAdmins(admins.filter((admin) => admin.id !== adminId));
			setShowDeleteModal(null);
			toast.success("Admin account has been permanently deleted");
		} catch {
			toast.error("An error occurred while deleting the admin account");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSuspendAdmin = async (adminId: string) => {
		const admin = admins.find((a) => a.id === adminId);
		if (!admin) return;
		setIsLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 800));
			setAdmins(
				admins.map((a) =>
					a.id === adminId
						? { ...a, status: (a.status === "Suspended" ? "Active" : "Suspended") as Admin["status"] }
						: a
				)
			);
			const action = admin.status === "Suspended" ? "activated" : "suspended";
			toast.success(`${admin.name} has been ${action} successfully`);
		} catch {
			toast.error("An error occurred while updating the admin status");
		} finally {
			setIsLoading(false);
		}
	};

	const openEditDrawer = (admin: Admin) => {
		setFormData({
			name: admin.name,
			email: admin.email,
			phone: admin.phone,
			role: admin.role,
			permissions: admin.permissions,
		});
		setShowEditDrawer(admin);
	};

	const closeDrawer = () => {
		setShowCreateDrawer(false);
		setShowEditDrawer(null);
		setFormData({ name: "", email: "", phone: "", role: "Admin", permissions: [] });
	};

	const togglePermission = (permissionId: string) => {
		setFormData({
			...formData,
			permissions: formData.permissions.includes(permissionId)
				? formData.permissions.filter((p) => p !== permissionId)
				: [...formData.permissions, permissionId],
		});
	};

	const isDrawerOpen = showCreateDrawer || !!showEditDrawer;
	const isEditing = !!showEditDrawer;

	/* ─── stat cards data ─── */
	const STAT_CARDS = [
		{ label: "Total",     value: admins.length,                                        icon: Shield,       sub: "All administrators" },
		{ label: "Active",    value: admins.filter((a) => a.status === "Active").length,    icon: CheckCircle,  sub: "Currently active"   },
		{ label: "Suspended", value: admins.filter((a) => a.status === "Suspended").length, icon: AlertCircle,  sub: "Temporarily blocked" },
		{ label: "Online now", value: 3,                                                    icon: Shield,       sub: "Currently online"   },
	];

	return (
		<div className="space-y-5">
			{/* ─── Header ─── */}
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<div>
					<h1 className="text-[22px] font-semibold tracking-tight text-[var(--c-text)]">Staff</h1>
					<p className="text-[13px] text-[var(--c-text-3)] mt-0.5">
						{admins.length} admin accounts
					</p>
				</div>
				<button
					onClick={() => setShowCreateDrawer(true)}
					className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-[13px] font-semibold transition-colors"
					style={{ background: "#84cc16", color: "#1a2e05" }}
				>
					<Plus className="size-3.5" />
					Add admin
				</button>
			</div>

			{/* ─── 4-col stat cards ─── */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
				{STAT_CARDS.map((s) => {
					const Icon = s.icon;
					return (
						<div key={s.label} className="ds-card p-5">
							<div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--c-text-3)]">
								<Icon className="size-4" />
								{s.label}
							</div>
							<div className="mt-2 font-display tabular-nums text-[26px] font-semibold leading-none text-[var(--c-text)]">
								{s.value}
							</div>
							<div className="mt-1.5 text-[12px] text-[var(--c-text-3)]">{s.sub}</div>
						</div>
					);
				})}
			</div>

			{/* ─── Table card ─── */}
			<div className="ds-card overflow-hidden">
				{/* Card header: search + filters */}
				<div
					className="flex items-center gap-3 px-5 py-3 flex-wrap"
					style={{ borderBottom: "1px solid var(--c-line)" }}
				>
					{/* Search */}
					<div className="relative">
						<Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--c-text-3)]" />
						<input
							className="h-8 pl-8 pr-3 rounded-lg border border-[var(--c-line)] bg-[var(--c-surface)] text-[13px] text-[var(--c-text)] outline-none focus:ring-2 focus:ring-[#84cc16] focus:border-transparent w-[200px]"
							placeholder="Name or email…"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<div className="flex-1" />

					{/* Role filter */}
					<select
						value={selectedRole}
						onChange={(e) => setSelectedRole(e.target.value)}
						className="h-8 px-3 rounded-lg border border-[var(--c-line)] bg-[var(--c-surface)] text-[13px] text-[var(--c-text)] outline-none focus:ring-2 focus:ring-[#84cc16] focus:border-transparent"
					>
						{roles.map((role) => (
							<option key={role} value={role}>{role}</option>
						))}
					</select>

					{/* Status filter */}
					<select
						value={selectedStatus}
						onChange={(e) => setSelectedStatus(e.target.value)}
						className="h-8 px-3 rounded-lg border border-[var(--c-line)] bg-[var(--c-surface)] text-[13px] text-[var(--c-text)] outline-none focus:ring-2 focus:ring-[#84cc16] focus:border-transparent"
					>
						{statuses.map((status) => (
							<option key={status} value={status}>{status}</option>
						))}
					</select>
				</div>

				{/* Table */}
				<table className="w-full text-[13px] border-collapse">
					<thead>
						<tr style={{ borderBottom: "1px solid var(--c-line)" }}>
							{["Admin", "Role", "Status", "Last login", "Permissions", "Actions"].map((h) => (
								<th
									key={h}
									className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--c-text-3)]"
									style={{ background: "var(--c-surface-2)" }}
								>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{filteredAdmins.map((admin) => {
							const rs = roleStyle(admin.role);
							const ss = statusStyle(admin.status);
							return (
								<tr
									key={admin.id}
									className="transition-colors hover:bg-[var(--c-surface-2)]"
									style={{ borderBottom: "1px solid var(--c-line)" }}
								>
									{/* Admin */}
									<td className="px-4 py-3">
										<div className="flex items-center gap-3">
											<div
												className="size-8 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold"
												style={{ background: "var(--c-onyx-700)", color: "var(--c-cream)" }}
											>
												{initials(admin.name)}
											</div>
											<div className="min-w-0">
												<div className="font-semibold text-[var(--c-text)] truncate">{admin.name}</div>
												<div className="text-[11px] text-[var(--c-text-3)] truncate flex items-center gap-1">
													<Mail className="size-3 shrink-0" />
													{admin.email}
												</div>
											</div>
										</div>
									</td>

									{/* Role */}
									<td className="px-4 py-3">
										<span
											className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
											style={rs}
										>
											{admin.role}
										</span>
									</td>

									{/* Status */}
									<td className="px-4 py-3">
										<div className="flex items-center gap-1.5">
											<span
												className="inline-block size-[6px] rounded-full shrink-0"
												style={{ background: ss.color }}
											/>
											<span className="text-[var(--c-text-2)]">{admin.status}</span>
										</div>
									</td>

									{/* Last login */}
									<td className="px-4 py-3 text-[var(--c-text-3)]">{admin.lastLogin}</td>

									{/* Permissions */}
									<td className="px-4 py-3">
										<div className="flex items-center gap-1 flex-wrap">
											{admin.permissions.slice(0, 2).map((p) => (
												<span
													key={p}
													className="px-2 py-0.5 rounded-full text-[11px] font-medium"
													style={{ background: "var(--c-surface-3)", color: "var(--c-text-3)" }}
												>
													{p}
												</span>
											))}
											{admin.permissions.length > 2 && (
												<span
													className="px-2 py-0.5 rounded-full text-[11px] font-medium"
													style={{ background: "var(--c-surface-3)", color: "var(--c-text-3)" }}
												>
													+{admin.permissions.length - 2}
												</span>
											)}
										</div>
									</td>

									{/* Actions */}
									<td className="px-4 py-3">
										<div className="flex items-center gap-1">
											<button
												onClick={() => openEditDrawer(admin)}
												className="p-1.5 rounded-lg transition-colors hover:bg-[var(--c-surface-3)]"
												title="Edit"
											>
												<Edit className="size-4 text-[var(--c-text-3)]" />
											</button>
											<button
												onClick={() => handleSuspendAdmin(admin.id)}
												className="p-1.5 rounded-lg transition-colors hover:bg-[var(--c-surface-3)]"
												title={admin.status === "Suspended" ? "Activate" : "Suspend"}
											>
												{admin.status === "Suspended" ? (
													<Unlock className="size-4 text-[var(--c-up)]" />
												) : (
													<Lock className="size-4 text-[var(--c-warn)]" />
												)}
											</button>
											<button
												onClick={() => setShowDeleteModal(admin.id)}
												className="p-1.5 rounded-lg transition-colors hover:bg-[var(--c-surface-3)]"
												title="Delete"
											>
												<Trash2 className="size-4 text-[var(--c-down)]" />
											</button>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>

				{/* Footer */}
				<div
					className="flex items-center px-5 py-3 text-[13px] text-[var(--c-text-3)]"
					style={{ borderTop: "1px solid var(--c-line)" }}
				>
					Showing {filteredAdmins.length} of {admins.length} accounts
				</div>
			</div>

			{/* ─── Right-side drawer (Create / Edit) ─── */}
			{isDrawerOpen && (
				<div
					className="fixed inset-0 z-50 flex justify-end"
					onClick={(e) => { if (e.target === e.currentTarget) closeDrawer(); }}
				>
					<div className="pointer-events-none absolute inset-0 bg-black/20" />
					<aside
						className="relative z-10 flex h-full w-[480px] flex-col overflow-hidden"
						style={{ background: "var(--c-surface)", borderLeft: "1px solid var(--c-line)" }}
					>
						{/* Drawer header */}
						<div
							className="flex items-center gap-3 px-5 py-4"
							style={{ borderBottom: "1px solid var(--c-line)" }}
						>
							<div className="flex-1">
								<div className="font-semibold text-[15px] text-[var(--c-text)]">
									{isEditing ? "Edit admin" : "Create admin"}
								</div>
								<div className="text-[12px] text-[var(--c-text-3)] mt-0.5">
									{isEditing ? "Update account details and permissions" : "Add a new administrator account"}
								</div>
							</div>
							<button
								onClick={closeDrawer}
								className="shrink-0 rounded-lg p-1.5 hover:bg-[var(--c-surface-2)] transition-colors text-[var(--c-text-3)]"
							>
								<X className="size-4" />
							</button>
						</div>

						{/* Drawer body */}
						<div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
							{/* Full Name */}
							<div>
								<label className="block text-[12px] font-medium text-[var(--c-text-3)] uppercase tracking-[0.05em] mb-1.5">
									Full Name
								</label>
								<input
									type="text"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									placeholder="e.g. John Doe"
									className="w-full h-9 px-3 rounded-lg border border-[var(--c-line)] bg-[var(--c-surface)] text-[13px] text-[var(--c-text)] outline-none focus:ring-2 focus:ring-[#84cc16] focus:border-transparent"
								/>
							</div>

							{/* Email */}
							<div>
								<label className="block text-[12px] font-medium text-[var(--c-text-3)] uppercase tracking-[0.05em] mb-1.5">
									Email Address
								</label>
								<div className="relative">
									<Mail className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--c-text-3)]" />
									<input
										type="email"
										value={formData.email}
										onChange={(e) => setFormData({ ...formData, email: e.target.value })}
										placeholder="admin@clusteer.com"
										className="w-full h-9 pl-9 pr-3 rounded-lg border border-[var(--c-line)] bg-[var(--c-surface)] text-[13px] text-[var(--c-text)] outline-none focus:ring-2 focus:ring-[#84cc16] focus:border-transparent"
									/>
								</div>
							</div>

							{/* Phone */}
							<div>
								<label className="block text-[12px] font-medium text-[var(--c-text-3)] uppercase tracking-[0.05em] mb-1.5">
									Phone Number
								</label>
								<div className="relative">
									<Phone className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--c-text-3)]" />
									<input
										type="tel"
										value={formData.phone}
										onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
										placeholder="+234 801 234 5678"
										className="w-full h-9 pl-9 pr-3 rounded-lg border border-[var(--c-line)] bg-[var(--c-surface)] text-[13px] text-[var(--c-text)] outline-none focus:ring-2 focus:ring-[#84cc16] focus:border-transparent"
									/>
								</div>
							</div>

							{/* Role */}
							<div>
								<label className="block text-[12px] font-medium text-[var(--c-text-3)] uppercase tracking-[0.05em] mb-1.5">
									Role
								</label>
								<select
									value={formData.role}
									onChange={(e) => setFormData({ ...formData, role: e.target.value as Admin["role"] })}
									className="w-full h-9 px-3 rounded-lg border border-[var(--c-line)] bg-[var(--c-surface)] text-[13px] text-[var(--c-text)] outline-none focus:ring-2 focus:ring-[#84cc16] focus:border-transparent"
								>
									<option value="Admin">Admin</option>
									<option value="Super Admin">Super Admin</option>
									<option value="Moderator">Moderator</option>
									<option value="Support">Support</option>
								</select>
							</div>

							{/* Permissions */}
							<div>
								<label className="block text-[12px] font-medium text-[var(--c-text-3)] uppercase tracking-[0.05em] mb-2">
									Permissions ({formData.permissions.length} selected)
								</label>
								<div className="space-y-2">
									{availablePermissions.map((permission) => (
										<label
											key={permission.id}
											className="flex items-start gap-3 p-3 rounded-lg border border-[var(--c-line)] cursor-pointer hover:border-[#84cc16] transition-colors"
											style={{ background: "var(--c-surface-2)" }}
										>
											<input
												type="checkbox"
												checked={formData.permissions.includes(permission.id)}
												onChange={() => togglePermission(permission.id)}
												className="mt-0.5 accent-[#84cc16]"
											/>
											<div>
												<div className="text-[13px] font-medium text-[var(--c-text)]">{permission.label}</div>
												<div className="text-[11px] text-[var(--c-text-3)] mt-0.5">{permission.description}</div>
											</div>
										</label>
									))}
								</div>
							</div>
						</div>

						{/* Drawer footer */}
						<div
							className="flex items-center justify-end gap-2 px-5 py-4"
							style={{ borderTop: "1px solid var(--c-line)" }}
						>
							<button
								onClick={closeDrawer}
								className="h-9 px-4 rounded-lg border border-[var(--c-line)] text-[13px] font-medium text-[var(--c-text-2)] hover:bg-[var(--c-surface-2)] transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={isEditing ? handleUpdateAdmin : handleCreateAdmin}
								disabled={
									isLoading ||
									!formData.name.trim() ||
									!formData.email.trim() ||
									!formData.phone.trim() ||
									formData.permissions.length === 0
								}
								className="h-9 px-4 rounded-lg text-[13px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								style={{ background: "#84cc16", color: "#1a2e05" }}
							>
								{isEditing ? "Update" : "Create"}
							</button>
						</div>
					</aside>
				</div>
			)}

			{/* ─── Delete confirmation modal ─── */}
			{showDeleteModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div
						className="absolute inset-0 bg-black/30"
						onClick={() => setShowDeleteModal(null)}
					/>
					<div
						className="relative ds-card max-w-[400px] w-full mx-4 p-6"
						style={{ zIndex: 1 }}
					>
						<div className="flex items-start gap-3 mb-4">
							<div
								className="size-10 shrink-0 rounded-full flex items-center justify-center"
								style={{ background: "var(--c-down-soft)" }}
							>
								<Trash2 className="size-5" style={{ color: "var(--c-down)" }} />
							</div>
							<div>
								<div className="font-semibold text-[15px] text-[var(--c-text)]">Delete admin?</div>
								<div className="text-[13px] text-[var(--c-text-3)] mt-1">
									This action cannot be undone. The admin account and all associated permissions will be permanently removed.
								</div>
							</div>
						</div>
						<div className="flex items-center justify-end gap-2">
							<button
								onClick={() => setShowDeleteModal(null)}
								className="h-9 px-4 rounded-lg border border-[var(--c-line)] text-[13px] font-medium text-[var(--c-text-2)] hover:bg-[var(--c-surface-2)] transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={() => handleDeleteAdmin(showDeleteModal)}
								disabled={isLoading}
								className="h-9 px-4 rounded-lg text-[13px] font-semibold text-white transition-colors disabled:opacity-50"
								style={{ background: "var(--c-down)" }}
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
