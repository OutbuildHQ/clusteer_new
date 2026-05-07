"use client";

import { useState } from "react";
import { ADMIN_TXNS } from "@/lib/mock-data";
import { formatMoney, relativeTime } from "@/lib/utils";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { ChainBadge } from "@/components/primitives/chain-badge";
import { Num } from "@/components/primitives/num";
import { Search, Download, AlertTriangle, Calendar } from "lucide-react";

type TxTab = "all" | "deposits" | "withdrawals" | "swaps" | "failed";
const TX_TABS: { key: TxTab; label: string }[] = [
	{ key: "all",         label: "All" },
	{ key: "deposits",    label: "Deposits" },
	{ key: "withdrawals", label: "Withdrawals" },
	{ key: "swaps",       label: "Swaps" },
	{ key: "failed",      label: "Failed" },
];

function kindColor(k: string) {
	return k === "deposit" || k === "receive"
		? { bg: "var(--c-up-soft)",   color: "var(--c-up)"   }
		: k === "withdrawal"
		? { bg: "var(--c-down-soft)", color: "var(--c-down)" }
		: k === "buy"
		? { bg: "var(--c-info-soft)", color: "var(--c-info)" }
		: k === "sell"
		? { bg: "var(--c-warn-soft)", color: "var(--c-warn)" }
		:   { bg: "var(--c-surface-3)",  color: "var(--c-text-3)" };
}

function statusColor(s: string) {
	return s === "completed"
		? { bg: "var(--c-up-soft)",   color: "var(--c-up)"   }
		: s === "failed" || s === "cancelled"
		? { bg: "var(--c-down-soft)", color: "var(--c-down)" }
		: s === "pending" || s === "processing"
		? { bg: "var(--c-warn-soft)", color: "var(--c-warn)" }
		:   { bg: "var(--c-surface-3)",  color: "var(--c-text-3)" };
}

