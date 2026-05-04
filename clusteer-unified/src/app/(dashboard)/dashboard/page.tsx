"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUserWallet } from "@/lib/api/wallet/queries";
import { getUserInfo, getAllTransactions } from "@/lib/api/user/queries";
import { generateAreaSeries } from "@/lib/mock-data";
import { generateSparkData } from "@/lib/spark-utils";
import { formatMoney, relativeTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { ChainBadge } from "@/components/primitives/chain-badge";
import { Num } from "@/components/primitives/num";
import { Sparkline } from "@/components/primitives/sparkline";
import { PriceAreaChart } from "@/components/primitives/price-area-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/primitives/table-skeleton";
import { ArrowDownToLine, ArrowUpRight, ArrowLeftRight, Eye, EyeOff, ArrowUpDown, AlertCircle, TrendingUp, BarChart3, Clock } from "lucide-react";

export default function DashboardPage() {
	const [hideBalance, setHideBalance] = useState(false);

	const { data: walletData, isLoading: walletsLoading, error: walletsError } = useQuery({
		queryKey: ["wallet"],
		queryFn: getUserWallet,
	});

	const { data: userData, isLoading: userLoading } = useQuery({
		queryKey: ["user-profile"],
		queryFn: getUserInfo,
	});

	const { data: transactionsData, isLoading: txLoading, error: txError } = useQuery({
		queryKey: ["transactions", 1],
		queryFn: () => getAllTransactions({ page: 1, size: 5 }),
	});

	const assets = walletData?.walletAssets ?? [];
	const transactions = transactionsData?.data ?? [];

	const totalNgn = assets.reduce((s, a) => s + (a.balance ?? 0), 0);
	const series = useMemo(() => generateAreaSeries(30, totalNgn || 1_000), [totalNgn]);
	const topTransactions = transactions.slice(0, 5);

	const firstName = userData?.firstName ?? userData?.username ?? "there";
	const masked = "••••••";

	return (
		<div className="space-y-4 sm:space-y-6">
			<header className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end justify-between gap-3 sm:gap-4">
				<div>
					<p className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-brand-800">
						&#9670; Welcome back, {userLoading ? <Skeleton className="inline-block h-4 w-20" /> : firstName}
					</p>
					<h1 className="font-display text-xl sm:text-2xl font-bold tracking-[-0.02em]">Portfolio</h1>
				</div>
				<div className="flex gap-2">
					<Button asChild variant="outline" size="sm" className="rounded-full"><Link href="/receive"><ArrowDownToLine className="size-4" /><span className="hidden sm:inline">Receive</span></Link></Button>
					<Button asChild variant="outline" size="sm" className="rounded-full"><Link href="/send"><ArrowUpRight className="size-4" /><span className="hidden sm:inline">Send</span></Link></Button>
					<Button asChild size="sm" className="rounded-full btn-shine shadow-brutal-sm"><Link href="/trade"><ArrowLeftRight className="size-4" /><span className="hidden sm:inline">Trade</span></Link></Button>
				</div>
			</header>

			<div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
				<Card className="lg:col-span-2 border-2 border-custom-black rounded-[16px] sm:rounded-[20px]">
					<CardHeader className="p-4 sm:p-6 lg:p-8">
						<div className="flex items-start justify-between">
							<div>
								<CardDescription className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-brand-800">
									&#9670; Total balance <button onClick={() => setHideBalance(!hideBalance)} className="text-muted-foreground/70 hover:text-foreground">{hideBalance ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}<span className="sr-only">{hideBalance ? "Show" : "Hide"}</span></button>
								</CardDescription>
								{walletsLoading ? (
									<Skeleton className="mt-1 h-8 w-48" />
								) : (
									<Num as="div" className="mt-1 font-mono text-2xl sm:text-3xl lg:text-4xl font-bold tabular-nums tracking-tight" value={hideBalance ? masked : formatMoney(totalNgn, "NGN")} />
								)}
								<div className="mt-1 flex items-center gap-2 text-sm">
									<span className="text-muted-foreground">Portfolio value</span>
									{/* TODO: calculate from actual wallet data */}
									<span className="inline-flex items-center gap-1 text-success text-sm font-mono">
										<TrendingUp className="size-3.5" />+2.4% (24h)
									</span>
								</div>
							</div>
						</div>
					</CardHeader>
					<CardContent className="pt-0 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
						{walletsLoading ? (
							<Skeleton className="h-[220px] w-full" />
						) : (
							<PriceAreaChart data={series} currency="NGN" height={220} />
						)}
					</CardContent>
				</Card>

				<Card className="border-2 border-custom-black rounded-[16px] sm:rounded-[20px]">
					<CardHeader className="p-4 sm:p-6 lg:p-8">
						<CardTitle className="font-display font-bold tracking-[-0.02em]">Quick send</CardTitle>
						<CardDescription>Send USDT to a saved beneficiary.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
						{["Chidi (0x8aC…12f3)", "Mum (TXfM…9pA2)", "Freelance client (0x32b…aC11)"].map((b) => (
							<Link key={b} href="/send" className="flex items-center justify-between rounded-[16px] border-2 border-custom-black bg-card px-3 py-2.5 text-sm hover:bg-warm-beige transition-colors">
								<span className="truncate">{b}</span>
								<ArrowUpRight className="size-4 text-muted-foreground" />
							</Link>
						))}
						<Button variant="outline" className="w-full border-2 border-custom-black rounded-[16px]" asChild><Link href="/send">New beneficiary</Link></Button>
					</CardContent>
				</Card>
			</div>

			{/* Quick stats */}
			{/* TODO: wire to real API data */}
			<div className="flex flex-wrap gap-2">
				{[
					{ icon: BarChart3, label: "24h Volume", value: "₦0" },
					{ icon: ArrowUpDown, label: "Total Trades", value: "0" },
					{ icon: Clock, label: "Pending", value: "0" },
					{ icon: TrendingUp, label: "Avg Rate", value: "₦1,570" },
				].map((s) => (
					<div key={s.label} className="inline-flex items-center gap-2 rounded-full border-2 border-custom-black/10 bg-card-tinted px-3 py-1.5 text-xs">
						<s.icon className="size-3.5 text-muted-foreground" />
						<span className="text-muted-foreground">{s.label}</span>
						<span className="font-mono font-semibold tabular-nums">{s.value}</span>
					</div>
				))}
			</div>

			{/* Assets */}
			<Card className="border-2 border-custom-black rounded-[16px] sm:rounded-[20px]">
				<CardHeader className="flex-row items-center justify-between p-4 sm:p-6 lg:p-8">
					<CardTitle className="font-display font-bold tracking-[-0.02em]">Your assets</CardTitle>
					<Button asChild variant="ghost" size="sm"><Link href="/assets">See all</Link></Button>
				</CardHeader>
				<CardContent className="p-0">
					{walletsLoading ? (
						<TableSkeleton columns={5} rows={3} />
					) : walletsError ? (
						<div className="py-12 text-center px-4">
							<AlertCircle className="size-10 text-destructive/40 mx-auto mb-3" />
							<p className="font-display font-bold">Failed to load assets</p>
							<p className="text-sm text-muted-foreground mt-1">Please try refreshing the page.</p>
						</div>
					) : assets.length === 0 ? (
						<div className="py-12 text-center px-4 bg-grid">
							<div className="size-14 rounded-2xl bg-light-green border-[1.5px] border-custom-black inline-flex items-center justify-center mb-4">
								<ArrowUpDown className="size-6 text-custom-black" />
							</div>
							<p className="font-display font-bold text-lg">Your wallet is waiting</p>
							<p className="text-sm text-muted-foreground mt-1">Buy your first USDT in under 2 minutes</p>
							<Button asChild size="sm" className="mt-4 w-full sm:w-auto btn-shine shadow-brutal-sm"><Link href="/trade">Start with ₦5,000</Link></Button>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow className="bg-warm-beige/40">
									<TableHead className="px-3 sm:px-4">Asset</TableHead>
									<TableHead className="hidden sm:table-cell">Currency</TableHead>
									<TableHead className="hidden md:table-cell">Type</TableHead>
									<TableHead className="hidden md:table-cell">7d</TableHead>
									<TableHead className="text-right px-3 sm:px-4">Balance</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{assets.map((a) => (
									<TableRow key={a.currency}>
										<TableCell className="px-3 sm:px-4">
											<Link href={`/assets/${a.currency}`} className="flex items-center gap-2 sm:gap-3">
												<AssetLogo symbol={a.currency} />
												<div className="min-w-0">
													<div className="font-medium truncate">{a.name}</div>
													<div className="text-xs text-muted-foreground">{a.currency}</div>
												</div>
											</Link>
										</TableCell>
										<TableCell className="hidden sm:table-cell"><span className="text-sm font-mono">{a.currency}</span></TableCell>
										<TableCell className="hidden md:table-cell"><Badge variant="outline" className="capitalize">{a.type}</Badge></TableCell>
										<TableCell className="hidden md:table-cell">
											<Sparkline data={generateSparkData(a.currency || a.name)} width={80} height={24} />
										</TableCell>
										<TableCell className="text-right px-3 sm:px-4">
											<Num as="div" className="font-mono tabular-nums text-sm" value={hideBalance ? masked : (a.balance ?? 0).toFixed(2) + " " + a.currency} />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{/* Recent activity */}
			<Card className="border-2 border-custom-black rounded-[16px] sm:rounded-[20px]">
				<CardHeader className="flex-row items-center justify-between p-4 sm:p-6 lg:p-8">
					<CardTitle className="font-display font-bold tracking-[-0.02em]">Recent activity</CardTitle>
					<Button asChild variant="ghost" size="sm"><Link href="/transaction-history">View all</Link></Button>
				</CardHeader>
				<CardContent className="p-0">
					{txLoading ? (
						<TableSkeleton columns={5} rows={3} />
					) : txError ? (
						<div className="py-12 text-center px-4">
							<AlertCircle className="size-10 text-destructive/40 mx-auto mb-3" />
							<p className="font-display font-bold">Failed to load transactions</p>
							<p className="text-sm text-muted-foreground mt-1">Please try refreshing the page.</p>
						</div>
					) : topTransactions.length === 0 ? (
						<div className="py-12 text-center px-4 bg-grid">
							<div className="size-14 rounded-2xl bg-light-green border-[1.5px] border-custom-black inline-flex items-center justify-center mb-4">
								<ArrowUpDown className="size-6 text-custom-black" />
							</div>
							<p className="font-display font-bold text-lg">Your first trade is one tap away</p>
							<p className="text-sm text-muted-foreground mt-1">Buy or sell stablecoins and they'll show up here</p>
							<Button asChild size="sm" className="mt-4 w-full sm:w-auto btn-shine shadow-brutal-sm"><Link href="/trade">Make your first trade</Link></Button>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow className="bg-warm-beige/40">
									<TableHead className="px-3 sm:px-4">Transaction</TableHead>
									<TableHead className="px-3 sm:px-4">Amount</TableHead>
									<TableHead className="hidden sm:table-cell">Status</TableHead>
									<TableHead className="hidden md:table-cell text-right">When</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{topTransactions.map((t) => (
									<TableRow key={t.id}>
										<TableCell className="px-3 sm:px-4">
											<div className="flex items-center gap-2 font-medium capitalize text-sm">
												<span className={`size-2 rounded-full shrink-0 ${
													t.type === "deposit" || t.type === "buy" ? "bg-success" :
													t.type === "withdrawal" || t.type === "sell" ? "bg-danger" : "bg-info"
												}`} />
												{t.type} <span className="text-muted-foreground hidden sm:inline">· {t.orderNumber ?? t.id}</span>
											</div>
											{t.description && <div className="text-xs text-muted-foreground truncate max-w-[140px] sm:max-w-none">{t.description}</div>}
										</TableCell>
										<TableCell className="px-3 sm:px-4">
											<Num as="div" className="font-mono tabular-nums text-sm" value={hideBalance ? masked : (t.amount ?? 0) + " " + (t.currency ?? "")} />
										</TableCell>
										<TableCell className="hidden sm:table-cell">
											<Badge variant={t.status === "completed" ? "success" : t.status === "failed" ? "danger" : "warning"} className="capitalize">
												{t.status}
											</Badge>
										</TableCell>
										<TableCell className="hidden md:table-cell text-right text-sm text-muted-foreground">{relativeTime(t.dateCreated ?? t.date)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
