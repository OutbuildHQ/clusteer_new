"use client";

import { useState } from "react";
import { Check, Loader2, Plus, Send, X } from "lucide-react";
import { toast } from "sonner";

const TICKET_CATEGORIES = ["Buy/Sell order", "Identity / KYC", "Payments & bank", "Account & security", "Something else"] as const;
const TICKET_PRIORITIES = ["Low", "Normal", "High", "Urgent"] as const;

interface Ticket {
	id: string;
	subject: string;
	status: string;
	priority: string;
	updated: string;
	unread: number;
}

interface Message {
	me: boolean;
	who?: string;
	text: string;
	when: string;
}

const INITIAL_TICKETS: Ticket[] = [
	{ id: "#8472", subject: "Withdrawal stuck on pending", status: "Open", priority: "High", updated: "12 min ago", unread: 2 },
	{ id: "#8470", subject: "Can't verify NIN", status: "In progress", priority: "Normal", updated: "1 hr ago", unread: 0 },
	{ id: "#8451", subject: "Refund request – wrong network", status: "Resolved", priority: "High", updated: "Yesterday", unread: 0 },
	{ id: "#8442", subject: "Account limit increase", status: "Closed", priority: "Low", updated: "Mar 10", unread: 0 },
];

const INITIAL_THREADS: Record<string, Message[]> = {
	"#8472": [
		{ me: true, text: "I placed a buy order for 31 USDT (₦50,250) 2 hours ago, paid from my GTBank account, but it's still showing \"confirming\". Order: BUY-7F42.", when: "2 hours ago" },
		{ me: false, who: "Emeka · Support", text: "Hi Adaeze — I can see your order. Quidax has confirmed the on-chain transfer; it's awaiting the final network confirmation and your USDT will land within ~10 mins. I'll keep you updated.", when: "12 min ago" },
	],
	"#8470": [
		{ me: true, text: "My NIN keeps failing verification — it says \"no match\" but the number is correct.", when: "1 hour ago" },
		{ me: false, who: "Bola · Support", text: "Thanks Adaeze. The NIMC service had a brief outage this morning. Please re-try the NIN step now; if it still fails, send a photo of your slip and I'll verify manually.", when: "40 min ago" },
	],
	"#8451": [
		{ me: true, text: "On a sell order I sent USDT on BEP20 but selected TRC20 by mistake. Can you recover it? Order SELL-7F39.", when: "Yesterday" },
		{ me: false, who: "Emeka · Support", text: "Good news — our settlement partner detected the BEP20 deposit and matched it to your order. It has been credited and your payout is on the way. No funds lost.", when: "Yesterday" },
	],
	"#8442": [
		{ me: true, text: "How do I raise my daily limit above ₦5M?", when: "Mar 10" },
		{ me: false, who: "Bola · Support", text: "You'll need Tier 3 — head to Identity → Upgrade and submit proof of address + source of funds. Approval is usually 1–2 business days.", when: "Mar 10" },
	],
};

const STATUS_CLASSES: Record<string, string> = {
	Open: "bg-info-soft text-[var(--c-info)]",
	"In progress": "bg-warn-soft text-warn",
	Resolved: "bg-up-soft text-up",
	Closed: "bg-ds-surface-2 text-ds-text-2 border border-ds-line",
};

const STATUS_ICONS: Record<string, string> = { Open: "●", "In progress": "◐" };

function StatusBadge({ s }: { s: string }) {
	const cls = STATUS_CLASSES[s] ?? STATUS_CLASSES.Open;
	const isCheck = s === "Resolved" || s === "Closed";
	return (
		<span className={`inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full text-[11.5px] font-medium ${cls}`}>
			{isCheck ? <Check size={10} /> : <span className="text-[9px]">{STATUS_ICONS[s] ?? "●"}</span>}{s}
		</span>
	);
}

