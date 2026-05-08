"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllTransactions } from "@/lib/api/user/queries";
import { formatMoney } from "@/lib/utils";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Num } from "@/components/primitives/num";
import { Search, Download, Filter, ArrowUp, ArrowDown, X, ChevronLeft, ChevronRight, ArrowLeftRight } from "lucide-react";
import { EmptyState } from "@/components/primitives/empty-state";
import type { ITransaction } from "@/types";

const TYPES = ["Buy", "Sell", "Send", "Receive", "Swap", "Withdraw", "Deposit"] as const;
const ASSETS = ["USDT", "USDC", "NGN"] as const;
const STATUSES = ["Completed", "Pending", "Failed"] as const;

const EXPLORER_MAP: Record<string, { name: string; base: string }> = {
	Tron: { name: "TronScan", base: "https://tronscan.org/#/transaction/" },
	BSC: { name: "BscScan", base: "https://bscscan.com/tx/" },
	Ethereum: { name: "Etherscan", base: "https://etherscan.io/tx/" },
	Solana: { name: "SolScan", base: "https://solscan.io/tx/" },
};

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

interface FilterState {
	status: string;
	asset: string;
	dateFrom: string;
	dateTo: string;
}

const DEFAULT_FILTERS: FilterState = { status: "", asset: "", dateFrom: "", dateTo: "" };

/** Map API ITransaction to the shape the UI rows expect */
function mapTxn(t: ITransaction) {
	const asset = t.currency ?? "USDT";
	const prices: Record<string, number> = { USDT: 1610, USDC: 1608, BTC: 114_000_000, ETH: 5_740_000, SOL: 293_000, BNB: 985_000, NGN: 1 };
	const ngn = Math.floor(t.amount * (prices[asset] ?? 1610));
	return {
		id: t.orderNumber ?? t.id,
		type: t.type,
		asset,
		chain: asset === "USDT" ? "Tron" : asset === "USDC" ? "BSC" : asset,
		amount: t.amount,
		ngn,
		status: t.status,
		counterparty: t.flow ?? "—",
		fee: +((t.amount * (prices[asset] ?? 1610) * 0.001) + 0.5).toFixed(2),
		when: t.dateCreated ? new Date(t.dateCreated).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
		date: t.date ?? (t.dateCreated ? new Date(t.dateCreated).toLocaleDateString([], { month: "short", day: "numeric" }) : "—"),
		hash: null as string | null,
		description: t.description,
		rate: t.rate,
	};
}

const PAGE_SIZE = 15;

