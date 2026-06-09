import * as React from "react";
import { cn } from "@/lib/utils";

/** Stablecoins + NGN fiat. Chain tokens kept for network display only. */
type AssetSymbol = "USDT" | "USDC" | "NGN" | "TRX" | "ETH" | "BNB" | "SOL";

interface AssetLogoProps extends React.HTMLAttributes<HTMLDivElement> {
	symbol: AssetSymbol | string;
	size?: number;
}

const ASSET_MAP: Record<string, { bg: string; label: string }> = {
	// Tradeable stablecoins
	USDT: { bg: "var(--chain-usdt)", label: "₮" },
	USDC: { bg: "#2775CA", label: "$" },
	// Fiat
	NGN:  { bg: "var(--foreground)", label: "₦" },
	// Chain icons (network display only, not tradeable)
	ETH:  { bg: "var(--chain-eth)", label: "Ξ" },
	SOL:  { bg: "var(--chain-sol)", label: "◎" },
	TRX:  { bg: "var(--chain-trx)", label: "T" },
	BNB:  { bg: "var(--chain-bnb)", label: "B" },
};

/**
 * AssetLogo — circular badge for crypto/fiat assets.
 * Never display a raw text symbol; always wrap with this component.
 */
function AssetLogo({ symbol, size = 28, className, style, ...props }: AssetLogoProps) {
	const asset = ASSET_MAP[symbol] ?? { bg: "var(--muted-foreground)", label: "?" };
	return (
		<div
			className={cn("inline-flex items-center justify-center rounded-full shrink-0 font-mono font-semibold", className)}
			style={{
				width: size,
				height: size,
				background: asset.bg,
				color: "#fff",
				fontSize: size * 0.5,
				...style,
			}}
			{...props}
		>
			{asset.label}
		</div>
	);
}

export { AssetLogo, type AssetSymbol };
