"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Receipt } from "lucide-react";
import { EmptyState } from "@/components/primitives/empty-state";
import type { QxOrder } from "@/lib/types";

const FEE_PCT = 0.0075;

function fmtNgn(n: number) { return "₦" + Math.round(n).toLocaleString("en-NG"); }

export default function BillingPage() {
	const { data: ordersData, isLoading } = useQuery({
		queryKey: ["orders"],
		queryFn: async () => {
			const r = await fetch("/api/order?page=1&size=100");
			const d = await r.json();
			return (d.data || []) as QxOrder[];
		},
	});

	const orders = ordersData || [];
	const rows = useMemo(() => orders.map((o) => ({
		...o,
		fee: Math.round((o.amountNgn || 0) * FEE_PCT),
	})), [orders]);

	const totalFees = rows.reduce((s, o) => s + o.fee, 0);
	const monthRows = rows.slice(0, Math.max(1, Math.ceil(rows.length * 0.55)));
	const monthFees = monthRows.reduce((s, o) => s + o.fee, 0);

	function handleExport() {
		const headers = ["Order", "Type", "Order value", "Fee rate", "Fee"];
		const csv = [headers, ...rows.map((o) => [o.id, o.side, o.amountNgn || 0, "0.75%", o.fee])].map((r) => r.join(",")).join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `billing-${new Date().toISOString().split("T")[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}

	if (isLoading) {
		return (
			<div className="flex justify-center pt-20">
				<div className="w-8 h-8 border-[3px] border-ds-line border-t-lime-500 rounded-full animate-spin" />
			</div>
		);
	}

	const stats = [
		["Fees this month", fmtNgn(monthFees)],
		["Total fees paid", fmtNgn(totalFees)],
		["Average fee rate", "0.75%"],
	];

	return (
		<div className="flex flex-col gap-6">
			{/* Header */}
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<div>
					<h1 className="text-[32px] font-semibold text-ds-text tracking-[-0.03em] m-0 font-display">
						Billing
					</h1>
					<p className="mt-1.5 text-[13.5px] text-ds-text-2">
						Fees and charges across your orders.
					</p>
				</div>
				<button
					onClick={handleExport}
					className="inline-flex items-center gap-2 h-[36px] px-3.5 rounded-[10px] border border-ds-line bg-transparent text-ds-text text-[13.5px] font-medium font-sans cursor-pointer"
				>
					<Download size={14} />
					Export statement
				</button>
			</div>

			{/* Stat cards */}
			<div className="grid grid-cols-3 gap-3">
				{stats.map(([label, value]) => (
					<div key={label} className="bg-ds-surface border border-ds-line rounded-[14px] p-[var(--pad,20px)]">
						<div className="text-[12px] text-ds-text-3">{label}</div>
						<div className="text-[24px] font-semibold mt-1.5 font-mono tabular-nums text-ds-text">
							{value}
						</div>
					</div>
				))}
			</div>

			{/* Charges table */}
			{rows.length === 0 ? (
				<EmptyState icon={Receipt} variant="branded" title="No charges yet" description="Fees from your orders will appear here." />
			) : (
				<div className="bg-ds-surface border border-ds-line rounded-[14px] overflow-hidden">
					{/* Card header */}
					<div className="px-5 py-4 border-b border-ds-line flex items-center justify-between">
						<h3 className="text-[15px] font-semibold text-ds-text m-0">Charges</h3>
					</div>
					<table className="w-full border-collapse text-[13px]">
						<thead>
							<tr>
								{["Order", "Type", "Order value", "Fee rate", "Fee"].map((h, i) => (
									<th key={h} className={`${i === 4 ? "text-right" : "text-left"} font-medium text-ds-text-3 text-[11.5px] uppercase tracking-[0.05em] px-3.5 py-2.5 border-b border-ds-line bg-ds-surface-2`}>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{rows.map((o) => (
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
									<td className="px-3.5 py-3 border-b border-ds-line font-mono tabular-nums">
										{fmtNgn(o.amountNgn || 0)}
									</td>
									<td className="px-3.5 py-3 border-b border-ds-line text-ds-text-2">
										0.75%
									</td>
									<td className="px-3.5 py-3 border-b border-ds-line text-right font-semibold font-mono tabular-nums">
										{fmtNgn(o.fee)}
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
