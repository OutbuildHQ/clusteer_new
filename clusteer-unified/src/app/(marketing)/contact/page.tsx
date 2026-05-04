import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	ArrowRight,
	Mail,
	Headphones,
	Twitter,
	Clock,
	HelpCircle,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Contact Clusteer — We'd Love to Hear From You",
	description:
		"Get in touch with Clusteer. Email us, reach out on social media, or check our FAQ for quick answers.",
};

export default function ContactPage() {
	return (
		<main>
			{/* ─── Hero ─── */}
			<section className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className="max-w-[820px]">
					<div className="font-mono text-[11px] font-semibold text-brand-800 tracking-[1.5px] mb-3 sm:mb-4">
						&#9670; CONTACT
					</div>
					<h1 className="font-display text-[clamp(36px,9vw,88px)] sm:text-[clamp(48px,7vw,88px)] font-bold leading-[0.92] tracking-[-0.045em]">
						We&apos;d love to <em className="italic">hear</em> from you.
					</h1>
					<p className="mt-5 sm:mt-7 text-[15px] sm:text-[17px] lg:text-[19px] text-muted-foreground max-w-[600px] leading-[1.55]">
						Have a question, a partnership idea, or just want to say hello? Reach
						out through any of the channels below. We respond fast.
					</p>
				</div>
			</section>

			{/* ─── Contact Cards ─── */}
			<section className="pb-12 sm:pb-20 lg:pb-28 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
					{/* Email */}
					<a
						href="mailto:hello@clusteer.com"
						className="group bg-warm-beige border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-5 sm:p-8 flex flex-col gap-3 sm:gap-4 h-full hover:shadow-brutal-sm transition-shadow"
					>
						<div className="size-12 sm:size-[52px] rounded-2xl bg-light-green border-[1.5px] border-custom-black inline-flex items-center justify-center">
							<Mail className="size-5 sm:size-[22px]" strokeWidth={2.4} />
						</div>
						<div className="font-display text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.02em]">
							General inquiries
						</div>
						<p className="text-sm sm:text-[15px] leading-relaxed text-muted-foreground">
							For partnerships, press, or anything else.
						</p>
						<div className="mt-auto pt-2 font-mono text-sm sm:text-[15px] font-semibold text-brand-800 group-hover:underline">
							hello@clusteer.com
						</div>
					</a>

					{/* Support */}
					<a
						href="mailto:support@clusteer.com"
						className="group bg-[#EFFCD0] border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-5 sm:p-8 flex flex-col gap-3 sm:gap-4 h-full hover:shadow-brutal-sm transition-shadow"
					>
						<div className="size-12 sm:size-[52px] rounded-2xl bg-light-green border-[1.5px] border-custom-black inline-flex items-center justify-center">
							<Headphones
								className="size-5 sm:size-[22px]"
								strokeWidth={2.4}
							/>
						</div>
						<div className="font-display text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.02em]">
							Customer support
						</div>
						<p className="text-sm sm:text-[15px] leading-relaxed text-muted-foreground">
							Need help with a trade, payout, or your account?
						</p>
						<div className="mt-auto pt-2 font-mono text-sm sm:text-[15px] font-semibold text-brand-800 group-hover:underline">
							support@clusteer.com
						</div>
					</a>

					{/* Social */}
					<a
						href="https://x.com/clusteer"
						target="_blank"
						rel="noopener noreferrer"
						className="group bg-custom-black text-white border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-5 sm:p-8 flex flex-col gap-3 sm:gap-4 h-full hover:shadow-brutal-sm transition-shadow"
					>
						<div className="size-12 sm:size-[52px] rounded-2xl bg-light-green/[0.12] text-light-green inline-flex items-center justify-center">
							<Twitter
								className="size-5 sm:size-[22px]"
								strokeWidth={2.4}
							/>
						</div>
						<div className="font-display text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.02em]">
							Follow us on X
						</div>
						<p className="text-sm sm:text-[15px] leading-relaxed text-white/70">
							Rate updates, product news, and memes about moving money in
							Nigeria.
						</p>
						<div className="mt-auto pt-2 font-mono text-sm sm:text-[15px] font-semibold text-light-green group-hover:underline">
							@clusteer
						</div>
					</a>
				</div>
			</section>

			{/* ─── Business Hours & FAQ ─── */}
			<section className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 bg-warm-beige">
				<div className="max-w-[1280px] mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
						{/* Business Hours */}
						<div className="bg-background border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-6 sm:p-10 lg:p-12 flex flex-col gap-4 sm:gap-5">
							<div className="size-12 sm:size-[52px] rounded-2xl bg-light-green border-[1.5px] border-custom-black inline-flex items-center justify-center">
								<Clock
									className="size-5 sm:size-[22px]"
									strokeWidth={2.4}
								/>
							</div>
							<div className="font-mono text-[11px] font-semibold text-brand-800 tracking-[1.5px] uppercase">
								Business hours
							</div>
							<h2 className="font-display text-xl sm:text-2xl lg:text-[32px] font-bold leading-tight tracking-[-0.025em]">
								Monday &ndash; Friday
							</h2>
							<div className="font-mono text-2xl sm:text-4xl font-semibold tracking-[-0.02em] text-brand-800">
								9:00 AM &ndash; 5:00 PM
							</div>
							<p className="text-sm sm:text-[15px] leading-relaxed text-muted-foreground">
								West Africa Time (WAT / GMT+1). We aim to respond to all
								emails within 4 hours during business hours.
							</p>
							<div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#EFFCD0] border-[1.5px] border-custom-black text-xs font-semibold w-fit">
								<span className="live-dot size-2 rounded-full bg-brand-800" />
								Trading is available 24/7
							</div>
						</div>

						{/* FAQ Link */}
						<div className="bg-light-green border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-6 sm:p-10 lg:p-12 flex flex-col gap-4 sm:gap-5">
							<div className="size-12 sm:size-[52px] rounded-2xl bg-custom-black text-light-green inline-flex items-center justify-center">
								<HelpCircle
									className="size-5 sm:size-[22px]"
									strokeWidth={2.4}
								/>
							</div>
							<div className="font-mono text-[11px] font-semibold text-brand-800 tracking-[1.5px] uppercase">
								Quick answers
							</div>
							<h2 className="font-display text-xl sm:text-2xl lg:text-[32px] font-bold leading-tight tracking-[-0.025em]">
								Check the FAQ first
							</h2>
							<p className="text-sm sm:text-[15px] leading-relaxed text-custom-black/70">
								Most questions about payouts, fees, KYC, and supported chains
								are answered in our FAQ. It might save you a wait.
							</p>
							<Button
								asChild
								className="btn-shine shadow-brutal-sm w-fit"
							>
								<Link href="/#faq">
									Read the FAQ <ArrowRight className="size-4" />
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* ─── CTA ─── */}
			<section className="py-8 sm:py-10 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className="bg-custom-black border-2 border-custom-black rounded-[22px] sm:rounded-[36px] p-6 sm:p-12 lg:p-16 relative overflow-hidden text-white">
					<div className="absolute -top-20 -right-20 size-64 rounded-full bg-[radial-gradient(circle,rgba(159,232,112,0.2)_0%,transparent_70%)]" />
					<div className="relative max-w-[720px]">
						<h2 className="font-display text-[clamp(28px,8vw,68px)] sm:text-[clamp(36px,6vw,68px)] font-bold leading-[0.95] tracking-[-0.045em]">
							Ready to start trading?
						</h2>
						<p className="mt-4 sm:mt-6 text-[15px] sm:text-[17px] lg:text-[18px] text-white/70 max-w-[480px] leading-[1.5]">
							Create your account in 3 minutes. Cash out in 5.
						</p>
						<div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
							<Button
								size="xl"
								asChild
								className="btn-shine bg-light-green text-custom-black hover:bg-light-green/90 border-2 border-custom-black shadow-brutal w-full sm:w-auto text-base sm:text-[17px]"
							>
								<Link href="/signup">
									Get started <ArrowRight className="size-5" />
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
