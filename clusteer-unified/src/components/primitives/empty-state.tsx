"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useReducedMotion } from "motion/react";

export function EmptyState({
	icon: Icon,
	title,
	description,
	subtitle,
	action,
	secondaryAction,
	variant = "default",
	className,
}: {
	icon?: LucideIcon;
	title: string;
	description?: string;
	subtitle?: string;
	action?: { label: string; onClick?: () => void; href?: string };
	secondaryAction?: { label: string; href?: string; onClick?: () => void };
	variant?: "default" | "branded";
	className?: string;
}) {
	const reduced = useReducedMotion();
	const Wrapper = reduced ? "div" : motion.div;
	const motionProps = reduced ? {} : { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.25 } };

	if (variant === "branded") {
		return (
			<Wrapper
				{...(motionProps as any)}
				className={cn(
					"flex flex-col items-center justify-center bg-grid px-6 py-12 text-center rounded-xl",
					className,
				)}
			>
				{Icon && (
					<div className="mb-4 size-14 rounded-2xl bg-light-green border-[1.5px] border-custom-black inline-flex items-center justify-center">
						<Icon className="size-6 text-custom-black" />
					</div>
				)}
				<h3 className="font-display font-bold text-lg text-foreground">{title}</h3>
				{description && (
					<p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
				)}
				{subtitle && (
					<p className="mt-1 max-w-sm text-xs text-muted-foreground/70">{subtitle}</p>
				)}
				{action && (
					<div className="mt-5">
						{action.href ? (
							<Button asChild className="shadow-brutal-sm">
								<a href={action.href}>{action.label}</a>
							</Button>
						) : (
							<Button onClick={action.onClick} className="shadow-brutal-sm">{action.label}</Button>
						)}
					</div>
				)}
				{secondaryAction && (
					<div className="mt-2">
						{secondaryAction.href ? (
							<Button asChild variant="ghost" size="sm">
								<a href={secondaryAction.href}>{secondaryAction.label}</a>
							</Button>
						) : (
							<Button variant="ghost" size="sm" onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>
						)}
					</div>
				)}
			</Wrapper>
		);
	}

	return (
		<Wrapper
			{...(motionProps as any)}
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
			{subtitle && (
				<p className="mt-1 max-w-sm text-xs text-muted-foreground/70">{subtitle}</p>
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
			{secondaryAction && (
				<div className="mt-2">
					{secondaryAction.href ? (
						<Button asChild variant="ghost" size="sm">
							<a href={secondaryAction.href}>{secondaryAction.label}</a>
						</Button>
					) : (
						<Button variant="ghost" size="sm" onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>
					)}
				</div>
			)}
		</Wrapper>
	);
}
