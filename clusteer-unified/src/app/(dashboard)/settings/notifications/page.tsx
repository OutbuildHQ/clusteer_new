"use client";

import { Mail, MessageSquare, Smartphone } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUserId } from "@/hooks/use-user-id";
import {
	getNotificationPreferences,
	updateNotificationPreferences,
	type NotificationPreferences as APINotificationPreferences,
} from "@/lib/api/settings";

interface NotificationPreferences {
	email: {
		transactions: boolean;
		security: boolean;
		marketing: boolean;
		orderUpdates: boolean;
	};
	sms: {
		transactions: boolean;
		security: boolean;
		orderUpdates: boolean;
	};
	push: {
		transactions: boolean;
		security: boolean;
		priceAlerts: boolean;
	};
}

function mapApiToLocal(data: APINotificationPreferences): NotificationPreferences {
	return {
		email: {
			transactions: data.email_transactions,
			security: data.email_security,
			marketing: data.email_marketing,
			orderUpdates: data.email_order_updates,
		},
		sms: {
			transactions: data.sms_transactions,
			security: data.sms_security,
			orderUpdates: data.sms_order_updates,
		},
		push: {
			transactions: data.push_transactions,
			security: data.push_security,
			priceAlerts: data.push_price_alerts,
		},
	};
}

function mapLocalToApi(prefs: NotificationPreferences): APINotificationPreferences {
	return {
		email_transactions: prefs.email.transactions,
		email_security: prefs.email.security,
		email_marketing: prefs.email.marketing,
		email_order_updates: prefs.email.orderUpdates,
		sms_transactions: prefs.sms.transactions,
		sms_security: prefs.sms.security,
		sms_order_updates: prefs.sms.orderUpdates,
		push_transactions: prefs.push.transactions,
		push_security: prefs.push.security,
		push_price_alerts: prefs.push.priceAlerts,
	};
}

const DEFAULT_PREFS: NotificationPreferences = {
	email: { transactions: true, security: true, marketing: false, orderUpdates: true },
	sms: { transactions: false, security: true, orderUpdates: false },
	push: { transactions: true, security: true, priceAlerts: false },
};

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange?: () => void; disabled?: boolean }) {
	return (
		<div
			role="switch"
			aria-checked={checked}
			onClick={disabled ? undefined : onChange}
			style={{
				width: "44px",
				height: "24px",
				borderRadius: "9999px",
				background: checked ? "var(--c-accent, #9FE870)" : "var(--c-border, #d1d5db)",
				cursor: disabled ? "not-allowed" : "pointer",
				opacity: disabled ? 0.5 : 1,
				position: "relative",
				transition: "background 0.2s",
				flexShrink: 0,
			}}
		>
			<div
				style={{
					position: "absolute",
					top: "2px",
					left: checked ? "22px" : "2px",
					width: "20px",
					height: "20px",
					borderRadius: "9999px",
					background: "#fff",
					transition: "left 0.2s",
					boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
				}}
			/>
		</div>
	);
}

