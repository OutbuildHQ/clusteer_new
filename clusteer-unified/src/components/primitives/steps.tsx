import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Steps({
	steps,
	current,
	className,
}: {
	steps: { label: string; description?: string }[];
	current: number;
	className?: string;
}) {
	return (
		<ol className={cn("flex items-start gap-0", className)}>
			{steps.map((step, i) => {
				const status = i < current ? "done" : i === current ? "active" : "todo";
				return (
					<li key={step.label} className="flex flex-1 items-start gap-3">
						<div className="flex flex-col items-center">
							<div
								className={cn(
									"flex size-8 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
									status === "done" && "bg-primary text-primary-foreground border-primary",
									status === "active" && "bg-background text-primary border-primary ring-4 ring-primary/15",
									status === "todo" && "bg-background text-muted-foreground border-border",
								)}
							>
								{status === "done" ? <Check className="size-4" /> : i + 1}
							</div>
							{i < steps.length - 1 && (
								<div
									className={cn(
										"w-px flex-1 mt-2",
										status === "done" ? "bg-primary" : "bg-border",
										"min-h-6",
									)}
								/>
							)}
						</div>
						<div className="pb-6">
							<div className={cn("text-sm font-medium", status === "todo" && "text-muted-foreground")}>
								{step.label}
							</div>
							{step.description && (
								<div className="text-xs text-muted-foreground mt-0.5">{step.description}</div>
							)}
						</div>
					</li>
				);
			})}
		</ol>
	);
}

export function StepsHorizontal({
	steps,
	current,
	className,
}: {
	steps: string[];
	current: number;
	className?: string;
}) {
	return (
		<ol className={cn("flex items-center gap-3", className)}>
			{steps.map((label, i) => {
				const status = i < current ? "done" : i === current ? "active" : "todo";
				return (
					<li key={label} className="flex items-center gap-3 flex-1">
						<div
							className={cn(
								"flex size-7 items-center justify-center rounded-full text-xs font-semibold",
								status === "done" && "bg-primary text-primary-foreground",
								status === "active" && "bg-primary/15 text-primary ring-2 ring-primary",
								status === "todo" && "bg-muted text-muted-foreground",
							)}
						>
							{status === "done" ? <Check className="size-3.5" /> : i + 1}
						</div>
						<span
							className={cn(
								"text-sm font-medium whitespace-nowrap",
								status === "todo" && "text-muted-foreground",
							)}
						>
							{label}
						</span>
						{i < steps.length - 1 && (
							<div className={cn("h-px flex-1", status === "done" ? "bg-primary" : "bg-border")} />
						)}
					</li>
				);
			})}
		</ol>
	);
}
