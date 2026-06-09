import * as React from "react";
import { cn } from "@/lib/utils";

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
	label?: string;
	hint?: string;
	error?: string;
}

/**
 * Field — wraps label + input + hint/error.
 * Design system pattern: every form input should be inside a Field.
 */
function Field({ label, hint, error, children, className, ...props }: FieldProps) {
	return (
		<div className={cn("flex flex-col gap-1.5", className)} {...props}>
			{label && (
				<label className="text-[13px] font-medium text-muted-foreground">
					{label}
				</label>
			)}
			{children}
			{error && (
				<span className="text-xs text-danger">{error}</span>
			)}
			{hint && !error && (
				<span className="text-xs text-muted-foreground">{hint}</span>
			)}
		</div>
	);
}

export { Field };
