import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { ChainBadge } from "@/components/primitives/chain-badge";
import { Num } from "@/components/primitives/num";
import { Sparkline } from "@/components/primitives/sparkline";
import { ASSETS } from "@/lib/mock-data";
import { formatMoney, formatPct } from "@/lib/utils";
import { ArrowRight, ShieldCheck, Zap, Globe2, Lock, Smartphone, Building2 } from "lucide-react";

export default function Home() {
	return (
		<div className="min-h-screen bg-background">
			{/* Nav */}
			<nav className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
				<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
					<Logo />
					<div className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
						<a href="#assets" className="hover:text-foreground">Markets</a>
						<a href="#features" className="hover:text-foreground">Features</a>
						<a href="#security" className="hover:text-foreground">Security</a>
						<a href="#fees" className="hover:text-foreground">Fees</a>
					</div>
					<div className="flex items-center gap-2">
						<Button variant="ghost" asChild size="sm">
							<Link href="/login">Log in</Link>
						</Button>
						<Button asChild size="sm">
							<Link href="/signup">Get started</Link>
						</Button>
					</div>
				</div>
			</nav>

			{/* Hero */}
			<section className="relative overflow-hidden border-b border-border">
				<div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
				<div className="relative mx-auto max-w-6xl px-6 py-24">
					<Badge variant="info" className="mb-6">
						<span className="size-1.5 rounded-full bg-info" /> Licensed VASP · Secured by institutional custody
					</Badge>
					<h1 className="max-w-3xl font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
						Bridge your Naira into the global digital economy.
					</h1>
					<p className="mt-6 max-w-xl text-lg text-muted-foreground">
						Buy, sell, swap and hold crypto with Naira. One account, multi-chain, audited — built
						for Nigeria.
					</p>
					<div className="mt-8 flex flex-wrap gap-3">
						<Button size="xl" asChild>
							<Link href="/signup">Create free account <ArrowRight className="size-4" /></Link>
						</Button>
						<Button size="xl" variant="outline" asChild>
							<Link href="#assets">See rates</Link>
						</Button>
					</div>
					<div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
						<span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-success" /> Insured custody</span>
						<span className="inline-flex items-center gap-2"><Lock className="size-4 text-primary" /> Multi-sig treasury</span>
						<span className="inline-flex items-center gap-2"><Zap className="size-4 text-warning" /> 60-second onboarding</span>
					</div>
				</div>
			</section>

			{/* Market strip */}
			<section id="assets" className="border-b border-border bg-card/40">
				<div className="mx-auto max-w-6xl px-6 py-12">
					<div className="flex items-end justify-between">
						<div>
							<h2 className="font-display text-2xl font-bold tracking-tight">Live Naira rates</h2>
							<p className="mt-1 text-sm text-muted-foreground">No hidden spread. Same rate everyone sees.</p>
						</div>
						<Button variant="ghost" size="sm" asChild>
							<Link href="/signup">Trade now <ArrowRight className="size-3.5" /></Link>
						</Button>
					</div>
					<div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{ASSETS.slice(0, 6).map((a) => (
							<div key={a.symbol} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
								<AssetLogo symbol={a.symbol} size="lg" />
								<div className="min-w-0 flex-1">
									<div className="flex items-center gap-2">
										<span className="font-semibold">{a.name}</span>
										<span className="text-xs text-muted-foreground">{a.symbol}</span>
									</div>
									<div className="mt-1 flex items-baseline gap-2">
										<Num className="text-sm" value={formatMoney(a.priceNgn, "NGN", { decimals: 0 })} />
										<Num
											className="text-xs"
											tone={a.change24h >= 0 ? "positive" : "negative"}
											value={formatPct(a.change24h)}
										/>
									</div>
								</div>
								<Sparkline data={a.sparkline} width={80} height={32} />
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Features */}
			<section id="features" className="border-b border-border">
				<div className="mx-auto max-w-6xl px-6 py-20">
					<h2 className="font-display text-3xl font-bold tracking-tight">Everything you need to move money.</h2>
					<div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
						{[
							{ icon: Globe2, title: "Multi-chain, unified", body: "USDT on Tron, ETH on Ethereum, BTC — we handle the chain. You pick the asset." },
							{ icon: ShieldCheck, title: "Institutional-grade custody", body: "Cold-stored with multi-sig. Hot wallets monitored 24/7 with automated rebalancing." },
							{ icon: Smartphone, title: "Built mobile-first", body: "Receive, send, and scan QR from your phone. Bank-grade biometric locks." },
							{ icon: Building2, title: "Local rails", body: "Naira in and out via NIP bank transfer. No debit cards, no chargebacks, no surprises." },
							{ icon: Zap, title: "60-second onboarding", body: "BVN → selfie → trade. Tier up later when you need higher limits." },
							{ icon: Lock, title: "You stay in control", body: "2FA, session management, withdrawal allow-lists, and per-device approval." },
						].map((f) => (
							<div key={f.title} className="rounded-xl border border-border bg-card p-6">
								<div className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
									<f.icon className="size-5" />
								</div>
								<h3 className="mt-4 font-semibold">{f.title}</h3>
								<p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Supported chains */}
			<section id="security" className="border-b border-border bg-muted/40">
				<div className="mx-auto max-w-6xl px-6 py-20">
					<h2 className="font-display text-3xl font-bold tracking-tight">Supported networks</h2>
					<p className="mt-2 max-w-xl text-sm text-muted-foreground">
						Send and receive across six chains — we route automatically for the best fee.
					</p>
					<div className="mt-8 flex flex-wrap gap-3">
						{["Bitcoin", "Ethereum", "Tron", "Solana", "BSC", "Polygon"].map((c) => (
							<ChainBadge key={c} chain={c} className="px-3 py-1.5 text-sm" />
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="border-b border-border">
				<div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-20 md:flex-row md:items-center md:justify-between">
					<div>
						<h2 className="font-display text-3xl font-bold tracking-tight">Start in under a minute.</h2>
						<p className="mt-2 text-muted-foreground">No debit card required. BVN is all you need to begin.</p>
					</div>
					<Button size="xl" asChild>
						<Link href="/signup">Create account <ArrowRight className="size-4" /></Link>
					</Button>
				</div>
			</section>

			{/* Footer */}
			<footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted-foreground">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<Logo />
					<div className="flex gap-6">
						<a href="#" className="hover:text-foreground">Terms</a>
						<a href="#" className="hover:text-foreground">Privacy</a>
						<a href="#" className="hover:text-foreground">Security</a>
						<a href="/help" className="hover:text-foreground">Support</a>
					</div>
				</div>
				<p className="mt-6 text-xs">© {new Date().getFullYear()} Clusteer Technologies Ltd. Licensed by the SEC Nigeria.</p>
			</footer>
		</div>
	);
}
