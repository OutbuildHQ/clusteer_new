"use client";

import { useState } from "react";
import { Plus, Send, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

const TICKET_CATEGORIES = ["Withdrawal issue", "Deposit issue", "Verification / KYC", "Account access", "Swap / Trade", "Fees & rates", "Other"] as const;
const TICKET_PRIORITIES = ["Low", "Medium", "High"] as const;

const INITIAL_TICKETS = [
	{ id: "#8472", subject: "Withdrawal stuck on pending", status: "Open", priority: "High", updated: "12 min ago", unread: 2 },
	{ id: "#8470", subject: "Can't verify NIN", status: "In progress", priority: "Medium", updated: "1 hr ago", unread: 0 },
	{ id: "#8451", subject: "Refund request – wrong network", status: "Resolved", priority: "High", updated: "Yesterday", unread: 0 },
	{ id: "#8442", subject: "Account limit increase", status: "Closed", priority: "Low", updated: "Mar 10", unread: 0 },
];

type Ticket = (typeof INITIAL_TICKETS)[number];

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
	const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
	const [open, setOpen] = useState<Ticket>(INITIAL_TICKETS[0]);
	const [showNew, setShowNew] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [form, setForm] = useState({ subject: "", category: TICKET_CATEGORIES[0] as string, priority: "Medium" as string, description: "" });

	async function handleCreate(e: React.FormEvent) {
		e.preventDefault();
		if (!form.subject.trim() || !form.description.trim()) {
			toast.error("Subject and description are required");
			return;
		}
		setSubmitting(true);
		try {
			const res = await fetch("/api/support/tickets", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ subject: form.subject, category: form.category, priority: form.priority, description: form.description }),
			});
			const data = await res.json().catch(() => ({}));
			const newId = data.id ?? `#${8400 + Math.floor(Math.random() * 99)}`;
			const newTicket: Ticket = {
				id: newId,
				subject: form.subject.trim(),
				status: "Open",
				priority: form.priority,
				updated: "Just now",
				unread: 0,
			};
			setTickets((prev) => [newTicket, ...prev]);
			setOpen(newTicket);
			setShowNew(false);
			setForm({ subject: "", category: TICKET_CATEGORIES[0], priority: "Medium", description: "" });
			toast.success("Ticket submitted — we'll be in touch shortly");
		} catch {
			toast.error("Failed to submit ticket. Please try again.");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4">
				<h1 className="text-[22px] lg:text-[32px] font-semibold leading-tight tracking-tight" style={{ color: "var(--c-text)", letterSpacing: "-0.03em" }}>Support</h1>
				<button
					onClick={() => setShowNew(true)}
					className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-[13.5px] font-medium"
					style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}
				>
					<Plus className="size-4" />New ticket
				</button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4" style={{ minHeight: 600 }}>
				{/* Ticket list */}
				<div className="rounded-[14px] overflow-hidden" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
					<div className="px-[var(--pad)] py-4" style={{ borderBottom: "1px solid var(--c-line)" }}>
						<h3 className="text-[15px] font-semibold" style={{ color: "var(--c-text)" }}>Tickets</h3>
					</div>
					{tickets.map((t) => (
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

			{/* ── New Ticket Modal ── */}
			{showNew && (
				<div
					style={{ position: "fixed", inset: 0, background: "rgba(11,14,12,0.55)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", animation: "fadeIn .15s ease" }}
					onClick={(e) => { if (e.target === e.currentTarget) setShowNew(false); }}
				>
					<div style={{ width: "100%", maxWidth: 480, background: "var(--c-surface)", borderRadius: 18, border: "1px solid var(--c-line)", boxShadow: "var(--sh-3)", animation: "modalIn .18s cubic-bezier(.2,.7,.2,1)" }}>
						{/* Header */}
						<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 0" }}>
							<div>
								<h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-text)", letterSpacing: "-0.02em" }}>New support ticket</h2>
								<p style={{ fontSize: 13, color: "var(--c-text-3)", marginTop: 2 }}>We typically respond within 2 hours</p>
							</div>
							<button onClick={() => setShowNew(false)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, color: "var(--c-text-3)", display: "flex", alignItems: "center" }}>
								<X className="size-5" />
							</button>
						</div>

						{/* Form */}
						<form onSubmit={handleCreate} style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
							{/* Subject */}
							<div>
								<label style={{ display: "block", fontSize: 12.5, fontWeight: 500, color: "var(--c-text-2)", marginBottom: 6 }}>Subject</label>
								<input
									type="text"
									value={form.subject}
									onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
									placeholder="Brief description of your issue"
									maxLength={120}
									autoFocus
									style={{ display: "block", width: "100%", height: 40, padding: "0 12px", borderRadius: 10, border: "1px solid var(--c-line)", background: "var(--c-surface)", color: "var(--c-text)", fontSize: 13.5, outline: "none", boxSizing: "border-box" }}
								/>
							</div>

							{/* Category + Priority side by side */}
							<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
								<div>
									<label style={{ display: "block", fontSize: 12.5, fontWeight: 500, color: "var(--c-text-2)", marginBottom: 6 }}>Category</label>
									<select
										value={form.category}
										onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
										style={{ display: "block", width: "100%", height: 40, padding: "0 12px", borderRadius: 10, border: "1px solid var(--c-line)", background: "var(--c-surface)", color: "var(--c-text)", fontSize: 13, outline: "none", appearance: "none", cursor: "pointer" }}
									>
										{TICKET_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
									</select>
								</div>
								<div>
									<label style={{ display: "block", fontSize: 12.5, fontWeight: 500, color: "var(--c-text-2)", marginBottom: 6 }}>Priority</label>
									<div style={{ display: "flex", gap: 6 }}>
										{TICKET_PRIORITIES.map((p) => {
											const active = form.priority === p;
											const color = p === "High" ? "var(--c-down)" : p === "Medium" ? "var(--c-warn)" : "var(--c-text-3)";
											return (
												<button
													key={p}
													type="button"
													onClick={() => setForm((f) => ({ ...f, priority: p }))}
													style={{ flex: 1, height: 40, borderRadius: 10, fontSize: 12, fontWeight: 600, border: `1px solid ${active ? color : "var(--c-line)"}`, background: active ? `color-mix(in srgb, ${color} 10%, transparent)` : "transparent", color: active ? color : "var(--c-text-2)", cursor: "pointer", transition: "all .12s" }}
												>
													{p}
												</button>
											);
										})}
									</div>
								</div>
							</div>

							{/* Description */}
							<div>
								<label style={{ display: "block", fontSize: 12.5, fontWeight: 500, color: "var(--c-text-2)", marginBottom: 6 }}>Description</label>
								<textarea
									value={form.description}
									onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
									placeholder="Provide as much detail as possible — transaction IDs, amounts, screenshots…"
									rows={4}
									style={{ display: "block", width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--c-line)", background: "var(--c-surface)", color: "var(--c-text)", fontSize: 13, outline: "none", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" }}
								/>
							</div>

							{/* Actions */}
							<div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
								<button
									type="button"
									onClick={() => setShowNew(false)}
									style={{ height: 40, padding: "0 18px", borderRadius: 10, fontSize: 13.5, fontWeight: 500, border: "1px solid var(--c-line)", background: "transparent", color: "var(--c-text-2)", cursor: "pointer" }}
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={submitting || !form.subject.trim() || !form.description.trim()}
									style={{ height: 40, padding: "0 20px", borderRadius: 10, fontSize: 13.5, fontWeight: 600, border: "none", background: form.subject.trim() && form.description.trim() ? "var(--c-lime-500)" : "var(--c-surface-2)", color: form.subject.trim() && form.description.trim() ? "var(--c-onyx-900)" : "var(--c-text-3)", cursor: form.subject.trim() && form.description.trim() ? "pointer" : "not-allowed", display: "inline-flex", alignItems: "center", gap: 8, transition: "all .12s" }}
								>
									{submitting ? <><Loader2 className="size-4 animate-spin" />Submitting…</> : "Submit ticket"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
