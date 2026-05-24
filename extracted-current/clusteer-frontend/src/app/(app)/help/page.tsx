"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageCircle, Mail, ChevronRight, BookOpen, Shield, Wallet, ArrowLeftRight } from "lucide-react";

const TOPICS = [
	{ icon: Wallet, title: "Deposits & withdrawals", desc: "Receiving and sending crypto safely." },
	{ icon: ArrowLeftRight, title: "Buying & selling", desc: "Prices, fees, and order status." },
	{ icon: Shield, title: "Security & 2FA", desc: "Protect your account." },
	{ icon: BookOpen, title: "KYC verification", desc: "Tiers, documents, and limits." },
];

const FAQ = [
	{ q: "How long do crypto deposits take?", a: "After the network confirms, funds arrive in your Clusteer wallet typically within 3–15 minutes depending on the chain." },
	{ q: "What are your trading fees?", a: "A flat 0.75% on buy, sell, and swap orders. No hidden spreads — the rate you see is the rate you get." },
	{ q: "I sent crypto on the wrong network. What now?", a: "Unfortunately, cross-network recovery is not always possible. Contact support immediately with the TX hash — we'll do our best to help." },
	{ q: "How do I upgrade to Tier 2?", a: "Go to Identity Verification, provide your BVN, a government ID, and a selfie. Most approvals complete in under 5 minutes." },
	{ q: "Can I withdraw to my Nigerian bank?", a: "Yes, sell crypto for NGN and withdraw to any linked Nigerian bank account. Withdrawals clear within 15 minutes on business days." },
];

export default function HelpPage() {
	const [q, setQ] = useState("");
	const filtered = FAQ.filter((f) => !q || f.q.toLowerCase().includes(q.toLowerCase()));
	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-display text-2xl font-bold tracking-tight">How can we help?</h1>
				<p className="mt-1 text-sm text-muted-foreground">Search our guides, or get in touch 24/7.</p>
			</div>

			<div className="relative max-w-2xl">
				<Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
				<Input className="h-14 pl-12 text-base" placeholder="Search articles…" value={q} onChange={(e) => setQ(e.target.value)} />
			</div>

			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
				{TOPICS.map((t) => (
					<Card key={t.title} className="group cursor-pointer transition hover:border-primary/50">
						<CardContent className="p-5">
							<div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2.5 text-primary"><t.icon className="size-5" /></div>
							<div className="font-medium">{t.title}</div>
							<div className="mt-1 text-xs text-muted-foreground">{t.desc}</div>
							<div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">Browse<ChevronRight className="size-3" /></div>
						</CardContent>
					</Card>
				))}
			</div>

			<Card>
				<CardHeader><CardTitle>Frequently asked</CardTitle></CardHeader>
				<CardContent className="divide-y divide-border p-0">
					{filtered.map((f) => (
						<details key={f.q} className="group px-6 py-4">
							<summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
								{f.q}
								<ChevronRight className="size-4 text-muted-foreground transition group-open:rotate-90" />
							</summary>
							<p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
						</details>
					))}
				</CardContent>
			</Card>

			<Card>
				<CardHeader><CardTitle>Still need help?</CardTitle><CardDescription>Our team typically replies within a few minutes.</CardDescription></CardHeader>
				<CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
					<Link href="#" className="flex items-center gap-4 rounded-lg border border-border p-4 hover:bg-muted">
						<div className="rounded-lg bg-primary/10 p-2.5 text-primary"><MessageCircle className="size-5" /></div>
						<div className="flex-1"><div className="font-medium">Live chat</div><div className="text-xs text-muted-foreground">24/7 in-app support</div></div>
						<Button size="sm">Start chat</Button>
					</Link>
					<Link href="mailto:support@clusteer.co" className="flex items-center gap-4 rounded-lg border border-border p-4 hover:bg-muted">
						<div className="rounded-lg bg-primary/10 p-2.5 text-primary"><Mail className="size-5" /></div>
						<div className="flex-1"><div className="font-medium">Email us</div><div className="text-xs text-muted-foreground">support@clusteer.co</div></div>
						<Button variant="outline" size="sm">Compose</Button>
					</Link>
				</CardContent>
			</Card>
		</div>
	);
}