export default function Page() {
	const userId = useUserId();
	const queryClient = useQueryClient();

	const { data: apiPrefs, isLoading, isError } = useQuery({
		queryKey: ["notification-prefs", userId],
		queryFn: () => getNotificationPreferences(userId!),
		enabled: !!userId,
	});

	const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFS);

	useEffect(() => {
		if (apiPrefs) {
			setPreferences(mapApiToLocal(apiPrefs));
		}
	}, [apiPrefs]);

	const saveMutation = useMutation({
		mutationFn: (prefs: NotificationPreferences) =>
			updateNotificationPreferences(userId!, mapLocalToApi(prefs)),
		onSuccess: () => {
			toast.success("Notification preferences updated successfully");
			queryClient.invalidateQueries({ queryKey: ["notification-prefs", userId] });
		},
		onError: () => {
			toast.error("Failed to update notification preferences");
		},
	});

	const handleToggle = (
		category: keyof NotificationPreferences,
		key: string
	) => {
		setPreferences((prev) => ({
			...prev,
			[category]: {
				...prev[category],
				[key]: !prev[category][key as keyof (typeof prev)[typeof category]],
			},
		}));
	};

	const handleSave = () => {
		if (!userId) return;
		saveMutation.mutate(preferences);
	};

	if (isLoading) {
		return (
			<section className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8">
				<header className="mb-6">
					<h1 className="text-foreground font-semibold text-xl lg:text-2xl">
						Notification Preferences
					</h1>
					<p className="text-sm lg:text-base text-muted-foreground mt-2">
						Loading your preferences...
					</p>
				</header>
			</section>
		);
	}

	if (isError) {
		return (
			<section className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8">
				<header className="mb-6">
					<h1 className="text-foreground font-semibold text-xl lg:text-2xl">
						Notification Preferences
					</h1>
					<p className="text-sm lg:text-base text-muted-foreground mt-2">
						Failed to load preferences. Please refresh the page.
					</p>
				</header>
			</section>
		);
	}

	return (
		<section className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8">
			<header className="mb-6">
				<h1 className="text-foreground font-semibold text-xl lg:text-2xl">
					Notification Preferences
				</h1>
				<p className="text-sm lg:text-base text-muted-foreground mt-2">
					Choose how you want to receive notifications about your account
					activity
				</p>
			</header>

			<div className="space-y-8">
				{/* Email Notifications */}
				<div className="bg-card rounded-2xl border border-border p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="p-2 bg-[var(--c-lime-500)]/10 rounded-lg">
							<Mail className="w-5 h-5 text-[var(--c-lime-500)]" />
						</div>
						<div>
							<h2 className="font-semibold text-lg text-foreground">
								Email Notifications
							</h2>
							<p className="text-sm text-muted-foreground">
								Receive updates via email
							</p>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between py-3 border-b border-border">
							<div>
								<p className="font-medium text-foreground">
									Transaction confirmations
								</p>
								<p className="text-sm text-muted-foreground">
									Get notified when transactions are completed
								</p>
							</div>
							<Toggle
								checked={preferences.email.transactions}
								onChange={() => handleToggle("email", "transactions")}
							/>
						</div>

						<div className="flex items-center justify-between py-3 border-b border-border">
							<div>
								<p className="font-medium text-foreground">Security alerts</p>
								<p className="text-sm text-muted-foreground">
									Important security updates and login alerts
								</p>
							</div>
							<Toggle
								checked={preferences.email.security}
								onChange={() => handleToggle("email", "security")}
							/>
						</div>

						<div className="flex items-center justify-between py-3 border-b border-border">
							<div>
								<p className="font-medium text-foreground">Order updates</p>
								<p className="text-sm text-muted-foreground">
									Status changes for your buy and sell orders
								</p>
							</div>
							<Toggle
								checked={preferences.email.orderUpdates}
								onChange={() => handleToggle("email", "orderUpdates")}
							/>
						</div>

						<div className="flex items-center justify-between py-3">
							<div>
								<p className="font-medium text-foreground">
									Marketing and promotions
								</p>
								<p className="text-sm text-muted-foreground">
									News, offers, and product updates
								</p>
							</div>
							<Toggle
								checked={preferences.email.marketing}
								onChange={() => handleToggle("email", "marketing")}
							/>
						</div>
					</div>
				</div>

				{/* SMS Notifications */}
				<div className="bg-card rounded-2xl border border-border p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="p-2 bg-[var(--c-lime-500)]/10 rounded-lg">
							<MessageSquare className="w-5 h-5 text-[var(--c-lime-500)]" />
						</div>
						<div>
							<h2 className="font-semibold text-lg text-foreground">
								SMS Notifications
							</h2>
							<p className="text-sm text-muted-foreground">
								Get text messages for critical updates
							</p>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between py-3 border-b border-border">
							<div>
								<p className="font-medium text-foreground">
									Transaction confirmations
								</p>
								<p className="text-sm text-muted-foreground">
									SMS alerts for completed transactions
								</p>
							</div>
							<Toggle
								checked={preferences.sms.transactions}
								onChange={() => handleToggle("sms", "transactions")}
							/>
						</div>

						<div className="flex items-center justify-between py-3 border-b border-border">
							<div>
								<p className="font-medium text-foreground">Security alerts</p>
								<p className="text-sm text-muted-foreground">
									Critical security notifications via SMS
								</p>
							</div>
							<Toggle
								checked={preferences.sms.security}
								onChange={() => handleToggle("sms", "security")}
							/>
						</div>

						<div className="flex items-center justify-between py-3">
							<div>
								<p className="font-medium text-foreground">Order updates</p>
								<p className="text-sm text-muted-foreground">
									SMS for important order status changes
								</p>
							</div>
							<Toggle
								checked={preferences.sms.orderUpdates}
								onChange={() => handleToggle("sms", "orderUpdates")}
							/>
						</div>
					</div>
				</div>

				{/* Push Notifications */}
				<div className="bg-card rounded-2xl border border-border p-6 opacity-60">
					<div className="flex items-center gap-3 mb-6">
						<div className="p-2 bg-[var(--c-lime-500)]/10 rounded-lg">
							<Smartphone className="w-5 h-5 text-[var(--c-lime-500)]" />
						</div>
						<div>
							<h2 className="font-semibold text-lg text-foreground">
								Push Notifications
							</h2>
							<p className="text-sm text-muted-foreground">
								Mobile app notifications (coming soon)
							</p>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between py-3 border-b border-border">
							<div>
								<p className="font-medium text-foreground">
									Transaction confirmations
								</p>
								<p className="text-sm text-muted-foreground">
									Push alerts for transactions
								</p>
							</div>
							<Toggle disabled checked={preferences.push.transactions} />
						</div>

						<div className="flex items-center justify-between py-3 border-b border-border">
							<div>
								<p className="font-medium text-foreground">Security alerts</p>
								<p className="text-sm text-muted-foreground">
									Important security push notifications
								</p>
							</div>
							<Toggle disabled checked={preferences.push.security} />
						</div>

						<div className="flex items-center justify-between py-3">
							<div>
								<p className="font-medium text-foreground">Price alerts</p>
								<p className="text-sm text-muted-foreground">
									Notifications when prices hit your targets
								</p>
							</div>
							<Toggle disabled checked={preferences.push.priceAlerts} />
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-end mt-8">
				<button
					onClick={handleSave}
					disabled={saveMutation.isPending}
					style={{
						background: "var(--c-accent, #9FE870)",
						color: "#fff",
						border: "1px solid rgba(0,0,0,0.05)",
						height: "40px",
						padding: "0 24px",
						borderRadius: "9999px",
						fontWeight: 600,
						fontSize: "14px",
						cursor: saveMutation.isPending ? "not-allowed" : "pointer",
						opacity: saveMutation.isPending ? 0.5 : 1,
					}}
				>
					{saveMutation.isPending ? "Saving..." : "Save Preferences"}
				</button>
			</div>
		</section>
	);
}