export default function TransactionsPage() {
	const [type, setType] = useState<TxnType>("All");
	const [q, setQ] = useState("");
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState<ReturnType<typeof mapTxn> | null>(null);
	const [filterOpen, setFilterOpen] = useState(false);
	const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
	const [pendingFilters, setPendingFilters] = useState<FilterState>(DEFAULT_FILTERS);

	const { data: response, isLoading, isError } = useQuery({
		queryKey: ["transactions", page],
		queryFn: () => getAllTransactions({ page, size: PAGE_SIZE }),
	});

	const transactions = useMemo(() => (response?.data ?? []).map(mapTxn), [response]);
	const totalPages = response?.metadata?.totalPages ?? 1;

	const activeFilterCount = [filters.status, filters.asset, filters.dateFrom, filters.dateTo].filter(Boolean).length;

	const list = useMemo(
		() =>
			transactions.filter(
				(t) =>
					(type === "All" || t.type === type) &&
					(!filters.status || t.status === filters.status) &&
					(!filters.asset || t.asset === filters.asset) &&
					(!q || t.id.toUpperCase().includes(q.toUpperCase()) || t.asset.toUpperCase().includes(q.toUpperCase()) || String(t.amount).includes(q)),
			),
		[transactions, type, q, filters],
	);

	function handleExportCSV() {
		const headers = ["ID", "Type", "Asset", "Amount", "Value (NGN)", "Status", "Fee", "Date"];
		const rows = list.map((t) => [t.id, t.type, t.asset, t.amount, t.ngn, t.status, t.fee, `${t.date} ${t.when}`]);
		const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function openFilter() {
		setPendingFilters(filters);
		setFilterOpen(true);
	}

	function applyFilters() {
		setFilters(pendingFilters);
		setFilterOpen(false);
	}

	function clearFilters() {
		setPendingFilters(DEFAULT_FILTERS);
		setFilters(DEFAULT_FILTERS);
		setFilterOpen(false);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between flex-wrap gap-4">
				<h1 className="text-[22px] lg:text-[32px] font-semibold leading-tight tracking-tight" style={{ color: "var(--c-text)", letterSpacing: "-0.03em" }}>Transactions</h1>
				<div className="flex items-center gap-3">
					<button
						onClick={handleExportCSV}
						className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-[13.5px] font-medium transition-colors hover:bg-[var(--c-surface-2)]"
						style={{ color: "var(--c-text)", border: "1px solid var(--c-line)" }}
					>
						<Download className="size-4" />Export CSV
					</button>
					<button
						onClick={openFilter}
						className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-[13.5px] font-medium transition-colors hover:bg-[var(--c-surface-2)]"
						style={{ color: activeFilterCount > 0 ? "var(--c-lime-500)" : "var(--c-text)", border: `1px solid ${activeFilterCount > 0 ? "var(--c-lime-500)" : "var(--c-line)"}`, background: activeFilterCount > 0 ? "color-mix(in oklab, var(--c-lime-500) 10%, transparent)" : "transparent" }}
					>
						<Filter className="size-4" />
						Filters{activeFilterCount > 0 && ` (${activeFilterCount})`}
					</button>
				</div>
			</div>

			{/* Search + Tabs */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
				<div className="flex items-center w-full sm:flex-1 sm:max-w-[320px] h-9 px-3 rounded-[10px]" style={{ border: "1px solid var(--c-line)", background: "var(--c-surface)" }}>
					<Search className="size-4 shrink-0" style={{ color: "var(--c-text-3)" }} />
					<input className="flex-1 bg-transparent outline-none text-[13.5px] ml-2" style={{ color: "var(--c-text)" }} placeholder="Search by ID, asset, amount…" value={q} onChange={(e) => setQ(e.target.value)} />
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

			{/* Loading state */}
			{isLoading && (
				<div className="space-y-2">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className="rounded-[12px] p-4" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
							<div className="flex items-center gap-3">
								<div className="size-8 rounded-full animate-pulse" style={{ background: "var(--c-surface-2)" }} />
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
					<div className="text-[15px] font-medium" style={{ color: "var(--c-text)" }}>Unable to load transactions</div>
					<div className="text-[13px] mt-1" style={{ color: "var(--c-text-3)" }}>Please check your connection and try again.</div>
				</div>
			)}

			{/* Empty state */}
			{!isLoading && !isError && list.length === 0 && (
				<EmptyState
					icon={ArrowLeftRight}
					variant={q || type !== "All" || activeFilterCount > 0 ? "default" : "branded"}
					title={q || type !== "All" || activeFilterCount > 0 ? "No transactions found" : "Your first trade is one tap away"}
					description={q || type !== "All" || activeFilterCount > 0 ? "Try adjusting your search or filter." : "Buy, sell, or swap stablecoins to get started. Your transaction history will live here."}
					action={q || type !== "All" || activeFilterCount > 0 ? undefined : { label: "Buy USDT", href: "/trade" }}
				/>
			)}

			{/* Table (desktop) */}
			{!isLoading && !isError && list.length > 0 && (
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
							{list.map((t) => {
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
			)}

			{/* Card list (mobile) */}
			{!isLoading && !isError && list.length > 0 && (
				<div className="lg:hidden space-y-2">
					{list.map((t) => {
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

			{/* ── Filter Drawer ── */}
			{filterOpen && (
				<>
					<div className="fixed inset-0 z-[90]" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setFilterOpen(false)} />
					<div
						className="fixed right-0 top-0 bottom-0 z-[100] flex flex-col"
						style={{ width: "min(100vw, 360px)", background: "var(--c-surface)", borderLeft: "1px solid var(--c-line)", animation: "drawerIn .22s cubic-bezier(.2,.7,.2,1)" }}
					>
						{/* Drawer header */}
						<div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--c-line)" }}>
							<span className="text-[15px] font-semibold" style={{ color: "var(--c-text)" }}>Filters</span>
							<button onClick={() => setFilterOpen(false)} className="inline-flex items-center justify-center size-8 rounded-[8px]" style={{ border: "1px solid var(--c-line)", color: "var(--c-text)" }}>
								<X className="size-4" />
							</button>
						</div>

						{/* Drawer body */}
						<div className="flex-1 overflow-auto p-5 space-y-6">
							{/* Status */}
							<div>
								<label className="block text-[12px] font-medium uppercase tracking-[0.05em] mb-2.5" style={{ color: "var(--c-text-3)" }}>Status</label>
								<div className="flex flex-wrap gap-2">
									{["", ...STATUSES].map((s) => (
										<button
											key={s || "all"}
											onClick={() => setPendingFilters((f) => ({ ...f, status: s }))}
											className="h-8 px-3 rounded-[8px] text-[12.5px] font-medium transition-colors"
											style={{
												border: "1px solid var(--c-line)",
												background: pendingFilters.status === s ? "var(--c-onyx-900)" : "transparent",
												color: pendingFilters.status === s ? "var(--c-cream)" : "var(--c-text)",
												borderColor: pendingFilters.status === s ? "var(--c-onyx-900)" : "var(--c-line)",
											}}
										>
											{s || "All"}
										</button>
									))}
								</div>
							</div>

							{/* Asset */}
							<div>
								<label className="block text-[12px] font-medium uppercase tracking-[0.05em] mb-2.5" style={{ color: "var(--c-text-3)" }}>Asset</label>
								<div className="flex flex-wrap gap-2">
									{["", ...ASSETS].map((a) => (
										<button
											key={a || "all"}
											onClick={() => setPendingFilters((f) => ({ ...f, asset: a }))}
											className="h-8 px-3 rounded-[8px] text-[12.5px] font-medium transition-colors"
											style={{
												border: "1px solid var(--c-line)",
												background: pendingFilters.asset === a ? "var(--c-onyx-900)" : "transparent",
												color: pendingFilters.asset === a ? "var(--c-cream)" : "var(--c-text)",
												borderColor: pendingFilters.asset === a ? "var(--c-onyx-900)" : "var(--c-line)",
											}}
										>
											{a || "All"}
										</button>
									))}
								</div>
							</div>

							{/* Date range */}
							<div>
								<label className="block text-[12px] font-medium uppercase tracking-[0.05em] mb-2.5" style={{ color: "var(--c-text-3)" }}>Date range</label>
								<div className="grid grid-cols-2 gap-2">
									<div>
										<label className="block text-[11px] mb-1" style={{ color: "var(--c-text-3)" }}>From</label>
										<input
											type="date"
											value={pendingFilters.dateFrom}
											onChange={(e) => setPendingFilters((f) => ({ ...f, dateFrom: e.target.value }))}
											style={{ width: "100%", height: 36, padding: "0 10px", border: "1px solid var(--c-line)", borderRadius: 8, background: "var(--c-surface)", color: "var(--c-text)", fontSize: 13, outline: "none" }}
										/>
									</div>
									<div>
										<label className="block text-[11px] mb-1" style={{ color: "var(--c-text-3)" }}>To</label>
										<input
											type="date"
											value={pendingFilters.dateTo}
											onChange={(e) => setPendingFilters((f) => ({ ...f, dateTo: e.target.value }))}
											style={{ width: "100%", height: 36, padding: "0 10px", border: "1px solid var(--c-line)", borderRadius: 8, background: "var(--c-surface)", color: "var(--c-text)", fontSize: 13, outline: "none" }}
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Drawer footer */}
						<div className="flex gap-2 p-5" style={{ borderTop: "1px solid var(--c-line)" }}>
							<button
								onClick={clearFilters}
								className="flex-1 h-10 rounded-[10px] text-[13.5px] font-medium transition-colors hover:bg-[var(--c-surface-2)]"
								style={{ border: "1px solid var(--c-line)", color: "var(--c-text)", background: "transparent", cursor: "pointer" }}
							>
								Clear all
							</button>
							<button
								onClick={applyFilters}
								className="flex-1 h-10 rounded-[10px] text-[13.5px] font-semibold"
								style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", cursor: "pointer" }}
							>
								Apply filters
							</button>
						</div>
					</div>
				</>
			)}

			{/* ── Transaction detail modal ── */}
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
						<div className="p-4 sm:p-5 space-y-4">
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

							{/* Status timeline */}
							{(() => {
								const steps = ["Initiated", "Submitted", "Confirming", "Completed"];
								const doneIdx = open.status === "Completed" ? 3 : open.status === "Failed" ? 1 : 2;
								return (
									<div style={{ display: "flex", alignItems: "flex-start", padding: "4px 0" }}>
										{steps.map((s, i) => (
											<div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
												{i > 0 && (
													<div style={{ position: "absolute", left: "-50%", top: 9, width: "100%", height: 2, background: i <= doneIdx ? "var(--c-lime-500)" : "var(--c-line)" }} />
												)}
												<div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${i <= doneIdx ? "var(--c-lime-500)" : "var(--c-line)"}`, background: i <= doneIdx ? "var(--c-lime-500)" : "var(--c-surface)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
													{i <= doneIdx && <span style={{ color: "var(--c-onyx-900)", fontSize: 9, fontWeight: 800, lineHeight: 1 }}>✓</span>}
												</div>
												<div style={{ fontSize: 10, marginTop: 5, color: i <= doneIdx ? "var(--c-text)" : "var(--c-text-3)", textAlign: "center", whiteSpace: "nowrap" }}>{s}</div>
											</div>
										))}
									</div>
								);
							})()}

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

							{/* Explorer link */}
							{open.asset !== "NGN" && (() => {
								const ex = EXPLORER_MAP[open.chain];
								if (!ex) return null;
								const href = open.hash ? `${ex.base}${open.hash}` : null;
								return (
									<a
										href={href ?? "#"}
										target={href ? "_blank" : undefined}
										rel="noopener noreferrer"
										onClick={href ? undefined : (e) => e.preventDefault()}
										className="flex items-center justify-center gap-1.5 h-9 rounded-[10px] text-[13px] font-medium transition-colors hover:bg-[var(--c-surface-2)]"
										style={{ border: "1px solid var(--c-line)", color: href ? "var(--c-text)" : "var(--c-text-3)", textDecoration: "none" }}
									>
										<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
										View on {ex.name}
									</a>
								);
							})()}
						</div>

						{/* Footer actions */}
						<div className="px-4 sm:px-5 pb-5 pt-1 flex gap-2">
							<button
								onClick={() => {
									const text = `Clusteer Transaction\nID: ${open.id}\nType: ${open.type} ${open.asset}\nAmount: ${open.amount.toFixed(4)} ${open.asset} (${formatMoney(open.ngn, "NGN", { decimals: 0 })})\nStatus: ${open.status}\nDate: ${open.date} ${open.when}`;
									if (navigator.share) {
										navigator.share({ title: `Clusteer receipt — ${open.id}`, text });
									} else {
										navigator.clipboard.writeText(text);
									}
								}}
								className="flex items-center justify-center gap-1.5 flex-1 h-9 rounded-[10px] text-[13px] font-medium transition-colors hover:bg-[var(--c-surface-2)]"
								style={{ border: "1px solid var(--c-line)", color: "var(--c-text)", background: "transparent", cursor: "pointer" }}
							>
								<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
								Share receipt
							</button>
							<button
								onClick={() => window.open(`mailto:support@clusteer.io?subject=Issue with transaction ${open.id}&body=Transaction ID: ${open.id}%0APlease describe the issue:`, "_blank")}
								className="flex items-center justify-center gap-1.5 flex-1 h-9 rounded-[10px] text-[13px] font-medium transition-colors hover:bg-[var(--c-down-soft)]"
								style={{ border: "1px solid var(--c-line)", color: "var(--c-down)", background: "transparent", cursor: "pointer" }}
							>
								<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
								Report issue
							</button>
						</div>
					</div>
				</div>
			)}

			<style jsx global>{`
				@keyframes modalIn { from { opacity:0; transform:scale(.96); } to { opacity:1; transform:scale(1); } }
				@keyframes drawerIn { from { transform:translateX(100%); } to { transform:translateX(0); } }
			`}</style>
		</div>
	);
}
