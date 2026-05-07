"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { ASSETS } from "@/lib/mock-data";
import {
	LayoutDashboard, Wallet, ArrowLeftRight, Send, ArrowDownToLine,
	Banknote, BookOpen, List, ShieldCheck, Bell, Gift, Settings, HelpCircle,
} from "lucide-react";

const NAV = [
	{ id: "dashboard",               href: "/dashboard",               label: "Overview",      icon: LayoutDashboard },
	{ id: "assets",                   href: "/assets",                  label: "Wallet",        icon: Wallet },
	{ id: "trade",                    href: "/trade",                   label: "Buy / Sell",    icon: ArrowLeftRight },
	{ id: "send",                     href: "/send",                    label: "Send",          icon: Send },
	{ id: "receive",                  href: "/receive",                 label: "Receive",       icon: ArrowDownToLine },
	{ id: "withdraw",                 href: "/withdraw",                label: "Withdraw NGN",  icon: Banknote },
	{ id: "orders",                   href: "/orders",                  label: "Orders",        icon: BookOpen },
	{ id: "transaction-history",      href: "/transaction-history",     label: "Transactions",  icon: List },
	{ id: "identity-verification",    href: "/identity-verification",   label: "Identity",      icon: ShieldCheck },
	{ id: "notifications",           href: "/notifications",           label: "Notifications", icon: Bell, badge: 3 },
	{ id: "referrals",               href: "/referrals",               label: "Referrals",     icon: Gift },
	{ id: "settings",                href: "/settings",                label: "Settings",      icon: Settings },
	{ id: "support",                 href: "/support",                 label: "Support",       icon: HelpCircle },
];

interface SidebarProps {
	mobile?: boolean;
	onNavClick?: () => void;
}

export function Sidebar({ mobile, onNavClick }: SidebarProps) {
	const pathname = usePathname();
	const total = ASSETS.reduce((s, a) => s + a.balanceNgn, 0);

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
					Tier 2
				</span>
			</div>

			{/* Nav items */}
			<nav className="flex-1 flex flex-col gap-0.5">
				{NAV.map((n) => {
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
									? { background: "var(--c-onyx-900)", color: "var(--c-cream)" }
									: { color: "var(--c-text-2)" }
							}
						>
							<Icon className="size-[18px] shrink-0" />
							<span>{n.label}</span>
							{n.badge && (
								<span
									className="ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-[10px] font-semibold"
									style={{ background: "var(--c-down)", color: "#fff" }}
								>
									{n.badge}
								</span>
							)}
						</Link>
					);
				})}
			</nav>

			{/* Portfolio summary card */}
			<div style={{ marginTop: "auto", padding: 20, background: "var(--c-onyx-900)", color: "var(--c-cream)", borderRadius: 14 }}>
				<div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.06em" }}>Portfolio</div>
				<div style={{ fontSize: 22, fontWeight: 600, marginTop: 2, fontFamily: "var(--f-display)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.025em" }}>
					₦{total.toLocaleString("en-NG")}
				</div>
				<div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginTop: 10 }}>
					<svg viewBox="0 0 24 24" fill="none" stroke="var(--c-lime-500)" strokeWidth="2" width="100" height="100" style={{ flexShrink: 0 }}><path d="M12 19V5M5 12l7-7 7 7" /></svg>
					<div style={{ fontSize: 13, color: "var(--c-lime-500)", fontWeight: 600, lineHeight: 1.3 }}>
						+2.84%<br />today
					</div>
				</div>
			</div>
		</aside>
	);
}
