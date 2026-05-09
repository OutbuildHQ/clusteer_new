"use client";

import { DotIcon, Mail, ShieldCheck, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/store/user";

function StatusBadge({ enabled }: { enabled: boolean }) {
	return (
		<span
			style={{
				display: "inline-flex",
				alignItems: "center",
				borderRadius: "9999px",
				height: 24,
				padding: "0 10px",
				fontSize: 12,
				fontWeight: 500,
				color: enabled ? "var(--c-up)" : "var(--c-text-3)",
				background: enabled ? "var(--c-up-soft)" : "var(--c-surface-2)",
			}}
		>
			<DotIcon
				style={{ color: enabled ? "var(--c-up)" : "var(--c-text-3)" }}
				strokeWidth={8}
				size={16}
			/>
			{enabled ? "Enabled" : "Disabled"}
		</span>
	);
}

function SecurityCard({
	href,
	icon,
	title,
	description,
	enabled,
	actionLabel,
	disabled,
}: {
	href?: string;
	icon: React.ReactNode;
	title: string;
	description: string;
	enabled: boolean;
	actionLabel: string;
	disabled?: boolean;
}) {
	const card = (
		<div
			className="rounded-[14px] p-5 w-full xl:max-w-[435px] shrink-0 space-y-3 transition-colors"
			style={{
				background: "var(--c-surface)",
				border: "1px solid var(--c-line)",
				opacity: disabled ? 0.55 : 1,
			}}
		>
			<div className="flex items-center justify-between">
				<div
					className="size-11 rounded-[10px] flex items-center justify-center"
					style={{ background: "var(--c-surface-2)", color: "var(--c-text-2)" }}
				>
					{icon}
				</div>
				<StatusBadge enabled={enabled} />
			</div>
			<div>
				<p className="font-semibold text-[15px]" style={{ color: "var(--c-text)" }}>
					{title}
				</p>
				<p className="text-[13px] mt-1 leading-relaxed" style={{ color: "var(--c-text-3)" }}>
					{description}
				</p>
			</div>
			<span
				className="text-[13.5px] font-semibold"
				style={{ color: disabled ? "var(--c-text-3)" : "var(--c-lime-500)" }}
			>
				{actionLabel}
			</span>
		</div>
	);

	if (!href || disabled) return card;
	return (
		<Link href={href} className="block hover:no-underline">
			{card}
		</Link>
	);
}

export default function SecurityPage() {
	const user = useUser();
	const is2FAEnabled = user?.twoFactorEnabled || false;
	const isEmailVerified = user?.emailVerified || false;

	return (
		<section className="space-y-8 pb-24">
			<div>
				<h1 className="text-[22px] font-semibold" style={{ color: "var(--c-text)", letterSpacing: "-0.03em" }}>
					Security
				</h1>
				<p className="mt-1 text-[13.5px]" style={{ color: "var(--c-text-2)" }}>
					Configure your verification methods to keep your account protected.
				</p>
			</div>

			{/* 2FA */}
			<div>
				<p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-4" style={{ color: "var(--c-text-3)" }}>
					Two-Factor Authentication
				</p>
				<div className="flex flex-col lg:flex-row flex-wrap gap-4">
					<SecurityCard
						href="/security/google-auth"
						icon={<Image src="/assets/images/google-auth.png" alt="Google Authenticator" width={28} height={28} />}
						title="Google Authenticator"
						description="Use Google Authenticator codes to secure your account and transactions. Recommended method."
						enabled={is2FAEnabled}
						actionLabel={is2FAEnabled ? "Manage →" : "Set up →"}
					/>
					<SecurityCard
						href="/security/change-email"
						icon={<Mail className="size-5" />}
						title="Email verification"
						description="Receive a one-time code to your email to confirm sensitive account actions."
						enabled={isEmailVerified}
						actionLabel={isEmailVerified ? "Change →" : "Verify →"}
					/>
					<SecurityCard
						icon={<ShieldCheck className="size-5" />}
						title="Phone number verification"
						description="Confirm sensitive actions with an SMS code sent to your registered phone number."
						enabled={false}
						actionLabel="Coming soon"
						disabled
					/>
				</div>
			</div>

			{/* Advanced */}
			<div>
				<p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-4" style={{ color: "var(--c-text-3)" }}>
					Advanced Security
				</p>
				<div className="flex flex-col lg:flex-row flex-wrap gap-4">
					<SecurityCard
						href="/security/change-password"
						icon={<Lock className="size-5" />}
						title="Login password"
						description="Your login password protects account access. Changing it disables payments and withdrawals for 24 hours."
						enabled={true}
						actionLabel="Change →"
					/>
				</div>
			</div>
		</section>
	);
}
