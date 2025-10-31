"use client";

import { WALLET_CURRENCY_ICONS } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";
import { WalletCurrency, useSelectWallet } from "@/store/wallet";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AssetClient({ asset }: { asset: string }) {
	const router = useRouter();
	const wallet = useSelectWallet(asset as WalletCurrency);

	if (!wallet) {
		router.push("/");
		return null;
	}

	const iconSrc = WALLET_CURRENCY_ICONS[asset as WalletCurrency];

	return (
		<section className="font-avenir-next pb-6 lg:pt-[50px]">
			{/* Balance Card - Wise style */}
			<div className="bg-white rounded-2xl border border-[#E9EAEB] p-6 mb-6">
				<div className="flex items-center gap-4 mb-6">
					<div className="w-12 h-12 flex items-center justify-center bg-[#F7F9FA] rounded-full">
						<Image
							src={iconSrc}
							alt={`${wallet.currency} logo`}
							width={32}
							height={32}
						/>
					</div>
					<div>
						<p className="text-sm text-[#667085] uppercase font-medium">{wallet.currency}</p>
						<h1 className="text-3xl lg:text-4xl font-bold text-[#0D0D0D]">
							{wallet.currency === "NGN" && "₦"}
							{(wallet.currency === "USDT" || wallet.currency === "USDC") && "$"}
							{formatNumber(wallet?.balance)}
						</h1>
					</div>
				</div>

				{/* Action buttons - matching Wise/dashboard style */}
				<div className="flex items-center gap-3">
					<Link
						href={`/assets/${wallet.currency}/send`}
						className="px-6 py-2 bg-[#9FE870] text-custom-black hover:bg-[#8DD659] font-medium rounded-lg transition-colors"
					>
						Send
					</Link>
					<Link
						href={`/assets/${wallet.currency}/receive`}
						className="px-6 py-2 bg-[#E8F5E9] text-custom-black hover:bg-[#D0EBD6] font-medium rounded-lg transition-colors"
					>
						Add money
					</Link>
					<Link
						href="#"
						className="px-6 py-2 bg-[#E8F5E9] text-custom-black hover:bg-[#D0EBD6] font-medium rounded-lg transition-colors"
					>
						Convert
					</Link>
				</div>
			</div>

			{/* Orders Section */}
			<div className="bg-white rounded-2xl border border-[#E9EAEB] p-6">
				<h2 className="text-xl lg:text-2xl font-bold text-[#0D0D0D] mb-4">Orders</h2>
				{/* Orders content will go here */}
			</div>
		</section>
	);
}
