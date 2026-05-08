"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "@/lib/api/user/queries";
import { formatMoney } from "@/lib/utils";
import { X, Search, ChevronLeft, ChevronRight } from "lucide-react";
import type { IOrder } from "@/types";

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

/** Map API IOrder to the shape the UI rows expect */
function mapOrder(o: IOrder) {
	const pair = o.crypto && o.fiat ? `${o.crypto}/${o.fiat}` : `${o.crypto ?? "USDT"}/NGN`;
	const prices: Record<string, number> = { USDT: 1, USDC: 1, BTC: 71240, ETH: 3568, SOL: 182, BNB: 612 };
	const price = o.rate ?? (prices[o.crypto] ?? 1);
	return {
		id: o.number ?? o.id,
		pair,
		side: o.type,
		type: o.paymentMethod ?? "Market",
		price,
		amount: o.amount,
		filled: o.status === "Filled" ? 100 : o.status === "Partial" ? 62 : o.status === "Cancelled" ? 0 : 0,
		status: o.status,
		time: o.dateOrdered ? new Date(o.dateOrdered).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : (o.date ?? ""),
		placed: o.dateOrdered ? new Date(o.dateOrdered).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) : o.date,
		dateSettled: o.dateSettled,
		chain: o.chain,
	};
}

const PAGE_SIZE = 15;

export default function OrdersPage() {
	const [tab, setTab] = useState<Tab>("Open");
	const [q, setQ] = useState("");
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState<ReturnType<typeof mapOrder> | null>(null);

	const { data: response, isLoading, isError } = useQuery({
		queryKey: ["orders", page],
		queryFn: () => getAllOrders({ page, size: PAGE_SIZE }),
	});

	const orders = useMemo(() => (response?.data ?? []).map(mapOrder), [response]);
	const totalPages = response?.metadata?.totalPages ?? 1;

	const list = useMemo(
		() =>
			orders.filter(
				(o) =>
					(tab === "All" || o.status === tab || (tab === "Open" && ["Open", "Partial"].includes(o.status))) &&
					(!q || o.id.toUpperCase().includes(q.toUpperCase()) || o.pair.toUpperCase().includes(q.toUpperCase()) || String(o.amount).includes(q)),
			),
		[orders, tab, q],
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

			{/* Search */}
			<div className="flex items-center w-full sm:max-w-[320px] h-9 px-3 rounded-[10px]" style={{ border: "1px solid var(--c-line)", background: "var(--c-surface)" }}>
				<Search className="size-4 shrink-0" style={{ color: "var(--c-text-3)" }} />
				<input className="flex-1 bg-transparent outline-none text-[13.5px] ml-2" style={{ color: "var(--c-text)" }} placeholder="Search by ID, pair, amount…" value={q} onChange={(e) => setQ(e.target.value)} />
			</div>

			{/* Loading state */}
			{isLoading && (
				<div className="space-y-2">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className="rounded-[12px] p-4" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
							<div className="flex items-center gap-3">
								<div className="flex-1 space-y-2">
									<div className="h-3 w-1/3 rounded animate-pulse" style={{ background: "var(--c-surface-2)" }} />
									<div className="h-3 w-1/4 rounded animate-pulse" style={{ background: "var(--c-surface-2)" }} />
								</div>
								<div className="h-4 w-20 rounded animate-pulse" style={{ background: "var(--c-surface-2)" }} />
							</div>
						</div>
					))}
				</div>
			)}

			{/* Error state */}
			{isError && !isLoading && (
				<div className="rounded-[14px] p-8 text-center" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
					<div className="text-[15px] font-medium" style={{ color: "var(--c-text)" }}>Unable to load orders</div>
					<div className="text-[13px] mt-1" style={{ color: "var(--c-text-3)" }}>Please check your connection and try again.</div>
				</div>
			)}

			{/* Empty state */}
			{!isLoading && !isError && list.length === 0 && (
				<div className="rounded-[14px] p-8 text-center" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
					<div className="text-[15px] font-medium" style={{ color: "var(--c-text)" }}>No orders found</div>
					<div className="text-[13px] mt-1" style={{ color: "var(--c-text-3)" }}>
						{q || tab !== "Open" ? "Try adjusting your search or filter." : "Your orders will appear here."}
					</div>
				</div>
			)}

			{/* Table (desktop) */}
			{!isLoading && !isError && list.length > 0 && (
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
							{list.map((o) => (
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
			)}

			{/* Card list (mobile) */}
			{!isLoading && !isError && list.length > 0 && (
				<div className="lg:hidden space-y-2">
					{list.map((o) => (
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
			)}

			{/* Pagination */}
			{!isLoading && !isError && totalPages > 1 && (
				<div className="flex items-center justify-center gap-2">
					<button
						onClick={() => setPage((p) => Math.max(1, p - 1))}
						disabled={page <= 1}
						className="inline-flex items-center justify-center size-9 rounded-[10px] transition-colors disabled:opacity-40"
						style={{ border: "1px solid var(--c-line)", color: "var(--c-text)" }}
					>
						<ChevronLeft className="size-4" />
					</button>
					<span className="text-[13px] tabular-nums px-3" style={{ color: "var(--c-text-2)", fontFamily: "var(--f-mono)" }}>
						Page {page} of {totalPages}
					</span>
					<button
						onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
						disabled={page >= totalPages}
						className="inline-flex items-center justify-center size-9 rounded-[10px] transition-colors disabled:opacity-40"
						style={{ border: "1px solid var(--c-line)", color: "var(--c-text)" }}
					>
						<ChevronRight className="size-4" />
					</button>
				</div>
			)}

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
