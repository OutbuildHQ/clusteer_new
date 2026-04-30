"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarSeparator,
	useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import Container from "./container";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { NavUser } from "./nav-user";
import { usePathname } from "next/navigation";
import {
	Home,
	Wallet,
	ArrowLeftRight,
	FileText,
	Receipt,
	UserCheck,
	Settings,
	HeadphonesIcon,
	Menu,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const NAVLINKS: Array<{ title: string; icon: LucideIcon; to: string }> = [
	{ title: "home", icon: Home, to: "/dashboard" },
	{ title: "assets", icon: Wallet, to: "/assets" },
	{ title: "trade", icon: ArrowLeftRight, to: "/trade" },
	{ title: "orders", icon: FileText, to: "/orders" },
	{
		title: "transaction history",
		icon: Receipt,
		to: "/transaction-history",
	},
	{
		title: "identity verification",
		icon: UserCheck,
		to: "/identity-verification",
	},
];

const NAVLINKS_EXTRA: Array<{ title: string; icon: LucideIcon; to: string }> = [
	{
		title: "settings",
		icon: Settings,
		to: "/settings",
	},
];

function MobileNav() {
	const [openSheet, setOpenSheet] = useState(false);

	const pathname = usePathname();

	useEffect(() => {
		setOpenSheet(false);
	}, [pathname]);

	return (
		<nav className="lg:hidden">
			<Container className="flex items-center py-[18px] px-4 w-full bg-card border-b border-border">
				<Image
					src="/assets/icons/logo_with_name.svg"
					alt="Clusteer logo"
					className="shrink-0 md:w-[160px] h-[38px]"
					width={103}
					height={24}
				/>
				<Sheet
					open={openSheet}
					onOpenChange={setOpenSheet}
				>
					<SheetTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="ml-auto"
						>
							<Menu className="h-6 w-6" />
						</Button>
					</SheetTrigger>
					<SheetContent
						side="left"
						className="w-[292px] p-0 pt-5 h-full bg-card"
					>
						<div className="px-5">
							<Image
								src="/assets/icons/logo_with_name.svg"
								alt="Clusteer logo"
								width={139}
								height={32}
							/>
						</div>
						<div className="px-4">
							<ul className="mt-20 flex flex-col gap-y-1">
								{NAVLINKS.map((navItem) => {
									const isActive = pathname === navItem.to;
									const Icon = navItem.icon;
									return (
										<li key={navItem.title}>
											<Link
												href={navItem.to}
												className={`flex gap-x-2 items-center font-medium text-sm capitalize py-2 px-3 rounded-md transition-colors ${
													isActive
														? "bg-primary/10 text-primary"
														: "text-muted-foreground hover:bg-muted"
												}`}
											>
												<Icon className="h-4 w-4" />
												{navItem.title}
											</Link>
										</li>
									);
								})}
							</ul>
							<hr className="my-2.5 border-border" />
							<ul className="flex flex-col gap-y-1">
								<li>
									<Link
										href="/settings"
										className={`flex gap-x-2 items-center font-medium text-sm py-2 px-3 rounded-md transition-colors ${
											pathname === "/settings" || pathname.startsWith("/settings/")
												? "bg-primary/10 text-primary"
												: "text-muted-foreground hover:bg-muted"
										}`}
									>
										<Settings className="h-4 w-4" />
										Settings
									</Link>
								</li>
								<li>
									<Link
										href="/support"
										className={`flex gap-x-2 items-center font-medium text-sm py-2 px-3 rounded-md transition-colors ${
											pathname === "/support" || pathname.startsWith("/support/")
												? "bg-primary/10 text-primary"
												: "text-muted-foreground hover:bg-muted"
										}`}
									>
										<HeadphonesIcon className="h-4 w-4" />
										Support
										<Badge
											variant="success"
											className="ml-auto"
										>
											Online
										</Badge>
									</Link>
								</li>
							</ul>
						</div>
					</SheetContent>
				</Sheet>
			</Container>
		</nav>
	);
}

function AppSidebar() {
	const pathname = usePathname();
	const { open, toggleSidebar } = useSidebar();

	return (
		<>
			<button
				onClick={toggleSidebar}
				className="fixed top-[76px] lg:flex hidden z-50 w-8 h-8 bg-card border border-border rounded-full shadow-md hover:shadow-lg items-center justify-center transition-all duration-300 hover:scale-110"
				style={{
					left: open
						? 'calc(210px - 16px)'
						: 'calc(72px - 16px)',
					transition: 'left 300ms cubic-bezier(0.4, 0, 0.2, 1)',
				}}
				aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
			>
				<div className="flex items-center justify-center w-full h-full">
					{open ? (
						<ChevronLeft className="w-4 h-4 text-muted-foreground" strokeWidth={2.5} />
					) : (
						<ChevronRight className="w-4 h-4 text-muted-foreground" strokeWidth={2.5} />
					)}
				</div>
			</button>

			<Sidebar collapsible="icon" className="shadow-sm p-1 pr-0 border-none bg-background w-full max-w-[210px] transition-all duration-300">
				<div className="flex flex-col pt-4 h-full bg-card border border-border rounded-lg m-0">
					<SidebarHeader className="px-4 pb-0">
						<Image
							src="/assets/icons/logo_with_name.svg"
							alt="Clusteer logo"
							width={120}
							height={28}
							className="group-data-[collapsible=icon]:hidden"
						/>
						<div className="hidden group-data-[collapsible=icon]:flex justify-center">
							<Image
								src="/assets/icons/logo.svg"
								alt="Clusteer logo"
								width={28}
								height={28}
							/>
						</div>
					</SidebarHeader>

				<SidebarContent className="px-3 overflow-hidden">
					<SidebarGroup className="mt-14 p-0">
						<SidebarGroupContent>
							<SidebarMenu className="gap-y-1">
								{NAVLINKS.map((navItem) => {
									const isActive = pathname === navItem.to;
									const Icon = navItem.icon;
									return (
										<SidebarMenuItem key={navItem.title}>
											<SidebarMenuButton asChild>
												<Link
													href={navItem.to}
													className={`flex font-medium !text-sm capitalize px-2.5 gap-x-2 items-center shrink-0 h-9 rounded-md transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 ${
														isActive
															? "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
															: "text-muted-foreground hover:bg-muted hover:text-foreground"
													}`}
												>
													<Icon className="h-4 w-4 flex-shrink-0" />
													<span className="group-data-[collapsible=icon]:hidden">{navItem.title}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>

					<SidebarSeparator className="my-2.5 border-border" />

					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarMenu className="gap-y-1">
								{NAVLINKS_EXTRA.map((navItem) => {
									const isActive = pathname === navItem.to || pathname.startsWith(navItem.to + "/");
									const Icon = navItem.icon;
									return (
										<SidebarMenuItem key={navItem.title}>
											<SidebarMenuButton asChild>
												<Link
													href={navItem.to}
													className={`flex font-medium !text-sm capitalize px-2.5 gap-x-2 items-center shrink-0 h-9 rounded-md transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 ${
														isActive
															? "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
															: "text-muted-foreground hover:bg-muted hover:text-foreground"
													}`}
												>
													<Icon className="h-4 w-4 flex-shrink-0" />
													<span className="group-data-[collapsible=icon]:hidden">{navItem.title}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
								<SidebarMenuItem>
									<SidebarMenuButton asChild>
										<Link
											href="/support"
											className={`flex font-medium !text-sm capitalize px-2.5 gap-x-2 items-center shrink-0 h-9 rounded-md transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 ${
												pathname === "/support" || pathname.startsWith("/support/")
													? "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
													: "text-muted-foreground hover:bg-muted hover:text-foreground"
											}`}
										>
											<HeadphonesIcon className="h-4 w-4 flex-shrink-0" />
											<span className="group-data-[collapsible=icon]:hidden">Support</span>
											<Badge
												variant="success"
												className="ml-auto text-[11px] px-1.5 py-0.5 group-data-[collapsible=icon]:hidden"
											>
												Online
											</Badge>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>

				<SidebarFooter className="mt-auto px-3 pb-3">
					<NavUser />
				</SidebarFooter>
			</div>
		</Sidebar>
	</>
	);
}

export default function DashboardNav() {
	return (
		<>
			<MobileNav />
			<SidebarProvider className="hidden lg:block">
				<AppSidebar />
			</SidebarProvider>
		</>
	);
}
