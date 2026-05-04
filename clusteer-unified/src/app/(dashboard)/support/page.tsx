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
	Plus, Clock, Send, Headphones, X, CheckCircle2, AlertCircle, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupportTickets, createSupportTicket, getFAQs } from "@/lib/api/support";
import type { SupportTicket, FAQ as FAQType, FAQData } from "@/lib/api/support";
import { useUser } from "@/store/user";

const TOPICS = [
	{ icon: Wallet, slug: "deposits-withdrawals", title: "Deposits & withdrawals", desc: "Receiving and sending stablecoins safely." },
	{ icon: ArrowLeftRight, slug: "buying-selling", title: "Buying & selling", desc: "Prices, fees, and order status." },
	{ icon: Shield, slug: "security-2fa", title: "Security & 2FA", desc: "Protect your account." },
	{ icon: BookOpen, slug: "kyc-verification", title: "KYC verification", desc: "Tiers, documents, and limits." },
];

const FALLBACK_FAQ = [
	{ q: "How long do deposits take?", a: "After the network confirms, funds arrive in your Clusteer wallet typically within 3\u201315 minutes depending on the chain." },
	{ q: "What are your trading fees?", a: "A flat 0.75% on buy, sell, and swap orders. No hidden spreads \u2014 the rate you see is the rate you get." },
	{ q: "I sent stablecoins on the wrong network. What now?", a: "Unfortunately, cross-network recovery is not always possible. Contact support immediately with the TX hash \u2014 we'll do our best to help." },
	{ q: "How do I upgrade to Tier 2?", a: "Go to Identity Verification, provide your BVN, a government ID, and a selfie. Most approvals complete in under 5 minutes." },
	{ q: "Can I withdraw to my Nigerian bank?", a: "Yes, sell your stablecoins for NGN and withdraw to any linked Nigerian bank account. Withdrawals clear within 15 minutes on business days." },
];

const CHAT_MESSAGES: { role: "bot" | "user"; text: string; time: string }[] = [
	{ role: "bot" as const, text: "\uD83D\uDC4B Hi! I'm Clusteer's support assistant. How can I help you today?", time: "Just now" },
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
	in_progress: "bg-warning/10 text-warning border-warning/20",
	waiting_response: "bg-warning/10 text-warning border-warning/20",
	resolved: "bg-success/10 text-success border-success/20",
	closed: "bg-muted text-muted-foreground",
};

