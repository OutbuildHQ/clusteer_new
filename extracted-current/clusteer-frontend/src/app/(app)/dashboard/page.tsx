import Link from "next/link";
import { ASSETS, ORDERS, CURRENT_USER, generateAreaSeries } from "@/lib/mock-data";
import { formatMoney, formatPct, relativeTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { ChainBadge } from "@/components/primitives/chain-badge";
import { Num } from "@/components/primitives/num";
import { Sparkline } from "@/components/primitives/sparkline";
import { PriceAreaChart } from "@/components/primitives/price-area-chart";
import { ArrowDownToLine, ArrowUpRight, ArrowLeftRight, Eye, EyeOff } from "lucide-react";

export default function DashboardPage() {
	const totalNgn = ASSETS.reduce((s, a) => s + a.balanceNgn, 0);
	const series = generateAreaSeries(30, totalNgn);
	const topOrders = ORDERS.slice(0, 5);

	return (
		<div className="space-y-6">
			<header className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="text-sm text-muted-foreground">Welcome back, {CURRENT_USER.firstName}</p>
					<h1 className="font-display text-2xl font-bold tracking-tight">Portfolio</h1>
				</div>
				<div className="flex gap-2">
					<Button asChild variant="outline" size="sm"><Link href="/receive"><ArrowDownToLine className="size-4" />Receive</Link></Button>
					<Button asChild variant="outline" size="sm"><Link href="/send"><ArrowUpRight className="size-4" />Send</Link></Button>
					<Button asChild size="sm"><Link href="/trade"><ArrowLeftRight className="size-4" />Trade</Link></Button>
				</div>
			</header>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<Card className="lg:col-span-2">
					<CardHeader>
						<div className="flex items-start justify-between">
							<div>
								<CardDescription className="inline-flex items-center gap-2">
									Total balance <button className="text-muted-foreground/70 hover:text-foreground"><EyeOff className="size-3.5" /><span className="sr-only">Hide</span></button>
								</CardDescription>
								<Num as="div" className="mt-1 font-display text-3xl font-bold tracking-tight" value={formatMoney(totalNgn, "NGN")} />
								<div className="mt-1 flex items-center gap-2 text-sm">
									<Num tone="positive" value="+₦428,211" />
									<span className="text-muted-foreground">· 30 days</span>
								</div>
							</div>
						</div>
					</CardHeader>
					<CardContent className="pt-0">
						<PriceAreaChart data={series} currency="NGN" height={220} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Quick send</CardTitle>
						<CardDescription>Send USDT to a saved beneficiary.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{["Chidi (0x8aC…12f3)", "Mum (TXfM…9pA2)", "Freelance client (0x32b…aC11)"].map((b) => (
							<Link key={b} href="/send" className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-muted">
								<span className="truncate">{b}</span>
								<ArrowUpRight className="size-4 text-muted-foreground" />
							</Link>
						))}
						<Button variant="outline" className="w-full" asChild><Link href="/send">New beneficiary</Link></Button>
					</CardContent>
				</Card>
			</div>

			{/* Assets */}
			<Card>
				<CardHeader className="flex-row items-center justify-between">
					<CardTitle>Your assets</CardTitle>
					<Button asChild variant="ghost" size="sm"><Link href="/assets">See all</Link></Button>
				</CardHeader>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Asset</TableHead>
								<TableHead>Price</TableHead>
								<TableHead>24h</TableHead>
								<TableHead className="hidden md:table-cell">7d</TableHead>
								<TableHead className="text-right">Balance</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{ASSETS.map((a) => (
								<TableRow key={a.symbol}>
									<TableCell>
										<Link href={`/assets/${a.symbol}`} className="flex items-center gap-3">
											<AssetLogo symbol={a.symbol} />
											<div>
												<div className="font-medium">{a.name}</div>
												<div className="text-xs text-muted-foreground">{a.symbol}</div>
											</div>
										</Link>
									</TableCell>
									<TableCell><Num value={formatMoney(a.priceNgn, "NGN", { decimals: 0 })} /></TableCell>
									<TableCell><Num tone={a.change24h >= 0 ? "positive" : "negative"} value={formatPct(a.change24h)} /></TableCell>
									<TableCell className="hidden md:table-cell"><Sparkline data={a.sparkline} width={90} height={28} /></TableCell>
									<TableCell className="text-right">
										<Num as="div" value={a.balance.toFixed(a.balance > 1 ? 4 : 6) + " " + a.symbol} />
										<Num as="div" className="text-xs" tone="muted" value={formatMoney(a.balanceNgn, "NGN", { decimals: 0 })} />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Recent orders */}
			<Card>
				<CardHeader className="flex-row items-center justify-between">
					<CardTitle>Recent activity</CardTitle>
					<Button asChild variant="ghost" size="sm"><Link href="/transactions">View all</Link></Button>
				</CardHeader>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Order</TableHead>
								<TableHead>Asset</TableHead>
								<TableHead>Amount</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">When</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{topOrders.map((o) => (
								<TableRow key={o.id}>
									<TableCell>
										<div className="font-medium capitalize">{o.kind} <span className="text-muted-foreground">· {o.id}</span></div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<AssetLogo symbol={o.asset} size="sm" />
											<span className="text-sm">{o.asset}</span>
											<ChainBadge chain={o.chain} />
										</div>
									</TableCell>
									<TableCell>
										<Num as="div" value={o.amount + " " + o.asset} />
										<Num as="div" tone="muted" className="text-xs" value={formatMoney(o.amountNgn, "NGN", { decimals: 0 })} />
									</TableCell>
									<TableCell>
										<Badge variant={o.status === "completed" ? "success" : o.status === "failed" ? "danger" : "warning"} className="capitalize">
											{o.status}
										</Badge>
									</TableCell>
									<TableCell className="text-right text-sm text-muted-foreground">{relativeTime(o.createdAt)}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
