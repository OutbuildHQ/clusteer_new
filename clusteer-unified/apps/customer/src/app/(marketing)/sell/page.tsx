import Link from "next/link";
import type { Metadata } from "next";
import { SellReceiveAmount } from "@/components/marketing/order-ticket-receive";

export const metadata: Metadata = {
	title: "Sell stablecoins, cash out to your bank — Clusteer",
	description:
		"Sell USDT or USDC and get paid into any Nigerian bank the same day. Flat 0.75%, no spread.",
};

export default function MarketingSellPage() {
	return (
		<main className="pb-[clamp(72px,9vw,120px)]">
			<div>
				<div className="max-w-[1280px] mx-auto my-0 pt-[clamp(48px,7vw,88px)] px-[28px] pb-[clamp(32px,4vw,48px)]">
					<div className="opacity-100">
						<div className="f-mono text-[12px] font-semibold tracking-[1.5px] uppercase text-[#0f4f26] mb-[16px]">
							Sell · cash out to naira
						</div>
					</div>
					<div className="opacity-100">
						<h1 className="f-display text-[clamp(36px,6.2vw,72px)] font-extrabold tracking-[-2px] leading-none m-0 max-w-[880px]">
							Turn stablecoins into{" "}
							<span className="bg-[#9fe870] py-0 px-[10px] rounded-[8px] border-[1.5px] border-[#21241d] inline-block">
								bank-ready naira.
							</span>
						</h1>
					</div>
					<div className="opacity-100">
						<p className="text-[clamp(16px,2vw,19px)] text-[#475467] mt-[22px] max-w-[600px] leading-[1.5]">
							Send USDT or USDC, lock the rate, and get paid into any Nigerian bank the same day.
							Flat 0.75%, no spread.
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
								href="/early-access"
								className="lift inline-flex items-center gap-[8px] font-semibold text-[16px] text-[#21241d] py-[15px] px-[24px] rounded-full bg-[#ffffff] border-[1.5px] border-[#21241d]"
							>
								View payout banks
							</Link>
						</div>
					</div>
				</div>
				<div className="max-w-[1280px] mx-auto my-0 py-0 px-[28px]">
					<div className="bento">
						<div className="bento-card bento-pop bento-hover opacity-100 row-span-2 col-span-4 p-[24px] bg-[#ffffff] text-[#21241d] border-[1.5px] border-[#21241d]">
							<div className="f-mono text-[12px] font-semibold tracking-[1.5px] uppercase text-[#0f4f26] mb-[16px]">
								Sell ticket — example
							</div>
							<div>
								<div className="inline-flex rounded-full border-[1.5px] border-[#21241d] overflow-hidden mb-[16px]">
									<span className="py-[6px] px-[18px] text-[13px] font-semibold bg-transparent text-[#21241d]">
										Buy
									</span>
									<span className="py-[6px] px-[18px] text-[13px] font-semibold bg-[#21241d] text-[#9fe870]">
										Sell
									</span>
								</div>
								<div className="bg-[#fafaf7] border-[1px] border-[rgba(33,36,29,0.1)] rounded-[14px] p-[14px]">
									<div className="text-[11px] text-[#475467] font-semibold">You sell</div>
									<div className="f-mono text-[24px] font-bold mt-[2px]">310.00 USDT</div>
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
									<div className="f-mono text-[24px] font-bold mt-[2px]"><SellReceiveAmount /></div>
								</div>
								<div className="flex justify-between text-[12px] text-[#475467] mt-[12px]">
									<span>Fee 0.75%</span>
									<span>Settles on-chain</span>
								</div>
							</div>
						</div>
						<div className="bento-card bento-pop bento-hover opacity-100 row-span-2 col-span-5 p-[28px] bg-[#21241d] text-[#fafaf7] border-[1.5px] border-[#21241d] flex flex-col justify-between">
							<div>
								<div className="f-mono text-[12px] font-semibold tracking-[1.5px] uppercase text-[#9fe870] mb-[16px]">
									Same-day payout
								</div>
								<div className="f-display text-[clamp(26px,3vw,40px)] font-extrabold tracking-[-1.5px] leading-[1.05]">
									NGN in your bank, hours not days.
								</div>
							</div>
							<div className="mt-[20px]">
								<div className="flex flex-col gap-[12px]">
									<div className="flex items-center gap-[12px] py-[12px] px-[14px] bg-[#ffffff] border-[1.5px] border-[#21241d] rounded-[14px]">
										<div className="w-[38px] h-[38px] rounded-[10px] bg-[#21241d] text-[#9fe870] flex items-center justify-center">
											<svg
												width="18"
												height="18"
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
										<div className="flex-1">
											<div className="font-semibold text-[14px]">Your bank account</div>
											<div className="f-mono text-[12px] text-[#475467]">any NIBSS-connected bank</div>
										</div>
										<span className="f-mono inline-flex items-center gap-[6px] text-[11.5px] font-semibold py-[5px] px-[11px] rounded-full bg-[#effcd0] text-[#0f4f26] border-[1.5px] border-[#21241d]">
											Example
										</span>
									</div>
									<div className="flex items-center gap-[8px] text-[12.5px] text-[#475467]">
										<svg
											width="15"
											height="15"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#0F4F26"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M20 6L9 17l-5-5"></path>
										</svg>{" "}
										NGN lands the same day via NIP.
									</div>
								</div>
							</div>
						</div>
						<div className="bento-card bento-pop bento-hover opacity-100 col-span-3 p-[24px] bg-[#9fe870] text-[#21241d] border-[1.5px] border-[#21241d]">
							<div>
								<div className="f-display text-[clamp(30px,4vw,46px)] font-extrabold tracking-[-1.5px] leading-none">
									100%
								</div>
								<div className="text-[13.5px] text-[#475467] mt-[8px]">
									Non-custodial — your funds are always yours.
								</div>
							</div>
						</div>
						<div className="bento-card bento-hover opacity-100 col-span-3 p-[24px] bg-[#ffffff] text-[#21241d] border-[1px] border-[rgba(33,36,29,0.1)]">
							<div className="f-mono text-[12px] font-semibold tracking-[1.5px] uppercase text-[#0f4f26] mb-[16px]">
								Networks
							</div>
							<div className="flex flex-col gap-[8px]">
								<div className="flex items-center gap-[8px] text-[13.5px] font-medium">
									<span className="w-[8px] h-[8px] rounded-full bg-[#0f4f26]"></span>TRON · TRC20
								</div>
								<div className="flex items-center gap-[8px] text-[13.5px] font-medium">
									<span className="w-[8px] h-[8px] rounded-full bg-[#0f4f26]"></span>BSC · BEP20
								</div>
								<div className="flex items-center gap-[8px] text-[13.5px] font-medium">
									<span className="w-[8px] h-[8px] rounded-full bg-[#0f4f26]"></span>Ethereum ·
									ERC20
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-[72px]">
					<div className="max-w-[760px] mt-0 mx-auto mb-[36px] py-0 px-[28px] mx-auto text-center">
						<div className="opacity-100">
							<div className="f-mono text-[12px] font-semibold tracking-[1.5px] uppercase text-[#0f4f26] mb-[16px]">
								How selling works
							</div>
						</div>
						<div className="opacity-100">
							<h2 className="f-display text-[clamp(26px,3.6vw,42px)] font-extrabold tracking-[-1.2px] leading-[1.1] m-0">
								Crypto to cash in three steps
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
									Choose your coin and network, lock the NGN rate.
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
										<path d="M7 4 3 8l4 4"></path>
										<path d="M3 8h14a4 4 0 0 1 0 8h-2"></path>
										<path d="M17 20l4-4-4-4"></path>
										<path d="M21 16H7a4 4 0 0 1 0-8h2"></path>
									</svg>
								</div>
								<div className="f-display font-bold text-[17px]">Send your crypto</div>
								<div className="text-[13.5px] text-[#475467] mt-[6px] leading-[1.5]">
									Transfer to the one-time deposit address shown.
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
										<path d="M3 21h18"></path>
										<path d="M3 10h18"></path>
										<path d="M5 6l7-4 7 4"></path>
										<path d="M5 21V10M9 21V10M15 21V10M19 21V10"></path>
									</svg>
								</div>
								<div className="f-display font-bold text-[17px]">Get paid</div>
								<div className="text-[13.5px] text-[#475467] mt-[6px] leading-[1.5]">
									Naira hits your chosen bank account the same day.
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-[80px]">
					<div className="bento-card bento-pop opacity-100 bg-[#9fe870] border-[1.5px] border-[#21241d] rounded-[28px] p-[clamp(32px,5vw,64px)] text-center max-w-[1100px] mx-auto my-0">
						<h2 className="f-display text-[clamp(28px,4vw,46px)] font-extrabold tracking-[-1.5px] leading-[1.05] m-0 max-w-[720px] mx-auto">
							Cash out without the wahala
						</h2>
						<p className="text-[16.5px] text-[#21241d] opacity-80 mt-[16px] max-w-[520px] mx-auto">
							Lock a rate, send, and watch the naira land. No spread games.
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
