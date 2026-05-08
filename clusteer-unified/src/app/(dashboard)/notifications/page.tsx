"use client";

import { useState } from "react";
import { toast } from "sonner";

const NOTIFS = [
	{ id: 1, type: "tx", title: "Withdrawal completed", body: "₦450,000 to GTBank ••• 2847", when: "2 min ago", read: false, icon: "↓" },
	{ id: 2, type: "price", title: "BTC up 5.2%", body: "Your watchlist: BTC crossed ₦115M", when: "1 hr ago", read: false, icon: "↑" },
	{ id: 3, type: "security", title: "New device sign-in", body: "iPhone 15 · Lagos · Just now", when: "3 hr ago", read: false, icon: "⚠" },
	{ id: 4, type: "tx", title: "Buy order filled", body: "500 USDT @ ₦1,610.50", when: "Yesterday", read: true, icon: "✓" },
	{ id: 5, type: "system", title: "Scheduled maintenance", body: "USDT-Tron deposits paused 2:00–4:00 AM WAT", when: "Mar 14", read: true, icon: "i" },
	{ id: 6, type: "tx", title: "Deposit received", body: "+0.0125 BTC · 3 confirmations", when: "Mar 13", read: true, icon: "↓" },
];

type Tab = "All" | "Unread" | "tx" | "price" | "security";

export default function NotificationsPage() {
	const [tab, setTab] = useState<Tab>("All");
	const [notifications, setNotifications] = useState(NOTIFS);

	const handleMarkAllRead = async () => {
		const res = await fetch("/api/notifications/mark-all-read", { method: "PUT" });
		if (res.ok) {
			setNotifications(prev => prev.map(n => ({ ...n, read: true })));
			toast.success("All notifications marked as read");
		} else {
			toast.error("Failed to mark notifications as read");
		}
	};

	const list = notifications.filter(
		(n) => tab === "All" || (tab === "Unread" && !n.read) || n.type === tab.toLowerCase(),
	);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4">
				<h1 className="text-[22px] lg:text-[32px] font-semibold leading-tight tracking-tight" style={{ color: "var(--c-text)", letterSpacing: "-0.03em" }}>Notifications</h1>
				<button onClick={handleMarkAllRead} className="inline-flex items-center h-[30px] px-2.5 rounded-[10px] text-[12.5px] font-medium" style={{ color: "var(--c-text)", border: "1px solid var(--c-line)" }}>Mark all read</button>
			</div>
			<div className="overflow-x-auto -mx-1 px-1">
				<div className="inline-flex p-1 rounded-[10px] gap-0.5" style={{ background: "var(--c-surface-2)", border: "1px solid var(--c-line)" }}>
					{(["All", "Unread", "tx", "price", "security"] as Tab[]).map((t) => (
						<button key={t} onClick={() => setTab(t)}
							className="px-3 py-1.5 rounded-[6px] text-[12.5px] font-medium transition-colors capitalize whitespace-nowrap"
							style={tab === t ? { background: "var(--c-surface)", color: "var(--c-text)", boxShadow: "var(--sh-1)" } : { color: "var(--c-text-2)" }}>
							{t}
						</button>
					))}
				</div>
			</div>

			<div className="rounded-[14px] overflow-hidden" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
				{list.map((n, i) => (
					<div
						key={n.id}
						className="flex items-center justify-between px-3 lg:px-5 py-3.5"
						style={{
							borderBottom: i < list.length - 1 ? "1px solid var(--c-line)" : undefined,
							background: !n.read ? "rgba(201,245,66,0.07)" : "transparent",
						}}
					>
						<div className="flex items-center gap-3">
							<div
								className="size-10 rounded-full flex items-center justify-center text-[14px] font-semibold shrink-0"
								style={{
									background: n.type === "security" ? "var(--c-warn-soft)" : "var(--c-surface-2)",
									color: n.type === "security" ? "var(--c-warn)" : "var(--c-text)",
								}}
							>
								{n.icon}
							</div>
							<div>
								<div className="text-[13.5px] font-semibold" style={{ color: "var(--c-text)" }}>
									{n.title}
									{!n.read && <span className="inline-block size-[6px] rounded-full ml-1.5" style={{ background: "var(--c-lime-500)" }} />}
								</div>
								<div className="text-[12.5px]" style={{ color: "var(--c-text-3)" }}>{n.body}</div>
							</div>
						</div>
						<div className="text-[12px] shrink-0" style={{ color: "var(--c-text-3)" }}>{n.when}</div>
					</div>
				))}
			</div>
		</div>
	);
}
