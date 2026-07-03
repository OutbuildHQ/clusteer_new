"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ArrowLeftRight, BookOpen, Settings } from "lucide-react";

// Mirrors sidebar.tsx's NAV `tab: true` entries — the sidebar hides these on
// mobile specifically because this tab bar is meant to carry them instead.
const TABS = [
	{ id: "dashboard", label: "Home", icon: LayoutDashboard, href: "/dashboard" },
	{ id: "trade", label: "Buy / Sell", icon: ArrowLeftRight, href: "/trade" },
	{ id: "orders", label: "Orders", icon: BookOpen, href: "/orders" },
	{ id: "settings", label: "Me", icon: Settings, href: "/settings" },
];

export function MobileTabBar() {
	const pathname = usePathname();

	return (
		<nav
			className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex"
			style={{
				borderTop: "1px solid var(--c-line)",
				background: "var(--c-surface)",
				paddingBottom: "env(safe-area-inset-bottom, 16px)",
				paddingTop: 8,
				paddingLeft: 8,
				paddingRight: 8,
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
