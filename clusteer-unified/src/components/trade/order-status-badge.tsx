"use client";

import type { QxOrderStatus } from "@/lib/types";

const STATUS_MAP: Record<QxOrderStatus, { variant: string; icon: string; label: string }> = {
	awaiting_payment: { variant: "warn", icon: "◐", label: "Pay now" },
	awaiting_deposit: { variant: "warn", icon: "◐", label: "Send now" },
	confirming: { variant: "warn", icon: "◐", label: "Confirming" },
	completed: { variant: "up", icon: "✓", label: "Completed" },
	expired: { variant: "down", icon: "—", label: "Expired" },
	failed: { variant: "down", icon: "✕", label: "Failed" },
};

const VARIANT_CLASSES: Record<string, string> = {
	default: "bg-ds-surface-2 text-ds-text-2 border border-ds-line",
	up: "bg-up-soft text-up border border-transparent",
	down: "bg-down-soft text-down border border-transparent",
	warn: "bg-warn-soft text-warn border border-transparent",
	info: "bg-info-soft text-[var(--c-info)] border border-transparent",
};

export function OrderStatusBadge({ status }: { status: QxOrderStatus }) {
	const s = STATUS_MAP[status] ?? STATUS_MAP.failed;
	const variantClass = VARIANT_CLASSES[s.variant] ?? VARIANT_CLASSES.default;
	return (
		<span
			className={`inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full text-[11.5px] font-medium ${variantClass}`}
		>
			<span className="text-[9px]">{s.icon}</span>
			{s.label}
		</span>
	);
}

export function isActionNeeded(status: QxOrderStatus): boolean {
	return status === "awaiting_payment" || status === "awaiting_deposit";
}
