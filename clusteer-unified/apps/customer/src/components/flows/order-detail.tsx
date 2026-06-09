"use client";

import { Check, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import { Drawer } from "@/components/flows/drawer";
import { AssetLogo } from "@/components/primitives/asset-logo";
import type { QxOrder, QxOrderStatus } from "@/lib/types";

function fmtNgn(n: number) {
	return "₦" + Math.round(n).toLocaleString("en-NG");
}

function copyText(t: string) {
	navigator.clipboard?.writeText(t);
	toast.success("Copied to clipboard");
}

const STATUS_MAP: Record<string, [string, string]> = {
	awaiting_payment: ["Pay now", "bg-warn-soft text-warn"],
	awaiting_deposit: ["Send now", "bg-warn-soft text-warn"],
	confirming: ["Confirming", "bg-info-soft text-[var(--c-info)]"],
	completed: ["Completed", "bg-up-soft text-up"],
	expired: ["Expired", "bg-down-soft text-down"],
	failed: ["Failed", "bg-down-soft text-down"],
};

function KVRow({ k, v, mono, copy: showCopy }: { k: string; v: string; mono?: boolean; copy?: boolean }) {
	return (
		<div
			style={{
				display: "flex", justifyContent: "space-between", alignItems: "center",
				padding: "10px 0", borderBottom: "1px solid var(--c-line)", fontSize: 13,
			}}
		>
			<span style={{ color: "var(--c-text-2)" }}>{k}</span>
			<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
				<span
					style={{
						fontWeight: 600, color: "var(--c-text)",
						...(mono ? { fontFamily: "var(--font-mono, monospace)", fontVariantNumeric: "tabular-nums" } : {}),
						maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
					}}
				>
					{v}
				</span>
				{showCopy && (
					<button
						onClick={() => copyText(v)}
						style={{
							width: 24, height: 24, borderRadius: 6, border: "none",
							background: "transparent", cursor: "pointer",
							display: "flex", alignItems: "center", justifyContent: "center",
							color: "var(--c-text-3)",
						}}
					>
						<Copy size={12} />
					</button>
				)}
			</div>
		</div>
	);
}

type TimelineStep = { label: string; time?: string; done: boolean; active?: boolean };

function Timeline({ steps }: { steps: TimelineStep[] }) {
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
			{steps.map((s, i) => (
				<div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", paddingBottom: i < steps.length - 1 ? 14 : 0 }}>
					<div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
						<div
							style={{
								width: 18, height: 18, borderRadius: "50%",
								background: s.done ? "var(--c-up)" : s.active ? "var(--c-lime-500)" : "var(--c-surface-2)",
								border: "2px solid var(--c-surface)",
								boxShadow: s.active ? "0 0 0 3px rgba(201,245,66,0.25)" : "none",
								display: "flex", alignItems: "center", justifyContent: "center",
								color: "#fff", fontSize: 10,
							}}
						>
							{s.done && "✓"}
							{s.active && <Loader2 size={10} style={{ animation: "spin 1s linear infinite" }} />}
						</div>
						{i < steps.length - 1 && (
							<div style={{ width: 2, flex: 1, minHeight: 24, background: s.done ? "var(--c-up)" : "var(--c-line)", marginTop: 2 }} />
						)}
					</div>
					<div style={{ flex: 1, paddingTop: 1 }}>
						<div style={{ fontWeight: 500, fontSize: 13.5, color: s.done || s.active ? "var(--c-text)" : "var(--c-text-3)" }}>
							{s.label}
						</div>
						{s.time && (
							<div style={{ fontSize: 11, marginTop: 2, color: "var(--c-text-3)", fontFamily: "var(--font-mono, monospace)" }}>
								{s.time}
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	);
}

type Props = {
	order?: QxOrder;
	onClose: () => void;
};

export function OrderDetailDrawer({ order, onClose }: Props) {
	if (!order) return null;

	const isBuy = order.side === "buy";
	const [statusLabel, statusCls] = STATUS_MAP[order.status] ?? ["", ""];

	const reached = (k: number) => {
		const map: Record<string, number> = {
			awaiting_payment: 0, awaiting_deposit: 0,
			confirming: 1, completed: 3, expired: 0, failed: 1,
		};
		return (map[order.status] ?? 0) >= k;
	};

	const steps: TimelineStep[] = [
		{ label: "Order created", time: order.createdAt ? new Date(order.createdAt).toLocaleString() : "just now", done: true },
		{
			label: isBuy ? "Payment received" : "Crypto received",
			done: reached(1),
			active: order.status === "awaiting_payment" || order.status === "awaiting_deposit",
		},
		{ label: "Confirming on-chain", done: reached(2), active: order.status === "confirming" },
		{
			label: isBuy ? "Crypto delivered" : "NGN paid out",
			time: order.status === "completed" ? "done" : "",
			done: reached(3),
		},
	];

	const rate = order.rate || (order.amountNgn && order.amountUsdt ? order.amountNgn / order.amountUsdt : 0);
	const fee = order.fee ?? Math.round((order.amountNgn || 0) * 0.0075);

	return (
		<Drawer
			open
			onClose={onClose}
			title={`Order ${order.id}`}
			footer={
				<>
					{(order.status === "awaiting_payment" || order.status === "awaiting_deposit") && (
						<button
							onClick={() => { toast.warning("Order cancelled"); onClose(); }}
							style={{
								height: 36, padding: "0 14px", borderRadius: 10, border: "none",
								background: "transparent", color: "var(--c-down)",
								fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
							}}
						>
							Cancel order
						</button>
					)}
					<button
						onClick={() => toast.info("Support thread opened")}
						style={{
							height: 36, padding: "0 14px", borderRadius: 10,
							border: "1px solid var(--c-line)", background: "transparent",
							color: "var(--c-text)", fontSize: 13.5, fontWeight: 600,
							cursor: "pointer", fontFamily: "inherit",
						}}
					>
						Contact support
					</button>
					<button
						onClick={onClose}
						style={{
							height: 36, padding: "0 14px", borderRadius: 10, border: "none",
							background: "var(--c-lime-500)", color: "var(--c-onyx-900)",
							fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
						}}
					>
						Done
					</button>
				</>
			}
		>
			{/* Hero */}
			<div style={{ textAlign: "center", padding: "8px 0 4px" }}>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
					<AssetLogo symbol={order.asset || "USDT"} size="sm" />
					<span
						className={`inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium capitalize ${
							isBuy ? "bg-up-soft text-up" : "bg-down-soft text-down"
						}`}
					>
						{order.side}
					</span>
				</div>
				<div style={{ fontSize: 32, fontWeight: 600, marginTop: 8, color: "var(--c-text)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.03em" }}>
					{(order.amountUsdt ?? 0).toFixed(4)} {order.asset || "USDT"}
				</div>
				<div style={{ marginTop: 2, color: "var(--c-text-2)", fontFamily: "var(--font-mono, monospace)", fontVariantNumeric: "tabular-nums" }}>
					{fmtNgn(order.amountNgn || 0)}
				</div>
				<div style={{ marginTop: 10 }}>
					<span className={`inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium ${statusCls}`}>
						{statusLabel}
					</span>
				</div>
			</div>

			{/* Details card */}
			<div style={{ borderRadius: 14, border: "1px solid var(--c-line)", background: "var(--c-surface)", padding: "4px 14px" }}>
				<KVRow k="Order ID" v={order.id} mono copy />
				<KVRow k="Type" v={isBuy ? "Buy" : "Sell"} />
				<KVRow k="Network" v={order.channel} />
				<KVRow k="Rate" v={rate ? `1 ${order.asset || "USDT"} = ${fmtNgn(rate)}` : "—"} />
				<KVRow
					k={isBuy ? "Deliver to wallet" : "Payout to"}
					v={order.destination || "—"}
					mono
					copy={!!order.destination}
				/>
				<KVRow k="Service fee (0.75%)" v={fmtNgn(fee)} mono />
			</div>

			{/* Status timeline */}
			<div style={{ borderRadius: 14, border: "1px solid var(--c-line)", background: "var(--c-surface)", padding: 14 }}>
				<h4 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: "var(--c-text)" }}>Status</h4>
				<Timeline steps={steps} />
			</div>

			{/* Action needed warnings */}
			{order.status === "awaiting_payment" && (
				<div style={{ borderRadius: 14, background: "var(--c-warn-soft)", padding: 14 }}>
					<div style={{ fontWeight: 600, fontSize: 13, color: "var(--c-text)" }}>Action needed</div>
					<div style={{ fontSize: 12, marginTop: 4, color: "var(--c-text-2)" }}>
						Pay {fmtNgn(order.amountNgn || 0)} into the Clusteer account on the order to complete this buy.
					</div>
				</div>
			)}
			{order.status === "awaiting_deposit" && (
				<div style={{ borderRadius: 14, background: "var(--c-warn-soft)", padding: 14 }}>
					<div style={{ fontWeight: 600, fontSize: 13, color: "var(--c-text)" }}>Action needed</div>
					<div style={{ fontSize: 12, marginTop: 4, color: "var(--c-text-2)" }}>
						Send {(order.amountUsdt ?? 0).toFixed(4)} {order.asset || "USDT"} on {order.channel} to the deposit address to complete this sell.
					</div>
				</div>
			)}
		</Drawer>
	);
}
