"use client";

import { WALLET_CURRENCY_ICONS } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";
import { useWallets, type WalletCurrency } from "@/store/wallet";
import Image from "next/image";
import Link from "next/link";

export default function WalletList() {
	const allWallets = useWallets() || [];

	if (allWallets.length === 0) {
		return (
			<div className="mt-5 lg:mt-6.5 pb-14.5">
				<div className="bg-[#F7F9FA] rounded-2xl border border-[#E9EAEB] p-8 text-center">
					<div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
						<svg className="w-8 h-8 text-[#667085]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
						</svg>
					</div>
					<h3 className="text-lg font-semibold text-[#0D0D0D] mb-2">No wallets yet</h3>
					<p className="text-sm text-[#667085]">Your wallets will appear here once you add currencies</p>
				</div>
			</div>
		);
	}

	return (
		<div className="mt-5 lg:mt-6.5 grid sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5 pb-14.5">
			{allWallets.map((wallet) => {
				// Ensure wallet.currency exists
				if (!wallet || !wallet.currency) {
					return null;
				}

				const iconSrc = WALLET_CURRENCY_ICONS[wallet.currency as WalletCurrency];

				return (
					<Link
						key={wallet.currency}
						href={`/assets/${wallet.currency}`}
						className="group shrink-0 w-full p-5 lg:p-6 rounded-2xl bg-[#F7F9FA] hover:bg-white border border-[#E9EAEB] hover:shadow-md transition-all duration-200 flex flex-col min-h-[160px] lg:min-h-[180px]"
					>
						<div className="flex items-center gap-4 mb-4">
							<div className="shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm group-hover:shadow-md transition-all duration-200">
								{iconSrc ? (
									<Image
										className="shrink-0"
										src={iconSrc}
										alt={`${wallet.currency} logo`}
										width={24}
										height={24}
									/>
								) : (
									<div className="flex items-center justify-center text-sm font-bold text-[#667085]">
										{(wallet.currency || '').substring(0, 2)}
									</div>
								)}
							</div>
							<div>
								<span className="block font-semibold text-lg text-[#0D0D0D] uppercase">
									{wallet.currency}
								</span>
								<span className="block text-xs text-[#667085] mt-0.5">
									{wallet.type === 'FIAT' ? 'Fiat Currency' : 'Cryptocurrency'}
								</span>
							</div>
						</div>
						<div className="mt-auto">
							<p className="text-xs text-[#667085] mb-1">Balance</p>
							<p className="font-bold text-2xl lg:text-3xl text-[#0D0D0D]">
								{wallet.currency === 'NGN' && '₦'}
								{wallet.currency === 'USDT' && '$'}
								{wallet.currency === 'USDC' && '$'}
								{formatNumber(wallet.balance || 0)}
							</p>
						</div>
					</Link>
				);
			})}

			{/* Add another currency card */}
			<Link
				href="/assets/add"
				className="group shrink-0 w-full p-5 lg:p-6 rounded-2xl bg-[#F7F9FA] hover:bg-white border-2 border-dashed border-[#E9EAEB] hover:border-dark-green transition-all duration-200 flex flex-col items-center justify-center min-h-[160px] lg:min-h-[180px]"
			>
				<div className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm group-hover:shadow-md transition-all duration-200 mb-3">
					<svg className="w-6 h-6 text-[#667085] group-hover:text-dark-green transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
					</svg>
				</div>
				<span className="text-sm font-medium text-[#667085] group-hover:text-dark-green transition-colors">
					Add another currency
				</span>
			</Link>
		</div>
	);
}
