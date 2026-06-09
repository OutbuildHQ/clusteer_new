"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllTransactions } from "@/lib/api/user/queries";
import { formatMoney } from "@/lib/utils";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Num } from "@/components/primitives/num";
import { EmptyState } from "@/components/primitives/empty-state";
import { Search, Download, ArrowUp, ArrowDown, X, ChevronLeft, ChevronRight, ArrowLeftRight } from "lucide-react";
import type { ITransaction } from "@/types";

const EXPLORER_MAP: Record<string, { name: string; base: string }> = {
	Tron: { name: "TronScan", base: "https://tronscan.org/#/transaction/" },
	BSC: { name: "BscScan", base: "https://bscscan.com/tx/" },
	Ethereum: { name: "Etherscan", base: "https://etherscan.io/tx/" },
	Solana: { name: "SolScan", base: "https://solscan.io/tx/" },
};

const STATUS_CLASSES: Record<string, string> = {
	Completed: "bg-up-soft text-up",
	Pending: "bg-warn-soft text-warn",
	Failed: "bg-down-soft text-down",
};
const STATUS_ICONS: Record<string, string> = { Completed: "✓", Pending: "◐", Failed: "✕" };

function StatusBadge({ s }: { s: string }) {
	const cls = STATUS_CLASSES[s] ?? STATUS_CLASSES.Pending;
	const icon = STATUS_ICONS[s] ?? "◐";
	return (
		<span className={`inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full text-[11.5px] font-medium ${cls}`}>
			<span className="text-[9px]">{icon}</span>{s}
		</span>
	);
}

function mapTxn(t: ITransaction, ngnRate: number) {
	const asset = t.currency ?? "USDT";
	const prices: Record<string, number> = { USDT: ngnRate, USDC: ngnRate, NGN: 1 };
	const unitPrice = prices[asset] ?? ngnRate;
	const ngn = Math.floor(t.amount * unitPrice);
	return {
		id: t.orderNumber ?? t.id,
		type: t.type,
		side: (t.type === "Buy" || t.type === "Sell") ? t.type.toLowerCase() as "buy" | "sell" : null,
		asset,
		chain: asset === "USDT" ? "Tron" : asset === "USDC" ? "BSC" : asset,
		amount: t.amount,
		ngn,
		status: t.status,
		counterparty: t.flow ?? "—",
		fee: +((t.amount * unitPrice * 0.001) + 0.5).toFixed(2),
		when: t.dateCreated ? new Date(t.dateCreated).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
		date: t.date ?? (t.dateCreated ? new Date(t.dateCreated).toLocaleDateString([], { month: "short", day: "numeric" }) : "—"),
		rawDate: t.dateCreated ?? t.date ?? "",
		hash: null as string | null,
		description: t.description,
		rate: t.rate,
	};
}

const PAGE_SIZE = 15;
type SideFilter = "All" | "buy" | "sell";

