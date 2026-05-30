"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, BookOpen } from "lucide-react";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { EmptyState } from "@/components/primitives/empty-state";
import { OrderStatusBadge, isActionNeeded } from "@/components/trade/order-status-badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { QxOrder, QxOrderStatus } from "@/lib/types";

function fmt(n: number) { return "₦" + Math.round(n).toLocaleString("en-NG"); }

function timeAgo(dateStr: string) {
	const diff = Date.now() - new Date(dateStr).getTime();
	const mins = Math.floor(diff / 60_000);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hrs = Math.floor(mins / 60);
	if (hrs < 24) return `${hrs}h ago`;
	return `${Math.floor(hrs / 24)}d ago`;
}

const ACTIVE_STATUSES: QxOrderStatus[] = ["awaiting_payment", "awaiting_deposit", "confirming"];
const HISTORY_STATUSES: QxOrderStatus[] = ["completed", "expired", "failed"];

function OrderCard({ order }: { order: QxOrder }) {
	const needsAction = isActionNeeded(order.status);
	return (
		<Link
			href={`/orders/${order.id}`}
			style={{
				display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
				background: needsAction ? "var(--c-warn-soft)" : "var(--c-surface)",
				borderBottom: "1px solid var(--c-line)",
				textDecoration: "none", color: "var(--c-text)",
			}}
		>
			<div style={{ position: "relative" }}>
				<AssetLogo symbol="USDT" size="sm" />
				<div style={{
					position: "absolute", bottom: -2, right: -2, width: 14, height: 14, borderRadius: "50%",
					background: order.side === "buy" ? "var(--c-up)" : "var(--c-down)",
					display: "flex", alignItems: "center", justifyContent: "center",
					fontSize: 8, fontWeight: 700, color: "#fff",
				}}>
					{order.side === "buy" ? "B" : "S"}
				</div>
			</div>
			<div style={{ flex: 1, minWidth: 0 }}>
				<div style={{ fontSize: 14, fontWeight: 600 }}>
					{order.side === "buy" ? "Buy" : "Sell"} {order.amountUsdt?.toFixed(2) || "—"} USDT
				</div>
				<div style={{ fontSize: 12, color: "var(--c-text-3)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
					{order.id} · {order.channel} · {timeAgo(order.createdAt)}
				</div>
			</div>
			<div style={{ textAlign: "right", flexShrink: 0 }}>
				<div style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
					{fmt(order.amountNgn || 0)}
				</div>
				<div style={{ marginTop: 4 }}>
					<OrderStatusBadge status={order.status} />
				</div>
			</div>
		</Link>
	);
}

export default function OrdersPage() {
	const { data: ordersData, isLoading } = useQuery({
		queryKey: ["orders"],
		queryFn: async () => {
			const r = await fetch("/api/order?page=1&size=50");
			const d = await r.json();
			return (d.data || []) as QxOrder[];
		},
		refetchInterval: 10_000,
	});

	const orders = ordersData || [];
	const active = useMemo(() => orders.filter((o) => ACTIVE_STATUSES.includes(o.status)), [orders]);
	const history = useMemo(() => orders.filter((o) => HISTORY_STATUSES.includes(o.status)), [orders]);
	const needAction = active.filter((o) => isActionNeeded(o.status));

	if (isLoading) {
		return (
			<div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
				<div style={{ width: 32, height: 32, border: "3px solid var(--c-line)", borderTopColor: "var(--c-lime-500)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
			</div>
		);
	}

	return (
		<div>
			<h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--c-text)", letterSpacing: "-0.03em", marginBottom: 20 }}>
				Orders
			</h1>

			{/* Action needed alert */}
			{needAction.length > 0 && (
				<div style={{
					display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, marginBottom: 16,
					background: "var(--c-warn-soft)", border: "1px solid var(--c-warn)",
				}}>
					<AlertTriangle size={16} style={{ color: "var(--c-warn)", flexShrink: 0 }} />
					<span style={{ fontSize: 13, fontWeight: 600, color: "var(--c-text)" }}>
						{needAction.length} order{needAction.length > 1 ? "s" : ""} need{needAction.length === 1 ? "s" : ""} your action
					</span>
				</div>
			)}

			<Tabs defaultValue="active">
				<TabsList className="mb-4">
					<TabsTrigger value="active">
						Active {active.length > 0 && <span style={{ marginLeft: 4, fontSize: 11, fontWeight: 700, background: "var(--c-warn)", color: "#fff", padding: "1px 6px", borderRadius: 99 }}>{active.length}</span>}
					</TabsTrigger>
					<TabsTrigger value="history">History</TabsTrigger>
				</TabsList>

				<TabsContent value="active">
					{active.length === 0 ? (
						<EmptyState icon={BookOpen} title="No active orders" description="Your buy and sell orders will appear here." />
					) : (
						<div style={{ borderRadius: 14, border: "1px solid var(--c-line)", overflow: "hidden" }}>
							{active.map((o) => <OrderCard key={o.id} order={o} />)}
						</div>
					)}
				</TabsContent>

				<TabsContent value="history">
					{history.length === 0 ? (
						<EmptyState icon={BookOpen} title="No order history" description="Completed, expired, and failed orders will show here." />
					) : (
						<div style={{ borderRadius: 14, border: "1px solid var(--c-line)", overflow: "hidden" }}>
							{history.map((o) => <OrderCard key={o.id} order={o} />)}
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
