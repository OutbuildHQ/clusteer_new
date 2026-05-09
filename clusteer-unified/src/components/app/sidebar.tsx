"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Logo } from "@/components/brand/logo";
import { getUserWallet } from "@/lib/api/wallet/queries";
import { useUserId } from "@/hooks/use-user-id";
import { getKYCVerification } from "@/lib/api/settings";
import {
	LayoutDashboard, Wallet, ArrowLeftRight, Send, ArrowDownToLine,
	Banknote, BookOpen, List, ShieldCheck, Bell, Gift, Settings, HelpCircle,
} from "lucide-react";

const NAV = [
	{ id: "dashboard",               href: "/dashboard",               label: "Overview",      icon: LayoutDashboard, tab: true },
	{ id: "assets",                   href: "/assets",                  label: "Wallet",        icon: Wallet, tab: true },
	{ id: "trade",                    href: "/trade",                   label: "Buy / Sell",    icon: ArrowLeftRight, tab: true },
	{ id: "send",                     href: "/send",                    label: "Send",          icon: Send, tab: true },
	{ id: "receive",                  href: "/receive",                 label: "Receive",       icon: ArrowDownToLine },
	{ id: "withdraw",                 href: "/withdraw",                label: "Withdraw NGN",  icon: Banknote },
	{ id: "orders",                   href: "/orders",                  label: "Orders",        icon: BookOpen },
	{ id: "transaction-history",      href: "/transaction-history",     label: "Transactions",  icon: List },
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
	const { data: walletData, isLoading } = useQuery({
		queryKey: ["wallet"],
		queryFn: getUserWallet,
		staleTime: 30_000,
	});

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

	const assets = walletData?.walletAssets ?? [];
	const total = assets.reduce((s, a) => s + (a.balance ?? 0), 0);
	// TODO: Replace with real 24h change from API when available
	const change24h = total > 0 ? 2.84 : 0;
	const isUp = change24h >= 0;
	const isEmpty = total === 0 && !isLoading;

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
									? { background: "color-mix(in oklab, var(--c-lime-500) 10%, transparent)", color: "var(--c-lime-500)" }
									: { color: "var(--c-text-2)" }
							}
						>
							<Icon className="size-[18px] shrink-0" />
							<span>{n.label}</span>
						</Link>
					);
				})}
			</nav>

			{/* Portfolio summary card */}
			<div style={{ marginTop: "auto", padding: 20, background: "var(--c-onyx-900)", color: "var(--c-cream)", borderRadius: 14 }}>
				<div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.06em" }}>Portfolio</div>

				{isLoading ? (
					<>
						<div className="animate-pulse rounded-md mt-1" style={{ background: "rgba(255,255,255,0.1)", height: 28, width: 140 }} />
						<div className="animate-pulse rounded-md mt-3" style={{ background: "rgba(255,255,255,0.1)", height: 60, width: 80 }} />
					</>
				) : isEmpty ? (
					<>
						<div style={{ fontSize: 22, fontWeight: 600, marginTop: 2, fontFamily: "var(--f-display)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.025em", opacity: 0.5 }}>
							₦0.00
						</div>
						<div style={{ fontSize: 12, opacity: 0.4, marginTop: 10, lineHeight: 1.4 }}>
							No assets yet.<br />Buy or deposit to get started.
						</div>
					</>
				) : (
					<>
						<div style={{ fontSize: 22, fontWeight: 600, marginTop: 2, fontFamily: "var(--f-display)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.025em" }}>
							₦{total.toLocaleString("en-NG")}
						</div>
						<div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginTop: 10 }}>
							{/* Arrow: up (lime) when positive, down (red) when negative */}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke={isUp ? "var(--c-lime-500)" : "var(--c-down)"}
								strokeWidth="2"
								width="100"
								height="100"
								style={{
									flexShrink: 0,
									transform: isUp ? "none" : "rotate(180deg)",
								}}
							>
								<path d="M12 19V5M5 12l7-7 7 7" />
							</svg>
							<div style={{
								fontSize: 13,
								color: isUp ? "var(--c-lime-500)" : "var(--c-down)",
								fontWeight: 600,
								lineHeight: 1.3,
							}}>
								{isUp ? "+" : ""}{change24h.toFixed(2)}%<br />today
							</div>
						</div>
					</>
				)}
			</div>
		</aside>
	);
}
