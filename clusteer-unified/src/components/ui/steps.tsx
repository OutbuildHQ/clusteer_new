import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
	steps: string[];
	current: number;
}

/**
 * Steps — numeric step tracker with check glyphs for completed steps.
 * Used in KYC flows, onboarding, and multi-step forms.
 */
function Steps({ steps, current, className, ...props }: StepsProps) {
	return (
		<div className={cn("flex items-center w-full", className)} {...props}>
			{steps.map((step, i) => {
				const done = i < current;
				const active = i === current;

				return (
					<React.Fragment key={i}>
						<div className="flex items-center gap-2 shrink-0">
							<div
								className={cn(
									"w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
									done && "bg-[var(--cl-up)] text-white",
									active && "bg-[var(--cl-brand-500)] text-white border-[3px] border-[var(--cl-brand-100)]",
									!done && !active && "bg-[var(--cl-surface-2)] text-[var(--cl-text-3)]"
								)}
							>
								{done ? <Check size={12} strokeWidth={3} /> : i + 1}
							</div>
							<span
								className={cn(
									"text-[13px]",
									active ? "text-[var(--cl-text)] font-medium" : "text-[var(--cl-text-3)]"
								)}
							>
								{step}
							</span>
						</div>
						{i < steps.length - 1 && (
							<div
								className={cn(
									"flex-1 h-px mx-3",
									done ? "bg-[var(--cl-up)]" : "bg-[var(--cl-line)]"
								)}
							/>
						)}
					</React.Fragment>
				);
			})}
		</div>
	);
}

export { Steps };
