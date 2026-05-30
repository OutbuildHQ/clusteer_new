"use client";

import { XCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QxOrder } from "@/lib/types";

type Props = {
	order: QxOrder;
	message?: string;
	onRetry: () => void;
};

export function OrderFailed({ order, message, onRetry }: Props) {
	const isBuy = order.side === "buy";
	const title = order.status === "expired"
		? "Order expired"
		: `${isBuy ? "Buy" : "Sell"} order failed`;

	const description = order.status === "expired"
		? "The payment window closed before we received your transfer. No funds were charged."
		: message || "Something went wrong processing your order. Your funds are safe — please try again.";

	return (
		<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, paddingTop: 40, paddingBottom: 20 }}>
			{/* Error icon */}
			<div style={{
				width: 80, height: 80, borderRadius: "50%",
				background: "var(--c-down-soft)", border: "3px solid var(--c-down)",
				display: "flex", alignItems: "center", justifyContent: "center",
			}}>
				<XCircle size={40} style={{ color: "var(--c-down)" }} />
			</div>

			{/* Title */}
			<div style={{ textAlign: "center" }}>
				<h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--c-text)", letterSpacing: "-0.03em", margin: 0 }}>
					{title}
				</h2>
				<p style={{ fontSize: 13, color: "var(--c-text-2)", marginTop: 8, lineHeight: 1.5, maxWidth: 320 }}>
					{description}
				</p>
			</div>

			{/* Order info */}
			<div style={{ width: "100%", padding: 14, borderRadius: 12, border: "1px solid var(--c-line)", display: "flex", flexDirection: "column", gap: 8 }}>
				<div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
					<span style={{ color: "var(--c-text-2)" }}>Order</span>
					<span style={{ fontWeight: 600, color: "var(--c-text)", fontVariantNumeric: "tabular-nums" }}>{order.id}</span>
				</div>
				<div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
					<span style={{ color: "var(--c-text-2)" }}>Status</span>
					<span style={{ fontWeight: 600, color: "var(--c-down)" }}>{order.status === "expired" ? "Expired" : "Failed"}</span>
				</div>
			</div>

			{/* Actions */}
			<div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
				<Button
					size="lg"
					className="w-full"
					onClick={onRetry}
					style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", fontWeight: 700 }}
				>
					Try again
				</Button>
				<Button
					variant="ghost"
					size="lg"
					className="w-full"
					onClick={() => window.location.href = "/support"}
					style={{ color: "var(--c-text-2)" }}
				>
					<MessageCircle size={16} style={{ marginRight: 6 }} />
					Contact support
				</Button>
			</div>
		</div>
	);
}
