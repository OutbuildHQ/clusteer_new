import { cn } from "@/lib/utils";

/** Blockchain networks that carry USDT/USDC. Not tradeable assets. */
const CHAIN_COLORS: Record<string, string> = {
	Tron: "var(--chain-trx)",
	Ethereum: "var(--chain-eth)",
	BSC: "var(--chain-bnb)",
	Solana: "var(--chain-sol)",
	Polygon: "var(--chain-polygon)",
};

export function ChainBadge({ chain, className }: { chain: string; className?: string }) {
	const color = CHAIN_COLORS[chain] ?? "var(--muted-foreground)";
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-0.5 text-xs font-medium text-foreground",
				className,
			)}
		>
			<span className="size-1.5 rounded-full" style={{ background: color }} />
			{chain}
		</span>
	);
}
