"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/utils";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Num } from "@/components/primitives/num";
import { Search, Download, Filter, ArrowUp, ArrowDown, X } from "lucide-react";

/* ── Mock transactions (matches dashboards/data.js shape) ── */
const TYPES = ["Buy", "Sell", "Send", "Receive", "Swap", "Withdraw", "Deposit"] as const;
const ASSETS_LIST = ["USDT", "USDC", "NGN"] as const;
const STATUSES = ["Completed", "Pending", "Failed"] as const;

function seed(s: number) { return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }

const TXNS = Array.from({ length: 40 }, (_, i) => {
	const r = seed(i + 100);
	const type = TYPES[Math.floor(r() * TYPES.length)];
	const asset = ASSETS_LIST[Math.floor(r() * ASSETS_LIST.length)];
	const status = STATUSES[Math.floor(r() * STATUSES.length)];
	const amount = +(0.01 + r() * 500).toFixed(4);
	const prices: Record<string, number> = { USDT: 1610, USDC: 1608, BTC: 114_000_000, ETH: 5_740_000, SOL: 293_000, BNB: 985_000, NGN: 1 };
	return {
		id: `TX-${838201 - i * 7}`,
		type, asset,
		chain: asset === "USDT" ? "Tron" : asset === "USDC" ? "BSC" : asset,
		amount,
		ngn: Math.floor(amount * (prices[asset] ?? 1610)),
		status,
		counterparty: type === "Send" ? "TQrZ...x9k2" : type === "Receive" ? "TF8m...3pQa" : "—",
		fee: +((amount * (prices[asset] ?? 1610) * 0.001) + 0.5).toFixed(2),
		when: `${Math.floor(r() * 23)}:${String(Math.floor(r() * 59)).padStart(2, "0")}`,
		date: ["Today", "Today", "Yesterday", "Mar 14", "Mar 13", "Mar 12", "Mar 10"][Math.floor(r() * 7)],
		hash: type === "Send" || type === "Receive" || type === "Swap" ? `0x${Math.floor(r() * 1e16).toString(16).padStart(16, "0")}...${Math.floor(r() * 1e8).toString(16).padStart(8, "0")}` : null,
	};
});

function StatusBadge({ s }: { s: string }) {
	const map: Record<string, { bg: string; color: string; icon: string }> = {
		Completed: { bg: "var(--c-up-soft)", color: "var(--c-up)", icon: "✓" },
		Pending: { bg: "var(--c-warn-soft)", color: "var(--c-warn)", icon: "◐" },
		Failed: { bg: "var(--c-down-soft)", color: "var(--c-down)", icon: "✕" },
	};
	const m = map[s] ?? map.Pending;
	return (
		<span className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full text-[11.5px] font-medium" style={{ background: m.bg, color: m.color }}>
			<span className="text-[9px]">{m.icon}</span>{s}
		</span>
	);
}

type TxnType = (typeof TYPES)[number] | "All";

