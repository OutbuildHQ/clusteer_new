"use client";

import { useState } from "react";
import { Plus, Send } from "lucide-react";

const TICKETS = [
	{ id: "#8472", subject: "Withdrawal stuck on pending", status: "Open", priority: "High", updated: "12 min ago", unread: 2 },
	{ id: "#8470", subject: "Can't verify NIN", status: "In progress", priority: "Medium", updated: "1 hr ago", unread: 0 },
	{ id: "#8451", subject: "Refund request – wrong network", status: "Resolved", priority: "High", updated: "Yesterday", unread: 0 },
	{ id: "#8442", subject: "Account limit increase", status: "Closed", priority: "Low", updated: "Mar 10", unread: 0 },
];

function StatusBadge({ s }: { s: string }) {
	const map: Record<string, { bg: string; color: string; border?: string }> = {
		Open: { bg: "var(--c-info-soft)", color: "var(--c-info)" },
		"In progress": { bg: "var(--c-warn-soft)", color: "var(--c-warn)" },
		Resolved: { bg: "var(--c-up-soft)", color: "var(--c-up)" },
		Closed: { bg: "var(--c-surface-2)", color: "var(--c-text-2)", border: "1px solid var(--c-line)" },
	};
	const icons: Record<string, string> = { Open: "●", "In progress": "◐", Resolved: "✓", Closed: "✓" };
	const m = map[s] ?? map.Open;
	return (
		<span className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full text-[11.5px] font-medium" style={{ background: m.bg, color: m.color, border: m.border }}>
			<span className="text-[9px]">{icons[s] ?? "●"}</span>{s}
		</span>
	);
}

export default function SupportPage() {
	const [open, setOpen] = useState(TICKETS[0]);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4">
				<h1 className="text-[22px] lg:text-[32px] font-semibold leading-tight tracking-tight" style={{ color: "var(--c-text)", letterSpacing: "-0.03em" }}>Support</h1>
				<button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-[13.5px] font-medium" style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}>
					<Plus className="size-4" />New ticket
				</button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4" style={{ minHeight: 600 }}>
				{/* Ticket list */}
				<div className="rounded-[14px] overflow-hidden" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
					<div className="px-[var(--pad)] py-4" style={{ borderBottom: "1px solid var(--c-line)" }}>
						<h3 className="text-[15px] font-semibold" style={{ color: "var(--c-text)" }}>Tickets</h3>
					</div>
					{TICKETS.map((t) => (
						<div
							key={t.id}
							onClick={() => setOpen(t)}
							className="flex flex-col gap-1 px-4 py-3.5 cursor-pointer transition-colors"
							style={{ borderBottom: "1px solid var(--c-line)", background: open?.id === t.id ? "var(--c-surface-2)" : "transparent" }}
						>
							<div className="flex items-center justify-between">
								<span className="tabular-nums text-[11px]" style={{ fontFamily: "var(--f-mono)", color: "var(--c-text-3)" }}>{t.id}</span>
								<StatusBadge s={t.status} />
							</div>
							<div className="font-semibold text-[13.5px]" style={{ color: "var(--c-text)" }}>{t.subject}</div>
							<div className="flex items-center justify-between">
								<span className="text-[11px]" style={{ color: "var(--c-text-3)" }}>{t.updated}</span>
								{t.unread > 0 && (
									<span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-[10px] font-semibold"
										style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}>{t.unread}</span>
								)}
							</div>
						</div>
					))}
				</div>

				{/* Chat view */}
				<div className="rounded-[14px] flex flex-col" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
					<div className="flex items-center justify-between px-[var(--pad)] py-4" style={{ borderBottom: "1px solid var(--c-line)" }}>
						<h3 className="text-[15px] font-semibold" style={{ color: "var(--c-text)" }}>{open?.subject}</h3>
						<StatusBadge s={open?.status ?? "Open"} />
					</div>
					<div className="flex-1 p-3 lg:p-5 space-y-3.5 overflow-auto" style={{ maxHeight: 520 }}>
						{/* User message */}
						<div className="flex gap-3">
							<div className="size-8 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0" style={{ background: "linear-gradient(135deg, var(--c-lime-500), var(--c-onyx-700))", color: "var(--c-onyx-900)" }}>AO</div>
							<div className="flex-1 rounded-[14px] p-3 text-[13px]" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)", color: "var(--c-text)" }}>
								I initiated a withdrawal of ₦450,000 to my GTBank account 2 hours ago and it&apos;s still showing pending. Reference: WX-83820.
								<div className="text-[11px] mt-1.5" style={{ color: "var(--c-text-3)" }}>You · 2 hours ago</div>
							</div>
						</div>
						{/* Agent message */}
						<div className="flex gap-3">
							<div className="size-8 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0" style={{ background: "linear-gradient(135deg, #C9F542, #DBFF6B)", color: "var(--c-onyx-900)" }}>EN</div>
							<div className="flex-1 rounded-[14px] p-3 text-[13px]" style={{ background: "var(--c-surface-2)", color: "var(--c-text)" }}>
								Hi Adaeze — I can see the withdrawal in our system. NIBSS is reporting a delay on GTBank&apos;s end. Funds will arrive within 30 mins. I&apos;ll keep you updated.
								<div className="text-[11px] mt-1.5" style={{ color: "var(--c-text-3)" }}>Emeka · Support · 12 min ago</div>
							</div>
						</div>
					</div>
					{/* Reply bar */}
					<div className="flex items-center gap-2 p-3.5" style={{ borderTop: "1px solid var(--c-line)" }}>
						<input className="flex-1 h-[38px] px-3 rounded-[10px] text-[13.5px] outline-none" style={{ border: "1px solid var(--c-line)", background: "var(--c-surface)", color: "var(--c-text)" }} placeholder="Type a reply…" />
						<button className="inline-flex items-center gap-2 h-[38px] px-3.5 rounded-[10px] text-[13.5px] font-medium" style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}>
							<Send className="size-4" />Send
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
