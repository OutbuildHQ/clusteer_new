import { cn } from "@/lib/utils";

const ASSETS: Record<string, { bg: string; fg: string; label: string }> = {
	BTC: { bg: "var(--chain-btc)", fg: "white", label: "₿" },
	ETH: { bg: "var(--chain-eth)", fg: "white", label: "Ξ" },
	USDT: { bg: "var(--chain-usdt)", fg: "white", label: "₮" },
	USDC: { bg: "var(--chain-usdc)", fg: "white", label: "$" },
	SOL: { bg: "var(--chain-sol)", fg: "white", label: "◎" },
	BNB: { bg: "var(--chain-bnb)", fg: "#3b2900", label: "B" },
	MATIC: { bg: "var(--chain-polygon)", fg: "white", label: "M" },
	POL: { bg: "var(--chain-polygon)", fg: "white", label: "P" },
	TRX: { bg: "var(--chain-trx)", fg: "white", label: "T" },
	NGN: { bg: "var(--success)", fg: "white", label: "₦" },
};

const SIZES: Record<string, string> = {
	sm: "size-6 text-[11px]",
	md: "size-8 text-sm",
	lg: "size-10 text-base",
	xl: "size-12 text-lg",
};

export function AssetLogo({
	symbol,
	size = "md",
	className,
}: {
	symbol: string;
	size?: "sm" | "md" | "lg" | "xl";
	className?: string;
}) {
	const meta = ASSETS[symbol.toUpperCase()] ?? { bg: "oklch(0.7 0.02 254)", fg: "white", label: symbol.slice(0, 1) };
	return (
		<span
			className={cn(
				"inline-flex items-center justify-center rounded-full font-semibold",
				SIZES[size],
				className,
			)}
			style={{ background: meta.bg, color: meta.fg }}
			aria-label={`${symbol} logo`}
		>
			{meta.label}
		</span>
	);
}
