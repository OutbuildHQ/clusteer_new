"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
	LogOut,
	ExternalLink,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const LINKS = [
	{ href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
	{ href: "/admin/users", label: "Users", icon: Users },
	{ href: "/admin/kyc", label: "KYC queue", icon: ShieldCheck, badge: "4" },
	{ href: "/admin/wallets", label: "Wallets", icon: Wallet },
	{ href: "/admin/transactions", label: "Transactions", icon: ArrowLeftRight, badge: "2" },
	{ href: "/admin/reports", label: "Reports", icon: FileBarChart2 },
	{ href: "/admin/audit", label: "Audit log", icon: ScrollText },
	{ href: "/admin/cms", label: "CMS & alerts", icon: FileEdit },
];

export function AdminSidebar() {
	const pathname = usePathname();
	return (
		<aside className="hidden lg:flex lg:w-[260px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
			<div className="flex items-center justify-between px-5 py-5">
				<Link href="/admin"><Logo /></Link>
				<Badge variant="warning" className="text-[10px]">ADMIN</Badge>
			</div>
			<nav className="flex-1 px-3 pb-4">
				<ul className="space-y-0.5">
					{LINKS.map((l) => {
						const active = l.exact ? pathname === l.href : pathname === l.href || pathname.startsWith(l.href + "/");
						return (
							<li key={l.href}>
								<Link
									href={l.href}
									className={cn(
										"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
										active ? "bg-primary text-[var(--c-lime-500)]-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent",
									)}
								>
									<l.icon className="size-[18px] shrink-0" />
									<span className="flex-1">{l.label}</span>
									{l.badge && (
										<span className={cn("rounded-full px-1.5 py-0 text-[10px] font-semibold", active ? "bg-primary-foreground/20 text-[var(--c-lime-500)]-foreground" : "bg-warning-bg text-warning")}>{l.badge}</span>
									)}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
			<div className="border-t border-sidebar-border p-3">
				<Link href="/dashboard" className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-sidebar-accent">
					<ExternalLink className="size-3.5" />Switch to customer view
				</Link>
				<div className="flex items-center gap-3 rounded-lg px-2 py-2">
					<Avatar className="size-9"><AvatarFallback className="bg-warning/10 text-warning text-sm font-semibold">DA</AvatarFallback></Avatar>
					<div className="min-w-0 flex-1">
						<div className="truncate text-sm font-medium">Dayo Adegoke</div>
						<div className="truncate text-xs text-muted-foreground">Ops lead</div>
					</div>
					<Link href="/login" className="rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"><LogOut className="size-4" /></Link>
				</div>
			</div>
		</aside>
	);
}
