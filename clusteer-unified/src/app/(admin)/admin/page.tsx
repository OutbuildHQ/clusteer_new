import Link from "next/link";
import { ADMIN_TXNS, KYC_QUEUE, USERS, WALLETS, generateAreaSeries } from "@/lib/mock-data";
import { formatMoney, relativeTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Num } from "@/components/primitives/num";
import { PriceAreaChart } from "@/components/primitives/price-area-chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Users as UsersIcon, ShieldCheck, Wallet, TrendingUp } from "lucide-react";

export default function AdminOverview() {
	const volumeSeries = generateAreaSeries(30, 180_000_000);
	const totalUsers = USERS.length * 2418;
	const totalAum = WALLETS.reduce((s, w) => s + w.balanceUsd, 0) * 1580;
	const volume24h = 1_482_300_000;
	const pendingKyc = KYC_QUEUE.length;
	const flaggedTxns = ADMIN_TXNS.filter((t) => t.flagged).length;

	return (
		<div className="space-y-6">
			<header className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="font-display text-2xl font-bold tracking-tight">Operations overview</h1>
					<p className="text-sm text-muted-foreground">Real-time platform health · {new Date().toLocaleDateString("en-GB", { dateStyle: "long" })}</p>
				</div>
			</header>

			{/* Stats */}
			<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
				<StatCard icon={<UsersIcon className="size-4" />} label="Total users" value={totalUsers.toLocaleString()} change="+412 today" tone="positive" />
				<StatCard icon={<TrendingUp className="size-4" />} label="24h volume" value={formatMoney(volume24h, "NGN", { decimals: 0, compact: true })} change="+18.4%" tone="positive" />
				<StatCard icon={<Wallet className="size-4" />} label="Assets under custody" value={formatMoney(totalAum, "NGN", { decimals: 0, compact: true })} change="+2.1%" tone="positive" />
				<StatCard icon={<ShieldCheck className="size-4" />} label="Pending KYC" value={pendingKyc.toString()} change={`${flaggedTxns} flagged txns`} tone="muted" />
			</div>

			{/* Volume chart */}
			<Card>
				<CardHeader className="flex-row items-start justify-between">
					<div>
						<CardTitle>Platform volume</CardTitle>
						<CardDescription>30-day trailing · NGN equivalent</CardDescription>
					</div>
					<Button variant="ghost" size="sm" asChild><Link href="/admin/reports">Full reports →</Link></Button>
				</CardHeader>
				<CardContent><PriceAreaChart data={volumeSeries} currency="NGN" height={240} /></CardContent>
			</Card>

			{/* Queues */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<Card>
					<CardHeader className="flex-row items-center justify-between">
						<div>
							<CardTitle>KYC queue</CardTitle>
							<CardDescription>{pendingKyc} pending submissions</CardDescription>
						</div>
						<Button variant="ghost" size="sm" asChild><Link href="/admin/kyc">Review all →</Link></Button>
					</CardHeader>
					<CardContent className="p-0">
						<Table>
							<TableBody>
								{KYC_QUEUE.slice(0, 4).map((k) => (
									<TableRow key={k.id}>
										<TableCell>
											<div className="font-medium">{k.userName}</div>
											<div className="text-xs text-muted-foreground">{k.userEmail}</div>
										</TableCell>
										<TableCell><Badge variant="info">Tier {k.tier}</Badge></TableCell>
										<TableCell className="text-right text-xs text-muted-foreground">{relativeTime(k.submittedAt)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex-row items-center justify-between">
						<div>
							<CardTitle>Flagged transactions</CardTitle>
							<CardDescription>Require manual review</CardDescription>
						</div>
						<Button variant="ghost" size="sm" asChild><Link href="/admin/transactions">See all →</Link></Button>
					</CardHeader>
					<CardContent className="p-0">
						<Table>
							<TableBody>
								{ADMIN_TXNS.filter((t) => t.flagged).map((t) => (
									<TableRow key={t.id}>
										<TableCell>
											<div className="flex items-center gap-2"><AssetLogo symbol={t.asset} size="sm" /><code className="mono text-xs">{t.id}</code></div>
											<div className="text-xs text-muted-foreground mt-0.5">{t.userName}</div>
										</TableCell>
										<TableCell><Num value={formatMoney(t.amountNgn, "NGN", { decimals: 0 })} /></TableCell>
										<TableCell>
											<div className="inline-flex items-center gap-1.5 text-xs text-warning">
												<AlertTriangle className="size-3" />{t.reason}
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>

			{/* Wallet health */}
			<Card>
				<CardHeader>
					<CardTitle>Wallet pool health</CardTitle>
					<CardDescription>Hot, warm, cold & multi-sig pools</CardDescription>
				</CardHeader>
				<CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
					{WALLETS.map((w) => {
						const inRange = !w.threshold || (w.balance >= w.threshold.min && w.balance <= w.threshold.max);
						const pct = w.threshold ? Math.min(100, (w.balance / w.threshold.max) * 100) : 60;
						return (
							<div key={w.id} className="rounded-lg border border-border bg-card p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<AssetLogo symbol={w.asset} size="sm" />
										<span className="font-medium">{w.asset}</span>
										<Badge variant={w.type === "cold" ? "info" : w.type === "hot" ? "warning" : w.type === "multi-sig" ? "success" : "secondary"} className="capitalize">{w.type}</Badge>
									</div>
									<span className="text-xs text-muted-foreground">{w.chain}</span>
								</div>
								<Num as="div" className="mt-2 font-display text-xl font-bold" value={w.balance.toLocaleString() + " " + w.asset} />
								<Num as="div" tone="muted" className="text-xs" value={"$" + w.balanceUsd.toLocaleString()} />
								{w.threshold && (
									<>
										<div className="mt-3 h-1.5 rounded-full bg-muted">
											<div className={`h-full rounded-full ${inRange ? "bg-success" : "bg-warning"}`} style={{ width: `${pct}%` }} />
										</div>
										<div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
											<span>min {w.threshold.min.toLocaleString()}</span>
											<span>max {w.threshold.max.toLocaleString()}</span>
										</div>
									</>
								)}
								{w.signers && <div className="mt-2 text-xs text-muted-foreground">{w.required}-of-{w.signers} multi-sig</div>}
							</div>
						);
					})}
				</CardContent>
			</Card>
		</div>
	);
}

function StatCard({ icon, label, value, change, tone }: { icon: React.ReactNode; label: string; value: string; change: string; tone: string }) {
	return (
		<Card>
			<CardContent className="p-5">
				<div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</div>
				<Num as="div" className="mt-2 font-display text-2xl font-bold tracking-tight" value={value} />
				<Num as="div" className="mt-1 text-xs" tone={tone as any} value={change} />
			</CardContent>
		</Card>
	);
}
