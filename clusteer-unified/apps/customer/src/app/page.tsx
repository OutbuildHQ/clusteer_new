"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useInView, AnimatePresence } from "motion/react";
import { SiteHeader } from "@/components/app/site-header";
import { Footer } from "@/components/app/footer";
import { Button } from "@/components/ui/button";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Num } from "@/components/primitives/num";
import { RateTicker } from "@/components/rate-ticker";
import { PixelRain } from "@/components/pixel-rain";
import { formatMoney } from "@/lib/utils";
import {
	ArrowRight, ShieldCheck, Zap, Lock, Check, Play,
	Bolt, Shield, Sparkles, ChevronDown, Star,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                   */
/* ------------------------------------------------------------------ */

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { once: true, margin: "-40px" });
	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 24 }}
			animate={inView ? { opacity: 1, y: 0 } : {}}
			transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

function Counter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
	const ref = useRef<HTMLSpanElement>(null);
	const inView = useInView(ref, { once: true });
	const [val, setVal] = useState(0);
	useEffect(() => {
		if (!inView) return;
		let frame: number;
		const start = performance.now();
		const dur = 1600;
		const tick = (now: number) => {
			const t = Math.min((now - start) / dur, 1);
			setVal(Math.round(target * t));
			if (t < 1) frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [inView, target]);
	return <span ref={ref} className="tabular-nums">{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ------------------------------------------------------------------ */
/*  Mini chart for hero visual                                          */
/* ------------------------------------------------------------------ */

function MiniChart() {
	const pts = [22, 28, 24, 30, 35, 32, 38, 42, 38, 45, 50, 48, 54, 58, 56, 62, 65, 60, 68, 72, 70, 75, 78];
	const w = 100, h = 100;
	const max = Math.max(...pts), min = Math.min(...pts);
	const path = pts.map((p, i) => {
		const x = (i / (pts.length - 1)) * w;
		const y = h - ((p - min) / (max - min)) * h;
		return `${i === 0 ? "M" : "L"} ${x} ${y}`;
	}).join(" ");
	const area = `${path} L ${w} ${h} L 0 ${h} Z`;
	return (
		<svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full">
			<defs>
				<linearGradient id="spark-g" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stopColor="var(--light-green)" stopOpacity={0.4} />
					<stop offset="100%" stopColor="var(--light-green)" stopOpacity={0} />
				</linearGradient>
			</defs>
			<path d={area} fill="url(#spark-g)" />
			<path d={path} stroke="var(--light-green)" strokeWidth="1.4" fill="none" vectorEffect="non-scaling-stroke" />
		</svg>
	);
}

/* ------------------------------------------------------------------ */
/*  Banks                                                                */
/* ------------------------------------------------------------------ */

const BANKS = [
	{ name: "GTBank", color: "#E5631A" }, { name: "Access", color: "#003366" },
	{ name: "Zenith", color: "#E10A0A" }, { name: "UBA", color: "#D10000" },
	{ name: "First Bank", color: "#003B7A" }, { name: "Kuda", color: "#40196D" },
	{ name: "Opay", color: "#0E9E4F" }, { name: "PalmPay", color: "#7C3AED" },
	{ name: "Stanbic", color: "#0033A0" }, { name: "Wema", color: "#7B1FA2" },
	{ name: "Fidelity", color: "#003D7A" }, { name: "Sterling", color: "#C8102E" },
];

/* ------------------------------------------------------------------ */
/*  FAQ                                                                  */
/* ------------------------------------------------------------------ */

function FAQ({ q, a }: { q: string; a: string }) {
	const [open, setOpen] = useState(false);
	return (
		<div className="border-b-2 border-custom-black/10">
			<button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between gap-3 py-4 sm:py-5 text-left font-display font-bold text-[15px] sm:text-base md:text-lg hover:text-custom-black transition-colors min-h-[44px]">
				{q}
				<ChevronDown className={`size-5 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
			</button>
			<AnimatePresence initial={false}>
				{open && (
					<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
						<p className="pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

/* ================================================================== */
/*  PAGE                                                                */
/* ================================================================== */

export default function Home() {
	// Live rates for hero visual
	const { data: rateData } = useQuery({
		queryKey: ["ticker-rates"],
		queryFn: async () => { const r = await fetch("/api/system/exchange-rate?targetCurrency=NGN&amount=1&type=buy"); return r.json(); },
		refetchInterval: 30_000, staleTime: 10_000,
	});
	const liveRate = rateData?.buyRate ? rateData.buyRate.toFixed(2) : "1,612.40";
	const liveRateInt = rateData?.buyRate ? Math.round(rateData.buyRate) : 1612;

	return (
		<div className="min-h-screen bg-background">
			<SiteHeader />

			{/* ─── Hero ─── */}
			<section className="relative overflow-hidden">
				<div className="mx-auto max-w-[1280px] px-4 sm:px-8 py-12 sm:py-16 lg:py-20">
					{/* Announce pill */}
					<FadeUp>
						<div className="inline-flex items-center gap-2 rounded-full border-2 border-custom-black bg-white px-3 py-1.5 text-[11px] sm:text-[13px] font-medium shadow-brutal-sm mb-6 sm:mb-8 lg:mb-10">
							<span className="rounded-full bg-light-green px-2 sm:px-2.5 py-0.5 font-display text-[11px] font-bold tracking-wide text-custom-black shrink-0">NEW</span>
							<span className="truncate">Same-day USDC payouts to any Nigerian bank →</span>
						</div>
					</FadeUp>

					<div className="grid items-center gap-10 lg:gap-16 lg:grid-cols-[1.15fr_0.85fr]">
						{/* Left — type stack */}
						<FadeUp delay={0.05}>
							<h1 className="font-display text-[clamp(36px,9vw,104px)] sm:text-[clamp(48px,7.2vw,104px)] font-bold leading-[0.92] tracking-[-0.045em]">
								Stables to{" "}<span className="lime-highlight">naira.</span>
								<br />No drama.
							</h1>
							<p className="mt-5 sm:mt-7 text-[15px] sm:text-[17px] lg:text-[19px] text-muted-foreground max-w-[520px] leading-[1.5]">
								Off-ramp <strong className="text-foreground">USDT and USDC</strong> straight to your Nigerian bank account at the best rate on the street. Settled in minutes, not days.
							</p>
							<div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-start">
								<Button size="xl" asChild className="btn-shine shadow-brutal w-full sm:w-auto text-base sm:text-[17px]">
									<Link href="/signup">Cash out now <ArrowRight className="size-5" /></Link>
								</Button>
								<Button size="xl" variant="ghost" asChild className="w-full sm:w-auto text-base sm:text-[17px] gap-3">
									<Link href="#how">
										<span className="size-8 rounded-full bg-custom-black text-light-green inline-flex items-center justify-center"><Play className="size-3 fill-current" /></span>
										See how it works
									</Link>
								</Button>
							</div>
							<div className="mt-6 sm:mt-11 flex flex-wrap gap-x-4 gap-y-2 sm:gap-5 lg:gap-7 text-[12px] sm:text-[13px] text-muted-foreground">
								<span className="inline-flex items-center gap-2"><Check className="size-3.5 text-custom-black/70" strokeWidth={2.6} /> <strong className="text-foreground">NDPR</strong> compliant</span>
								<span className="inline-flex items-center gap-2"><Check className="size-3.5 text-custom-black/70" strokeWidth={2.6} /> <strong className="text-foreground">92,000+</strong> Nigerians</span>
								<span className="inline-flex items-center gap-2"><Check className="size-3.5 text-custom-black/70" strokeWidth={2.6} /> <strong className="text-foreground">5-min</strong> payouts</span>
							</div>
						</FadeUp>

						{/* Right — onyx slab with live rate */}
						<FadeUp delay={0.15}>
							<div className="relative hidden lg:block" style={{ height: 540 }}>
								{/* Onyx slab */}
								<div className="absolute inset-0 bg-custom-black rounded-[36px] border-2 border-custom-black overflow-hidden">
									{/* Grid pattern */}
									<svg className="absolute inset-0 opacity-[0.06]" width="100%" height="100%">
										<defs><pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M 32 0 L 0 0 0 32" fill="none" stroke="var(--light-green)" strokeWidth="0.5" /></pattern></defs>
										<rect width="100%" height="100%" fill="url(#grid)" />
									</svg>
									{/* Glow */}
									<div className="absolute -top-24 -right-20 size-80 rounded-full bg-[radial-gradient(circle,color-mix(in srgb, var(--light-green) 25%, transparent)_0%,transparent_70%)]" />

									{/* Eyebrow */}
									<div className="absolute top-7 left-8 inline-flex items-center gap-2 font-mono text-xs font-medium text-light-green tracking-wider">
										<span className="live-dot size-2 rounded-full bg-light-green" />
										LIVE — USDT / NGN
									</div>

									{/* Big rate */}
									<div className="absolute top-[78px] left-8 right-8">
										<div className="font-mono text-[clamp(56px,6vw,88px)] font-semibold text-white leading-none tracking-[-0.04em] tabular-nums">
											₦{liveRate}
										</div>
										<div className="mt-2 text-[13px] text-white/60 flex items-center gap-2.5">
											per <span className="font-mono">1 USDT</span>
											<span className="text-light-green font-mono font-semibold">↑ 0.18%</span>
											<span>vs 1h ago</span>
										</div>
									</div>

									{/* Mini chart */}
									<div className="absolute bottom-[220px] left-8 right-8 h-20"><MiniChart /></div>

									{/* Swap card */}
									<div className="absolute bottom-7 left-7 right-7 bg-background rounded-[22px] p-5 border-[1.5px] border-custom-black flex flex-col gap-3">
										<div className="flex items-center justify-between p-3.5 bg-warm-beige rounded-[14px]">
											<div className="flex items-center gap-3">
												<AssetLogo symbol="USDT" size="md" />
												<div>
													<div className="font-mono text-[22px] font-semibold">1,000.00</div>
													<div className="text-[11px] text-muted-foreground font-medium">You send · USDT</div>
												</div>
											</div>
										</div>
										<div className="flex justify-center -my-1">
											<div className="size-9 rounded-xl bg-custom-black text-light-green inline-flex items-center justify-center border-2 border-background">
												<ArrowRight className="size-4 rotate-90" />
											</div>
										</div>
										<div className="flex items-center justify-between p-3.5 bg-[var(--button-bg)] rounded-[14px]">
											<div className="flex items-center gap-3">
												<AssetLogo symbol="NGN" size="md" />
												<div>
													<div className="font-mono text-[22px] font-semibold">{formatMoney(1000 * liveRateInt, "NGN", { decimals: 0 })}</div>
													<div className="text-[11px] text-custom-black/70 font-semibold">You receive · NGN · GTBank ••3421</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Floating badges */}
								<div className="float-1 absolute -top-3.5 right-10 bg-white px-3.5 py-2.5 rounded-full border-[1.5px] border-custom-black shadow-brutal-sm flex items-center gap-2 font-display font-bold text-[13px]">
									<AssetLogo symbol="USDC" size="sm" /> USDC
								</div>
								<div className="float-2 absolute bottom-20 -left-7 bg-light-green px-3.5 py-2.5 rounded-full border-[1.5px] border-custom-black shadow-brutal-sm flex items-center gap-2 font-display font-bold text-[13px]">
									<Bolt className="size-3.5" /> 4 min avg
								</div>
								<div className="float-3 absolute top-56 -right-8 bg-warm-beige px-3.5 py-2.5 rounded-full border-[1.5px] border-custom-black shadow-brutal-sm flex items-center gap-2 font-display font-bold text-[13px]">
									<Shield className="size-3.5" /> Bank-grade
								</div>
							</div>

							{/* Mobile — compact swap card */}
							<div className="lg:hidden">
								<MobileSwap rate={liveRateInt} />
							</div>
						</FadeUp>
					</div>
				</div>
			</section>

			{/* ─── Bank marquee ─── */}
			<section className="py-8 sm:py-9 bg-custom-black border-y-2 border-custom-black overflow-hidden">
				<div className="text-center mb-5 font-mono text-[11px] sm:text-xs font-medium text-white/55 tracking-[1.5px]">
					— PAYS OUT TO EVERY BANK IN NIGERIA —
				</div>
				<div className="flex w-max marquee-track">
					{[...BANKS, ...BANKS].map((b, i) => (
						<div key={i} className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-7 py-2.5 sm:py-3 mx-1.5 sm:mx-3 rounded-full border border-white/10 bg-white/[0.04] font-display font-semibold text-[13px] sm:text-[17px] text-white whitespace-nowrap">
							<span className="size-2.5 rounded-full" style={{ background: b.color, boxShadow: `0 0 10px ${b.color}66` }} />
							{b.name}
						</div>
					))}
				</div>
			</section>

			{/* ─── How it works ─── */}
			<section id="how" className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<FadeUp>
					<div className="mb-8 sm:mb-16 max-w-[720px]">
						<div className="font-mono text-xs font-semibold text-custom-black/70 tracking-[1.5px] mb-3 sm:mb-4">◆ HOW IT WORKS</div>
						<h2 className="font-display text-[clamp(28px,7vw,68px)] sm:text-[clamp(36px,5vw,68px)] font-bold leading-none tracking-[-0.04em]">
							Three steps. <em className="italic">That&apos;s it.</em>
						</h2>
					</div>
				</FadeUp>
				<div className="flex flex-col gap-6 sm:gap-8">
					{[
						{ n: "01", kicker: "Lock your rate", title: "Pick the amount, see exactly what hits your bank.", copy: "No hidden spread, no \"we'll figure it out\". The number you see is the number you get.", bg: "bg-warm-beige" },
						{ n: "02", kicker: "Send your stables", title: "USDT or USDC, on TRON, BSC, Solana, or Ethereum.", copy: "Scan the QR or copy the address. We watch the chain so you don't have to.", bg: "bg-[var(--button-bg)]" },
						{ n: "03", kicker: "Get paid", title: "Naira lands in your bank in under 5 minutes.", copy: "Average payout time is 4 min 12 sec. Slowest day this year was 11 min. We promise nothing — we just keep ours.", bg: "bg-custom-black", dark: true },
					].map((s, i) => (
						<FadeUp key={s.n} delay={i * 0.1}>
							<div className={`grid grid-cols-1 md:grid-cols-2 ${s.bg} rounded-[20px] sm:rounded-[32px] border-2 border-custom-black overflow-hidden min-h-0 sm:min-h-[400px]`}>
								<div className="p-5 sm:p-10 lg:p-14 flex flex-col justify-between gap-4 sm:gap-6">
									<div className={`font-display text-[48px] sm:text-[80px] lg:text-[120px] font-[800] leading-[0.85] tracking-[-0.05em] ${s.dark ? "text-light-green" : "text-custom-black"}`}>
										{s.n}
									</div>
									<div>
										<div className={`font-mono text-[11px] font-semibold tracking-[1.5px] uppercase mb-3 ${s.dark ? "text-light-green" : "text-custom-black/70"}`}>
											{s.kicker}
										</div>
										<h3 className={`font-display text-xl sm:text-2xl lg:text-[32px] font-bold leading-tight tracking-[-0.025em] mb-3 ${s.dark ? "text-white" : "text-custom-black"}`}>
											{s.title}
										</h3>
										<p className={`text-sm sm:text-[16px] leading-[1.55] max-w-[420px] ${s.dark ? "text-white/70" : "text-muted-foreground"}`}>
											{s.copy}
										</p>
									</div>
								</div>
								<div className={`border-t md:border-t-0 md:border-l-2 border-custom-black ${s.dark ? "bg-light-green/[0.04]" : "bg-custom-black/[0.03]"} flex items-center justify-center p-4 sm:p-8`}>
									{s.n === "01" && <StepVisualRate rate={liveRateInt} />}
									{s.n === "02" && <StepVisualSend />}
									{s.n === "03" && <StepVisualPaid rate={liveRateInt} />}
								</div>
							</div>
						</FadeUp>
					))}
				</div>
			</section>

			{/* ─── Stats ─── */}
			<section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<FadeUp>
					<div className="grid grid-cols-2 lg:grid-cols-4 border-2 border-custom-black rounded-[16px] sm:rounded-[28px] overflow-hidden">
						{[
							{ v: "₦42B+", l: "paid out to Nigerians", bg: "bg-background" },
							{ v: "4:12", l: "avg payout time, minutes", bg: "bg-light-green" },
							{ v: "92,000", l: "verified KYC users", bg: "bg-warm-beige" },
							{ v: "0.0%", l: "spread on the rate", bg: "bg-background" },
						].map((s, i) => (
							<div key={i} className={`${s.bg} p-4 sm:p-7 lg:p-9 flex flex-col gap-1.5 sm:gap-2 ${i < 3 ? "border-r-2 border-custom-black" : ""} ${i < 2 ? "border-b-2 lg:border-b-0 border-custom-black" : ""}`}>
								<div className="font-mono text-2xl sm:text-4xl lg:text-[56px] font-semibold leading-[0.95] tracking-[-0.03em] text-custom-black">{s.v}</div>
								<div className="text-[11px] sm:text-[13px] text-muted-foreground font-medium leading-snug">{s.l}</div>
							</div>
						))}
					</div>
				</FadeUp>
			</section>

			{/* ─── Trust ─── */}
			<section id="trust" className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<FadeUp>
					<div className="mb-8 sm:mb-14 max-w-[720px]">
						<div className="font-mono text-xs font-semibold text-custom-black/70 tracking-[1.5px] mb-3 sm:mb-4">◆ TRUST</div>
						<h2 className="font-display text-[clamp(28px,7vw,68px)] sm:text-[clamp(36px,5vw,68px)] font-bold leading-none tracking-[-0.04em]">
							We hold the boring stuff <em className="italic">seriously</em> so you don&apos;t have to.
						</h2>
					</div>
				</FadeUp>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
					{[
						{ icon: Shield, title: "Non-custodial by design", copy: "We never hold your crypto. Every order settles through our licensed, regulated payments partner and lands straight in your own wallet or bank." },
						{ icon: Lock, title: "NDPR aligned, NITDA registered", copy: "Your data is encrypted at rest and in transit. We disclose nothing without legal compulsion." },
						{ icon: ShieldCheck, title: "Redundant identity checks", copy: "Two independent KYC providers run in parallel. If one is down, the other catches your verification." },
					].map((it, i) => (
						<FadeUp key={i} delay={i * 0.08}>
							<div className="bg-background border-2 border-custom-black rounded-[18px] sm:rounded-3xl p-5 sm:p-8 flex flex-col gap-3 sm:gap-4 h-full">
								<div className="size-12 sm:size-[52px] rounded-2xl bg-light-green border-[1.5px] border-custom-black inline-flex items-center justify-center">
									<it.icon className="size-5 sm:size-[22px]" strokeWidth={2.4} />
								</div>
								<div className="font-display text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.02em]">{it.title}</div>
								<p className="text-sm sm:text-[15px] leading-relaxed text-muted-foreground">{it.copy}</p>
							</div>
						</FadeUp>
					))}
				</div>
			</section>

			{/* ─── App Showcase ─── */}
			<section id="app" className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 bg-custom-black text-white">
				<div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
					<FadeUp>
						<div className="font-mono text-xs font-semibold text-light-green tracking-[1.5px] mb-3 sm:mb-4">◆ MOBILE APP</div>
						<h2 className="font-display text-[clamp(28px,7vw,68px)] sm:text-[clamp(36px,5vw,68px)] font-bold leading-none tracking-[-0.04em]">
							Built for thumbs.<br /><span className="text-light-green">Not for desks.</span>
						</h2>
						<p className="mt-5 sm:mt-6 text-[15px] sm:text-[17px] lg:text-[18px] text-white/70 max-w-[480px] leading-[1.55]">
							Custom numpad. FaceID payouts. Live rate on your home screen widget. Designed in Lagos, for the way Nigerians actually move money.
						</p>
						<div className="flex flex-col gap-3 sm:gap-4 mt-6 sm:mt-10">
							{[
								{ icon: Bolt, t: "One-tap rate lock", s: "Hit the rate the moment you see it." },
								{ icon: Shield, t: "Biometric on every payout", s: "FaceID, TouchID, fingerprint, your call." },
								{ icon: Sparkles, t: "Home-screen widget", s: "USDT/NGN rate without unlocking the phone." },
							].map((f, i) => (
								<div key={i} className="flex items-start gap-3.5">
									<div className="size-10 rounded-xl bg-light-green/[0.12] text-light-green inline-flex items-center justify-center shrink-0">
										<f.icon className="size-[18px]" />
									</div>
									<div>
										<div className="font-display font-bold text-[17px]">{f.t}</div>
										<div className="text-sm text-white/60 mt-0.5">{f.s}</div>
									</div>
								</div>
							))}
						</div>
						<div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
							<div className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white">
								<Sparkles className="size-4" /> Mobile app coming soon
							</div>
						</div>
					</FadeUp>
					<FadeUp delay={0.15}>
						<div className="flex justify-center lg:justify-end">
							<PhoneMockup rate={liveRateInt} />
						</div>
					</FadeUp>
				</div>
			</section>

			{/* ─── FAQ ─── */}
			<section id="faq" className="py-12 sm:py-20 px-4 sm:px-8 max-w-[800px] mx-auto">
				<FadeUp>
					<div className="font-mono text-xs font-semibold text-custom-black/70 tracking-[1.5px] mb-4">◆ FAQ</div>
					<h2 className="font-display text-xl sm:text-3xl lg:text-4xl font-bold tracking-[-0.03em] mb-6 sm:mb-10">Common questions</h2>
				</FadeUp>
				<FadeUp delay={0.1}>
					<div>
						{[
							{ q: "What stablecoins do you support?", a: "USDT and USDC on Tron (TRC-20), BSC (BEP-20), Ethereum (ERC-20), Solana (SPL), and Polygon. We auto-detect the chain." },
							{ q: "How long do payouts take?", a: "Average 4 minutes 12 seconds. Naira hits your bank account via NIP instant transfer. No manual review for verified users." },
							{ q: "What are your fees?", a: "0.75% flat fee on all buy/sell orders. No hidden spread — the rate you see is the rate you get. Internal Clusteer-to-Clusteer sends are free." },
							{ q: "Is my money safe?", a: "We use bank-grade AES-256 encryption, BVN verification for every account, and two-factor authentication on all withdrawals. Your data and funds are protected at every layer." },
							{ q: "What KYC documents do I need?", a: "Tier 1: BVN only (2 minutes). Tier 2: NIN + government ID + selfie. Tier 3: proof of address + source of funds for high-volume traders." },
						].map((item) => <FAQ key={item.q} q={item.q} a={item.a} />)}
					</div>
				</FadeUp>
			</section>

			{/* ─── CTA ─── */}
			<section className="py-8 sm:py-10 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<FadeUp>
					<div className="bg-light-green border-2 border-custom-black rounded-[22px] sm:rounded-[36px] p-6 sm:p-12 lg:p-16 relative overflow-hidden">
						{/* Logo watermark */}
						<div className="absolute -right-6 -bottom-6 sm:-right-10 sm:-bottom-10 opacity-[0.08] sm:opacity-[0.15]">
							<svg className="w-[150px] h-[150px] sm:w-[280px] sm:h-[280px] lg:w-[400px] lg:h-[400px]" viewBox="0 0 110 110" fill="none">
								<path d="M4.99993 54.5605C4.99993 27.0705 25.7099 4.41769 52.3788 1.35297C55.7761 0.962547 58.5603 3.77234 58.5603 7.19206L58.5603 54.5605L58.5603 101.929C58.5603 105.349 55.7761 108.158 52.3788 107.768C25.7099 104.703 4.99993 82.0504 4.99993 54.5605Z" fill="#21241D"/>
								<circle cx="76.9814" cy="31.0309" r="7.27554" fill="#21241D"/>
								<circle cx="76.9814" cy="54.5603" r="7.27554" fill="#21241D"/>
								<circle cx="76.9814" cy="78.0898" r="7.27554" fill="#21241D"/>
								<circle cx="97.7243" cy="54.5603" r="7.27554" fill="#21241D"/>
							</svg>
						</div>
						<div className="relative max-w-[720px]">
							<h2 className="font-display text-[clamp(28px,8vw,88px)] sm:text-[clamp(36px,6vw,88px)] font-bold leading-[0.95] tracking-[-0.045em] text-custom-black">
								Your stables<br />deserve naira<br />in <em className="italic">minutes.</em>
							</h2>
							<p className="mt-4 sm:mt-6 text-[15px] sm:text-[17px] lg:text-[18px] text-custom-black/75 max-w-[480px] leading-[1.5]">
								Verify in 3 minutes. Cash out in 5. No phone calls, no &quot;send me proof&quot;, no drama.
							</p>
							<div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
								<Button size="xl" asChild className="btn-shine bg-custom-black text-light-green hover:bg-custom-black/90 border-2 border-custom-black shadow-brutal w-full sm:w-auto text-base sm:text-[17px]">
									<Link href="/signup">Create account <ArrowRight className="size-5" /></Link>
								</Button>
								<Button size="xl" variant="outline" asChild className="border-2 border-custom-black w-full sm:w-auto text-base sm:text-[17px]">
									<Link href="/support">Talk to us</Link>
								</Button>
							</div>
						</div>
					</div>
				</FadeUp>
			</section>

			{/* ─── Footer ─── */}
			<Footer />
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  Mobile swap preview                                                 */
/* ------------------------------------------------------------------ */

function MobileSwap({ rate }: { rate: number }) {
	const ngn = formatMoney(1000 * rate, "NGN", { decimals: 0 });
	return (
		<div className="rounded-[18px] sm:rounded-[20px] border-2 border-custom-black bg-custom-black p-3.5 sm:p-5 shadow-brutal">
			<div className="flex items-center gap-2 font-mono text-xs font-medium text-light-green tracking-wider mb-3">
				<span className="live-dot size-2 rounded-full bg-light-green" /> LIVE — USDT / NGN
			</div>
			<div className="font-mono text-2xl sm:text-4xl font-semibold text-white tabular-nums tracking-[-0.03em]">
				₦{rate.toLocaleString()}
			</div>
			<div className="mt-1 text-xs text-white/50">per 1 USDT</div>
			<div className="mt-3 sm:mt-4 bg-background rounded-2xl p-3 sm:p-4 border border-custom-black/10 space-y-2">
				<div className="flex items-center gap-3 p-3 bg-warm-beige rounded-xl">
					<AssetLogo symbol="USDT" size="sm" />
					<div>
						<div className="font-mono text-base sm:text-lg font-semibold">1,000.00</div>
						<div className="text-[10px] text-muted-foreground">You send · USDT</div>
					</div>
				</div>
				<div className="flex items-center gap-3 p-3 bg-[var(--button-bg)] rounded-xl">
					<AssetLogo symbol="NGN" size="sm" />
					<div className="min-w-0">
						<div className="font-mono text-base sm:text-lg font-semibold truncate">{ngn}</div>
						<div className="text-[10px] text-custom-black/70 font-semibold">You receive · NGN</div>
					</div>
				</div>
			</div>
			<Button asChild size="lg" className="btn-shine mt-4 w-full shadow-brutal-sm">
				<Link href="/signup">Cash out now</Link>
			</Button>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  Step visuals for How it Works                                       */
/* ------------------------------------------------------------------ */

function StepVisualRate({ rate }: { rate: number }) {
	const ngn = formatMoney(500 * rate, "NGN", { decimals: 0 });
	return (
		<div className="w-full max-w-[320px] sm:max-w-[380px] bg-background border-[1.5px] border-custom-black rounded-[20px] p-4 sm:p-6 flex flex-col gap-3">
			<div className="flex justify-between items-baseline">
				<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">You send</span>
				<span className="text-[11px] text-custom-black/70 font-semibold">USDT • TRC-20</span>
			</div>
			<div className="flex items-center gap-3">
				<AssetLogo symbol="USDT" size="lg" />
				<div className="font-mono text-2xl sm:text-4xl font-semibold tracking-[-0.02em]">500.00</div>
			</div>
			<div className="border-t border-dashed border-custom-black/20 my-1" />
			<div className="flex justify-between items-baseline">
				<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">You get</span>
				<span className="font-mono text-[11px] text-custom-black/70 font-semibold">@ ₦{rate.toLocaleString()}</span>
			</div>
			<div className="bg-light-green p-3.5 sm:p-4 rounded-[14px] border-[1.5px] border-custom-black flex items-center gap-3">
				<AssetLogo symbol="NGN" size="lg" />
				<div className="font-mono text-xl sm:text-[28px] font-semibold tracking-[-0.02em] text-custom-black truncate">{ngn}</div>
			</div>
			<div className="text-[11px] text-muted-foreground font-mono text-right">Fee: ₦0 • Spread: 0.0%</div>
		</div>
	);
}

function StepVisualSend() {
	return (
		<div className="w-full max-w-[280px] sm:max-w-[320px] bg-background border-[1.5px] border-custom-black rounded-[20px] p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 items-center">
			<div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Scan to send</div>
			{/* Decorative QR pattern */}
			<div className="w-[150px] sm:w-[200px] aspect-square p-3 bg-white border-[1.5px] border-custom-black rounded-2xl grid grid-cols-[repeat(15,1fr)]">
				{Array.from({ length: 225 }).map((_, i) => {
					const corner = [0,1,2,15,16,17,30,31,32,180,181,182,195,196,197,210,211,212].includes(i);
					const random = (i * 37) % 7 < 3;
					return <div key={i} className={`aspect-square ${corner || random ? "bg-custom-black" : ""}`} />;
				})}
			</div>
			<div className="font-mono text-[11px] font-medium text-muted-foreground text-center break-all max-w-[280px]">
				TR7NHqjeKQxGTCi8q8ZY4pL8…HX9w
			</div>
			<div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[var(--button-bg)] border-[1.5px] border-custom-black text-xs font-semibold">
				<span className="live-dot size-2 rounded-full bg-light-green" />
				Watching mempool
			</div>
		</div>
	);
}

function StepVisualPaid({ rate }: { rate: number }) {
	const ngn = formatMoney(500 * rate, "NGN", { decimals: 0 });
	return (
		<div className="w-full max-w-[320px] sm:max-w-[380px] bg-background border-[1.5px] border-background rounded-[20px] p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
			<div className="flex items-center gap-3">
				<div className="size-11 rounded-full bg-light-green border-2 border-custom-black inline-flex items-center justify-center">
					<Check className="size-5 text-custom-black" strokeWidth={3} />
				</div>
				<div>
					<div className="font-display text-lg font-bold">Payout settled</div>
					<div className="text-xs text-muted-foreground font-mono">04:12 elapsed • Block #61,832,409</div>
				</div>
			</div>
			<div className="bg-warm-beige rounded-[14px] p-4 border border-custom-black/8">
				<div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Credited to</div>
				<div className="flex items-center gap-2.5">
					<span className="size-2 rounded-full bg-[#E5631A]" />
					<span className="font-display font-bold">GTBank</span>
					<span className="font-mono text-[13px] text-muted-foreground">•• 3421</span>
				</div>
				<div className="font-mono text-xl sm:text-[28px] font-semibold text-custom-black mt-2 truncate">
					+{ngn}<span className="text-lg text-muted-foreground">.00</span>
				</div>
			</div>
			<div className="flex justify-between text-xs text-muted-foreground">
				<span>Ref: <span className="font-mono">CL-9F2A3D81</span></span>
				<span className="text-custom-black/70 font-semibold">✓ NIBSS confirmed</span>
			</div>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  Phone mockup for App Showcase                                       */
/* ------------------------------------------------------------------ */

function PhoneMockup({ rate }: { rate: number }) {
	return (
		<div className="relative flex justify-center">
			{/* Glow */}
			<div className="absolute inset-[10%_-10%] bg-[radial-gradient(circle,color-mix(in srgb, var(--light-green) 18%, transparent)_0%,transparent_65%)] blur-[40px]" />

			{/* Phone frame */}
			<div className="relative z-10 w-[280px] sm:w-[320px] lg:w-[340px] h-[580px] sm:h-[660px] lg:h-[700px] rounded-[44px] sm:rounded-[48px] lg:rounded-[56px] p-2.5 bg-[#0A0B08] border-2 border-white/80" style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)" }}>
				<div className="w-full h-full bg-background rounded-[34px] sm:rounded-[38px] lg:rounded-[46px] overflow-hidden relative">
					{/* Notch */}
					<div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-[90px] sm:w-[110px] h-6 sm:h-7 bg-[#0A0B08] rounded-full z-20" />
					{/* Status bar */}
					<div className="absolute top-4 left-6 right-6 flex justify-between font-display font-semibold text-xs z-30">
						<span>9:41</span><span>•••</span>
					</div>

					{/* Content */}
					<div className="px-4 sm:px-5 pt-14 pb-5 flex flex-col gap-3.5">
						{/* Header */}
						<div className="flex justify-between items-center">
							<div>
								<div className="text-[11px] text-muted-foreground">Welcome back</div>
								<div className="font-display text-base sm:text-lg font-bold">Adaeze ✦</div>
							</div>
							<div className="size-8 sm:size-9 rounded-full bg-custom-black text-light-green inline-flex items-center justify-center font-display font-bold text-sm">A</div>
						</div>

						{/* Balance card */}
						<div className="bg-custom-black text-white rounded-[20px] sm:rounded-3xl p-4 sm:p-5 relative overflow-hidden">
							<div className="absolute -top-10 -right-10 size-32 sm:size-40 rounded-full bg-[radial-gradient(circle,color-mix(in srgb, var(--light-green) 30%, transparent)_0%,transparent_70%)]" />
							<div className="text-[10px] sm:text-[11px] text-light-green font-mono tracking-[1.5px]">TOTAL BALANCE</div>
							<div className="font-mono text-[28px] sm:text-4xl font-semibold mt-1.5 sm:mt-2 tracking-[-0.02em]">
								₦2,481,302<span className="text-lg sm:text-xl opacity-50">.40</span>
							</div>
							<div className="text-[11px] text-white/60 mt-1">≈ <span className="font-mono">1,538.21 USDT</span></div>
							<div className="flex gap-1.5 sm:gap-2 mt-3 sm:mt-4">
								{[
									{ label: "Buy", bg: "bg-light-green text-custom-black" },
									{ label: "Sell", bg: "bg-white/[0.08] text-white" },
									{ label: "Orders", bg: "bg-white/[0.08] text-white" },
								].map((b) => (
									<div key={b.label} className={`flex-1 py-2 sm:py-2.5 rounded-xl ${b.bg} font-display font-bold text-xs sm:text-[13px] text-center`}>{b.label}</div>
								))}
							</div>
						</div>

						{/* Rate card */}
						<div className="bg-light-green rounded-[14px] sm:rounded-[18px] p-3 sm:p-4 flex items-center justify-between">
							<div>
								<div className="text-[10px] sm:text-[11px] text-custom-black/70 font-mono font-semibold">USDT / NGN</div>
								<div className="font-mono text-lg sm:text-[22px] font-semibold text-custom-black">₦{rate.toLocaleString()}</div>
							</div>
							<div className="w-16 sm:w-20 h-7 sm:h-9">
								<MiniChart />
							</div>
						</div>

						{/* Recent */}
						<div>
							<div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recent</div>
							{[
								{ t: "Sold USDT", d: "Just now", a: "+₦322,480", g: true },
								{ t: "Bought USDC", d: "2 hours ago", a: "-₦161,240", g: false },
							].map((r, i) => (
								<div key={i} className="flex items-center justify-between p-2 sm:p-2.5 bg-white rounded-xl border border-custom-black/6 mb-1.5">
									<div className="flex items-center gap-2 sm:gap-2.5">
										<div className={`size-7 sm:size-8 rounded-full ${r.g ? "bg-[var(--button-bg)] text-custom-black/70" : "bg-warm-beige text-custom-black"} inline-flex items-center justify-center`}>
											{r.g ? "−" : "+"}
										</div>
										<div>
											<div className="text-xs sm:text-[13px] font-semibold">{r.t}</div>
											<div className="text-[10px] sm:text-[11px] text-muted-foreground">{r.d}</div>
										</div>
									</div>
									<div className={`font-mono text-xs sm:text-[13px] font-semibold ${r.g ? "text-custom-black/70" : ""}`}>{r.a}</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
