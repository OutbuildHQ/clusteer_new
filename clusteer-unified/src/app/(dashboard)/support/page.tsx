"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
	Search, MessageCircle, Mail, ChevronRight, BookOpen, Shield, Wallet, ArrowLeftRight,
	Plus, Clock, Send, Headphones, X, CheckCircle2, AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

const TOPICS = [
	{ icon: Wallet, slug: "deposits-withdrawals", title: "Deposits & withdrawals", desc: "Receiving and sending stablecoins safely." },
	{ icon: ArrowLeftRight, slug: "buying-selling", title: "Buying & selling", desc: "Prices, fees, and order status." },
	{ icon: Shield, slug: "security-2fa", title: "Security & 2FA", desc: "Protect your account." },
	{ icon: BookOpen, slug: "kyc-verification", title: "KYC verification", desc: "Tiers, documents, and limits." },
];

const FAQ = [
	{ q: "How long do deposits take?", a: "After the network confirms, funds arrive in your Clusteer wallet typically within 3–15 minutes depending on the chain." },
	{ q: "What are your trading fees?", a: "A flat 0.75% on buy, sell, and swap orders. No hidden spreads — the rate you see is the rate you get." },
	{ q: "I sent stablecoins on the wrong network. What now?", a: "Unfortunately, cross-network recovery is not always possible. Contact support immediately with the TX hash — we'll do our best to help." },
	{ q: "How do I upgrade to Tier 2?", a: "Go to Identity Verification, provide your BVN, a government ID, and a selfie. Most approvals complete in under 5 minutes." },
	{ q: "Can I withdraw to my Nigerian bank?", a: "Yes, sell your stablecoins for NGN and withdraw to any linked Nigerian bank account. Withdrawals clear within 15 minutes on business days." },
];

const MOCK_TICKETS = [
	{ id: "T-0442", subject: "Withdrawal not received", status: "open", priority: "high", createdAt: "2026-04-28T10:30:00Z", lastReply: "2026-04-28T14:15:00Z" },
	{ id: "T-0438", subject: "KYC Tier 2 document rejected", status: "resolved", priority: "medium", createdAt: "2026-04-25T08:00:00Z", lastReply: "2026-04-26T09:30:00Z" },
];

const CHAT_MESSAGES: { role: "bot" | "user"; text: string; time: string }[] = [
	{ role: "bot" as const, text: "👋 Hi! I'm Clusteer's support assistant. How can I help you today?", time: "Just now" },
];

function relativeTime(iso: string) {
	const diff = Date.now() - new Date(iso).getTime();
	const hrs = Math.floor(diff / 3600000);
	if (hrs < 1) return "Just now";
	if (hrs < 24) return `${hrs}h ago`;
	const days = Math.floor(hrs / 24);
	return `${days}d ago`;
}

const statusColor: Record<string, string> = {
	open: "bg-primary/10 text-primary border-primary/20",
	"in-progress": "bg-warning/10 text-warning border-warning/20",
	resolved: "bg-success/10 text-success border-success/20",
	closed: "bg-muted text-muted-foreground",
};