export default function TransactionsPage() {
	const [type, setType] = useState<TxnType>("All");
	const [q, setQ] = useState("");
	const [open, setOpen] = useState<(typeof TXNS)[number] | null>(null);

	const list = TXNS.filter(
		(t) =>
			(type === "All" || t.type === type) &&
			(!q || t.id.toUpperCase().includes(q.toUpperCase()) || t.asset.toUpperCase().includes(q.toUpperCase())),
	);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between flex-wrap gap-4">
				<h1 className="text-[22px] lg:text-[32px] font-semibold leading-tight tracking-tight" style={{ color: "var(--c-text)", letterSpacing: "-0.03em" }}>Transactions</h1>
				<div className="flex items-center gap-3">
					<button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-[13.5px] font-medium" style={{ color: "var(--c-text)", border: "1px solid var(--c-line)" }}>
						<Download className="size-4" />Export CSV
					</button>
					<button className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-[13.5px] font-medium" style={{ color: "var(--c-text)", border: "1px solid var(--c-line)" }}>
						<Filter className="size-4" />Filters
					</button>
				</div>
			</div>

			{/* Search + Tabs */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
				<div className="flex items-center w-full sm:flex-1 sm:max-w-[320px] h-9 px-3 rounded-[10px]" style={{ border: "1px solid var(--c-line)", background: "var(--c-surface)" }}>
					<Search className="size-4 shrink-0" style={{ color: "var(--c-text-3)" }} />
					<input className="flex-1 bg-transparent outline-none text-[13.5px] ml-2" style={{ color: "var(--c-text)" }} placeholder="Search by ID, asset…" value={q} onChange={(e) => setQ(e.target.value)} />
				</div>
				<div className="overflow-x-auto -mx-1 px-1">
					<div className="inline-flex p-1 rounded-[10px] gap-0.5" style={{ background: "var(--c-surface-2)", border: "1px solid var(--c-line)" }}>
						{(["All", ...TYPES] as TxnType[]).map((t) => (
							<button key={t} onClick={() => setType(t)}
								className="px-3 py-1.5 rounded-[6px] text-[12.5px] font-medium transition-colors whitespace-nowrap"
								style={type === t ? { background: "var(--c-surface)", color: "var(--c-text)", boxShadow: "var(--sh-1)" } : { color: "var(--c-text-2)" }}>
								{t}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Table (desktop) */}
			<div className="hidden lg:block rounded-[14px] overflow-hidden" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
				<table className="w-full border-collapse text-[13px]">
					<thead>
						<tr>
							{["Type", "Asset", "Amount", "Value (NGN)", "Status", "Counterparty", "Fee", "Date"].map((h, i) => (
								<th key={h} className={`font-medium text-[11.5px] uppercase tracking-[0.05em] px-3.5 py-2.5 ${i === 7 ? "text-right" : "text-left"}`}
									style={{ color: "var(--c-text-3)", borderBottom: "1px solid var(--c-line)", background: "var(--c-surface-2)" }}>{h}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{list.slice(0, 20).map((t) => {
							const isIn = ["Buy", "Receive", "Deposit"].includes(t.type);
							return (
								<tr key={t.id} className="cursor-pointer transition-colors hover:bg-[var(--c-surface-2)]" onClick={() => setOpen(t)}>
									<td className="px-3.5 py-3" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)" }}>
										<div className="flex items-center gap-2">
											{isIn ? <span style={{ color: "var(--c-up)" }}><ArrowDown className="size-4" /></span> : <span style={{ color: "var(--c-down)" }}><ArrowUp className="size-4" /></span>}
											{t.type}
										</div>
									</td>
									<td className="px-3.5 py-3" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)" }}>
										<div className="flex items-center gap-2">
											<AssetLogo symbol={t.asset} size="sm" />{t.asset}
										</div>
									</td>
									<td className="px-3.5 py-3 tabular-nums" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)", fontFamily: "var(--f-mono)", color: "var(--c-text)" }}>
										{t.amount.toFixed(4)}
									</td>
									<td className="px-3.5 py-3 tabular-nums" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)", fontFamily: "var(--f-mono)", color: "var(--c-text)" }}>
										<Num value={formatMoney(t.ngn, "NGN", { decimals: 0 })} />
									</td>
									<td className="px-3.5 py-3" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)" }}>
										<StatusBadge s={t.status} />
									</td>
									<td className="px-3.5 py-3 tabular-nums text-[11px]" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)", fontFamily: "var(--f-mono)", color: "var(--c-text-3)" }}>
										{t.counterparty}
									</td>
									<td className="px-3.5 py-3 tabular-nums" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)", fontFamily: "var(--f-mono)", color: "var(--c-text-2)" }}>
										₦{t.fee.toFixed(2)}
									</td>
									<td className="px-3.5 py-3 text-right tabular-nums" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)", fontFamily: "var(--f-mono)", color: "var(--c-text)" }}>
										{t.date} {t.when}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* Card list (mobile) */}
			<div className="lg:hidden space-y-2">
				{list.slice(0, 20).map((t) => {
					const isIn = ["Buy", "Receive", "Deposit"].includes(t.type);
					return (
						<div key={t.id} className="rounded-[12px] p-3 cursor-pointer active:scale-[0.99] transition-transform" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }} onClick={() => setOpen(t)}>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2.5">
									{isIn ? <span style={{ color: "var(--c-up)" }}><ArrowDown className="size-4" /></span> : <span style={{ color: "var(--c-down)" }}><ArrowUp className="size-4" /></span>}
									<AssetLogo symbol={t.asset} size="sm" />
									<div>
										<div className="text-[13px] font-semibold" style={{ color: "var(--c-text)" }}>{t.type} {t.asset}</div>
										<div className="text-[11px]" style={{ color: "var(--c-text-3)" }}>{t.date} {t.when}</div>
									</div>
								</div>
								<div className="text-right">
									<div className="tabular-nums text-[13px] font-semibold" style={{ fontFamily: "var(--f-mono)", color: "var(--c-text)" }}>{t.amount.toFixed(4)}</div>
									<div className="tabular-nums text-[11px]" style={{ fontFamily: "var(--f-mono)", color: "var(--c-text-2)" }}><Num value={formatMoney(t.ngn, "NGN", { decimals: 0 })} /></div>
								</div>
							</div>
							<div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: "1px solid var(--c-line)" }}>
								<StatusBadge s={t.status} />
								<span className="tabular-nums text-[11px]" style={{ fontFamily: "var(--f-mono)", color: "var(--c-text-3)" }}>Fee: ₦{t.fee.toFixed(2)}</span>
							</div>
						</div>
					);
				})}
			</div>

			{/* Transaction detail modal */}
			{open && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)", padding: 20 }} onClick={() => setOpen(null)}>
					<div
						className="w-full overflow-auto"
						style={{ background: "var(--c-surface)", borderRadius: 20, border: "1px solid var(--c-line)", maxWidth: 480, maxHeight: "90vh", boxShadow: "var(--sh-3)", animation: "modalIn .22s cubic-bezier(.2,.7,.2,1)" }}
						onClick={(e) => e.stopPropagation()}
					>
						{/* Header */}
						<div className="flex items-center justify-between px-4 sm:px-5 py-4" style={{ borderBottom: "1px solid var(--c-line)" }}>
							<span className="text-[15px] font-semibold" style={{ color: "var(--c-text)" }}>Transaction {open.id}</span>
							<button onClick={() => setOpen(null)} className="inline-flex items-center justify-center size-9 rounded-[10px]" style={{ border: "1px solid var(--c-line)", color: "var(--c-text)" }}>
								<X className="size-4" />
							</button>
						</div>
						{/* Body */}
						<div className="p-4 sm:p-5 space-y-3">
							<div className="flex items-center justify-between">
								<AssetLogo symbol={open.asset} size="md" />
								<StatusBadge s={open.status} />
							</div>
							<div className="tabular-nums text-[32px] font-semibold" style={{ fontFamily: "var(--f-mono)", color: "var(--c-text)" }}>
								{open.amount.toFixed(4)} {open.asset}
							</div>
							<div className="tabular-nums text-[13px]" style={{ fontFamily: "var(--f-mono)", color: "var(--c-text-2)" }}>
								{formatMoney(open.ngn, "NGN", { decimals: 0 })}
							</div>
							<div style={{ height: 1, background: "var(--c-line)" }} />
							{[
								["Type", open.type],
								["Network", open.chain],
								["Counterparty", open.counterparty],
								["Fee", `₦${open.fee.toFixed(2)}`],
								["Date", `${open.date} ${open.when}`],
								["Hash", open.hash ?? "—"],
							].map(([k, v]) => (
								<div key={k} className="flex items-center justify-between text-[13px]">
									<span style={{ color: "var(--c-text-3)" }}>{k}</span>
									<span className="tabular-nums" style={{ fontFamily: "var(--f-mono)", maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--c-text)" }}>{v}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			<style jsx global>{`@keyframes modalIn { from { opacity:0; transform:scale(.96); } to { opacity:1; transform:scale(1); } }`}</style>
		</div>
	);
}
