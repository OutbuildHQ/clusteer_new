"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Settings as SettingsIcon,
	Shield,
	Bell,
	Database,
	Key,
	Globe,
	DollarSign,
	Users,
	Mail,
	Lock,
	ChevronRight,
	Save,
	AlertCircle,
	CheckCircle,
	RefreshCw,
	Download,
	Upload,
	Zap,
	Clock,
	Server,
	FileText,
} from "lucide-react";
import { useToast } from "@/components/admin/Toast";

export default function SettingsPage() {
	const router = useRouter();
	const toast = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);

	// General Settings
	const [platformName, setPlatformName] = useState("Clusteer");
	const [supportEmail, setSupportEmail] = useState("support@clusteer.com");
	const [maintenanceMode, setMaintenanceMode] = useState(false);

	// Security Settings
	const [twoFactorRequired, setTwoFactorRequired] = useState(true);
	const [sessionTimeout, setSessionTimeout] = useState(30);
	const [maxLoginAttempts, setMaxLoginAttempts] = useState(3);

	// Transaction Settings
	const [minTransactionAmount, setMinTransactionAmount] = useState(10);
	const [maxTransactionAmount, setMaxTransactionAmount] = useState(50000);
	const [dailyLimit, setDailyLimit] = useState(100000);
	const [transactionFee, setTransactionFee] = useState(2.5);

	// KYC Settings
	const [autoApproveKYC, setAutoApproveKYC] = useState(false);
	const [kycExpiryDays, setKycExpiryDays] = useState(365);

	// Email Settings
	const [emailNotifications, setEmailNotifications] = useState(true);
	const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
	const [smtpPort, setSmtpPort] = useState(587);

	const handleSave = async () => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));
			console.log("Saving settings...");
			toast.success('Settings saved', 'System settings have been updated successfully');
			setHasChanges(false);
		} catch (error) {
			toast.error('Save failed', 'An error occurred while saving settings');
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (setter: (value: any) => void) => (value: any) => {
		setter(value);
		setHasChanges(true);
	};

	const settingsSections = [
		{
			icon: SettingsIcon,
			title: "General Settings",
			description: "Basic platform configuration",
			color: "text-blue-600 bg-blue-50",
			settings: [
				{
					label: "Platform Name",
					value: platformName,
					onChange: handleInputChange(setPlatformName),
					type: "text" as const,
				},
				{
					label: "Support Email",
					value: supportEmail,
					onChange: handleInputChange(setSupportEmail),
					type: "email" as const,
				},
				{
					label: "Maintenance Mode",
					value: maintenanceMode,
					onChange: handleInputChange(setMaintenanceMode),
					type: "toggle" as const,
					description: "Disable user access for maintenance",
				},
			],
		},
		{
			icon: Shield,
			title: "Security Settings",
			description: "Authentication and security policies",
			color: "text-red-600 bg-red-50",
			settings: [
				{
					label: "Require 2FA for All Users",
					value: twoFactorRequired,
					onChange: handleInputChange(setTwoFactorRequired),
					type: "toggle" as const,
				},
				{
					label: "Session Timeout (minutes)",
					value: sessionTimeout,
					onChange: handleInputChange(setSessionTimeout),
					type: "number" as const,
					min: 5,
					max: 120,
				},
				{
					label: "Max Login Attempts",
					value: maxLoginAttempts,
					onChange: handleInputChange(setMaxLoginAttempts),
					type: "number" as const,
					min: 1,
					max: 10,
				},
			],
		},
		{
			icon: DollarSign,
			title: "Transaction Settings",
			description: "Limits and fees configuration",
			color: "text-green-600 bg-green-50",
			settings: [
				{
					label: "Minimum Transaction Amount (USD)",
					value: minTransactionAmount,
					onChange: handleInputChange(setMinTransactionAmount),
					type: "number" as const,
					min: 1,
				},
				{
					label: "Maximum Transaction Amount (USD)",
					value: maxTransactionAmount,
					onChange: handleInputChange(setMaxTransactionAmount),
					type: "number" as const,
					min: 100,
				},
				{
					label: "Daily Transaction Limit (USD)",
					value: dailyLimit,
					onChange: handleInputChange(setDailyLimit),
					type: "number" as const,
					min: 1000,
				},
				{
					label: "Transaction Fee (%)",
					value: transactionFee,
					onChange: handleInputChange(setTransactionFee),
					type: "number" as const,
					min: 0,
					max: 10,
					step: 0.1,
				},
			],
		},
		{
			icon: Users,
			title: "KYC Settings",
			description: "Know Your Customer configuration",
			color: "text-purple-600 bg-purple-50",
			settings: [
				{
					label: "Auto-Approve KYC",
					value: autoApproveKYC,
					onChange: handleInputChange(setAutoApproveKYC),
					type: "toggle" as const,
					description: "Automatically approve KYC submissions (not recommended)",
				},
				{
					label: "KYC Document Expiry (days)",
					value: kycExpiryDays,
					onChange: handleInputChange(setKycExpiryDays),
					type: "number" as const,
					min: 30,
					max: 730,
				},
			],
		},
		{
			icon: Mail,
			title: "Email Settings",
			description: "SMTP and email configuration",
			color: "text-orange-600 bg-orange-50",
			settings: [
				{
					label: "Enable Email Notifications",
					value: emailNotifications,
					onChange: handleInputChange(setEmailNotifications),
					type: "toggle" as const,
				},
				{
					label: "SMTP Host",
					value: smtpHost,
					onChange: handleInputChange(setSmtpHost),
					type: "text" as const,
				},
				{
					label: "SMTP Port",
					value: smtpPort,
					onChange: handleInputChange(setSmtpPort),
					type: "number" as const,
					min: 1,
					max: 65535,
				},
			],
		},
	];

	const quickActions = [
		{
			icon: Bell,
			label: "Alert Settings",
			description: "Configure system alerts",
			onClick: () => router.push("/admin/settings/alerts"),
			color: "text-blue-600",
		},
		{
			icon: Key,
			label: "API Keys",
			description: "Manage API keys",
			onClick: () => router.push("/admin/settings/api-keys"),
			color: "text-purple-600",
		},
		{
			icon: Database,
			label: "Backup & Data",
			description: "Manage backups",
			onClick: () => router.push("/admin/settings/backup"),
			color: "text-green-600",
		},
		{
			icon: Zap,
			label: "Integrations",
			description: "Third-party services",
			onClick: () => router.push("/admin/settings/integrations"),
			color: "text-orange-600",
		},
		{
			icon: FileText,
			label: "Audit Logs",
			description: "View activity logs",
			onClick: () => router.push("/admin/settings/audit-logs"),
			color: "text-red-600",
		},
		{
			icon: RefreshCw,
			label: "Clear Cache",
			description: "Reset system cache",
			onClick: () => console.log("Clearing cache..."),
			color: "text-gray-600",
		},
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
					<p className="text-sm text-gray-600 mt-1">Manage platform configuration and preferences</p>
				</div>
				<button
					onClick={handleSave}
					disabled={!hasChanges || isLoading}
					className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
						hasChanges && !isLoading
							? "bg-[#014F01] text-white hover:bg-[#013d01] shadow-sm"
							: "bg-gray-100 text-gray-400 cursor-not-allowed"
					}`}
				>
					<Save className="w-4 h-4" />
					{isLoading ? 'Saving...' : 'Save All Changes'}
				</button>
			</div>

			{/* Unsaved Changes Banner */}
			{hasChanges && (
				<div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center gap-3 animate-in slide-in-from-top duration-300">
					<AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
					<div>
						<p className="text-sm font-medium text-orange-900">You have unsaved changes</p>
						<p className="text-xs text-orange-700">Don't forget to save your configuration</p>
					</div>
				</div>
			)}

			{/* Quick Actions */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{quickActions.map((action, idx) => {
					const Icon = action.icon;
					return (
						<button
							key={idx}
							onClick={action.onClick}
							className="bg-white rounded-lg border border-[#E9EAEB] p-4 text-left hover:border-[#014F01]/20 hover:shadow-md transition-all group"
						>
							<div className="flex items-center gap-3 mb-2">
								<div className={`w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-[#E7F6EC] transition-colors`}>
									<Icon className={`w-5 h-5 ${action.color}`} />
								</div>
								<ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
							</div>
							<h3 className="text-sm font-semibold text-gray-900">{action.label}</h3>
							<p className="text-xs text-gray-600 mt-1">{action.description}</p>
						</button>
					);
				})}
			</div>

			{/* Settings Sections */}
			<div className="space-y-6">
				{settingsSections.map((section, sectionIdx) => {
					const Icon = section.icon;
					return (
						<div key={sectionIdx} className="bg-white rounded-lg border border-[#E9EAEB] p-6">
							<div className="flex items-center gap-3 mb-6">
								<div className={`w-10 h-10 rounded-lg flex items-center justify-center ${section.color}`}>
									<Icon className="w-5 h-5" />
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
									<p className="text-sm text-gray-600">{section.description}</p>
								</div>
							</div>

							<div className="space-y-4">
								{section.settings.map((setting, settingIdx) => (
									<div
										key={settingIdx}
										className="flex items-center justify-between p-4 border border-[#E9EAEB] rounded-lg hover:border-[#014F01]/20 transition-colors"
									>
										<div className="flex-1">
											<label className="block text-sm font-medium text-gray-900 mb-1">{setting.label}</label>
											{'description' in setting && setting.description && (
												<p className="text-xs text-gray-500">{setting.description}</p>
											)}
										</div>
										<div className="ml-4">
											{setting.type === "toggle" ? (
												<label className="relative inline-flex items-center cursor-pointer">
													<input
														type="checkbox"
														checked={setting.value as boolean}
														onChange={(e) => setting.onChange(e.target.checked)}
														className="sr-only peer"
													/>
													<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#014F01]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#014F01]"></div>
												</label>
											) : (
												<input
													type={setting.type}
													value={setting.value as string | number}
													onChange={(e) =>
														setting.onChange(
															setting.type === "number" ? Number(e.target.value) : e.target.value
														)
													}
													min={'min' in setting ? setting.min : undefined}
													max={'max' in setting ? setting.max : undefined}
													step={'step' in setting ? setting.step : undefined}
													className="w-32 px-3 py-2 border border-[#E9EAEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F01] text-sm"
												/>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					);
				})}
			</div>

			{/* System Information */}
			<div className="bg-white rounded-lg border border-[#E9EAEB] p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
						<Server className="w-5 h-5 text-gray-600" />
					</div>
					<div>
						<h3 className="text-lg font-semibold text-gray-900">System Information</h3>
						<p className="text-sm text-gray-600">Platform status and metrics</p>
					</div>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="p-4 bg-gray-50 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<CheckCircle className="w-4 h-4 text-green-600" />
							<span className="text-xs font-medium text-gray-600">Status</span>
						</div>
						<p className="text-sm font-semibold text-gray-900">Online</p>
					</div>
					<div className="p-4 bg-gray-50 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Clock className="w-4 h-4 text-blue-600" />
							<span className="text-xs font-medium text-gray-600">Uptime</span>
						</div>
						<p className="text-sm font-semibold text-gray-900">99.8%</p>
					</div>
					<div className="p-4 bg-gray-50 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Database className="w-4 h-4 text-purple-600" />
							<span className="text-xs font-medium text-gray-600">DB Size</span>
						</div>
						<p className="text-sm font-semibold text-gray-900">2.4 GB</p>
					</div>
					<div className="p-4 bg-gray-50 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<Zap className="w-4 h-4 text-orange-600" />
							<span className="text-xs font-medium text-gray-600">Version</span>
						</div>
						<p className="text-sm font-semibold text-gray-900">v2.1.0</p>
					</div>
				</div>

				<div className="mt-4 pt-4 border-t border-gray-100">
					<div className="flex items-center justify-between text-sm">
						<span className="text-gray-600">Last backup:</span>
						<span className="font-medium text-gray-900">Jan 16, 2025 02:00 AM</span>
					</div>
					<div className="flex items-center justify-between text-sm mt-2">
						<span className="text-gray-600">Last deployment:</span>
						<span className="font-medium text-gray-900">Jan 15, 2025 10:30 PM</span>
					</div>
				</div>
			</div>
		</div>
	);
}