export default function SupportPage() {
	const [q, setQ] = useState("");
	const [showNewTicket, setShowNewTicket] = useState(false);
	const [showChat, setShowChat] = useState(false);
	const [chatInput, setChatInput] = useState("");
	const [chatMessages, setChatMessages] = useState(CHAT_MESSAGES);
	const [ticketForm, setTicketForm] = useState({ subject: "", category: "general", priority: "medium", description: "" });

	const filtered = FAQ.filter((f) => !q || f.q.toLowerCase().includes(q.toLowerCase()));

	function submitTicket() {
		if (!ticketForm.subject || !ticketForm.description) {
			toast.error("Please fill in subject and description");
			return;
		}
		toast.success("Ticket submitted — we'll reply within a few hours.");
		setShowNewTicket(false);
		setTicketForm({ subject: "", category: "general", priority: "medium", description: "" });
	}

	function sendChat() {
		if (!chatInput.trim()) return;
		setChatMessages((prev) => [...prev, { role: "user", text: chatInput, time: "Just now" }]);
		setChatInput("");
		setTimeout(() => {
			setChatMessages((prev) => [
				...prev,
				{ role: "bot", text: "Thanks for your message! A support agent will join this chat shortly. In the meantime, you can also submit a ticket for faster resolution.", time: "Just now" },
			]);
		}, 1200);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
				<div>
					<h1 className="font-display text-2xl font-bold tracking-tight">How can we help?</h1>
					<p className="mt-1 text-sm text-muted-foreground">Search our guides, or get in touch 24/7.</p>
				</div>
				<Button size="sm" onClick={() => setShowNewTicket(true)}>
					<Plus className="size-4" /> New ticket
				</Button>
			</div>

			{/* Search */}
			<div className="relative max-w-2xl">
				<Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
				<Input className="h-14 pl-12 text-base" placeholder="Search articles…" value={q} onChange={(e) => setQ(e.target.value)} />
			</div>

			{/* Topic cards */}
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
				{TOPICS.map((t) => (
					<Link key={t.slug} href={`/support/help/${t.slug}`}>
						<Card className="group cursor-pointer transition hover:border-primary/50 h-full">
							<CardContent className="p-5">
								<div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2.5 text-primary"><t.icon className="size-5" /></div>
								<div className="font-medium">{t.title}</div>
								<div className="mt-1 text-xs text-muted-foreground">{t.desc}</div>
								<div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">Browse<ChevronRight className="size-3" /></div>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>

			{/* My tickets */}
			<Card>
				<CardHeader className="flex-row items-center justify-between">
					<div>
						<CardTitle>My tickets</CardTitle>
						<CardDescription>Track your open and resolved support requests.</CardDescription>
					</div>
					<Button variant="outline" size="sm" onClick={() => setShowNewTicket(true)}>
						<Plus className="size-3.5" /> Submit ticket
					</Button>
				</CardHeader>
				<CardContent className="p-0">
					{MOCK_TICKETS.length === 0 ? (
						<div className="py-12 text-center">
							<MessageCircle className="size-10 text-muted-foreground/40 mx-auto mb-3" />
							<p className="font-medium">No tickets yet</p>
							<p className="text-sm text-muted-foreground mt-1">Submit a ticket when you need help.</p>
							<Button size="sm" className="mt-4" onClick={() => setShowNewTicket(true)}>Create your first ticket</Button>
						</div>
					) : (
						<div className="divide-y divide-border">
							{MOCK_TICKETS.map((t) => (
								<Link key={t.id} href={`/support/${t.id}`} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-muted/50 transition-colors">
									<div className="min-w-0 flex-1">
										<div className="flex items-center gap-2 mb-1">
											<span className="text-xs font-mono text-muted-foreground">{t.id}</span>
											<Badge className={`text-[10px] ${statusColor[t.status] ?? statusColor.closed}`}>
												{t.status.replace("-", " ")}
											</Badge>
											{t.priority === "high" && <Badge variant="danger" className="text-[10px]">High</Badge>}
										</div>
										<p className="font-medium text-sm truncate">{t.subject}</p>
									</div>
									<div className="text-right shrink-0">
										<p className="text-xs text-muted-foreground">Last reply</p>
										<p className="text-xs font-medium">{relativeTime(t.lastReply)}</p>
									</div>
									<ChevronRight className="size-4 text-muted-foreground shrink-0" />
								</Link>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* FAQ */}
			<Card>
				<CardHeader><CardTitle>Frequently asked</CardTitle></CardHeader>
				<CardContent className="divide-y divide-border p-0">
					{filtered.length === 0 ? (
						<div className="px-6 py-8 text-center text-sm text-muted-foreground">No questions match your search.</div>
					) : (
						filtered.map((f) => (
							<details key={f.q} className="group px-6 py-4">
								<summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
									{f.q}
									<ChevronRight className="size-4 text-muted-foreground transition group-open:rotate-90 shrink-0" />
								</summary>
								<p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
							</details>
						))
					)}
				</CardContent>
			</Card>

			{/* Contact options */}
			<Card>
				<CardHeader>
					<CardTitle>Still need help?</CardTitle>
					<CardDescription>Our team typically replies within a few minutes.</CardDescription>
				</CardHeader>
				<CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
					<button onClick={() => setShowChat(true)} className="flex items-center gap-4 rounded-lg border border-border p-4 hover:bg-muted text-left transition-colors">
						<div className="rounded-lg bg-primary/10 p-2.5 text-primary"><MessageCircle className="size-5" /></div>
						<div className="flex-1 min-w-0">
							<div className="font-medium">Live chat</div>
							<div className="text-xs text-muted-foreground">24/7 in-app support</div>
						</div>
						<Button size="sm" onClick={(e) => { e.stopPropagation(); setShowChat(true); }}>Start chat</Button>
					</button>
					<a href="mailto:support@clusteer.co" className="flex items-center gap-4 rounded-lg border border-border p-4 hover:bg-muted transition-colors">
						<div className="rounded-lg bg-primary/10 p-2.5 text-primary"><Mail className="size-5" /></div>
						<div className="flex-1 min-w-0">
							<div className="font-medium">Email us</div>
							<div className="text-xs text-muted-foreground">support@clusteer.co</div>
						</div>
						<Button variant="outline" size="sm">Compose</Button>
					</a>
				</CardContent>
			</Card>

			{/* ─── New Ticket Dialog ─── */}
			<Dialog open={showNewTicket} onOpenChange={setShowNewTicket}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>Submit a support ticket</DialogTitle>
						<DialogDescription>Describe your issue and we&apos;ll get back to you within a few hours.</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 mt-2">
						<div className="space-y-1.5">
							<Label>Subject <span className="text-danger">*</span></Label>
							<Input placeholder="Brief description of your issue" value={ticketForm.subject} onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })} />
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label>Category</Label>
								<Select value={ticketForm.category} onValueChange={(v) => setTicketForm({ ...ticketForm, category: v })}>
									<SelectTrigger><SelectValue /></SelectTrigger>
									<SelectContent>
										<SelectItem value="general">General</SelectItem>
										<SelectItem value="transaction">Transaction issue</SelectItem>
										<SelectItem value="verification">KYC / Verification</SelectItem>
										<SelectItem value="security">Security concern</SelectItem>
										<SelectItem value="withdrawal">Withdrawal</SelectItem>
										<SelectItem value="deposit">Deposit</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-1.5">
								<Label>Priority</Label>
								<Select value={ticketForm.priority} onValueChange={(v) => setTicketForm({ ...ticketForm, priority: v })}>
									<SelectTrigger><SelectValue /></SelectTrigger>
									<SelectContent>
										<SelectItem value="low">Low</SelectItem>
										<SelectItem value="medium">Medium</SelectItem>
										<SelectItem value="high">High</SelectItem>
										<SelectItem value="urgent">Urgent</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="space-y-1.5">
							<Label>Description <span className="text-danger">*</span></Label>
							<textarea
								rows={5}
								placeholder="Please provide as much detail as possible — include transaction IDs, amounts, and timestamps if relevant."
								value={ticketForm.description}
								onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
								className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
							/>
						</div>
						<div className="flex gap-3 pt-2">
							<Button className="flex-1" onClick={submitTicket}>Submit ticket</Button>
							<Button variant="outline" className="flex-1" onClick={() => setShowNewTicket(false)}>Cancel</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* ─── Live Chat Dialog ─── */}
			<Dialog open={showChat} onOpenChange={setShowChat}>
				<DialogContent className="sm:max-w-lg p-0 gap-0 h-[80vh] max-h-[600px] flex flex-col">
					{/* Chat header */}
					<div className="flex items-center gap-3 border-b border-border px-5 py-4 shrink-0">
						<div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
							<Headphones className="size-4" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="font-semibold text-sm">Clusteer Support</p>
							<p className="text-xs text-muted-foreground flex items-center gap-1">
								<span className="size-1.5 rounded-full bg-success" /> Online — typically replies instantly
							</p>
						</div>
					</div>

					{/* Chat messages */}
					<div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
						{chatMessages.map((m, i) => (
							<div key={i} className={`flex gap-2.5 ${m.role === ("user" as string) ? "flex-row-reverse" : ""}`}>
								<div className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs ${m.role === "bot" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
									{m.role === "bot" ? <Headphones className="size-3.5" /> : "You"}
								</div>
								<div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm ${m.role === "bot" ? "bg-muted" : "bg-primary/10"}`}>
									<p>{m.text}</p>
									<p className="text-[10px] text-muted-foreground mt-1">{m.time}</p>
								</div>
							</div>
						))}
					</div>

					{/* Chat input */}
					<div className="border-t border-border px-4 py-3 shrink-0">
						<form
							onSubmit={(e) => { e.preventDefault(); sendChat(); }}
							className="flex items-center gap-2"
						>
							<Input
								placeholder="Type your message…"
								value={chatInput}
								onChange={(e) => setChatInput(e.target.value)}
								className="flex-1"
							/>
							<Button type="submit" size="icon" disabled={!chatInput.trim()}>
								<Send className="size-4" />
							</Button>
						</form>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
