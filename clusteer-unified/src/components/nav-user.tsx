"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "@/store/user";
import { ChevronsUpDown, UserCircle, CreditCard, Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function NavUser() {
	const user = useUser();
	const router = useRouter();
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const handleLogout = async () => {
		try {
			setIsLoggingOut(true);
			const response = await fetch("/api/auth/logout", {
				method: "POST",
			});

			if (response.ok) {
				router.push("/login");
			} else {
				console.error("Logout failed");
				setIsLoggingOut(false);
			}
		} catch (error) {
			console.error("Logout error:", error);
			setIsLoggingOut(false);
		}
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="border border-[#E9EAEB] rounded-xl px-3 h-16 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="relative">
								<Avatar className="size-10 rounded-full">
									<AvatarImage
										className="object-cover object-center"
										src={user?.avatar}
										alt="user avatar"
									/>
									<AvatarFallback className="rounded-lg">
										{user?.firstName?.[0] ?? "U"}
									</AvatarFallback>
								</Avatar>
								<div className="size-2.5 bg-[#12B76A] absolute right-0 bottom-0 z-10 rounded-full border-2 border-white"></div>
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold text-[#181D27]">
									{user?.firstName && user?.lastName
										? `${user.firstName} ${user.lastName}`
										: user?.username || "Guest User"}
								</span>
								<span className="text-[#535862] truncate">{user?.email || "Not logged in"}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4 stroke-[#A4A7AE]" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side="bottom"
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={user?.avatar}
										alt={user?.firstName}
									/>
									<AvatarFallback className="rounded-lg">
										{user?.firstName?.[0] ?? "U"}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{user?.firstName && user?.lastName
											? `${user.firstName} ${user.lastName}`
											: user?.username || "Guest User"}
									</span>
									<span className="text-muted-foreground truncate text-xs">
										{user?.email || "Not logged in"}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem onClick={() => router.push("/profile")}>
								<UserCircle className="h-4 w-4 mr-2" />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => router.push("/billing")}>
								<CreditCard className="h-4 w-4 mr-2" />
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => router.push("/settings/notifications")}>
								<Bell className="h-4 w-4 mr-2" />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={handleLogout}
							disabled={isLoggingOut}
							className="text-red-600 focus:text-red-600"
						>
							<LogOut className="h-4 w-4 mr-2" />
							{isLoggingOut ? "Logging out..." : "Log out"}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
