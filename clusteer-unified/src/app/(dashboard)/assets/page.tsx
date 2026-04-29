import Link from "next/link";
import { ASSETS } from "@/lib/mock-data";
import { formatMoney, formatPct } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Num } from "@/components/primitives/num";
import { Sparkline } from "@/components/primitives/sparkline";
import { Wallet } from "lucide-react";

export default function AssetsPage() {
	return (
		<div className="space-y-6">
			<h1 className="font-display text-2xl font-bold tracking-tight">Assets</h1>
			<Card>
				<CardHeader><CardTitle>All supported assets</CardTitle></CardHeader>
				<CardContent className="p-0">
					{ASSETS.length === 0 ? (
						<div className="py-12 text-center">
							<Wallet className="size-10 text-muted-foreground/40 mx-auto mb-3" />
							<p className="font-medium">No assets available</p>
							<p className="text-sm text-muted-foreground mt-1">Supported assets will appear here once they are configured.</p>
							<Button asChild size="sm" className="mt-4 w-full sm:w-auto"><Link href="/trade">Start trading</Link></Button>
						</div>
					) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Asset</TableHead>
								<TableHead>Price (NGN)</TableHead>
								<TableHead className="hidden md:table-cell">Price (USD)</TableHead>
								<TableHead className="hidden sm:table-cell">24h</TableHead>
								<TableHead className="hidden lg:table-cell">7d</TableHead>
								<TableHead className="text-right">Balance</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{ASSETS.map((a) => (
								<TableRow key={a.symbol}>
									<TableCell>
										<Link href={`/assets/${a.symbol}`} className="flex items-center gap-2 sm:gap-3">
											<AssetLogo symbol={a.symbol} />
											<div className="min-w-0">
												<div className="font-medium truncate">{a.name}</div>
												<div className="text-xs text-muted-foreground">{a.symbol}</div>
											</div>
										</Link>
									</TableCell>
									<TableCell><Num value={formatMoney(a.priceNgn, "NGN", { decimals: 0 })} /></TableCell>
									<TableCell className="hidden md:table-cell"><Num value={formatMoney(a.priceUsd, "USD")} /></TableCell>
									<TableCell className="hidden sm:table-cell"><Num tone={a.change24h >= 0 ? "positive" : "negative"} value={formatPct(a.change24h)} /></TableCell>
									<TableCell className="hidden lg:table-cell"><Sparkline data={a.sparkline} width={90} height={28} /></TableCell>
									<TableCell className="text-right">
										<Num as="div" value={a.balance.toFixed(2) + " " + a.symbol} />
										<Num as="div" className="text-xs" tone="muted" value={formatMoney(a.balanceNgn, "NGN", { decimals: 0 })} />
									</TableCell>
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
