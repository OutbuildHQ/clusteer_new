import { cn } from "@/lib/utils";

export function Logo({
	className,
	monogramOnly = false,
	inverted = false,
}: {
	className?: string;
	monogramOnly?: boolean;
	inverted?: boolean;
}) {
	return (
		<span
			aria-label={monogramOnly ? "Clusteer" : undefined}
			className={cn(
				"inline-flex items-center gap-2 font-display font-bold",
				inverted ? "text-white" : "text-foreground",
				className,
			)}
		>
			<svg
				viewBox="0 0 36 38"
				className="size-8 shrink-0"
				fill="currentColor"
				aria-hidden="true"
			>
				<path d="M0 19.002C0 9.249 7.347 1.212 16.809.125c1.205-.138 2.193.859 2.193 2.072v33.61c0 1.214-.988 2.21-2.193 2.072C7.347 36.792 0 28.755 0 19.002" />
				<circle cx="25.537" cy="10.654" r="2.581" />
				<circle cx="25.537" cy="19.002" r="2.581" />
				<circle cx="25.537" cy="27.35" r="2.581" />
				<circle cx="32.897" cy="19.002" r="2.581" />
			</svg>
			{!monogramOnly && (
				<span className="text-lg tracking-tight">Clusteer</span>
			)}
		</span>
	);
}
