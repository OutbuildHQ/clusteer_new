"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/lib/api/user/queries";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Sparkline } from "@/components/primitives/sparkline";
import { OrderStatusBadge, isActionNeeded } from "@/components/trade/order-status-badge";
import {
	Plus, ArrowUp, ArrowDown, BookOpen, TrendingUp,
} from "lucide-react";
import type { QxOrder, QxOrderStatus } from "@/lib/types";

function fmt(n: number) { return "₦" + Math.round(n).toLocaleString("en-NG"); }
function fmtShort(n: number) { return n >= 1e9 ? (n / 1e9).toFixed(1) + "B" : n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? (n / 1e3).toFixed(0) + "K" : String(n); }
function fmtPct(n: number) { return (n >= 0 ? "+" : "") + n.toFixed(2) + "%"; }

const MOCK_MARKETS = [
	{ sym: "USDT", name: "Tether", chain: "Multi-chain", price: 1, change: 0.01, mcap: 120e9 },
	{ sym: "BTC", name: "Bitcoin", chain: "Bitcoin", price: 67_420, change: 2.34, mcap: 1.32e12 },
	{ sym: "ETH", name: "Ethereum", chain: "Ethereum", price: 3_812, change: -0.87, mcap: 458e9 },
	{ sym: "BNB", name: "BNB", chain: "BSC", price: 612, change: 1.12, mcap: 94e9 },
	{ sym: "SOL", name: "Solana", chain: "Solana", price: 172, change: 4.52, mcap: 78e9 },
];

