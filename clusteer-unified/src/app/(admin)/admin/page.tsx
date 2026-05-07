"use client";

import { useState } from "react";
import { Num } from "@/components/primitives/num";
import { Download, ArrowUp } from "lucide-react";

/* ── inline mock data ─────────────────────────────────── */

const WALLETS = [
	{ sym: "BTC", chain: "Bitcoin", hot: 4.821, cold: 38.42, hotNgn: 343_500_000, coldNgn: 2_740_000_000 },
	{ sym: "ETH", chain: "Ethereum", hot: 124.5, cold: 980.2, hotNgn: 711_000_000, coldNgn: 5_598_000_000 },
	{ sym: "USDT", chain: "Tron", hot: 482_000, cold: 3_200_000, hotNgn: 776_020_000, coldNgn: 5_152_000_000 },
	{ sym: "USDT", chain: "BSC", hot: 218_000, cold: 1_100_000, hotNgn: 351_000_000, coldNgn: 1_771_000_000 },
	{ sym: "SOL", chain: "Solana", hot: 1_840, cold: 12_400, hotNgn: 535_000_000, coldNgn: 3_614_000_000 },
	{ sym: "BNB", chain: "BSC", hot: 312, cold: 1_850, hotNgn: 305_000_000, coldNgn: 1_809_000_000 },
];

const SERVICES: [string, string, "operational" | "degraded"][] = [
	["API gateway", "99.99%", "operational"],
	["BVN/NIN service", "99.94%", "operational"],
	["Paystack", "99.81%", "operational"],
	["Tron RPC", "98.40%", "degraded"],
	["BTC node", "99.99%", "operational"],
];

const ACTION_QUEUE: [string, number][] = [
	["KYC reviews", 5],
	["Flagged transactions", 4],
	["Withdrawals > \u20A65M", 7],
	["Manual approvals", 2],
];

const VOLUME_BARS = Array.from({ length: 24 }, (_, i) => 40 + Math.random() * 180 + Math.sin(i / 3) * 40);

/* ── helpers ───────────────────────────────────────────── */

function fmtShort(n: number): string {
	if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
	if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
	if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
	return n.toLocaleString("en-NG");
}

function fmtNgn(n: number): string {
	return "\u20A6" + n.toLocaleString("en-NG");
}

/* ── period selector ──────────────────────────────────── */

const PERIODS = ["Today", "7D", "30D", "90D"] as const;

function PeriodSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
	return (
		<div
			className="inline-flex rounded-lg p-0.5"
			style={{ border: "1px solid var(--c-line)", background: "var(--c-surface-2)" }}
		>
			{PERIODS.map((p) => (
				<button
					key={p}
					onClick={() => onChange(p)}
					className="rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
					style={{
						background: value === p ? "var(--c-surface)" : "transparent",
						color: value === p ? "var(--c-text)" : "var(--c-text-3)",
						boxShadow: value === p ? "var(--sh-1)" : "none",
						border: "none",
						cursor: "pointer",
					}}
				>
					{p}
				</button>
			))}
		</div>
	);
}

/* ── bar chart (div-based) ────────────────────────────── */

function BarChart({ data, height = 220 }: { data: number[]; height?: number }) {
	const max = Math.max(...data);
	return (
		<div className="flex items-end gap-[3px]" style={{ height }}>
			{data.map((v, i) => (
				<div
					key={i}
					className="flex-1 rounded-t transition-all"
					style={{
						height: `${(v / max) * 100}%`,
						background: "var(--c-text)",
						opacity: 0.85,
					}}
					title={`${String(i).padStart(2, "0")}:00 — \u20A6${fmtShort(v * 8_200_000)}`}
				/>
			))}
		</div>
	);
}

/* ── currency selector inside cards ───────────────────── */

function CurrencySeg({ value, onChange }: { value: string; onChange: (v: string) => void }) {
	return (
		<div
			className="inline-flex rounded-md p-0.5"
			style={{ border: "1px solid var(--c-line)", background: "var(--c-surface-2)" }}
		>
			{["NGN", "USD"].map((c) => (
				<button
					key={c}
					onClick={() => onChange(c)}
					className="rounded px-2 py-1 text-[11px] font-medium transition-colors"
					style={{
						background: value === c ? "var(--c-surface)" : "transparent",
						color: value === c ? "var(--c-text)" : "var(--c-text-3)",
						boxShadow: value === c ? "var(--sh-1)" : "none",
						border: "none",
						cursor: "pointer",
					}}
				>
					{c}
				</button>
			))}
		</div>
	);
}

