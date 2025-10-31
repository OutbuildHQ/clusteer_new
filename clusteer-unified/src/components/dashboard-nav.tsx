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
			<Container className="flex items-center py-[18px] px-4 w-full bg-white">
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
						className="w-[292px] p-0 pt-5 h-full"
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
												className={`flex gap-x-2 items-center font-semibold text-base capitalize py-2 px-3 rounded-md transition-colors ${
													isActive
														? "bg-[#E7F6EC] text-[#0D4222]"
														: "text-[#414651] hover:bg-[#FAFAFA]"
												}`}
											>
												<Icon className="h-5 w-5" />
												{navItem.title}
											</Link>
										</li>
									);
								})}
							</ul>
							<hr className="my-2.5 bg-[#E9EAEB]" />
							<ul className="flex flex-col gap-y-1">
								<li>
									<Link
										href="/settings"
										className={`flex gap-x-2 items-center font-semibold text-base py-2 px-3 rounded-md transition-colors ${
											pathname === "/settings" || pathname.startsWith("/settings/")
												? "bg-[#E7F6EC] text-[#0D4222]"
												: "text-[#414651] hover:bg-[#FAFAFA]"
										}`}
									>
										<Settings className="h-5 w-5" />
										Settings
									</Link>
								</li>
								<li>
									<Link
										href="/support"
										className={`flex gap-x-2 items-center font-semibold text-base py-2 px-3 rounded-md transition-colors ${
											pathname === "/support" || pathname.startsWith("/support/")
												? "bg-[#E7F6EC] text-[#0D4222]"
												: "text-[#414651] hover:bg-[#FAFAFA]"
										}`}
									>
										<HeadphonesIcon className="h-5 w-5" />
										Support
										<div className="ml-auto border border-[#E9EAEB] py-0.5 px-1.5 rounded-lg flex items-center gap-x-1">
											<div className="bg-green-500 size-2 rounded-full"></div>
											<span className="text-sm text-[#414651]">Online</span>
										</div>
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

	return (
		<Sidebar className="shadow-[0px_1px_2px_0px_#0A0D120D] p-1 pr-0 border-none bg-[#FAFAFA] w-full max-w-[254px] xl:max-w-[296px]">
			<div className="flex flex-col pt-5 h-full bg-white border-[#E9EAEB] rounded-lg border m-0">
				<SidebarHeader className="px-5 pb-0">
					<Image
						src="/assets/icons/logo_with_name.svg"
						alt="Clusteer logo"
						width={139}
						height={32}
					/>
				</SidebarHeader>

				<SidebarContent className="px-4 overflow-hidden">
					<SidebarGroup className="mt-20 p-0">
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
													className={`flex font-semibold !text-base capitalize px-3 gap-x-2 items-center shrink-0 h-10 rounded-md transition-colors ${
														isActive
															? "bg-[#E7F6EC] text-[#0D4222] hover:bg-[#E7F6EC] hover:text-[#0D4222]"
															: "text-[#414651] hover:bg-[#FAFAFA] hover:text-[#414651]"
													}`}
												>
													<Icon className="h-5 w-5" />
													<span>{navItem.title}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>

					<SidebarSeparator className="my-2.5 border-[#E9EAEB]" />

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
													className={`flex font-semibold !text-base capitalize px-3 gap-x-2 items-center shrink-0 h-10 rounded-md transition-colors ${
														isActive
															? "bg-[#E7F6EC] text-[#0D4222] hover:bg-[#E7F6EC] hover:text-[#0D4222]"
															: "text-[#414651] hover:bg-[#FAFAFA] hover:text-[#414651]"
													}`}
												>
													<Icon className="h-5 w-5" />
													<span>{navItem.title}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
								<SidebarMenuItem>
									<SidebarMenuButton asChild>
										<Link
											href="/support"
											className={`flex font-semibold !text-base capitalize px-3 gap-x-2 items-center shrink-0 h-10 rounded-md transition-colors ${
												pathname === "/support" || pathname.startsWith("/support/")
													? "bg-[#E7F6EC] text-[#0D4222] hover:bg-[#E7F6EC] hover:text-[#0D4222]"
													: "text-[#414651] hover:bg-[#FAFAFA] hover:text-[#414651]"
											}`}
										>
											<HeadphonesIcon className="h-5 w-5" />
											<span>Support</span>
											<Badge
												variant="outline"
												className="ml-auto border-[#D5D7DA] rounded-[6px] px-1.5"
											>
												<div className="bg-green-500 size-2 rounded-full"></div>
												<span className="text-[#414651] font-medium text-xs">
													Online
												</span>
											</Badge>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>

				<SidebarFooter className="mt-auto px-4">
					<NavUser />
				</SidebarFooter>
			</div>
		</Sidebar>
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
