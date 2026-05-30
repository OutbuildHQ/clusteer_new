"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/lib/api/user/queries";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Sparkline } from "@/components/primitives/sparkline";
import { StaggerContainer, StaggerItem } from "@/components/primitives/motion";
import { OrderStatusBadge, isActionNeeded } from "@/components/trade/order-status-badge";
import { ArrowRight, BookOpen, ArrowLeftRight, AlertTriangle, TrendingUp, Shield } from "lucide-react";
import type { QxOrder, QxOrderStatus } from "@/lib/types";

function fmt(n: number) { return "₦" + Math.round(n).toLocaleString("en-NG"); }

export default function DashboardPage() {
	const { data: user } = useQuery({
		queryKey: ["user-info"],
		queryFn: getUserInfo,
	});

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
	const activeOrders = orders.filter((o: QxOrder) => isActionNeeded(o.status));
	const recentOrders = orders.slice(0, 5);

	const hour = new Date().getHours();
	const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

	return (
		<StaggerContainer className="space-y-6">
			{/* Welcome */}
			<StaggerItem>
				<div>
					<p style={{ fontSize: 13, color: "var(--c-text-2)" }}>{greeting}</p>
					<h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--c-text)", letterSpacing: "-0.03em", margin: 0 }}>
						Welcome back, {firstName}
					</h1>
				</div>
			</StaggerItem>

			{/* Quick actions */}
			<StaggerItem>
				<div style={{ display: "flex", gap: 10 }}>
					<Link
						href="/trade"
						style={{
							flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
							padding: "14px 0", borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: "none",
							background: "var(--c-lime-500)", color: "var(--c-onyx-900)",
						}}
					>
						<ArrowLeftRight size={16} /> Trade
					</Link>
					<Link
						href="/orders"
						style={{
							flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
							padding: "14px 0", borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: "none",
							background: "var(--c-surface-2)", color: "var(--c-text)",
							border: "1px solid var(--c-line)",
						}}
					>
						<BookOpen size={16} /> Orders
						{activeOrders.length > 0 && (
							<span style={{
								background: "var(--c-warn)", color: "#fff", fontSize: 10, fontWeight: 700,
								padding: "1px 6px", borderRadius: 99, marginLeft: 2,
							}}>
								{activeOrders.length}
							</span>
						)}
					</Link>
				</div>
			</StaggerItem>

			{/* Active orders alert */}
			{activeOrders.length > 0 && (
				<StaggerItem>
					<Link
						href="/orders"
						style={{
							display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12,
							background: "var(--c-warn-soft)", border: "1px solid var(--c-warn)",
							textDecoration: "none", color: "var(--c-text)",
						}}
					>
						<AlertTriangle size={16} style={{ color: "var(--c-warn)", flexShrink: 0 }} />
						<span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>
							{activeOrders.length} order{activeOrders.length > 1 ? "s" : ""} need{activeOrders.length === 1 ? "s" : ""} your action
						</span>
						<ArrowRight size={14} style={{ color: "var(--c-text-2)" }} />
					</Link>
				</StaggerItem>
			)}

			{/* Live rate card */}
			<StaggerItem>
				<div style={{ padding: 20, borderRadius: 14, background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
					<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
						<AssetLogo symbol="USDT" size="sm" />
						<span style={{ fontSize: 13, fontWeight: 600, color: "var(--c-text-2)" }}>USDT / NGN</span>
						<span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, color: "var(--c-up)", background: "var(--c-up-soft)", padding: "2px 8px", borderRadius: 99 }}>Live</span>
					</div>
					<div style={{ fontSize: 32, fontWeight: 700, color: "var(--c-text)", letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
						₦{rate.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
					</div>
					<div style={{ fontSize: 13, color: "var(--c-up)", fontWeight: 600, marginTop: 4 }}>
						↗ Best rate this week
					</div>
					{/* Mini chart placeholder */}
					<div style={{ marginTop: 16, height: 60 }}>
						<Sparkline
							data={[1580, 1590, 1585, 1600, 1610, 1605, 1614, 1612, 1618, 1614]}
							width={400}
							height={60}
							tone="positive"
						/>
					</div>
					<div style={{ display: "flex", gap: 8, marginTop: 16 }}>
						<Link
							href="/trade"
							style={{
								flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
								padding: "10px 0", borderRadius: 10, fontWeight: 600, fontSize: 13, textDecoration: "none",
								background: "var(--c-lime-500)", color: "var(--c-onyx-900)",
							}}
						>
							Buy USDT
						</Link>
						<Link
							href="/trade?side=sell"
							style={{
								flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
								padding: "10px 0", borderRadius: 10, fontWeight: 600, fontSize: 13, textDecoration: "none",
								background: "var(--c-surface-2)", color: "var(--c-text)",
								border: "1px solid var(--c-line)",
							}}
						>
							Sell USDT
						</Link>
					</div>
				</div>
			</StaggerItem>

			{/* Account tier card */}
			<StaggerItem>
				<div style={{ padding: 16, borderRadius: 14, background: "var(--c-surface)", border: "1px solid var(--c-line)", display: "flex", alignItems: "center", gap: 14 }}>
					<div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--c-lime-500)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
						<Shield size={20} style={{ color: "var(--c-onyx-900)" }} />
					</div>
					<div style={{ flex: 1 }}>
						<div style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)" }}>Tier 1 · Verified</div>
						<div style={{ fontSize: 12, color: "var(--c-text-2)", marginTop: 2 }}>₦10M daily limit</div>
					</div>
					<Link href="/settings/limits" style={{ fontSize: 12, fontWeight: 600, color: "var(--c-lime-500)", textDecoration: "none" }}>
						View limits →
					</Link>
				</div>
			</StaggerItem>

			{/* Recent orders */}
			{recentOrders.length > 0 && (
				<StaggerItem>
					<div>
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
							<h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--c-text)", margin: 0 }}>Recent orders</h2>
							<Link href="/orders" style={{ fontSize: 13, fontWeight: 600, color: "var(--c-lime-500)", textDecoration: "none" }}>
								See all →
							</Link>
						</div>
						<div style={{ borderRadius: 14, border: "1px solid var(--c-line)", overflow: "hidden" }}>
							{recentOrders.map((o: QxOrder, i: number) => (
								<Link
									key={o.id}
									href={`/orders/${o.id}`}
									style={{
										display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
										borderTop: i > 0 ? "1px solid var(--c-line)" : "none",
										textDecoration: "none", color: "var(--c-text)",
										background: isActionNeeded(o.status) ? "var(--c-warn-soft)" : "var(--c-surface)",
									}}
								>
									<AssetLogo symbol="USDT" size="sm" />
									<div style={{ flex: 1 }}>
										<div style={{ fontSize: 14, fontWeight: 600 }}>
											{o.side === "buy" ? "Buy" : "Sell"} {o.amountUsdt?.toFixed(2) || "—"} USDT
										</div>
										<div style={{ fontSize: 12, color: "var(--c-text-3)", marginTop: 2 }}>
											{o.id} · {o.channel}
										</div>
									</div>
									<div style={{ textAlign: "right" }}>
										<div style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
											{fmt(o.amountNgn || 0)}
										</div>
										<div style={{ marginTop: 4 }}>
											<OrderStatusBadge status={o.status as QxOrderStatus} />
										</div>
									</div>
								</Link>
							))}
						</div>
					</div>
				</StaggerItem>
			)}
		</StaggerContainer>
	);
}
