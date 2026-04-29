"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Database,
	Download,
	Upload,
	Clock,
	CheckCircle,
	AlertCircle,
	HardDrive,
	Cloud,
	Server,
	RefreshCw,
	Play,
	Calendar,
	FileText,
	Settings,
	Save,
	Trash2,
} from "lucide-react";

interface Backup {
	id: string;
	name: string;
	type: "Full" | "Incremental" | "Differential";
	size: string;
	createdDate: string;
	createdTime: string;
	status: "Completed" | "In Progress" | "Failed";
	location: "Local" | "Cloud";
	expiresDate: string;
}

interface BackupSchedule {
	id: string;
	name: string;
	frequency: "Daily" | "Weekly" | "Monthly";
	time: string;
	type: "Full" | "Incremental";
	enabled: boolean;
	retentionDays: number;
}

export default function BackupDataPage() {
	const router = useRouter();
	const [showCreateBackupModal, setShowCreateBackupModal] = useState(false);
	const [showScheduleModal, setShowScheduleModal] = useState(false);
	const [isCreatingBackup, setIsCreatingBackup] = useState(false);

	// Backup settings
	const [autoBackup, setAutoBackup] = useState(true);
	const [cloudBackup, setCloudBackup] = useState(true);
	const [encryptBackups, setEncryptBackups] = useState(true);
	const [retentionDays, setRetentionDays] = useState(30);

	const [backups, setBackups] = useState<Backup[]>([
		{
			id: "bak-1",
			name: "Full Backup - Jan 16, 2025",
			type: "Full",
			size: "2.4 GB",
			createdDate: "2025-01-16",
			createdTime: "02:00 AM",
			status: "Completed",
			location: "Cloud",
			expiresDate: "2025-02-15",
		},
		{
			id: "bak-2",
			name: "Incremental Backup - Jan 15, 2025",
			type: "Incremental",
			size: "420 MB",
			createdDate: "2025-01-15",
			createdTime: "02:00 AM",
			status: "Completed",
			location: "Cloud",
			expiresDate: "2025-02-14",
		},
		{
			id: "bak-3",
			name: "Full Backup - Jan 09, 2025",
			type: "Full",
			size: "2.3 GB",
			createdDate: "2025-01-09",
			createdTime: "02:00 AM",
			status: "Completed",
			location: "Local",
			expiresDate: "2025-02-08",
		},
	]);

	const [schedules, setSchedules] = useState<BackupSchedule[]>([
		{
			id: "sch-1",
			name: "Daily Incremental Backup",
			frequency: "Daily",
			time: "02:00 AM",
			type: "Incremental",
			enabled: true,
			retentionDays: 7,
		},
		{
			id: "sch-2",
			name: "Weekly Full Backup",
			frequency: "Weekly",
			time: "03:00 AM",
			type: "Full",
			enabled: true,
			retentionDays: 30,
		},
	]);

	const handleCreateBackup = () => {
		setIsCreatingBackup(true);
		setTimeout(() => {
			const newBackup: Backup = {
				id: `bak-${Date.now()}`,
				name: `Manual Backup - ${new Date().toLocaleDateString()}`,
				type: "Full",
				size: "2.4 GB",
				createdDate: new Date().toISOString().split("T")[0],
				createdTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
				status: "Completed",
				location: cloudBackup ? "Cloud" : "Local",
				expiresDate: new Date(Date.now() + retentionDays * 24 * 60 * 60 * 1000)
					.toISOString()
					.split("T")[0],
			};
			setBackups([newBackup, ...backups]);
			setIsCreatingBackup(false);
			setShowCreateBackupModal(false);
		}, 2000);
	};

	const handleDownloadBackup = (backupId: string) => {
		console.log("Downloading backup:", backupId);
		// Implement download logic
	};

	const handleDeleteBackup = (backupId: string) => {
		setBackups(backups.filter((b) => b.id !== backupId));
	};

	const handleRestoreBackup = (backupId: string) => {
		console.log("Restoring backup:", backupId);
		// Implement restore logic
	};

	const getStatusColor = (status: Backup["status"]) => {
		switch (status) {
			case "Completed":
				return "bg-[var(--cl-up-soft)] text-[var(--cl-up)] border-[var(--cl-up)]";
			case "In Progress":
				return "bg-[var(--cl-info-soft)] text-[var(--cl-brand-700)] border-[var(--cl-brand-200)]";
			case "Failed":
				return "bg-[var(--cl-down-soft)] text-[var(--cl-down)] border-[var(--cl-down)]";
		}
	};

	const getStatusIcon = (status: Backup["status"]) => {
		switch (status) {
			case "Completed":
				return <CheckCircle className="w-4 h-4" />;
			case "In Progress":
				return <RefreshCw className="w-4 h-4 animate-spin" />;
			case "Failed":
				return <AlertCircle className="w-4 h-4" />;
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button
						onClick={() => router.push("/admin/settings")}
						className="p-2 hover:bg-[var(--cl-surface-2)] rounded-lg transition-colors"
					>
						<ArrowLeft className="w-5 h-5 text-[var(--cl-text-2)]" />
					</button>
					<div>
						<h1 className="text-2xl font-bold text-[var(--cl-text)]">Backup & Data Management</h1>
						<p className="text-sm text-[var(--cl-text-2)] mt-1">Manage system backups and data exports</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<button
						onClick={() => setShowScheduleModal(true)}
						className="flex items-center gap-2 px-4 py-2 bg-[var(--cl-surface)] border border-[var(--cl-line)] text-[var(--cl-text-2)] rounded-lg hover:bg-[var(--cl-bg)] transition-colors"
					>
						<Clock className="w-4 h-4" />
						Schedule Backup
					</button>
					<button
						onClick={() => setShowCreateBackupModal(true)}
						className="flex items-center gap-2 px-4 py-2 bg-[#014F01] text-white rounded-lg hover:bg-[#013d01] transition-colors shadow-sm"
					>
						<Play className="w-4 h-4" />
						Create Backup Now
					</button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-[var(--cl-surface)] rounded-lg border border-[var(--cl-line)] p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-[var(--cl-info-soft)] rounded-lg">
							<Database className="w-6 h-6 text-[var(--cl-brand-600)]" />
						</div>
					</div>
					<h3 className="text-sm text-[var(--cl-text-2)] font-medium mb-1">Total Backups</h3>
					<p className="text-2xl font-bold text-[var(--cl-text)]">{backups.length}</p>
				</div>

				<div className="bg-[var(--cl-surface)] rounded-lg border border-[var(--cl-line)] p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-[var(--cl-up-soft)] rounded-lg">
							<CheckCircle className="w-6 h-6 text-[var(--cl-up)]" />
						</div>
					</div>
					<h3 className="text-sm text-[var(--cl-text-2)] font-medium mb-1">Completed</h3>
					<p className="text-2xl font-bold text-[var(--cl-text)]">
						{backups.filter((b) => b.status === "Completed").length}
					</p>
				</div>

				<div className="bg-[var(--cl-surface)] rounded-lg border border-[var(--cl-line)] p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-purple-50 rounded-lg">
							<HardDrive className="w-6 h-6 text-purple-600" />
						</div>
					</div>
					<h3 className="text-sm text-[var(--cl-text-2)] font-medium mb-1">Total Size</h3>
					<p className="text-2xl font-bold text-[var(--cl-text)]">5.1 GB</p>
				</div>

				<div className="bg-[var(--cl-surface)] rounded-lg border border-[var(--cl-line)] p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-orange-50 rounded-lg">
							<Clock className="w-6 h-6 text-orange-600" />
						</div>
					</div>
					<h3 className="text-sm text-[var(--cl-text-2)] font-medium mb-1">Last Backup</h3>
					<p className="text-sm font-bold text-[var(--cl-text)]">Jan 16, 02:00 AM</p>
				</div>
			</div>

			{/* Backup Settings */}
			<div className="bg-[var(--cl-surface)] rounded-lg border border-[var(--cl-line)] p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-10 h-10 rounded-lg bg-[var(--cl-info-soft)] flex items-center justify-center">
						<Settings className="w-5 h-5 text-[var(--cl-brand-600)]" />
					</div>
					<div>
						<h3 className="text-lg font-semibold text-[var(--cl-text)]">Backup Settings</h3>
						<p className="text-sm text-[var(--cl-text-2)]">Configure automatic backup preferences</p>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="flex items-center justify-between p-4 border border-[var(--cl-line)] rounded-lg">
						<div>
							<label className="block text-sm font-medium text-[var(--cl-text)] mb-1">Automatic Backups</label>
							<p className="text-xs text-[var(--cl-text-3)]">Enable scheduled automatic backups</p>
						</div>
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={autoBackup}
								onChange={(e) => setAutoBackup(e.target.checked)}
								className="sr-only peer"
							/>
							<div className="w-11 h-6 bg-[var(--cl-surface-2)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#014F01]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-[var(--cl-surface)] after:border-[var(--cl-line)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#014F01]"></div>
						</label>
					</div>

					<div className="flex items-center justify-between p-4 border border-[var(--cl-line)] rounded-lg">
						<div>
							<label className="block text-sm font-medium text-[var(--cl-text)] mb-1">Cloud Storage</label>
							<p className="text-xs text-[var(--cl-text-3)]">Store backups in cloud storage</p>
						</div>
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={cloudBackup}
								onChange={(e) => setCloudBackup(e.target.checked)}
								className="sr-only peer"
							/>
							<div className="w-11 h-6 bg-[var(--cl-surface-2)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#014F01]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-[var(--cl-surface)] after:border-[var(--cl-line)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#014F01]"></div>
						</label>
					</div>

					<div className="flex items-center justify-between p-4 border border-[var(--cl-line)] rounded-lg">
						<div>
							<label className="block text-sm font-medium text-[var(--cl-text)] mb-1">Encrypt Backups</label>
							<p className="text-xs text-[var(--cl-text-3)]">Enable AES-256 encryption</p>
						</div>
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={encryptBackups}
								onChange={(e) => setEncryptBackups(e.target.checked)}
								className="sr-only peer"
							/>
							<div className="w-11 h-6 bg-[var(--cl-surface-2)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#014F01]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-[var(--cl-surface)] after:border-[var(--cl-line)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#014F01]"></div>
						</label>
					</div>

					<div className="flex items-center justify-between p-4 border border-[var(--cl-line)] rounded-lg">
						<div className="flex-1">
							<label className="block text-sm font-medium text-[var(--cl-text)] mb-1">Retention Period</label>
							<p className="text-xs text-[var(--cl-text-3)]">Days to keep backups</p>
						</div>
						<input
							type="number"
							value={retentionDays}
							onChange={(e) => setRetentionDays(Number(e.target.value))}
							min={7}
							max={365}
							className="w-20 px-3 py-2 border border-[var(--cl-line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01] text-sm"
						/>
					</div>
				</div>
			</div>

			{/* Backup Schedules */}
			<div className="bg-[var(--cl-surface)] rounded-lg border border-[var(--cl-line)] p-6">
				<h3 className="text-lg font-semibold text-[var(--cl-text)] mb-4">Backup Schedules</h3>
				<div className="space-y-3">
					{schedules.map((schedule) => (
						<div
							key={schedule.id}
							className="flex items-center justify-between p-4 border border-[var(--cl-line)] rounded-lg hover:border-[#014F01]/20 transition-colors"
						>
							<div className="flex items-center gap-4 flex-1">
								<div className="p-3 bg-[var(--cl-info-soft)] rounded-lg">
									<Clock className="w-5 h-5 text-[var(--cl-brand-600)]" />
								</div>
								<div className="flex-1">
									<h4 className="text-sm font-semibold text-[var(--cl-text)]">{schedule.name}</h4>
									<p className="text-xs text-[var(--cl-text-2)] mt-1">
										{schedule.frequency} at {schedule.time} • {schedule.type} • Retention:{" "}
										{schedule.retentionDays} days
									</p>
								</div>
								<label className="relative inline-flex items-center cursor-pointer">
									<input type="checkbox" checked={schedule.enabled} onChange={() => {}} className="sr-only peer" />
									<div className="w-11 h-6 bg-[var(--cl-surface-2)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#014F01]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-[var(--cl-surface)] after:border-[var(--cl-line)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#014F01]"></div>
								</label>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Backup History */}
			<div className="bg-[var(--cl-surface)] rounded-lg border border-[var(--cl-line)]">
				<div className="p-6 border-b border-[var(--cl-line)]">
					<h2 className="text-lg font-semibold text-[var(--cl-text)]">Backup History</h2>
					<p className="text-sm text-[var(--cl-text-2)] mt-1">View and manage your backups</p>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-[var(--cl-line)] bg-[var(--cl-bg)]">
								<th className="text-left py-3 px-6 text-xs font-semibold text-[var(--cl-text-2)] uppercase">
									Backup Name
								</th>
								<th className="text-left py-3 px-6 text-xs font-semibold text-[var(--cl-text-2)] uppercase">Type</th>
								<th className="text-left py-3 px-6 text-xs font-semibold text-[var(--cl-text-2)] uppercase">Size</th>
								<th className="text-left py-3 px-6 text-xs font-semibold text-[var(--cl-text-2)] uppercase">
									Created
								</th>
								<th className="text-left py-3 px-6 text-xs font-semibold text-[var(--cl-text-2)] uppercase">
									Location
								</th>
								<th className="text-left py-3 px-6 text-xs font-semibold text-[var(--cl-text-2)] uppercase">
									Status
								</th>
								<th className="text-left py-3 px-6 text-xs font-semibold text-[var(--cl-text-2)] uppercase">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-[#E9EAEB]">
							{backups.map((backup) => (
								<tr key={backup.id} className="hover:bg-[var(--cl-bg)] transition-colors">
									<td className="py-4 px-6">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-[var(--cl-info-soft)] rounded-lg">
												<Database className="w-4 h-4 text-[var(--cl-brand-600)]" />
											</div>
											<div>
												<div className="text-sm font-medium text-[var(--cl-text)]">{backup.name}</div>
												<div className="text-xs text-[var(--cl-text-3)]">Expires: {backup.expiresDate}</div>
											</div>
										</div>
									</td>
									<td className="py-4 px-6">
										<span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded border border-purple-200">
											{backup.type}
										</span>
									</td>
									<td className="py-4 px-6">
										<span className="text-sm text-[var(--cl-text)]">{backup.size}</span>
									</td>
									<td className="py-4 px-6">
										<div className="text-sm text-[var(--cl-text)]">{backup.createdDate}</div>
										<div className="text-xs text-[var(--cl-text-3)]">{backup.createdTime}</div>
									</td>
									<td className="py-4 px-6">
										<div className="flex items-center gap-2">
											{backup.location === "Cloud" ? (
												<Cloud className="w-4 h-4 text-[var(--cl-brand-600)]" />
											) : (
												<Server className="w-4 h-4 text-[var(--cl-text-2)]" />
											)}
											<span className="text-sm text-[var(--cl-text)]">{backup.location}</span>
										</div>
									</td>
									<td className="py-4 px-6">
										<span
											className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded ${getStatusColor(
												backup.status
											)}`}
										>
											{getStatusIcon(backup.status)}
											{backup.status}
										</span>
									</td>
									<td className="py-4 px-6">
										<div className="flex items-center gap-2">
											<button
												onClick={() => handleDownloadBackup(backup.id)}
												className="p-1.5 hover:bg-[var(--cl-surface-2)] rounded transition-colors"
												title="Download"
											>
												<Download className="w-4 h-4 text-[var(--cl-text-2)]" />
											</button>
											<button
												onClick={() => handleRestoreBackup(backup.id)}
												className="p-1.5 hover:bg-[var(--cl-surface-2)] rounded transition-colors"
												title="Restore"
											>
												<RefreshCw className="w-4 h-4 text-[var(--cl-brand-600)]" />
											</button>
											<button
												onClick={() => handleDeleteBackup(backup.id)}
												className="p-1.5 hover:bg-[var(--cl-surface-2)] rounded transition-colors"
												title="Delete"
											>
												<Trash2 className="w-4 h-4 text-[var(--cl-down)]" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Create Backup Modal */}
			{showCreateBackupModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
					<div className="bg-[var(--cl-surface)] rounded-lg max-w-md w-full">
						<div className="p-6 border-b border-[var(--cl-line)]">
							<h2 className="text-xl font-bold text-[var(--cl-text)]">Create Backup</h2>
							<p className="text-sm text-[var(--cl-text-2)] mt-1">Create a new system backup</p>
						</div>

						<div className="p-6 space-y-4">
							<div className="p-4 bg-[var(--cl-info-soft)] border border-[var(--cl-brand-200)] rounded-lg">
								<div className="flex items-start gap-3">
									<Database className="w-5 h-5 text-[var(--cl-brand-600)] mt-0.5" />
									<div>
										<p className="text-sm font-medium text-[var(--cl-info)]">Full Backup</p>
										<p className="text-xs text-[var(--cl-brand-700)] mt-1">
											This will create a complete backup of your database, files, and configuration.
										</p>
									</div>
								</div>
							</div>

							<div className="space-y-2 text-sm">
								<div className="flex items-center justify-between">
									<span className="text-[var(--cl-text-2)]">Estimated Size:</span>
									<span className="font-medium text-[var(--cl-text)]">2.4 GB</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-[var(--cl-text-2)]">Estimated Time:</span>
									<span className="font-medium text-[var(--cl-text)]">5-10 minutes</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-[var(--cl-text-2)]">Storage Location:</span>
									<span className="font-medium text-[var(--cl-text)]">{cloudBackup ? "Cloud" : "Local"}</span>
								</div>
							</div>
						</div>

						<div className="p-6 border-t border-[var(--cl-line)] flex items-center justify-end gap-3">
							<button
								onClick={() => setShowCreateBackupModal(false)}
								disabled={isCreatingBackup}
								className="px-4 py-2 text-[var(--cl-text-2)] bg-[var(--cl-surface)] border border-[var(--cl-line)] rounded-lg hover:bg-[var(--cl-bg)] transition-colors disabled:opacity-50"
							>
								Cancel
							</button>
							<button
								onClick={handleCreateBackup}
								disabled={isCreatingBackup}
								className="px-4 py-2 bg-[#014F01] text-white rounded-lg hover:bg-[#013d01] transition-colors disabled:opacity-50 flex items-center gap-2"
							>
								{isCreatingBackup ? (
									<>
										<RefreshCw className="w-4 h-4 animate-spin" />
										Creating...
									</>
								) : (
									<>
										<Play className="w-4 h-4" />
										Create Backup
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
