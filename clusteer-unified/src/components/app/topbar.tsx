"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, Menu, Search, Sun, Moon, User, Settings, LogOut, ChevronDown, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Sidebar } from "./sidebar";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/lib/api/user/queries";

export function TopBar() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [userMenu, setUserMenu] = useState(false);
	const [mobileNav, setMobileNav] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const { data: user } = useQuery({
		queryKey: ["user-profile"],
		queryFn: getUserInfo,
		staleTime: 60_000,
	});

	const initials = user
		? `${(user.firstName?.[0] ?? "").toUpperCase()}${(user.lastName?.[0] ?? "").toUpperCase()}` || user.username?.[0]?.toUpperCase() || "U"
		: "U";
	const displayName = user
		? (user.firstName && user.lastName
			? `${user.firstName} ${user.lastName}`
			: user.firstName || user.lastName || user.username || "User")
		: "User";
	const displayEmail = user?.email
		? user.email.length > 12
			? user.email.slice(0, 8) + "…" + user.email.slice(user.email.lastIndexOf("."))
			: user.email
		: "";
	useEffect(() => setMounted(true), []);
	useEffect(() => {
		if (!userMenu) return;
		const close = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenu(false); };
		document.addEventListener("mousedown", close);
		return () => document.removeEventListener("mousedown", close);
	}, [userMenu]);

	// Lock body scroll when mobile nav is open
	useEffect(() => {
		if (mobileNav) document.body.style.overflow = "hidden";
		else document.body.style.overflow = "";
		return () => { document.body.style.overflow = ""; };
	}, [mobileNav]);

	return (
		<>
			<header
				className="sticky top-0 z-30 flex items-center gap-2 sm:gap-3 shrink-0 px-3 sm:px-4 lg:px-6"
				style={{ borderBottom: "1px solid var(--c-line)", background: "var(--c-surface)", height: 56 }}
			>
				{/* Mobile menu button */}
				<button
					className="lg:hidden inline-flex items-center justify-center size-9 rounded-[10px]"
					style={{ border: "1px solid var(--c-line)", color: "var(--c-text)" }}
					aria-label="Open menu"
					onClick={() => setMobileNav(true)}
				>
					<Menu className="size-5" />
				</button>

				{/* Mobile logo */}
				<div className="flex items-center gap-2 lg:hidden">
					<Logo monogramOnly />
				</div>

				{/* Search */}
				<div className="flex-1 max-w-[380px] hidden md:flex items-center gap-2 h-9 px-3 rounded-[10px] transition-shadow focus-within:shadow-[0_0_0_3px_rgba(159,232,112,0.45)]" style={{ border: "1px solid var(--c-line)", background: "var(--c-bg)" }}>
					<Search className="size-4 shrink-0" style={{ color: "var(--c-text-3)" }} />
					<input className="flex-1 bg-transparent outline-none text-[13.5px] border-none shadow-none" style={{ color: "var(--c-text)", fontFamily: "var(--f-sans)" }} placeholder="Search assets, txns, addresses…" />
					<kbd className="text-[11px] px-1.5 py-0.5 rounded" style={{ fontFamily: "var(--f-mono)", background: "var(--c-surface-2)", border: "1px solid var(--c-line)", color: "var(--c-text-3)" }}>⌘K</kbd>
				</div>

				<div className="flex-1" />

				{/* Actions */}
				<button
					onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
					className="hidden sm:inline-flex items-center justify-center size-9 rounded-[10px] transition-colors"
					style={{ border: "1px solid var(--c-line)", color: "var(--c-text)" }}
					title="Toggle theme"
				>
					{mounted ? (theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />) : <Sun className="size-4" />}
				</button>
				<Link href="/notifications" className="relative inline-flex items-center justify-center size-9 rounded-[10px] transition-colors" style={{ border: "1px solid var(--c-line)", color: "var(--c-text)" }}>
					<Bell className="size-[17px]" />
				</Link>

				{/* User + dropdown */}
				<div ref={menuRef} className="relative sm:pl-3 sm:ml-1 sm:border-l" style={{ borderColor: "var(--c-line)" }}>
					<button
						onClick={() => setUserMenu(!userMenu)}
						className="flex items-center gap-2.5 rounded-lg px-1.5 py-1 transition-colors hover:bg-[var(--c-surface-2)]"
					>
						<div className="size-8 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0" style={{ background: "linear-gradient(135deg, var(--c-lime-500), var(--c-onyx-700))", color: "var(--c-onyx-900)" }}>
							{initials}
						</div>
						<div className="hidden sm:block text-left">
							<div className="text-[13px] font-semibold" style={{ color: "var(--c-text)" }}>{displayName}</div>
							<div className="text-[11px]" style={{ color: "var(--c-text-3)" }}>{displayEmail}</div>
						</div>
						<ChevronDown className="size-3.5 hidden sm:block" style={{ color: "var(--c-text-3)" }} />
					</button>

					{userMenu && (
						<div
							className="absolute right-0 top-full mt-2 w-52 py-1.5 rounded-[12px] overflow-hidden"
							style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)", boxShadow: "var(--sh-3)", animation: "modalIn .15s cubic-bezier(.2,.7,.2,1)", zIndex: 50 }}
						>
							<Link
								href="/settings/profile"
								onClick={() => setUserMenu(false)}
								className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors hover:bg-[var(--c-surface-2)]"
								style={{ color: "var(--c-text)" }}
							>
								<User className="size-4" style={{ color: "var(--c-text-3)" }} />
								Profile
							</Link>
							<Link
								href="/settings"
								onClick={() => setUserMenu(false)}
								className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors hover:bg-[var(--c-surface-2)]"
								style={{ color: "var(--c-text)" }}
							>
								<Settings className="size-4" style={{ color: "var(--c-text-3)" }} />
								Settings
							</Link>
							<div className="my-1.5" style={{ height: 1, background: "var(--c-line)" }} />
							<Link
								href="/login"
								onClick={() => setUserMenu(false)}
								className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors hover:bg-[var(--c-surface-2)]"
								style={{ color: "var(--c-down)" }}
							>
								<LogOut className="size-4" />
								Sign out
							</Link>
						</div>
					)}
				</div>
			</header>

			{/* Mobile nav drawer */}
			{mobileNav && (
				<>
					<div
						className="fixed inset-0 z-50 bg-black/40 lg:hidden"
						onClick={() => setMobileNav(false)}
						style={{ animation: "fadeIn .2s ease" }}
					/>
					<div
						className="fixed inset-y-0 left-0 z-50 w-[280px] lg:hidden"
						style={{ animation: "slideInLeft .25s cubic-bezier(.2,.7,.2,1)" }}
					>
						<button
							className="absolute top-3 right-3 z-10 size-8 rounded-full flex items-center justify-center"
							style={{ background: "var(--c-surface-2)", color: "var(--c-text)" }}
							onClick={() => setMobileNav(false)}
						>
							<X className="size-4" />
						</button>
						<Sidebar mobile onNavClick={() => setMobileNav(false)} />
					</div>
				</>
			)}
		</>
	);
}
