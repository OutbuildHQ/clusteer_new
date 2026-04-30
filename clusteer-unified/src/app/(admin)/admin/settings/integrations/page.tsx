"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Zap,
	CheckCircle,
	XCircle,
	Settings,
	ExternalLink,
	Bell,
	Mail,
	MessageSquare,
	DollarSign,
	Shield,
	Database,
	Cloud,
	Smartphone,
	Globe,
	Code,
	Webhook,
} from "lucide-react";

interface Integration {
	id: string;
	name: string;
	category: "Payment" | "Communication" | "Analytics" | "Security" | "Storage" | "Other";
	description: string;
	icon: React.ReactNode;
	color: string;
	status: "Connected" | "Not Connected" | "Error";
	connectedDate?: string;
	lastSync?: string;
	features: string[];
	configUrl?: string;
}

export default function IntegrationsPage() {
	const router = useRouter();
	const [selectedCategory, setSelectedCategory] = useState<string>("All");
	const [showConfigModal, setShowConfigModal] = useState<Integration | null>(null);

	const [integrations, setIntegrations] = useState<Integration[]>([
		{
			id: "int-1",
			name: "Paystack",
			category: "Payment",
			description: "Accept payments via Paystack payment gateway",
			icon: <DollarSign className="w-6 h-6" />,
			color: "bg-primary/10 text-primary",
			status: "Connected",
			connectedDate: "2024-12-01",
			lastSync: "2025-01-16 10:30 AM",
			features: ["Card Payments", "Bank Transfers", "USSD", "Mobile Money"],
			configUrl: "/admin/settings/integrations/paystack",
		},
		{
			id: "int-2",
			name: "Flutterwave",
			category: "Payment",
			description: "Process payments with Flutterwave",
			icon: <DollarSign className="w-6 h-6" />,
			color: "bg-orange-50 text-orange-600",
			status: "Not Connected",
			features: ["Card Payments", "Bank Transfers", "Mobile Money", "Crypto"],
		},
		{
			id: "int-3",
			name: "Twilio SMS",
			category: "Communication",
			description: "Send SMS notifications via Twilio",
			icon: <MessageSquare className="w-6 h-6" />,
			color: "bg-danger/10 text-danger",
			status: "Connected",
			connectedDate: "2024-11-15",
			lastSync: "2025-01-16 09:15 AM",
			features: ["SMS", "2FA Codes", "Alerts", "Bulk Messaging"],
			configUrl: "/admin/settings/integrations/twilio",
		},
		{
			id: "int-4",
			name: "SendGrid",
			category: "Communication",
			description: "Email delivery service for transactional emails",
			icon: <Mail className="w-6 h-6" />,
			color: "bg-primary/10 text-primary",
			status: "Connected",
			connectedDate: "2024-10-20",
			lastSync: "2025-01-16 08:00 AM",
			features: ["Transactional Emails", "Templates", "Analytics", "API"],
			configUrl: "/admin/settings/integrations/sendgrid",
		},
		{
			id: "int-5",
			name: "Firebase",
			category: "Other",
			description: "Firebase for authentication and real-time database",
			icon: <Database className="w-6 h-6" />,
			color: "bg-warning/10 text-warning",
			status: "Connected",
			connectedDate: "2024-09-01",
			lastSync: "2025-01-16 10:45 AM",
			features: ["Authentication", "Cloud Storage", "Push Notifications", "Analytics"],
			configUrl: "/admin/settings/integrations/firebase",
		},
		{
			id: "int-6",
			name: "OneSignal",
			category: "Communication",
			description: "Push notifications for web and mobile",
			icon: <Bell className="w-6 h-6" />,
			color: "bg-purple-50 text-purple-600",
			status: "Not Connected",
			features: ["Push Notifications", "In-App Messages", "Email", "SMS"],
		},
		{
			id: "int-7",
			name: "Cloudflare",
			category: "Security",
			description: "CDN and DDoS protection",
			icon: <Shield className="w-6 h-6" />,
			color: "bg-orange-50 text-orange-600",
			status: "Connected",
			connectedDate: "2024-08-15",
			lastSync: "2025-01-16 11:00 AM",
			features: ["CDN", "DDoS Protection", "SSL", "DNS"],
			configUrl: "/admin/settings/integrations/cloudflare",
		},
		{
			id: "int-8",
			name: "AWS S3",
			category: "Storage",
			description: "Cloud object storage for files and backups",
			icon: <Cloud className="w-6 h-6" />,
			color: "bg-orange-50 text-orange-600",
			status: "Not Connected",
			features: ["File Storage", "Backups", "CDN", "Versioning"],
		},
		{
			id: "int-9",
			name: "Google Analytics",
			category: "Analytics",
			description: "Web analytics and reporting",
			icon: <Globe className="w-6 h-6" />,
			color: "bg-warning/10 text-warning",
			status: "Connected",
			connectedDate: "2024-12-05",
			lastSync: "2025-01-16 10:00 AM",
			features: ["Traffic Analytics", "User Behavior", "Conversions", "Reports"],
			configUrl: "/admin/settings/integrations/analytics",
		},
		{
			id: "int-10",
			name: "Sentry",
			category: "Other",
			description: "Error tracking and performance monitoring",
			icon: <Code className="w-6 h-6" />,
			color: "bg-purple-50 text-purple-600",
			status: "Not Connected",
			features: ["Error Tracking", "Performance", "Alerts", "Debugging"],
		},
		{
			id: "int-11",
			name: "Webhooks",
			category: "Other",
			description: "Custom webhook endpoints for events",
			icon: <Webhook className="w-6 h-6" />,
			color: "bg-success/10 text-success",
			status: "Connected",
			connectedDate: "2024-11-01",
			lastSync: "2025-01-16 09:30 AM",
			features: ["Event Notifications", "Custom Endpoints", "Retries", "Logs"],
			configUrl: "/admin/settings/integrations/webhooks",
		},
		{
			id: "int-12",
			name: "Slack",
			category: "Communication",
			description: "Team notifications and alerts in Slack",
			icon: <MessageSquare className="w-6 h-6" />,
			color: "bg-purple-50 text-purple-600",
			status: "Not Connected",
			features: ["Notifications", "Alerts", "Bot Integration", "Channels"],
		},
	]);

	const categories = ["All", "Payment", "Communication", "Analytics", "Security", "Storage", "Other"];

	const filteredIntegrations =
		selectedCategory === "All"
			? integrations
			: integrations.filter((int) => int.category === selectedCategory);

	const connectedCount = integrations.filter((int) => int.status === "Connected").length;
	const errorCount = integrations.filter((int) => int.status === "Error").length;

	const getStatusColor = (status: Integration["status"]) => {
		switch (status) {
			case "Connected":
				return "bg-success/10 text-success border-success";
			case "Not Connected":
				return "bg-background text-muted-foreground border-border";
			case "Error":
				return "bg-danger/10 text-danger border-danger";
		}
	};

	const getStatusIcon = (status: Integration["status"]) => {
		switch (status) {
			case "Connected":
				return <CheckCircle className="w-4 h-4" />;
			case "Not Connected":
				return <XCircle className="w-4 h-4" />;
			case "Error":
				return <XCircle className="w-4 h-4" />;
		}
	};

	const handleToggleIntegration = (integrationId: string) => {
		setIntegrations(
			integrations.map((int) => {
				if (int.id === integrationId) {
					if (int.status === "Connected") {
						return { ...int, status: "Not Connected" as const };
					} else {
						return {
							...int,
							status: "Connected" as const,
							connectedDate: new Date().toISOString().split("T")[0],
							lastSync: new Date().toLocaleString("en-US", {
								year: "numeric",
								month: "2-digit",
								day: "2-digit",
								hour: "2-digit",
								minute: "2-digit",
							}),
						};
					}
				}
				return int;
			})
		);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button
						onClick={() => router.push("/admin/settings")}
						className="p-2 hover:bg-muted rounded-lg transition-colors"
					>
						<ArrowLeft className="w-5 h-5 text-muted-foreground" />
					</button>
					<div>
						<h1 className="text-2xl font-bold text-foreground">Integrations</h1>
						<p className="text-sm text-muted-foreground mt-1">Connect and manage third-party services</p>
					</div>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-card rounded-lg border border-border p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-primary/10 rounded-lg">
							<Zap className="w-6 h-6 text-primary" />
						</div>
					</div>
					<h3 className="text-sm text-muted-foreground font-medium mb-1">Total Integrations</h3>
					<p className="text-2xl font-bold text-foreground">{integrations.length}</p>
				</div>

				<div className="bg-card rounded-lg border border-border p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-success/10 rounded-lg">
							<CheckCircle className="w-6 h-6 text-success" />
						</div>
					</div>
					<h3 className="text-sm text-muted-foreground font-medium mb-1">Connected</h3>
					<p className="text-2xl font-bold text-foreground">{connectedCount}</p>
				</div>

				<div className="bg-card rounded-lg border border-border p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-background rounded-lg">
							<XCircle className="w-6 h-6 text-muted-foreground" />
						</div>
					</div>
					<h3 className="text-sm text-muted-foreground font-medium mb-1">Available</h3>
					<p className="text-2xl font-bold text-foreground">{integrations.length - connectedCount}</p>
				</div>

				<div className="bg-card rounded-lg border border-border p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-danger/10 rounded-lg">
							<XCircle className="w-6 h-6 text-danger" />
						</div>
					</div>
					<h3 className="text-sm text-muted-foreground font-medium mb-1">Errors</h3>
					<p className="text-2xl font-bold text-foreground">{errorCount}</p>
				</div>
			</div>

			{/* Category Filter */}
			<div className="bg-card rounded-lg border border-border p-4">
				<div className="flex items-center gap-2 overflow-x-auto">
					{categories.map((category) => (
						<button
							key={category}
							onClick={() => setSelectedCategory(category)}
							className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
								selectedCategory === category
									? "bg-primary text-white"
									: "bg-muted text-muted-foreground hover:bg-muted"
							}`}
						>
							{category}
						</button>
					))}
				</div>
			</div>

			{/* Integrations Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredIntegrations.map((integration) => (
					<div
						key={integration.id}
						className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-all"
					>
						<div className="flex items-start justify-between mb-4">
							<div className={`p-3 rounded-lg ${integration.color}`}>{integration.icon}</div>
							<span
								className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded ${getStatusColor(
									integration.status
								)}`}
							>
								{getStatusIcon(integration.status)}
								{integration.status}
							</span>
						</div>

						<h3 className="text-lg font-semibold text-foreground mb-2">{integration.name}</h3>
						<p className="text-sm text-muted-foreground mb-4">{integration.description}</p>

						<div className="mb-4">
							<span className="text-xs font-medium text-muted-foreground uppercase">Features</span>
							<div className="flex flex-wrap gap-1 mt-2">
								{integration.features.slice(0, 3).map((feature, idx) => (
									<span
										key={idx}
										className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded border border-border"
									>
										{feature}
									</span>
								))}
								{integration.features.length > 3 && (
									<span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded border border-border">
										+{integration.features.length - 3}
									</span>
								)}
							</div>
						</div>

						{integration.status === "Connected" && (
							<div className="mb-4 text-xs text-muted-foreground">
								<div className="flex items-center justify-between">
									<span>Connected:</span>
									<span className="font-medium text-muted-foreground">{integration.connectedDate}</span>
								</div>
								<div className="flex items-center justify-between mt-1">
									<span>Last Sync:</span>
									<span className="font-medium text-muted-foreground">{integration.lastSync}</span>
								</div>
							</div>
						)}

						<div className="flex items-center gap-2">
							{integration.status === "Connected" ? (
								<>
									{integration.configUrl && (
										<button
											onClick={() => setShowConfigModal(integration)}
											className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border text-muted-foreground rounded-lg hover:bg-background transition-colors"
										>
											<Settings className="w-4 h-4" />
											Configure
										</button>
									)}
									<button
										onClick={() => handleToggleIntegration(integration.id)}
										className="flex-1 px-4 py-2 bg-danger/10 border border-danger text-danger rounded-lg hover:bg-danger/10 transition-colors"
									>
										Disconnect
									</button>
								</>
							) : (
								<button
									onClick={() => handleToggleIntegration(integration.id)}
									className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
								>
									Connect
								</button>
							)}
						</div>
					</div>
				))}
			</div>

			{/* Configuration Modal */}
			{showConfigModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
					<div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6 border-b border-border">
							<div className="flex items-center gap-3">
								<div className={`p-3 rounded-lg ${showConfigModal.color}`}>{showConfigModal.icon}</div>
								<div>
									<h2 className="text-xl font-bold text-foreground">{showConfigModal.name} Configuration</h2>
									<p className="text-sm text-muted-foreground mt-1">{showConfigModal.description}</p>
								</div>
							</div>
						</div>

						<div className="p-6">
							<div className="space-y-4">
								<div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
									<p className="text-sm text-primary">
										Configuration options for {showConfigModal.name} would be displayed here. This includes
										API keys, webhook URLs, and other settings specific to this integration.
									</p>
								</div>

								<div>
									<h3 className="text-sm font-semibold text-foreground mb-3">Features</h3>
									<div className="grid grid-cols-2 gap-2">
										{showConfigModal.features.map((feature, idx) => (
											<div
												key={idx}
												className="flex items-center gap-2 p-3 bg-background rounded-lg border border-border"
											>
												<CheckCircle className="w-4 h-4 text-success" />
												<span className="text-sm text-foreground">{feature}</span>
											</div>
										))}
									</div>
								</div>

								<div>
									<h3 className="text-sm font-semibold text-foreground mb-3">Connection Status</h3>
									<div className="space-y-2 text-sm">
										<div className="flex items-center justify-between p-3 bg-background rounded-lg">
											<span className="text-muted-foreground">Status:</span>
											<span className="font-medium text-success">Connected</span>
										</div>
										<div className="flex items-center justify-between p-3 bg-background rounded-lg">
											<span className="text-muted-foreground">Connected Since:</span>
											<span className="font-medium text-foreground">{showConfigModal.connectedDate}</span>
										</div>
										<div className="flex items-center justify-between p-3 bg-background rounded-lg">
											<span className="text-muted-foreground">Last Sync:</span>
											<span className="font-medium text-foreground">{showConfigModal.lastSync}</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="p-6 border-t border-border flex items-center justify-between">
							<button
								onClick={() => setShowConfigModal(null)}
								className="px-4 py-2 text-muted-foreground bg-card border border-border rounded-lg hover:bg-background transition-colors"
							>
								Close
							</button>
							<div className="flex items-center gap-2">
								<button className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-muted-foreground rounded-lg hover:bg-background transition-colors">
									<ExternalLink className="w-4 h-4" />
									Documentation
								</button>
								<button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
									Save Changes
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
