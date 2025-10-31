import BuySellCrypto from "@/components/buy-sell-crypto";

export default function Page() {
	return (
		<div className="font-avenir-next pb-6 lg:pt-[50px]">
			<header className="mb-6">
				<h1 className="text-2xl lg:text-[32px] font-bold text-[#0D0D0D]">
					Trade
				</h1>
				<p className="text-sm lg:text-base text-[#667085] mt-1">
					Buy and sell cryptocurrency instantly
				</p>
			</header>

			<section>
				<BuySellCrypto />
			</section>
		</div>
	);
}
