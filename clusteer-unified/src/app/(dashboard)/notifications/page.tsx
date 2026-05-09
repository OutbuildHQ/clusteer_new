"use client";

import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Bell, ShieldAlert, TrendingUp, ArrowDownLeft, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/primitives/empty-state";

interface Notification {
	id: string | number;
	type: "tx" | "price" | "security" | "system";
	title: string;
	body: string;
	when: string;
	read: boolean;
}

function notifIcon(type: Notification["type"]) {
	if (type === "security") return <ShieldAlert className="size-5" />;
	if (type === "price") return <TrendingUp className="size-5" />;
	if (type === "tx") return <ArrowDownLeft className="size-5" />;
	return <Bell className="size-5" />;
}

function notifColors(type: Notification["type"]) {
	if (type === "security") return { bg: "var(--c-warn-soft)", color: "var(--c-warn)" };
	if (type === "price") return { bg: "var(--c-up-soft)", color: "var(--c-up)" };
	if (type === "tx") return { bg: "color-mix(in oklab, var(--c-lime-500) 12%, transparent)", color: "var(--c-lime-500)" };
	return { bg: "var(--c-surface-2)", color: "var(--c-text-2)" };
}

type Tab = "All" | "Unread" | "tx" | "price" | "security";

export default function NotificationsPage() {
	const [tab, setTab] = useState<Tab>("All");
	const queryClient = useQueryClient();

	const { data: notifications = [], isLoading } = useQuery<Notification[]>({
		queryKey: ["notifications"],
		queryFn: async () => {
			const res = await fetch("/api/notifications");
			const json = await res.json();
			return json.data ?? [];
		},
		staleTime: 30_000,
	});

	// Optimistic local read state (avoids refetch for mark-read)
	const [readIds, setReadIds] = useState<Set<string | number>>(new Set());

	const enriched = useMemo(
		() => notifications.map((n) => ({ ...n, read: n.read || readIds.has(n.id) })),
		[notifications, readIds],
	);

	const list = useMemo(
		() =>
			enriched.filter(
				(n) =>
					tab === "All" ||
					(tab === "Unread" && !n.read) ||
					n.type === (tab.toLowerCase() as Notification["type"]),
			),
		[enriched, tab],
	);

	const unreadCount = enriched.filter((n) => !n.read).length;

	async function markRead(id: string | number) {
		setReadIds((prev) => new Set([...prev, id]));
	}

	async function handleMarkAllRead() {
		const res = await fetch("/api/notifications/mark-all-read", { method: "PUT" });
		if (res.ok) {
			setReadIds(new Set(enriched.map((n) => n.id)));
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			toast.success("All notifications marked as read");
		} else {
			toast.error("Failed to mark notifications as read");
		}
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between flex-wrap gap-4">
				<div className="flex items-center gap-3">
					<h1
						className="text-[22px] lg:text-[32px] font-semibold leading-tight"
						style={{ color: "var(--c-text)", letterSpacing: "-0.03em" }}
					>
						Notifications
					</h1>
					{unreadCount > 0 && (
						<span
							className="inline-flex items-center justify-center h-5 px-1.5 rounded-full text-[11px] font-semibold"
							style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", minWidth: 20 }}
						>
							{unreadCount}
						</span>
					)}
				</div>
				{unreadCount > 0 && (
					<button
						onClick={handleMarkAllRead}
						className="inline-flex items-center h-[30px] px-3 rounded-[10px] text-[12.5px] font-medium transition-colors hover:bg-[var(--c-surface-2)]"
						style={{ color: "var(--c-text)", border: "1px solid var(--c-line)", background: "transparent", cursor: "pointer" }}
					>
						Mark all read
					</button>
				)}
			</div>

			{/* Tabs */}
			<div className="overflow-x-auto -mx-1 px-1">
				<div className="inline-flex p-1 rounded-[10px] gap-0.5" style={{ background: "var(--c-surface-2)", border: "1px solid var(--c-line)" }}>
					{(["All", "Unread", "tx", "price", "security"] as Tab[]).map((t) => (
						<button
							key={t}
							onClick={() => setTab(t)}
							className="px-3 py-1.5 rounded-[6px] text-[12.5px] font-medium transition-colors capitalize whitespace-nowrap"
							style={
								tab === t
									? { background: "var(--c-surface)", color: "var(--c-text)", boxShadow: "var(--sh-1)" }
									: { color: "var(--c-text-2)", background: "transparent", border: "none", cursor: "pointer" }
							}
						>
							{t === "tx" ? "Transactions" : t === "price" ? "Prices" : t}
						</button>
					))}
				</div>
			</div>

			{/* Loading */}
			{isLoading && (
				<div className="flex items-center justify-center py-16">
					<Loader2 className="size-6 animate-spin" style={{ color: "var(--c-text-3)" }} />
				</div>
			)}

			{/* Empty state */}
			{!isLoading && list.length === 0 && (
				<EmptyState
					icon={Bell}
					variant={tab !== "All" ? "default" : "branded"}
					title={tab === "Unread" ? "All caught up!" : "No notifications yet"}
					description={
						tab === "Unread"
							? "You have no unread notifications."
							: "Activity alerts, price movements, and security events will appear here."
					}
				/>
			)}

			{/* Notification list */}
			{!isLoading && list.length > 0 && (
				<div
					className="rounded-[14px] overflow-hidden"
					style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}
				>
					{list.map((n, i) => {
						const { bg, color } = notifColors(n.type);
						return (
							<button
								key={n.id}
								onClick={() => markRead(n.id)}
								className="w-full text-left flex items-center gap-3 px-3 lg:px-5 py-3.5 transition-colors hover:bg-[var(--c-surface-2)]"
								style={{
									borderBottom: i < list.length - 1 ? "1px solid var(--c-line)" : undefined,
									background: !n.read
										? "color-mix(in oklab, var(--c-lime-500) 5%, transparent)"
										: "transparent",
									border: "none",
									cursor: "pointer",
									display: "flex",
								}}
							>
								<div
									className="size-10 rounded-full flex items-center justify-center shrink-0"
									style={{ background: bg, color }}
								>
									{notifIcon(n.type)}
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-1.5">
										<span className="text-[13.5px] font-semibold" style={{ color: "var(--c-text)" }}>
											{n.title}
										</span>
										{!n.read && (
											<span
												className="inline-block size-[6px] rounded-full shrink-0"
												style={{ background: "var(--c-lime-500)" }}
											/>
										)}
									</div>
									<div className="text-[12.5px] truncate" style={{ color: "var(--c-text-3)" }}>
										{n.body}
									</div>
								</div>
								<div className="text-[12px] shrink-0 ml-2" style={{ color: "var(--c-text-3)" }}>
									{n.when}
								</div>
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
}
