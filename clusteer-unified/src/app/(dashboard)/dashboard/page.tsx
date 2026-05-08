"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUserWallet } from "@/lib/api/wallet/queries";
import { getAllTransactions } from "@/lib/api/user/queries";
import { getUserInfo } from "@/lib/api/user/queries";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Sparkline } from "@/components/primitives/sparkline";
import { StaggerContainer, StaggerItem } from "@/components/primitives/motion";
import { ArrowDown, ArrowUp, Plus, TrendingUp } from "lucide-react";
import type { Wallet } from "@/store/wallet";
import type { ITransaction } from "@/types";

/* ── Constants ── */
const ASSET_META: Record<string, { name: string; chain: string; color: string; rateNgn: number }> = {
	USDT: { name: "Tether USD", chain: "Tron", color: "var(--c-usdt)", rateNgn: 1_570 },
	USDC: { name: "USD Coin", chain: "BSC", color: "var(--c-usdc)", rateNgn: 1_568 },
	NGN:  { name: "Naira", chain: "Bank", color: "var(--c-lime-500)", rateNgn: 1 },
};

/* ── Helpers ── */
function fmt(n: number) { return "₦" + Math.round(n).toLocaleString("en-NG"); }
function fmtNum(n: number, d = 2) { return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }); }
function fmtPct(n: number) { return (n > 0 ? "+" : "") + n.toFixed(2) + "%"; }
function fmtShort(n: number) { return n >= 1e9 ? (n / 1e9).toFixed(2) + "B" : n >= 1e6 ? (n / 1e6).toFixed(2) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : n.toFixed(0); }

/** Convert a Wallet to display-friendly shape */
function walletToAsset(w: Wallet) {
	const meta = ASSET_META[w.currency] ?? { name: w.name, chain: "", color: "var(--c-text-3)", rateNgn: 1 };
	const balNgn = w.type === "FIAT" ? w.balance : w.balance * meta.rateNgn;
	return { sym: w.currency, name: meta.name, chain: meta.chain, price: w.type === "FIAT" ? 1 / meta.rateNgn : 1, change: 0, bal: w.balance, balNgn, color: meta.color };
}

/** Format a transaction date string */
function txDate(dateStr?: string) {
	if (!dateStr) return "";
	const d = new Date(dateStr);
	if (isNaN(d.getTime())) return dateStr;
	const now = new Date();
	const isToday = d.toDateString() === now.toDateString();
	const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
	const isYesterday = d.toDateString() === yesterday.toDateString();
	const label = isToday ? "Today" : isYesterday ? "Yesterday" : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
	const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
	return `${label} · ${time}`;
}

/* ── Loading skeleton ── */
function Skeleton({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
	return <div className={`animate-pulse rounded-[10px] ${className}`} style={{ background: "var(--c-surface-3)", ...style }} />;
}

/* ── Donut chart SVG ── */
function Donut({ slices, size = 150 }: { slices: { value: number; color: string; label: string }[]; size?: number }) {
	const total = slices.reduce((s, sl) => s + sl.value, 0);
	const r = size * 0.38;
	const cx = size / 2;
	const cy = size / 2;
	const circ = 2 * Math.PI * r;
	let cum = 0;
	return (
		<svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
			<circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--c-surface-3)" strokeWidth={18} />
			{slices.map((sl) => {
				const pct = total > 0 ? sl.value / total : 0;
				const dash = Math.max(0, pct * circ - 3);
				const offset = circ / 4 - cum * circ;
				cum += pct;
				return <circle key={sl.label} cx={cx} cy={cy} r={r} fill="none" stroke={sl.color} strokeWidth={18} strokeDasharray={`${dash} ${circ}`} strokeDashoffset={offset} strokeLinecap="butt" />;
			})}
			<text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fill="var(--c-text-3)">Assets</text>
			<text x={cx} y={cy + 12} textAnchor="middle" fontSize="18" fontWeight="600" fill="var(--c-text)" style={{ fontFamily: "var(--f-display)" }}>{slices.length}</text>
		</svg>
	);
}

