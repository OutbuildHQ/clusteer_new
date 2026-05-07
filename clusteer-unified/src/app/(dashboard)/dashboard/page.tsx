"use client";

import Link from "next/link";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Sparkline } from "@/components/primitives/sparkline";
import { ArrowDown, ArrowUp, Plus } from "lucide-react";

/* ── Inline data matching dashboards/data.js exactly ── */
function seed(s: number) { return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }

const ASSETS = [
	{ sym: "USDT", name: "Tether USD", chain: "Tron", price: 1.00, change: 0.01, bal: 1820.50, balNgn: 2933025, color: "var(--c-usdt)" },
	{ sym: "USDC", name: "USD Coin", chain: "BSC", price: 1.00, change: 0.00, bal: 980.00, balNgn: 1578290, color: "var(--c-usdc)" },
	{ sym: "NGN", name: "Naira", chain: "Bank", price: 0.000621, change: 0, bal: 1284500, balNgn: 1284500, color: "var(--c-lime-500)" },
];

const TYPES = ["Buy", "Sell", "Send", "Receive", "Swap", "Withdraw", "Deposit"] as const;
const TXNS = Array.from({ length: 10 }, (_, i) => {
	const r = seed(i + 100);
	const type = TYPES[Math.floor(r() * TYPES.length)];
	const a = ASSETS[Math.floor(r() * ASSETS.length)];
	return {
		id: `TX-${838201 - i * 7}`,
		type, asset: a.sym, chain: a.chain,
		amount: +(0.01 + r() * 500).toFixed(4),
		ngn: Math.floor((0.01 + r() * 500) * a.price * 1610),
		date: ["Today", "Today", "Yesterday", "Mar 14", "Mar 13"][Math.floor(r() * 5)],
		when: `${Math.floor(r() * 23)}:${String(Math.floor(r() * 59)).padStart(2, "0")}`,
	};
});

const total = ASSETS.reduce((a, b) => a + b.balNgn, 0);
const top = [...ASSETS].sort((a, b) => b.balNgn - a.balNgn).slice(0, 4);