export default function SupportPage() {
	const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
	const [threads, setThreads] = useState<Record<string, Message[]>>(INITIAL_THREADS);
	const [open, setOpen] = useState<Ticket>(INITIAL_TICKETS[0]);
	const [draft, setDraft] = useState("");
	const [showNew, setShowNew] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState<string | null>(null);
	const [form, setForm] = useState({ subject: "", category: TICKET_CATEGORIES[0] as string, priority: "Normal" as string, description: "" });

	const msgs = threads[open?.id] || [];

	function send() {
		const text = draft.trim();
		if (!text) return;
		setThreads((t) => ({ ...t, [open.id]: [...(t[open.id] || []), { me: true, text, when: "Just now" }] }));
		setDraft("");
		toast("Reply sent");
	}

	function closeModal() {
		setShowNew(false);
		setSubmitted(null);
		setForm({ subject: "", category: TICKET_CATEGORIES[0], priority: "Normal", description: "" });
	}

	async function handleCreate() {
		if (!form.subject.trim() || !form.description.trim()) return;
		setSubmitting(true);
		try {
			const res = await fetch("/api/support/tickets", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ subject: form.subject, category: form.category, priority: form.priority, description: form.description }),
			});
			const data = await res.json().catch(() => ({}));
			const newId = data.id ?? `#CLR-${8400 + Math.floor(Math.random() * 99)}`;
			const newTicket: Ticket = { id: newId, subject: form.subject.trim(), status: "Open", priority: form.priority, updated: "Just now", unread: 0 };
			setTickets((prev) => [newTicket, ...prev]);
			setThreads((t) => ({ ...t, [newId]: [{ me: true, text: form.description.trim(), when: "Just now" }] }));
			setOpen(newTicket);
			setSubmitted(newId);
		} catch {
			toast.error("Failed to submit ticket. Please try again.");
		} finally {
			setSubmitting(false);
		}
	}

	const canSubmit = form.subject.trim().length > 0 && form.description.trim().length > 0 && !submitting;

	return (
		<div className="flex flex-col gap-6">
			{/* Header */}
			<div className="flex items-center justify-between flex-wrap gap-4">
				<h1 className="text-[32px] font-semibold text-ds-text tracking-[-0.03em] m-0 font-display">Support</h1>
				<button onClick={() => setShowNew(true)} className="inline-flex items-center gap-2 h-[36px] px-3.5 rounded-[10px] text-[13.5px] font-medium bg-lime-500 text-onyx-900 border-none cursor-pointer">
					<Plus size={14} />New ticket
				</button>
			</div>

			{/* Grid: ticket list + thread */}
			<div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 min-h-[600px]">
				{/* Ticket list */}
				<div className="bg-ds-surface border border-ds-line rounded-[14px] overflow-hidden">
					<div className="px-5 py-3.5 border-b border-ds-line">
						<h3 className="text-[15px] font-semibold text-ds-text m-0">Tickets</h3>
					</div>
					{tickets.map((t) => (
						<div
							key={t.id} onClick={() => setOpen(t)}
							className={`flex flex-col gap-1 px-4 py-3.5 cursor-pointer border-b border-ds-line transition-colors ${open?.id === t.id ? "bg-ds-surface-2" : "bg-transparent hover:bg-ds-surface-2"}`}
						>
							<div className="flex items-center justify-between">
								<span className="font-mono tabular-nums text-[11px] text-ds-text-3">{t.id}</span>
								<StatusBadge s={t.status} />
							</div>
							<div className="font-semibold text-[13.5px] text-ds-text">{t.subject}</div>
							<div className="flex items-center justify-between">
								<span className="text-[11px] text-ds-text-3">{t.updated}</span>
								{t.unread > 0 && (
									<span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-[10px] font-semibold bg-lime-500 text-onyx-900">
										{t.unread}
									</span>
								)}
							</div>
						</div>
					))}
				</div>

				{/* Thread view */}
				<div className="bg-ds-surface border border-ds-line rounded-[14px] flex flex-col overflow-hidden">
					<div className="flex items-center justify-between px-5 py-3.5 border-b border-ds-line">
						<h3 className="text-[15px] font-semibold text-ds-text m-0">{open?.subject}</h3>
						<StatusBadge s={open?.status ?? "Open"} />
					</div>

					<div className="flex-1 p-5 flex flex-col gap-3.5 overflow-auto max-h-[520px]">
						{msgs.map((m, i) => (
							<div key={i} className="flex gap-3">
								<div
									className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 ${m.me ? "bg-ds-surface-3 text-ds-text" : "text-onyx-900"}`}
									style={m.me ? undefined : { background: "linear-gradient(135deg, #C9F542, #DBFF6B)" }}
								>
									{m.me ? "AO" : (m.who || "S")[0]}
								</div>
								<div className={`flex-1 rounded-[14px] p-3 text-[13px] border border-ds-line ${m.me ? "bg-transparent text-ds-text" : "bg-ds-surface-2 text-ds-text"}`}>
									{m.text}
									<div className="text-[11px] mt-1.5 text-ds-text-3">{m.me ? "You" : m.who} · {m.when}</div>
								</div>
							</div>
						))}
					</div>

					<div className="flex items-center gap-2 p-3.5 border-t border-ds-line">
						<input
							className="flex-1 h-[38px] px-3 rounded-[10px] text-[13.5px] border border-ds-line bg-ds-surface text-ds-text outline-none"
							placeholder="Type a reply…"
							value={draft}
							onChange={(e) => setDraft(e.target.value)}
							onKeyDown={(e) => { if (e.key === "Enter") send(); }}
						/>
						<button onClick={send} className="inline-flex items-center gap-2 h-[38px] px-3.5 rounded-[10px] text-[13.5px] font-medium bg-lime-500 text-onyx-900 border-none cursor-pointer">
							<Send size={14} />Send
						</button>
					</div>
				</div>
			</div>

			{/* New Ticket Modal */}
			{showNew && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55"
					onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
				>
					<div className="w-full max-w-[480px] bg-ds-surface rounded-[14px] border border-ds-line shadow-[var(--sh-3)] animate-[modalIn_.22s_cubic-bezier(.2,.7,.2,1)]">
						{submitted ? (
							/* Success state */
							<div className="flex flex-col items-center text-center gap-4 px-5 py-6">
								<div className="w-[60px] h-[60px] rounded-full bg-lime-500 flex items-center justify-center text-onyx-900">
									<Check size={28} />
								</div>
								<h3 className="text-[15px] font-semibold text-ds-text m-0">Ticket created</h3>
								<p className="text-[13.5px] text-ds-text-3 max-w-[340px] m-0">
									Our team typically replies within a few hours. We&apos;ll notify you by email and in-app.
								</p>
								<div className="w-full bg-ds-surface-2 border border-ds-line rounded-[14px] p-3.5 text-left">
									<div className="flex items-center justify-between text-[12.5px]">
										<span className="text-ds-text-3">Ticket</span>
										<span className="font-mono tabular-nums text-ds-text">{submitted}</span>
									</div>
									<div className="flex items-center justify-between text-[12.5px] mt-2">
										<span className="text-ds-text-3">Status</span>
										<StatusBadge s="Open" />
									</div>
								</div>
								<button onClick={closeModal} className="w-full inline-flex items-center justify-center h-[46px] rounded-[10px] text-[13.5px] font-medium bg-lime-500 text-onyx-900 border-none cursor-pointer">
									Done
								</button>
							</div>
						) : (
							/* Form state */
							<>
								{/* Header */}
								<div className="flex items-center justify-between px-5 py-3.5 border-b border-ds-line">
									<span className="font-semibold text-[15px] text-ds-text">New support ticket</span>
									<button onClick={closeModal} className="flex items-center p-1 bg-transparent border border-ds-line rounded-[10px] cursor-pointer text-ds-text-3">
										<X size={16} />
									</button>
								</div>

								{/* Fields */}
								<div className="p-5 flex flex-col gap-4">
									<div>
										<div className="text-[12px] text-ds-text-3 mb-1.5">Subject</div>
										<input
											value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
											placeholder="Brief summary of the issue" autoFocus
											className="block w-full h-[38px] px-3 rounded-[10px] border border-ds-line bg-ds-surface text-ds-text text-[13.5px] outline-none"
										/>
									</div>
									<div className="flex gap-3">
										<div className="flex-1">
											<div className="text-[12px] text-ds-text-3 mb-1.5">Category</div>
											<select
												value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
												className="block w-full h-[38px] px-3 rounded-[10px] border border-ds-line bg-ds-surface text-ds-text text-[13.5px] outline-none appearance-none cursor-pointer"
											>
												{TICKET_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
											</select>
										</div>
										<div className="flex-1">
											<div className="text-[12px] text-ds-text-3 mb-1.5">Priority</div>
											<select
												value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
												className="block w-full h-[38px] px-3 rounded-[10px] border border-ds-line bg-ds-surface text-ds-text text-[13.5px] outline-none appearance-none cursor-pointer"
											>
												{TICKET_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
											</select>
										</div>
									</div>
									<div>
										<div className="text-[12px] text-ds-text-3 mb-1.5">Describe the issue</div>
										<textarea
											value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
											placeholder="Tell us what happened…" rows={4}
											className="block w-full p-3 rounded-[10px] border border-ds-line bg-ds-surface text-ds-text text-[13.5px] outline-none resize-y leading-relaxed min-h-[84px]"
										/>
										<div className="text-[11px] text-ds-text-3 mt-1">Include order IDs or screenshots where possible.</div>
									</div>
								</div>

								{/* Footer */}
								<div className="flex items-center gap-2 justify-end px-5 py-3.5 border-t border-ds-line">
									<button onClick={closeModal} className="inline-flex items-center h-[36px] px-3.5 rounded-[10px] text-[13.5px] font-medium border border-ds-line bg-transparent text-ds-text cursor-pointer">
										Cancel
									</button>
									<button
										onClick={handleCreate} disabled={!canSubmit}
										className={`inline-flex items-center gap-2 h-[36px] px-3.5 rounded-[10px] text-[13.5px] font-medium border-none ${canSubmit ? "bg-lime-500 text-onyx-900 cursor-pointer" : "bg-lime-500 text-onyx-900 opacity-45 pointer-events-none"}`}
									>
										{submitting ? <><Loader2 size={14} className="animate-spin" />Submitting…</> : "Submit ticket"}
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
