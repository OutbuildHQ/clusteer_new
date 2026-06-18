import { Mail, Briefcase, Heart, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Careers — Build the future of money in Nigeria with Clusteer",
	description:
		"We're not hiring right now, but we're always glad to meet exceptional people. Send us a note and we'll keep you in mind.",
};

export default function CareersPage() {
	return (
		<main>
			{/* ─── Hero ─── */}
			<section className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className="max-w-[820px]">
					<div className="font-mono text-[11px] font-semibold text-custom-black/70 tracking-[1.5px] mb-3 sm:mb-4">
						&#9670; CAREERS
					</div>
					<h1 className="font-display text-[clamp(36px,9vw,88px)] sm:text-[clamp(48px,7vw,88px)] font-bold leading-[0.92] tracking-[-0.045em]">
						Build money that <em className="italic">works.</em>
					</h1>
					<p className="mt-5 sm:mt-7 text-[15px] sm:text-[17px] lg:text-[19px] text-muted-foreground max-w-[600px] leading-[1.55]">
						We&apos;re a small team helping Nigerians move between stablecoins
						and naira without friction. We hire rarely and deliberately.
					</p>
				</div>
			</section>

			{/* ─── No open positions ─── */}
			<section className="pb-12 sm:pb-20 lg:pb-28 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className="bg-custom-black border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-6 sm:p-12 lg:p-16 flex flex-col items-start gap-5 sm:gap-6">
					<div className="size-12 sm:size-[52px] rounded-2xl bg-light-green text-custom-black inline-flex items-center justify-center">
						<Briefcase className="size-5 sm:size-[22px]" strokeWidth={2.4} />
					</div>
					<div className="font-mono text-[11px] font-semibold text-light-green tracking-[1.5px] uppercase">
						Open roles
					</div>
					<h2 className="font-display text-[clamp(26px,6vw,44px)] font-bold leading-none tracking-[-0.03em] text-white">
						No open positions right now.
					</h2>
					<p className="text-sm sm:text-[15px] leading-relaxed text-white/60 max-w-[560px]">
						We don&apos;t have any roles open at the moment. But we&apos;re
						always glad to meet exceptional people — engineers, designers,
						compliance and operations folks who care about getting money
						movement right. If that&apos;s you, reach out and we&apos;ll keep
						you in mind for when we do hire.
					</p>
					<a
						href="mailto:careers@clusteer.com"
						className="mt-1 inline-flex items-center gap-2 rounded-full bg-light-green border-2 border-light-green px-5 py-2.5 font-semibold text-custom-black text-sm hover:bg-transparent hover:text-light-green transition-colors"
					>
						<Mail className="size-4" /> careers@clusteer.com
					</a>
				</div>
			</section>

			{/* ─── What we value ─── */}
			<section className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 bg-warm-beige">
				<div className="max-w-[1280px] mx-auto">
					<div className="mb-8 sm:mb-14 max-w-[720px]">
						<div className="font-mono text-[11px] font-semibold text-custom-black/70 tracking-[1.5px] mb-3 sm:mb-4">
							&#9670; WHAT WE VALUE
						</div>
						<h2 className="font-display text-[clamp(28px,7vw,56px)] sm:text-[clamp(36px,5vw,56px)] font-bold leading-none tracking-[-0.04em]">
							How we work
						</h2>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
						{[
							{
								icon: <Zap className="size-5 sm:size-[22px]" strokeWidth={2.4} />,
								t: "Ship with care",
								d: "We move money for real people. We build deliberately, test hard, and sweat the details.",
							},
							{
								icon: <Heart className="size-5 sm:size-[22px]" strokeWidth={2.4} />,
								t: "Trust first",
								d: "Non-custodial by design. We never hold what isn't ours, and we earn trust every transaction.",
							},
							{
								icon: <Briefcase className="size-5 sm:size-[22px]" strokeWidth={2.4} />,
								t: "Small and senior",
								d: "A lean team of owners. Everyone here ships, and everyone's work reaches users quickly.",
							},
						].map((c) => (
							<div
								key={c.t}
								className="bg-background border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-6 sm:p-8 flex flex-col gap-4"
							>
								<div className="size-12 sm:size-[52px] rounded-2xl bg-light-green border-[1.5px] border-custom-black inline-flex items-center justify-center">
									{c.icon}
								</div>
								<h3 className="font-display text-lg sm:text-xl font-bold tracking-[-0.02em]">
									{c.t}
								</h3>
								<p className="text-sm sm:text-[15px] leading-relaxed text-muted-foreground">
									{c.d}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</main>
	);
}
