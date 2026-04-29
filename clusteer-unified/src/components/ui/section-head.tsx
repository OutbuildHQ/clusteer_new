import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	subtitle?: string;
	actions?: React.ReactNode;
}

/**
 * SectionHead — card/section header with title, optional subtitle, and action buttons.
 */
function SectionHead({ title, subtitle, actions, className, ...props }: SectionHeadProps) {
	return (
		<div
			className={cn("flex items-center justify-between mb-4", className)}
			{...props}
		>
			<div>
				<h3 className="text-lg font-semibold">{title}</h3>
				{subtitle && (
					<p className="mt-1 text-[13px] text-[var(--cl-text-3)]">{subtitle}</p>
				)}
			</div>
			{actions && <div className="flex gap-2">{actions}</div>}
		</div>
	);
}

export { SectionHead };
