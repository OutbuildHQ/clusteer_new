"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/utils";
import { X } from "lucide-react";

/* ── Mock orders matching dashboards/data.js ── */
const ASSETS_SHORT = ["USDT", "USDC"];
function seed(s: number) { return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
const ORDERS = Array.from({ length: 30 }, (_, i) => {
	const r = seed(i + 200);
	const side = r() > 0.5 ? "Buy" : "Sell";
	const sym = ASSETS_SHORT[Math.floor(r() * ASSETS_SHORT.length)];
	const prices: Record<string, number> = { USDT: 1, USDC: 1, BTC: 71240, ETH: 3568, SOL: 182, BNB: 612 };
	return {
		id: `ORD-${44820 - i * 3}`,
		pair: `${sym}/NGN`,
		side,
		type: ["Limit", "Market", "Stop"][Math.floor(r() * 3)],
		price: (prices[sym] ?? 1) * (0.95 + r() * 0.1),
		amount: +(1 + r() * 200).toFixed(2),
		filled: Math.floor(r() * 100),
		status: ["Open", "Filled", "Cancelled", "Partial"][Math.floor(r() * 4)],
		time: `${Math.floor(r() * 23)}:${String(Math.floor(r() * 59)).padStart(2, "0")}`,
		placed: `Mar ${Math.floor(r() * 15) + 1}, 2026`,
	};
});

function StatusBadge({ s }: { s: string }) {
	const map: Record<string, { bg: string; color: string; border?: string }> = {
		Filled: { bg: "var(--c-up-soft)", color: "var(--c-up)" },
		Open: { bg: "var(--c-info-soft)", color: "var(--c-info)" },
		Partial: { bg: "var(--c-warn-soft)", color: "var(--c-warn)" },
		Cancelled: { bg: "var(--c-surface-2)", color: "var(--c-text-2)", border: "1px solid var(--c-line)" },
	};
	const icons: Record<string, string> = { Filled: "✓", Open: "●", Partial: "◐", Cancelled: "—" };
	const m = map[s] ?? map.Open;
	return (
		<span className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full text-[11.5px] font-medium" style={{ background: m.bg, color: m.color, border: m.border }}>
			<span className="text-[9px]">{icons[s] ?? "●"}</span>{s}
		</span>
	);
}

type Tab = "Open" | "Filled" | "Cancelled" | "All";

export default function OrdersPage() {
	const [tab, setTab] = useState<Tab>("Open");
	const [open, setOpen] = useState<(typeof ORDERS)[number] | null>(null);

	const list = ORDERS.filter(
		(o) => tab === "All" || o.status === tab || (tab === "Open" && ["Open", "Partial"].includes(o.status)),
	);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between flex-wrap gap-4">
				<h1 className="text-[22px] lg:text-[32px] font-semibold leading-tight tracking-tight" style={{ color: "var(--c-text)", letterSpacing: "-0.03em" }}>Orders</h1>
				<div className="inline-flex p-1 rounded-[10px] gap-0.5" style={{ background: "var(--c-surface-2)", border: "1px solid var(--c-line)" }}>
					{(["Open", "Filled", "Cancelled", "All"] as Tab[]).map((t) => (
						<button key={t} onClick={() => setTab(t)}
							className="px-3 py-1.5 rounded-[6px] text-[12.5px] font-medium transition-colors"
							style={tab === t ? { background: "var(--c-surface)", color: "var(--c-text)", boxShadow: "var(--sh-1)" } : { color: "var(--c-text-2)" }}>
							{t}
						</button>
					))}
				</div>
			</div>

			{/* Table (desktop) */}
			<div className="hidden lg:block rounded-[14px] overflow-hidden" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
				<table className="w-full border-collapse text-[13px]">
					<thead>
						<tr>
							{["Pair", "Side", "Type", "Price", "Amount", "Filled", "Status", "Time"].map((h, i) => (
								<th key={h} className={`font-medium text-[11.5px] uppercase tracking-[0.05em] px-3.5 py-2.5 ${i === 7 ? "text-right" : "text-left"}`}
									style={{ color: "var(--c-text-3)", borderBottom: "1px solid var(--c-line)", background: "var(--c-surface-2)" }}>{h}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{list.slice(0, 15).map((o) => (
							<tr key={o.id} className="cursor-pointer transition-colors hover:bg-[var(--c-surface-2)]" onClick={() => setOpen(o)}>
								<td className="px-3.5 py-3 font-semibold" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)", color: "var(--c-text)" }}>{o.pair}</td>
								<td className="px-3.5 py-3" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)" }}>
									<span className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full text-[11.5px] font-medium"
										style={o.side === "Buy" ? { background: "var(--c-up-soft)", color: "var(--c-up)" } : { background: "var(--c-down-soft)", color: "var(--c-down)" }}>
										{o.side}
									</span>
								</td>
								<td className="px-3.5 py-3" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)", color: "var(--c-text)" }}>{o.type}</td>
								<td className="px-3.5 py-3 tabular-nums" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)", fontFamily: "var(--f-mono)", color: "var(--c-text)" }}>
									{formatMoney(o.price * 1610, "NGN", { decimals: 0 })}
								</td>
								<td className="px-3.5 py-3 tabular-nums" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)", fontFamily: "var(--f-mono)", color: "var(--c-text)" }}>
									{o.amount.toFixed(2)}
								</td>
								<td className="px-3.5 py-3" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)" }}>
									<div className="flex items-center gap-2">
										<div className="flex-1 max-w-[80px] h-[6px] rounded-full overflow-hidden" style={{ background: "var(--c-surface-3)" }}>
											<div className="h-full rounded-full" style={{ width: `${o.filled}%`, background: "var(--c-lime-500)" }} />
										</div>
										<span className="tabular-nums text-[11px]" style={{ fontFamily: "var(--f-mono)", color: "var(--c-text-3)" }}>{o.filled}%</span>
									</div>
								</td>
								<td className="px-3.5 py-3" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)" }}>
									<StatusBadge s={o.status} />
								</td>
								<td className="px-3.5 py-3 text-right tabular-nums" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)", fontFamily: "var(--f-mono)", color: "var(--c-text)" }}>
									{o.time}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Card list (mobile) */}
			<div className="lg:hidden space-y-2">
				{list.slice(0, 15).map((o) => (
					<div key={o.id} className="rounded-[12px] p-3 cursor-pointer active:scale-[0.99] transition-transform" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }} onClick={() => setOpen(o)}>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<span className="font-semibold text-[13px]" style={{ color: "var(--c-text)" }}>{o.pair}</span>
								<span className="inline-flex items-center gap-1 h-[22px] px-2 rounded-full text-[11.5px] font-medium"
									style={o.side === "Buy" ? { background: "var(--c-up-soft)", color: "var(--c-up)" } : { background: "var(--c-down-soft)", color: "var(--c-down)" }}>
									{o.side}
								</span>
								<span className="text-[12px]" style={{ color: "var(--c-text-2)" }}>{o.type}</span>
							</div>
							<StatusBadge s={o.status} />
						</div>
						<div className="flex items-center justify-between mt-2">
							<div>
								<div className="tabular-nums text-[13px] font-semibold" style={{ fontFamily: "var(--f-mono)", color: "var(--c-text)" }}>{o.amount.toFixed(2)}</div>
								<div className="tabular-nums text-[11px]" style={{ fontFamily: "var(--f-mono)", color: "var(--c-text-2)" }}>@ {formatMoney(o.price * 1610, "NGN", { decimals: 0 })}</div>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-[60px] h-[6px] rounded-full overflow-hidden" style={{ background: "var(--c-surface-3)" }}>
									<div className="h-full rounded-full" style={{ width: `${o.filled}%`, background: "var(--c-lime-500)" }} />
								</div>
								<span className="tabular-nums text-[11px]" style={{ fontFamily: "var(--f-mono)", color: "var(--c-text-3)" }}>{o.filled}%</span>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Order detail drawer */}
			{open && (
				<>
					<div className="fixed inset-0 z-[100]" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setOpen(null)} />
					<div
						className="fixed inset-y-0 right-0 z-[101] w-full sm:max-w-[520px] flex flex-col overflow-auto"
						style={{ background: "var(--c-surface)", borderRadius: "20px 0 0 20px", border: "1px solid var(--c-line)", boxShadow: "var(--sh-3)", animation: "drawerIn .22s cubic-bezier(.2,.7,.2,1)" }}
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between px-[var(--pad)] py-4" style={{ borderBottom: "1px solid var(--c-line)" }}>
							<span className="text-[15px] font-semibold" style={{ color: "var(--c-text)" }}>Order {open.id}</span>
							<button onClick={() => setOpen(null)} className="inline-flex items-center justify-center size-9 rounded-[10px]" style={{ border: "1px solid var(--c-line)", color: "var(--c-text)" }}>
								<X className="size-4" />
							</button>
						</div>
						<div className="flex-1 p-[var(--pad)] space-y-4 overflow-auto">
							{/* Order summary */}
							<div className="rounded-[14px] p-3.5" style={{ border: "1px solid var(--c-line)" }}>
								<div className="flex items-center justify-between">
									<div>
										<div className="flex items-center gap-2">
											<span className="inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium"
												style={open.side === "Buy" ? { background: "var(--c-up-soft)", color: "var(--c-up)" } : { background: "var(--c-down-soft)", color: "var(--c-down)" }}>
												{open.side}
											</span>
											<span className="inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium" style={{ background: "var(--c-surface-2)", color: "var(--c-text-2)", border: "1px solid var(--c-line)" }}>{open.pair}</span>
											<StatusBadge s={open.status} />
										</div>
										<div className="tabular-nums text-[24px] font-semibold mt-2" style={{ fontFamily: "var(--f-display)", color: "var(--c-text)", letterSpacing: "-0.025em" }}>
											{open.amount.toFixed(4)} {open.pair.split("/")[0]}
										</div>
										<div className="tabular-nums text-[13px] mt-0.5" style={{ fontFamily: "var(--f-mono)", color: "var(--c-text-2)" }}>
											@ {formatMoney(open.price * 1610, "NGN", { decimals: 0 })}
										</div>
									</div>
									<div className="text-right">
										<div className="text-[11px] uppercase" style={{ color: "var(--c-text-3)" }}>Total</div>
										<div className="tabular-nums text-[18px] font-semibold mt-1" style={{ fontFamily: "var(--f-mono)", color: "var(--c-text)" }}>
											{formatMoney(open.price * open.amount * 1610, "NGN", { decimals: 0 })}
										</div>
									</div>
								</div>
								<div className="h-px my-3.5" style={{ background: "var(--c-line)" }} />
								<div className="flex items-center justify-between text-[12px] mb-1.5">
									<span style={{ color: "var(--c-text-3)" }}>Filled</span>
									<span className="tabular-nums" style={{ fontFamily: "var(--f-mono)", color: "var(--c-text)" }}>
										{(open.status === "Filled" ? open.amount : open.status === "Partial" ? open.amount * 0.62 : 0).toFixed(4)} / {open.amount.toFixed(4)} ({open.filled}%)
									</span>
								</div>
								<div className="h-[6px] rounded-[3px] overflow-hidden" style={{ background: "var(--c-surface-2)" }}>
									<div className="h-full" style={{ width: `${open.filled}%`, background: "var(--c-lime-500)" }} />
								</div>
							</div>

							{/* Order details */}
							<div className="rounded-[14px]" style={{ border: "1px solid var(--c-line)", padding: "4px 14px" }}>
								{[
									["Order type", open.type],
									["Time in force", "Good till cancel"],
									["Placed", open.placed],
									["Order ID", open.id],
									["Estimated fee", `${(open.price * open.amount * 1610 * 0.001).toFixed(2)} NGN`],
								].map(([k, v]) => (
									<div key={k} className="flex items-center justify-between py-2.5 text-[13px]" style={{ borderBottom: "1px solid var(--c-line)" }}>
										<span style={{ color: "var(--c-text-3)" }}>{k}</span>
										<span className="tabular-nums" style={{ fontFamily: k === "Order ID" || k === "Estimated fee" ? "var(--f-mono)" : "inherit", color: "var(--c-text)" }}>{v}</span>
									</div>
								))}
							</div>

							{/* Fills */}
							<div className="rounded-[14px] p-[var(--pad)]" style={{ border: "1px solid var(--c-line)" }}>
								<h4 className="text-[14px] font-semibold mb-3" style={{ color: "var(--c-text)" }}>Fills</h4>
								{open.status === "Open" ? (
									<div className="text-center py-6" style={{ color: "var(--c-text-3)" }}>
										<div>No fills yet</div>
										<div className="text-[12px] mt-1" style={{ color: "var(--c-text-3)" }}>Order is waiting in the book</div>
									</div>
								) : (
									<div className="space-y-0">
										{[
											...(open.status === "Filled" ? [{ amt: open.amount * 0.45, time: "09:42:18", px: open.price }] : []),
											{ amt: open.status === "Filled" ? open.amount * 0.55 : open.amount * 0.62, time: "09:43:51", px: open.price - 50 / 1610 },
										].map((f, i) => (
											<div key={i} className="flex items-center justify-between py-2.5 text-[13px]" style={{ borderBottom: "1px solid var(--c-line)" }}>
												<div>
													<div className="tabular-nums" style={{ fontFamily: "var(--f-mono)", color: "var(--c-text)" }}>{f.amt.toFixed(4)} {open.pair.split("/")[0]}</div>
													<div className="tabular-nums text-[11px] mt-0.5" style={{ fontFamily: "var(--f-mono)", color: "var(--c-text-3)" }}>{f.time}</div>
												</div>
												<div className="tabular-nums" style={{ fontFamily: "var(--f-mono)", color: "var(--c-text)" }}>
													{formatMoney(f.px * 1610, "NGN", { decimals: 0 })}
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
						<div className="flex items-center justify-end gap-2 px-[var(--pad)] py-3" style={{ borderTop: "1px solid var(--c-line)" }}>
							{(open.status === "Open" || open.status === "Partial") && (
								<button className="inline-flex items-center h-9 px-3.5 rounded-[10px] text-[13.5px] font-medium" style={{ color: "var(--c-down)", border: "1px solid var(--c-line)" }} onClick={() => setOpen(null)}>
									Cancel order
								</button>
							)}
							<button className="inline-flex items-center h-9 px-3.5 rounded-[10px] text-[13.5px] font-medium" style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }} onClick={() => setOpen(null)}>
								Done
							</button>
						</div>
					</div>
				</>
			)}

			<style jsx global>{`@keyframes drawerIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
		</div>
	);
}
