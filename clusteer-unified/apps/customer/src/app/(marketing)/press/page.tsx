import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	ArrowRight,
	Download,
	Mail,
	Newspaper,
	Image as ImageIcon,
	FileText,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Press — Clusteer in the News",
	description:
		"Press kit, brand assets, and media inquiries for Clusteer. Download our logo and get in touch for coverage.",
};

export default function PressPage() {
	return (
		<main>
			{/* ─── Hero ─── */}
			<section className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className="max-w-[820px]">
					<div className="font-mono text-[11px] font-semibold text-custom-black/70 tracking-[1.5px] mb-3 sm:mb-4">
						&#9670; PRESS
					</div>
					<h1 className="font-display text-[clamp(36px,9vw,88px)] sm:text-[clamp(48px,7vw,88px)] font-bold leading-[0.92] tracking-[-0.045em]">
						Clusteer in the <em className="italic">news.</em>
					</h1>
					<p className="mt-5 sm:mt-7 text-[15px] sm:text-[17px] lg:text-[19px] text-muted-foreground max-w-[600px] leading-[1.55]">
						Everything you need to write about Clusteer. Brand assets, company
						facts, and a direct line to our team.
					</p>
				</div>
			</section>

			{/* ─── Brand Assets ─── */}
			<section className="pb-12 sm:pb-20 lg:pb-28 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className="mb-8 sm:mb-14 max-w-[720px]">
					<div className="font-mono text-[11px] font-semibold text-custom-black/70 tracking-[1.5px] mb-3 sm:mb-4">
						&#9670; BRAND ASSETS
					</div>
					<h2 className="font-display text-[clamp(28px,7vw,56px)] sm:text-[clamp(36px,5vw,56px)] font-bold leading-none tracking-[-0.04em]">
						Logo &amp; brand kit
					</h2>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
					{/* Logo on light */}
					<div className="bg-background border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-6 sm:p-10 flex flex-col items-center gap-4 sm:gap-6">
						<div className="w-full aspect-[2/1] bg-warm-beige rounded-2xl border border-custom-black/10 flex items-center justify-center">
							<div className="inline-flex items-center gap-3 font-display text-2xl sm:text-3xl font-bold text-custom-black">
								<svg
									className="size-10 sm:size-12"
									viewBox="0 0 110 110"
									fill="none"
								>
									<path
										d="M4.99993 54.5605C4.99993 27.0705 25.7099 4.41769 52.3788 1.35297C55.7761 0.962547 58.5603 3.77234 58.5603 7.19206L58.5603 54.5605L58.5603 101.929C58.5603 105.349 55.7761 108.158 52.3788 107.768C25.7099 104.703 4.99993 82.0504 4.99993 54.5605Z"
										fill="#21241D"
									/>
									<circle
										cx="76.9814"
										cy="31.0309"
										r="7.27554"
										fill="#21241D"
									/>
									<circle
										cx="76.9814"
										cy="54.5603"
										r="7.27554"
										fill="#21241D"
									/>
									<circle
										cx="76.9814"
										cy="78.0898"
										r="7.27554"
										fill="#21241D"
									/>
									<circle
										cx="97.7243"
										cy="54.5603"
										r="7.27554"
										fill="#21241D"
									/>
								</svg>
								Clusteer
							</div>
						</div>
						<div className="flex items-center gap-2">
							<span className="rounded-full border-2 border-custom-black px-3.5 py-1.5 text-xs font-semibold">
								Light background
							</span>
							<span className="rounded-full border-2 border-custom-black px-3.5 py-1.5 text-xs font-semibold">
								SVG
							</span>
						</div>
					</div>

					{/* Logo on dark */}
					<div className="bg-custom-black border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-6 sm:p-10 flex flex-col items-center gap-4 sm:gap-6">
						<div className="w-full aspect-[2/1] bg-white/[0.04] rounded-2xl border border-white/10 flex items-center justify-center">
							<div className="inline-flex items-center gap-3 font-display text-2xl sm:text-3xl font-bold text-white">
								<svg
									className="size-10 sm:size-12"
									viewBox="0 0 110 110"
									fill="none"
								>
									<path
										d="M4.99993 54.5605C4.99993 27.0705 25.7099 4.41769 52.3788 1.35297C55.7761 0.962547 58.5603 3.77234 58.5603 7.19206L58.5603 54.5605L58.5603 101.929C58.5603 105.349 55.7761 108.158 52.3788 107.768C25.7099 104.703 4.99993 82.0504 4.99993 54.5605Z"
										fill="#FFFFFF"
									/>
									<circle
										cx="76.9814"
										cy="31.0309"
										r="7.27554"
										fill="#FFFFFF"
									/>
									<circle
										cx="76.9814"
										cy="54.5603"
										r="7.27554"
										fill="#FFFFFF"
									/>
									<circle
										cx="76.9814"
										cy="78.0898"
										r="7.27554"
										fill="#FFFFFF"
									/>
									<circle
										cx="97.7243"
										cy="54.5603"
										r="7.27554"
										fill="#FFFFFF"
									/>
								</svg>
								Clusteer
							</div>
						</div>
						<div className="flex items-center gap-2">
							<span className="rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-white">
								Dark background
							</span>
							<span className="rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-white">
								SVG
							</span>
						</div>
					</div>
				</div>

				{/* Download placeholder */}
				<div className="mt-4 sm:mt-6 bg-[#EFFCD0] border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div className="flex items-start gap-4">
						<div className="size-12 sm:size-[52px] rounded-2xl bg-light-green border-[1.5px] border-custom-black inline-flex items-center justify-center shrink-0">
							<Download
								className="size-5 sm:size-[22px]"
								strokeWidth={2.4}
							/>
						</div>
						<div>
							<div className="font-display text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.02em]">
								Full brand kit
							</div>
							<p className="mt-1 text-sm text-muted-foreground">
								Logos (SVG, PNG), brand colors, typography guidelines, and
								usage rules.
							</p>
						</div>
					</div>
					<Button
						variant="outline"
						className="border-2 border-custom-black shadow-brutal-sm shrink-0"
						disabled
					>
						<Download className="size-4" /> Coming soon
					</Button>
				</div>
			</section>

			{/* ─── Company Facts ─── */}
			<section className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 bg-warm-beige">
				<div className="max-w-[1280px] mx-auto">
					<div className="mb-8 sm:mb-14 max-w-[720px]">
						<div className="font-mono text-[11px] font-semibold text-custom-black/70 tracking-[1.5px] mb-3 sm:mb-4">
							&#9670; COMPANY FACTS
						</div>
						<h2 className="font-display text-[clamp(28px,7vw,56px)] sm:text-[clamp(36px,5vw,56px)] font-bold leading-none tracking-[-0.04em]">
							Key numbers
						</h2>
					</div>
					<div className="grid grid-cols-2 lg:grid-cols-4 border-2 border-custom-black rounded-[16px] sm:rounded-[28px] overflow-hidden bg-background">
						{[
							{
								v: "0.75%",
								l: "flat fee, no spread",
								bg: "bg-background",
							},
							{
								v: "3",
								l: "networks supported",
								bg: "bg-light-green",
							},
							{
								v: "Lagos",
								l: "headquarters",
								bg: "bg-warm-beige",
							},
							{
								v: "100%",
								l: "non-custodial, by design",
								bg: "bg-background",
							},
						].map((s, i) => (
							<div
								key={i}
								className={`${s.bg} p-4 sm:p-7 lg:p-9 flex flex-col gap-1.5 sm:gap-2 ${i < 3 ? "border-r-2 border-custom-black" : ""} ${i < 2 ? "border-b-2 lg:border-b-0 border-custom-black" : ""}`}
							>
								<div className="font-mono text-2xl sm:text-4xl lg:text-[56px] font-semibold leading-[0.95] tracking-[-0.03em] text-custom-black">
									{s.v}
								</div>
								<div className="text-[11px] sm:text-[13px] text-muted-foreground font-medium leading-snug">
									{s.l}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ─── Press Inquiries ─── */}
			<section className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
					{/* Press inquiries */}
					<a
						href="mailto:press@clusteer.com"
						className="group bg-light-green border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-6 sm:p-10 lg:p-12 flex flex-col gap-4 sm:gap-5 hover:shadow-brutal-sm transition-shadow"
					>
						<div className="size-12 sm:size-[52px] rounded-2xl bg-custom-black text-light-green inline-flex items-center justify-center">
							<Mail
								className="size-5 sm:size-[22px]"
								strokeWidth={2.4}
							/>
						</div>
						<div className="font-mono text-[11px] font-semibold text-custom-black/70 tracking-[1.5px] uppercase">
							Press inquiries
						</div>
						<h3 className="font-display text-xl sm:text-2xl font-bold tracking-[-0.02em]">
							Writing a story about Clusteer?
						</h3>
						<p className="text-sm sm:text-[15px] leading-relaxed text-custom-black/70">
							We are happy to provide quotes, data, and background information.
							Reach out and we will get back to you within 24 hours.
						</p>
						<div className="mt-auto pt-2 font-mono text-sm sm:text-[15px] font-semibold text-custom-black/70 group-hover:underline">
							press@clusteer.com
						</div>
					</a>

					{/* Media mentions */}
					<div className="bg-background border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-6 sm:p-10 lg:p-12 flex flex-col gap-4 sm:gap-5">
						<div className="size-12 sm:size-[52px] rounded-2xl bg-light-green border-[1.5px] border-custom-black inline-flex items-center justify-center">
							<Newspaper
								className="size-5 sm:size-[22px]"
								strokeWidth={2.4}
							/>
						</div>
						<div className="font-mono text-[11px] font-semibold text-custom-black/70 tracking-[1.5px] uppercase">
							Media mentions
						</div>
						<h3 className="font-display text-xl sm:text-2xl font-bold tracking-[-0.02em]">
							Coverage coming soon
						</h3>
						<p className="text-sm sm:text-[15px] leading-relaxed text-muted-foreground">
							We are still early. As media coverage rolls in, we will feature it
							here. In the meantime, if you are writing about stablecoins in
							Nigeria, we would love to be part of the conversation.
						</p>
						<div className="mt-auto pt-2">
							<span className="inline-flex items-center gap-2 rounded-full border-2 border-custom-black/20 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground">
								<FileText className="size-3.5" />
								No articles yet
							</span>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
