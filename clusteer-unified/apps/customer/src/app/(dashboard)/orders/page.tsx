"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { EmptyState } from "@/components/primitives/empty-state";
import { OrderStatusBadge } from "@/components/trade/order-status-badge";
import type { QxOrder, QxOrderStatus } from "@/lib/types";

function fmtNgn(n: number) { return "₦" + Math.round(n).toLocaleString("en-NG"); }

const ACTIVE_STATUSES: QxOrderStatus[] = ["awaiting_payment", "awaiting_deposit", "confirming"];
const HISTORY_STATUSES: QxOrderStatus[] = ["completed", "expired", "failed"];

export default function OrdersPage() {
	const [tab, setTab] = useState<"Active" | "History">("Active");

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
	const list = useMemo(() => {
		const statuses = tab === "Active" ? ACTIVE_STATUSES : HISTORY_STATUSES;
		return orders.filter((o) => statuses.includes(o.status));
	}, [orders, tab]);

	if (isLoading) {
		return (
			<div className="flex justify-center pt-20">
				<div className="w-8 h-8 border-[3px] border-ds-line border-t-lime-500 rounded-full animate-spin" />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Header: title left, tabs right */}
			<div className="flex items-center justify-between gap-4">
				<h1 className="text-[32px] font-semibold text-ds-text tracking-[-0.03em] m-0 font-display">
					Orders
				</h1>
				{/* Tabs — design .tabs style */}
				<div className="inline-flex p-1 bg-ds-surface-2 rounded-[10px] border border-ds-line gap-0.5">
					{(["Active", "History"] as const).map((t) => (
						<button
							key={t}
							onClick={() => setTab(t)}
							className={`px-3 py-1.5 rounded-[8px] text-[12.5px] font-medium cursor-pointer border-none font-sans ${
								tab === t
									? "bg-ds-surface text-ds-text shadow-[var(--sh-1)]"
									: "bg-transparent text-ds-text-2"
							}`}
						>
							{t}
						</button>
					))}
				</div>
			</div>

			{/* Table card */}
			{list.length === 0 ? (
				<EmptyState
					icon={BookOpen}
					variant="branded"
					title={tab === "Active" ? "No active orders" : "No order history"}
					description={tab === "Active" ? "Your buy and sell orders will appear here." : "Completed, expired, and failed orders will show here."}
					action={tab === "Active" ? { label: "Buy USDT", href: "/trade" } : undefined}
				/>
			) : (
				<div className="bg-ds-surface border border-ds-line rounded-[14px] overflow-hidden">
					<table className="w-full border-collapse text-[13px]">
						<thead>
							<tr>
								{["Order", "Type", "Network", "Amount", "Value", ""].map((h, i) => (
									<th
										key={h || "status"}
										className={`${i === 5 ? "text-right" : "text-left"} font-medium text-ds-text-3 text-[11.5px] uppercase tracking-[0.05em] px-3.5 py-2.5 border-b border-ds-line bg-ds-surface-2`}
									>
										{h || "Status"}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{list.map((o) => (
								<tr
									key={o.id}
									onClick={() => window.openFlow("orderDetail", { order: o })}
									className="cursor-pointer hover:bg-ds-surface-2"
								>
									<td className="px-3.5 py-3 border-b border-ds-line font-mono text-ds-text-3 text-[11px]">
										{o.id}
									</td>
									<td className="px-3.5 py-3 border-b border-ds-line">
										<span className={`inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full text-[11.5px] font-medium capitalize border border-transparent ${
											o.side === "buy"
												? "bg-up-soft text-up"
												: "bg-down-soft text-down"
										}`}>
											{o.side}
										</span>
									</td>
									<td className="px-3.5 py-3 border-b border-ds-line">
										{o.channel}
									</td>
									<td className="px-3.5 py-3 border-b border-ds-line">
										<div className="flex items-center gap-2">
											<AssetLogo symbol={o.asset || "USDT"} size="sm" />
											<span>{o.amountUsdt?.toFixed(2) || "—"} {o.asset || "USDT"}</span>
										</div>
									</td>
									<td className="px-3.5 py-3 border-b border-ds-line font-mono tabular-nums" style={{ fontFeatureSettings: '"tnum", "zero"' }}>
										{fmtNgn(o.amountNgn || 0)}
									</td>
									<td className="px-3.5 py-3 border-b border-ds-line text-right">
										<OrderStatusBadge status={o.status} />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
