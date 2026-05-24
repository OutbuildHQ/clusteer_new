import { cn } from "@/lib/utils";

/**
 * Num — always-tabular numeric display.
 * Use this whenever money, balances, percentages, or transaction
 * amounts appear. Guarantees digit alignment across tables.
 */
export function Num({
	value,
	className,
	tone,
	as: Tag = "span",
}: {
	value: React.ReactNode;
	className?: string;
	tone?: "default" | "positive" | "negative" | "muted";
	as?: React.ElementType;
}) {
	return (
		<Tag
			className={cn(
				"tabular-nums font-medium",
				tone === "positive" && "text-success",
				tone === "negative" && "text-danger",
				tone === "muted" && "text-muted-foreground",
				className,
			)}
		>
			{value}
		</Tag>
	);
}
