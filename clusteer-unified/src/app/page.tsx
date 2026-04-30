"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { ChainBadge } from "@/components/primitives/chain-badge";
import { Num } from "@/components/primitives/num";
import { HeroSwap } from "@/components/hero-swap";
import { PixelRain } from "@/components/pixel-rain";
import { RateTicker } from "@/components/rate-ticker";
// mock-data no longer imported — all rates come from live API
import { formatMoney, formatPct } from "@/lib/utils";
import {
	ArrowRight,
	ShieldCheck,
	Zap,
	Lock,
	Smartphone,
	Building2,
	Repeat,
	UserCheck,
	CreditCard,
	ArrowDownUp,
	ChevronDown,
	Shield,
	Server,
	KeyRound,
	FileCheck,
	Star,
	Menu,
	X,
	Users,
	TrendingUp,
	Wallet,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Shared animation config                                           */
/* ------------------------------------------------------------------ */

const fadeUp = {
	initial: { opacity: 0, y: 24 },
	animate: { opacity: 1, y: 0 },
};
const transition = { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const };
const stagger = { staggerChildren: 0.08 };

function Section({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-60px" });
	return (
		<motion.section
			ref={ref}
			id={id}
			initial="initial"
			animate={inView ? "animate" : "initial"}
			variants={{ animate: { transition: stagger } }}
			className={className}
		>
			{children}
		</motion.section>
	);
}

function FadeUp({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
	return (
		<motion.div variants={fadeUp} transition={{ ...transition, delay }} className={className}>
			{children}
		</motion.div>
	);
}

/* ------------------------------------------------------------------ */
/*  Counter animation                                                  */
/* ------------------------------------------------------------------ */

function Counter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true });
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (!inView) return;
		let start = 0;
		const end = target;
		const duration = 1500;
		const step = end / (duration / 16);
		const timer = setInterval(() => {
			start += step;
			if (start >= end) {
				setCount(end);
				clearInterval(timer);
			} else {
				setCount(Math.floor(start));
			}
		}, 16);
		return () => clearInterval(timer);
	}, [inView, target]);

	return (
		<span ref={ref} className="tabular-nums font-display font-bold">
			{prefix}{count.toLocaleString()}{suffix}
		</span>
	);
}

/* ------------------------------------------------------------------ */
/*  FAQ Accordion                                                      */
/* ------------------------------------------------------------------ */

