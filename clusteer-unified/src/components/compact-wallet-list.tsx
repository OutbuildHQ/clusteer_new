"use client";

import { WALLET_CURRENCY_ICONS } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";
import { useWallets, type WalletCurrency } from "@/store/wallet";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CompactWalletList() {
	const allWallets = useWallets() || [];

	if (allWallets.length === 0) {
		return (
			<div className="bg-[#F7F9FA] rounded-xl border border-[var(--cl-line)] p-8 text-center">
				<div className="w-16 h-16 mx-auto bg-[var(--cl-surface)] rounded-full flex items-center justify-center mb-4">
					<svg
						className="w-8 h-8 text-[#667085]"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
						/>
					</svg>
				</div>
				<h3 className="font-semibold text-lg text-[#0D0D0D] mb-2">
					No currencies yet
				</h3>
				<p className="text-sm text-[#667085] mb-4">
					Add a currency to your account to start managing your money
				</p>
				<Link
					href="/receive"
					className="inline-flex items-center justify-center px-4 py-2 bg-[#9FE870] text-custom-black rounded-lg hover:bg-[#8DD659] transition-colors text-sm font-medium"
				>
					Add currency
				</Link>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{/* Wallet Cards */}
			{allWallets.map((wallet, index) => {
				if (!wallet || !wallet.currency) return null;

				const iconSrc =
					WALLET_CURRENCY_ICONS[wallet.currency as WalletCurrency];

				return (
					<motion.div
						key={wallet.currency}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1, duration: 0.3 }}
					>
						<Link
							href={`/assets/${wallet.currency}`}
							className="group bg-[#F7F9FA] hover:bg-[var(--cl-surface)] border border-[var(--cl-line)] rounded-xl p-5 transition-all hover:shadow-md hover:scale-[1.02] block"
						>
						<div className="flex items-center gap-3 mb-4">
							<div className="w-10 h-10 flex items-center justify-center bg-[var(--cl-surface)] rounded-full shadow-sm">
								{iconSrc ? (
									<Image
										src={iconSrc}
										alt={`${wallet.currency} logo`}
										width={24}
										height={24}
									/>
								) : (
									<div className="text-sm font-bold text-[#667085]">
										{(wallet.currency || "").substring(0, 2)}
									</div>
								)}
							</div>
							<div>
								<p className="font-bold text-[#0D0D0D] uppercase text-sm">
									{wallet.currency}
								</p>
							</div>
						</div>

						<div>
							<p className="text-3xl font-bold text-[#0D0D0D] mb-1">
								{wallet.currency === "NGN" && "₦"}
								{(wallet.currency === "USDT" || wallet.currency === "USDC") &&
									"$"}
								{formatNumber(wallet.balance || 0)}
							</p>
							{wallet.balance === 0 ? (
								<p className="text-xs text-[#667085]">No balance</p>
							) : (
								<p className="text-xs text-[var(--cl-up)] flex items-center gap-1">
									<TrendingUp className="w-3 h-3" />
									Available
								</p>
							)}
						</div>
					</Link>
					</motion.div>
				);
			})}

			{/* Add Another Currency Card */}
			<Link
				href="/receive"
				className="group bg-[var(--cl-surface)] hover:bg-[#F7F9FA] border-2 border-dashed border-[var(--cl-line)] rounded-xl p-5 transition-all flex flex-col items-center justify-center text-center min-h-[140px]"
			>
				<div className="w-12 h-12 flex items-center justify-center bg-[#F7F9FA] group-hover:bg-pale-green rounded-full mb-3 transition-colors">
					<Plus className="w-6 h-6 text-[#667085] group-hover:text-[var(--cl-brand-500)] transition-colors" />
				</div>
				<p className="font-semibold text-[#0D0D0D] text-sm mb-1">
					Add another currency
				</p>
				<p className="text-xs text-[#667085]">to your account</p>
			</Link>
		</div>
	);
}
