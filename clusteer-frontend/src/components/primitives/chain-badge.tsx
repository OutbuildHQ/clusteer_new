import { cn } from "@/lib/utils";

const CHAIN_COLORS: Record<string, string> = {
	Bitcoin: "var(--chain-btc)",
	Ethereum: "var(--chain-eth)",
	Tron: "var(--chain-trx)",
	Solana: "var(--chain-sol)",
	BSC: "var(--chain-bnb)",
	Polygon: "var(--chain-polygon)",
	Arbitrum: "var(--chain-eth)",
	Optimism: "var(--chain-eth)",
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
