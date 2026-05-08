import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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
					"flex flex-col items-center justify-center rounded-2xl px-6 py-14 text-center relative overflow-hidden bg-grid",
					className,
				)}
				style={{ border: "1px solid var(--c-line)", background: "var(--c-surface)" }}
			>
				{/* Subtle lime radial glow */}
				<div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -60%)", width: 320, height: 200, borderRadius: "50%", background: "var(--c-lime-500)", opacity: 0.04, filter: "blur(40px)", pointerEvents: "none" }} />
				{Icon && (
					<div
						className="mb-5 flex items-center justify-center"
						style={{ width: 64, height: 64, borderRadius: 18, background: "var(--c-lime-500)", boxShadow: "0 4px 20px rgba(201,245,66,0.3)" }}
					>
						<Icon className="size-7" style={{ color: "var(--c-onyx-900)" }} />
					</div>
				)}
				<h3
					className="text-[20px] font-semibold tracking-tight"
					style={{ fontFamily: "var(--f-display)", color: "var(--c-text)", letterSpacing: "-0.02em" }}
				>
					{title}
				</h3>
				{description && (
					<p className="mt-2 max-w-[280px] text-[13.5px] leading-relaxed" style={{ color: "var(--c-text-2)" }}>
						{description}
					</p>
				)}
				{subtitle && (
					<p className="mt-1 text-[12px]" style={{ color: "var(--c-text-3)" }}>
						{subtitle}
					</p>
				)}
				{(action || secondaryAction) && (
					<div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
						{action && (
							action.href ? (
								<a
									href={action.href}
									className="inline-flex items-center justify-center h-9 px-5 rounded-full text-[13.5px] font-semibold"
									style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", textDecoration: "none" }}
								>
									{action.label}
								</a>
							) : (
								<button
									onClick={action.onClick}
									className="inline-flex items-center justify-center h-9 px-5 rounded-full text-[13.5px] font-semibold"
									style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", cursor: "pointer" }}
								>
									{action.label}
								</button>
							)
						)}
						{secondaryAction && (
							secondaryAction.href ? (
								<a
									href={secondaryAction.href}
									className="inline-flex items-center justify-center h-9 px-5 rounded-full text-[13.5px] font-medium"
									style={{ border: "1px solid var(--c-line)", color: "var(--c-text-2)", textDecoration: "none" }}
								>
									{secondaryAction.label}
								</a>
							) : (
								<button
									onClick={secondaryAction.onClick}
									className="inline-flex items-center justify-center h-9 px-5 rounded-full text-[13.5px] font-medium"
									style={{ border: "1px solid var(--c-line)", color: "var(--c-text-2)", background: "transparent", cursor: "pointer" }}
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
				<p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
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
