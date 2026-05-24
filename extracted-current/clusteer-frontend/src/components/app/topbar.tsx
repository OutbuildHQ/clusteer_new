"use client";

import Link from "next/link";
import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/brand/logo";
import { Sidebar } from "./sidebar";

export function TopBar() {
	return (
		<header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur lg:px-6">
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
						<Menu className="size-5" />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-[280px] p-0">
					<div className="h-full"><Sidebar /></div>
				</SheetContent>
			</Sheet>
			<div className="flex items-center gap-2 lg:hidden">
				<Logo monogramOnly />
			</div>
			<div className="ml-auto flex flex-1 items-center justify-end gap-2 md:ml-0">
				<div className="relative hidden w-full max-w-xs md:block">
					<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input className="pl-9" placeholder="Search transactions, assets…" />
				</div>
				<Button variant="ghost" size="icon" aria-label="Notifications">
					<Bell className="size-5" />
				</Button>
				<Button asChild size="sm" className="hidden md:inline-flex">
					<Link href="/trade">Trade</Link>
				</Button>
			</div>
		</header>
	);
}
