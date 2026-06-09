"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/primitives/copy-button";
import type { QxOrder } from "@/lib/types";

type Props = {
	order: QxOrder;
	onTradeAgain: () => void;
};

export function OrderDone({ order, onTradeAgain }: Props) {
	const isBuy = order.side === "buy";
	const title = isBuy
		? `${order.amountUsdt.toFixed(2)} USDT sent to your wallet`
		: `₦${(order.amountNgn - order.fee).toLocaleString("en-NG")} paid to your bank`;

	return (
		<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, paddingTop: 40, paddingBottom: 20 }}>
			{/* Success icon */}
			<div style={{
				width: 80, height: 80, borderRadius: "50%",
				background: "var(--c-up-soft)", border: "3px solid var(--c-up)",
				display: "flex", alignItems: "center", justifyContent: "center",
			}}>
				<CheckCircle size={40} style={{ color: "var(--c-up)" }} />
			</div>

			{/* Title */}
			<div style={{ textAlign: "center" }}>
				<h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--c-text)", letterSpacing: "-0.03em", margin: 0 }}>
					{title}
				</h2>
				<p style={{ fontSize: 13, color: "var(--c-text-2)", marginTop: 8, lineHeight: 1.5 }}>
					{isBuy
						? "Your USDT has been delivered to the wallet address you provided."
						: "Naira has been credited to your linked bank account."}
				</p>
			</div>

			{/* Summary card */}
			<div style={{ width: "100%", padding: 14, borderRadius: 12, background: "var(--c-surface-2)", display: "flex", flexDirection: "column", gap: 10 }}>
				<Row label="Order ID" value={order.id} copy />
				<Row label="Type" value={isBuy ? "Buy USDT" : "Sell USDT"} />
				<Row label="Network" value={order.channel} />
				<Row label="Amount" value={isBuy ? `${order.amountUsdt.toFixed(2)} USDT` : `${order.amountUsdt.toFixed(2)} USDT`} />
				<Row label="Value" value={`₦${order.amountNgn.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`} />
				<Row label="Rate" value={`₦${order.rate.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`} />
				{order.destination && <Row label={isBuy ? "Destination" : "Bank"} value={order.destination} />}
			</div>

			{/* Actions */}
			<div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
				<Button
					size="lg"
					className="w-full"
					onClick={onTradeAgain}
					style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", fontWeight: 700 }}
				>
					Trade again
				</Button>
				<Button
					variant="outline"
					size="lg"
					className="w-full"
					onClick={() => window.location.href = `/orders/${order.id}`}
				>
					View order details
				</Button>
			</div>
		</div>
	);
}

function Row({ label, value, copy }: { label: string; value: string; copy?: boolean }) {
	return (
		<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
			<span style={{ color: "var(--c-text-2)" }}>{label}</span>
			<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
				<span style={{ fontWeight: 600, color: "var(--c-text)", fontVariantNumeric: "tabular-nums" }}>{value}</span>
				{copy && <CopyButton value={value} />}
			</div>
		</div>
	);
}
