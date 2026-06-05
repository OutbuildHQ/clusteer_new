"use client";

import { useWallets } from "@/store/wallet";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ReceivePage() {
	const router = useRouter();
	const wallets = useWallets() || [];

	return (
		<div className="font-avenir-next pb-6 lg:pt-[50px]">
			<div className="mb-6">
				<button
					onClick={() => router.back()}
					className="flex items-center gap-2 text-[#667085] hover:text-[#0D0D0D] transition-colors mb-4"
				>
					<ArrowLeft className="w-5 h-5" />
					<span className="font-medium">Back</span>
				</button>
				<h1 className="text-3xl font-bold text-[#0D0D0D]">Add Money</h1>
				<p className="text-[#667085] mt-2">
					Choose a wallet to receive funds
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{wallets.map((wallet) => (
					<Link
						key={wallet.currency}
						href={`/assets/${wallet.currency}/receive`}
						className="p-6 bg-white rounded-2xl border border-[#E9EAEB] hover:border-dark-green hover:shadow-lg transition-all"
					>
						<div className="flex items-center justify-between mb-4">
							<div>
								<h3 className="font-semibold text-lg uppercase">
									{wallet.currency}
								</h3>
								<p className="text-sm text-[#667085]">
									{wallet.type === "FIAT" ? "Fiat Currency" : "Cryptocurrency"}
								</p>
							</div>
						</div>
						<div className="pt-4 border-t border-[#E9EAEB]">
							<p className="text-sm text-[#667085]">Receive {wallet.currency}</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
