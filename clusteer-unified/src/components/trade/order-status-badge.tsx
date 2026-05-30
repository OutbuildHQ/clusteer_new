"use client";

import type { QxOrderStatus } from "@/lib/types";

const STATUS_MAP: Record<QxOrderStatus, { bg: string; color: string; label: string }> = {
	awaiting_payment: { bg: "var(--c-warn-soft)", color: "var(--c-warn)", label: "Awaiting payment" },
	awaiting_deposit: { bg: "var(--c-warn-soft)", color: "var(--c-warn)", label: "Awaiting deposit" },
	confirming: { bg: "var(--c-info-soft)", color: "var(--c-info)", label: "Confirming" },
	completed: { bg: "var(--c-up-soft)", color: "var(--c-up)", label: "Completed" },
	expired: { bg: "var(--c-surface-2)", color: "var(--c-text-2)", label: "Expired" },
	failed: { bg: "var(--c-down-soft)", color: "var(--c-down)", label: "Failed" },
};

export function OrderStatusBadge({ status }: { status: QxOrderStatus }) {
	const s = STATUS_MAP[status] ?? STATUS_MAP.failed;
	return (
		<span
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: 5,
				padding: "3px 10px",
				borderRadius: 999,
				fontSize: 12,
				fontWeight: 600,
				background: s.bg,
				color: s.color,
			}}
		>
			<span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }} />
			{s.label}
		</span>
	);
}

export function isActionNeeded(status: QxOrderStatus): boolean {
	return status === "awaiting_payment" || status === "awaiting_deposit";
}
