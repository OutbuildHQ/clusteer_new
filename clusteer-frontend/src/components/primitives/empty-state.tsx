import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
	icon: Icon,
	title,
	description,
	action,
	className,
}: {
	icon?: LucideIcon;
	title: string;
	description?: string;
	action?: { label: string; onClick?: () => void; href?: string };
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center",
				className,
			)}
		>
			{Icon && (
				<div className="mb-4 flex size-12 items-center justify-center rounded-full bg-background shadow-sm">
					<Icon className="size-5 text-muted-foreground" />
				</div>
			)}
			<h3 className="text-base font-semibold text-foreground">{title}</h3>
			{description && (
				<p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
			)}
			{action && (
				<div className="mt-5">
					{action.href ? (
						<Button asChild>
							<a href={action.href}>{action.label}</a>
						</Button>
					) : (
						<Button onClick={action.onClick}>{action.label}</Button>
					)}
				</div>
			)}
		</div>
	);
}