function initials(name: string) {
	return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function AdminTxns() {
	const [q,   setQ]   = useState("");
	const [tab, setTab] = useState<TxTab>("all");

	const rows = ADMIN_TXNS.filter((t) => {
		const matchQ = !q || t.id.toLowerCase().includes(q.toLowerCase()) || t.userName.toLowerCase().includes(q.toLowerCase());
		const matchTab =
			tab === "all"         ? true :
			tab === "deposits"    ? t.kind === "deposit" || t.kind === "receive" :
			tab === "withdrawals" ? t.kind === "withdrawal" :
			tab === "swaps"       ? t.kind === "swap" || t.kind === "buy" || t.kind === "sell" :
			tab === "failed"      ? t.status === "failed" || t.status === "cancelled" :
			true;
		return matchQ && matchTab;
	});

	const flaggedCount = ADMIN_TXNS.filter((t) => t.flagged).length;

	return (
		<div className="space-y-5">
			{/* Header */}
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<div>
					<div className="flex items-center gap-2">
						<h1 className="text-[22px] font-semibold tracking-tight text-[var(--c-text)]">Transactions</h1>
						<span
							className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
							style={{ background: "var(--c-up-soft)", color: "var(--c-up)" }}
						>
							<span className="size-[5px] rounded-full animate-pulse bg-[var(--c-up)]" />
							Live
						</span>
					</div>
					<p className="text-[13px] text-[var(--c-text-3)] mt-0.5">
						{flaggedCount > 0 && (
							<span className="text-[var(--c-warn)] mr-1">⚠ {flaggedCount} flagged ·</span>
						)}
						{ADMIN_TXNS.length} transactions loaded
					</p>
				</div>
				<div className="flex items-center gap-2">
					<button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-[var(--c-line)] text-[13px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors">
						<Calendar className="size-3.5 text-[var(--c-text-3)]" />Last 24h
					</button>
					<button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-[var(--c-line)] text-[13px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors">
						<Download className="size-3.5 text-[var(--c-text-3)]" />Export CSV
					</button>
				</div>
			</div>

			{/* Table card */}
			<div className="ds-card overflow-hidden">
				{/* Card header */}
				<div
					className="flex items-center gap-3 px-5 py-3 flex-wrap"
					style={{ borderBottom: "1px solid var(--c-line)" }}
				>
					{/* Type tabs */}
					<div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--c-surface-2)] border border-[var(--c-line)]">
						{TX_TABS.map((t) => (
							<button
								key={t.key}
								onClick={() => setTab(t.key)}
								className="px-3 py-1 rounded-md text-[12px] font-medium transition-colors whitespace-nowrap"
								style={
									tab === t.key
										? { background: "var(--c-surface)", color: "var(--c-text)", boxShadow: "var(--sh-1)" }
										: { color: "var(--c-text-2)" }
								}
							>
								{t.label}
							</button>
						))}
					</div>

					<div className="flex-1" />

					{/* Search */}
					<div className="relative">
						<Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--c-text-3)]" />
						<input
							className="h-8 pl-8 pr-3 rounded-lg border border-[var(--c-line)] bg-[var(--c-surface)] text-[13px] text-[var(--c-text)] outline-none focus:ring-2 focus:ring-[var(--c-lime-500)] focus:border-transparent w-[200px]"
							placeholder="Hash, user, address…"
							value={q}
							onChange={(e) => setQ(e.target.value)}
						/>
					</div>
				</div>

				{/* Table */}
				<table className="w-full text-[13px] border-collapse">
					<thead>
						<tr style={{ borderBottom: "1px solid var(--c-line)" }}>
							{["Time", "Type", "Asset", "Amount", "User", "Status", ""].map((h) => (
								<th
									key={h}
									className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--c-text-3)]"
									style={{ background: "var(--c-surface-2)" }}
								>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{rows.map((t) => {
							const kc = kindColor(t.kind);
							const sc = statusColor(t.status);
							return (
								<tr
									key={t.id}
									className="transition-colors hover:bg-[var(--c-surface-2)]"
									style={{
										borderBottom: "1px solid var(--c-line)",
										background: t.flagged ? "rgba(232,165,58,0.04)" : undefined,
									}}
								>
									{/* Time */}
									<td className="px-4 py-3">
										<div className="text-[13px] text-[var(--c-text)] tabular-nums">
											{new Date(t.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
										</div>
										<div className="text-[11px] text-[var(--c-text-3)] tabular-nums">{relativeTime(t.createdAt)}</div>
									</td>
									{/* Type */}
									<td className="px-4 py-3">
										<span className="flex items-center gap-1.5 text-[12px] font-semibold capitalize" style={{ color: kc.color }}>
											<span className="size-[5px] rounded-full shrink-0" style={{ background: kc.color }} />
											{t.kind}
										</span>
									</td>
									{/* Asset + chain */}
									<td className="px-4 py-3">
										<div className="flex items-center gap-2">
											<AssetLogo symbol={t.asset} size="sm" />
											<span className="font-medium text-[var(--c-text)]">{t.asset}</span>
											<ChainBadge chain={t.chain} />
										</div>
									</td>
									{/* Amount */}
									<td className="px-4 py-3 tabular-nums text-right">
										<Num value={`${t.amount.toLocaleString()} ${t.asset}`} className="font-semibold text-[var(--c-text)]" />
										<div className="text-[11px] text-[var(--c-text-3)]">
											<Num value={formatMoney(t.amountNgn, "NGN", { decimals: 0, compact: true })} />
										</div>
									</td>
									{/* User */}
									<td className="px-4 py-3">
										<div className="flex items-center gap-2">
											<div
												className="size-7 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold"
												style={{ background: "var(--c-onyx-700)", color: "var(--c-cream)" }}
											>
												{initials(t.userName)}
											</div>
											<span className="text-[var(--c-text)]">{t.userName}</span>
										</div>
									</td>
									{/* Status */}
									<td className="px-4 py-3">
										<span
											className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize w-fit"
											style={sc}
										>
											<span className="size-[5px] rounded-full shrink-0" style={{ background: sc.color }} />
											{t.status}
										</span>
										{t.flagged && t.reason && (
											<div className="mt-1 flex items-center gap-1 text-[11px] text-[var(--c-warn)]">
												<AlertTriangle className="size-3 shrink-0" />
												{t.reason}
											</div>
										)}
									</td>
									{/* ID + external link */}
									<td className="px-4 py-3">
										<code className="text-[11px] font-mono text-[var(--c-text-3)]">{t.id}</code>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>

				{/* Footer */}
				<div
					className="flex items-center justify-between px-5 py-3 text-[13px] text-[var(--c-text-3)]"
					style={{ borderTop: "1px solid var(--c-line)" }}
				>
					<span>1–{rows.length} of {ADMIN_TXNS.length}</span>
					<span className="text-[12px]">Updated just now</span>
				</div>
			</div>
		</div>
	);
}
