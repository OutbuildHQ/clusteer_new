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
				return "bg-green-50 text-green-700 border-green-200";
			case "In Progress":
				return "bg-blue-50 text-blue-700 border-blue-200";
			case "Failed":
				return "bg-red-50 text-red-700 border-red-200";
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
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
					>
						<ArrowLeft className="w-5 h-5 text-gray-600" />
					</button>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">Backup & Data Management</h1>
						<p className="text-sm text-gray-600 mt-1">Manage system backups and data exports</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<button
						onClick={() => setShowScheduleModal(true)}
						className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E9EAEB] text-gray-700 rounded-lg hover:bg-[#FAFAFA] transition-colors"
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
				<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-blue-50 rounded-lg">
							<Database className="w-6 h-6 text-blue-600" />
						</div>
					</div>
					<h3 className="text-sm text-gray-600 font-medium mb-1">Total Backups</h3>
					<p className="text-2xl font-bold text-gray-900">{backups.length}</p>
				</div>

				<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-green-50 rounded-lg">
							<CheckCircle className="w-6 h-6 text-green-600" />
						</div>
					</div>
					<h3 className="text-sm text-gray-600 font-medium mb-1">Completed</h3>
					<p className="text-2xl font-bold text-gray-900">
						{backups.filter((b) => b.status === "Completed").length}
					</p>
				</div>

				<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-purple-50 rounded-lg">
							<HardDrive className="w-6 h-6 text-purple-600" />
						</div>
					</div>
					<h3 className="text-sm text-gray-600 font-medium mb-1">Total Size</h3>
					<p className="text-2xl font-bold text-gray-900">5.1 GB</p>
				</div>

				<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-orange-50 rounded-lg">
							<Clock className="w-6 h-6 text-orange-600" />
						</div>
					</div>
					<h3 className="text-sm text-gray-600 font-medium mb-1">Last Backup</h3>
					<p className="text-sm font-bold text-gray-900">Jan 16, 02:00 AM</p>
				</div>
			</div>

			{/* Backup Settings */}
			<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
						<Settings className="w-5 h-5 text-blue-600" />
					</div>
					<div>
						<h3 className="text-lg font-semibold text-gray-900">Backup Settings</h3>
						<p className="text-sm text-gray-600">Configure automatic backup preferences</p>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="flex items-center justify-between p-4 border border-[#E9EAEB] rounded-lg">
						<div>
							<label className="block text-sm font-medium text-gray-900 mb-1">Automatic Backups</label>
							<p className="text-xs text-gray-500">Enable scheduled automatic backups</p>
						</div>
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={autoBackup}
								onChange={(e) => setAutoBackup(e.target.checked)}
								className="sr-only peer"
							/>
							<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#014F01]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#014F01]"></div>
						</label>
					</div>

					<div className="flex items-center justify-between p-4 border border-[#E9EAEB] rounded-lg">
						<div>
							<label className="block text-sm font-medium text-gray-900 mb-1">Cloud Storage</label>
							<p className="text-xs text-gray-500">Store backups in cloud storage</p>
						</div>
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={cloudBackup}
								onChange={(e) => setCloudBackup(e.target.checked)}
								className="sr-only peer"
							/>
							<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#014F01]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#014F01]"></div>
						</label>
					</div>

					<div className="flex items-center justify-between p-4 border border-[#E9EAEB] rounded-lg">
						<div>
							<label className="block text-sm font-medium text-gray-900 mb-1">Encrypt Backups</label>
							<p className="text-xs text-gray-500">Enable AES-256 encryption</p>
						</div>
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={encryptBackups}
								onChange={(e) => setEncryptBackups(e.target.checked)}
								className="sr-only peer"
							/>
							<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#014F01]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#014F01]"></div>
						</label>
					</div>

					<div className="flex items-center justify-between p-4 border border-[#E9EAEB] rounded-lg">
						<div className="flex-1">
							<label className="block text-sm font-medium text-gray-900 mb-1">Retention Period</label>
							<p className="text-xs text-gray-500">Days to keep backups</p>
						</div>
						<input
							type="number"
							value={retentionDays}
							onChange={(e) => setRetentionDays(Number(e.target.value))}
							min={7}
							max={365}
							className="w-20 px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01] text-sm"
						/>
					</div>
				</div>
			</div>

			{/* Backup Schedules */}
			<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">Backup Schedules</h3>
				<div className="space-y-3">
					{schedules.map((schedule) => (
						<div
							key={schedule.id}
							className="flex items-center justify-between p-4 border border-[#E9EAEB] rounded-lg hover:border-[#014F01]/20 transition-colors"
						>
							<div className="flex items-center gap-4 flex-1">
								<div className="p-3 bg-blue-50 rounded-lg">
									<Clock className="w-5 h-5 text-blue-600" />
								</div>
								<div className="flex-1">
									<h4 className="text-sm font-semibold text-gray-900">{schedule.name}</h4>
									<p className="text-xs text-gray-600 mt-1">
										{schedule.frequency} at {schedule.time} • {schedule.type} • Retention:{" "}
										{schedule.retentionDays} days
									</p>
								</div>
								<label className="relative inline-flex items-center cursor-pointer">
									<input type="checkbox" checked={schedule.enabled} onChange={() => {}} className="sr-only peer" />
									<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#014F01]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#014F01]"></div>
								</label>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Backup History */}
			<div className="bg-white rounded-lg border border-[#E9EAEB]">
				<div className="p-6 border-b border-[#E9EAEB]">
					<h2 className="text-lg font-semibold text-gray-900">Backup History</h2>
					<p className="text-sm text-gray-600 mt-1">View and manage your backups</p>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-[#E9EAEB] bg-gray-50">
								<th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
									Backup Name
								</th>
								<th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">Type</th>
								<th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">Size</th>
								<th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
									Created
								</th>
								<th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
									Location
								</th>
								<th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
									Status
								</th>
								<th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-[#E9EAEB]">
							{backups.map((backup) => (
								<tr key={backup.id} className="hover:bg-[#FAFAFA] transition-colors">
									<td className="py-4 px-6">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-blue-50 rounded-lg">
												<Database className="w-4 h-4 text-blue-600" />
											</div>
											<div>
												<div className="text-sm font-medium text-gray-900">{backup.name}</div>
												<div className="text-xs text-gray-500">Expires: {backup.expiresDate}</div>
											</div>
										</div>
									</td>
									<td className="py-4 px-6">
										<span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded border border-purple-200">
											{backup.type}
										</span>
									</td>
									<td className="py-4 px-6">
										<span className="text-sm text-gray-900">{backup.size}</span>
									</td>
									<td className="py-4 px-6">
										<div className="text-sm text-gray-900">{backup.createdDate}</div>
										<div className="text-xs text-gray-500">{backup.createdTime}</div>
									</td>
									<td className="py-4 px-6">
										<div className="flex items-center gap-2">
											{backup.location === "Cloud" ? (
												<Cloud className="w-4 h-4 text-blue-600" />
											) : (
												<Server className="w-4 h-4 text-gray-600" />
											)}
											<span className="text-sm text-gray-900">{backup.location}</span>
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
												className="p-1.5 hover:bg-gray-100 rounded transition-colors"
												title="Download"
											>
												<Download className="w-4 h-4 text-gray-600" />
											</button>
											<button
												onClick={() => handleRestoreBackup(backup.id)}
												className="p-1.5 hover:bg-gray-100 rounded transition-colors"
												title="Restore"
											>
												<RefreshCw className="w-4 h-4 text-blue-600" />
											</button>
											<button
												onClick={() => handleDeleteBackup(backup.id)}
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

			{/* Create Backup Modal */}
			{showCreateBackupModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
					<div className="bg-white rounded-lg max-w-md w-full">
						<div className="p-6 border-b border-[#E9EAEB]">
							<h2 className="text-xl font-bold text-gray-900">Create Backup</h2>
							<p className="text-sm text-gray-600 mt-1">Create a new system backup</p>
						</div>

						<div className="p-6 space-y-4">
							<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
								<div className="flex items-start gap-3">
									<Database className="w-5 h-5 text-blue-600 mt-0.5" />
									<div>
										<p className="text-sm font-medium text-blue-900">Full Backup</p>
										<p className="text-xs text-blue-700 mt-1">
											This will create a complete backup of your database, files, and configuration.
										</p>
									</div>
								</div>
							</div>

							<div className="space-y-2 text-sm">
								<div className="flex items-center justify-between">
									<span className="text-gray-600">Estimated Size:</span>
									<span className="font-medium text-gray-900">2.4 GB</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-600">Estimated Time:</span>
									<span className="font-medium text-gray-900">5-10 minutes</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-600">Storage Location:</span>
									<span className="font-medium text-gray-900">{cloudBackup ? "Cloud" : "Local"}</span>
								</div>
							</div>
						</div>

						<div className="p-6 border-t border-[#E9EAEB] flex items-center justify-end gap-3">
							<button
								onClick={() => setShowCreateBackupModal(false)}
								disabled={isCreatingBackup}
								className="px-4 py-2 text-gray-700 bg-white border border-[#E9EAEB] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
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
