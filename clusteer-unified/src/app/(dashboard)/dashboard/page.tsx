"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { getUserWallet } from "@/lib/api/wallet/queries";
import { getUserInfo, getAllTransactions } from "@/lib/api/user/queries";
import { ASSETS, ORDERS, CURRENT_USER, FIAT_BALANCE, generateAreaSeries } from "@/lib/mock-data";
import { formatMoney, formatPct, relativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { ChainBadge } from "@/components/primitives/chain-badge";
import { Num } from "@/components/primitives/num";
import { Sparkline } from "@/components/primitives/sparkline";
import { PriceAreaChart } from "@/components/primitives/price-area-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { generateSparkData } from "@/lib/spark-utils";
import {
	ArrowDownToLine, ArrowUpRight, ArrowLeftRight, Eye, EyeOff,
	TrendingUp, TrendingDown, Plus, Banknote, BookOpen, ShieldCheck,
	AlertCircle, ArrowUpDown,
} from "lucide-react";

const QUICK_ACTIONS = [
	{ label: "Buy",      href: "/trade",    variant: "lime" as const },
	{ label: "Sell",     href: "/trade",    variant: "ghost" as const },
	{ label: "Send",     href: "/send",     variant: "ghost" as const },
	{ label: "Receive",  href: "/receive",  variant: "ghost" as const },
	{ label: "Withdraw", href: "/withdraw", variant: "ghost" as const },
];

function SectionCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
	return (
		<div className="ds-card overflow-hidden">
			<div className="ds-card-hd">
				<h3 className="text-[15px] font-semibold text-[var(--c-text)]">{title}</h3>
				{action}
			</div>
			{children}
		</div>
	);
}

function KpiCard({ label, value, sub, up }: { label: string; value: string; sub?: string; up?: boolean | null }) {
	return (
		<div className="ds-card p-5">
			<div className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--c-text-3)]">{label}</div>
			<div className="mt-1.5 font-display tabular-nums text-[26px] font-semibold leading-none text-[var(--c-text)]">{value}</div>
			{sub && (
				<div className={`mt-1.5 flex items-center gap-1 text-[12px] ${up === true ? "text-[var(--c-up)]" : up === false ? "text-[var(--c-down)]" : "text-[var(--c-text-3)]"}`}>
					{up === true && <TrendingUp className="size-3 shrink-0" />}
					{up === false && <TrendingDown className="size-3 shrink-0" />}
					{sub}
				</div>
			)}
		</div>
	);
}

