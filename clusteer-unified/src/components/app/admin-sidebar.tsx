"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import {
	LayoutDashboard,
	Users,
	ShieldCheck,
	Wallet,
	ArrowLeftRight,
	FileBarChart2,
	ScrollText,
	FileEdit,
	ShoppingCart,
	History,
	Settings,
	Flag,
	Clock,
	LogOut,
	ExternalLink,
	Percent,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { KYC_QUEUE, ADMIN_TXNS } from "@/lib/mock-data";

const pendingKycCount = KYC_QUEUE.filter((k) => k.status === "pending").length;
const flaggedTxnCount = ADMIN_TXNS.filter((t) => t.flagged).length;

const LINKS = [
	{ href: "/admin",               label: "Operations",  icon: LayoutDashboard, exact: true },
	{ href: "/admin/users",          label: "Users",       icon: Users },
	{ href: "/admin/kyc",            label: "KYC queue",   icon: ShieldCheck, badge: pendingKycCount > 0 ? String(pendingKycCount) : undefined, badgeColor: "warn" as const },
	{ href: "/admin/wallets",        label: "Wallet pool", icon: Wallet },
	{ href: "/admin/transactions",   label: "Tx monitor",  icon: ArrowLeftRight, badge: flaggedTxnCount > 0 ? String(flaggedTxnCount) : undefined, badgeColor: "down" as const },
	{ href: "/admin/orders",         label: "Order book",  icon: ShoppingCart },
	{ href: "/admin/fees",           label: "Fees",        icon: Percent },
	{ href: "/admin/compliance",     label: "Compliance",  icon: Flag },
	{ href: "/admin/audit",          label: "Audit log",   icon: History },
	{ href: "/admin/cms",            label: "CMS & alerts", icon: FileEdit },
	{ href: "/admin/reports",        label: "Reports",     icon: FileBarChart2 },
	{ href: "/admin/admins",         label: "Staff",       icon: Users },
	{ href: "/admin/settings",       label: "Settings",    icon: Settings },
];

export function AdminSidebar() {
	const pathname = usePathname();
	const router = useRouter();

	async function handleSignOut() {
		await fetch("/api/auth-firebase/logout", { method: "POST" });
		router.push("/login");
	}

	return (
		<aside
			className="hidden lg:flex lg:w-[260px] shrink-0 flex-col h-screen overflow-hidden"
			style={{
				background: "var(--c-onyx-900)",
				borderRight: "1px solid rgba(244,241,234,0.08)",
				color: "var(--c-cream)",
			}}
		>
			{/* Logo header */}
			<div
				className="flex items-center gap-2.5 px-5 pt-5 pb-4"
				style={{ borderBottom: "1px solid rgba(244,241,234,0.1)", marginBottom: 8 }}
			>
				<Link href="/admin" className="flex items-center gap-2.5 min-w-0 flex-1">
					<Logo />
					<span className="font-semibold text-[15px] tracking-tight text-[var(--c-cream)]">Clusteer</span>
				</Link>
				<span
					className="shrink-0 px-2 py-0.5 rounded-[6px] text-[10px] font-bold tracking-[0.04em]"
					style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}
				>
					ADMIN
				</span>
			</div>

			{/* Nav */}
			<nav className="flex-1 px-3 py-1 overflow-y-auto no-scrollbar">
				<ul className="space-y-0.5">
					{LINKS.map((l) => {
						const active = l.exact ? pathname === l.href : pathname === l.href || pathname.startsWith(l.href + "/");
						const badgeBg = l.badgeColor === "down" ? "var(--c-down)" : l.badgeColor === "warn" ? "var(--c-warn)" : "rgba(244,241,234,0.2)";
						return (
							<li key={l.href}>
								<Link
									href={l.href}
									className="flex items-center gap-[10px] rounded-lg px-[10px] py-2 text-[13.5px] font-medium transition-colors min-h-[40px]"
									style={active
										? { background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }
										: { color: "rgba(244,241,234,0.7)" }
									}
									onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
									onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
								>
									<l.icon className="size-[18px] shrink-0" />
									<span className="flex-1">{l.label}</span>
									{l.badge && (
										<span
											className="h-[18px] min-w-[18px] px-1 rounded-full text-white text-[10px] font-semibold flex items-center justify-center"
											style={{ background: active ? "rgba(0,0,0,0.2)" : badgeBg }}
										>
											{l.badge}
										</span>
									)}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>

			{/* System health chip */}
			<div className="px-3 pb-3">
				<div
					className="rounded-[14px] px-4 py-3"
					style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
				>
					<div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.06em] opacity-60">
						<span className="size-[6px] rounded-full bg-[var(--c-up)]" />
						System healthy
					</div>
					<div className="mt-1.5 tabular-nums text-[13px]" style={{ color: "var(--c-cream)" }}>
						99.98% uptime · 42ms p50
					</div>
				</div>
			</div>

			{/* User footer */}
			<div className="px-3 pb-4" style={{ borderTop: "1px solid rgba(244,241,234,0.1)" }}>
				<Link
					href="/dashboard"
					className="mb-2 mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium transition-colors"
					style={{ color: "rgba(244,241,234,0.5)" }}
					onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "var(--c-cream)"; }}
					onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(244,241,234,0.5)"; }}
				>
					<ExternalLink className="size-3.5" />
					Switch to customer view
				</Link>
				<div className="flex items-center gap-3 rounded-lg px-2 py-2">
					<Avatar className="size-8 shrink-0">
						<AvatarFallback
							className="text-[11px] font-semibold"
							style={{ background: "var(--c-onyx-600)", color: "var(--c-cream)" }}
						>
							EN
						</AvatarFallback>
					</Avatar>
					<div className="min-w-0 flex-1">
						<div className="truncate text-[13px] font-semibold" style={{ color: "var(--c-cream)" }}>Emeka N.</div>
						<div className="truncate text-[11px]" style={{ color: "rgba(244,241,234,0.5)" }}>Compliance Lead</div>
					</div>
					<button
						onClick={handleSignOut}
						title="Sign out"
						className="shrink-0 rounded-lg p-1.5 transition-colors"
						style={{ color: "rgba(244,241,234,0.5)" }}
						onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "var(--c-cream)"; }}
						onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(244,241,234,0.5)"; }}
					>
						<LogOut className="size-4" />
					</button>
				</div>
			</div>
		</aside>
	);
}
