import Link from "next/link";
import { ASSETS } from "@/lib/mock-data";
import { formatMoney, formatPct } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Num } from "@/components/primitives/num";
import { Sparkline } from "@/components/primitives/sparkline";

export default function AssetsPage() {
	return (
		<div className="space-y-6">
			<h1 className="font-display text-2xl font-bold tracking-tight">Assets</h1>
			<Card>
				<CardHeader><CardTitle>All supported assets</CardTitle></CardHeader>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Asset</TableHead>
								<TableHead>Price (NGN)</TableHead>
								<TableHead>Price (USD)</TableHead>
								<TableHead>24h</TableHead>
								<TableHead>7d</TableHead>
								<TableHead className="text-right">Your balance</TableHead>
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
									<TableCell><Num value={formatMoney(a.priceUsd, "USD")} /></TableCell>
									<TableCell><Num tone={a.change24h >= 0 ? "positive" : "negative"} value={formatPct(a.change24h)} /></TableCell>
									<TableCell><Sparkline data={a.sparkline} width={90} height={28} /></TableCell>
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
		</div>
	);
}
