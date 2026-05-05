"use client";

import Link from "next/link";
import { ArrowRight, Bell, Eye, Zap, Mail, MessageSquare, SlidersHorizontal, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RateAlertsPage() {
	return (
		<>
			{/* ─── Hero ─── */}
			<section className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className="max-w-[720px]">
					<div className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-brand-800 mb-3 sm:mb-4">
						&#9670; RATE ALERTS
					</div>
					<h1 className="font-display text-[clamp(36px,8vw,80px)] sm:text-[clamp(48px,6vw,80px)] font-bold leading-[0.92] tracking-[-0.045em]">
						Never miss the <span className="lime-highlight">right rate.</span>
					</h1>
					<p className="mt-5 sm:mt-7 text-[15px] sm:text-[17px] lg:text-[19px] text-muted-foreground max-w-[520px] leading-[1.5]">
						Set your target exchange rate and we will notify you the moment it hits. Stop refreshing, start trading at the price you actually want.
					</p>
					<div className="mt-6 sm:mt-8">
						<Button size="xl" asChild className="btn-shine shadow-brutal w-full sm:w-auto text-base sm:text-[17px]">
							<Link href="/signup">Create account to set alerts <ArrowRight className="size-5" /></Link>
						</Button>
					</div>
				</div>
			</section>

			{/* ─── How it works ─── */}
			<section className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className="mb-8 sm:mb-16 max-w-[720px]">
					<div className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-brand-800 mb-3 sm:mb-4">
						&#9670; HOW IT WORKS
					</div>
					<h2 className="font-display text-[clamp(28px,7vw,68px)] sm:text-[clamp(36px,5vw,68px)] font-bold leading-none tracking-[-0.04em]">
						Three steps. <em className="italic">Done.</em>
					</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5">
					{[
						{
							n: "01",
							icon: SlidersHorizontal,
							title: "Set your target rate",
							copy: "Pick a currency pair and enter the rate you want. USDT/NGN at 1,650? USDC/NGN at 1,640? You decide.",
							bg: "bg-warm-beige",
						},
						{
							n: "02",
							icon: Eye,
							title: "We watch 24/7",
							copy: "Our systems monitor exchange rates around the clock, comparing live market data against your target every few seconds.",
							bg: "bg-[#EFFCD0]",
						},
						{
							n: "03",
							icon: Zap,
							title: "Get notified instantly",
							copy: "The moment your target rate is hit, you get an instant notification. Jump in and lock the rate before it moves.",
							bg: "bg-light-green",
						},
					].map((s) => (
						<div key={s.n} className={`${s.bg} border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-5 sm:p-8 flex flex-col gap-3 sm:gap-4`}>
							<div className="flex items-center justify-between">
								<div className="size-12 sm:size-[52px] rounded-2xl bg-custom-black text-light-green inline-flex items-center justify-center">
									<s.icon className="size-5 sm:size-[22px]" strokeWidth={2.4} />
								</div>
								<span className="font-display text-[48px] sm:text-[64px] font-[800] leading-[0.85] tracking-[-0.05em] text-custom-black/10">
									{s.n}
								</span>
							</div>
							<div className="font-display text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.02em]">
								{s.title}
							</div>
							<p className="text-sm sm:text-[15px] leading-relaxed text-muted-foreground">
								{s.copy}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* ─── Feature highlights ─── */}
			<section className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className="mb-8 sm:mb-16 max-w-[720px]">
					<div className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-brand-800 mb-3 sm:mb-4">
						&#9670; FEATURES
					</div>
					<h2 className="font-display text-[clamp(28px,7vw,68px)] sm:text-[clamp(36px,5vw,68px)] font-bold leading-none tracking-[-0.04em]">
						Everything you need to <em className="italic">time it right.</em>
					</h2>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
					{[
						{
							icon: Mail,
							title: "Email alerts",
							copy: "Get notified straight to your inbox when your target rate is reached. Works with any email provider.",
							badge: null,
						},
						{
							icon: MessageSquare,
							title: "SMS alerts",
							copy: "Receive rate alerts via SMS to your Nigerian phone number. Never miss a rate even when you are offline.",
							badge: "Coming soon",
						},
						{
							icon: SlidersHorizontal,
							title: "Custom thresholds",
							copy: "Set exact rates or percentage-based thresholds. Get alerted when rates go above, below, or hit your exact number.",
							badge: null,
						},
						{
							icon: BarChart3,
							title: "Multiple pairs",
							copy: "Monitor USDT/NGN, USDC/NGN, and more. Set unlimited alerts across all supported currency pairs.",
							badge: null,
						},
					].map((f, i) => (
						<div key={i} className="bg-background border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-5 sm:p-8 flex flex-col gap-3 sm:gap-4">
							<div className="flex items-center gap-3">
								<div className="size-12 sm:size-[52px] rounded-2xl bg-light-green border-[1.5px] border-custom-black inline-flex items-center justify-center">
									<f.icon className="size-5 sm:size-[22px]" strokeWidth={2.4} />
								</div>
								{f.badge && (
									<span className="inline-flex items-center px-2.5 py-1 rounded-full bg-warm-beige border border-custom-black/20 text-[11px] font-semibold text-custom-black">
										{f.badge}
									</span>
								)}
							</div>
							<div className="font-display text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.02em]">
								{f.title}
							</div>
							<p className="text-sm sm:text-[15px] leading-relaxed text-muted-foreground">
								{f.copy}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* ─── CTA ─── */}
			<section className="py-8 sm:py-10 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className="bg-light-green border-2 border-custom-black rounded-[22px] sm:rounded-[36px] p-6 sm:p-12 lg:p-16 relative overflow-hidden">
					<div className="absolute -right-6 -bottom-6 sm:-right-10 sm:-bottom-10 opacity-[0.08] sm:opacity-[0.15]">
						<Bell className="w-[150px] h-[150px] sm:w-[280px] sm:h-[280px] lg:w-[400px] lg:h-[400px]" strokeWidth={0.5} />
					</div>
					<div className="relative max-w-[720px]">
						<h2 className="font-display text-[clamp(28px,8vw,68px)] sm:text-[clamp(36px,6vw,68px)] font-bold leading-[0.95] tracking-[-0.045em] text-custom-black">
							Stop refreshing.<br />Start <em className="italic">alerting.</em>
						</h2>
						<p className="mt-4 sm:mt-6 text-[15px] sm:text-[17px] lg:text-[18px] text-custom-black/75 max-w-[480px] leading-[1.5]">
							Rate alerts are free for all verified users. Create an account, set your target, and let us do the watching.
						</p>
						<div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
							<Button size="xl" asChild className="btn-shine bg-custom-black text-light-green hover:bg-custom-black/90 border-2 border-custom-black shadow-brutal w-full sm:w-auto text-base sm:text-[17px]">
								<Link href="/signup">Create account <ArrowRight className="size-5" /></Link>
							</Button>
							<Button size="xl" variant="outline" asChild className="border-2 border-custom-black w-full sm:w-auto text-base sm:text-[17px]">
								<Link href="/">Back to home</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* ─── Footer note ─── */}
			<section className="py-8 sm:py-12 px-4 sm:px-8 max-w-[1280px] mx-auto text-center">
				<p className="text-sm text-muted-foreground">
					Rate alerts are free for all verified Clusteer users. You must complete KYC verification to access this feature.
				</p>
			</section>
		</>
	);
}
