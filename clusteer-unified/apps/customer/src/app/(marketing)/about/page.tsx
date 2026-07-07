import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	ArrowRight,
	Banknote,
	Zap,
	ShieldCheck,
	Users,
	MapPin,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About Clusteer — Stablecoins to Naira, No Drama",
	description:
		"Clusteer is a Nigerian stablecoin exchange built by Outbuild Ltd. Buy, sell, and hold USDT and USDC with Naira — simple, fast, and bank-transfer-based.",
};

export default function AboutPage() {
	return (
		<main>
			{/* ─── Hero ─── */}
			<section className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className="max-w-[820px]">
					<div className="font-mono text-[11px] font-semibold text-custom-black/70 tracking-[1.5px] mb-3 sm:mb-4">
						&#9670; ABOUT US
					</div>
					<h1 className="font-display text-[clamp(36px,9vw,88px)] sm:text-[clamp(48px,7vw,88px)] font-bold leading-[0.92] tracking-[-0.045em]">
						Making stablecoins{" "}
						<em className="italic">as easy as</em> mobile money.
					</h1>
					<p className="mt-5 sm:mt-7 text-[15px] sm:text-[17px] lg:text-[19px] text-muted-foreground max-w-[600px] leading-[1.55]">
						Clusteer is a Nigerian stablecoin exchange that lets anyone buy, sell,
						and hold USDT and USDC with Naira. No debit cards, no crypto jargon
						&mdash; just simple, fast, bank-transfer-based trading. Built by{" "}
						<strong className="text-foreground">Outbuild Ltd</strong>.
					</p>
				</div>
			</section>

			{/* ─── Our story ─── */}
			<section className="pb-12 sm:pb-20 lg:pb-28 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className="mb-8 sm:mb-12 max-w-[720px]">
					<div className="font-mono text-[11px] font-semibold text-custom-black/70 tracking-[1.5px] mb-3 sm:mb-4">
						&#9670; OUR STORY
					</div>
					<h2 className="font-display text-[clamp(28px,7vw,56px)] sm:text-[clamp(36px,5vw,56px)] font-bold leading-none tracking-[-0.04em]">
						We got tired of losing money in the gap.
					</h2>
					<p className="mt-4 sm:mt-6 text-[15px] sm:text-[17px] text-muted-foreground max-w-[560px] leading-[1.55]">
						Clusteer was built by people who lived the problem &mdash; and
						decided the rails deserved better.
					</p>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
					{/* Story */}
					<div className="lg:col-span-7 bg-warm-beige border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-6 sm:p-9 lg:p-10 flex flex-col justify-center gap-4 sm:gap-5">
						<p className="text-[15px] sm:text-[16.5px] leading-[1.6] text-custom-black">
							To turn stablecoins back into spendable naira, you used to have one
							of three bad options: trust a P2P stranger, swallow a spread you
							couldn&apos;t see, or park your money on a platform that could
							freeze it without warning.
						</p>
						<p className="text-[15px] sm:text-[16.5px] leading-[1.6] text-muted-foreground">
							We thought moving between stables and the naira should feel like
							sending a text &mdash; instant, transparent, and entirely yours. So
							we built a non-custodial rail: you keep your keys, a licensed
							partner settles each order, and the price you&apos;re quoted is the
							price you get.
						</p>
						<p className="text-[15px] sm:text-[16.5px] leading-[1.6] text-muted-foreground">
							We&apos;re building Clusteer for freelancers pricing in dollars,
							businesses paying suppliers, and families protecting their savings.
							We&apos;re early &mdash; and building in the open.
						</p>
					</div>
					{/* Mission quote */}
					<div className="lg:col-span-5 bg-custom-black text-white border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-6 sm:p-9 lg:p-10 flex flex-col justify-between gap-6 min-h-[260px]">
						<div className="font-mono text-[11px] font-semibold text-light-green tracking-[1.5px] uppercase">
							Our mission
						</div>
						<div className="font-display font-extrabold text-[clamp(22px,2.8vw,32px)] leading-[1.15] tracking-[-0.02em]">
							&ldquo;Money should move at the speed of Nigeria &mdash; instantly,
							transparently, and on terms you own.&rdquo;
						</div>
						<div className="flex items-center gap-2 text-[13px] text-white/60">
							<span className="size-2 rounded-full bg-light-green" />
							Founding principle, day one
						</div>
					</div>
				</div>
			</section>

			{/* ─── What Makes Us Different ─── */}
			<section className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 bg-custom-black text-white">
				<div className="max-w-[1280px] mx-auto">
					<div className="mb-8 sm:mb-14 max-w-[720px]">
						<div className="font-mono text-[11px] font-semibold text-light-green tracking-[1.5px] mb-3 sm:mb-4">
							&#9670; WHAT WE BELIEVE
						</div>
						<h2 className="font-display text-[clamp(28px,7vw,56px)] sm:text-[clamp(36px,5vw,56px)] font-bold leading-none tracking-[-0.04em]">
							Four things we won&apos;t compromise on.
						</h2>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
						{[
							{
								icon: ShieldCheck,
								title: "Non-custodial, always",
								copy: "Your funds are never ours to hold, freeze, or lose. Every order settles to your own wallet or bank — we route, we never custody.",
							},
							{
								icon: Zap,
								title: "Same-day or it failed",
								copy: "We measure ourselves in minutes, not business days. Most payouts land before you've closed the app.",
							},
							{
								icon: Banknote,
								title: "One honest price",
								copy: "A flat 0.75%, shown before you confirm. No spread, no markup buried in the rate, no surprises at settlement.",
							},
							{
								icon: Users,
								title: "Built with Nigerians",
								copy: "Every feature starts with how money actually moves here — bank transfers, BVN, NIP — not a template borrowed from somewhere else.",
							},
						].map((item, i) => (
							<div
								key={i}
								className="bg-white/[0.04] border border-white/10 rounded-[20px] sm:rounded-3xl p-5 sm:p-8 flex flex-col gap-3 sm:gap-4"
							>
								<div className="size-12 sm:size-[52px] rounded-2xl bg-light-green/[0.12] text-light-green inline-flex items-center justify-center">
									<item.icon
										className="size-5 sm:size-[22px]"
										strokeWidth={2.4}
									/>
								</div>
								<div className="font-display text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.02em]">
									{item.title}
								</div>
								<p className="text-sm sm:text-[15px] leading-relaxed text-white/70">
									{item.copy}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ─── Team ─── */}
			<section className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className="mb-8 sm:mb-14 max-w-[720px]">
					<div className="font-mono text-[11px] font-semibold text-custom-black/70 tracking-[1.5px] mb-3 sm:mb-4">
						&#9670; THE TEAM
					</div>
					<h2 className="font-display text-[clamp(28px,7vw,56px)] sm:text-[clamp(36px,5vw,56px)] font-bold leading-none tracking-[-0.04em]">
						Small team. <em className="italic">Big mission.</em>
					</h2>
					<p className="mt-4 sm:mt-6 text-[15px] sm:text-[17px] text-muted-foreground max-w-[520px] leading-[1.55]">
						We are a small, focused team based in Lagos building financial tools
						for Africa. Every day we ship, we get closer to making stablecoins
						accessible to everyone.
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
					{/* Placeholder team cards */}
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="bg-warm-beige border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-5 sm:p-8 flex flex-col items-center text-center gap-3 sm:gap-4"
						>
							<div className="size-20 sm:size-24 rounded-full bg-custom-black/[0.06] border-2 border-dashed border-custom-black/20 inline-flex items-center justify-center">
								<Users
									className="size-8 sm:size-10 text-custom-black/30"
									strokeWidth={1.5}
								/>
							</div>
							<div className="font-display text-lg sm:text-xl font-bold tracking-[-0.02em] text-custom-black/40">
								Coming soon
							</div>
							<p className="text-sm text-muted-foreground">
								We are growing the team.
							</p>
						</div>
					))}
				</div>

				{/* Hiring CTA */}
				<div className="mt-6 sm:mt-10 bg-[#EFFCD0] border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-6 sm:p-10 lg:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-8">
					<div>
						<div className="flex items-center gap-2 mb-2">
							<MapPin className="size-4 text-custom-black/70" />
							<span className="font-mono text-[11px] font-semibold text-custom-black/70 tracking-[1.5px] uppercase">
								Lagos, Nigeria
							</span>
						</div>
						<h3 className="font-display text-xl sm:text-2xl font-bold tracking-[-0.02em]">
							Want to build the future of money in Africa?
						</h3>
						<p className="mt-2 text-sm sm:text-[15px] text-muted-foreground">
							We are always looking for talented people who care about financial
							access.
						</p>
					</div>
					<Button asChild className="btn-shine shadow-brutal-sm shrink-0">
						<Link href="/careers">
							View open roles <ArrowRight className="size-4" />
						</Link>
					</Button>
				</div>
			</section>

			{/* ─── CTA ─── */}
			<section className="py-8 sm:py-10 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className="bg-light-green border-2 border-custom-black rounded-[22px] sm:rounded-[36px] p-6 sm:p-12 lg:p-16 relative overflow-hidden">
					<div className="absolute -right-6 -bottom-6 sm:-right-10 sm:-bottom-10 opacity-[0.08] sm:opacity-[0.15]">
						<svg
							className="w-[150px] h-[150px] sm:w-[280px] sm:h-[280px] lg:w-[400px] lg:h-[400px]"
							viewBox="0 0 110 110"
							fill="none"
						>
							<path
								d="M4.99993 54.5605C4.99993 27.0705 25.7099 4.41769 52.3788 1.35297C55.7761 0.962547 58.5603 3.77234 58.5603 7.19206L58.5603 54.5605L58.5603 101.929C58.5603 105.349 55.7761 108.158 52.3788 107.768C25.7099 104.703 4.99993 82.0504 4.99993 54.5605Z"
								fill="#21241D"
							/>
							<circle cx="76.9814" cy="31.0309" r="7.27554" fill="#21241D" />
							<circle cx="76.9814" cy="54.5603" r="7.27554" fill="#21241D" />
							<circle cx="76.9814" cy="78.0898" r="7.27554" fill="#21241D" />
							<circle cx="97.7243" cy="54.5603" r="7.27554" fill="#21241D" />
						</svg>
					</div>
					<div className="relative max-w-[720px]">
						<h2 className="font-display text-[clamp(28px,8vw,68px)] sm:text-[clamp(36px,6vw,68px)] font-bold leading-[0.95] tracking-[-0.045em] text-custom-black">
							Ready to trade stablecoins the easy way?
						</h2>
						<p className="mt-4 sm:mt-6 text-[15px] sm:text-[17px] lg:text-[18px] text-custom-black/75 max-w-[480px] leading-[1.5]">
							Be among the first to move between naira and stablecoins
							&mdash; non-custodial, transparent, and entirely yours.
						</p>
						<div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
							<Button
								size="xl"
								asChild
								className="btn-shine bg-custom-black text-light-green hover:bg-custom-black/90 border-2 border-custom-black shadow-brutal w-full sm:w-auto text-base sm:text-[17px]"
							>
								<Link href="/early-access">
									Join the waitlist <ArrowRight className="size-5" />
								</Link>
							</Button>
							<Button
								size="xl"
								variant="outline"
								asChild
								className="border-2 border-custom-black w-full sm:w-auto text-base sm:text-[17px]"
							>
								<Link href="/contact">Talk to us</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
