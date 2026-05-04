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
		<header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b-2 border-custom-black bg-background/85 px-4 backdrop-blur-xl lg:px-6">
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon" className="lg:hidden rounded-full border-2 border-custom-black" aria-label="Open menu">
						<Menu className="size-5" />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-[280px] p-0 border-r-2 border-custom-black">
					<div className="h-full"><Sidebar /></div>
				</SheetContent>
			</Sheet>
			<div className="flex items-center gap-2 lg:hidden">
				<Logo monogramOnly />
			</div>
			<div className="ml-auto flex flex-1 items-center justify-end gap-3 md:ml-0">
				<div className="relative hidden w-full max-w-xs md:block">
					<Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input className="pl-10 rounded-full border-2 border-custom-black bg-white placeholder:text-muted-foreground" placeholder="Search transactions, assets..." />
				</div>
				<Button variant="ghost" size="icon" className="rounded-full border-2 border-custom-black hover:bg-warm-beige" aria-label="Notifications">
					<Bell className="size-5" />
				</Button>
				<Button asChild size="sm" className="hidden md:inline-flex rounded-full border-2 border-custom-black shadow-brutal-sm">
					<Link href="/trade">Trade</Link>
				</Button>
			</div>
		</header>
	);
}
