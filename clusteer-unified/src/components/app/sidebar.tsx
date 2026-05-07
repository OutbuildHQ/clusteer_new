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
	Landmark,
	BookOpen,
	Clock,
	ShieldCheck,
	Bell,
	Gift,
	Settings,
	HelpCircle,
	LogOut,
	TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CURRENT_USER } from "@/lib/mock-data";
import { useAuth } from "@/stores/auth";

const NAV_MAIN = [
	{ href: "/dashboard",             label: "Overview",       icon: LayoutDashboard },
	{ href: "/assets",                label: "Wallet",         icon: Wallet },
	{ href: "/trade",                 label: "Buy / Sell",     icon: ArrowLeftRight },
	{ href: "/send",                  label: "Send",           icon: Send },
	{ href: "/receive",               label: "Receive",        icon: Download },
	{ href: "/withdraw",              label: "Withdraw NGN",   icon: Landmark },
	{ href: "/orders",                label: "Orders",         icon: BookOpen },
	{ href: "/transaction-history",   label: "Transactions",   icon: Clock },
	{ href: "/identity-verification", label: "Identity",       icon: ShieldCheck },
	{ href: "/notifications",         label: "Notifications",  icon: Bell,   badge: 3 },
	{ href: "/referrals",             label: "Referrals",      icon: Gift },
];

const NAV_SECONDARY = [
	{ href: "/settings", label: "Settings", icon: Settings },
	{ href: "/support",  label: "Support",  icon: HelpCircle },
];

function NavItem({ href, label, icon: Icon, badge, active }: {
	href: string; label: string; icon: React.ElementType; badge?: number; active: boolean;
}) {
	return (
		<li>
			<Link
				href={href}
				className={cn(
					"flex items-center gap-[10px] rounded-lg px-[10px] py-2 text-[13.5px] font-medium transition-colors min-h-[40px]",
					active
						? "bg-[var(--c-onyx-900)] text-[var(--c-cream)] dark:bg-[var(--c-lime-500)] dark:text-[var(--c-onyx-900)]"
						: "text-[var(--c-text-2)] hover:bg-[var(--c-surface-2)] hover:text-[var(--c-text)]",
				)}
			>
				<Icon className="size-[18px] shrink-0" />
				<span className="flex-1">{label}</span>
				{badge != null && (
					<span className="ml-auto h-[18px] min-w-[18px] px-1 rounded-full bg-[var(--c-down)] text-white text-[10px] font-semibold flex items-center justify-center">
						{badge}
					</span>
				)}
			</Link>
		</li>
	);
}

export function Sidebar({ className }: { className?: string }) {
	const pathname = usePathname();
	const router = useRouter();
	const signOut = useAuth((s) => s.signOut);

	const totalNgn = 17_428_500; // TODO: replace with real portfolio total from wallet store

	async function handleSignOut() {
		await fetch("/api/auth-firebase/logout", { method: "POST" });
		signOut();
		router.push("/login");
	}

	return (
		<aside
			className={cn(
				"hidden lg:flex lg:w-[260px] xl:w-[280px] shrink-0 flex-col",
				"border-r border-[var(--c-line)] bg-[var(--c-surface)] h-screen overflow-hidden",
				className,
			)}
		>
			{/* Logo */}
			<div className="flex items-center gap-2.5 px-5 pt-5 pb-4 border-b border-[var(--c-line)]">
				<Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
					<Logo />
					<span className="font-semibold text-[15px] tracking-tight text-[var(--c-text)]">Clusteer</span>
				</Link>
				<span className="ml-auto shrink-0 h-[20px] px-2 rounded-full bg-[var(--c-surface-2)] border border-[var(--c-line)] text-[10.5px] font-semibold text-[var(--c-text-2)]">
					Tier {CURRENT_USER.kycTier}
				</span>
			</div>

			{/* Nav */}
			<nav className="flex-1 px-3 py-3 overflow-y-auto no-scrollbar">
				<ul className="space-y-0.5">
					{NAV_MAIN.map((l) => (
						<NavItem
							key={l.href}
							{...l}
							active={pathname === l.href || pathname.startsWith(l.href + "/")}
						/>
					))}
				</ul>
				<div className="my-3 h-px bg-[var(--c-line)]" />
				<ul className="space-y-0.5">
					{NAV_SECONDARY.map((l) => (
						<NavItem
							key={l.href}
							{...l}
							active={pathname.startsWith(l.href)}
						/>
					))}
				</ul>
			</nav>

			{/* Portfolio balance card */}
			<div className="px-3 pb-3">
				<div className="rounded-[14px] bg-[var(--c-onyx-900)] p-[14px] text-[var(--c-cream)]">
					<div className="text-[11px] font-medium uppercase tracking-[0.06em] opacity-70">Portfolio</div>
					<div className="mt-1.5 font-display tabular-nums text-[22px] font-semibold leading-none">
						₦{totalNgn.toLocaleString("en-NG")}
					</div>
					<div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[var(--c-lime-500)]">
						<TrendingUp className="size-3.5 shrink-0" />
						<span>+2.84% today</span>
					</div>
				</div>
			</div>

			{/* User footer */}
			<div className="border-t border-[var(--c-line)] p-3">
				<div className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-[var(--c-surface-2)] transition-colors">
					<Avatar className="size-8 shrink-0">
						<AvatarFallback
							className="text-[11px] font-semibold"
							style={{ background: "linear-gradient(135deg, var(--c-lime-500), var(--c-onyx-700))", color: "var(--c-onyx-900)" }}
						>
							{CURRENT_USER.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
						</AvatarFallback>
					</Avatar>
					<div className="min-w-0 flex-1">
						<div className="truncate text-[13px] font-semibold text-[var(--c-text)]">{CURRENT_USER.name}</div>
						<div className="truncate text-[11px] text-[var(--c-text-3)]">{CURRENT_USER.email}</div>
					</div>
					<button
						onClick={handleSignOut}
						title="Sign out"
						className="shrink-0 rounded-lg p-1.5 text-[var(--c-text-3)] hover:bg-[var(--c-surface-3)] hover:text-[var(--c-text)] transition-colors"
					>
						<LogOut className="size-4" />
					</button>
				</div>
			</div>
		</aside>
	);
}
