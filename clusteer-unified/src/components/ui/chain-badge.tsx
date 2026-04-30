import * as React from "react";
import { cn } from "@/lib/utils";

type ChainName = "TRC-20" | "BEP-20" | "ERC-20" | "SOL";

interface ChainBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	chain: ChainName | string;
}

const CHAIN_MAP: Record<string, { color: string; label: string }> = {
	"TRC-20": { color: "var(--chain-trx)", label: "TRC-20" },
	"BEP-20": { color: "var(--chain-bnb)", label: "BEP-20" },
	"ERC-20": { color: "var(--chain-eth)", label: "ERC-20" },
	"SOL":    { color: "var(--chain-sol)", label: "Solana" },
};

/**
 * ChainBadge — never use raw text for chain names.
 * Mono font, colored dot, bordered pill.
 */
function ChainBadge({ chain, className, ...props }: ChainBadgeProps) {
	const data = CHAIN_MAP[chain] ?? { color: "var(--muted-foreground)", label: chain };
	return (
		<span
			className={cn(
				"inline-flex items-center gap-[5px] px-[7px] py-[2px] rounded-sm border border-border text-[11px] font-medium font-mono tracking-normal",
				"text-muted-foreground",
				className
			)}
			{...props}
		>
			<span
				className="w-[5px] h-[5px] rounded-full shrink-0"
				style={{ background: data.color }}
			/>
			{data.label}
		</span>
	);
}

export { ChainBadge, type ChainName };