export default function DashboardPage() {
	const [hideBalance, setHideBalance] = useState(false);

	const { data: walletData, isLoading: walletsLoading } = useQuery({
		queryKey: ["wallet"],
		queryFn: getUserWallet,
	});
	const { data: userData, isLoading: userLoading } = useQuery({
		queryKey: ["user-profile"],
		queryFn: getUserInfo,
	});
	const { data: transactionsData, isLoading: txLoading } = useQuery({
		queryKey: ["transactions", 1],
		queryFn: () => getAllTransactions({ page: 1, size: 5 }),
	});

	// Use live wallet data if available, fall back to mock
	const liveAssets = walletData?.walletAssets;
	const hasLiveAssets = liveAssets && liveAssets.length > 0;

	const totalNgn = hasLiveAssets
		? liveAssets.reduce((s: number, a: { balance?: number }) => s + (a.balance ?? 0), 0)
		: ASSETS.reduce((s, a) => s + a.balanceNgn, 0) + FIAT_BALANCE.balance;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const recentOrders: any[] = (transactionsData?.data && transactionsData.data.length > 0)
		? transactionsData.data.slice(0, 5)
		: ORDERS.slice(0, 5);

	const firstName = userData?.firstName ?? userData?.username ?? CURRENT_USER.firstName;
	const masked = "••••••";

	const kycTier = CURRENT_USER.kycTier;
	const kpiTierMax = 3;

	return (
		<div className="space-y-5">
			{/* Welcome */}
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<h1 className="text-[22px] font-semibold tracking-tight text-[var(--c-text)]">
					Welcome back, {userLoading ? <Skeleton className="inline-block h-6 w-24 align-middle" /> : firstName}
				</h1>
				<div className="flex items-center gap-2">
					<Button asChild variant="outline" size="sm" className="rounded-lg border-[var(--c-line)] text-[var(--c-text)]">
						<Link href="/receive"><ArrowDownToLine className="size-3.5" />Receive</Link>
					</Button>
					<Button asChild variant="outline" size="sm" className="rounded-lg border-[var(--c-line)] text-[var(--c-text)]">
						<Link href="/send"><ArrowUpRight className="size-3.5" />Send</Link>
					</Button>
					<Link
						href="/trade"
						className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[var(--c-lime-500)] text-[var(--c-onyx-900)] text-[13px] font-semibold hover:bg-[var(--c-lime-400)] transition-colors"
					>
						<ArrowLeftRight className="size-3.5" />
						Trade
					</Link>
				</div>
			</div>

			{/* Hero + Sidebar */}
			<div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px] gap-4">

				{/* Dark hero balance card */}
				<div
					className="relative overflow-hidden rounded-[20px] p-7"
					style={{ background: "var(--c-onyx-900)", color: "var(--c-cream)" }}
				>
					{/* Lime glow orb */}
					<div
						aria-hidden
						className="pointer-events-none absolute -right-10 -top-10 h-[240px] w-[240px] rounded-full"
						style={{ background: "var(--c-lime-500)", opacity: 0.12 }}
					/>
					<div
						aria-hidden
						className="pointer-events-none absolute -left-8 -bottom-8 h-[160px] w-[160px] rounded-full"
						style={{ background: "var(--c-lime-500)", opacity: 0.06 }}
					/>

					<div className="relative z-10">
						<div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em] opacity-70">
							<span className="size-[6px] rounded-full bg-[var(--c-lime-500)]" />
							Total balance
							<button
								onClick={() => setHideBalance(!hideBalance)}
								className="ml-1 opacity-70 hover:opacity-100 transition-opacity"
								aria-label={hideBalance ? "Show balance" : "Hide balance"}
							>
								{hideBalance ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
							</button>
						</div>

						{walletsLoading ? (
							<Skeleton className="mt-3 h-12 w-56 bg-white/10" />
						) : (
							<div className="mt-2 font-display tabular-nums text-[52px] font-semibold leading-none">
								{hideBalance ? masked : `₦${totalNgn.toLocaleString("en-NG")}`}
							</div>
						)}

						<div className="mt-2 flex items-center gap-3 text-[13px]">
							<span className="flex items-center gap-1 text-[var(--c-lime-500)]">
								<TrendingUp className="size-3.5" />
								+₦487,210 (2.84%) today
							</span>
							<span style={{ opacity: 0.5 }}>Across {ASSETS.length} assets</span>
						</div>

						{/* Quick action buttons */}
						<div className="mt-6 flex flex-wrap gap-2">
							<Link
								href="/trade"
								className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[var(--c-lime-500)] text-[var(--c-onyx-900)] text-[13px] font-semibold hover:bg-[var(--c-lime-400)] transition-colors"
							>
								<Plus className="size-3.5" />
								Buy crypto
							</Link>
							{[
								{ label: "Sell",     href: "/trade" },
								{ label: "Send",     href: "/send" },
								{ label: "Receive",  href: "/receive" },
								{ label: "Withdraw", href: "/withdraw" },
							].map((a) => (
								<Link
									key={a.label}
									href={a.href}
									className="flex items-center h-9 px-4 rounded-lg text-[var(--c-cream)] text-[13px] font-medium transition-colors"
									style={{ border: "1px solid rgba(255,255,255,0.18)" }}
									onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
									onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
								>
									{a.label}
								</Link>
							))}
						</div>

						{/* Portfolio chart */}
						<div className="mt-6 -mx-1">
							<PriceAreaChart
								data={generateAreaSeries(30, totalNgn || 10_000_000)}
								currency="NGN"
								height={140}
								color="#C9F542"
							/>
						</div>
					</div>
				</div>

				{/* Right sidebar: Quick Actions + Live Rate + KYC */}
				<div className="flex flex-col gap-3">
					{/* Quick actions grid */}
					<div className="ds-card p-4">
						<h3 className="text-[13px] font-semibold text-[var(--c-text-3)] uppercase tracking-[0.05em] mb-3">Quick actions</h3>
						<div className="grid grid-cols-2 gap-2">
							{[
								{ label: "Buy",       href: "/trade",    icon: Plus },
								{ label: "Sell",      href: "/trade",    icon: ArrowLeftRight },
								{ label: "Send",      href: "/send",     icon: ArrowUpRight },
								{ label: "Receive",   href: "/receive",  icon: ArrowDownToLine },
								{ label: "Withdraw",  href: "/withdraw", icon: Banknote },
								{ label: "Orders",    href: "/orders",   icon: BookOpen },
							].map(({ label, href, icon: Icon }) => (
								<Link
									key={label}
									href={href}
									className="flex items-center justify-center gap-2 h-11 rounded-lg border border-[var(--c-line)] bg-[var(--c-surface-2)] text-[13px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-3)] transition-colors"
								>
									<Icon className="size-3.5 text-[var(--c-text-3)]" />
									{label}
								</Link>
							))}
						</div>
					</div>

					{/* Live USDT/NGN rate */}
					<div className="ds-card p-4">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-[13px] font-semibold text-[var(--c-text-3)] uppercase tracking-[0.05em]">USDT / NGN Rate</h3>
							<span className="ds-badge ds-badge-up text-[10.5px]">Live</span>
						</div>
						<div className="flex items-end justify-between gap-2">
							<div>
								<div className="font-display tabular-nums text-[28px] font-semibold leading-none text-[var(--c-text)]">₦1,610.50</div>
								<div className="mt-1 flex items-center gap-1 text-[12px] text-[var(--c-up)]">
									<TrendingUp className="size-3" />+0.32% (24h)
								</div>
							</div>
							<Sparkline data={generateSparkData("USDT")} width={100} height={36} />
						</div>
					</div>

					{/* KYC status */}
					<div className="ds-card p-4">
						<div className="flex items-center justify-between mb-3">
							<h3 className="text-[13px] font-semibold text-[var(--c-text-3)] uppercase tracking-[0.05em]">KYC Status</h3>
							<span className="ds-badge ds-badge-up">Tier {kycTier} Verified</span>
						</div>
						<div className="ds-bar">
							<span style={{ width: `${(kycTier / kpiTierMax) * 100}%` }} />
						</div>
						<p className="mt-2 text-[12px] text-[var(--c-text-3)]">
							Upgrade to Tier {kycTier + 1} to lift your daily limit
						</p>
						<Link
							href="/identity-verification"
							className="mt-3 flex items-center justify-center gap-1.5 h-9 w-full rounded-lg bg-[var(--c-onyx-900)] text-[var(--c-cream)] dark:bg-[var(--c-lime-500)] dark:text-[var(--c-onyx-900)] text-[13px] font-semibold hover:opacity-90 transition-opacity"
						>
							<ShieldCheck className="size-3.5" />
							Upgrade tier
						</Link>
					</div>
				</div>
			</div>

			{/* Holdings */}
			<SectionCard
				title="Holdings"
				action={
					<Link href="/assets" className="text-[13px] text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors">
						See all →
					</Link>
				}
			>
				{walletsLoading ? (
					<div className="p-6 space-y-3">
						{[1, 2].map(i => <Skeleton key={i} className="h-11 w-full" />)}
					</div>
				) : ASSETS.length === 0 ? (
					<div className="py-12 text-center px-4 bg-grid">
						<div className="size-14 rounded-2xl inline-flex items-center justify-center mb-4 bg-[var(--c-lime-500)]">
							<ArrowUpDown className="size-6 text-[var(--c-onyx-900)]" />
						</div>
						<p className="font-semibold text-[17px] text-[var(--c-text)]">Your wallet is waiting</p>
						<p className="text-[13px] text-[var(--c-text-3)] mt-1">Buy your first USDT in under 2 minutes</p>
						<Link href="/trade" className="mt-4 inline-flex h-9 px-4 rounded-lg bg-[var(--c-lime-500)] text-[var(--c-onyx-900)] text-[13px] font-semibold hover:bg-[var(--c-lime-400)] transition-colors">
							Start with ₦5,000
						</Link>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-[13px] border-collapse">
							<thead>
								<tr className="border-b border-[var(--c-line)] bg-[var(--c-surface-2)]">
									{["Asset", "Price", "24h", "Trend", "Holdings", "Value"].map((h, i) => (
										<th key={h} className={`px-4 py-3 text-left text-[11.5px] font-medium uppercase tracking-[0.05em] text-[var(--c-text-3)] ${i >= 4 ? "text-right" : ""}`}>
											{h}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{ASSETS.map((a, i) => (
									<motion.tr
										key={a.symbol}
										initial={{ opacity: 0, y: 4 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: i * 0.05 }}
										className="border-b border-[var(--c-line)] hover:bg-[var(--c-surface-2)] transition-colors cursor-pointer"
									>
										<td className="px-4 py-3">
											<Link href={`/assets/${a.symbol}`} className="flex items-center gap-2.5">
												<AssetLogo symbol={a.symbol} />
												<div>
													<div className="font-semibold text-[13px] text-[var(--c-text)]">{a.name}</div>
													<div className="text-[11px] text-[var(--c-text-3)]">{a.chains?.[0]}</div>
												</div>
											</Link>
										</td>
										<td className="px-4 py-3 tabular-nums text-[var(--c-text)]">
											{formatMoney(a.priceNgn, "NGN", { decimals: 0 })}
										</td>
										<td className="px-4 py-3">
											<span className={`tabular-nums font-medium ${a.change24h >= 0 ? "text-[var(--c-up)]" : "text-[var(--c-down)]"}`}>
												{a.change24h >= 0 ? "+" : ""}{formatPct(a.change24h)}
											</span>
										</td>
										<td className="px-4 py-3">
											<Sparkline data={a.sparkline} width={80} height={24} />
										</td>
										<td className="px-4 py-3 text-right tabular-nums text-[var(--c-text)]">
											{a.balance.toFixed(a.balance > 1 ? 4 : 6)} {a.symbol}
										</td>
										<td className="px-4 py-3 text-right tabular-nums font-semibold text-[var(--c-text)]">
											{formatMoney(a.balanceNgn, "NGN", { decimals: 0 })}
										</td>
									</motion.tr>
								))}
								{/* NGN fiat row */}
								<tr className="border-b border-[var(--c-line)] hover:bg-[var(--c-surface-2)] transition-colors">
									<td className="px-4 py-3">
										<div className="flex items-center gap-2.5">
											<div className="size-8 rounded-full bg-[var(--c-surface-2)] border border-[var(--c-line)] flex items-center justify-center text-[11px] font-bold text-[var(--c-text)]">₦</div>
											<div>
												<div className="font-semibold text-[13px] text-[var(--c-text)]">Naira</div>
												<div className="text-[11px] text-[var(--c-text-3)]">Fiat balance</div>
											</div>
										</div>
									</td>
									<td className="px-4 py-3 tabular-nums text-[var(--c-text)]">—</td>
									<td className="px-4 py-3 text-[var(--c-text-3)]">—</td>
									<td className="px-4 py-3">—</td>
									<td className="px-4 py-3 text-right tabular-nums text-[var(--c-text)]">
										{FIAT_BALANCE.balance.toLocaleString("en-NG")} NGN
									</td>
									<td className="px-4 py-3 text-right tabular-nums font-semibold text-[var(--c-text)]">
										{formatMoney(FIAT_BALANCE.balance, "NGN", { decimals: 0 })}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				)}
			</SectionCard>

			{/* Recent activity */}
			<SectionCard
				title="Recent activity"
				action={
					<Link href="/transaction-history" className="text-[13px] text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors">
						View all →
					</Link>
				}
			>
				{txLoading ? (
					<div className="p-6 space-y-3">
						{[1, 2, 3].map(i => <Skeleton key={i} className="h-11 w-full" />)}
					</div>
				) : recentOrders.length === 0 ? (
					<div className="py-12 text-center px-4 bg-grid">
						<div className="size-14 rounded-2xl inline-flex items-center justify-center mb-4 bg-[var(--c-lime-500)]">
							<ArrowUpDown className="size-6 text-[var(--c-onyx-900)]" />
						</div>
						<p className="font-semibold text-[17px] text-[var(--c-text)]">Your first trade is one tap away</p>
						<p className="text-[13px] text-[var(--c-text-3)] mt-1">Buy or sell stablecoins and they'll show up here</p>
						<Link href="/trade" className="mt-4 inline-flex h-9 px-4 rounded-lg bg-[var(--c-lime-500)] text-[var(--c-onyx-900)] text-[13px] font-semibold hover:bg-[var(--c-lime-400)] transition-colors">
							Make your first trade
						</Link>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-[13px] border-collapse">
							<thead>
								<tr className="border-b border-[var(--c-line)] bg-[var(--c-surface-2)]">
									{["Type", "Asset", "Amount", "Status", "When"].map((h, i) => (
										<th key={h} className={`px-4 py-3 text-left text-[11.5px] font-medium uppercase tracking-[0.05em] text-[var(--c-text-3)] ${i === 4 ? "text-right" : ""}`}>
											{h}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
							{recentOrders.map((o: any, i: number) => {
									const kind = (o.kind ?? o.type ?? "") as string;
									const isIn = kind === "buy" || kind === "receive" || kind === "deposit";
									return (
										<motion.tr
											key={o.id as string}
											initial={{ opacity: 0, y: 4 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: i * 0.04 }}
											className="border-b border-[var(--c-line)] hover:bg-[var(--c-surface-2)] transition-colors"
										>
											<td className="px-4 py-3">
												<div className="flex items-center gap-2">
													<span
														className="size-6 rounded-[8px] flex items-center justify-center"
														style={{ background: isIn ? "var(--c-up-soft)" : "var(--c-down-soft)" }}
													>
														{isIn
															? <ArrowDownToLine className="size-3 text-[var(--c-up)]" />
															: <ArrowUpRight className="size-3 text-[var(--c-down)]" />}
													</span>
													<span className="font-medium capitalize text-[var(--c-text)]">{kind}</span>
												</div>
											</td>
											<td className="px-4 py-3">
												<div className="flex items-center gap-1.5">
													<AssetLogo symbol={o.asset as string} size="sm" />
													<span className="text-[var(--c-text)]">{o.asset as string}</span>
													{o.chain && <ChainBadge chain={o.chain as string} />}
												</div>
											</td>
											<td className="px-4 py-3">
												<div className="tabular-nums text-[var(--c-text)]">{o.amount as number} {o.asset as string}</div>
												<div className="tabular-nums text-[11px] text-[var(--c-text-3)]">
													{formatMoney(o.amountNgn as number, "NGN", { decimals: 0 })}
												</div>
											</td>
											<td className="px-4 py-3">
												<Badge
													variant={o.status === "completed" ? "success" : o.status === "failed" ? "danger" : "warning"}
													className="capitalize"
												>
													{o.status as string}
												</Badge>
											</td>
											<td className="px-4 py-3 text-right text-[var(--c-text-3)]">
												{relativeTime(o.createdAt as string || o.dateCreated as string)}
											</td>
										</motion.tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</SectionCard>
		</div>
	);
}