export default function DashboardPage() {
	const { data: user } = useQuery({ queryKey: ["user-info"], queryFn: getUserInfo });
	const { data: rateData } = useQuery({
		queryKey: ["exchange-rate"],
		queryFn: async () => { const r = await fetch("/api/system/exchange-rate?targetCurrency=NGN&amount=1&type=buy"); return r.json(); },
		refetchInterval: 30_000, staleTime: 10_000,
	});
	const { data: ordersData } = useQuery({
		queryKey: ["orders"],
		queryFn: async () => { const r = await fetch("/api/order?page=1&size=10"); const d = await r.json(); return (d.data || []) as QxOrder[]; },
		refetchInterval: 15_000,
	});

	const rate = rateData?.buyRate || 1614.5;
	const orders = ordersData || [];
	const activeOrders = orders.filter((o) => ["awaiting_payment", "awaiting_deposit", "confirming"].includes(o.status));
	const recentOrders = orders.slice(0, 5);
	const [mktTab, setMktTab] = useState("All");

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
			{/* ── Hero row: rate card + verification ── */}
			<div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
				{/* Dark hero rate card */}
				<div style={{
					flex: "2 1 480px", background: "var(--c-onyx-900)", color: "var(--c-cream)",
					borderRadius: 20, padding: 28, position: "relative", overflow: "hidden",
				}}>
					<div style={{ position: "absolute", right: -40, top: -40, width: 240, height: 240, borderRadius: "50%", background: "var(--c-lime-500)", opacity: 0.15 }} />
					<div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.08em" }}>
						<span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--c-lime-500)", animation: "pulse 1.4s ease-in-out infinite" }} />
						USDT / NGN · live
					</div>
					<div style={{ fontSize: 56, fontWeight: 600, lineHeight: 1, marginTop: 10, fontFamily: "var(--f-display, Sora, sans-serif)", fontVariantNumeric: "tabular-nums" }}>
						₦{rate.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
					</div>
					<div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10, fontSize: 13 }}>
						<span style={{ color: "var(--c-lime-500)", display: "flex", alignItems: "center", gap: 4 }}>
							<ArrowUp size={14} />+0.4% today
						</span>
						<span style={{ opacity: 0.5 }}>Best rate this week</span>
					</div>
					<div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
						<Link href="/trade" style={{
							display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px",
							borderRadius: 10, fontWeight: 600, fontSize: 13, textDecoration: "none",
							background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none",
						}}>
							<Plus size={14} /> Buy
						</Link>
						<Link href="/trade?side=sell" style={{
							display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px",
							borderRadius: 10, fontWeight: 600, fontSize: 13, textDecoration: "none",
							background: "transparent", color: "var(--c-cream)",
							border: "1px solid rgba(255,255,255,0.2)",
						}}>
							Sell
						</Link>
						<Link href="/orders" style={{
							display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px",
							borderRadius: 10, fontWeight: 600, fontSize: 13, textDecoration: "none",
							background: "transparent", color: "var(--c-cream)",
							border: "1px solid rgba(255,255,255,0.2)",
						}}>
							Orders
						</Link>
					</div>
				</div>

				{/* Verification card */}
				<div style={{
					flex: "1 1 280px", background: "var(--c-surface)", borderRadius: 14,
					border: "1px solid var(--c-line)", padding: 20,
				}}>
					<div style={{ fontSize: 15, fontWeight: 600, color: "var(--c-text)", marginBottom: 14 }}>Verification</div>
					<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<span style={{ fontSize: 12, color: "var(--c-text-2)" }}>Tier</span>
							<span style={{ fontSize: 12, fontWeight: 600, padding: "2px 10px", borderRadius: 99, background: "var(--c-surface-2)", color: "var(--c-text)" }}>
								Tier 1 · Verified
							</span>
						</div>
						<div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
							<span style={{ color: "var(--c-text-2)" }}>Daily limit</span>
							<span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums", color: "var(--c-text)" }}>₦10,000,000</span>
						</div>
						<div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
							<span style={{ color: "var(--c-text-2)" }}>Used today</span>
							<span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums", color: "var(--c-text)" }}>₦2,450,000</span>
						</div>
						<div style={{ height: 6, borderRadius: 99, background: "var(--c-surface-2)", overflow: "hidden", marginTop: 2 }}>
							<div style={{ height: "100%", width: "24.5%", background: "var(--c-lime-500)" }} />
						</div>
						<Link href="/identity-verification" style={{ fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", textDecoration: "none", marginTop: 4 }}>
							Manage verification →
						</Link>
					</div>
				</div>
			</div>

			{/* ── Active orders + Recent orders row ── */}
			<div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
				{/* Active orders table */}
				<div style={{ flex: "1 1 420px", minWidth: 0 }}>
					<div style={{ background: "var(--c-surface)", borderRadius: 14, border: "1px solid var(--c-line)", overflow: "hidden" }}>
						<div style={{ padding: "14px 20px", fontWeight: 600, fontSize: 15, color: "var(--c-text)", borderBottom: "1px solid var(--c-line)" }}>
							Active orders
						</div>
						{activeOrders.length === 0 ? (
							<div style={{ padding: "32px 20px", textAlign: "center", color: "var(--c-text-3)", fontSize: 13 }}>
								No active orders right now.
							</div>
						) : (
							<table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
								<thead>
									<tr style={{ borderBottom: "1px solid var(--c-line)" }}>
										<th style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Order</th>
										<th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Network</th>
										<th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Amount</th>
										<th style={{ padding: "10px 20px", textAlign: "right", fontSize: 11, fontWeight: 600, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Status</th>
									</tr>
								</thead>
								<tbody>
									{activeOrders.map((o) => (
										<tr key={o.id} style={{ borderBottom: "1px solid var(--c-line)", cursor: "pointer" }}>
											<td style={{ padding: "12px 20px" }}>
												<Link href={`/orders/${o.id}`} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "var(--c-text)" }}>
													<AssetLogo symbol="USDT" size="sm" />
													<div>
														<div style={{ fontWeight: 600, fontSize: 13, textTransform: "capitalize" }}>{o.side} {o.amountUsdt?.toFixed(2)} USDT</div>
														<div style={{ fontSize: 11, color: "var(--c-text-3)" }}>{o.id}</div>
													</div>
												</Link>
											</td>
											<td style={{ padding: "12px", fontVariantNumeric: "tabular-nums", color: "var(--c-text)" }}>{o.channel || "—"}</td>
											<td style={{ padding: "12px", fontVariantNumeric: "tabular-nums", fontWeight: 600, color: "var(--c-text)" }}>{fmt(o.amountNgn || 0)}</td>
											<td style={{ padding: "12px 20px", textAlign: "right" }}>
												<OrderStatusBadge status={o.status as QxOrderStatus} />
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>
				</div>

				{/* Recent orders */}
				<div style={{ flex: "1 1 420px", minWidth: 0 }}>
					<div style={{ background: "var(--c-surface)", borderRadius: 14, border: "1px solid var(--c-line)", overflow: "hidden" }}>
						<div style={{ padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--c-line)" }}>
							<span style={{ fontWeight: 600, fontSize: 15, color: "var(--c-text)" }}>Recent orders</span>
							<Link href="/transaction-history" style={{ fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", textDecoration: "none" }}>View all →</Link>
						</div>
						{recentOrders.length === 0 ? (
							<div style={{ padding: "32px 20px", textAlign: "center", color: "var(--c-text-3)", fontSize: 13 }}>
								No orders yet. Start trading to see activity here.
							</div>
						) : (
							recentOrders.map((o, i) => (
								<Link
									key={o.id}
									href={`/orders/${o.id}`}
									style={{
										display: "flex", justifyContent: "space-between", alignItems: "center",
										padding: "12px 20px", borderBottom: i < recentOrders.length - 1 ? "1px solid var(--c-line)" : "none",
										cursor: "pointer", textDecoration: "none", color: "var(--c-text)",
									}}
								>
									<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
										<div style={{
											width: 32, height: 32, borderRadius: 10, background: "var(--c-surface-2)",
											display: "flex", alignItems: "center", justifyContent: "center",
										}}>
											{o.side === "buy"
												? <ArrowDown size={14} style={{ color: "var(--c-up)" }} />
												: <ArrowUp size={14} style={{ color: "var(--c-down)" }} />}
										</div>
										<div>
											<div style={{ fontWeight: 600, fontSize: 13, textTransform: "capitalize" }}>{o.side} USDT</div>
											<div style={{ fontSize: 11, color: "var(--c-text-3)" }}>{o.id} · {o.channel}</div>
										</div>
									</div>
									<div style={{ textAlign: "right" }}>
										<div style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{o.amountUsdt?.toFixed(2)} USDT</div>
										<div style={{ fontSize: 11, color: "var(--c-text-3)", fontVariantNumeric: "tabular-nums" }}>{fmt(o.amountNgn || 0)}</div>
									</div>
								</Link>
							))
						)}
					</div>
				</div>
			</div>

			{/* ── Markets table ── */}
			<div style={{ background: "var(--c-surface)", borderRadius: 14, border: "1px solid var(--c-line)", overflow: "hidden" }}>
				<div style={{ padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--c-line)" }}>
					<span style={{ fontWeight: 600, fontSize: 15, color: "var(--c-text)" }}>Markets</span>
					<div style={{ display: "flex", gap: 2, padding: 3, borderRadius: 8, background: "var(--c-surface-2)" }}>
						{["All", "Watchlist", "Gainers", "Losers"].map((t) => (
							<button
								key={t}
								onClick={() => setMktTab(t)}
								style={{
									padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600,
									border: "none", cursor: "pointer",
									background: mktTab === t ? "var(--c-surface)" : "transparent",
									color: mktTab === t ? "var(--c-text)" : "var(--c-text-3)",
									boxShadow: mktTab === t ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
								}}
							>
								{t}
							</button>
						))}
					</div>
				</div>
				<table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
					<thead>
						<tr style={{ borderBottom: "1px solid var(--c-line)" }}>
							<th style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Asset</th>
							<th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Price</th>
							<th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>24h</th>
							<th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>7d</th>
							<th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Market cap</th>
							<th style={{ padding: "10px 20px" }}></th>
						</tr>
					</thead>
					<tbody>
						{MOCK_MARKETS
							.filter((a) => mktTab === "All" || (mktTab === "Gainers" && a.change >= 0) || (mktTab === "Losers" && a.change < 0))
							.map((a) => (
							<tr key={a.sym} style={{ borderBottom: "1px solid var(--c-line)" }}>
								<td style={{ padding: "12px 20px" }}>
									<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
										<AssetLogo symbol={a.sym as any} size="sm" />
										<div>
											<div style={{ fontWeight: 600, fontSize: 13, color: "var(--c-text)" }}>{a.name}</div>
											<div style={{ fontSize: 11, color: "var(--c-text-3)" }}>{a.sym}</div>
										</div>
									</div>
								</td>
								<td style={{ padding: "12px", fontVariantNumeric: "tabular-nums", fontWeight: 600, color: "var(--c-text)" }}>{fmt(a.price * 1610)}</td>
								<td style={{ padding: "12px" }}>
									<span style={{ color: a.change >= 0 ? "var(--c-up)" : "var(--c-down)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
										{fmtPct(a.change)}
									</span>
								</td>
								<td style={{ padding: "12px" }}>
									<Sparkline data={[1, 1.02, 0.98, 1.01, 1.03, 0.99, 1.04, 1.02, 1.05, 1.03].map(v => v * a.price)} width={56} height={22} tone={a.change >= 0 ? "positive" : "negative"} />
								</td>
								<td style={{ padding: "12px", fontVariantNumeric: "tabular-nums", color: "var(--c-text-2)" }}>${fmtShort(a.mcap)}</td>
								<td style={{ padding: "12px 20px" }}>
									<Link href="/trade" style={{
										padding: "5px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
										border: "1px solid var(--c-line)", background: "transparent", color: "var(--c-text-2)",
										textDecoration: "none",
									}}>
										Trade
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
