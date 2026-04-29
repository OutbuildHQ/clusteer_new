"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Bell,
	Shield,
	DollarSign,
	Users,
	AlertCircle,
	CheckCircle,
	Mail,
	MessageSquare,
	Smartphone,
	Volume2,
	Save,
	RotateCcw,
} from "lucide-react";
import { useToast } from "@/components/admin/Toast";

interface AlertSetting {
	id: string;
	category: "security" | "transactions" | "users" | "system";
	name: string;
	description: string;
	enabled: boolean;
	channels: {
		email: boolean;
		sms: boolean;
		push: boolean;
		sound: boolean;
	};
	threshold?: {
		enabled: boolean;
		value: number;
		unit: string;
	};
}

export default function AlertSettingsPage() {
	const router = useRouter();
	const toast = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);
	const [alerts, setAlerts] = useState<AlertSetting[]>([
		{
			id: "sec-1",
			category: "security",
			name: "Failed Login Attempts",
			description: "Alert when a user has multiple failed login attempts",
			enabled: true,
			channels: { email: true, sms: true, push: true, sound: true },
			threshold: { enabled: true, value: 3, unit: "attempts" },
		},
		{
			id: "sec-2",
			category: "security",
			name: "Suspicious Activity",
			description: "Alert when suspicious user behavior is detected",
			enabled: true,
			channels: { email: true, sms: false, push: true, sound: true },
		},
		{
			id: "sec-3",
			category: "security",
			name: "Admin Account Access",
			description: "Alert when admin accounts are accessed",
			enabled: true,
			channels: { email: true, sms: true, push: false, sound: false },
		},
		{
			id: "txn-1",
			category: "transactions",
			name: "High Value Transactions",
			description: "Alert for transactions exceeding threshold",
			enabled: true,
			channels: { email: true, sms: true, push: true, sound: false },
			threshold: { enabled: true, value: 10000, unit: "USD" },
		},
		{
			id: "txn-2",
			category: "transactions",
			name: "Failed Transactions",
			description: "Alert when transactions fail",
			enabled: false,
			channels: { email: true, sms: false, push: true, sound: false },
		},
		{
			id: "txn-3",
			category: "transactions",
			name: "Unusual Transaction Volume",
			description: "Alert when transaction volume spikes abnormally",
			enabled: true,
			channels: { email: true, sms: false, push: true, sound: true },
			threshold: { enabled: true, value: 150, unit: "%" },
		},
		{
			id: "usr-1",
			category: "users",
			name: "New User Registrations",
			description: "Alert for every new user registration",
			enabled: false,
			channels: { email: true, sms: false, push: false, sound: false },
		},
		{
			id: "usr-2",
			category: "users",
			name: "KYC Submissions",
			description: "Alert when users submit KYC documents",
			enabled: true,
			channels: { email: true, sms: false, push: true, sound: false },
		},
		{
			id: "sys-1",
			category: "system",
			name: "System Errors",
			description: "Alert for critical system errors",
			enabled: true,
			channels: { email: true, sms: true, push: true, sound: true },
		},
		{
			id: "sys-2",
			category: "system",
			name: "Low Liquidity",
			description: "Alert when wallet liquidity falls below threshold",
			enabled: true,
			channels: { email: true, sms: true, push: false, sound: false },
			threshold: { enabled: true, value: 100000, unit: "USD" },
		},
		{
			id: "sys-3",
			category: "system",
			name: "Backup Completion",
			description: "Alert when system backups complete",
			enabled: true,
			channels: { email: true, sms: false, push: false, sound: false },
		},
	]);

	const getCategoryIcon = (category: AlertSetting["category"]) => {
		switch (category) {
			case "security":
				return Shield;
			case "transactions":
				return DollarSign;
			case "users":
				return Users;
			case "system":
				return AlertCircle;
		}
	};

	const getCategoryColor = (category: AlertSetting["category"]) => {
		switch (category) {
			case "security":
				return "text-[var(--cl-down)] bg-[var(--cl-down-soft)]";
			case "transactions":
				return "text-[var(--cl-up)] bg-[var(--cl-up-soft)]";
			case "users":
				return "text-[var(--cl-brand-600)] bg-[var(--cl-info-soft)]";
			case "system":
				return "text-orange-600 bg-orange-50";
		}
	};

	const groupedAlerts = {
		security: alerts.filter((a) => a.category === "security"),
		transactions: alerts.filter((a) => a.category === "transactions"),
		users: alerts.filter((a) => a.category === "users"),
		system: alerts.filter((a) => a.category === "system"),
	};

	const toggleAlert = (id: string) => {
		setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, enabled: !alert.enabled } : alert)));
		setHasChanges(true);
	};

	const toggleChannel = (id: string, channel: keyof AlertSetting["channels"]) => {
		setAlerts(
			alerts.map((alert) =>
				alert.id === id ? { ...alert, channels: { ...alert.channels, [channel]: !alert.channels[channel] } } : alert
			)
		);
		setHasChanges(true);
	};

	const updateThreshold = (id: string, value: number) => {
		setAlerts(
			alerts.map((alert) =>
				alert.id === id && alert.threshold ? { ...alert, threshold: { ...alert.threshold, value } } : alert
			)
		);
		setHasChanges(true);
	};

	const handleSave = async () => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));
			console.log("Saving alert settings:", alerts);
			toast.success('Settings saved', 'Alert settings have been updated successfully');
			setHasChanges(false);
		} catch (error) {
			toast.error('Save failed', 'An error occurred while saving settings');
		} finally {
			setIsLoading(false);
		}
	};

	const handleReset = () => {
		// Reset to original values
		setHasChanges(false);
	};

	const renderAlertGroup = (category: keyof typeof groupedAlerts, title: string) => {
		const Icon = getCategoryIcon(category);
		const categoryAlerts = groupedAlerts[category];

		return (
			<div className="bg-[var(--cl-surface)] rounded-lg border border-[var(--cl-line)] p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(category)}`}>
						<Icon className="w-5 h-5" />
					</div>
					<div>
						<h3 className="text-lg font-semibold text-[var(--cl-text)]">{title}</h3>
						<p className="text-sm text-[var(--cl-text-2)]">{categoryAlerts.length} alert(s) configured</p>
					</div>
				</div>

				<div className="space-y-4">
					{categoryAlerts.map((alert) => (
						<div
							key={alert.id}
							className="p-4 border border-[var(--cl-line)] rounded-lg hover:border-[#014F01]/20 transition-colors"
						>
							<div className="flex items-start justify-between mb-3">
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-1">
										<h4 className="text-sm font-semibold text-[var(--cl-text)]">{alert.name}</h4>
										{alert.enabled && (
											<span className="px-2 py-0.5 bg-[var(--cl-up-soft)] text-[var(--cl-up)] text-xs font-medium rounded">
												Active
											</span>
										)}
									</div>
									<p className="text-sm text-[var(--cl-text-2)]">{alert.description}</p>
								</div>
								<label className="relative inline-flex items-center cursor-pointer ml-4">
									<input
										type="checkbox"
										checked={alert.enabled}
										onChange={() => toggleAlert(alert.id)}
										className="sr-only peer"
									/>
									<div className="w-11 h-6 bg-[var(--cl-surface-2)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#014F01]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-[var(--cl-surface)] after:border-[var(--cl-line)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#014F01]"></div>
								</label>
							</div>

							{alert.enabled && (
								<div className="space-y-3 pt-3 border-t border-[var(--cl-line)] animate-in fade-in slide-in-from-top-2 duration-200">
									{/* Threshold Settings */}
									{alert.threshold && (
										<div className="flex items-center gap-3 p-3 bg-[var(--cl-bg)] rounded-lg">
											<div className="flex-1">
												<label className="block text-xs font-medium text-[var(--cl-text-2)] mb-1">Threshold</label>
												<div className="flex items-center gap-2">
													<input
														type="number"
														value={alert.threshold.value}
														onChange={(e) => updateThreshold(alert.id, Number(e.target.value))}
														className="w-24 px-2 py-1 text-sm border border-[var(--cl-line)] rounded focus:outline-none focus:ring-2 focus:ring-[#014F01]"
													/>
													<span className="text-sm text-[var(--cl-text-2)]">{alert.threshold.unit}</span>
												</div>
											</div>
										</div>
									)}

									{/* Notification Channels */}
									<div>
										<label className="block text-xs font-medium text-[var(--cl-text-2)] mb-2">Notification Channels</label>
										<div className="grid grid-cols-4 gap-2">
											<button
												onClick={() => toggleChannel(alert.id, "email")}
												className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
													alert.channels.email
														? "bg-[#014F01] text-white border-[#014F01]"
														: "bg-[var(--cl-surface)] text-[var(--cl-text-2)] border-[var(--cl-line)] hover:border-[#014F01]"
												}`}
											>
												<Mail className="w-4 h-4" />
												<span className="text-xs font-medium">Email</span>
											</button>
											<button
												onClick={() => toggleChannel(alert.id, "sms")}
												className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
													alert.channels.sms
														? "bg-[#014F01] text-white border-[#014F01]"
														: "bg-[var(--cl-surface)] text-[var(--cl-text-2)] border-[var(--cl-line)] hover:border-[#014F01]"
												}`}
											>
												<MessageSquare className="w-4 h-4" />
												<span className="text-xs font-medium">SMS</span>
											</button>
											<button
												onClick={() => toggleChannel(alert.id, "push")}
												className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
													alert.channels.push
														? "bg-[#014F01] text-white border-[#014F01]"
														: "bg-[var(--cl-surface)] text-[var(--cl-text-2)] border-[var(--cl-line)] hover:border-[#014F01]"
												}`}
											>
												<Smartphone className="w-4 h-4" />
												<span className="text-xs font-medium">Push</span>
											</button>
											<button
												onClick={() => toggleChannel(alert.id, "sound")}
												className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
													alert.channels.sound
														? "bg-[#014F01] text-white border-[#014F01]"
														: "bg-[var(--cl-surface)] text-[var(--cl-text-2)] border-[var(--cl-line)] hover:border-[#014F01]"
												}`}
											>
												<Volume2 className="w-4 h-4" />
												<span className="text-xs font-medium">Sound</span>
											</button>
										</div>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button onClick={() => router.push("/admin")} className="p-2 hover:bg-[var(--cl-surface-2)] rounded-lg transition-colors">
						<ArrowLeft className="w-5 h-5 text-[var(--cl-text-2)]" />
					</button>
					<div>
						<h1 className="text-2xl font-bold text-[var(--cl-text)]">Alert Settings</h1>
						<p className="text-sm text-[var(--cl-text-2)] mt-1">Configure system notifications and alerts</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{hasChanges && (
						<button
							onClick={handleReset}
							className="flex items-center gap-2 px-4 py-2 bg-[var(--cl-surface)] border border-[var(--cl-line)] text-[var(--cl-text-2)] rounded-lg hover:bg-[var(--cl-bg)] transition-colors"
						>
							<RotateCcw className="w-4 h-4" />
							Reset
						</button>
					)}
					<button
						onClick={handleSave}
						disabled={!hasChanges || isLoading}
						className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
							hasChanges && !isLoading
								? "bg-[#014F01] text-white hover:bg-[#013d01] shadow-sm"
								: "bg-[var(--cl-surface-2)] text-[var(--cl-text-3)] cursor-not-allowed"
						}`}
					>
						<Save className="w-4 h-4" />
						{isLoading ? 'Saving...' : 'Save Changes'}
					</button>
				</div>
			</div>

			{/* Unsaved Changes Banner */}
			{hasChanges && (
				<div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between animate-in slide-in-from-top duration-300">
					<div className="flex items-center gap-3">
						<AlertCircle className="w-5 h-5 text-orange-600" />
						<div>
							<p className="text-sm font-medium text-orange-900">You have unsaved changes</p>
							<p className="text-xs text-orange-700">Don't forget to save your alert configuration</p>
						</div>
					</div>
				</div>
			)}

			{/* Alert Groups */}
			<div className="space-y-6">
				{renderAlertGroup("security", "Security Alerts")}
				{renderAlertGroup("transactions", "Transaction Alerts")}
				{renderAlertGroup("users", "User Alerts")}
				{renderAlertGroup("system", "System Alerts")}
			</div>

			{/* Test Alerts Section */}
			<div className="bg-[var(--cl-surface)] rounded-lg border border-[var(--cl-line)] p-6">
				<h3 className="text-lg font-semibold text-[var(--cl-text)] mb-4">Test Alerts</h3>
				<p className="text-sm text-[var(--cl-text-2)] mb-4">
					Send a test notification to verify your alert configuration is working correctly.
				</p>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
					<button className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--cl-surface)] border border-[var(--cl-line)] text-[var(--cl-text-2)] rounded-lg hover:bg-[var(--cl-bg)] transition-colors">
						<Mail className="w-4 h-4" />
						Test Email
					</button>
					<button className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--cl-surface)] border border-[var(--cl-line)] text-[var(--cl-text-2)] rounded-lg hover:bg-[var(--cl-bg)] transition-colors">
						<MessageSquare className="w-4 h-4" />
						Test SMS
					</button>
					<button className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--cl-surface)] border border-[var(--cl-line)] text-[var(--cl-text-2)] rounded-lg hover:bg-[var(--cl-bg)] transition-colors">
						<Smartphone className="w-4 h-4" />
						Test Push
					</button>
					<button className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--cl-surface)] border border-[var(--cl-line)] text-[var(--cl-text-2)] rounded-lg hover:bg-[var(--cl-bg)] transition-colors">
						<Volume2 className="w-4 h-4" />
						Test Sound
					</button>
				</div>
			</div>
		</div>
	);
}
