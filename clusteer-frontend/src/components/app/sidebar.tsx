"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import {
	LayoutDashboard,
	Wallet,
	ArrowLeftRight,
	Send,
	Download,
	Clock,
	ShieldCheck,
	Settings,
	HelpCircle,
	LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CURRENT_USER } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

const LINKS = [
	{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/assets", label: "Assets", icon: Wallet },
	{ href: "/trade", label: "Trade", icon: ArrowLeftRight },
	{ href: "/send", label: "Send", icon: Send },
	{ href: "/receive", label: "Receive", icon: Download },
	{ href: "/transactions", label: "Transactions", icon: Clock },
	{ href: "/identity-verification", label: "Identity", icon: ShieldCheck },
];

const SECONDARY = [
	{ href: "/settings", label: "Settings", icon: Settings },
	{ href: "/help", label: "Help", icon: HelpCircle },
];

export function Sidebar() {
	const pathname = usePathname();
	return (
		<aside className="hidden lg:flex lg:w-[260px] xl:w-[280px] shrink-0 flex-col border-r border-border bg-sidebar">
			<div className="px-5 py-5">
				<Link href="/dashboard"><Logo /></Link>
			</div>
			<nav className="flex-1 px-3 pb-4">
				<ul className="space-y-0.5">
					{LINKS.map((l) => {
						const active = pathname === l.href || pathname.startsWith(l.href + "/");
						return (
							<li key={l.href}>
								<Link
									href={l.href}
									className={cn(
										"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
										active
											? "bg-primary text-primary-foreground"
											: "text-sidebar-foreground hover:bg-sidebar-accent",
									)}
								>
									<l.icon className="size-[18px] shrink-0" />
									{l.label}
								</Link>
							</li>
						);
					})}
				</ul>
				<div className="my-3 h-px bg-sidebar-border" />
				<ul className="space-y-0.5">
					{SECONDARY.map((l) => {
						const active = pathname.startsWith(l.href);
						return (
							<li key={l.href}>
								<Link
									href={l.href}
									className={cn(
										"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
										active
											? "bg-sidebar-accent text-sidebar-accent-foreground"
											: "text-sidebar-foreground hover:bg-sidebar-accent",
									)}
								>
									<l.icon className="size-[18px] shrink-0" />
									{l.label}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
			<div className="border-t border-sidebar-border p-3">
				<div className="flex items-center gap-3 rounded-lg px-2 py-2">
					<Avatar className="size-9">
						<AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
							{CURRENT_USER.firstName[0]}
						</AvatarFallback>
					</Avatar>
					<div className="min-w-0 flex-1">
						<div className="truncate text-sm font-medium">{CURRENT_USER.name}</div>
						<div className="flex items-center gap-1.5">
							<Badge variant="success" className="px-1.5 py-0 text-[10px]">Tier {CURRENT_USER.kycTier}</Badge>
							<span className="truncate text-xs text-muted-foreground">{CURRENT_USER.email}</span>
						</div>
					</div>
					<Link href="/login" className="rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground" title="Sign out">
						<LogOut className="size-4" />
					</Link>
				</div>
			</div>
		</aside>
	);
}
