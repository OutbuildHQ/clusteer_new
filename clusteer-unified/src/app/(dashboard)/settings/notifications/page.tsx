"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import { useState, useEffect } from "react";
import { Toast } from "@/components/toast";
import { useUser } from "@/store/user";
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

export default function Page() {
	const user = useUser();
	const [preferences, setPreferences] = useState<NotificationPreferences>({
		email: {
			transactions: true,
			security: true,
			marketing: false,
			orderUpdates: true,
		},
		sms: {
			transactions: false,
			security: true,
			orderUpdates: false,
		},
		push: {
			transactions: true,
			security: true,
			priceAlerts: false,
		},
	});

	const [isSaving, setIsSaving] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchPreferences = async () => {
			if (!user?.id) return;

			try {
				const data = await getNotificationPreferences(user.id);
				setPreferences({
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
				});
			} catch (error) {
				Toast.error("Failed to load notification preferences");
			} finally {
				setIsLoading(false);
			}
		};

		fetchPreferences();
	}, [user?.id]);

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

	const handleSave = async () => {
		if (!user?.id) return;

		setIsSaving(true);
		try {
			await updateNotificationPreferences(user.id, {
				email_transactions: preferences.email.transactions,
				email_security: preferences.email.security,
				email_marketing: preferences.email.marketing,
				email_order_updates: preferences.email.orderUpdates,
				sms_transactions: preferences.sms.transactions,
				sms_security: preferences.sms.security,
				sms_order_updates: preferences.sms.orderUpdates,
				push_transactions: preferences.push.transactions,
				push_security: preferences.push.security,
				push_price_alerts: preferences.push.priceAlerts,
			});
			Toast.success("Notification preferences updated successfully");
		} catch (error) {
			Toast.error("Failed to update notification preferences");
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<section className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8">
				<header className="mb-6">
					<h1 className="text-[#181D27] font-semibold text-xl lg:text-2xl">
						Notification Preferences
					</h1>
					<p className="text-sm lg:text-base text-[#667085] mt-2">
						Loading your preferences...
					</p>
				</header>
			</section>
		);
	}

	return (
		<section className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8">
			<header className="mb-6">
				<h1 className="text-[#181D27] font-semibold text-xl lg:text-2xl">
					Notification Preferences
				</h1>
				<p className="text-sm lg:text-base text-[#667085] mt-2">
					Choose how you want to receive notifications about your account
					activity
				</p>
			</header>

			<div className="space-y-8">
				{/* Email Notifications */}
				<div className="bg-white rounded-2xl border border-[#E9EAEB] p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="p-2 bg-[#E7F6EC] rounded-lg">
							<Mail className="w-5 h-5 text-[#0D4222]" />
						</div>
						<div>
							<h2 className="font-semibold text-lg text-[#0D0D0D]">
								Email Notifications
							</h2>
							<p className="text-sm text-[#667085]">
								Receive updates via email
							</p>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between py-3 border-b border-[#E9EAEB]">
							<div>
								<p className="font-medium text-[#0D0D0D]">
									Transaction confirmations
								</p>
								<p className="text-sm text-[#667085]">
									Get notified when transactions are completed
								</p>
							</div>
							<Switch
								checked={preferences.email.transactions}
								onCheckedChange={() => handleToggle("email", "transactions")}
							/>
						</div>

						<div className="flex items-center justify-between py-3 border-b border-[#E9EAEB]">
							<div>
								<p className="font-medium text-[#0D0D0D]">Security alerts</p>
								<p className="text-sm text-[#667085]">
									Important security updates and login alerts
								</p>
							</div>
							<Switch
								checked={preferences.email.security}
								onCheckedChange={() => handleToggle("email", "security")}
							/>
						</div>

						<div className="flex items-center justify-between py-3 border-b border-[#E9EAEB]">
							<div>
								<p className="font-medium text-[#0D0D0D]">Order updates</p>
								<p className="text-sm text-[#667085]">
									Status changes for your buy and sell orders
								</p>
							</div>
							<Switch
								checked={preferences.email.orderUpdates}
								onCheckedChange={() => handleToggle("email", "orderUpdates")}
							/>
						</div>

						<div className="flex items-center justify-between py-3">
							<div>
								<p className="font-medium text-[#0D0D0D]">
									Marketing and promotions
								</p>
								<p className="text-sm text-[#667085]">
									News, offers, and product updates
								</p>
							</div>
							<Switch
								checked={preferences.email.marketing}
								onCheckedChange={() => handleToggle("email", "marketing")}
							/>
						</div>
					</div>
				</div>

				{/* SMS Notifications */}
				<div className="bg-white rounded-2xl border border-[#E9EAEB] p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="p-2 bg-[#E7F6EC] rounded-lg">
							<MessageSquare className="w-5 h-5 text-[#0D4222]" />
						</div>
						<div>
							<h2 className="font-semibold text-lg text-[#0D0D0D]">
								SMS Notifications
							</h2>
							<p className="text-sm text-[#667085]">
								Get text messages for critical updates
							</p>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between py-3 border-b border-[#E9EAEB]">
							<div>
								<p className="font-medium text-[#0D0D0D]">
									Transaction confirmations
								</p>
								<p className="text-sm text-[#667085]">
									SMS alerts for completed transactions
								</p>
							</div>
							<Switch
								checked={preferences.sms.transactions}
								onCheckedChange={() => handleToggle("sms", "transactions")}
							/>
						</div>

						<div className="flex items-center justify-between py-3 border-b border-[#E9EAEB]">
							<div>
								<p className="font-medium text-[#0D0D0D]">Security alerts</p>
								<p className="text-sm text-[#667085]">
									Critical security notifications via SMS
								</p>
							</div>
							<Switch
								checked={preferences.sms.security}
								onCheckedChange={() => handleToggle("sms", "security")}
							/>
						</div>

						<div className="flex items-center justify-between py-3">
							<div>
								<p className="font-medium text-[#0D0D0D]">Order updates</p>
								<p className="text-sm text-[#667085]">
									SMS for important order status changes
								</p>
							</div>
							<Switch
								checked={preferences.sms.orderUpdates}
								onCheckedChange={() => handleToggle("sms", "orderUpdates")}
							/>
						</div>
					</div>
				</div>

				{/* Push Notifications */}
				<div className="bg-white rounded-2xl border border-[#E9EAEB] p-6 opacity-60">
					<div className="flex items-center gap-3 mb-6">
						<div className="p-2 bg-[#E7F6EC] rounded-lg">
							<Smartphone className="w-5 h-5 text-[#0D4222]" />
						</div>
						<div>
							<h2 className="font-semibold text-lg text-[#0D0D0D]">
								Push Notifications
							</h2>
							<p className="text-sm text-[#667085]">
								Mobile app notifications (coming soon)
							</p>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between py-3 border-b border-[#E9EAEB]">
							<div>
								<p className="font-medium text-[#0D0D0D]">
									Transaction confirmations
								</p>
								<p className="text-sm text-[#667085]">
									Push alerts for transactions
								</p>
							</div>
							<Switch disabled checked={preferences.push.transactions} />
						</div>

						<div className="flex items-center justify-between py-3 border-b border-[#E9EAEB]">
							<div>
								<p className="font-medium text-[#0D0D0D]">Security alerts</p>
								<p className="text-sm text-[#667085]">
									Important security push notifications
								</p>
							</div>
							<Switch disabled checked={preferences.push.security} />
						</div>

						<div className="flex items-center justify-between py-3">
							<div>
								<p className="font-medium text-[#0D0D0D]">Price alerts</p>
								<p className="text-sm text-[#667085]">
									Notifications when prices hit your targets
								</p>
							</div>
							<Switch disabled checked={preferences.push.priceAlerts} />
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-end mt-8">
				<Button
					onClick={handleSave}
					disabled={isSaving}
					className="gradient-border bg-[#11C211] border-[#0a0d120d] text-white h-10 px-6 rounded-full font-semibold"
				>
					{isSaving ? "Saving..." : "Save Preferences"}
				</Button>
			</div>
		</section>
	);
}
