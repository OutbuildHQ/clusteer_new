import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Live markets — Clusteer",
	description:
		"Real-time USDT, USDC & major-asset rates against the naira, with alerts when they move.",
};

export default function MarketingLivemarketsPage() {
	return (
		<main className="pb-[clamp(72px,9vw,120px)]">
			<div className="max-w-[1280px] mx-auto my-0 pt-[clamp(56px,9vw,120px)] px-[28px] pb-0">
				<div className="bento">
					<div className="bento-card bento-pop bento-hover opacity-100 row-span-1 col-span-7 p-[36px] bg-[#ffffff] text-[#21241d] border-[1.5px] border-[#21241d] min-h-[280px] flex flex-col justify-center">
						<div className="opacity-100">
							<div className="f-mono text-[12px] font-semibold tracking-[1.5px] uppercase text-[#0f4f26] mb-[16px]">
								Live markets
							</div>
						</div>
						<h1 className="f-display text-[clamp(32px,5vw,56px)] font-extrabold tracking-[-2px] leading-[1.02] m-0">
							Live markets
						</h1>
						<p className="text-[17px] text-[#475467] mt-[18px] max-w-[460px] leading-[1.5]">
							Real-time USDT, USDC &amp; major-asset rates against the naira — with alerts when they
							move.
						</p>
						<div className="flex gap-[12px] flex-wrap mt-[28px]">
							<Link
								href="/signup"
								className="btn-shine lift inline-flex items-center gap-[8px] font-semibold text-[14px] text-[#21241d] py-[11px] px-[20px] rounded-full bg-[#9fe870] border-[1.5px] border-[#21241d] shadow-[3px_3px_0px_0px_#21241d]"
							>
								Get started{" "}
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M5 12h14M13 6l6 6-6 6"></path>
								</svg>
							</Link>
							<Link
								href="/signup"
								className="lift inline-flex items-center gap-[8px] font-semibold text-[14px] text-[#21241d] py-[11px] px-[18px] rounded-full bg-[#ffffff] border-[1.5px] border-[#21241d]"
							>
								Explore products
							</Link>
						</div>
						<div className="mt-[22px]">
							<span className="f-mono inline-flex items-center gap-[6px] text-[11.5px] font-semibold py-[5px] px-[11px] rounded-full bg-[#effcd0] text-[#0f4f26] border-[1.5px] border-[#21241d]">
								Coming soon
							</span>
						</div>
					</div>
					<div className="bento-card bento-pop bento-hover opacity-100 row-span-1 col-span-5 p-[36px] bg-[#21241d] text-[#fafaf7] border-[1.5px] border-[#21241d] flex items-center justify-center min-h-[280px]">
						<div className="floaty w-[120px] h-[120px] rounded-[32px] bg-[#9fe870] flex items-center justify-center text-[#21241d]">
							<svg
								width="56"
								height="56"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M3 3v18h18"></path>
								<path d="m7 14 4-4 4 4 5-6"></path>
							</svg>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