export default function TransactionsPage() {
	const [side, setSide] = useState<SideFilter>("All");
	const [q, setQ] = useState("");
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState<ReturnType<typeof mapTxn> | null>(null);

	const { data: response, isLoading, isError } = useQuery({
		queryKey: ["transactions", page],
		queryFn: () => getAllTransactions({ page, size: PAGE_SIZE }),
	});

	const { data: rateData } = useQuery({
		queryKey: ["exchange-rate", "NGN"],
		queryFn: async () => {
			const res = await fetch("/api/system/exchange-rate?targetCurrency=NGN&type=sell");
			if (!res.ok) throw new Error("Rate unavailable");
			return res.json() as Promise<{ buyRate: number; sellRate: number; rate: number }>;
		},
		staleTime: 5 * 60 * 1000,
		retry: false,
	});
	const liveRate = rateData?.sellRate ?? 1_610;

	const transactions = useMemo(() => (response?.data ?? []).map((t) => mapTxn(t, liveRate)), [response, liveRate]);
	const totalPages = response?.metadata?.totalPages ?? 1;

	const list = useMemo(
		() =>
			transactions.filter(
				(t) =>
					(side === "All" || t.side === side) &&
					(!q || t.id.toUpperCase().includes(q.toUpperCase()) || t.asset.toUpperCase().includes(q.toUpperCase()) || String(t.amount).includes(q)),
			),
		[transactions, side, q],
	);

	function handleExportCSV() {
		const headers = ["Order", "Type", "Network", "Amount", "Value (NGN)", "Status", "Date"];
		const rows = list.map((t) => [t.id, t.type, t.chain, `${t.amount} ${t.asset}`, t.ngn, t.status, `${t.date} ${t.when}`]);
		const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `order-history-${new Date().toISOString().split("T")[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Header */}
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<div>
					<h1 className="text-[32px] font-semibold text-ds-text tracking-[-0.03em] m-0 font-display">
						Order history
					</h1>
					<p className="mt-1 text-[13px] text-ds-text-3">
						Every buy and sell order on your account.
					</p>
				</div>
				<button
					onClick={handleExportCSV}
					className="inline-flex items-center gap-2 h-[36px] px-3.5 rounded-[10px] border border-ds-line bg-transparent text-ds-text text-[13.5px] font-medium cursor-pointer"
				>
					<Download size={14} />Export CSV
				</button>
			</div>

			{/* Search + Tabs */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
				<div className="flex items-center flex-1 sm:max-w-[320px] h-[36px] px-3 rounded-[10px] border border-ds-line bg-ds-surface">
					<Search size={16} className="shrink-0 text-ds-text-3" />
					<input
						className="flex-1 bg-transparent border-none outline-none text-[13.5px] text-ds-text ml-2 h-[34px]"
						placeholder="Search by order ID, asset…"
						value={q}
						onChange={(e) => setQ(e.target.value)}
					/>
				</div>
				<div className="inline-flex p-1 bg-ds-surface-2 rounded-[10px] border border-ds-line gap-0.5">
					{(["All", "buy", "sell"] as SideFilter[]).map((t) => (
						<button
							key={t}
							onClick={() => { setSide(t); setPage(1); }}
							className={`px-3 py-1.5 rounded-[8px] text-[12.5px] font-medium cursor-pointer border-none font-sans capitalize ${
								side === t
									? "bg-ds-surface text-ds-text shadow-[var(--sh-1)]"
									: "bg-transparent text-ds-text-2"
							}`}
						>
							{t}
						</button>
					))}
				</div>
			</div>

			{/* Loading */}
			{isLoading && (
				<div className="flex justify-center pt-20">
					<div className="w-8 h-8 border-[3px] border-ds-line border-t-lime-500 rounded-full animate-spin" />
				</div>
			)}

			{/* Error */}
			{isError && !isLoading && (
				<div className="bg-ds-surface border border-ds-line rounded-[14px] p-8 text-center">
					<div className="text-[15px] font-medium text-ds-text">Unable to load transactions</div>
					<div className="text-[13px] mt-1 text-ds-text-3">Please check your connection and try again.</div>
				</div>
			)}

			{/* Empty */}
			{!isLoading && !isError && list.length === 0 && (
				<EmptyState
					icon={ArrowLeftRight}
					variant={q || side !== "All" ? "default" : "branded"}
					title={q || side !== "All" ? "No transactions found" : "Your first trade is one tap away"}
					description={q || side !== "All" ? "Try adjusting your search or filter." : "Buy, sell, or swap stablecoins to get started. Your transaction history will live here."}
					action={q || side !== "All" ? undefined : { label: "Buy USDT", href: "/trade" }}
				/>
			)}

			{/* Table (desktop) */}
			{!isLoading && !isError && list.length > 0 && (
				<div className="hidden lg:block bg-ds-surface border border-ds-line rounded-[14px] overflow-hidden">
					<table className="w-full border-collapse text-[13px]">
						<thead>
							<tr>
								{["Order", "Type", "Network", "Amount", "Value (NGN)", "Status"].map((h, i) => (
									<th
										key={h}
										className={`${i === 5 ? "text-right" : "text-left"} font-medium text-ds-text-3 text-[11.5px] uppercase tracking-[0.05em] px-3.5 py-2.5 border-b border-ds-line bg-ds-surface-2`}
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{list.map((t) => {
								const isIn = t.side === "buy" || ["Receive", "Deposit"].includes(t.type);
								return (
									<tr key={t.id} className="cursor-pointer hover:bg-ds-surface-2" onClick={() => setOpen(t)}>
										<td className="px-3.5 py-3 border-b border-ds-line font-mono text-ds-text-3 text-[11px]">
											{t.id}
										</td>
										<td className="px-3.5 py-3 border-b border-ds-line">
											<div className="flex items-center gap-2 capitalize">
												{isIn
													? <span className="text-up"><ArrowDown size={14} /></span>
													: <span className="text-down"><ArrowUp size={14} /></span>
												}
												{t.type.toLowerCase()}
											</div>
										</td>
										<td className="px-3.5 py-3 border-b border-ds-line">
											{t.chain}
										</td>
										<td className="px-3.5 py-3 border-b border-ds-line">
											<div className="flex items-center gap-2">
												<AssetLogo symbol={t.asset} size="sm" />
												{t.amount.toFixed(4)} {t.asset}
											</div>
										</td>
										<td className="px-3.5 py-3 border-b border-ds-line font-mono tabular-nums text-ds-text">
											<Num value={formatMoney(t.ngn, "NGN", { decimals: 0 })} />
										</td>
										<td className="px-3.5 py-3 border-b border-ds-line text-right">
											<StatusBadge s={t.status} />
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
				<div className="lg:hidden flex flex-col gap-2">
					{list.map((t) => {
						const isIn = t.side === "buy" || ["Receive", "Deposit"].includes(t.type);
						return (
							<div key={t.id} className="bg-ds-surface border border-ds-line rounded-[12px] p-3 cursor-pointer active:scale-[0.99] transition-transform" onClick={() => setOpen(t)}>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2.5">
										{isIn
											? <span className="text-up"><ArrowDown size={14} /></span>
											: <span className="text-down"><ArrowUp size={14} /></span>
										}
										<AssetLogo symbol={t.asset} size="sm" />
										<div>
											<div className="text-[13px] font-semibold text-ds-text capitalize">{t.type} {t.asset}</div>
											<div className="text-[11px] text-ds-text-3">{t.date} {t.when}</div>
										</div>
									</div>
									<div className="text-right">
										<div className="tabular-nums text-[13px] font-semibold font-mono text-ds-text">{t.amount.toFixed(4)}</div>
										<div className="tabular-nums text-[11px] font-mono text-ds-text-2"><Num value={formatMoney(t.ngn, "NGN", { decimals: 0 })} /></div>
									</div>
								</div>
								<div className="flex items-center justify-between mt-2 pt-2 border-t border-ds-line">
									<StatusBadge s={t.status} />
									<span className="tabular-nums text-[11px] font-mono text-ds-text-3">Fee: ₦{t.fee.toFixed(2)}</span>
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
						className="inline-flex items-center justify-center size-9 rounded-[10px] border border-ds-line text-ds-text disabled:opacity-40 cursor-pointer bg-transparent"
					>
						<ChevronLeft size={16} />
					</button>
					<span className="text-[13px] tabular-nums px-3 font-mono text-ds-text-2">
						Page {page} of {totalPages}
					</span>
					<button
						onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
						disabled={page >= totalPages}
						className="inline-flex items-center justify-center size-9 rounded-[10px] border border-ds-line text-ds-text disabled:opacity-40 cursor-pointer bg-transparent"
					>
						<ChevronRight size={16} />
					</button>
				</div>
			)}

			{/* Transaction detail modal */}
			{open && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-5" onClick={() => setOpen(null)}>
					<div
						className="w-full max-w-[480px] max-h-[90vh] overflow-auto bg-ds-surface rounded-[20px] border border-ds-line shadow-[var(--sh-3)] animate-[modalIn_.22s_cubic-bezier(.2,.7,.2,1)]"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Header */}
						<div className="flex items-center justify-between px-5 py-4 border-b border-ds-line">
							<span className="text-[15px] font-semibold text-ds-text">Transaction {open.id}</span>
							<button onClick={() => setOpen(null)} className="inline-flex items-center justify-center size-9 rounded-[10px] border border-ds-line text-ds-text bg-transparent cursor-pointer">
								<X size={16} />
							</button>
						</div>
						{/* Body */}
						<div className="p-5 flex flex-col gap-4">
							<div className="flex items-center justify-between">
								<AssetLogo symbol={open.asset} size="md" />
								<StatusBadge s={open.status} />
							</div>
							<div className="tabular-nums text-[32px] font-semibold font-mono text-ds-text">
								{open.amount.toFixed(4)} {open.asset}
							</div>
							<div className="tabular-nums text-[13px] font-mono text-ds-text-2">
								{formatMoney(open.ngn, "NGN", { decimals: 0 })}
							</div>
							<div className="h-px bg-ds-line" />

							{/* Status timeline */}
							{(() => {
								const steps = ["Initiated", "Submitted", "Confirming", "Completed"];
								const doneIdx = open.status === "Completed" ? 3 : open.status === "Failed" ? 1 : 2;
								return (
									<div className="flex items-start py-1">
										{steps.map((s, i) => (
											<div key={s} className="flex-1 flex flex-col items-center relative">
												{i > 0 && (
													<div className={`absolute left-[-50%] top-[9px] w-full h-0.5 ${i <= doneIdx ? "bg-lime-500" : "bg-ds-line"}`} />
												)}
												<div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center relative z-[1] ${
													i <= doneIdx
														? "border-lime-500 bg-lime-500"
														: "border-ds-line bg-ds-surface"
												}`}>
													{i <= doneIdx && <span className="text-onyx-900 text-[9px] font-extrabold leading-none">✓</span>}
												</div>
												<div className={`text-[10px] mt-1.5 text-center whitespace-nowrap ${i <= doneIdx ? "text-ds-text" : "text-ds-text-3"}`}>{s}</div>
											</div>
										))}
									</div>
								);
							})()}

							<div className="h-px bg-ds-line" />

							{[
								["Type", open.type],
								["Network", open.chain],
								["Counterparty", open.counterparty],
								["Fee", `₦${open.fee.toFixed(2)}`],
								["Date", `${open.date} ${open.when}`],
								["Hash", open.hash ?? "—"],
							].map(([k, v]) => (
								<div key={k} className="flex items-center justify-between text-[13px]">
									<span className="text-ds-text-3">{k}</span>
									<span className="tabular-nums font-mono max-w-[240px] overflow-hidden text-ellipsis whitespace-nowrap text-ds-text">{v}</span>
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
										className={`flex items-center justify-center gap-1.5 h-9 rounded-[10px] text-[13px] font-medium border border-ds-line no-underline hover:bg-ds-surface-2 ${href ? "text-ds-text" : "text-ds-text-3"}`}
									>
										<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
										View on {ex.name}
									</a>
								);
							})()}
						</div>

						{/* Footer actions */}
						<div className="px-5 pb-5 pt-1 flex gap-2">
							<button
								onClick={() => {
									const text = `Clusteer Transaction\nID: ${open.id}\nType: ${open.type} ${open.asset}\nAmount: ${open.amount.toFixed(4)} ${open.asset} (${formatMoney(open.ngn, "NGN", { decimals: 0 })})\nStatus: ${open.status}\nDate: ${open.date} ${open.when}`;
									if (navigator.share) {
										navigator.share({ title: `Clusteer receipt — ${open.id}`, text });
									} else {
										navigator.clipboard.writeText(text);
									}
								}}
								className="flex items-center justify-center gap-1.5 flex-1 h-9 rounded-[10px] text-[13px] font-medium border border-ds-line text-ds-text bg-transparent cursor-pointer hover:bg-ds-surface-2"
							>
								<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
								Share receipt
							</button>
							<button
								onClick={() => window.open(`mailto:support@clusteer.io?subject=Issue with transaction ${open.id}&body=Transaction ID: ${open.id}%0APlease describe the issue:`, "_blank")}
								className="flex items-center justify-center gap-1.5 flex-1 h-9 rounded-[10px] text-[13px] font-medium border border-ds-line text-down bg-transparent cursor-pointer hover:bg-down-soft"
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
			`}</style>
		</div>
	);
}