export default function SupportPage() {
	const user = useUser();
	const queryClient = useQueryClient();
	const [q, setQ] = useState("");
	const [showNewTicket, setShowNewTicket] = useState(false);
	const [showChat, setShowChat] = useState(false);
	const [chatInput, setChatInput] = useState("");
	const [chatMessages, setChatMessages] = useState(CHAT_MESSAGES);
	const [ticketForm, setTicketForm] = useState({ subject: "", category: "general", priority: "medium", description: "" });

	// Fetch tickets from Django
	const { data: tickets = [], isLoading: ticketsLoading } = useQuery({
		queryKey: ["tickets", user?.id],
		queryFn: () => getSupportTickets(user!.id),
		enabled: !!user?.id,
	});

	// Fetch FAQs from Django
	const { data: faqData } = useQuery({
		queryKey: ["faqs"],
		queryFn: () => getFAQs(),
	});

	// Flatten FAQ data from categorized format to flat array
	const faqList: { q: string; a: string }[] = (() => {
		if (!faqData) return FALLBACK_FAQ;
		const items: { q: string; a: string }[] = [];
		Object.values(faqData).forEach((categoryFaqs) => {
			categoryFaqs.forEach((faq) => {
				items.push({ q: faq.question, a: faq.answer });
			});
		});
		return items.length > 0 ? items : FALLBACK_FAQ;
	})();

	const filtered = faqList.filter((f) => !q || f.q.toLowerCase().includes(q.toLowerCase()));

	// Create ticket mutation
	const createTicketMutation = useMutation({
		mutationFn: (data: { subject: string; category: string; priority: string; description: string }) =>
			createSupportTicket(user!.id, {
				user_email: user?.email || "",
				user_name: user?.username || user?.firstName || "",
				subject: data.subject,
				category: data.category,
				description: data.description,
				priority: data.priority,
			}),
		onSuccess: () => {
			toast.success("Ticket submitted \u2014 we'll reply within a few hours.");
			setShowNewTicket(false);
			setTicketForm({ subject: "", category: "general", priority: "medium", description: "" });
			queryClient.invalidateQueries({ queryKey: ["tickets", user?.id] });
		},
		onError: () => {
			toast.error("Failed to submit ticket. Please try again.");
		},
	});

	function submitTicket() {
		if (!ticketForm.subject || !ticketForm.description) {
			toast.error("Please fill in subject and description");
			return;
		}
		createTicketMutation.mutate(ticketForm);
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
		<div className="space-y-4 sm:space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
				<div>
					<p className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-brand-800">&#9670; Support</p>
					<h1 className="font-display text-xl sm:text-2xl font-bold tracking-[-0.02em]">How can we help?</h1>
					<p className="mt-1 text-xs sm:text-sm text-muted-foreground">Search our guides, or get in touch 24/7.</p>
				</div>
				<Button size="sm" className="w-full sm:w-auto rounded-full shadow-brutal-sm" onClick={() => setShowNewTicket(true)}>
					<Plus className="size-4" /> New ticket
				</Button>
			</div>

			{/* Search */}
			<div className="relative max-w-2xl">
				<Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
				<Input className="h-12 sm:h-14 pl-12 text-sm sm:text-base rounded-[14px] border-2 border-custom-black" placeholder="Search articles\u2026" value={q} onChange={(e) => setQ(e.target.value)} />
			</div>

			{/* Topic cards */}
			<div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
				{TOPICS.map((t) => (
					<Link key={t.slug} href={`/support/help/${t.slug}`}>
						<Card className="group cursor-pointer transition hover:shadow-brutal-sm border-2 border-custom-black rounded-[16px] sm:rounded-[20px] h-full">
							<CardContent className="p-3 sm:p-5 lg:p-6">
								<div className="mb-2 sm:mb-3 size-9 sm:size-10 lg:size-12 rounded-xl bg-light-green border-[1.5px] border-custom-black flex items-center justify-center"><t.icon className="size-4 sm:size-5 text-custom-black" /></div>
								<div className="font-display font-bold text-sm sm:text-base">{t.title}</div>
								<div className="mt-1 text-[10px] sm:text-xs text-muted-foreground hidden sm:block">{t.desc}</div>
								<div className="mt-2 sm:mt-3 inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium text-primary group-hover:gap-2 transition-all">Browse<ChevronRight className="size-3" /></div>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>

			{/* My tickets */}
			<Card className="border-2 border-custom-black rounded-[16px] sm:rounded-[20px]">
				<CardHeader className="flex-col sm:flex-row sm:items-center gap-3 sm:justify-between p-4 sm:p-6 lg:p-8">
					<div>
						<CardTitle className="font-display font-bold tracking-[-0.02em]">My tickets</CardTitle>
						<CardDescription>Track your open and resolved support requests.</CardDescription>
					</div>
					<Button variant="outline" size="sm" className="w-full sm:w-auto rounded-full border-2 border-custom-black" onClick={() => setShowNewTicket(true)}>
						<Plus className="size-3.5" /> Submit ticket
					</Button>
				</CardHeader>
				<CardContent className="p-0">
					{ticketsLoading ? (
						<div className="py-12 text-center">
							<Loader2 className="size-6 animate-spin text-muted-foreground mx-auto" />
							<p className="text-sm text-muted-foreground mt-2">Loading tickets...</p>
						</div>
					) : tickets.length === 0 ? (
						<div className="py-12 text-center px-4">
							<MessageCircle className="size-10 text-muted-foreground/40 mx-auto mb-3" />
							<p className="font-display font-bold">No tickets yet</p>
							<p className="text-sm text-muted-foreground mt-1">Submit a ticket when you need help.</p>
							<Button size="sm" className="mt-4 w-full sm:w-auto rounded-full shadow-brutal-sm" onClick={() => setShowNewTicket(true)}>Create your first ticket</Button>
						</div>
					) : (
						<div className="divide-y divide-border">
							{tickets.map((t) => (
								<Link key={t.ticket_number} href={`/support/${t.ticket_number}`} className="flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 hover:bg-warm-beige/50 transition-colors">
									<div className="min-w-0 flex-1">
										<div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
											<span className="text-[10px] sm:text-xs font-mono text-muted-foreground tabular-nums">{t.ticket_number}</span>
											<Badge className={`text-[10px] ${statusColor[t.status] ?? statusColor.closed}`}>
												{t.status.replace(/_/g, " ")}
											</Badge>
											{t.priority === "high" && <Badge variant="danger" className="text-[10px]">High</Badge>}
											{t.priority === "urgent" && <Badge variant="danger" className="text-[10px]">Urgent</Badge>}
										</div>
										<p className="font-medium text-xs sm:text-sm truncate">{t.subject}</p>
									</div>
									<div className="text-right shrink-0 hidden sm:block">
										<p className="text-xs text-muted-foreground">Last reply</p>
										<p className="text-xs font-mono font-medium tabular-nums">{relativeTime(t.updated_at)}</p>
									</div>
									<ChevronRight className="size-4 text-muted-foreground shrink-0" />
								</Link>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* FAQ */}
			<Card className="border-2 border-custom-black rounded-[16px] sm:rounded-[20px]">
				<CardHeader className="p-4 sm:p-6 lg:p-8"><CardTitle className="font-display font-bold tracking-[-0.02em]">Frequently asked</CardTitle></CardHeader>
				<CardContent className="divide-y-2 divide-custom-black/10 p-0">
					{filtered.length === 0 ? (
						<div className="px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-muted-foreground">No questions match your search.</div>
					) : (
						filtered.map((f) => (
							<details key={f.q} className="group px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
								<summary className="flex cursor-pointer list-none items-center justify-between gap-3 sm:gap-4 font-display font-bold text-sm sm:text-base">
									{f.q}
									<ChevronRight className="size-4 text-muted-foreground transition group-open:rotate-90 shrink-0" />
								</summary>
								<p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{f.a}</p>
							</details>
						))
					)}
				</CardContent>
			</Card>

			{/* Contact options */}
			<Card className="border-2 border-custom-black rounded-[16px] sm:rounded-[20px]">
				<CardHeader className="p-4 sm:p-6 lg:p-8">
					<CardTitle className="font-display font-bold tracking-[-0.02em]">Still need help?</CardTitle>
					<CardDescription>Our team typically replies within a few minutes.</CardDescription>
				</CardHeader>
				<CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
					<button onClick={() => setShowChat(true)} className="flex items-center gap-3 sm:gap-4 rounded-[16px] border-2 border-custom-black p-3 sm:p-4 hover:bg-warm-beige text-left transition-colors">
						<div className="size-10 sm:size-12 rounded-xl bg-light-green border-[1.5px] border-custom-black flex items-center justify-center shrink-0"><MessageCircle className="size-5 text-custom-black" /></div>
						<div className="flex-1 min-w-0">
							<div className="font-display font-bold text-sm sm:text-base">Live chat</div>
							<div className="text-[10px] sm:text-xs text-muted-foreground">24/7 in-app support</div>
						</div>
						<Button size="sm" className="rounded-full shadow-brutal-sm shrink-0 hidden sm:inline-flex" onClick={(e) => { e.stopPropagation(); setShowChat(true); }}>Start</Button>
					</button>
					<a href="mailto:support@clusteer.co" className="flex items-center gap-3 sm:gap-4 rounded-[16px] border-2 border-custom-black p-3 sm:p-4 hover:bg-warm-beige transition-colors">
						<div className="size-10 sm:size-12 rounded-xl bg-light-green border-[1.5px] border-custom-black flex items-center justify-center shrink-0"><Mail className="size-5 text-custom-black" /></div>
						<div className="flex-1 min-w-0">
							<div className="font-display font-bold text-sm sm:text-base">Email us</div>
							<div className="text-[10px] sm:text-xs text-muted-foreground truncate">support@clusteer.co</div>
						</div>
						<Button variant="outline" size="sm" className="rounded-full border-2 border-custom-black shrink-0 hidden sm:inline-flex">Compose</Button>
					</a>
				</CardContent>
			</Card>

			{/* --- New Ticket Dialog --- */}
			<Dialog open={showNewTicket} onOpenChange={setShowNewTicket}>
				<DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="font-display font-bold tracking-[-0.02em]">Submit a support ticket</DialogTitle>
						<DialogDescription>Describe your issue and we&apos;ll get back to you within a few hours.</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 mt-2">
						<div className="space-y-1.5">
							<Label>Subject <span className="text-danger">*</span></Label>
							<Input placeholder="Brief description of your issue" value={ticketForm.subject} onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })} />
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
								rows={4}
								placeholder="Please provide as much detail as possible \u2014 include transaction IDs, amounts, and timestamps if relevant."
								value={ticketForm.description}
								onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
								className="w-full rounded-[14px] border-2 border-custom-black bg-background px-3 sm:px-4 py-2.5 sm:py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
							/>
						</div>
						<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
							<Button className="flex-1 rounded-full shadow-brutal-sm" onClick={submitTicket} disabled={createTicketMutation.isPending}>
								{createTicketMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
								Submit ticket
							</Button>
							<Button variant="outline" className="flex-1 rounded-full border-2 border-custom-black" onClick={() => setShowNewTicket(false)}>Cancel</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* --- Live Chat Dialog --- */}
			<Dialog open={showChat} onOpenChange={setShowChat}>
				<DialogContent className="sm:max-w-lg p-0 gap-0 h-[85vh] sm:h-[80vh] max-h-[600px] flex flex-col">
					{/* Chat header */}
					<div className="flex items-center gap-3 border-b-2 border-custom-black px-4 sm:px-5 py-3 sm:py-4 shrink-0">
						<div className="size-10 rounded-xl bg-light-green border-[1.5px] border-custom-black flex items-center justify-center shrink-0">
							<Headphones className="size-4 text-custom-black" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="font-display font-bold text-sm">Clusteer Support</p>
							<p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
								<span className="size-1.5 rounded-full bg-success" /> Online
							</p>
						</div>
					</div>

					{/* Chat messages */}
					<div className="flex-1 overflow-y-auto px-3 sm:px-5 py-3 sm:py-4 space-y-3 sm:space-y-4">
						{chatMessages.map((m, i) => (
							<div key={i} className={`flex gap-2 sm:gap-2.5 ${m.role === ("user" as string) ? "flex-row-reverse" : ""}`}>
								<div className={`flex size-6 sm:size-7 shrink-0 items-center justify-center rounded-full text-[10px] sm:text-xs ${m.role === "bot" ? "bg-light-green border-[1.5px] border-custom-black text-custom-black" : "bg-custom-black text-white"}`}>
									{m.role === "bot" ? <Headphones className="size-3 sm:size-3.5" /> : "You"}
								</div>
								<div className={`max-w-[85%] sm:max-w-[80%] rounded-[14px] px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm ${m.role === "bot" ? "bg-warm-beige border border-custom-black/10" : "bg-[#EFFCD0] border border-custom-black/10"}`}>
									<p>{m.text}</p>
									<p className="text-[10px] text-muted-foreground mt-1 font-mono">{m.time}</p>
								</div>
							</div>
						))}
					</div>

					{/* Chat input */}
					<div className="border-t-2 border-custom-black px-3 sm:px-4 py-2.5 sm:py-3 shrink-0">
						<form
							onSubmit={(e) => { e.preventDefault(); sendChat(); }}
							className="flex items-center gap-2"
						>
							<Input
								placeholder="Type your message\u2026"
								value={chatInput}
								onChange={(e) => setChatInput(e.target.value)}
								className="flex-1 text-sm"
							/>
							<Button type="submit" size="icon" className="rounded-full shadow-brutal-sm min-h-[44px] min-w-[44px]" disabled={!chatInput.trim()}>
								<Send className="size-4" />
							</Button>
						</form>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
