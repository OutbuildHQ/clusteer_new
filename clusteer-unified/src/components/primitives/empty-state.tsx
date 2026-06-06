import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

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
	secondaryAction?: { label: string; onClick?: () => void; href?: string };
	variant?: "default" | "branded";
	className?: string;
}) {
	if (variant === "branded") {
		return (
			<div
				className={cn(
					"flex flex-col items-center justify-center rounded-[14px] px-6 py-14 text-center relative overflow-hidden bg-grid bg-ds-surface border border-ds-line",
					className,
				)}
			>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[320px] h-[200px] rounded-[50%] bg-lime-500 opacity-[0.04] blur-[40px] pointer-events-none" />
				{Icon && (
					<div className="mb-5 flex items-center justify-center w-16 h-16 rounded-[18px] bg-lime-500 shadow-[0_4px_20px_rgba(201,245,66,0.3)]">
						<Icon className="size-7 text-onyx-900" />
					</div>
				)}
				<h3 className="text-[20px] font-semibold tracking-[-0.02em] font-display text-ds-text">
					{title}
				</h3>
				{description && (
					<p className="mt-2 max-w-[280px] text-[13.5px] leading-relaxed text-ds-text-2">
						{description}
					</p>
				)}
				{subtitle && (
					<p className="mt-1 text-[12px] text-ds-text-3">
						{subtitle}
					</p>
				)}
				{(action || secondaryAction) && (
					<div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
						{action && (
							action.href ? (
								<a
									href={action.href}
									className="inline-flex items-center justify-center h-9 px-5 rounded-full text-[13.5px] font-semibold bg-lime-500 text-onyx-900 no-underline"
								>
									{action.label}
								</a>
							) : (
								<button
									onClick={action.onClick}
									className="inline-flex items-center justify-center h-9 px-5 rounded-full text-[13.5px] font-semibold bg-lime-500 text-onyx-900 border-none cursor-pointer"
								>
									{action.label}
								</button>
							)
						)}
						{secondaryAction && (
							secondaryAction.href ? (
								<a
									href={secondaryAction.href}
									className="inline-flex items-center justify-center h-9 px-5 rounded-full text-[13.5px] font-medium border border-ds-line text-ds-text-2 no-underline"
								>
									{secondaryAction.label}
								</a>
							) : (
								<button
									onClick={secondaryAction.onClick}
									className="inline-flex items-center justify-center h-9 px-5 rounded-full text-[13.5px] font-medium border border-ds-line text-ds-text-2 bg-transparent cursor-pointer"
								>
									{secondaryAction.label}
								</button>
							)
						)}
					</div>
				)}
			</div>
		);
	}

	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center rounded-[14px] border border-ds-line bg-ds-surface px-6 py-12 text-center",
				className,
			)}
		>
			{Icon && (
				<div className="mb-4 flex size-12 items-center justify-center rounded-full bg-ds-surface-2">
					<Icon className="size-5 text-ds-text-3" />
				</div>
			)}
			<h3 className="text-[15px] font-semibold text-ds-text">{title}</h3>
			{description && (
				<p className="mt-1 max-w-sm text-[13px] text-ds-text-2">{description}</p>
			)}
			{subtitle && (
				<p className="mt-1 text-[12px] text-ds-text-3">{subtitle}</p>
			)}
			{action && (
				<div className="mt-5">
					{action.href ? (
						<a href={action.href} className="inline-flex items-center justify-center h-9 px-4 rounded-[10px] text-[13.5px] font-medium bg-lime-500 text-onyx-900 no-underline">
							{action.label}
						</a>
					) : (
						<button onClick={action.onClick} className="inline-flex items-center justify-center h-9 px-4 rounded-[10px] text-[13.5px] font-medium bg-lime-500 text-onyx-900 border-none cursor-pointer">
							{action.label}
						</button>
					)}
				</div>
			)}
		</div>
	);
}
