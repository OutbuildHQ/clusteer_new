"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/lib/api/user/queries";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Sparkline } from "@/components/primitives/sparkline";
import { OrderStatusBadge, isActionNeeded } from "@/components/trade/order-status-badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
	ArrowLeftRight, ReceiptText, AlertTriangle, Plus, ArrowUp, ArrowDown,
	ChevronRight, Shield,
} from "lucide-react";
import type { QxOrder, QxOrderStatus } from "@/lib/types";

function fmt(n: number) { return "₦" + Math.round(n).toLocaleString("en-NG"); }
function ago(ts: string) {
	const h = (Date.now() - new Date(ts).getTime()) / 3_600_000;
	return h < 1 ? "just now" : h < 24 ? `${Math.round(h)}h ago` : `${Math.round(h / 24)}d ago`;
}

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
	awaiting_payment: { label: "Pay now", variant: "secondary" },
	awaiting_deposit: { label: "Send now", variant: "secondary" },
	confirming: { label: "Confirming", variant: "outline" },
	completed: { label: "Completed", variant: "default" },
	expired: { label: "Expired", variant: "destructive" },
	failed: { label: "Failed", variant: "destructive" },
};

export default function DashboardPage() {
	const { data: user } = useQuery({ queryKey: ["user-info"], queryFn: getUserInfo });

	const { data: rateData } = useQuery({
		queryKey: ["exchange-rate"],
		queryFn: async () => {
			const r = await fetch("/api/system/exchange-rate?targetCurrency=NGN&amount=1&type=buy");
			return r.json();
		},
		refetchInterval: 30_000,
		staleTime: 10_000,
	});

	const { data: ordersData } = useQuery({
		queryKey: ["orders"],
		queryFn: async () => {
			const r = await fetch("/api/order?page=1&size=10");
			const d = await r.json();
			return (d.data || []) as QxOrder[];
		},
		refetchInterval: 15_000,
	});

	const rate = rateData?.buyRate || 1614.5;
	const firstName = user?.firstName || "there";
	const orders = ordersData || [];
	const activeOrders = orders.filter((o) => isActionNeeded(o.status));
	const recentOrders = orders.slice(0, 5);
	const needAction = activeOrders.length;

	const dailyUsed = 2_450_000;
	const dailyCap = 10_000_000;
	const dailyPct = Math.round((dailyUsed / dailyCap) * 100);

	return (
		<div className="space-y-6">
			{/* Header */}
			<header className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="text-sm" style={{ color: "var(--c-text-2)" }}>Welcome back, {firstName}</p>
					<h1 className="font-display text-2xl font-bold tracking-tight" style={{ color: "var(--c-text)" }}>Home</h1>
				</div>
				<div className="flex gap-2">
					<Button asChild variant="outline" size="sm">
						<Link href="/orders"><ReceiptText className="size-4" />Orders</Link>
					</Button>
					<Button asChild size="sm" style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}>
						<Link href="/trade"><ArrowLeftRight className="size-4" />Trade</Link>
					</Button>
				</div>
			</header>

			{/* Action needed alert */}
			{needAction > 0 && (
				<Card style={{ borderColor: "var(--c-warn)", background: "var(--c-warn-soft)" }}>
					<CardContent className="flex items-center gap-3 p-4">
						<AlertTriangle className="size-5" style={{ color: "var(--c-warn)" }} />
						<div className="flex-1">
							<div className="font-medium" style={{ color: "var(--c-text)" }}>
								{needAction} order{needAction > 1 ? "s" : ""} need your action
							</div>
							<div className="text-xs" style={{ color: "var(--c-text-2)" }}>
								Complete the bank transfer or crypto deposit before the window expires.
							</div>
						</div>
						<Button asChild size="sm" variant="outline">
							<Link href="/orders">Review</Link>
						</Button>
					</CardContent>
				</Card>
			)}

			{/* Rate card + Limits — 2-column grid on desktop */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				{/* Live rate + trade hero */}
				<Card className="lg:col-span-2">
					<CardHeader>
						<div className="flex items-start justify-between">
							<div>
								<CardDescription className="inline-flex items-center gap-2">
									<span className="inline-flex items-center gap-1.5">
										<span className="size-1.5 animate-pulse rounded-full" style={{ background: "var(--c-lime-500)" }} />
										USDT / NGN · live
									</span>
								</CardDescription>
								<div className="mt-1 font-display text-3xl font-bold tracking-tight" style={{ color: "var(--c-text)", fontVariantNumeric: "tabular-nums" }}>
									₦{rate.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
								</div>
								<div className="mt-1 flex items-center gap-2 text-sm">
									<span style={{ color: "var(--c-up)", fontWeight: 600 }}>+0.4%</span>
									<span style={{ color: "var(--c-text-2)" }}>· best rate this week</span>
								</div>
							</div>
							<div className="flex gap-2">
								<Button asChild size="sm" style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}>
									<Link href="/trade"><Plus className="size-4" />Buy</Link>
								</Button>
								<Button asChild size="sm" variant="outline">
									<Link href="/trade"><ArrowUp className="size-4" />Sell</Link>
								</Button>
							</div>
						</div>
					</CardHeader>
					<CardContent className="pt-0">
						<div style={{ height: 200 }}>
							<Sparkline
								data={[1580, 1590, 1585, 1600, 1610, 1605, 1614, 1612, 1618, 1614, 1610, 1616, 1620, 1615, 1618, 1614, 1612, 1617, 1620, 1615]}
								width={600}
								height={200}
								tone="positive"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Limits snapshot */}
				<Card>
					<CardHeader>
						<CardTitle>Your limits</CardTitle>
						<CardDescription>Tier 1 · Starter</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<div className="mb-1.5 flex items-baseline justify-between text-sm">
								<span style={{ color: "var(--c-text-2)" }}>Daily used</span>
								<span className="font-medium tabular-nums" style={{ color: "var(--c-text)" }}>{fmt(dailyUsed)}</span>
							</div>
							<Progress value={dailyPct} />
							<div className="mt-1 text-xs" style={{ color: "var(--c-text-2)" }}>
								{fmt(dailyCap - dailyUsed)} left of {fmt(dailyCap)}
							</div>
						</div>
						<Button asChild variant="outline" size="sm" className="w-full">
							<Link href="/settings/limits">View limits</Link>
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* Active orders */}
			{activeOrders.length > 0 && (
				<Card>
					<CardHeader className="flex-row items-center justify-between">
						<CardTitle>Active orders</CardTitle>
						<Button asChild variant="ghost" size="sm">
							<Link href="/orders">See all</Link>
						</Button>
					</CardHeader>
					<CardContent className="space-y-2.5">
						{activeOrders.map((o) => {
							const needs = isActionNeeded(o.status);
							return (
								<Link
									key={o.id}
									href={`/orders/${o.id}`}
									className={`flex items-center gap-4 rounded-lg border p-3 transition hover:border-foreground/30 ${needs ? "border-foreground" : "border-border"}`}
									style={{ textDecoration: "none", color: "var(--c-text)" }}
								>
									<div className="relative">
										<AssetLogo symbol="USDT" size="md" />
										<span className={`absolute -bottom-1 -right-1 grid size-4 place-items-center rounded-full border-2`}
											style={{
												background: o.side === "buy" ? "var(--c-lime-500)" : "var(--c-text)",
												color: o.side === "buy" ? "var(--c-onyx-900)" : "var(--c-surface)",
												borderColor: "var(--c-surface)",
											}}>
											{o.side === "buy" ? <ArrowDown className="size-2.5" /> : <ArrowUp className="size-2.5" />}
										</span>
									</div>
									<div className="min-w-0 flex-1">
										<div className="font-medium">{o.side === "buy" ? "Buy" : "Sell"} {o.amountUsdt?.toFixed(2) || "—"} USDT</div>
										<div className="text-xs" style={{ color: "var(--c-text-2)" }}>{o.id} · {o.channel}</div>
									</div>
									<div className="text-right">
										<div className="tabular-nums font-medium">{fmt(o.amountNgn || 0)}</div>
										<div className="mt-1">
											<OrderStatusBadge status={o.status as QxOrderStatus} />
										</div>
									</div>
									<ChevronRight className="size-4 shrink-0" style={{ color: "var(--c-text-2)" }} />
								</Link>
							);
						})}
					</CardContent>
				</Card>
			)}

			{/* Recent activity table */}
			{recentOrders.length > 0 && (
				<Card>
					<CardHeader className="flex-row items-center justify-between">
						<CardTitle>Recent activity</CardTitle>
						<Button asChild variant="ghost" size="sm">
							<Link href="/orders">View all</Link>
						</Button>
					</CardHeader>
					<CardContent className="p-0">
						{/* Desktop table */}
						<div className="hidden md:block overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr style={{ borderBottom: "1px solid var(--c-line)" }}>
										<th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--c-text-2)" }}>Order</th>
										<th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--c-text-2)" }}>Network</th>
										<th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--c-text-2)" }}>Amount</th>
										<th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--c-text-2)" }}>Status</th>
										<th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: "var(--c-text-2)" }}>When</th>
									</tr>
								</thead>
								<tbody>
									{recentOrders.map((o) => (
										<tr key={o.id} style={{ borderBottom: "1px solid var(--c-line)" }} className="hover:bg-[var(--c-surface-2)] transition-colors">
											<td className="px-4 py-3">
												<Link href={`/orders/${o.id}`} className="flex items-center gap-2" style={{ textDecoration: "none", color: "var(--c-text)" }}>
													<AssetLogo symbol="USDT" size="sm" />
													<span className="font-medium capitalize">{o.side} <span style={{ color: "var(--c-text-2)" }}>· {o.id}</span></span>
												</Link>
											</td>
											<td className="px-4 py-3" style={{ color: "var(--c-text)" }}>{o.channel || "—"}</td>
											<td className="px-4 py-3">
												<div className="tabular-nums font-medium" style={{ color: "var(--c-text)" }}>{o.amountUsdt?.toFixed(2) || "—"} USDT</div>
												<div className="text-xs tabular-nums" style={{ color: "var(--c-text-2)" }}>{fmt(o.amountNgn || 0)}</div>
											</td>
											<td className="px-4 py-3">
												<OrderStatusBadge status={o.status as QxOrderStatus} />
											</td>
											<td className="px-4 py-3 text-right" style={{ color: "var(--c-text-2)" }}>
												{o.createdAt ? ago(o.createdAt) : "—"}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						{/* Mobile card list */}
						<div className="md:hidden">
							{recentOrders.map((o, i) => (
								<Link
									key={o.id}
									href={`/orders/${o.id}`}
									className="flex items-center gap-3 p-4"
									style={{
										borderTop: i > 0 ? "1px solid var(--c-line)" : "none",
										textDecoration: "none", color: "var(--c-text)",
									}}
								>
									<AssetLogo symbol="USDT" size="sm" />
									<div className="flex-1 min-w-0">
										<div className="font-medium text-sm capitalize">{o.side} {o.amountUsdt?.toFixed(2)} USDT</div>
										<div className="text-xs" style={{ color: "var(--c-text-2)" }}>{o.id} · {o.channel}</div>
									</div>
									<div className="text-right">
										<div className="text-sm tabular-nums font-medium">{fmt(o.amountNgn || 0)}</div>
										<div className="mt-1"><OrderStatusBadge status={o.status as QxOrderStatus} /></div>
									</div>
								</Link>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