/* ── main component ───────────────────────────────────── */

export default function AdminOpsOverview() {
	const [period, setPeriod] = useState("Today");
	const [chartCurrency, setChartCurrency] = useState("NGN");

	const totalAum = WALLETS.reduce((a, b) => a + b.hotNgn + b.coldNgn, 0);
	const last24hVol = 1_482_300_000;
	const txnCount = 60;
	const revenue = last24hVol * 0.005;

	const kpis: { label: string; val: string; sub: string; up: boolean | null }[] = [
		{ label: "Total AUM", val: "\u20A6" + fmtShort(totalAum), sub: "+\u20A6284M (24h)", up: true },
		{ label: "24h Volume", val: "\u20A6" + fmtShort(last24hVol), sub: `${txnCount} transactions`, up: null },
		{ label: "Active users (24h)", val: "8,421", sub: "+12.4% WoW", up: true },
		{ label: "Revenue (24h)", val: "\u20A6" + fmtShort(revenue), sub: "0.5% effective fee", up: null },
	];

	return (
		<div className="space-y-6">
			{/* ── header ─────────────────────────────────── */}
			<header className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="font-display text-2xl font-bold tracking-tight" style={{ color: "var(--c-text)" }}>Operations</h1>
					<p className="mt-1.5 text-sm" style={{ color: "var(--c-text-3)" }}>
						Live snapshot &middot; last refresh just now
					</p>
				</div>
				<div className="flex items-center gap-3">
					<PeriodSelector value={period} onChange={setPeriod} />
					<button
						className="flex items-center gap-1.5"
						style={{
							height: 32,
							padding: "0 12px",
							borderRadius: 8,
							border: "1px solid var(--c-line)",
							background: "transparent",
							color: "var(--c-text)",
							fontSize: 13,
							fontWeight: 500,
							cursor: "pointer",
						}}
					>
						<Download className="size-3.5" />
						Export
					</button>
				</div>
			</header>

			{/* ── 4 KPI cards ────────────────────────────── */}
			<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
				{kpis.map((k, i) => (
					<div className="ds-card" key={i}>
						<div style={{ padding: "20px" }}>
							<div
								className="text-[11px] font-medium uppercase tracking-[0.06em]"
								style={{ color: "var(--c-text-3)" }}
							>
								{k.label}
							</div>
							<Num
								as="div"
								className="mt-1.5 font-display text-[30px] font-semibold leading-tight tracking-tight"
								value={k.val}
							/>
							<div className="mt-1 flex items-center gap-1 text-xs">
								{k.up === true && <ArrowUp className="size-3" style={{ color: "var(--c-up)" }} />}
								<span style={{ color: k.up === true ? "var(--c-up)" : "var(--c-text-3)" }}>
									{k.sub}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* ── volume chart + health / queue ───────────── */}
			<div className="flex flex-wrap gap-4">
				{/* volume chart */}
				<div className="ds-card min-w-0 flex-[2_1_480px]">
					<div
						className="ds-card-hd"
						style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
					>
						<h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--c-text)" }}>Volume by hour</h3>
						<CurrencySeg value={chartCurrency} onChange={setChartCurrency} />
					</div>
					<div style={{ padding: "0 16px 16px" }}>
						<BarChart data={VOLUME_BARS} height={220} />
					</div>
				</div>

				{/* right column: health + queue */}
				<div className="flex min-w-[320px] flex-1 flex-col gap-4">
					{/* system health */}
					<div className="ds-card">
						<div className="ds-card-hd">
							<h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--c-text)" }}>System health</h3>
						</div>
						<div style={{ padding: "0 16px 16px" }} className="space-y-3">
							{SERVICES.map(([name, uptime, status]) => (
								<div key={name} className="flex items-center justify-between text-[13px]">
									<div className="flex items-center gap-2">
										<span
											className="inline-block size-2 rounded-full"
											style={{
												background:
													status === "operational"
														? "var(--c-up)"
														: "var(--c-warn)",
											}}
										/>
										<span style={{ color: "var(--c-text)" }}>{name}</span>
									</div>
									<Num className="text-[var(--c-text-3)]" value={uptime} />
								</div>
							))}
						</div>
					</div>

					{/* action queue */}
					<div className="ds-card">
						<div className="ds-card-hd">
							<h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--c-text)" }}>Action queue</h3>
						</div>
						<div style={{ padding: "0 16px 16px" }} className="space-y-3">
							{ACTION_QUEUE.map(([label, count]) => (
								<div
									key={label}
									className="flex items-center justify-between rounded-lg px-3 py-2.5"
									style={{ background: "var(--c-surface-2)" }}
								>
									<span className="text-[13px]" style={{ color: "var(--c-text)" }}>{label}</span>
									<div className="flex items-center gap-2">
										<span
											style={{
												display: "inline-flex",
												alignItems: "center",
												justifyContent: "center",
												height: 22,
												minWidth: 22,
												padding: "0 6px",
												borderRadius: 9999,
												background: "var(--c-warn-soft)",
												color: "var(--c-warn)",
												fontSize: 11,
												fontWeight: 600,
											}}
										>
											{count}
										</span>
										<button
											style={{
												height: 28,
												padding: "0 8px",
												borderRadius: 6,
												border: "none",
												background: "transparent",
												color: "var(--c-text-2)",
												fontSize: 12,
												fontWeight: 500,
												cursor: "pointer",
											}}
										>
											Review
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* ── wallet pool table ──────────────────────── */}
			<div className="ds-card">
				<div className="ds-card-hd">
					<h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--c-text)" }}>Wallet pool &middot; NGN value</h3>
				</div>
				<div style={{ padding: 0 }}>
					<table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
						<thead>
							<tr style={{ borderBottom: "1px solid var(--c-line)", background: "var(--c-surface-2)" }}>
								{[
									{ label: "Asset", align: "left" as const },
									{ label: "Hot", align: "right" as const },
									{ label: "Cold", align: "right" as const },
									{ label: "Total", align: "right" as const },
									{ label: "Hot ratio", align: "left" as const },
								].map((h, i) => (
									<th
										key={i}
										style={{
											padding: "10px 16px",
											textAlign: h.align,
											fontSize: 11.5,
											fontWeight: 500,
											textTransform: "uppercase",
											letterSpacing: "0.05em",
											color: "var(--c-text-3)",
										}}
									>
										{h.label}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{WALLETS.map((w) => {
								const total = w.hotNgn + w.coldNgn;
								const ratio = w.hotNgn / total;
								const pct = ratio * 100;
								return (
									<tr
										key={w.sym + w.chain}
										style={{ borderBottom: "1px solid var(--c-line)" }}
									>
										<td style={{ padding: "10px 16px" }}>
											<div className="flex items-center gap-2">
												<div
													className="flex items-center justify-center rounded-full text-[10px] font-bold text-white"
													style={{
														width: 28,
														height: 28,
														background:
															w.sym === "BTC"
																? "#f7931a"
																: w.sym === "ETH"
																	? "#627eea"
																	: w.sym === "USDT"
																		? "#26a17b"
																		: w.sym === "SOL"
																			? "#9945ff"
																			: w.sym === "BNB"
																				? "#f0b90b"
																				: "#888",
													}}
												>
													{w.sym.slice(0, 1)}
												</div>
												<div>
													<div className="text-[13px] font-semibold" style={{ color: "var(--c-text)" }}>{w.sym}</div>
													<div className="text-[11px]" style={{ color: "var(--c-text-3)" }}>{w.chain}</div>
												</div>
											</div>
										</td>
										<td style={{ padding: "10px 16px", textAlign: "right" }}>
											<Num value={fmtNgn(w.hotNgn)} />
										</td>
										<td style={{ padding: "10px 16px", textAlign: "right" }}>
											<Num value={fmtNgn(w.coldNgn)} />
										</td>
										<td style={{ padding: "10px 16px", textAlign: "right" }}>
											<Num className="font-semibold" value={fmtNgn(total)} />
										</td>
										<td style={{ padding: "10px 16px" }}>
											<div className="flex items-center gap-2">
												<div
													className="flex-1 max-w-[80px] rounded-full"
													style={{ height: 6, background: "var(--c-surface-3)" }}
												>
													<div
														className="rounded-full transition-all"
														style={{
															height: "100%",
															width: `${pct}%`,
															background:
																ratio > 0.2
																	? "var(--c-warn)"
																	: "var(--c-up)",
														}}
													/>
												</div>
												<Num
													className="text-[11px] text-[var(--c-text-3)]"
													value={pct.toFixed(1) + "%"}
												/>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
