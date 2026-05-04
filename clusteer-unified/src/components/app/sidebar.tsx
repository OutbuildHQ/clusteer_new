"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { useAuth } from "@/stores/auth";

const LINKS = [
	{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/assets", label: "Assets", icon: Wallet },
	{ href: "/trade", label: "Trade", icon: ArrowLeftRight },
	{ href: "/send", label: "Send", icon: Send },
	{ href: "/receive", label: "Receive", icon: Download },
	{ href: "/transaction-history", label: "Transactions", icon: Clock },
	{ href: "/identity-verification", label: "Identity", icon: ShieldCheck },
];

const SECONDARY = [
	{ href: "/settings", label: "Settings", icon: Settings },
	{ href: "/support", label: "Support", icon: HelpCircle },
];

export function Sidebar({ className }: { className?: string }) {
	const pathname = usePathname();
	const router = useRouter();
	const signOut = useAuth((s) => s.signOut);

	async function handleSignOut() {
		await fetch("/api/auth-firebase/logout", { method: "POST" });
		signOut();
		router.push("/login");
	}
	return (
		<aside className={cn("hidden lg:flex lg:w-[260px] xl:w-[280px] shrink-0 flex-col border-r-2 border-custom-black bg-background", className)}>
			<div className="px-5 pt-6 pb-5">
				<Link href="/dashboard"><Logo /></Link>
			</div>
			<div className="mx-5 h-[2px] bg-custom-black/10" />
			<nav className="flex-1 px-3 pt-4 pb-4 overflow-y-auto">
				<p className="px-3 pb-2 font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-brand-800">Menu</p>
				<ul className="space-y-0.5">
					{LINKS.map((l) => {
						const active = pathname === l.href || pathname.startsWith(l.href + "/");
						return (
							<li key={l.href}>
								<Link
									href={l.href}
									className={cn(
										"flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium transition-all min-h-[44px]",
										active
											? "bg-custom-black text-light-green shadow-brutal-sm"
											: "text-foreground hover:bg-warm-beige",
									)}
								>
									<l.icon className="size-[18px] shrink-0" />
									{l.label}
								</Link>
							</li>
						);
					})}
				</ul>
				<div className="my-4 mx-2 h-[2px] bg-custom-black/10" />
				<p className="px-3 pb-2 font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-brand-800">Other</p>
				<ul className="space-y-0.5">
					{SECONDARY.map((l) => {
						const active = pathname.startsWith(l.href);
						return (
							<li key={l.href}>
								<Link
									href={l.href}
									className={cn(
										"flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium transition-all min-h-[44px]",
										active
											? "bg-custom-black text-light-green shadow-brutal-sm"
											: "text-foreground hover:bg-warm-beige",
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
			<div className="border-t-2 border-custom-black/10 p-3">
				<div className="flex items-center gap-3 rounded-2xl bg-warm-beige/60 px-3 py-2.5">
					<Avatar className="size-9 border-2 border-custom-black shrink-0">
						<AvatarFallback className="bg-custom-black text-light-green text-sm font-semibold">
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
					<button onClick={handleSignOut} className="rounded-full border-2 border-custom-black p-1.5 text-muted-foreground hover:bg-custom-black hover:text-light-green transition-colors shrink-0" title="Sign out">
						<LogOut className="size-4" />
					</button>
				</div>
			</div>
		</aside>
	);
}
