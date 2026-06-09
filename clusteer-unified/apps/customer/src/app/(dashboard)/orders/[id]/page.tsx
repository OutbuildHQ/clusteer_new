"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Check, Loader2, Circle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/primitives/copy-button";
import { OrderStatusBadge, isActionNeeded } from "@/components/trade/order-status-badge";
import type { QxOrder, QxOrderStatus, QxOrderTimeline } from "@/lib/types";

function fmt(n: number) { return "₦" + Math.round(n).toLocaleString("en-NG"); }

function buildTimeline(order: QxOrder): QxOrderTimeline {
	const isBuy = order.side === "buy";
	const steps = isBuy
		? ["Order created", "Payment sent", "Quidax confirmed", "USDT delivered"]
		: ["Order created", "Crypto sent", "Confirmed on-chain", "NGN paid out"];

	const statusToStage: Record<string, number> = {
		awaiting_payment: 0, awaiting_deposit: 0,
		confirming: 2,
		completed: 4,
		expired: -1, failed: -1,
	};

	const currentStage = statusToStage[order.status] ?? 0;

	return steps.map((label, i) => ({
		label,
		status: i < currentStage ? "done" as const : i === currentStage ? "active" as const : "pending" as const,
	}));
}

export default function OrderDetailPage() {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();

	const { data: order, isLoading } = useQuery({
		queryKey: ["order", id],
		queryFn: async () => {
			const r = await fetch(`/api/order?id=${id}`);
			const d = await r.json();
			return d.data as QxOrder | undefined;
		},
		refetchInterval: 5000,
	});

	if (isLoading || !order) {
		return (
			<div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
				<Loader2 size={32} style={{ color: "var(--c-lime-500)", animation: "spin 1s linear infinite" }} />
			</div>
		);
	}

	const isBuy = order.side === "buy";
	const timeline = buildTimeline(order);
	const needsAction = isActionNeeded(order.status);

	return (
		<div style={{ maxWidth: 520, margin: "0 auto" }}>
			{/* Back */}
			<button
				onClick={() => router.push("/orders")}
				style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "var(--c-text-2)", fontSize: 13, fontWeight: 600, padding: 0, marginBottom: 20 }}
			>
				<ArrowLeft size={16} /> Back to orders
			</button>

			{/* Header */}
			<div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
				<div style={{
					width: 40, height: 40, borderRadius: 10,
					background: isBuy ? "var(--c-up-soft)" : "var(--c-down-soft)",
					display: "flex", alignItems: "center", justifyContent: "center",
					fontSize: 16, fontWeight: 700, color: isBuy ? "var(--c-up)" : "var(--c-down)",
				}}>
					{isBuy ? "B" : "S"}
				</div>
				<div style={{ flex: 1 }}>
					<h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--c-text)", margin: 0 }}>
						{isBuy ? "Buy" : "Sell"} {order.amountUsdt?.toFixed(2)} USDT
					</h1>
					<div style={{ fontSize: 13, color: "var(--c-text-2)", marginTop: 2 }}>
						{order.id} · {order.channel}
					</div>
				</div>
				<OrderStatusBadge status={order.status} />
			</div>

			{/* Action needed alert */}
			{needsAction && (
				<div style={{
					display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, marginBottom: 20,
					background: "var(--c-warn-soft)", border: "1px solid var(--c-warn)",
				}}>
					<AlertTriangle size={16} style={{ color: "var(--c-warn)" }} />
					<span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>
						{order.status === "awaiting_payment" ? "Complete your bank transfer to proceed" : "Send your crypto to the deposit address"}
					</span>
				</div>
			)}

			{/* Timeline */}
			<div style={{ padding: 16, borderRadius: 14, border: "1px solid var(--c-line)", background: "var(--c-surface)", marginBottom: 20 }}>
				<h3 style={{ fontSize: 12, fontWeight: 700, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 16, margin: 0 }}>
					Order progress
				</h3>
				<div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 14 }}>
					{timeline.map((step, i) => (
						<div key={step.label} style={{ display: "flex", gap: 12, position: "relative" }}>
							{/* Vertical line */}
							{i < timeline.length - 1 && (
								<div style={{
									position: "absolute", left: 11, top: 24, bottom: -8, width: 2,
									background: step.status === "done" ? "var(--c-up)" : "var(--c-line)",
								}} />
							)}
							{/* Dot */}
							<div style={{
								width: 24, height: 24, borderRadius: "50%", flexShrink: 0, zIndex: 1,
								display: "flex", alignItems: "center", justifyContent: "center",
								background: step.status === "done" ? "var(--c-up)" : step.status === "active" ? "var(--c-lime-500)" : "var(--c-surface-2)",
								border: step.status === "active" ? "2px solid var(--c-text)" : "none",
							}}>
								{step.status === "done" && <Check size={14} style={{ color: "#fff" }} />}
								{step.status === "active" && <Loader2 size={12} style={{ color: "var(--c-text)", animation: "spin 1s linear infinite" }} />}
							</div>
							{/* Label */}
							<div style={{ paddingBottom: 16 }}>
								<div style={{
									fontSize: 13, fontWeight: step.status === "pending" ? 400 : 600,
									color: step.status === "done" ? "var(--c-up)" : step.status === "active" ? "var(--c-text)" : "var(--c-text-3)",
								}}>
									{step.label}
								</div>
								{step.status === "active" && (
									<div style={{ fontSize: 11, color: "var(--c-text-2)", marginTop: 2 }}>In progress</div>
								)}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Values card */}
			<div style={{ padding: 16, borderRadius: 14, border: "1px solid var(--c-line)", background: "var(--c-surface)", marginBottom: 20 }}>
				<h3 style={{ fontSize: 12, fontWeight: 700, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 14px" }}>
					Order details
				</h3>
				<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
					<Row label="Order ID" value={order.id} copy />
					<Row label="Network" value={order.channel} />
					<Row label="Amount" value={`${order.amountUsdt?.toFixed(2)} USDT`} />
					<Row label="Value" value={fmt(order.amountNgn)} />
					<Row label="Rate" value={`₦${order.rate?.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`} />
					<Row label="Fee" value={fmt(order.fee || 0)} />
					{order.destination && <Row label={isBuy ? "Wallet" : "Bank"} value={order.destination} />}
					<Row label="Status" value={order.status.replace(/_/g, " ")} color={
						order.status === "completed" ? "var(--c-up)" : order.status === "failed" || order.status === "expired" ? "var(--c-down)" : "var(--c-text)"
					} />
				</div>
			</div>

			{/* Actions */}
			<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
				{needsAction && (
					<Button
						size="lg"
						className="w-full"
						onClick={() => router.push("/trade")}
						style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", fontWeight: 700 }}
					>
						{order.status === "awaiting_payment" ? "Complete payment" : "Send crypto now"}
					</Button>
				)}
				{order.status === "completed" && (
					<Button
						size="lg"
						className="w-full"
						onClick={() => router.push("/trade")}
						style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", fontWeight: 700 }}
					>
						Trade again
					</Button>
				)}
				{(order.status === "failed" || order.status === "expired") && (
					<Button
						size="lg"
						className="w-full"
						onClick={() => router.push("/trade")}
						style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", fontWeight: 700 }}
					>
						Try again
					</Button>
				)}
				<Button
					variant="ghost"
					size="lg"
					className="w-full"
					onClick={() => router.push("/support")}
					style={{ color: "var(--c-text-2)" }}
				>
					Get help with this order
				</Button>
			</div>
		</div>
	);
}

function Row({ label, value, copy, color }: { label: string; value: string; copy?: boolean; color?: string }) {
	return (
		<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
			<span style={{ color: "var(--c-text-2)" }}>{label}</span>
			<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
				<span style={{ fontWeight: 600, color: color || "var(--c-text)", fontVariantNumeric: "tabular-nums", textTransform: "capitalize" }}>{value}</span>
				{copy && <CopyButton value={value} />}
			</div>
		</div>
	);
}
