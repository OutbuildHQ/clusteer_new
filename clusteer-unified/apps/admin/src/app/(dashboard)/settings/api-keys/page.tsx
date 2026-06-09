"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Key,
	Plus,
	Copy,
	Eye,
	EyeOff,
	Trash2,
	CheckCircle,
	AlertCircle,
	Clock,
	Shield,
	Calendar,
	Activity,
	RefreshCw,
} from "lucide-react";

interface APIKey {
	id: string;
	name: string;
	key: string;
	createdDate: string;
	lastUsed: string;
	expiresDate: string;
	status: "Active" | "Expired" | "Revoked";
	permissions: string[];
	usageCount: number;
}

export default function APIKeysPage() {
	const router = useRouter();
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
	const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
	const [copiedKey, setCopiedKey] = useState<string | null>(null);

	// Form state for new API key
	const [newKeyName, setNewKeyName] = useState("");
	const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>([]);
	const [newKeyExpiry, setNewKeyExpiry] = useState("90");

	const [apiKeys, setApiKeys] = useState<APIKey[]>([
		{
			id: "key-1",
			name: "Production API Key",
			key: "clstr_prod_xxxxxxxxxxxxxxxxxxxx",
			createdDate: "2024-12-15",
			lastUsed: "2025-01-16 08:30 AM",
			expiresDate: "2025-06-15",
			status: "Active",
			permissions: ["read:transactions", "read:users", "write:webhooks"],
			usageCount: 2456,
		},
		{
			id: "key-2",
			name: "Development API Key",
			key: "clstr_dev_xxxxxxxxxxxxxxxxxxxx",
			createdDate: "2024-11-01",
			lastUsed: "2025-01-14 02:15 PM",
			expiresDate: "2025-05-01",
			status: "Active",
			permissions: ["read:transactions", "read:users"],
			usageCount: 542,
		},
		{
			id: "key-3",
			name: "Mobile App Key",
			key: "clstr_mobile_xxxxxxxxxxxxxxxxxxxx",
			createdDate: "2024-10-20",
			lastUsed: "2024-12-30 10:45 AM",
			expiresDate: "2024-12-31",
			status: "Expired",
			permissions: ["read:users", "write:transactions"],
			usageCount: 1024,
		},
	]);

	const availablePermissions = [
		{ id: "read:users", label: "Read Users", description: "View user data" },
		{ id: "write:users", label: "Write Users", description: "Create/update users" },
		{ id: "read:transactions", label: "Read Transactions", description: "View transactions" },
		{ id: "write:transactions", label: "Write Transactions", description: "Create transactions" },
		{ id: "read:wallets", label: "Read Wallets", description: "View wallet balances" },
		{ id: "write:wallets", label: "Write Wallets", description: "Modify wallets" },
		{ id: "read:kyc", label: "Read KYC", description: "View KYC data" },
		{ id: "write:kyc", label: "Write KYC", description: "Update KYC status" },
		{ id: "write:webhooks", label: "Write Webhooks", description: "Configure webhooks" },
	];

	const toggleKeyVisibility = (keyId: string) => {
		setRevealedKeys((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(keyId)) {
				newSet.delete(keyId);
			} else {
				newSet.add(keyId);
			}
			return newSet;
		});
	};

	const copyToClipboard = (key: string, keyId: string) => {
		navigator.clipboard.writeText(key);
		setCopiedKey(keyId);
		setTimeout(() => setCopiedKey(null), 2000);
	};

	const togglePermission = (permissionId: string) => {
		setNewKeyPermissions((prev) =>
			prev.includes(permissionId) ? prev.filter((p) => p !== permissionId) : [...prev, permissionId]
		);
	};

	const handleCreateKey = () => {
		if (!newKeyName.trim()) return;

		const newKey: APIKey = {
			id: `key-${Date.now()}`,
			name: newKeyName,
			key: `sk_live_${Math.random().toString(36).substring(2, 30)}`,
			createdDate: new Date().toISOString().split("T")[0],
			lastUsed: "Never",
			expiresDate: new Date(Date.now() + parseInt(newKeyExpiry) * 24 * 60 * 60 * 1000)
				.toISOString()
				.split("T")[0],
			status: "Active",
			permissions: newKeyPermissions,
			usageCount: 0,
		};

		setApiKeys([newKey, ...apiKeys]);
		setShowCreateModal(false);
		setNewKeyName("");
		setNewKeyPermissions([]);
		setNewKeyExpiry("90");
	};

	const handleDeleteKey = (keyId: string) => {
		setApiKeys(apiKeys.filter((key) => key.id !== keyId));
		setShowDeleteModal(null);
	};

	const handleRevokeKey = (keyId: string) => {
		setApiKeys(apiKeys.map((key) => (key.id === keyId ? { ...key, status: "Revoked" as const } : key)));
	};

	const getStatusColor = (status: APIKey["status"]) => {
		switch (status) {
			case "Active":
				return "bg-success/10 text-success border-success";
			case "Expired":
				return "bg-orange-50 text-orange-700 border-orange-200";
			case "Revoked":
				return "bg-danger/10 text-danger border-danger";
		}
	};

	const maskKey = (key: string) => {
		return key.substring(0, 12) + "•".repeat(20);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button
						onClick={() => router.push("/admin/settings")}
						className="p-2 hover:bg-[var(--c-surface-2)] rounded-lg transition-colors"
					>
						<ArrowLeft className="w-5 h-5 text-[var(--c-text-3)]" />
					</button>
					<div>
						<h1 className="text-2xl font-bold text-[var(--c-text)]">API Keys Management</h1>
						<p className="text-sm text-[var(--c-text-3)] mt-1">Create and manage API keys for external integrations</p>
					</div>
				</div>
				<button
					onClick={() => setShowCreateModal(true)}
					className="flex items-center gap-2 px-4 py-2 bg-[var(--c-lime-500)] text-white rounded-lg hover:bg-[var(--c-lime-500)]/90 transition-colors shadow-sm"
				>
					<Plus className="w-4 h-4" />
					Create New Key
				</button>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-[var(--c-lime-500)]/10 rounded-lg">
							<Key className="w-6 h-6 text-[var(--c-lime-500)]" />
						</div>
					</div>
					<h3 className="text-sm text-[var(--c-text-3)] font-medium mb-1">Total Keys</h3>
					<p className="text-2xl font-bold text-[var(--c-text)]">{apiKeys.length}</p>
				</div>

				<div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-success/10 rounded-lg">
							<CheckCircle className="w-6 h-6 text-success" />
						</div>
					</div>
					<h3 className="text-sm text-[var(--c-text-3)] font-medium mb-1">Active Keys</h3>
					<p className="text-2xl font-bold text-[var(--c-text)]">
						{apiKeys.filter((k) => k.status === "Active").length}
					</p>
				</div>

				<div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-orange-50 rounded-lg">
							<AlertCircle className="w-6 h-6 text-orange-600" />
						</div>
					</div>
					<h3 className="text-sm text-[var(--c-text-3)] font-medium mb-1">Expired Keys</h3>
					<p className="text-2xl font-bold text-[var(--c-text)]">
						{apiKeys.filter((k) => k.status === "Expired").length}
					</p>
				</div>

				<div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)] p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-purple-50 rounded-lg">
							<Activity className="w-6 h-6 text-purple-600" />
						</div>
					</div>
					<h3 className="text-sm text-[var(--c-text-3)] font-medium mb-1">Total Requests</h3>
					<p className="text-2xl font-bold text-[var(--c-text)]">
						{apiKeys.reduce((sum, key) => sum + key.usageCount, 0).toLocaleString()}
					</p>
				</div>
			</div>

			{/* API Keys List */}
			<div className="bg-[var(--c-surface)] rounded-lg border border-[var(--c-line)]">
				<div className="p-6 border-b border-[var(--c-line)]">
					<h2 className="text-lg font-semibold text-[var(--c-text)]">Your API Keys</h2>
					<p className="text-sm text-[var(--c-text-3)] mt-1">Manage access keys for your applications</p>
				</div>

				<div className="divide-y divide-border">
					{apiKeys.map((apiKey) => (
						<div key={apiKey.id} className="p-6 hover:bg-background transition-colors">
							<div className="flex items-start justify-between mb-4">
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-2">
										<h3 className="text-lg font-semibold text-[var(--c-text)]">{apiKey.name}</h3>
										<span
											className={`px-2 py-1 text-xs font-medium border rounded ${getStatusColor(
												apiKey.status
											)}`}
										>
											{apiKey.status}
										</span>
									</div>
									<div className="flex items-center gap-2 mb-3">
										<code className="px-3 py-1.5 bg-background rounded font-mono text-sm text-[var(--c-text-3)] border border-[var(--c-line)]">
											{revealedKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
										</code>
										<button
											onClick={() => toggleKeyVisibility(apiKey.id)}
											className="p-2 hover:bg-[var(--c-surface-2)] rounded transition-colors"
											title={revealedKeys.has(apiKey.id) ? "Hide key" : "Show key"}
										>
											{revealedKeys.has(apiKey.id) ? (
												<EyeOff className="w-4 h-4 text-[var(--c-text-3)]" />
											) : (
												<Eye className="w-4 h-4 text-[var(--c-text-3)]" />
											)}
										</button>
										<button
											onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
											className="p-2 hover:bg-[var(--c-surface-2)] rounded transition-colors relative"
											title="Copy to clipboard"
										>
											{copiedKey === apiKey.id ? (
												<CheckCircle className="w-4 h-4 text-success" />
											) : (
												<Copy className="w-4 h-4 text-[var(--c-text-3)]" />
											)}
										</button>
									</div>
								</div>
								{apiKey.status === "Active" && (
									<div className="flex items-center gap-2">
										<button
											onClick={() => handleRevokeKey(apiKey.id)}
											className="px-3 py-1.5 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded hover:bg-orange-100 transition-colors"
										>
											Revoke
										</button>
										<button
											onClick={() => setShowDeleteModal(apiKey.id)}
											className="px-3 py-1.5 text-sm font-medium text-danger bg-danger/10 border border-danger rounded hover:bg-danger/10 transition-colors flex items-center gap-1"
										>
											<Trash2 className="w-3.5 h-3.5" />
											Delete
										</button>
									</div>
								)}
							</div>

							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
								<div className="flex items-center gap-2 text-sm">
									<Calendar className="w-4 h-4 text-[var(--c-text-3)]" />
									<div>
										<span className="text-[var(--c-text-3)]">Created:</span>
										<span className="ml-1 font-medium text-[var(--c-text)]">{apiKey.createdDate}</span>
									</div>
								</div>
								<div className="flex items-center gap-2 text-sm">
									<Clock className="w-4 h-4 text-[var(--c-text-3)]" />
									<div>
										<span className="text-[var(--c-text-3)]">Last Used:</span>
										<span className="ml-1 font-medium text-[var(--c-text)]">{apiKey.lastUsed}</span>
									</div>
								</div>
								<div className="flex items-center gap-2 text-sm">
									<AlertCircle className="w-4 h-4 text-[var(--c-text-3)]" />
									<div>
										<span className="text-[var(--c-text-3)]">Expires:</span>
										<span className="ml-1 font-medium text-[var(--c-text)]">{apiKey.expiresDate}</span>
									</div>
								</div>
								<div className="flex items-center gap-2 text-sm">
									<Activity className="w-4 h-4 text-[var(--c-text-3)]" />
									<div>
										<span className="text-[var(--c-text-3)]">Requests:</span>
										<span className="ml-1 font-medium text-[var(--c-text)]">
											{apiKey.usageCount.toLocaleString()}
										</span>
									</div>
								</div>
							</div>

							<div>
								<div className="flex items-center gap-2 mb-2">
									<Shield className="w-4 h-4 text-[var(--c-text-3)]" />
									<span className="text-sm font-medium text-[var(--c-text-3)]">Permissions:</span>
								</div>
								<div className="flex flex-wrap gap-2">
									{apiKey.permissions.map((permission) => (
										<span
											key={permission}
											className="px-2 py-1 bg-[var(--c-lime-500)]/10 text-[var(--c-lime-500)] text-xs font-medium rounded border border-primary/30"
										>
											{permission}
										</span>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Create API Key Modal */}
			{showCreateModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
					<div className="bg-[var(--c-surface)] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6 border-b border-[var(--c-line)]">
							<h2 className="text-xl font-bold text-[var(--c-text)]">Create New API Key</h2>
							<p className="text-sm text-[var(--c-text-3)] mt-1">
								Generate a new API key with specific permissions
							</p>
						</div>

						<div className="p-6 space-y-6">
							<div>
								<label className="block text-sm font-medium text-[var(--c-text-3)] mb-2">Key Name *</label>
								<input
									type="text"
									value={newKeyName}
									onChange={(e) => setNewKeyName(e.target.value)}
									placeholder="e.g., Production API Key"
									className="w-full px-3 py-2 border border-[var(--c-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-[var(--c-text-3)] mb-2">Expiry Period</label>
								<select
									value={newKeyExpiry}
									onChange={(e) => setNewKeyExpiry(e.target.value)}
									className="w-full px-3 py-2 border border-[var(--c-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
								>
									<option value="30">30 days</option>
									<option value="90">90 days</option>
									<option value="180">180 days</option>
									<option value="365">1 year</option>
									<option value="730">2 years</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-[var(--c-text-3)] mb-3">
									Permissions ({newKeyPermissions.length} selected)
								</label>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{availablePermissions.map((permission) => (
										<label
											key={permission.id}
											className="flex items-start gap-3 p-3 border border-[var(--c-line)] rounded-lg cursor-pointer hover:border-primary/20 transition-colors"
										>
											<input
												type="checkbox"
												checked={newKeyPermissions.includes(permission.id)}
												onChange={() => togglePermission(permission.id)}
												className="mt-1"
											/>
											<div>
												<div className="text-sm font-medium text-[var(--c-text)]">{permission.label}</div>
												<div className="text-xs text-[var(--c-text-3)]">{permission.description}</div>
											</div>
										</label>
									))}
								</div>
							</div>
						</div>

						<div className="p-6 border-t border-[var(--c-line)] flex items-center justify-end gap-3">
							<button
								onClick={() => {
									setShowCreateModal(false);
									setNewKeyName("");
									setNewKeyPermissions([]);
								}}
								className="px-4 py-2 text-[var(--c-text-3)] bg-[var(--c-surface)] border border-[var(--c-line)] rounded-lg hover:bg-background transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handleCreateKey}
								disabled={!newKeyName.trim() || newKeyPermissions.length === 0}
								className="px-4 py-2 bg-[var(--c-lime-500)] text-white rounded-lg hover:bg-[var(--c-lime-500)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Create API Key
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{showDeleteModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
					<div className="bg-[var(--c-surface)] rounded-lg max-w-md w-full">
						<div className="p-6">
							<div className="w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center mb-4">
								<Trash2 className="w-6 h-6 text-danger" />
							</div>
							<h2 className="text-xl font-bold text-[var(--c-text)] mb-2">Delete API Key?</h2>
							<p className="text-sm text-[var(--c-text-3)] mb-6">
								This action cannot be undone. Applications using this key will immediately lose access.
							</p>
							<div className="flex items-center gap-3">
								<button
									onClick={() => setShowDeleteModal(null)}
									className="flex-1 px-4 py-2 text-[var(--c-text-3)] bg-[var(--c-surface)] border border-[var(--c-line)] rounded-lg hover:bg-background transition-colors"
								>
									Cancel
								</button>
								<button
									onClick={() => handleDeleteKey(showDeleteModal)}
									className="flex-1 px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90 transition-colors"
								>
									Delete Key
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
