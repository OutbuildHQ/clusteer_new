import * as React from "react";
import { cn } from "@/lib/utils";

interface NumProps extends React.HTMLAttributes<HTMLSpanElement> {
	size?: number;
	weight?: number;
	color?: string;
}

/**
 * Num — always use for currency amounts, rates, hashes, percentages, IDs, and timestamps.
 * Forces monospace font with tabular numerals and slashed zero for aligned columns.
 */
function Num({ className, size, weight, color, style, children, ...props }: NumProps) {
	return (
		<span
			className={cn("num", className)}
			style={{
				fontSize: size,
				fontWeight: weight ?? 500,
				color,
				...style,
			}}
			{...props}
		>
			{children}
		</span>
	);
}

export { Num };