export default function DashboardPage() {
	/* ── Queries ── */
	const { data: walletData, isLoading: walletLoading } = useQuery({
		queryKey: ["wallet"],
		queryFn: getUserWallet,
	});

	const { data: txData, isLoading: txLoading } = useQuery({
		queryKey: ["transactions", 1],
		queryFn: () => getAllTransactions({ page: 1, size: 5 }),
	});

	// Prefetch user profile for cache – data used by header/sidebar
	useQuery({ queryKey: ["user-profile"], queryFn: getUserInfo });

	/* ── Derived data ── */
	const assets = (walletData?.walletAssets ?? []).map(walletToAsset);
	const total = assets.reduce((a, b) => a + b.balNgn, 0);
	const top = [...assets].sort((a, b) => b.balNgn - a.balNgn).slice(0, 4);
	const slices = assets.map((a) => ({ value: a.balNgn, color: a.color, label: a.sym }));

	const recent: ITransaction[] = txData?.data ?? [];

	return (
		<div className="flex flex-col gap-4 lg:gap-6 px-4 lg:px-0">

			{/* ═══ Row 1: Hero balance + Allocation donut ═══ */}
			<div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
				{/* Hero balance card */}
				<div className="rounded-[20px] p-[22px] lg:p-7 relative overflow-hidden" style={{ background: "var(--c-onyx-900)", color: "var(--c-cream)" }}>
					{/* Lime glow */}
					<div style={{ position: "absolute", right: -40, top: -40, width: 240, height: 240, borderRadius: "50%", background: "var(--c-lime-500)", opacity: 0.15 }} />
					{/* Label */}
					<div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.08em" }}>
						<span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--c-lime-500)", display: "inline-block" }} />
						Total balance
					</div>
					{/* Amount */}
					{walletLoading ? (
						<Skeleton className="mt-2.5 w-64" style={{ height: 56, background: "rgba(255,255,255,0.1)" }} />
					) : (
						<div className="text-[34px] lg:text-[56px] font-semibold leading-none mt-2.5 tabular-nums" style={{ fontFamily: "var(--f-display)", letterSpacing: "-0.025em" }}>
							{fmt(total)}
						</div>
					)}
					{/* Change + asset count */}
					<div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, fontSize: 13 }}>
						{!walletLoading && (
							<>
								<span style={{ color: "rgba(244,241,234,0.5)" }}>Across {assets.length} asset{assets.length !== 1 ? "s" : ""}</span>
								<span style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 22, padding: "0 8px", borderRadius: 999, fontSize: 11.5, fontWeight: 600, background: "rgba(201,245,66,0.12)", color: "var(--c-lime-400)" }}>
									<TrendingUp className="size-3" />
									+2.4% (24h)
								</span>
							</>
						)}
					</div>
					{/* Action buttons */}
					<div className="grid grid-cols-4 lg:flex gap-2 lg:gap-2.5 mt-[18px] lg:mt-6">
						<Link href="/trade" className="col-span-4 lg:col-span-1 inline-flex items-center justify-center gap-2 h-9 px-3.5 rounded-[10px] text-[12px] lg:text-[13.5px] font-medium border-none" style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}>
							<Plus className="size-4" />Buy crypto
						</Link>
						{[{ label: "Sell", href: "/trade" }, { label: "Send", href: "/send" }, { label: "Receive", href: "/receive" }, { label: "Withdraw", href: "/withdraw" }].map((a) => (
							<Link key={a.label} href={a.href} className="inline-flex items-center justify-center h-9 px-3 lg:px-3.5 rounded-[10px] text-[12px] lg:text-[13.5px] font-medium" style={{ background: "transparent", color: "var(--c-cream)", border: "1px solid rgba(255,255,255,0.2)" }}>
								{a.label}
							</Link>
						))}
					</div>
				</div>

				{/* Allocation card */}
				<div className="rounded-[14px] p-[var(--pad)]" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
					<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--c-line)", paddingBottom: 16, marginBottom: 16 }}>
						<h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--c-text)" }}>Allocation</h3>
					</div>
					{walletLoading ? (
						<div className="flex items-center gap-4">
							<Skeleton className="shrink-0" style={{ width: 150, height: 150, borderRadius: "50%" }} />
							<div className="flex flex-col gap-3 flex-1">
								{[1, 2, 3].map(i => <Skeleton key={i} style={{ height: 16 }} />)}
							</div>
						</div>
					) : assets.length === 0 ? (
						<div className="py-8 text-center">
							<p className="text-[13px]" style={{ color: "var(--c-text-3)" }}>No assets yet</p>
						</div>
					) : (
						<div className="flex items-center gap-3 lg:gap-[18px]">
							<div className="shrink-0">
								<Donut slices={slices} size={150} />
							</div>
							<div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
								{assets.slice(0, 5).map((a) => (
									<div key={a.sym} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12.5 }}>
										<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
											<span style={{ width: 6, height: 6, borderRadius: 999, background: a.color, display: "inline-block" }} />
											{a.sym}
										</div>
										<span style={{ fontFamily: "var(--f-mono)", color: "var(--c-text-2)", fontVariantNumeric: "tabular-nums" }}>
											{total > 0 ? ((a.balNgn / total) * 100).toFixed(1) : "0.0"}%
										</span>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* ═══ Quick stats ═══ */}
			<div className="flex flex-wrap gap-2">
				{[
					{ label: "24h Volume", value: "₦4.2M" },
					{ label: "Total Trades", value: recent.length > 0 ? String(recent.length) + "+ txns" : "0 txns" },
					{ label: "Pending", value: String(recent.filter(t => t.status === "Pending").length) },
					{ label: "Avg Rate", value: "₦1,570/USDT" },
				].map((s) => (
					<div key={s.label} style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 34, padding: "0 14px", borderRadius: 999, border: "1px solid var(--c-line)", background: "var(--c-surface-2)", fontSize: 12.5, whiteSpace: "nowrap" }}>
						<span style={{ color: "var(--c-text-3)" }}>{s.label}</span>
						<span style={{ fontWeight: 600, color: "var(--c-text)", fontFamily: "var(--f-mono)", fontVariantNumeric: "tabular-nums" }}>{s.value}</span>
					</div>
				))}
			</div>

			{/* ═══ Row 2: Top holdings + Recent activity ═══ */}
			<div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
				{/* Top holdings */}
				<div className="rounded-[14px] overflow-hidden" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
					<div style={{ padding: "16px 20px", borderBottom: "1px solid var(--c-line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--c-text)" }}>Top holdings</h3>
					</div>
					{walletLoading ? (
						<div className="p-4 space-y-3">
							{[1, 2, 3].map(i => <Skeleton key={i} style={{ height: 44 }} />)}
						</div>
					) : top.length === 0 ? (
						<div className="py-12 text-center">
							<p className="text-[13px]" style={{ color: "var(--c-text-3)" }}>No holdings yet</p>
						</div>
					) : (
						<>
						{/* Desktop table */}
						<table className="hidden lg:table w-full border-collapse text-[13px]">
							<thead>
								<tr>
									{["Asset", "Holdings", "Value"].map((h, i) => (
										<th key={h} style={{ textAlign: i === 2 ? "right" : "left", fontWeight: 500, color: "var(--c-text-3)", fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.05em", padding: "10px 14px", borderBottom: "1px solid var(--c-line)", background: "var(--c-surface-2)" }}>
											{h}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{top.map((a) => (
									<tr key={a.sym} style={{ cursor: "pointer" }} className="hover:bg-[var(--c-surface-2)] transition-colors">
										<td style={{ padding: "12px 14px", borderBottom: "1px solid var(--c-line)", height: "var(--row-h)" }}>
											<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
												<AssetLogo symbol={a.sym} />
												<div>
													<div style={{ fontWeight: 600, fontSize: 13, color: "var(--c-text)" }}>{a.name}</div>
													<div style={{ fontSize: 11, color: "var(--c-text-3)" }}>{a.chain}</div>
												</div>
											</div>
										</td>
										<td style={{ padding: "12px 14px", borderBottom: "1px solid var(--c-line)", height: "var(--row-h)", fontFamily: "var(--f-mono)", fontVariantNumeric: "tabular-nums", color: "var(--c-text)" }}>
											{fmtNum(a.bal, 4)} {a.sym}
										</td>
										<td style={{ padding: "12px 14px", borderBottom: "1px solid var(--c-line)", height: "var(--row-h)", textAlign: "right", fontWeight: 600, fontFamily: "var(--f-mono)", fontVariantNumeric: "tabular-nums", color: "var(--c-text)" }}>
											{fmt(a.balNgn)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
						{/* Mobile stacked cards */}
						<div className="lg:hidden">
							{top.map((a, i) => (
								<div key={a.sym} className="flex items-center justify-between px-3.5 py-3" style={{ borderBottom: i < top.length - 1 ? "1px solid var(--c-line)" : "none" }}>
									<div className="flex items-center gap-2.5">
										<AssetLogo symbol={a.sym} />
										<div>
											<div className="text-[13px] font-semibold" style={{ color: "var(--c-text)" }}>{a.name}</div>
											<div className="text-[11px]" style={{ color: "var(--c-text-3)" }}>{fmtNum(a.bal, 4)} {a.sym}</div>
										</div>
									</div>
									<div className="text-right">
										<div className="text-[13px] font-semibold tabular-nums" style={{ fontFamily: "var(--f-mono)", color: "var(--c-text)" }}>{fmt(a.balNgn)}</div>
									</div>
								</div>
							))}
						</div>
						</>
					)}
				</div>

				{/* Recent activity */}
				<div className="rounded-[14px] overflow-hidden" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
					<div style={{ padding: "16px 20px", borderBottom: "1px solid var(--c-line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--c-text)" }}>Recent activity</h3>
						<Link href="/transaction-history" style={{ fontSize: 12.5, fontWeight: 500, color: "var(--c-lime-600)", cursor: "pointer" }}>View all →</Link>
					</div>
					{txLoading ? (
						<div className="p-4 space-y-3">
							{[1, 2, 3, 4, 5].map(i => <Skeleton key={i} style={{ height: 44 }} />)}
						</div>
					) : recent.length === 0 ? (
						<div className="py-12 text-center">
							<p className="text-[13px]" style={{ color: "var(--c-text-3)" }}>No recent transactions</p>
						</div>
					) : (
						<StaggerContainer style={{ display: "flex", flexDirection: "column" }}>
							{recent.map((t) => {
								const isIn = ["Buy", "Receive", "Deposit", "buy", "receive", "deposit"].includes(t.type);
								const currency = t.currency ?? "USDT";
								return (
									<StaggerItem key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: "1px solid var(--c-line)" }}>
										<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
											<div style={{ width: 32, height: 32, borderRadius: 10, background: "var(--c-surface-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
												{isIn ? <ArrowDown className="size-4" style={{ color: "var(--c-up)" }} /> : <ArrowUp className="size-4" style={{ color: "var(--c-down)" }} />}
											</div>
											<div>
												<div style={{ fontWeight: 600, fontSize: 13, color: "var(--c-text)" }}>{t.type} {currency}</div>
												<div style={{ fontSize: 11, color: "var(--c-text-3)" }}>{txDate(t.date || t.dateCreated)}</div>
											</div>
										</div>
										<div style={{ textAlign: "right" }}>
											<div style={{ fontWeight: 600, fontFamily: "var(--f-mono)", fontVariantNumeric: "tabular-nums", fontSize: 13, color: "var(--c-text)" }}>
												{fmtNum(t.amount, 4)} {currency}
											</div>
											{t.rate && (
												<div style={{ fontSize: 11, fontFamily: "var(--f-mono)", fontVariantNumeric: "tabular-nums", color: "var(--c-text-3)" }}>
													{fmt(t.amount * t.rate)}
												</div>
											)}
										</div>
									</StaggerItem>
								);
							})}
						</StaggerContainer>
					)}
				</div>
			</div>

			{/* ═══ Row 3: Markets (kept as-is for Phase 6) ═══ */}
			<div className="rounded-[14px] overflow-hidden" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
				<div className="flex items-center justify-between flex-wrap gap-3 px-4 lg:px-5 py-4" style={{ borderBottom: "1px solid var(--c-line)" }}>
					<h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--c-text)" }}>Markets</h3>
					<div style={{ display: "inline-flex", padding: 4, background: "var(--c-surface-2)", borderRadius: 10, border: "1px solid var(--c-line)", gap: 2 }}>
						{["All", "Watchlist", "Gainers", "Losers"].map((t, i) => (
							<button key={t} style={{ padding: "6px 12px", borderRadius: 6, fontSize: 12.5, fontWeight: 500, color: i === 0 ? "var(--c-text)" : "var(--c-text-2)", background: i === 0 ? "var(--c-surface)" : "transparent", border: "none", cursor: "pointer", boxShadow: i === 0 ? "var(--sh-1)" : "none" }}>
								{t}
							</button>
						))}
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full border-collapse text-[13px]">
						<thead>
							<tr>
								{["Asset", "Price", "24h", "7d", "Market cap", ""].map((h, i) => (
									<th key={`${h}-${i}`} style={{ textAlign: "left", fontWeight: 500, color: "var(--c-text-3)", fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.05em", padding: "10px 14px", borderBottom: "1px solid var(--c-line)", background: "var(--c-surface-2)" }}>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{assets.length > 0 ? assets.filter(a => a.sym !== "NGN").map((a) => (
								<tr key={a.sym} className="hover:bg-[var(--c-surface-2)] transition-colors">
									<td style={{ padding: "12px 14px", borderBottom: "1px solid var(--c-line)", height: "var(--row-h)" }}>
										<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
											<AssetLogo symbol={a.sym} />
											<div>
												<div style={{ fontWeight: 600, fontSize: 13, color: "var(--c-text)" }}>{a.name}</div>
												<div style={{ fontSize: 11, color: "var(--c-text-3)" }}>{a.sym}</div>
											</div>
										</div>
									</td>
									<td style={{ padding: "12px 14px", borderBottom: "1px solid var(--c-line)", height: "var(--row-h)", fontFamily: "var(--f-mono)", fontVariantNumeric: "tabular-nums", color: "var(--c-text)" }}>
										{fmt(a.price * (ASSET_META[a.sym]?.rateNgn ?? 1))}
									</td>
									<td style={{ padding: "12px 14px", borderBottom: "1px solid var(--c-line)", height: "var(--row-h)" }}>
										<span style={{ color: a.change >= 0 ? "var(--c-up)" : "var(--c-down)", fontVariantNumeric: "tabular-nums" }}>{fmtPct(a.change)}</span>
									</td>
									<td style={{ padding: "12px 14px", borderBottom: "1px solid var(--c-line)", height: "var(--row-h)" }}>
										<Sparkline data={Array.from({ length: 24 }, (_, j) => (ASSET_META[a.sym]?.rateNgn ?? 1) + Math.sin(j / 3) * 50)} width={80} height={24} tone={a.change >= 0 ? "positive" : "negative"} />
									</td>
									<td style={{ padding: "12px 14px", borderBottom: "1px solid var(--c-line)", height: "var(--row-h)", fontFamily: "var(--f-mono)", fontVariantNumeric: "tabular-nums", color: "var(--c-text-2)" }}>
										${fmtShort(120e6)}
									</td>
									<td style={{ padding: "12px 14px", borderBottom: "1px solid var(--c-line)", height: "var(--row-h)" }}>
										<Link href="/trade" style={{ display: "inline-flex", alignItems: "center", height: 30, padding: "0 10px", borderRadius: 10, fontSize: 12.5, fontWeight: 500, color: "var(--c-text)", border: "1px solid var(--c-line)", background: "transparent" }}>
											Trade
										</Link>
									</td>
								</tr>
							)) : (
								<tr>
									<td colSpan={6} className="py-8 text-center text-[13px]" style={{ color: "var(--c-text-3)" }}>
										No market data available
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
