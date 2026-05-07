"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, ArrowLeftRight, Send, User } from "lucide-react";

const TABS = [
	{ id: "home", label: "Home", icon: LayoutDashboard, href: "/dashboard" },
	{ id: "wallet", label: "Wallet", icon: Wallet, href: "/assets" },
	{ id: "trade", label: "Trade", icon: ArrowLeftRight, href: "/trade" },
	{ id: "send", label: "Send", icon: Send, href: "/send" },
	{ id: "me", label: "Me", icon: User, href: "/settings" },
];

export function MobileTabBar() {
	const pathname = usePathname();

	return (
		<nav
			className="lg:hidden flex shrink-0"
			style={{
				borderTop: "1px solid var(--c-line)",
				background: "var(--c-surface)",
				padding: "8px 8px 24px",
				gap: 4,
			}}
		>
			{TABS.map((t) => {
				const active = pathname === t.href || pathname.startsWith(t.href + "/");
				const Icon = t.icon;
				return (
					<Link
						key={t.id}
						href={t.href}
						className="flex flex-1 flex-col items-center gap-1 py-1.5"
						style={{
							color: active ? "var(--c-text)" : "var(--c-text-3)",
							fontSize: 10,
							fontWeight: 600,
							fontFamily: "var(--f-sans)",
							textDecoration: "none",
						}}
					>
						<Icon style={{ width: 22, height: 22 }} />
						<span>{t.label}</span>
					</Link>
				);
			})}
		</nav>
	);
}
