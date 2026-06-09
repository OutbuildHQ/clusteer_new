"use client";

import { TrendingUp, TrendingDown, AlertCircle, X } from "lucide-react";
import { useWallets } from "@/store/wallet";
import { formatNumber } from "@/lib/utils";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

interface PortfolioInsightsProps {
	onClose?: () => void;
}

export default function PortfolioInsights({ onClose }: PortfolioInsightsProps) {
	const wallets = useWallets() || [];

	const insights = useMemo(() => {
		const totalAssets = wallets.length;
		const totalBalance = wallets.reduce((sum, wallet) => {
			if (wallet.currency === "NGN") {
				return sum + (wallet.balance || 0);
			} else if (wallet.currency === "USDT" || wallet.currency === "USDC") {
				return sum + (wallet.balance || 0) * 1575; // Convert to NGN
			}
			return sum;
		}, 0);

		const cryptoBalance = wallets
			.filter((w) => w.type === "CRYPTO")
			.reduce((sum, wallet) => sum + (wallet.balance || 0) * 1575, 0);

		const fiatBalance = wallets
			.filter((w) => w.type === "FIAT")
			.reduce((sum, wallet) => sum + (wallet.balance || 0), 0);

		const cryptoPercentage = totalBalance > 0 ? (cryptoBalance / totalBalance) * 100 : 0;
		const fiatPercentage = totalBalance > 0 ? (fiatBalance / totalBalance) * 100 : 0;

		// Calculate if portfolio is diversified
		const isDiversified = totalAssets >= 2 && cryptoPercentage > 0 && fiatPercentage > 0;

		// Recommendations
		const recommendations = [];
		if (totalAssets === 1) {
			recommendations.push({
				type: "info" as const,
				title: "Diversify your portfolio",
				message: "Consider adding more currencies to reduce risk",
			});
		}
		if (cryptoPercentage > 80) {
			recommendations.push({
				type: "warning" as const,
				title: "High stablecoin exposure",
				message: "Your portfolio is heavily weighted in stablecoins. Consider converting some to Naira.",
			});
		}
		if (totalBalance < 10000) {
			recommendations.push({
				type: "info" as const,
				title: "Grow your portfolio",
				message: "Add more funds to maximize your investment potential",
			});
		}

		return {
			totalAssets,
			totalBalance,
			cryptoBalance,
			fiatBalance,
			cryptoPercentage,
			fiatPercentage,
			isDiversified,
			recommendations,
		};
	}, [wallets]);

	if (insights.recommendations.length === 0) {
		return null; // Don't show insights if there are no recommendations
	}

	return (
		<div className="bg-gradient-to-br from-primary/10 to-muted rounded-2xl border border-border p-6 relative">
			{onClose && (
				<Button
					onClick={onClose}
					variant="ghost"
					size="icon"
					className="absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-card"
				>
					<X className="h-4 w-4 text-muted-foreground" />
				</Button>
			)}

			<div className="flex items-start gap-4 mb-6">
				<div className="w-12 h-12 rounded-full bg-card flex items-center justify-center shadow-sm">
					<TrendingUp className="w-6 h-6 text-[var(--c-lime-500)]" />
				</div>
				<div className="flex-1">
					<h3 className="text-xl font-bold text-foreground mb-1">Portfolio Insights</h3>
					<p className="text-sm text-muted-foreground">
						Smart recommendations based on your holdings
					</p>
				</div>
			</div>

			{/* Portfolio Breakdown */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
				<div className="bg-card rounded-xl p-4 border border-border">
					<p className="text-xs text-muted-foreground mb-1">Total Assets</p>
					<p className="text-2xl font-bold text-foreground">{insights.totalAssets}</p>
				</div>
				<div className="bg-card rounded-xl p-4 border border-border">
					<p className="text-xs text-muted-foreground mb-1">Crypto</p>
					<p className="text-2xl font-bold text-foreground">
						{insights.cryptoPercentage.toFixed(0)}%
					</p>
					<p className="text-xs text-muted-foreground mt-1">
						₦{formatNumber(insights.cryptoBalance)}
					</p>
				</div>
				<div className="bg-card rounded-xl p-4 border border-border">
					<p className="text-xs text-muted-foreground mb-1">Fiat</p>
					<p className="text-2xl font-bold text-foreground">
						{insights.fiatPercentage.toFixed(0)}%
					</p>
					<p className="text-xs text-muted-foreground mt-1">
						₦{formatNumber(insights.fiatBalance)}
					</p>
				</div>
			</div>

			{/* Recommendations */}
			<div className="space-y-3">
				{insights.recommendations.map((rec, index) => (
					<div
						key={index}
						className={`flex items-start gap-3 p-4 rounded-xl ${
							rec.type === "warning"
								? "bg-warning/10 border border-warning"
								: "bg-[var(--c-lime-500)]/10 border border-primary/30"
						}`}
					>
						<div
							className={`w-8 h-8 rounded-full flex items-center justify-center ${
								rec.type === "warning" ? "bg-warning/10" : "bg-[var(--c-lime-500)]/10"
							}`}
						>
							{rec.type === "warning" ? (
								<AlertCircle className="w-4 h-4 text-warning" />
							) : (
								<TrendingUp className="w-4 h-4 text-[var(--c-lime-500)]" />
							)}
						</div>
						<div className="flex-1">
							<p className="font-semibold text-sm text-foreground mb-0.5">
								{rec.title}
							</p>
							<p className="text-xs text-muted-foreground">{rec.message}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