function fmt(n: number) { return "₦" + Math.round(n).toLocaleString("en-NG"); }
function fmtNum(n: number, d = 2) { return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }); }
function fmtPct(n: number) { return (n > 0 ? "+" : "") + n.toFixed(2) + "%"; }
function fmtShort(n: number) { return n >= 1e9 ? (n / 1e9).toFixed(2) + "B" : n >= 1e6 ? (n / 1e6).toFixed(2) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : n.toFixed(0); }

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
				const pct = sl.value / total;
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
	const slices = ASSETS.map((a) => ({ value: a.balNgn, color: a.color, label: a.sym }));
	const recent = TXNS.slice(0, 5);

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
					<div className="text-[34px] lg:text-[56px] font-semibold leading-none mt-2.5 tabular-nums" style={{ fontFamily: "var(--f-display)", letterSpacing: "-0.025em" }}>
						{fmt(total)}
					</div>
					{/* Change + asset count */}
					<div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10, fontSize: 13 }}>
						<span style={{ color: "var(--c-lime-500)", display: "flex", alignItems: "center", gap: 4 }}>
							<ArrowUp className="size-3.5" />+₦487,210 (2.84%) today
						</span>
						<span style={{ color: "var(--c-text-3)" }}>Across {ASSETS.length} assets</span>
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
					<div className="flex items-center gap-3 lg:gap-[18px]">
						<div className="shrink-0">
						<Donut slices={slices} size={150} />
						</div>
						<div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
							{ASSETS.slice(0, 5).map((a) => (
								<div key={a.sym} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12.5 }}>
									<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
										<span style={{ width: 6, height: 6, borderRadius: 999, background: a.color, display: "inline-block" }} />
										{a.sym}
									</div>
									<span style={{ fontFamily: "var(--f-mono)", color: "var(--c-text-2)", fontVariantNumeric: "tabular-nums" }}>
										{((a.balNgn / total) * 100).toFixed(1)}%
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* ═══ Row 2: Top holdings + Recent activity ═══ */}
			<div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
				{/* Top holdings */}
				<div className="rounded-[14px] overflow-hidden" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
					<div style={{ padding: "16px 20px", borderBottom: "1px solid var(--c-line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--c-text)" }}>Top holdings</h3>
					</div>
					{/* Desktop table */}
					<table className="hidden lg:table w-full border-collapse text-[13px]">
						<thead>
							<tr>
								{["Asset", "Price", "24h", "Holdings", "Value"].map((h, i) => (
									<th key={h} style={{ textAlign: i === 4 ? "right" : "left", fontWeight: 500, color: "var(--c-text-3)", fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.05em", padding: "10px 14px", borderBottom: "1px solid var(--c-line)", background: "var(--c-surface-2)" }}>
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
										{fmt(a.price * 1610)}
									</td>
									<td style={{ padding: "12px 14px", borderBottom: "1px solid var(--c-line)", height: "var(--row-h)" }}>
										<span style={{ color: a.change >= 0 ? "var(--c-up)" : "var(--c-down)", fontVariantNumeric: "tabular-nums" }}>{fmtPct(a.change)}</span>
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
									<div className="text-[11px] tabular-nums" style={{ color: a.change >= 0 ? "var(--c-up)" : "var(--c-down)" }}>{fmtPct(a.change)}</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Recent activity */}
				<div className="rounded-[14px] overflow-hidden" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
					<div style={{ padding: "16px 20px", borderBottom: "1px solid var(--c-line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--c-text)" }}>Recent activity</h3>
						<Link href="/transaction-history" style={{ fontSize: 12.5, fontWeight: 500, color: "var(--c-lime-600)", cursor: "pointer" }}>View all →</Link>
					</div>
					<div style={{ display: "flex", flexDirection: "column" }}>
						{recent.map((t) => {
							const isIn = ["Buy", "Receive", "Deposit"].includes(t.type);
							return (
								<div key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: "1px solid var(--c-line)" }}>
									<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
										<div style={{ width: 32, height: 32, borderRadius: 10, background: "var(--c-surface-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
											{isIn ? <ArrowDown className="size-4" style={{ color: "var(--c-up)" }} /> : <ArrowUp className="size-4" style={{ color: "var(--c-down)" }} />}
										</div>
										<div>
											<div style={{ fontWeight: 600, fontSize: 13, color: "var(--c-text)" }}>{t.type} {t.asset}</div>
											<div style={{ fontSize: 11, color: "var(--c-text-3)" }}>{t.date} · {t.when}</div>
										</div>
									</div>
									<div style={{ textAlign: "right" }}>
										<div style={{ fontWeight: 600, fontFamily: "var(--f-mono)", fontVariantNumeric: "tabular-nums", fontSize: 13, color: "var(--c-text)" }}>
											{fmtNum(t.amount, 4)} {t.asset}
										</div>
										<div style={{ fontSize: 11, fontFamily: "var(--f-mono)", fontVariantNumeric: "tabular-nums", color: "var(--c-text-3)" }}>
											{fmt(t.ngn)}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* ═══ Row 3: Markets ═══ */}
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
						{ASSETS.map((a) => (
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
									{fmt(a.price * 1610)}
								</td>
								<td style={{ padding: "12px 14px", borderBottom: "1px solid var(--c-line)", height: "var(--row-h)" }}>
									<span style={{ color: a.change >= 0 ? "var(--c-up)" : "var(--c-down)", fontVariantNumeric: "tabular-nums" }}>{fmtPct(a.change)}</span>
								</td>
								<td style={{ padding: "12px 14px", borderBottom: "1px solid var(--c-line)", height: "var(--row-h)" }}>
									<Sparkline data={Array.from({ length: 24 }, (_, j) => a.price * 1610 + Math.sin(j / 3) * a.price * 50)} width={80} height={24} tone={a.change >= 0 ? "positive" : "negative"} />
								</td>
								<td style={{ padding: "12px 14px", borderBottom: "1px solid var(--c-line)", height: "var(--row-h)", fontFamily: "var(--f-mono)", fontVariantNumeric: "tabular-nums", color: "var(--c-text-2)" }}>
									${fmtShort(a.price * (a.sym === "BTC" ? 19.5e6 : 120e6))}
								</td>
								<td style={{ padding: "12px 14px", borderBottom: "1px solid var(--c-line)", height: "var(--row-h)" }}>
									<Link href="/trade" style={{ display: "inline-flex", alignItems: "center", height: 30, padding: "0 10px", borderRadius: 10, fontSize: 12.5, fontWeight: 500, color: "var(--c-text)", border: "1px solid var(--c-line)", background: "transparent" }}>
										Trade
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				</div>
			</div>
		</div>
	);
}
