import { cn } from "@/lib/utils";
import Image from "next/image";

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
			className={cn(
				"inline-flex items-center gap-2 font-display font-bold",
				inverted ? "text-white" : "text-foreground",
				className,
			)}
		>
			<Image
				src="/assets/icons/clusteer_logo.svg"
				alt="Clusteer"
				width={32}
				height={34}
				className={cn("size-8 shrink-0 dark:brightness-0 dark:invert", inverted && "brightness-0 invert")}
			/>
			{!monogramOnly && (
				<span className="text-lg tracking-tight">Clusteer</span>
			)}
		</span>
	);
}