function FAQ({ q, a }: { q: string; a: string }) {
	const [open, setOpen] = useState(false);
	const id = q.replace(/\s+/g, "-").toLowerCase().slice(0, 30);
	return (
		<div className="border-b border-border">
			<button
				onClick={() => setOpen(!open)}
				aria-expanded={open}
				aria-controls={`faq-${id}`}
				className="flex w-full items-center justify-between gap-4 py-4 sm:py-5 text-left text-sm sm:text-base font-medium hover:text-primary transition-colors"
			>
				{q}
				<ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
			</button>
			<AnimatePresence initial={false}>
				{open && (
					<motion.div
						id={`faq-${id}`}
						role="region"
						aria-labelledby={`faq-btn-${id}`}
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="overflow-hidden"
					>
						<p className="pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
	const [mobileMenu, setMobileMenu] = useState(false);
	const { scrollY } = useScroll();
	const navShadow = useTransform(scrollY, [0, 50], [0, 1]);
	const [shadow, setShadow] = useState(0);

	useEffect(() => {
		return navShadow.on("change", (v) => setShadow(v));
	}, [navShadow]);

	return (
		<div className="min-h-screen bg-background">
			{/* ─── Nav ─── */}
			<nav
				className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur transition-shadow"
				style={{ boxShadow: shadow > 0.5 ? "0 1px 8px rgba(0,0,0,0.06)" : "none" }}
			>
				<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
					<Logo />
					<div className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
						<a href="#rates" className="hover:text-foreground transition-colors">Rates</a>
						<a href="#how" className="hover:text-foreground transition-colors">How it works</a>
						<a href="#features" className="hover:text-foreground transition-colors">Features</a>
						<a href="#security" className="hover:text-foreground transition-colors">Security</a>
						<a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
					</div>
					<div className="flex items-center gap-2">
						<Button variant="ghost" asChild size="sm" className="hidden sm:inline-flex font-semibold">
							<Link href="/login">Log in</Link>
						</Button>
						<Button asChild size="sm" >
							<Link href="/signup">Get started</Link>
						</Button>
						<button onClick={() => setMobileMenu(!mobileMenu)} className="ml-1 md:hidden p-2 text-muted-foreground" aria-label={mobileMenu ? "Close menu" : "Open menu"} aria-expanded={mobileMenu}>
							{mobileMenu ? <X className="size-5" /> : <Menu className="size-5" />}
						</button>
					</div>
				</div>
				{/* Mobile menu */}
				<AnimatePresence>
					{mobileMenu && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="overflow-hidden border-t border-border md:hidden"
						>
							<div className="flex flex-col gap-1 px-4 sm:px-6 py-4 text-sm font-medium">
								{[["#rates", "Rates"], ["#how", "How it works"], ["#features", "Features"], ["#security", "Security"], ["#faq", "FAQ"]].map(([href, label]) => (
									<a key={href} href={href} onClick={() => setMobileMenu(false)} className="py-2 text-muted-foreground hover:text-foreground">{label}</a>
								))}
								<Link href="/login" onClick={() => setMobileMenu(false)} className="py-2 text-muted-foreground hover:text-foreground">Log in</Link>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</nav>

			{/* ─── Sticky rate ticker ─── */}
			<RateTicker />

			{/* ─── Hero ──�� */}
			<section className="relative overflow-hidden border-b border-border">
				<PixelRain className="z-0" variant="dark" columns={18} seed={42} />
				<div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 lg:py-28">
					<div className="grid items-center gap-12 lg:grid-cols-[1fr_420px]">
						<motion.div initial="initial" animate="animate" variants={{ animate: { transition: stagger } }}>
							<FadeUp>
								<Badge variant="info" className="mb-6 gap-2">
									<span className="size-1.5 rounded-full bg-info animate-pulse" /> SEC Nigeria Licensed VASP
								</Badge>
							</FadeUp>
							<FadeUp delay={0.05}>
								<h1 className="max-w-2xl font-display text-[28px] font-bold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
									Buy & Sell USDT{" "}<br className="hidden sm:block" />instantly to{" "}<span className="text-light-green">Naira</span>
								</h1>
							</FadeUp>
							<FadeUp delay={0.1}>
								<p className="mt-6 max-w-xl text-lg text-muted-foreground">
									Convert Naira to USDT and USDC across multiple chains. Fair rates, transparent fees,
									multi-sig custody — built for Nigeria.
								</p>
							</FadeUp>
							<FadeUp delay={0.15}>
								<div className="mt-8 flex flex-col sm:flex-row gap-3">
									<Button size="xl" asChild className="w-full sm:w-auto">
										<Link href="/signup">Create free account <ArrowRight className="size-4" /></Link>
									</Button>
									<Button size="xl" variant="outline" asChild className="w-full sm:w-auto">
										<Link href="#rates">See today&#39;s rates</Link>
									</Button>
								</div>
							</FadeUp>
							<FadeUp delay={0.2}>
								<div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
									<span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-success" /> SEC Nigeria Licensed</span>
									<span className="inline-flex items-center gap-1.5"><Lock className="size-3.5 text-primary" /> Multi-sig custody</span>
									<span className="inline-flex items-center gap-1.5"><Zap className="size-3.5 text-warning" /> Instant settlement</span>
								</div>
							</FadeUp>

							{/* Mobile swap — simplified inline converter */}
							<FadeUp delay={0.25}>
								<div className="mt-8 lg:hidden">
									<MobileSwapPreview />
								</div>
							</FadeUp>
						</motion.div>

						{/* Desktop swap widget */}
						<motion.div
							initial={{ opacity: 0, scale: 0.96, y: 16 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
						>
							<HeroSwap />
						</motion.div>
					</div>
				</div>
			</section>

			{/* ─── Stats bar (Roqqu-style) ─── */}
			<Section className="border-b border-border bg-warm-beige/40">
				<div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
					<div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
						{[
							{ icon: Users, value: 12000, suffix: "+", label: "Verified Users" },
							{ icon: TrendingUp, value: 4, prefix: "₦", suffix: "B+", label: "Volume Traded" },
							{ icon: Wallet, value: 5, suffix: "", label: "Supported Chains" },
							{ icon: ShieldCheck, value: 99, suffix: ".9%", label: "Platform Uptime" },
						].map((s) => (
							<FadeUp key={s.label}>
								<div className="flex items-center gap-3 sm:gap-4">
									<div className="flex size-10 sm:size-12 items-center justify-center rounded-xl bg-brand-100/50 text-brand-700 shrink-0">
										<s.icon className="size-5 sm:size-6" />
									</div>
									<div>
										<div className="font-display text-xl sm:text-2xl font-bold tracking-tight text-custom-black">
											<Counter target={s.value} prefix={s.prefix} suffix={s.suffix} />
										</div>
										<p className="text-xs sm:text-sm text-muted-foreground">{s.label}</p>
									</div>
								</div>
							</FadeUp>
						))}
					</div>
				</div>
			</Section>

			{/* Rate strip removed — rates shown in sticky ticker above */}

			{/* ─── How it works ─── */}
			<Section id="how" className="border-b border-border">
				<div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
					<FadeUp>
						<div className="text-center">
							<Badge variant="secondary" className="mb-4">Simple onboarding</Badge>
							<h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Three steps to your first stablecoin</h2>
							<p className="mt-2 text-sm sm:text-base text-muted-foreground">No debit card. No crypto experience needed.</p>
						</div>
					</FadeUp>
					<div className="mt-8 sm:mt-10 md:mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
						{[
							{ step: "1", icon: UserCheck, title: "Sign Up", body: "Create your free account with your email or phone number. Verify your BVN in under 2 minutes." },
							{ step: "2", icon: CreditCard, title: "Fund with Naira", body: "Send Naira via bank transfer. Funds arrive instantly. No debit card needed, no extra charges." },
							{ step: "3", icon: ArrowDownUp, title: "Buy USDT", body: "Pick your stablecoin and chain. Confirm the rate, tap buy — USDT lands in your wallet immediately." },
						].map((s, i) => (
							<FadeUp key={s.step} delay={i * 0.1}>
								<div className="relative flex flex-col items-center text-center">
									{i < 2 && (
										<div className="absolute top-8 left-full hidden w-8 border-t-2 border-dashed border-border md:block" style={{ transform: "translateX(-16px)" }} />
									)}
									<div className="flex size-16 items-center justify-center rounded-full bg-light-green border-2 border-custom-black text-2xl font-bold">
										{s.step}
									</div>
									<h3 className="mt-4 text-xl font-bold">{s.title}</h3>
									<p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
								</div>
							</FadeUp>
						))}
					</div>
				</div>
			</Section>

			{/* ─── Features (hero feature + grid) ─── */}
			<Section id="features" className="border-b border-border bg-warm-beige/50">
				<div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
					{/* Hero feature */}
					<FadeUp>
						<div className="rounded-2xl border border-border bg-card p-5 sm:p-6 md:p-8 lg:p-10">
							<div className="grid items-center gap-8 md:grid-cols-2">
								<div>
									<Badge variant="info" className="mb-4">Core product</Badge>
									<h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">USDT ↔ Naira in minutes</h2>
									<p className="mt-4 text-muted-foreground leading-relaxed">
										Buy USDT with a simple bank transfer. Sell back to Naira anytime — funds hit your bank account
										within minutes. Rates update in real time, fees shown before you confirm. No surprises.
									</p>
									<div className="mt-6 flex flex-wrap gap-2">
										{["Real-time rates", "0.75% transparent fee", "Instant settlement", "Multi-chain"].map((t) => (
											<span key={t} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">{t}</span>
										))}
									</div>
								</div>
								<div className="rounded-xl border border-border bg-muted/50 p-4 sm:p-6">
									<div className="space-y-3 text-sm">
										<div className="flex items-center justify-between rounded-lg bg-background p-3">
											<span className="text-muted-foreground">You send</span>
											<span className="font-display font-bold">₦500,000</span>
										</div>
										<div className="flex justify-center"><ArrowDownUp className="size-4 text-muted-foreground" /></div>
										<div className="flex items-center justify-between rounded-lg bg-background p-3">
											<span className="text-muted-foreground">You receive</span>
											<span className="inline-flex items-center gap-2 font-display font-bold"><AssetLogo symbol="USDT" size="sm" /> 318.47 USDT</span>
										</div>
										<div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
											<span>Fee (0.75%)</span>
											<span>₦3,750</span>
										</div>
										<div className="flex items-center justify-between text-xs text-muted-foreground">
											<span>Rate</span>
											<span>1 USDT = ₦1,570</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</FadeUp>

					{/* Supporting features */}
					<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{[
							{ icon: ShieldCheck, title: "Multi-sig custody", body: "Cold storage with multi-signature controls. Hot wallets monitored and rebalanced around the clock." },
							{ icon: Smartphone, title: "Built mobile-first", body: "Receive via QR, send to any wallet, track every transaction — optimised for your phone." },
							{ icon: Building2, title: "Naira rails that work", body: "Fund via NIP bank transfer. Withdraw to any Nigerian bank. No debit cards needed." },
							{ icon: Zap, title: "Tiered KYC", body: "Start with BVN (Tier 1). Upgrade to NIN + ID for higher limits. Self-service, no wait." },
							{ icon: Lock, title: "You stay in control", body: "2FA, wallet PIN, session management, and withdrawal allow-lists. Your rules." },
						].map((f, i) => (
							<FadeUp key={f.title} delay={i * 0.06}>
								<div className="rounded-xl border border-border bg-card p-6 h-full hover:border-primary/20 transition-colors">
									<div className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
										<f.icon className="size-5" />
									</div>
									<h3 className="mt-4 font-semibold">{f.title}</h3>
									<p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
								</div>
							</FadeUp>
						))}
					</div>
				</div>
			</Section>

			{/* ─── Fee transparency ─── */}
			<Section className="border-b border-border">
				<div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
					<FadeUp>
						<div className="text-center">
							<Badge variant="secondary" className="mb-4">No hidden fees</Badge>
							<h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Transparent pricing</h2>
							<p className="mt-2 text-sm sm:text-base text-muted-foreground">What you see is what you pay. Always.</p>
						</div>
					</FadeUp>
					<FadeUp delay={0.1}>
						{/* Desktop table */}
						<div className="mx-auto mt-10 max-w-2xl rounded-xl border border-border bg-card overflow-hidden hidden sm:block">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b border-border bg-muted/50">
										<th className="px-4 sm:px-6 py-3 text-left font-medium text-muted-foreground">Action</th>
										<th className="px-4 sm:px-6 py-3 text-right font-medium text-muted-foreground">Fee</th>
									</tr>
								</thead>
								<tbody>
									{[
										["Buy stablecoins (NGN → USDT/USDC)", "0.75%"],
										["Sell stablecoins (USDT/USDC → NGN)", "0.75%"],
										["Internal send (Clusteer → Clusteer)", "Free"],
										["External withdrawal", "Network fee only"],
										["Receive stablecoins", "Free"],
										["Naira deposit (bank transfer)", "Free"],
										["Naira withdrawal (to bank)", "Free"],
									].map(([action, fee], i) => (
										<tr key={i} className="border-b border-border last:border-0">
											<td className="px-4 sm:px-6 py-3.5">{action}</td>
											<td className="px-4 sm:px-6 py-3.5 text-right font-medium">
												<span className={fee === "Free" ? "text-success" : ""}>{fee === "Free" ? "✓ Free" : fee}</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						{/* Mobile stacked cards */}
						<div className="mt-8 space-y-2 sm:hidden">
							{[
								["Buy stablecoins", "NGN → USDT/USDC", "0.75%"],
								["Sell stablecoins", "USDT/USDC → NGN", "0.75%"],
								["Internal send", "Clusteer → Clusteer", "Free"],
								["External withdrawal", "To external wallet", "Network fee only"],
								["Receive stablecoins", "From any wallet", "Free"],
								["Naira deposit", "Bank transfer", "Free"],
								["Naira withdrawal", "To your bank", "Free"],
							].map(([action, desc, fee], i) => (
								<div key={i} className="flex items-center justify-between rounded-lg border border-border bg-card p-3.5">
									<div>
										<p className="text-sm font-medium">{action}</p>
										<p className="text-xs text-muted-foreground">{desc}</p>
									</div>
									<span className={`text-sm font-semibold shrink-0 ml-3 ${fee === "Free" ? "text-success" : ""}`}>{fee === "Free" ? "✓ Free" : fee}</span>
								</div>
							))}
						</div>
					</FadeUp>
				</div>
			</Section>

			{/* ─── Security ��── */}
			<Section id="security" className="border-b border-border bg-warm-beige/50">
				<div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
					<FadeUp>
						<div className="text-center">
							<Badge variant="secondary" className="mb-4">Bank-grade security</Badge>
							<h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Your stablecoins are safe with us</h2>
							<p className="mt-2 max-w-xl mx-auto text-muted-foreground">
								We built Clusteer with the same security standards used by banks and institutional custodians.
							</p>
						</div>
					</FadeUp>
					<div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{[
							{ icon: Shield, title: "Multi-sig wallets", body: "Hot, warm, and cold wallets with multi-signature approval. No single point of compromise." },
							{ icon: Server, title: "Cold storage", body: "The majority of stablecoins are held offline in air-gapped cold storage." },
							{ icon: KeyRound, title: "AES-256 encryption", body: "Private keys and PII encrypted at rest with AES-256-GCM. Column-level encryption on all sensitive fields." },
							{ icon: FileCheck, title: "Audit trail", body: "Every action — admin or user — is logged immutably. Full compliance with SEC Nigeria requirements." },
						].map((s, i) => (
							<FadeUp key={s.title} delay={i * 0.08}>
								<div className="rounded-xl border border-border bg-card p-6 text-center h-full">
									<div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
										<s.icon className="size-6" />
									</div>
									<h3 className="mt-4 font-semibold">{s.title}</h3>
									<p className="mt-2 text-xs text-muted-foreground leading-relaxed">{s.body}</p>
								</div>
							</FadeUp>
						))}
					</div>
					{/* Networks inline */}
					<FadeUp delay={0.2}>
						<div className="mt-12 rounded-xl border border-border bg-card p-6 text-center">
							<p className="text-sm font-medium">Supported networks</p>
							<p className="mt-1 text-xs text-muted-foreground">USDT and USDC across five chains. We auto-route for the lowest fee.</p>
							<div className="mt-4 flex flex-wrap justify-center gap-2">
								{["Tron", "BSC", "Ethereum", "Solana", "Polygon"].map((c) => (
									<ChainBadge key={c} chain={c} className="px-3 py-1.5 text-sm" />
								))}
							</div>
						</div>
					</FadeUp>
				</div>
			</Section>

			{/* ─── Testimonials ─── */}
			<Section className="border-b border-border">
				<div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
					<FadeUp>
						<div className="text-center">
							<h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Trusted by Nigerians</h2>
							<p className="mt-2 text-muted-foreground">What our users say.</p>
						</div>
					</FadeUp>
					<div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
						{[
							{ name: "Adaeze O.", role: "Freelancer, Lagos", quote: "I receive USDT from clients abroad and sell to Naira on Clusteer. The rate is always fair and money hits my bank in minutes. Better than any P2P platform I've used.", rating: 5 },
							{ name: "Tunde B.", role: "Trader, Abuja", quote: "The BVN verification was instant — I was buying USDT within 5 minutes of signing up. The multi-chain support means I can always pick the cheapest network.", rating: 5 },
							{ name: "Fatima Y.", role: "Student, Kano", quote: "I use Clusteer to save in USDT instead of keeping Naira. The app is simple, fees are clear, and I feel safe knowing my funds are in cold storage.", rating: 5 },
						].map((t, i) => (
							<FadeUp key={t.name} delay={i * 0.1}>
								<div className="rounded-xl border border-border bg-card p-6 h-full flex flex-col">
									<div className="flex gap-0.5 mb-3">
										{Array.from({ length: t.rating }).map((_, j) => (
											<Star key={j} className="size-4 fill-warning text-warning" />
										))}
									</div>
									<p className="text-sm text-muted-foreground leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
									<div className="mt-4 pt-4 border-t border-border">
										<p className="font-semibold text-sm">{t.name}</p>
										<p className="text-xs text-muted-foreground">{t.role}</p>
									</div>
								</div>
							</FadeUp>
						))}
					</div>
				</div>
			</Section>

			{/* ─── FAQ ─── */}
			<Section id="faq" className="border-b border-border bg-muted/30">
				<div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
					<FadeUp>
						<div className="text-center mb-8 sm:mb-10">
							<h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Frequently asked questions</h2>
						</div>
					</FadeUp>
					<FadeUp delay={0.1}>
						<div>
							{[
								{ q: "What is USDT?", a: "USDT (Tether) is a stablecoin — a digital currency pegged 1:1 to the US Dollar. 1 USDT always equals approximately $1. It's the most widely used stablecoin in the world and the easiest way to hold dollar-value without a domiciliary account." },
								{ q: "How do I buy USDT with Naira?", a: "Sign up, verify your BVN (takes under 2 minutes), fund your account via bank transfer, and buy USDT at the live rate. The whole process takes under 10 minutes for first-time users." },
								{ q: "What are your fees?", a: "Buy and sell: 0.75%. Internal transfers between Clusteer users are free. External withdrawals only cost the blockchain network fee. Naira deposits and withdrawals are free." },
								{ q: "Is my money safe?", a: "Yes. Stablecoins are held in multi-signature cold storage wallets. All private keys are encrypted with AES-256-GCM. We maintain full audit trails and are licensed by the SEC Nigeria as a VASP." },
								{ q: "Which chains do you support?", a: "USDT is available on Tron (TRC-20), BSC (BEP-20), and Ethereum (ERC-20). USDC is available on Ethereum, Solana, and Polygon. We auto-suggest the cheapest network for each transfer." },
								{ q: "How long do withdrawals take?", a: "Naira withdrawals to your bank arrive within minutes during business hours. Stablecoin withdrawals to external wallets depend on the chain — typically 1-5 minutes for Tron, 2-10 minutes for others." },
								{ q: "Do I need a bank account?", a: "Yes, you need a Nigerian bank account to deposit and withdraw Naira. You can add multiple bank accounts in your settings." },
								{ q: "What KYC documents do I need?", a: "Tier 1 requires only your BVN. Tier 2 adds NIN and a government-issued ID. Tier 3 adds proof of address. Higher tiers unlock higher transaction limits." },
							].map((item) => (
								<FAQ key={item.q} q={item.q} a={item.a} />
							))}
						</div>
					</FadeUp>
				</div>
			</Section>

			{/* ─── CTA ─── */}
			<Section className="border-b-2 border-custom-black bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 text-white">
				<div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
					<div className="grid items-center gap-8 sm:gap-10 md:grid-cols-2">
						<FadeUp>
							<div>
								<h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Start trading stablecoins today.</h2>
								<p className="mt-3 text-white/70 text-sm sm:text-base">Join thousands of Nigerians already using Clusteer.</p>
								<div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-white/80">
									{["1. Create account", "2. Verify BVN", "3. Buy USDT"].map((s, i) => (
										<span key={s} className="inline-flex items-center gap-2">
											{i > 0 && <ArrowRight className="size-3 text-white/40 hidden sm:block" />}
											<span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs sm:text-sm">{s}</span>
										</span>
									))}
								</div>
							</div>
						</FadeUp>
						<FadeUp delay={0.1}>
							<div className="flex flex-col items-stretch sm:items-start md:items-end gap-4">
								<Button size="xl" asChild  className="w-full sm:w-auto">
									<Link href="/signup">Create free account <ArrowRight className="size-4" /></Link>
								</Button>
								<p className="text-xs text-white/50 text-center sm:text-left md:text-right">No debit card required. All you need is a BVN.</p>
							</div>
						</FadeUp>
					</div>
				</div>
			</Section>

			{/* ─── Footer ─── */}
			<footer className="border-t border-border">
				<div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
					<div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 md:grid-cols-4">
						<div className="col-span-2 md:col-span-1">
							<Logo />
							<p className="mt-3 text-xs text-muted-foreground leading-relaxed">
								Buy, sell, and hold stablecoins with Naira. Licensed by the SEC Nigeria.
							</p>
						</div>
						<div>
							<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</p>
							<div className="mt-3 flex flex-col gap-2 text-sm">
								<Link href="/signup" className="text-muted-foreground hover:text-foreground transition-colors">Get started</Link>
								<a href="#rates" className="text-muted-foreground hover:text-foreground transition-colors">Rates</a>
								<a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
								<a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
							</div>
						</div>
						<div>
							<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Legal</p>
							<div className="mt-3 flex flex-col gap-2 text-sm">
								<Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
								<Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
								<Link href="/security-info" className="text-muted-foreground hover:text-foreground transition-colors">Security</Link>
							</div>
						</div>
						<div>
							<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Support</p>
							<div className="mt-3 flex flex-col gap-2 text-sm">
								<Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">Help centre</Link>
								<a href="mailto:support@clusteer.com" className="text-muted-foreground hover:text-foreground transition-colors">support@clusteer.com</a>
							</div>
						</div>
					</div>
					<div className="mt-8 sm:mt-10 border-t border-border pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-muted-foreground text-center sm:text-left">
						<p>© {new Date().getFullYear()} Clusteer Technologies Ltd. RC 1234567. Licensed by the Securities and Exchange Commission, Nigeria (VASP).</p>
						<p className="text-muted-foreground/60">All stablecoin balances are held in multi-signature custodial wallets.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  Mobile swap preview                                                */
/* ------------------------------------------------------------------ */

function MobileSwapPreview() {
	const { data } = useQuery({ queryKey: ["ticker-rates"], queryFn: async () => { const r = await fetch("/api/system/exchange-rate?targetCurrency=NGN&amount=1&type=buy"); return r.json(); }, staleTime: 30_000 });
	const rate = data?.buyRate ? Math.round(data.buyRate) : 1570;
	const receive = (100000 / rate).toFixed(2);
	return (
		<div className="pointer-events-auto rounded-xl border border-border bg-card p-4 shadow-sm">
			<div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
				<div className="flex items-center gap-2">
					<AssetLogo symbol="NGN" size="sm" />
					<div className="min-w-0">
						<p className="text-[10px] text-muted-foreground">You pay</p>
						<p className="font-display font-bold text-sm truncate">₦100,000</p>
					</div>
				</div>
				<ArrowRight className="size-3.5 text-muted-foreground" />
				<div className="flex items-center gap-2 justify-end">
					<div className="min-w-0 text-right">
						<p className="text-[10px] text-muted-foreground">You receive</p>
						<p className="font-display font-bold text-sm truncate">{receive} USDT</p>
					</div>
					<AssetLogo symbol="USDT" size="sm" />
				</div>
			</div>
			<div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
				<span>1 USDT = {formatMoney(rate, "NGN", { decimals: 0 })}</span>
				<span className="text-success font-medium">Fee: 0.75%</span>
			</div>
			<Button asChild className="mt-3 w-full" size="sm">
				<Link href="/signup">Buy USDT now</Link>
			</Button>
		</div>
	);
}
