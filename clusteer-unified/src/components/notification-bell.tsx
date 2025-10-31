"use client";

import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { useNotifications } from "@/hooks/use-notifications";

// Helper function to format relative time
function getRelativeTime(timestamp: string): string {
	const now = new Date();
	const date = new Date(timestamp);
	const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (seconds < 60) return "just now";
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
	const days = Math.floor(hours / 24);
	if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
	const months = Math.floor(days / 30);
	if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
	const years = Math.floor(days / 365);
	return `${years} year${years > 1 ? 's' : ''} ago`;
}

export default function NotificationBell() {
	const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
	const [open, setOpen] = useState(false);

	const handleNotificationClick = (notificationId: string, isRead: boolean) => {
		if (!isRead) {
			markAsRead(notificationId);
		}
	};

	return (
		<DropdownMenu
			open={open}
			onOpenChange={setOpen}
		>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="relative"
				>
					<Bell className="h-5 w-5" />
					{unreadCount > 0 && (
						<Badge
							variant="destructive"
							className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
						>
							{unreadCount}
						</Badge>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-80"
			>
				<DropdownMenuLabel className="font-semibold text-base">
					Notifications
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{notifications.length === 0 ? (
					<div className="p-4 text-center text-sm text-muted-foreground">
						No notifications
					</div>
				) : (
					<>
						{notifications.map((notification) => (
							<DropdownMenuItem
								key={notification.id}
								className="flex flex-col items-start p-4 cursor-pointer"
								onClick={() => handleNotificationClick(notification.id, notification.read)}
							>
								<div className="flex items-start gap-2 w-full">
									{!notification.read && (
										<div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
									)}
									<div className="flex-1">
										<p className="font-medium text-sm">{notification.title}</p>
										<p className="text-xs text-muted-foreground mt-1">
											{notification.message}
										</p>
										<p className="text-xs text-muted-foreground mt-2">
											{getRelativeTime(notification.created_at)}
										</p>
									</div>
								</div>
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						{unreadCount > 0 && (
							<DropdownMenuItem
								className="text-center justify-center text-sm text-dark-green font-medium"
								onClick={markAllAsRead}
							>
								Mark all as read
							</DropdownMenuItem>
						)}
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
