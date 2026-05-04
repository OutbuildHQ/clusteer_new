"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
	{
		variants: {
			variant: {
				default: "border-transparent bg-primary text-primary-foreground",
				secondary: "border-transparent bg-secondary text-secondary-foreground",
				outline: "text-foreground border-border",
				success: "border-transparent bg-success-bg text-success",
				warning: "border-transparent bg-warning-bg text-warning",
				danger: "border-transparent bg-danger-bg text-danger",
				info: "border-transparent bg-info-bg text-info",
				neutral: "border-border bg-muted text-muted-foreground",
			},
		},
		defaultVariants: { variant: "default" },
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof badgeVariants> {
	animated?: boolean;
}

function Badge({ className, variant, animated, ...props }: BadgeProps) {
	if (animated) {
		const { children, ...rest } = props;
		return (
			<motion.span
				initial={{ scale: 0.85, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ type: "spring", stiffness: 400, damping: 20 }}
				className={cn(badgeVariants({ variant }), className)}
				{...(rest as any)}
			>
				{children}
			</motion.span>
		);
	}
	return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
