"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { ASSETS } from "@/lib/mock-data";
import { formatMoney, formatPct } from "@/lib/utils";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Num } from "@/components/primitives/num";
import { PriceAreaChart } from "@/components/primitives/price-area-chart";
import { CandleChart } from "@/components/primitives/candle-chart";
import { generateCandles, generateAreaSeries } from "@/lib/mock-data";
import { ArrowLeft, Send as SendIcon, ArrowDownToLine } from "lucide-react";

type ChartType = "Candle" | "Line" | "Area";
type Range = "1D" | "1W" | "1M" | "3M" | "1Y";

export default function AssetDetailPage({ params }: { params: Promise<{ asset: string }> }) {
	const { asset } = use(params);
	const [chartType, setChartType] = useState<ChartType>("Candle");
	const [range, setRange] = useState<Range>("1M");

	const a = ASSETS.find((x) => x.symbol.toLowerCase() === asset.toLowerCase()) ?? ASSETS[0];
	const priceNgn = a.priceNgn;
	const balanceNgn = a.balanceNgn;
	const avgBuyNgn = priceNgn * 0.94;
	const investedNgn = balanceNgn * 0.94;
	const pnlNgn = balanceNgn * 0.06;
	const candles = useMemo(() => generateCandles(80, priceNgn, priceNgn * 0.02), [priceNgn]);
	const areaSeries = useMemo(() => generateAreaSeries(30, priceNgn), [priceNgn]);

	// Seeded random generator for deterministic mock transactions per asset
	const txns = useMemo(() => {
		const types = ["Buy", "Sell", "Send", "Receive"] as const;
		const statuses = ["Completed", "Completed", "Completed", "Pending", "Failed"] as const;
		const dates = ["Today", "Yesterday", "May 5", "May 3", "Apr 28", "Apr 22", "Apr 15", "Apr 10"];
		const times = ["10:42", "14:18", "09:22", "16:05", "11:33", "08:47", "13:12", "19:55"];

		// Simple seeded PRNG from asset symbol
		let seed = 0;
		for (let i = 0; i < a.symbol.length; i++) seed = (seed * 31 + a.symbol.charCodeAt(i)) | 0;
		const rand = () => { seed = (seed * 16807 + 0) % 2147483647; return (seed & 0x7fffffff) / 2147483647; };

		const count = Math.max(3, Math.floor(rand() * 8) + 1);
		return Array.from({ length: count }, (_, i) => {
			const status = statuses[Math.floor(rand() * statuses.length)];
			const hexChars = "0123456789abcdef";
			const hashStart = Array.from({ length: 4 }, () => hexChars[Math.floor(rand() * 16)]).join("");
			const hashEnd = Array.from({ length: 4 }, () => hexChars[Math.floor(rand() * 16)]).join("");
			return {
				id: `TX-${String(i + 1).padStart(3, "0")}`,
				type: types[Math.floor(rand() * types.length)],
				amount: Math.round(rand() * a.balance * 0.4 * 10000) / 10000,
				status,
				hash: status === "Pending" ? null : `0x${hashStart}...${hashEnd}`,
				date: dates[i % dates.length],
				when: times[i % times.length],
			};
		});
	}, [a.symbol, a.balance]);

	return (
		<div className="space-y-4 lg:space-y-6 px-4 lg:px-0">
			{/* Header */}
			<div className="flex items-center gap-2 lg:gap-3 flex-wrap">
				<Link href="/assets" className="inline-flex items-center justify-center size-9 rounded-[10px] transition-colors" style={{ background: "transparent", color: "var(--c-text)", border: "1px solid var(--c-line)" }}>
					<ArrowLeft className="size-4" />
				</Link>
				<AssetLogo symbol={a.symbol} />
				<div>
					<h2 className="text-[22px] font-semibold" style={{ color: "var(--c-text)", letterSpacing: "-0.02em" }}>
						{a.name} <span className="font-normal text-[14px]" style={{ color: "var(--c-text-3)" }}>{a.symbol}</span>
					</h2>
				</div>
				<div className="flex-1" />
				<Link href="/send" className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-[13.5px] font-medium transition-colors" style={{ background: "transparent", color: "var(--c-text)", border: "1px solid var(--c-line)" }}>
					<SendIcon className="size-4" />Send
				</Link>
				<Link href={`/assets/${a.symbol}/receive`} className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-[13.5px] font-medium transition-colors" style={{ background: "transparent", color: "var(--c-text)", border: "1px solid var(--c-line)" }}>
					<ArrowDownToLine className="size-4" />Receive
				</Link>
				<Link href="/trade" className="inline-flex items-center h-9 px-3.5 rounded-[10px] text-[13.5px] font-medium transition-colors" style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}>
					Trade
				</Link>
			</div>

			{/* Chart + Position */}
			<div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
				{/* Chart card */}
				<div className="rounded-[14px] p-[var(--pad)]" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
					<div className="flex items-start justify-between flex-wrap gap-3 mb-3.5">
						<div>
							<div className="text-[12px]" style={{ color: "var(--c-text-3)" }}>Price</div>
							<div className="tabular-nums text-[28px] lg:text-[36px] font-semibold leading-none" style={{ fontFamily: "var(--f-display)", color: "var(--c-text)", letterSpacing: "-0.025em" }}>
								{formatMoney(priceNgn, "NGN", { decimals: 0 })}
							</div>
							<div className="text-[13px] mt-0.5" style={{ color: a.change24h >= 0 ? "var(--c-up)" : "var(--c-down)" }}>
								{formatPct(a.change24h)} (24h)
							</div>
						</div>
						<div className="flex items-center gap-2 lg:gap-3 flex-wrap">
							{/* Chart type tabs */}
							<div className="inline-flex p-1 rounded-[10px] gap-0.5" style={{ background: "var(--c-surface-2)", border: "1px solid var(--c-line)" }}>
								{(["Candle", "Line", "Area"] as ChartType[]).map((t) => (
									<button key={t} onClick={() => setChartType(t)}
										className="px-3 py-1.5 rounded-[6px] text-[12.5px] font-medium transition-colors"
										style={chartType === t ? { background: "var(--c-surface)", color: "var(--c-text)", boxShadow: "var(--sh-1)" } : { color: "var(--c-text-2)" }}>
										{t}
									</button>
								))}
							</div>
							{/* Range */}
							<div className="inline-flex p-[3px] rounded-[10px] gap-0.5" style={{ background: "var(--c-onyx-900)" }}>
								{(["1D", "1W", "1M", "3M", "1Y"] as Range[]).map((r) => (
									<button key={r} onClick={() => setRange(r)}
										className="px-3.5 py-1.5 rounded-[6px] text-[12.5px] font-medium transition-colors"
										style={range === r ? { background: "var(--c-lime-500)", color: "var(--c-onyx-900)" } : { color: "var(--c-cream)" }}>
										{r}
									</button>
								))}
							</div>
						</div>
					</div>
					{chartType === "Candle" ? (
						<CandleChart data={candles as any} height={320} />
					) : chartType === "Line" ? (
						<PriceAreaChart data={areaSeries} height={320} lineOnly />
					) : (
						<PriceAreaChart data={areaSeries} height={320} />
					)}
				</div>

				{/* Position card */}
				<div className="rounded-[14px] p-[var(--pad)] space-y-4" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
					<h3 className="text-[17px] font-semibold" style={{ color: "var(--c-text)" }}>Your position</h3>
					<div>
						<div className="text-[12px]" style={{ color: "var(--c-text-3)" }}>Balance</div>
						<div className="tabular-nums text-[28px] font-semibold leading-none mt-1" style={{ fontFamily: "var(--f-display)", color: "var(--c-text)", letterSpacing: "-0.025em" }}>
							{a.balance.toFixed(4)} {a.symbol}
						</div>
						<div className="tabular-nums text-[13px] mt-0.5" style={{ fontFamily: "var(--f-mono)", color: "var(--c-text-3)" }}>
							{formatMoney(balanceNgn, "NGN", { decimals: 0 })}
						</div>
					</div>
					<div className="h-px" style={{ background: "var(--c-line)" }} />
					{[
						["Avg buy", formatMoney(avgBuyNgn, "NGN", { decimals: 0 })],
						["Total invested", formatMoney(investedNgn, "NGN", { decimals: 0 })],
					].map(([k, v]) => (
						<div key={k} className="flex items-center justify-between text-[13px]">
							<span style={{ color: "var(--c-text-2)" }}>{k}</span>
							<span className="tabular-nums" style={{ fontFamily: "var(--f-mono)", color: "var(--c-text)" }}>{v}</span>
						</div>
					))}
					<div className="flex items-center justify-between text-[13px]">
						<span style={{ color: "var(--c-text-2)" }}>P&amp;L</span>
						<span className="tabular-nums font-semibold" style={{ fontFamily: "var(--f-mono)", color: "var(--c-up)" }}>
							+{formatMoney(pnlNgn, "NGN", { decimals: 0 })}
						</span>
					</div>
					<div className="h-px" style={{ background: "var(--c-line)" }} />
					<div className="grid grid-cols-2 gap-2">
						<Link href="/trade" className="flex items-center justify-center h-9 rounded-[10px] text-[13.5px] font-medium" style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}>
							Buy
						</Link>
						<Link href="/trade" className="flex items-center justify-center h-9 rounded-[10px] text-[13.5px] font-medium transition-colors" style={{ background: "transparent", color: "var(--c-text)", border: "1px solid var(--c-line)" }}>
							Sell
						</Link>
					</div>
				</div>
			</div>

			{/* Transactions table */}
			<div className="rounded-[14px] overflow-hidden" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
				<div className="px-4 lg:px-[var(--pad)] py-4" style={{ borderBottom: "1px solid var(--c-line)" }}>
					<h3 className="text-[15px] font-semibold" style={{ color: "var(--c-text)" }}>{a.symbol} transactions</h3>
				</div>
				<div className="overflow-x-auto">
				<table className="w-full border-collapse text-[13px] min-w-[540px]">
					<thead>
						<tr>
							{["Type", "Amount", "Status", "Hash", "Date"].map((h, i) => (
								<th key={h} className={`font-medium text-[11.5px] uppercase tracking-[0.05em] px-3.5 py-2.5 ${i === 4 ? "text-right" : "text-left"}`} style={{ color: "var(--c-text-3)", borderBottom: "1px solid var(--c-line)", background: "var(--c-surface-2)" }}>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{txns.map((t) => (
							<tr key={t.id} className="transition-colors hover:bg-[var(--c-surface-2)]">
								<td className="px-3.5 py-3" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)", color: "var(--c-text)" }}>{t.type}</td>
								<td className="px-3.5 py-3 tabular-nums" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)", fontFamily: "var(--f-mono)", color: "var(--c-text)" }}>
									{t.amount.toFixed(4)} {a.symbol}
								</td>
								<td className="px-3.5 py-3" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)" }}>
									<span className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full text-[11.5px] font-medium" style={
										t.status === "Completed" ? { background: "var(--c-up-soft)", color: "var(--c-up)" } : t.status === "Failed" ? { background: "var(--c-down-soft, rgba(239,68,68,0.12))", color: "var(--c-down, #ef4444)" } : { background: "var(--c-warn-soft)", color: "var(--c-warn)" }
									}>
										<span className="text-[9px]">{t.status === "Completed" ? "✓" : t.status === "Failed" ? "✗" : "◐"}</span>{t.status}
									</span>
								</td>
								<td className="px-3.5 py-3 tabular-nums text-[11px]" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)", fontFamily: "var(--f-mono)", color: "var(--c-text-3)" }}>
									{t.hash ?? "—"}
								</td>
								<td className="px-3.5 py-3 text-right tabular-nums" style={{ borderBottom: "1px solid var(--c-line)", height: "var(--row-h)", fontFamily: "var(--f-mono)", color: "var(--c-text)" }}>
									{t.date} {t.when}
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
