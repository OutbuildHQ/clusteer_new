"use client";

// TEMPORARY: Disabled Supabase notifications during Firebase migration
// import { supabase } from "@/lib/supabase";
import { useUser } from "@/store/user";
import { useEffect, useState } from "react";

export interface Notification {
	id: string;
	user_id: string;
	title: string;
	message: string;
	type: "info" | "success" | "warning" | "error";
	read: boolean;
	created_at: string;
	updated_at: string;
}

export function useNotifications() {
	const user = useUser();
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// TEMPORARY: Return empty notifications until we implement Firebase/Spring Boot notifications
		// TODO: Implement notifications using Firebase Cloud Messaging or Spring Boot backend
		setNotifications([]);
		setLoading(false);
		setError(null);
	}, [user?.id]);

	const markAsRead = async (notificationId: string) => {
		// TEMPORARY: No-op until notifications backend is implemented
		console.log("markAsRead called (not implemented):", notificationId);
	};

	const markAllAsRead = async () => {
		// TEMPORARY: No-op until notifications backend is implemented
		console.log("markAllAsRead called (not implemented)");
	};

	const deleteNotification = async (notificationId: string) => {
		// TEMPORARY: No-op until notifications backend is implemented
		console.log("deleteNotification called (not implemented):", notificationId);
	};

	const unreadCount = notifications.filter((n) => !n.read).length;

	return {
		notifications,
		loading,
		error,
		unreadCount,
		markAsRead,
		markAllAsRead,
		deleteNotification,
	};
}
