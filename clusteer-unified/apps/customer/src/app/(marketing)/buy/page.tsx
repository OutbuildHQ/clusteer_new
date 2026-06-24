import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Buy stablecoins with naira — Clusteer",
	description:
		"Buy USDT & USDC with naira at the live rate, delivered to your own wallet. Flat 0.75%, non-custodial.",
};

export default function MarketingBuyPage() {
	return (
		<main className="pb-[clamp(72px,9vw,120px)]">
			<div>
				<div className="max-w-[1280px] mx-auto my-0 pt-[clamp(48px,7vw,88px)] px-[28px] pb-[clamp(32px,4vw,48px)]">
					<div className="opacity-100">
						<div className="f-mono text-[12px] font-semibold tracking-[1.5px] uppercase text-[#0f4f26] mb-[16px]">
							Buy · USDT &amp; USDC
						</div>
					</div>
					<div className="opacity-100">
						<h1 className="f-display text-[clamp(36px,6.2vw,72px)] font-extrabold tracking-[-2px] leading-none m-0 max-w-[880px]">
							Buy stablecoins with naira,{" "}
							<span className="bg-[#9fe870] py-0 px-[10px] rounded-[8px] border-[1.5px] border-[#21241d] inline-block">
								in seconds.
							</span>
						</h1>
					</div>
					<div className="opacity-100">
						<p className="text-[clamp(16px,2vw,19px)] text-[#475467] mt-[22px] max-w-[600px] leading-[1.5]">
							Fund with your bank, lock today's rate, and get USDT or USDC delivered straight to
							your own wallet. We never hold your crypto.
						</p>
					</div>
					<div className="opacity-100">
						<div className="flex gap-[12px] flex-wrap mt-[30px]">
							<Link
								href="/early-access"
								className="btn-shine lift inline-flex items-center gap-[8px] font-semibold text-[16px] text-[#21241d] py-[15px] px-[26px] rounded-full bg-[#9fe870] border-[1.5px] border-[#21241d] shadow-[3px_3px_0px_0px_#21241d]"
							>
								Join the waitlist{" "}
								<svg
									width="17"
									height="17"
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
								href="/live-markets"
								className="lift inline-flex items-center gap-[8px] font-semibold text-[16px] text-[#21241d] py-[15px] px-[24px] rounded-full bg-[#ffffff] border-[1.5px] border-[#21241d]"
							>
								See live rates
							</Link>
						</div>
					</div>
				</div>
				<div className="max-w-[1280px] mx-auto my-0 py-0 px-[28px]">
					<div className="bento">
						<div className="bento-card bento-pop bento-hover opacity-100 row-span-2 col-span-5 p-[28px] bg-[#21241d] text-[#fafaf7] border-[1.5px] border-[#21241d] flex flex-col justify-between min-h-[320px]">
							<div>
								<div className="f-mono text-[12px] font-semibold tracking-[1.5px] uppercase text-[#9fe870] mb-[16px]">
									Live rate
								</div>
								<div>
									<div className="flex items-center gap-[8px] mb-[14px]">
										<div className="w-[28px] h-[28px] rounded-full bg-[#26a17b] text-[#ffffff] inline-flex items-center justify-center font-bold text-[12.6px] shadow-[0px_4px_12px_rgba(38,161,123,0.35)]">
											₮
										</div>
										<span className="font-semibold">USDT</span>
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
										<div className="w-[28px] h-[28px] rounded-full bg-[#21241d] text-[#9fe870] inline-flex items-center justify-center font-bold text-[14px] shadow-[0px_4px_12px_rgba(33,36,29,0.4)]">
											₦
										</div>
										<span className="font-semibold">NGN</span>
										<span className="[margin-left:auto] inline-flex items-center gap-[6px] text-[11.5px] font-semibold text-[#9fe870]">
											<span className="live-dot w-[7px] h-[7px] rounded-full bg-[#9fe870]"></span>
											LIVE
										</span>
									</div>
									<div className="f-mono text-[40px] font-bold tracking-[-1px] leading-none">
										₦1,612
									</div>
									<div className="text-[13px] text-[rgba(244,241,234,0.6)] mt-[6px]">
										per USDT · updates every few seconds
									</div>
									<div className="mt-[14px]">
										<svg width="220" height="44" viewBox="0 0 120 40" fill="none" className="block">
											<polyline
												className="spark-draw"
												points="0,34 18,28 36,30 54,20 72,22 90,12 108,14 120,4"
												stroke="#9FE870"
												strokeWidth="2.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											></polyline>
										</svg>
									</div>
								</div>
							</div>
							<div className="mt-[20px] text-[13px] text-[rgba(244,241,234,0.65)]">
								Rate locks for 45s at checkout — no surprises between quote and pay.
							</div>
						</div>
						<div className="bento-card bento-pop bento-hover opacity-100 row-span-2 col-span-4 p-[24px] bg-[#ffffff] text-[#21241d] border-[1.5px] border-[#21241d]">
							<div className="f-mono text-[12px] font-semibold tracking-[1.5px] uppercase text-[#0f4f26] mb-[16px]">
								Order ticket
							</div>
							<div>
								<div className="inline-flex rounded-full border-[1.5px] border-[#21241d] overflow-hidden mb-[16px]">
									<span className="py-[6px] px-[18px] text-[13px] font-semibold bg-[#21241d] text-[#9fe870]">
										Buy
									</span>
									<span className="py-[6px] px-[18px] text-[13px] font-semibold bg-transparent text-[#21241d]">
										Sell
									</span>
								</div>
								<div className="bg-[#fafaf7] border-[1px] border-[rgba(33,36,29,0.1)] rounded-[14px] p-[14px]">
									<div className="text-[11px] text-[#475467] font-semibold">You pay</div>
									<div className="f-mono text-[24px] font-bold mt-[2px]">₦500,000</div>
								</div>
								<div className="flex justify-center my-[-8px] mx-0">
									<div className="w-[34px] h-[34px] rounded-full bg-[#21241d] text-[#9fe870] flex items-center justify-center border-[2px] border-[#fafaf7]">
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M7 4 3 8l4 4"></path>
											<path d="M3 8h14a4 4 0 0 1 0 8h-2"></path>
											<path d="M17 20l4-4-4-4"></path>
											<path d="M21 16H7a4 4 0 0 1 0-8h2"></path>
										</svg>
									</div>
								</div>
								<div className="bg-[#effcd0] border-[1.5px] border-[#21241d] rounded-[14px] p-[14px]">
									<div className="text-[11px] text-[#0f4f26] font-semibold">You receive</div>
									<div className="f-mono text-[24px] font-bold mt-[2px]">310.05 USDT</div>
								</div>
								<div className="flex justify-between text-[12px] text-[#475467] mt-[12px]">
									<span>Fee 0.75%</span>
									<span className="inline-flex items-center gap-[5px]">
										<span className="live-dot w-[6px] h-[6px] rounded-full bg-[#0f4f26]"></span>
										Settles instantly
									</span>
								</div>
							</div>
						</div>
						<div className="bento-card bento-pop bento-hover opacity-100 col-span-3 p-[24px] bg-[#9fe870] text-[#21241d] border-[1.5px] border-[#21241d]">
							<div className="f-display font-extrabold text-[clamp(26px,3vw,38px)] tracking-[-1px] leading-none">
								0.75%
							</div>
							<div className="text-[13.5px] mt-[8px] font-medium">
								Flat fee. No spread, no hidden markup on the rate.
							</div>
						</div>
						<div className="bento-card bento-hover opacity-100 col-span-3 p-[24px] bg-[#ffffff] text-[#21241d] border-[1.5px] border-[#21241d]">
							<div className="flex gap-[8px] mb-[12px]">
								<div className="w-[34px] h-[34px] rounded-full bg-[#26a17b] text-[#ffffff] inline-flex items-center justify-center font-bold text-[15.3px] shadow-[0px_4px_12px_rgba(38,161,123,0.35)]">
									₮
								</div>
								<div className="w-[34px] h-[34px] rounded-full bg-[#2775ca] text-[#ffffff] inline-flex items-center justify-center font-bold text-[14.28px] shadow-[0px_4px_12px_rgba(39,117,202,0.35)]">
									$
								</div>
							</div>
							<div className="font-semibold text-[14px]">USDT &amp; USDC</div>
							<div className="text-[12.5px] text-[#475467] mt-[4px]">
								On TRON, BSC &amp; Ethereum — you pick the network.
							</div>
						</div>
					</div>
					<div className="bento mt-[16px]">
						<div className="bento-card bento-pop bento-hover opacity-100 col-span-5 p-[24px] bg-[#effcd0] text-[#21241d] border-[1.5px] border-[#21241d]">
							<div className="f-mono text-[12px] font-semibold tracking-[1.5px] uppercase text-[#0f4f26] mb-[16px]">
								Delivered to you
							</div>
							<div className="flex items-center gap-[12px]">
								<div className="w-[44px] h-[44px] rounded-[12px] bg-[#ffffff] border-[1.5px] border-[#21241d] flex items-center justify-center">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M3 7h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"></path>
										<path d="M16 14h2"></path>
										<path d="M3 7l3-4h12l3 4"></path>
									</svg>
								</div>
								<div>
									<div className="f-display font-bold text-[16px]">Your wallet, not ours</div>
									<div className="text-[13px] text-[#475467]">
										Quidax settles the order on-chain to your address.
									</div>
								</div>
							</div>
						</div>
						<div className="bento-card bento-hover opacity-100 col-span-7 p-[24px] bg-[#ffffff] text-[#21241d] border-[1px] border-[rgba(33,36,29,0.1)]">
							<div className="f-mono text-[12px] font-semibold tracking-[1.5px] uppercase text-[#0f4f26] mb-[16px]">
								Lift your limits
							</div>
							<div className="flex gap-[10px]">
								<div className="flex-1 py-[14px] px-[12px] rounded-[14px] text-center bg-[#ffffff] border-[1.5px] border-[#21241d] shadow-none">
									<div className="text-[11px] font-semibold text-[#0f4f26]">Tier 1</div>
									<div className="f-mono text-[17px] font-bold mt-[4px]">₦300K</div>
									<div className="text-[10px] text-[#475467]">/ day</div>
								</div>
								<div className="flex-1 py-[14px] px-[12px] rounded-[14px] text-center bg-[#9fe870] border-[1.5px] border-[#21241d] shadow-[3px_3px_0px_0px_#21241d]">
									<div className="text-[11px] font-semibold text-[#0f4f26]">Tier 2</div>
									<div className="f-mono text-[17px] font-bold mt-[4px]">₦5M</div>
									<div className="text-[10px] text-[#475467]">/ day</div>
								</div>
								<div className="flex-1 py-[14px] px-[12px] rounded-[14px] text-center bg-[#ffffff] border-[1.5px] border-[#21241d] shadow-none">
									<div className="text-[11px] font-semibold text-[#0f4f26]">Tier 3</div>
									<div className="f-mono text-[17px] font-bold mt-[4px]">₦20M</div>
									<div className="text-[10px] text-[#475467]">/ day</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-[72px]">
					<div className="max-w-[760px] mt-0 mx-auto mb-[36px] py-0 px-[28px] mx-auto text-center">
						<div className="opacity-100">
							<div className="f-mono text-[12px] font-semibold tracking-[1.5px] uppercase text-[#0f4f26] mb-[16px]">
								How buying works
							</div>
						</div>
						<div className="opacity-100">
							<h2 className="f-display text-[clamp(26px,3.6vw,42px)] font-extrabold tracking-[-1.2px] leading-[1.1] m-0">
								Rate to wallet in three steps
							</h2>
						</div>
					</div>
					<div className="max-w-[1280px] mx-auto my-0 py-0 px-[28px]">
						<div className="bento grid-cols-3">
							<div className="bento-card bento-hover opacity-100 col-span-1 p-[24px] bg-[#ffffff] text-[#21241d] border-[1.5px] border-[#21241d]">
								<div className="f-mono text-[13px] font-bold text-[#0f4f26]">01</div>
								<div className="w-[44px] h-[44px] rounded-[12px] bg-[#effcd0] border-[1.5px] border-[#21241d] flex items-center justify-center my-[14px] mx-0">
									<svg
										width="20"
										height="20"
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
								<div className="f-display font-bold text-[17px]">Lock the rate</div>
								<div className="text-[13.5px] text-[#475467] mt-[6px] leading-[1.5]">
									See the live USDT/NGN rate and lock it for 45 seconds.
								</div>
							</div>
							<div className="bento-card bento-hover opacity-100 col-span-1 p-[24px] bg-[#ffffff] text-[#21241d] border-[1.5px] border-[#21241d]">
								<div className="f-mono text-[13px] font-bold text-[#0f4f26]">02</div>
								<div className="w-[44px] h-[44px] rounded-[12px] bg-[#effcd0] border-[1.5px] border-[#21241d] flex items-center justify-center my-[14px] mx-0">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M3 21h18"></path>
										<path d="M3 10h18"></path>
										<path d="M5 6l7-4 7 4"></path>
										<path d="M5 21V10M9 21V10M15 21V10M19 21V10"></path>
									</svg>
								</div>
								<div className="f-display font-bold text-[17px]">Pay from your bank</div>
								<div className="text-[13.5px] text-[#475467] mt-[6px] leading-[1.5]">
									Transfer naira to the settlement account — exact amount, one reference.
								</div>
							</div>
							<div className="bento-card bento-hover opacity-100 col-span-1 p-[24px] bg-[#ffffff] text-[#21241d] border-[1.5px] border-[#21241d]">
								<div className="f-mono text-[13px] font-bold text-[#0f4f26]">03</div>
								<div className="w-[44px] h-[44px] rounded-[12px] bg-[#effcd0] border-[1.5px] border-[#21241d] flex items-center justify-center my-[14px] mx-0">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M3 7h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"></path>
										<path d="M16 14h2"></path>
										<path d="M3 7l3-4h12l3 4"></path>
									</svg>
								</div>
								<div className="f-display font-bold text-[17px]">Receive on-chain</div>
								<div className="text-[13.5px] text-[#475467] mt-[6px] leading-[1.5]">
									Your USDT or USDC lands in your wallet, usually within minutes.
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-[80px]">
					<div className="bento-card bento-pop opacity-100 bg-[#9fe870] border-[1.5px] border-[#21241d] rounded-[28px] p-[clamp(32px,5vw,64px)] text-center max-w-[1100px] mx-auto my-0">
						<h2 className="f-display text-[clamp(28px,4vw,46px)] font-extrabold tracking-[-1.5px] leading-[1.05] m-0 max-w-[720px] mx-auto">
							Your first buy is 90 seconds away
						</h2>
						<p className="text-[16.5px] text-[#21241d] opacity-80 mt-[16px] max-w-[520px] mx-auto">
							Create a free account, verify once, and buy stablecoins at today's rate.
						</p>
						<div className="flex gap-[12px] justify-center flex-wrap mt-[28px]">
							<Link
								href="/early-access"
								className="btn-shine lift inline-flex items-center gap-[8px] font-semibold text-[16px] text-[#9fe870] py-[15px] px-[28px] rounded-full bg-[#21241d] border-[1.5px] border-[#21241d]"
							>
								Join the waitlist{" "}
								<svg
									width="16"
									height="16"
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
								href="/#how"
								className="lift font-semibold text-[16px] text-[#21241d] py-[15px] px-[26px] rounded-full bg-transparent border-[1.5px] border-[#21241d]"
							>
								See how it works
							</Link>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
