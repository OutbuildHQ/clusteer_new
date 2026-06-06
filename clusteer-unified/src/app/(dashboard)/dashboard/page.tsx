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
		<div className="flex flex-col gap-6">
			{/* ── Hero row: rate card + verification ── */}
			<div className="flex gap-4 flex-wrap">
				{/* Dark hero rate card */}
				<div className="flex-[2_1_480px] bg-onyx-900 text-cream rounded-[20px] p-7 relative overflow-hidden">
					<div className="absolute -right-10 -top-10 w-[240px] h-[240px] rounded-full bg-lime-500 opacity-15" />
					<div className="flex items-center gap-2 text-[12px] opacity-70 uppercase tracking-[0.08em]">
						<span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />
						USDT / NGN · live
					</div>
					<div className="text-[56px] font-semibold leading-none mt-2.5 font-display tabular-nums">
						₦{rate.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
					</div>
					<div className="flex items-center gap-3.5 mt-2.5 text-[13px]">
						<span className="text-lime-500 flex items-center gap-1">
							<ArrowUp size={14} />+0.4% today
						</span>
						<span className="opacity-50">Best rate this week</span>
					</div>
					<div className="flex gap-2.5 mt-6 flex-wrap">
						<Link href="/trade" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[10px] font-semibold text-[13px] no-underline bg-lime-500 text-onyx-900 border-none">
							<Plus size={14} /> Buy
						</Link>
						<Link href="/trade?side=sell" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[10px] font-semibold text-[13px] no-underline bg-transparent text-cream border border-white/20">
							Sell
						</Link>
						<Link href="/orders" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[10px] font-semibold text-[13px] no-underline bg-transparent text-cream border border-white/20">
							Orders
						</Link>
					</div>
				</div>

				{/* Verification card */}
				<div className="flex-[1_1_280px] bg-ds-surface rounded-[14px] border border-ds-line p-5">
					<div className="text-[15px] font-semibold text-ds-text mb-3.5">Verification</div>
					<div className="flex flex-col gap-2.5">
						<div className="flex justify-between items-center">
							<span className="text-[12px] text-ds-text-2">Tier</span>
							<span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-ds-surface-2 text-ds-text">
								Tier 1 · Verified
							</span>
						</div>
						<div className="flex justify-between text-[12.5px]">
							<span className="text-ds-text-2">Daily limit</span>
							<span className="font-semibold tabular-nums text-ds-text">₦10,000,000</span>
						</div>
						<div className="flex justify-between text-[12.5px]">
							<span className="text-ds-text-2">Used today</span>
							<span className="font-semibold tabular-nums text-ds-text">₦2,450,000</span>
						</div>
						<div className="h-1.5 rounded-full bg-ds-surface-2 overflow-hidden mt-0.5">
							<div className="h-full w-[24.5%] bg-lime-500" />
						</div>
						<Link href="/identity-verification" className="text-[12px] font-semibold text-ds-text-2 no-underline mt-1">
							Manage verification →
						</Link>
					</div>
				</div>
			</div>

			{/* ── Active orders + Recent orders row ── */}
			<div className="flex gap-4 flex-wrap items-start">
				{/* Active orders table */}
				<div className="flex-[1_1_420px] min-w-0">
					<div className="bg-ds-surface rounded-[14px] border border-ds-line overflow-hidden">
						<div className="px-5 py-3.5 font-semibold text-[15px] text-ds-text border-b border-ds-line">
							Active orders
						</div>
						{activeOrders.length === 0 ? (
							<div className="px-5 py-8 text-center text-ds-text-3 text-[13px]">
								No active orders right now.
							</div>
						) : (
							<table className="w-full border-collapse text-[13px]">
								<thead>
									<tr className="border-b border-ds-line">
										<th className="px-5 py-2.5 text-left text-[11px] font-semibold text-ds-text-3 uppercase tracking-[0.04em]">Order</th>
										<th className="px-3 py-2.5 text-left text-[11px] font-semibold text-ds-text-3 uppercase tracking-[0.04em]">Network</th>
										<th className="px-3 py-2.5 text-left text-[11px] font-semibold text-ds-text-3 uppercase tracking-[0.04em]">Amount</th>
										<th className="px-5 py-2.5 text-right text-[11px] font-semibold text-ds-text-3 uppercase tracking-[0.04em]">Status</th>
									</tr>
								</thead>
								<tbody>
									{activeOrders.map((o) => (
										<tr key={o.id} className="border-b border-ds-line cursor-pointer">
											<td className="px-5 py-3">
												<Link href={`/orders/${o.id}`} className="flex items-center gap-2.5 no-underline text-ds-text">
													<AssetLogo symbol="USDT" size="sm" />
													<div>
														<div className="font-semibold text-[13px] capitalize">{o.side} {o.amountUsdt?.toFixed(2)} USDT</div>
														<div className="text-[11px] text-ds-text-3">{o.id}</div>
													</div>
												</Link>
											</td>
											<td className="px-3 py-3 tabular-nums text-ds-text">{o.channel || "—"}</td>
											<td className="px-3 py-3 tabular-nums font-semibold text-ds-text">{fmt(o.amountNgn || 0)}</td>
											<td className="px-5 py-3 text-right">
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
				<div className="flex-[1_1_420px] min-w-0">
					<div className="bg-ds-surface rounded-[14px] border border-ds-line overflow-hidden">
						<div className="px-5 py-3.5 flex justify-between items-center border-b border-ds-line">
							<span className="font-semibold text-[15px] text-ds-text">Recent orders</span>
							<Link href="/transaction-history" className="text-[12px] font-semibold text-ds-text-2 no-underline">View all →</Link>
						</div>
						{recentOrders.length === 0 ? (
							<div className="px-5 py-8 text-center text-ds-text-3 text-[13px]">
								No orders yet. Start trading to see activity here.
							</div>
						) : (
							recentOrders.map((o, i) => (
								<Link
									key={o.id}
									href={`/orders/${o.id}`}
									className={`flex justify-between items-center px-5 py-3 cursor-pointer no-underline text-ds-text ${i < recentOrders.length - 1 ? "border-b border-ds-line" : ""}`}
								>
									<div className="flex items-center gap-2.5">
										<div className="w-8 h-8 rounded-[10px] bg-ds-surface-2 flex items-center justify-center">
											{o.side === "buy"
												? <ArrowDown size={14} className="text-up" />
												: <ArrowUp size={14} className="text-down" />}
										</div>
										<div>
											<div className="font-semibold text-[13px] capitalize">{o.side} USDT</div>
											<div className="text-[11px] text-ds-text-3">{o.id} · {o.channel}</div>
										</div>
									</div>
									<div className="text-right">
										<div className="font-semibold tabular-nums">{o.amountUsdt?.toFixed(2)} USDT</div>
										<div className="text-[11px] text-ds-text-3 tabular-nums">{fmt(o.amountNgn || 0)}</div>
									</div>
								</Link>
							))
						)}
					</div>
				</div>
			</div>

			{/* ── Markets table ── */}
			<div className="bg-ds-surface rounded-[14px] border border-ds-line overflow-hidden">
				<div className="px-5 py-3.5 flex justify-between items-center border-b border-ds-line">
					<span className="font-semibold text-[15px] text-ds-text">Markets</span>
					<div className="flex gap-0.5 p-[3px] rounded-lg bg-ds-surface-2">
						{["All", "Watchlist", "Gainers", "Losers"].map((t) => (
							<button
								key={t}
								onClick={() => setMktTab(t)}
								className={`px-3 py-[5px] rounded-md text-[12px] font-semibold border-none cursor-pointer ${
									mktTab === t
										? "bg-ds-surface text-ds-text shadow-sm"
										: "bg-transparent text-ds-text-3"
								}`}
							>
								{t}
							</button>
						))}
					</div>
				</div>
				<table className="w-full border-collapse text-[13px]">
					<thead>
						<tr className="border-b border-ds-line">
							<th className="px-5 py-2.5 text-left text-[11px] font-semibold text-ds-text-3 uppercase tracking-[0.04em]">Asset</th>
							<th className="px-3 py-2.5 text-left text-[11px] font-semibold text-ds-text-3 uppercase tracking-[0.04em]">Price</th>
							<th className="px-3 py-2.5 text-left text-[11px] font-semibold text-ds-text-3 uppercase tracking-[0.04em]">24h</th>
							<th className="px-3 py-2.5 text-left text-[11px] font-semibold text-ds-text-3 uppercase tracking-[0.04em]">7d</th>
							<th className="px-3 py-2.5 text-left text-[11px] font-semibold text-ds-text-3 uppercase tracking-[0.04em]">Market cap</th>
							<th className="px-5 py-2.5"></th>
						</tr>
					</thead>
					<tbody>
						{MOCK_MARKETS
							.filter((a) => mktTab === "All" || (mktTab === "Gainers" && a.change >= 0) || (mktTab === "Losers" && a.change < 0))
							.map((a) => (
							<tr key={a.sym} className="border-b border-ds-line">
								<td className="px-5 py-3">
									<div className="flex items-center gap-2.5">
										<AssetLogo symbol={a.sym as any} size="sm" />
										<div>
											<div className="font-semibold text-[13px] text-ds-text">{a.name}</div>
											<div className="text-[11px] text-ds-text-3">{a.sym}</div>
										</div>
									</div>
								</td>
								<td className="px-3 py-3 tabular-nums font-semibold text-ds-text">{fmt(a.price * 1610)}</td>
								<td className="px-3 py-3">
									<span className={`font-semibold tabular-nums ${a.change >= 0 ? "text-up" : "text-down"}`}>
										{fmtPct(a.change)}
									</span>
								</td>
								<td className="px-3 py-3">
									<Sparkline data={[1, 1.02, 0.98, 1.01, 1.03, 0.99, 1.04, 1.02, 1.05, 1.03].map(v => v * a.price)} width={56} height={22} tone={a.change >= 0 ? "positive" : "negative"} />
								</td>
								<td className="px-3 py-3 tabular-nums text-ds-text-2">${fmtShort(a.mcap)}</td>
								<td className="px-5 py-3">
									<Link href="/trade" className="px-3.5 py-[5px] rounded-lg text-[12px] font-semibold border border-ds-line bg-transparent text-ds-text-2 no-underline">
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
