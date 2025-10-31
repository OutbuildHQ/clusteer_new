"use client";

import { Badge } from "@/components/ui/badge";
import { useUser } from "@/store/user";
import {
	User,
	ShieldCheck,
	Bell,
	CreditCard,
	Lock,
	Settings as SettingsIcon,
} from "lucide-react";
import Link from "next/link";

const SETTINGS_SECTIONS = [
	{
		title: "Profile",
		description:
			"Manage your personal information, avatar, and account details",
		icon: User,
		href: "/settings/profile",
		priority: "high" as const,
	},
	{
		title: "Security",
		description:
			"Configure two-factor authentication, password, and email verification",
		icon: ShieldCheck,
		href: "/settings/security",
		priority: "high" as const,
		badge: true,
	},
	{
		title: "Notifications",
		description:
			"Control email, SMS, and push notification preferences for your account",
		icon: Bell,
		href: "/settings/notifications",
		priority: "high" as const,
	},
	{
		title: "Payment Methods",
		description:
			"Add and manage your bank accounts for deposits and withdrawals",
		icon: CreditCard,
		href: "/settings/payment-methods",
		priority: "high" as const,
	},
	{
		title: "Privacy & Data",
		description:
			"Manage your privacy settings, data sharing preferences, and downloads",
		icon: Lock,
		href: "/settings/privacy",
		priority: "medium" as const,
	},
	{
		title: "Account Management",
		description:
			"View transaction limits, export history, and manage your account status",
		icon: SettingsIcon,
		href: "/settings/account",
		priority: "medium" as const,
	},
];

export default function Page() {
	const user = useUser();
	const is2FAEnabled = user?.twoFactorEnabled || false;
	const isEmailVerified = user?.emailVerified || false;

	return (
		<section className="mt-5 lg:mt-10 pb-[113px] xl:pb-[140px]">
			<header>
				<h1 className="text-[#181D27] font-semibold text-xl lg:text-2xl">
					Settings
				</h1>
				<p className="text-sm lg:text-base text-[#667085] lg:mt-2">
					Manage your account settings and preferences
				</p>
			</header>

			<div className="mt-5 lg:mt-7">
				<ul className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{SETTINGS_SECTIONS.map((section) => {
						const Icon = section.icon;
						const showSecurityBadge =
							section.badge && (!is2FAEnabled || !isEmailVerified);

						return (
							<Link key={section.title} href={section.href}>
								<li className="bg-[#F2F2F0] rounded-2xl border border-[#21241D1A] p-5 w-full h-full hover:border-[#9FE870] transition-colors">
									<div className="flex items-start justify-between mb-3">
										<div className="p-2.5 bg-white rounded-lg border border-[#E9EAEB]">
											<Icon className="w-5 h-5 text-[#0D4222]" />
										</div>
										<div className="flex gap-2">
											{section.priority === "high" && (
												<Badge
													key="priority"
													variant="secondary"
													className="rounded-full h-6 py-1 text-[#0D4222] bg-[#E7F6EC]"
												>
													Priority
												</Badge>
											)}
											{showSecurityBadge && (
												<Badge
													key="action-needed"
													variant="secondary"
													className="rounded-full h-6 py-1 text-orange-700 bg-orange-100"
												>
													Action needed
												</Badge>
											)}
										</div>
									</div>
									<p className="font-semibold text-lg text-[#0D0D0D] mb-2">
										{section.title}
									</p>
									<p className="text-sm text-[#667085] leading-relaxed">
										{section.description}
									</p>
									<span className="text-dark-green text-[15px] font-medium mt-3 inline-block">
										Manage →
									</span>
								</li>
							</Link>
						);
					})}
				</ul>
			</div>
		</section>
	);
}
