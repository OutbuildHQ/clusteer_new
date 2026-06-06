"use client";

import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Bell, ShieldAlert, TrendingUp, ArrowDownLeft, ChevronRight } from "lucide-react";
import { EmptyState } from "@/components/primitives/empty-state";

interface Notification {
	id: string | number;
	type: "tx" | "price" | "security" | "system" | "promo" | "news";
	title: string;
	body: string;
	when: string;
	read: boolean;
}

function notifIcon(type: Notification["type"]) {
	if (type === "security") return <ShieldAlert size={18} />;
	if (type === "price") return <TrendingUp size={18} />;
	if (type === "tx") return <ArrowDownLeft size={18} />;
	return <Bell size={18} />;
}

function notifIconClasses(type: Notification["type"]) {
	if (type === "security") return "bg-warn-soft text-warn";
	return "bg-ds-surface-2 text-ds-text";
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
					n.type === tab,
			),
		[enriched, tab],
	);

	const unreadCount = enriched.filter((n) => !n.read).length;

	function markRead(id: string | number) {
		setReadIds((prev) => new Set([...prev, id]));
	}

	function openNotif(n: typeof enriched[number]) {
		markRead(n.id);
		window.openFlow("notifDetail", { notification: n });
	}

	async function handleMarkAllRead() {
		const res = await fetch("/api/notifications/mark-all-read", { method: "PUT" });
		if (res.ok) {
			setReadIds(new Set(enriched.map((n) => n.id)));
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			toast.success("All notifications marked read");
		} else {
			toast.error("Failed to mark notifications as read");
		}
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Header — title + badge left, mark-all + tabs right */}
			<div className="flex items-center justify-between flex-wrap gap-4">
				<div className="flex items-baseline gap-2">
					<h1 className="text-[32px] font-semibold text-ds-text tracking-[-0.03em] m-0 font-display">
						Notifications
					</h1>
					{unreadCount > 0 && (
						<span className="inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium bg-lime-500 text-onyx-900">
							{unreadCount} unread
						</span>
					)}
				</div>
				<div className="flex items-center gap-3">
					<button
						onClick={handleMarkAllRead}
						disabled={unreadCount === 0}
						className="inline-flex items-center h-[30px] px-2.5 rounded-[10px] text-[12.5px] font-medium border border-ds-line bg-transparent text-ds-text cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
					>
						Mark all read
					</button>
					<div className="inline-flex p-1 bg-ds-surface-2 rounded-[10px] border border-ds-line gap-0.5">
						{(["All", "Unread", "tx", "price", "security"] as Tab[]).map((t) => (
							<button
								key={t}
								onClick={() => setTab(t)}
								className={`px-3 py-1.5 rounded-[8px] text-[12.5px] font-medium cursor-pointer border-none font-sans capitalize whitespace-nowrap ${
									tab === t
										? "bg-ds-surface text-ds-text shadow-[var(--sh-1)]"
										: "bg-transparent text-ds-text-2"
								}`}
							>
								{t}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Loading */}
			{isLoading && (
				<div className="flex justify-center pt-20">
					<div className="w-8 h-8 border-[3px] border-ds-line border-t-lime-500 rounded-full animate-spin" />
				</div>
			)}

			{/* Empty */}
			{!isLoading && list.length === 0 && (
				<EmptyState
					icon={Bell}
					variant="branded"
					title={tab === "Unread" ? "You're all caught up" : "No notifications yet"}
					description={
						tab === "Unread"
							? "You have no unread notifications."
							: "Activity alerts, price movements, and security events will appear here."
					}
				/>
			)}

			{/* Notification list */}
			{!isLoading && list.length > 0 && (
				<div className="bg-ds-surface border border-ds-line rounded-[14px] overflow-hidden">
					{list.map((n, i) => (
						<div
							key={n.id}
							role="button"
							tabIndex={0}
							onClick={() => openNotif(n)}
							onKeyDown={(e) => { if (e.key === "Enter") openNotif(n); }}
							className={`flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-ds-surface-2 ${
								!n.read ? "bg-[rgba(201,245,66,0.07)]" : "bg-transparent"
							}`}
							style={i < list.length - 1 ? { borderBottom: "1px solid var(--c-line)" } : undefined}
						>
							<div className="flex items-center gap-3 min-w-0">
								<div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-semibold ${notifIconClasses(n.type)}`}>
									{notifIcon(n.type)}
								</div>
								<div className="min-w-0">
									<div className="flex items-center gap-1.5">
										<span className="text-[13.5px] font-semibold text-ds-text">{n.title}</span>
										{!n.read && (
											<span className="inline-block size-[6px] rounded-full bg-lime-500 shrink-0" />
										)}
									</div>
									<div className="text-[12.5px] text-ds-text-3 truncate">{n.body}</div>
								</div>
							</div>
							<div className="flex items-center gap-2 shrink-0 ml-2">
								<span className="text-[12px] text-ds-text-3">{n.when}</span>
								<ChevronRight size={14} className="text-ds-text-3 opacity-45" />
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
