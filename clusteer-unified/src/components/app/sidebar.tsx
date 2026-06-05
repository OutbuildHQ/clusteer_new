"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Logo } from "@/components/brand/logo";
import { useUserId } from "@/hooks/use-user-id";
import { getKYCVerification } from "@/lib/api/settings";
import {
	LayoutDashboard, ArrowLeftRight, BookOpen, TrendingUp, List,
	Receipt, ShieldCheck, Bell, Gift, Settings, HelpCircle,
} from "lucide-react";

const NAV = [
	{ id: "dashboard",               href: "/dashboard",               label: "Overview",      icon: LayoutDashboard, tab: true },
	{ id: "trade",                    href: "/trade",                   label: "Buy / Sell",    icon: ArrowLeftRight, tab: true },
	{ id: "orders",                   href: "/orders",                  label: "Orders",        icon: BookOpen, tab: true },
	{ id: "markets",                  href: "/markets",                 label: "Markets",       icon: TrendingUp },
	{ id: "transaction-history",      href: "/transaction-history",     label: "Transactions",  icon: List },
	{ id: "billing",                  href: "/billing",                 label: "Billing",       icon: Receipt },
	{ id: "identity-verification",    href: "/identity-verification",   label: "Identity",      icon: ShieldCheck },
	{ id: "notifications",           href: "/notifications",           label: "Notifications", icon: Bell },
	{ id: "referrals",               href: "/referrals",               label: "Referrals",     icon: Gift },
	{ id: "settings",                href: "/settings",                label: "Settings",      icon: Settings, tab: true },
	{ id: "support",                 href: "/support",                 label: "Support",       icon: HelpCircle },
];

interface SidebarProps {
	mobile?: boolean;
	onNavClick?: () => void;
}

export function Sidebar({ mobile, onNavClick }: SidebarProps) {
	const pathname = usePathname();
	const userId = useUserId();
	const { data: kycData } = useQuery({
		queryKey: ["kyc-status", userId],
		queryFn: () => getKYCVerification(userId!),
		enabled: !!userId,
		staleTime: 300_000,
	});

	const tierLabel = (() => {
		const status = kycData?.status;
		if (status === "approved") return "Tier 2";
		if (status === "pending" || status === "under_review") return "Pending";
		return "Tier 1";
	})();

	return (
		<aside
			className={mobile ? "flex flex-col overflow-y-auto h-full" : "hidden lg:flex lg:w-[248px] shrink-0 flex-col overflow-y-auto"}
			style={{ borderRight: mobile ? "none" : "1px solid var(--c-line)", background: "var(--c-surface)", padding: "18px 14px", height: mobile ? "100%" : "100vh" }}
		>
			{/* Logo header */}
			<div className="flex items-center gap-2.5 px-2 pb-3.5 mb-2" style={{ borderBottom: "1px solid var(--c-line)" }}>
				<Link href="/dashboard" onClick={onNavClick}><Logo /></Link>
				<span
					className="ml-auto inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium"
					style={{ background: "var(--c-surface-2)", color: "var(--c-text-2)", border: "1px solid var(--c-line)" }}
				>
					{tierLabel}
				</span>
			</div>

			{/* Nav items — hide bottom-tab items on mobile */}
			<nav className="flex-1 flex flex-col gap-0.5">
				{NAV.filter(n => !mobile || !n.tab).map((n) => {
					const active = pathname === n.href || pathname.startsWith(n.href + "/");
					const Icon = n.icon;
					return (
						<Link
							key={n.id}
							href={n.href}
							onClick={onNavClick}
							className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium transition-colors ${!active ? "hover:bg-[var(--c-surface-2)] hover:text-[var(--c-text)]" : ""}`}
							style={
								active
									? { background: "var(--sidebar-active-bg)", color: "var(--c-lime-500)" }
									: { color: "var(--c-text-2)" }
							}
						>
							<Icon className="size-[18px] shrink-0" />
							<span>{n.label}</span>
						</Link>
					);
				})}
			</nav>

			{/* Tier + version */}
			<div style={{ marginTop: "auto", padding: 16, background: "var(--c-onyx-900)", color: "var(--c-cream)", borderRadius: 14 }}>
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--c-lime-500)", display: "flex", alignItems: "center", justifyContent: "center" }}>
						<svg viewBox="0 0 24 24" fill="none" stroke="var(--c-onyx-900)" strokeWidth="2" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
					</div>
					<div>
						<div style={{ fontSize: 14, fontWeight: 600 }}>{tierLabel}</div>
						<div style={{ fontSize: 11, opacity: 0.5 }}>Clusteer v2.0</div>
					</div>
				</div>
			</div>
		</aside>
	);
}
