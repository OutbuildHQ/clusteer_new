import Link from "next/link";
import { notFound } from "next/navigation";
import { ASSETS, generateCandles, generateAreaSeries } from "@/lib/mock-data";
import { formatMoney, formatPct } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { ChainBadge } from "@/components/primitives/chain-badge";
import { Num } from "@/components/primitives/num";
import { PriceAreaChart } from "@/components/primitives/price-area-chart";

export default async function AssetDetailPage({ params }: { params: Promise<{ asset: string }> }) {
	const { asset } = await params;
	const a = ASSETS.find((x) => x.symbol.toLowerCase() === asset.toLowerCase());
	if (!a) notFound();
	const series = generateAreaSeries(30, a.priceNgn);
	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<AssetLogo symbol={a.symbol} size="xl" />
					<div>
						<h1 className="font-display text-2xl font-bold tracking-tight">{a.name} <span className="text-muted-foreground">{a.symbol}</span></h1>
						<div className="mt-1 flex items-baseline gap-3">
							<Num className="text-xl font-semibold" value={formatMoney(a.priceNgn, "NGN", { decimals: 0 })} />
							<Num tone={a.change24h >= 0 ? "positive" : "negative"} value={formatPct(a.change24h)} />
						</div>
					</div>
				</div>
				<div className="flex gap-2">
					<Button asChild variant="outline"><Link href={`/assets/${a.symbol}/receive`}>Receive</Link></Button>
					<Button asChild variant="outline"><Link href={`/assets/${a.symbol}/send`}>Send</Link></Button>
					<Button asChild><Link href={`/trade?asset=${a.symbol}`}>Trade</Link></Button>
				</div>
			</div>

			<Card>
				<CardHeader className="flex-row items-center justify-between">
					<CardTitle>Price · NGN</CardTitle>
					<Tabs defaultValue="1M">
						<TabsList>
							{["1D", "1W", "1M", "3M", "1Y"].map((r) => <TabsTrigger key={r} value={r}>{r}</TabsTrigger>)}
						</TabsList>
					</Tabs>
				</CardHeader>
				<CardContent><PriceAreaChart data={series} currency="NGN" height={320} /></CardContent>
			</Card>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Card>
					<CardHeader><CardTitle>Your holdings</CardTitle></CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-baseline justify-between">
							<Num className="font-display text-2xl font-bold" value={a.balance + " " + a.symbol} />
							<Num tone="muted" value={formatMoney(a.balanceNgn, "NGN", { decimals: 0 })} />
						</div>
						<div className="flex gap-2 pt-2">
							<Button asChild variant="outline" size="sm"><Link href={`/assets/${a.symbol}/receive`}>Receive</Link></Button>
							<Button asChild variant="outline" size="sm"><Link href={`/assets/${a.symbol}/send`}>Send</Link></Button>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader><CardTitle>Supported networks</CardTitle></CardHeader>
					<CardContent className="flex flex-wrap gap-2">
						{a.chains.map((c) => <ChainBadge key={c} chain={c} />)}
						<p className="mt-3 w-full text-xs text-muted-foreground">Pick the right network when sending — Clusteer will auto-select the cheapest route.</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
