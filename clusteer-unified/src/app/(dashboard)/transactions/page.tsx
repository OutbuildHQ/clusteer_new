"use client";

import { useState } from "react";
import { ORDERS } from "@/lib/mock-data";
import { formatMoney, relativeTime } from "@/lib/utils";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { ChainBadge } from "@/components/primitives/chain-badge";
import { Num } from "@/components/primitives/num";
import { Search, Download } from "lucide-react";

export default function TransactionsPage() {
	const [q, setQ] = useState("");
	const [kind, setKind] = useState("all");
	const [status, setStatus] = useState("all");

	const rows = ORDERS.filter((o) =>
		(kind === "all" || o.kind === kind) &&
		(status === "all" || o.status === status) &&
		(!q || o.id.toLowerCase().includes(q.toLowerCase()) || o.asset.toLowerCase().includes(q.toLowerCase()))
	);

	const getStatusStyle = (s: string) => {
		switch (s) {
			case "completed": return { background: "rgba(21,128,61,0.1)", color: "var(--c-success, #15803d)" };
			case "failed": return { background: "rgba(239,68,68,0.1)", color: "var(--c-danger, #ef4444)" };
			default: return { background: "rgba(234,179,8,0.1)", color: "var(--c-warning, #eab308)" };
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<h1 className="font-display text-2xl font-bold tracking-tight">Transactions</h1>
				<button
					style={{
						background: "transparent",
						color: "var(--c-fg, inherit)",
						border: "1px solid var(--c-border, #e5e5e5)",
						height: "36px",
						padding: "0 12px",
						borderRadius: "8px",
						fontWeight: 500,
						fontSize: "14px",
						cursor: "pointer",
						display: "inline-flex",
						alignItems: "center",
						gap: "6px",
					}}
				>
					<Download className="size-4" />Export CSV
				</button>
			</div>
			<div className="ds-card" style={{ borderRadius: "var(--c-radius, 12px)", border: "1px solid var(--c-border, #e5e5e5)", background: "var(--c-surface, #fff)", overflow: "hidden" }}>
				<div style={{ padding: "16px 24px" }}>
					<div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto]">
						<div className="relative">
							<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
							<input
								className="pl-9"
								placeholder="Search by ID or asset..."
								value={q}
								onChange={(e) => setQ(e.target.value)}
								style={{
									width: "100%",
									height: "40px",
									paddingLeft: "36px",
									paddingRight: "12px",
									border: "1px solid var(--c-border, #e5e5e5)",
									borderRadius: "8px",
									background: "var(--c-bg, #fff)",
									fontSize: "14px",
									outline: "none",
								}}
							/>
						</div>
						<select
							value={kind}
							onChange={(e) => setKind(e.target.value)}
							style={{
								height: "40px",
								padding: "0 12px",
								border: "1px solid var(--c-border, #e5e5e5)",
								borderRadius: "8px",
								background: "var(--c-bg, #fff)",
								fontSize: "14px",
								cursor: "pointer",
								minWidth: "160px",
								outline: "none",
							}}
						>
							<option value="all">All types</option>
							<option value="buy">Buy</option>
							<option value="sell">Sell</option>
							<option value="swap">Swap</option>
							<option value="send">Send</option>
							<option value="receive">Receive</option>
						</select>
						<select
							value={status}
							onChange={(e) => setStatus(e.target.value)}
							style={{
								height: "40px",
								padding: "0 12px",
								border: "1px solid var(--c-border, #e5e5e5)",
								borderRadius: "8px",
								background: "var(--c-bg, #fff)",
								fontSize: "14px",
								cursor: "pointer",
								minWidth: "160px",
								outline: "none",
							}}
						>
							<option value="all">All statuses</option>
							<option value="completed">Completed</option>
							<option value="pending">Pending</option>
							<option value="failed">Failed</option>
						</select>
					</div>
				</div>
				<div style={{ padding: 0 }}>
					<table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
						<thead>
							<tr style={{ borderBottom: "1px solid var(--c-border, #e5e5e5)" }}>
								<th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500, color: "var(--c-muted, #6b7280)", fontSize: "13px" }}>ID</th>
								<th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500, color: "var(--c-muted, #6b7280)", fontSize: "13px" }}>Type</th>
								<th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500, color: "var(--c-muted, #6b7280)", fontSize: "13px" }}>Asset</th>
								<th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500, color: "var(--c-muted, #6b7280)", fontSize: "13px" }}>Amount</th>
								<th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500, color: "var(--c-muted, #6b7280)", fontSize: "13px" }}>Status</th>
								<th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 500, color: "var(--c-muted, #6b7280)", fontSize: "13px" }}>When</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((o) => (
								<tr key={o.id} style={{ borderBottom: "1px solid var(--c-border, #e5e5e5)" }}>
									<td style={{ padding: "12px 16px" }}><code className="mono text-xs text-muted-foreground">{o.id}</code></td>
									<td style={{ padding: "12px 16px" }}><span className="capitalize font-medium">{o.kind}</span></td>
									<td style={{ padding: "12px 16px" }}>
										<div className="flex items-center gap-2">
											<AssetLogo symbol={o.asset} size="sm" />
											<span className="text-sm">{o.asset}</span>
											<ChainBadge chain={o.chain} />
										</div>
									</td>
									<td style={{ padding: "12px 16px" }}>
										<Num as="div" value={o.amount + " " + o.asset} />
										<Num as="div" tone="muted" className="text-xs" value={formatMoney(o.amountNgn, "NGN", { decimals: 0 })} />
									</td>
									<td style={{ padding: "12px 16px" }}>
										<span
											style={{
												display: "inline-flex",
												alignItems: "center",
												borderRadius: "9999px",
												padding: "2px 10px",
												fontSize: "12px",
												fontWeight: 500,
												textTransform: "capitalize",
												...getStatusStyle(o.status),
											}}
										>
											{o.status}
										</span>
									</td>
									<td style={{ padding: "12px 16px", textAlign: "right" }} className="text-sm text-muted-foreground">{relativeTime(o.createdAt)}</td>
								</tr>
							))}
						</tbody>
					</table>
					{rows.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">No transactions match your filters.</div>}
				</div>
			</div>
		</div>
	);
}
