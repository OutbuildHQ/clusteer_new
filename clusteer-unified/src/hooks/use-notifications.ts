"use client";

import { supabase } from "@/lib/supabase";
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
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!user?.id) {
			setLoading(false);
			return;
		}

		// Fetch initial notifications
		const fetchNotifications = async () => {
			try {
				const { data, error } = await supabase
					.from("notifications")
					.select("*")
					.eq("user_id", user.id)
					.order("created_at", { ascending: false })
					.limit(50);

				if (error) {
					// If table doesn't exist, silently fail and show empty notifications
					if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
						setNotifications([]);
						setError(null);
						setLoading(false);
						return;
					}
					throw error;
				}

				setNotifications(data || []);
				setError(null);
			} catch (err) {
				// Silently handle errors - notifications are optional
				setNotifications([]);
				setError(null);
			} finally {
				setLoading(false);
			}
		};

		fetchNotifications();

		// Subscribe to real-time changes
		const channel = supabase
			.channel("notifications")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "notifications",
					filter: `user_id=eq.${user.id}`,
				},
				(payload) => {
					if (payload.eventType === "INSERT") {
						setNotifications((prev) => [
							payload.new as Notification,
							...prev,
						]);
					} else if (payload.eventType === "UPDATE") {
						setNotifications((prev) =>
							prev.map((notif) =>
								notif.id === payload.new.id
									? (payload.new as Notification)
									: notif
							)
						);
					} else if (payload.eventType === "DELETE") {
						setNotifications((prev) =>
							prev.filter((notif) => notif.id !== payload.old.id)
						);
					}
				}
			)
			.subscribe();

		// Cleanup subscription on unmount
		return () => {
			supabase.removeChannel(channel);
		};
	}, [user?.id]);

	const markAsRead = async (notificationId: string) => {
		try {
			const { error } = await supabase
				.from("notifications")
				.update({ read: true })
				.eq("id", notificationId);

			if (error) throw error;

			// Optimistically update local state
			setNotifications((prev) =>
				prev.map((notif) =>
					notif.id === notificationId ? { ...notif, read: true } : notif
				)
			);
		} catch (err) {
			console.error("Error marking notification as read:", err);
		}
	};

	const markAllAsRead = async () => {
		if (!user?.id) return;

		try {
			const { error } = await supabase
				.from("notifications")
				.update({ read: true })
				.eq("user_id", user.id)
				.eq("read", false);

			if (error) throw error;

			// Optimistically update local state
			setNotifications((prev) =>
				prev.map((notif) => ({ ...notif, read: true }))
			);
		} catch (err) {
			console.error("Error marking all notifications as read:", err);
		}
	};

	const deleteNotification = async (notificationId: string) => {
		try {
			const { error } = await supabase
				.from("notifications")
				.delete()
				.eq("id", notificationId);

			if (error) throw error;

			// Optimistically update local state
			setNotifications((prev) =>
				prev.filter((notif) => notif.id !== notificationId)
			);
		} catch (err) {
			console.error("Error deleting notification:", err);
		}
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
