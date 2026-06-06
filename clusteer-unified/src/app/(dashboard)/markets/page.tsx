"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, RefreshCw, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { Sparkline } from "@/components/primitives/sparkline";

interface Market {
	id: string;
	rank: number;
	name: string;
	symbol: string;
	icon: string;
	price: number;
	change24h: number;
	volume: number;
	marketCap: number;
	high24h: number;
	low24h: number;
	sparkline7d?: number[];
}

const STABLECOINS = new Set(["USDT", "USDC", "DAI", "BUSD", "USDS", "PYUSD"]);
const TABS = ["All", "Stablecoins"] as const;
type Tab = typeof TABS[number];

function formatLargeNumber(num: number) {
	if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
	if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
	return `$${num.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

function formatPrice(price: number) {
	if (price < 0.001) return `$${price.toFixed(6)}`;
	if (price < 1) return `$${price.toFixed(4)}`;
	return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function MarketsPage() {
	const [search, setSearch] = useState("");
	const [tab, setTab] = useState<Tab>("All");

	const {
		data: markets = [],
		isLoading: marketsLoading,
		refetch,
		dataUpdatedAt,
	} = useQuery<Market[]>({
		queryKey: ["markets"],
		queryFn: async () => {
			const res = await fetch("/api/markets?limit=25");
			const json = await res.json();
			if (!json.status) throw new Error(json.message || "Failed to fetch");
			return json.data as Market[];
		},
		staleTime: 2 * 60 * 1000,
	});

	const { data: rateData } = useQuery({
		queryKey: ["exchange-rate-ngn"],
		queryFn: async () => {
			const res = await fetch("/api/system/exchange-rate?targetCurrency=NGN&type=sell");
			if (!res.ok) return null;
			return res.json();
		},
		staleTime: 5 * 60 * 1000,
	});

	const buyRate: number = rateData?.buyRate ?? 0;
	const sellRate: number = rateData?.sellRate ?? 0;

	const filteredMarkets = markets.filter((m) => {
		const matchesSearch =
			m.name.toLowerCase().includes(search.toLowerCase()) ||
			m.symbol.toLowerCase().includes(search.toLowerCase());
		const matchesTab = tab === "All" || STABLECOINS.has(m.symbol);
		return matchesSearch && matchesTab;
	});

	const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt) : null;

	return (
		<div className="space-y-5 pb-6">
			{/* Header */}
			<div className="flex items-start justify-between gap-4 flex-wrap">
				<div>
					<h1 className="text-[32px] font-semibold tracking-[-0.03em] font-display" style={{ color: "var(--c-text)" }}>Markets</h1>
					{lastUpdated && (
						<p style={{ fontSize: 12, color: "var(--c-text-3)", marginTop: 2 }}>
							Updated {lastUpdated.toLocaleTimeString()}
						</p>
					)}
				</div>
				<button
					onClick={() => refetch()}
					disabled={marketsLoading}
					style={{ height: 36, padding: "0 14px", borderRadius: 10, fontSize: 13.5, fontWeight: 500, border: "1px solid var(--c-line)", background: "transparent", color: "var(--c-text)", cursor: marketsLoading ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 8, opacity: marketsLoading ? 0.5 : 1 }}
				>
					{marketsLoading ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
					Refresh
				</button>
			</div>

			{/* Live NGN rate cards */}
			{(buyRate > 0 || sellRate > 0) && (
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
					<div className="ds-card p-4">
						<div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-text-3)" }}>USDT Buy Rate</div>
						<div style={{ fontSize: 22, fontWeight: 600, fontFamily: "var(--font-display, inherit)", color: "var(--c-text)", marginTop: 4 }}>
							₦{buyRate.toLocaleString("en-NG", { maximumFractionDigits: 0 })}
						</div>
						<div style={{ fontSize: 11, color: "var(--c-text-3)", marginTop: 2 }}>per USDT</div>
					</div>
					<div className="ds-card p-4">
						<div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-text-3)" }}>USDT Sell Rate</div>
						<div style={{ fontSize: 22, fontWeight: 600, fontFamily: "var(--font-display, inherit)", color: "var(--c-text)", marginTop: 4 }}>
							₦{sellRate.toLocaleString("en-NG", { maximumFractionDigits: 0 })}
						</div>
						<div style={{ fontSize: 11, color: "var(--c-text-3)", marginTop: 2 }}>per USDT</div>
					</div>
					<div className="ds-card p-4">
						<div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-text-3)" }}>USDC Buy Rate</div>
						<div style={{ fontSize: 22, fontWeight: 600, fontFamily: "var(--font-display, inherit)", color: "var(--c-text)", marginTop: 4 }}>
							₦{buyRate.toLocaleString("en-NG", { maximumFractionDigits: 0 })}
						</div>
						<div style={{ fontSize: 11, color: "var(--c-text-3)", marginTop: 2 }}>per USDC</div>
					</div>
					<div className="ds-card p-4">
						<div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-text-3)" }}>USDC Sell Rate</div>
						<div style={{ fontSize: 22, fontWeight: 600, fontFamily: "var(--font-display, inherit)", color: "var(--c-text)", marginTop: 4 }}>
							₦{sellRate.toLocaleString("en-NG", { maximumFractionDigits: 0 })}
						</div>
						<div style={{ fontSize: 11, color: "var(--c-text-3)", marginTop: 2 }}>per USDC</div>
					</div>
				</div>
			)}

			{/* Search + tabs */}
			<div className="flex items-center gap-3 flex-wrap">
				<div className="relative flex-1 min-w-[200px] max-w-xs">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: "var(--c-text-3)" }} />
					<input
						type="text"
						placeholder="Search coins..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						style={{ height: 40, padding: "0 12px 0 36px", border: "1px solid var(--c-line)", borderRadius: 10, background: "var(--c-surface)", color: "var(--c-text)", fontSize: 13.5, width: "100%", outline: "none" }}
					/>
				</div>
				<div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--c-surface-2)] border border-[var(--c-line)]">
					{TABS.map((t) => (
						<button
							key={t}
							onClick={() => setTab(t)}
							style={{
								padding: "4px 12px",
								borderRadius: 7,
								fontSize: 12.5,
								fontWeight: 500,
								border: "none",
								cursor: "pointer",
								transition: "all 0.15s",
								background: tab === t ? "var(--c-surface)" : "transparent",
								color: tab === t ? "var(--c-text)" : "var(--c-text-2)",
								boxShadow: tab === t ? "var(--sh-1)" : "none",
							}}
						>
							{t}
						</button>
					))}
				</div>
			</div>

			{/* Table */}
			<div className="ds-card overflow-hidden">
				{marketsLoading && markets.length === 0 ? (
					<div className="flex items-center justify-center py-16">
						<Loader2 className="size-8 animate-spin" style={{ color: "var(--c-text-3)" }} />
					</div>
				) : (
					<>
						{/* Desktop table */}
						<div className="hidden md:block overflow-x-auto">
							<table className="w-full text-[13px] border-collapse">
								<thead>
									<tr style={{ borderBottom: "1px solid var(--c-line)", background: "var(--c-surface-2)" }}>
										{["#", "Asset", "Price", "7d", "24h Change", "24h Volume", "Market Cap"].map((h, i) => (
											<th
												key={h}
												style={{
													padding: "10px 16px",
													textAlign: i === 0 || i === 1 || i === 3 ? "left" : "right",
													fontSize: 11,
													fontWeight: 500,
													textTransform: "uppercase",
													letterSpacing: "0.05em",
													color: "var(--c-text-3)",
													whiteSpace: "nowrap",
												}}
											>
												{h}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{filteredMarkets.map((m) => {
										const isStablecoin = STABLECOINS.has(m.symbol);
										const isUp = m.change24h >= 0;
										return (
											<tr
												key={m.id}
												style={{
													borderBottom: "1px solid var(--c-line)",
													background: isStablecoin ? "var(--c-surface-2)" : "transparent",
													transition: "background 0.12s",
												}}
												onMouseEnter={(e) => (e.currentTarget.style.background = "var(--c-surface-2)")}
												onMouseLeave={(e) => (e.currentTarget.style.background = isStablecoin ? "var(--c-surface-2)" : "transparent")}
											>
												<td style={{ padding: "12px 16px", color: "var(--c-text-3)", fontSize: 12 }}>{m.rank}</td>
												<td style={{ padding: "12px 16px" }}>
													<div className="flex items-center gap-2.5">
														<Image src={m.icon} alt={m.name} width={28} height={28} className="rounded-full" />
														<div>
															<div style={{ fontWeight: 600, color: "var(--c-text)", display: "flex", alignItems: "center", gap: 6 }}>
																{m.name}
																{isStablecoin && (
																	<span style={{ fontSize: 10, fontWeight: 500, padding: "1px 5px", borderRadius: 4, background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}>
																		stable
																	</span>
																)}
															</div>
															<div style={{ fontSize: 11, color: "var(--c-text-3)" }}>{m.symbol}</div>
														</div>
													</div>
												</td>
												<td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "var(--c-text)", fontVariantNumeric: "tabular-nums" }}>
													{formatPrice(m.price)}
												</td>
												<td style={{ padding: "12px 16px", textAlign: "left" }}>
													{m.sparkline7d && m.sparkline7d.length > 1 && (
														<Sparkline data={m.sparkline7d} width={80} height={28} tone="auto" />
													)}
												</td>
												<td style={{ padding: "12px 16px", textAlign: "right" }}>
													<span
														className="inline-flex items-center gap-1"
														style={{ fontWeight: 600, color: isUp ? "var(--success)" : "var(--danger)", fontVariantNumeric: "tabular-nums" }}
													>
														{isUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
														{isUp ? "+" : ""}{m.change24h.toFixed(2)}%
													</span>
												</td>
												<td style={{ padding: "12px 16px", textAlign: "right", color: "var(--c-text-2)", fontVariantNumeric: "tabular-nums" }}>
													{formatLargeNumber(m.volume)}
												</td>
												<td style={{ padding: "12px 16px", textAlign: "right", color: "var(--c-text-2)", fontVariantNumeric: "tabular-nums" }}>
													{formatLargeNumber(m.marketCap)}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>

						{/* Mobile stacked */}
						<div className="md:hidden">
							{filteredMarkets.map((m, i) => {
								const isUp = m.change24h >= 0;
								return (
									<div
										key={m.id}
										style={{
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											padding: "12px 16px",
											borderBottom: i < filteredMarkets.length - 1 ? "1px solid var(--c-line)" : "none",
										}}
									>
										<div className="flex items-center gap-2.5">
											<Image src={m.icon} alt={m.name} width={32} height={32} className="rounded-full" />
											<div>
												<div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--c-text)" }}>{m.name}</div>
												<div style={{ fontSize: 11, color: "var(--c-text-3)" }}>{m.symbol}</div>
											</div>
										</div>
										<div className="flex items-center gap-3">
											{m.sparkline7d && m.sparkline7d.length > 1 && (
												<Sparkline data={m.sparkline7d} width={56} height={22} tone="auto" />
											)}
											<div className="text-right">
												<div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--c-text)", fontVariantNumeric: "tabular-nums" }}>
													{formatPrice(m.price)}
												</div>
												<div style={{ fontSize: 11, fontWeight: 500, color: isUp ? "var(--success)" : "var(--danger)", fontVariantNumeric: "tabular-nums" }}>
													{isUp ? "+" : ""}{m.change24h.toFixed(2)}%
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>

						{filteredMarkets.length === 0 && !marketsLoading && (
							<div className="py-16 text-center" style={{ color: "var(--c-text-3)" }}>
								{search ? `No coins matching "${search}"` : "No market data available."}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
