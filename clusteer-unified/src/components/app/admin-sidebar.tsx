"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import {
	LayoutDashboard,
	Users,
	ShieldCheck,
	ArrowLeftRight,
	Percent,
	Flag,
	Clock,
	FileEdit,
	BarChart3,
	UsersRound,
	Settings,
	ExternalLink,
	LogOut,
} from "lucide-react";

const NAV = [
	{ href: "/admin", label: "Operations", icon: LayoutDashboard, exact: true },
	{ href: "/admin/users", label: "Users", icon: Users },
	{ href: "/admin/kyc", label: "KYC queue", icon: ShieldCheck, badge: "4", badgeColor: "var(--c-warn)" },
	{ href: "/admin/transactions", label: "Tx monitor", icon: ArrowLeftRight },
	{ href: "/admin/orders", label: "Orders", icon: ArrowLeftRight },
	{ href: "/admin/fees", label: "Fees", icon: Percent },
	{ href: "/admin/compliance", label: "Compliance", icon: Flag, badge: "4", badgeColor: "var(--c-down)" },
	{ href: "/admin/audit", label: "Audit log", icon: Clock },
	{ href: "/admin/cms", label: "CMS", icon: FileEdit },
	{ href: "/admin/reports", label: "Reports", icon: BarChart3 },
	{ href: "/admin/staff", label: "Staff", icon: UsersRound },
	{ href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
	const pathname = usePathname();

	return (
		<aside
			className="hidden lg:flex shrink-0 flex-col overflow-y-auto"
			style={{
				width: 248,
				height: "100vh",
				background: "var(--c-onyx-900)",
				color: "var(--c-cream)",
				padding: "18px 14px",
				gap: 6,
				borderRight: "1px solid var(--c-line)",
			}}
		>
			{/* Logo */}
			<div
				style={{
					display: "flex", alignItems: "center", gap: 10,
					padding: "4px 8px 14px",
					borderBottom: "1px solid rgba(244,241,234,0.1)",
					marginBottom: 8,
				}}
			>
				<Link href="/admin"><Logo monogramOnly className="h-6 w-6" /></Link>
				<span style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-0.02em", color: "var(--c-cream)" }}>Clusteer</span>
				<span
					style={{
						marginLeft: "auto", fontSize: 10,
						padding: "2px 8px", borderRadius: 6,
						background: "var(--c-lime-500)", color: "var(--c-onyx-900)",
						fontWeight: 700, letterSpacing: "0.04em",
					}}
				>
					ADMIN
				</span>
			</div>

			{/* Nav */}
			<nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
				{NAV.map((n) => {
					const active = n.exact
						? pathname === n.href
						: pathname === n.href || pathname.startsWith(n.href + "/");
					return (
						<Link
							key={n.href}
							href={n.href}
							style={{
								display: "flex", alignItems: "center", gap: 10,
								padding: "8px 12px", borderRadius: 10,
								fontSize: 13.5, fontWeight: 500,
								textDecoration: "none",
								color: active ? "var(--c-onyx-900)" : "rgba(244,241,234,0.7)",
								background: active ? "var(--c-lime-500)" : "transparent",
								transition: "background 0.15s, color 0.15s",
							}}
						>
							<n.icon size={18} />
							<span style={{ flex: 1 }}>{n.label}</span>
							{n.badge && (
								<span
									style={{
										fontSize: 10, padding: "1px 6px", borderRadius: 999,
										background: n.badgeColor || "var(--c-warn)",
										color: "#fff", fontWeight: 600,
									}}
								>
									{n.badge}
								</span>
							)}
						</Link>
					);
				})}
			</nav>

			{/* System health footer */}
			<div
				style={{
					marginTop: "auto",
					padding: 14, borderRadius: 14,
					background: "rgba(255,255,255,0.04)",
					border: "1px solid rgba(255,255,255,0.06)",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
					<span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--c-up)" }} />
					System healthy
				</div>
				<div style={{ fontSize: 13, marginTop: 4, color: "var(--c-cream)", fontVariantNumeric: "tabular-nums" }}>
					99.98% uptime · 42ms p50
				</div>
			</div>

			{/* Bottom */}
			<div style={{ borderTop: "1px solid rgba(244,241,234,0.1)", paddingTop: 12, marginTop: 8 }}>
				<Link
					href="/dashboard"
					style={{
						display: "flex", alignItems: "center", gap: 6,
						padding: "6px 8px", borderRadius: 8,
						fontSize: 12, fontWeight: 500, textDecoration: "none",
						color: "rgba(244,241,234,0.5)",
					}}
				>
					<ExternalLink size={14} />
					Switch to customer view
				</Link>
				<div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 8px 0", marginTop: 4 }}>
					<div
						style={{
							width: 36, height: 36, borderRadius: "50%",
							background: "rgba(244,241,234,0.1)",
							display: "flex", alignItems: "center", justifyContent: "center",
							fontSize: 13, fontWeight: 600, color: "var(--c-cream)",
						}}
					>
						EN
					</div>
					<div style={{ flex: 1, minWidth: 0 }}>
						<div style={{ fontSize: 13, fontWeight: 600, color: "var(--c-cream)" }}>Emeka N.</div>
						<div style={{ fontSize: 11, color: "rgba(244,241,234,0.5)" }}>Compliance Lead</div>
					</div>
					<Link href="/login" style={{ color: "rgba(244,241,234,0.4)", display: "flex" }}>
						<LogOut size={16} />
					</Link>
				</div>
			</div>
		</aside>
	);
}
