"use client";

import Link from "next/link";
import { Bell, Menu, Search, Sun, Moon, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/brand/logo";
import { Sidebar } from "./sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CURRENT_USER } from "@/lib/mock-data";
import { useEffect, useRef, useState } from "react";

function useThemeToggle() {
	const [dark, setDark] = useState(false);
	useEffect(() => {
		setDark(document.documentElement.classList.contains("dark"));
	}, []);
	function toggle() {
		const next = !dark;
		document.documentElement.classList.toggle("dark", next);
		setDark(next);
	}
	return { dark, toggle };
}

export function TopBar() {
	const { dark, toggle } = useThemeToggle();
	const searchRef = useRef<HTMLInputElement>(null);

	// ⌘K / Ctrl+K focus
	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				searchRef.current?.focus();
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	return (
		<header
			className="sticky top-0 z-30 flex h-[57px] shrink-0 items-center gap-3 px-6 border-b border-[var(--c-line)] bg-[var(--c-surface)]"
			style={{ boxShadow: "var(--sh-1)" }}
		>
			{/* Mobile hamburger */}
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
						<Menu className="size-5" />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-[260px] p-0 border-r border-[var(--c-line)]">
					<div className="h-full">
						<Sidebar className="flex w-full border-r-0 h-full" />
					</div>
				</SheetContent>
			</Sheet>

			{/* Mobile logo */}
			<div className="flex items-center gap-2 lg:hidden">
				<Logo monogramOnly />
			</div>

			{/* Global search */}
			<div className="flex-1 max-w-[380px] hidden md:flex items-center gap-2 h-9 px-3 rounded-[10px] border border-[var(--c-line)] bg-[var(--c-bg)] text-[var(--c-text-3)]">
				<Search className="size-4 shrink-0" />
				<input
					ref={searchRef}
					type="search"
					placeholder="Search assets, txns, addresses…"
					className="flex-1 h-full bg-transparent text-[13px] text-[var(--c-text)] placeholder:text-[var(--c-text-3)] outline-none border-none"
				/>
				<kbd className="font-mono text-[11px] px-1.5 py-0.5 rounded border border-[var(--c-line)] bg-[var(--c-surface-2)] text-[var(--c-text-3)]">
					⌘K
				</kbd>
			</div>

			<div className="flex-1" />

			{/* Right controls */}
			<div className="flex items-center gap-1">
				{/* Theme toggle */}
				<button
					onClick={toggle}
					title="Toggle theme"
					className="h-9 w-9 flex items-center justify-center rounded-lg text-[var(--c-text-2)] hover:bg-[var(--c-surface-2)] transition-colors"
				>
					{dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
				</button>

				{/* Notifications */}
				<Link
					href="/notifications"
					className="relative h-9 w-9 flex items-center justify-center rounded-lg text-[var(--c-text-2)] hover:bg-[var(--c-surface-2)] transition-colors"
					aria-label="Notifications"
				>
					<Bell className="size-4" />
					<span className="absolute top-1.5 right-1.5 h-[7px] w-[7px] rounded-full bg-[var(--c-down)]" aria-hidden />
				</Link>

				{/* Trade CTA */}
				<Link
					href="/trade"
					className="hidden md:flex items-center gap-1.5 h-9 px-3.5 ml-1 rounded-lg bg-[var(--c-lime-500)] text-[var(--c-onyx-900)] text-[13px] font-semibold hover:bg-[var(--c-lime-400)] transition-colors"
				>
					<ArrowLeftRight className="size-3.5" />
					Trade
				</Link>

				{/* User avatar */}
				<div className="flex items-center gap-2.5 ml-1 pl-3 border-l border-[var(--c-line)]">
					<Avatar className="size-8 shrink-0">
						<AvatarFallback
							className="text-[11px] font-semibold"
							style={{ background: "linear-gradient(135deg, var(--c-lime-500), var(--c-onyx-700))", color: "var(--c-onyx-900)" }}
						>
							{CURRENT_USER.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
						</AvatarFallback>
					</Avatar>
					<div className="hidden md:block min-w-0">
						<div className="text-[13px] font-semibold leading-none text-[var(--c-text)] truncate">
							{CURRENT_USER.firstName}.
						</div>
						<div className="text-[11px] text-[var(--c-text-3)] truncate max-w-[120px]">
							{CURRENT_USER.email}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
