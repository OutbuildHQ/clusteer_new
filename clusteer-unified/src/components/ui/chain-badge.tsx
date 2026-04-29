import * as React from "react";
import { cn } from "@/lib/utils";

type ChainName = "TRC-20" | "BEP-20" | "ERC-20" | "SOL";

interface ChainBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	chain: ChainName | string;
}

const CHAIN_MAP: Record<string, { color: string; label: string }> = {
	"TRC-20": { color: "var(--cl-chain-tron)", label: "TRC-20" },
	"BEP-20": { color: "var(--cl-chain-bsc)", label: "BEP-20" },
	"ERC-20": { color: "var(--cl-chain-eth)", label: "ERC-20" },
	"SOL":    { color: "var(--cl-chain-sol)", label: "Solana" },
};

/**
 * ChainBadge — never use raw text for chain names.
 * Mono font, colored dot, bordered pill.
 */
function ChainBadge({ chain, className, ...props }: ChainBadgeProps) {
	const data = CHAIN_MAP[chain] ?? { color: "var(--cl-text-3)", label: chain };
	return (
		<span
			className={cn(
				"inline-flex items-center gap-[5px] px-[7px] py-[2px] rounded-[var(--cl-r-sm)] border border-[var(--cl-line)] text-[11px] font-medium font-mono tracking-normal",
				"text-[var(--cl-text-2)]",
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
