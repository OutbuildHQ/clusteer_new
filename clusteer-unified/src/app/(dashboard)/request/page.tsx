"use client";

import { useWallets } from "@/store/wallet";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatNumber } from "@/lib/utils";

export default function RequestPage() {
	const router = useRouter();
	const wallets = useWallets() || [];

	return (
		<div className=" pb-6 lg:pt-[50px]">
			<div className="mb-6">
				<button
					onClick={() => router.back()}
					className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
				>
					<ArrowLeft className="w-5 h-5" />
					<span className="font-medium">Back</span>
				</button>
				<h1 className="text-3xl font-bold text-foreground">Request Payment</h1>
				<p className="text-muted-foreground mt-2">
					Choose a wallet to request payment in
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{wallets.map((wallet) => (
					<Link
						key={wallet.currency}
						href={`/assets/${wallet.currency}/request`}
						className="p-6 bg-card rounded-2xl border border-border hover:border-dark-green hover:shadow-lg transition-all"
					>
						<div className="flex items-center justify-between mb-4">
							<div>
								<h3 className="font-semibold text-lg uppercase">
									{wallet.currency}
								</h3>
								<p className="text-sm text-muted-foreground">
									{wallet.type === "FIAT" ? "Fiat Currency" : "Stablecoin"}
								</p>
							</div>
						</div>
						<div className="pt-4 border-t border-border">
							<p className="text-xs text-muted-foreground mb-1">Current Balance</p>
							<p className="font-bold text-xl">
								{wallet.currency === "NGN" && "₦"}
								{(wallet.currency === "USDT" || wallet.currency === "USDC") &&
									"$"}
								{formatNumber(wallet.balance || 0)}
							</p>
							<p className="text-sm text-muted-foreground mt-2">
								Request payment in {wallet.currency}
							</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
