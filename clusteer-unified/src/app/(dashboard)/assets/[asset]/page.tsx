"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUserWallet } from "@/lib/api/wallet/queries";
import { generateAreaSeries } from "@/lib/mock-data";
import { formatMoney, formatPct } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { ChainBadge } from "@/components/primitives/chain-badge";
import { Num } from "@/components/primitives/num";
import { PriceAreaChart } from "@/components/primitives/price-area-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

const CHAIN_MAP: Record<string, string[]> = {
	USDT: ["Tron", "BSC", "Ethereum"],
	USDC: ["Ethereum", "Solana", "Polygon"],
	NGN: [],
};

export default function AssetDetailPage({ params }: { params: Promise<{ asset: string }> }) {
	const { asset } = use(params);
	const { data: walletData, isLoading, error } = useQuery({ queryKey: ["wallet"], queryFn: getUserWallet });

	if (isLoading) {
		return (
			<div className="space-y-6">
				<Skeleton className="h-12 w-64" />
				<Skeleton className="h-[320px] w-full rounded-xl" />
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Skeleton className="h-40 rounded-xl" />
					<Skeleton className="h-40 rounded-xl" />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="py-12 text-center">
				<AlertCircle className="size-10 text-muted-foreground/40 mx-auto mb-3" />
				<p className="font-medium">Failed to load asset data</p>
				<p className="text-sm text-muted-foreground mt-1">Please check your connection and try again.</p>
			</div>
		);
	}

	const assets = walletData?.walletAssets ?? [];
	const a = assets.find((w) => w.currency.toLowerCase() === asset.toLowerCase());

	if (!a) {
		return (
			<div className="py-12 text-center">
				<p className="font-medium">Asset not found</p>
				<p className="text-sm text-muted-foreground mt-1">{asset.toUpperCase()} is not in your wallet.</p>
				<Button asChild size="sm" className="mt-4"><Link href="/assets">Back to assets</Link></Button>
			</div>
		);
	}

	const priceNgn = a.currency === "NGN" ? 1 : 1570; // TODO: get from exchange rate API
	const balanceNgn = a.balance * priceNgn;
	const chains = CHAIN_MAP[a.currency] ?? [];
	const series = generateAreaSeries(30, priceNgn);

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<AssetLogo symbol={a.currency} size="xl" />
					<div>
						<h1 className="font-display text-2xl font-bold tracking-tight">{a.name} <span className="text-muted-foreground">{a.currency}</span></h1>
						<div className="mt-1 flex items-baseline gap-3">
							<Num className="text-xl font-semibold" value={formatMoney(priceNgn, "NGN", { decimals: 0 })} />
						</div>
					</div>
				</div>
				<div className="flex gap-2">
					<Button asChild variant="outline"><Link href={`/assets/${a.currency}/receive`}>Receive</Link></Button>
					<Button asChild variant="outline"><Link href="/send">Send</Link></Button>
					<Button asChild><Link href={`/trade?asset=${a.currency}`}>Trade</Link></Button>
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
							<Num className="font-display text-2xl font-bold" value={a.balance.toFixed(2) + " " + a.currency} />
							<Num tone="muted" value={formatMoney(balanceNgn, "NGN", { decimals: 0 })} />
						</div>
						<div className="flex gap-2 pt-2">
							<Button asChild variant="outline" size="sm"><Link href={`/assets/${a.currency}/receive`}>Receive</Link></Button>
							<Button asChild variant="outline" size="sm"><Link href="/send">Send</Link></Button>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader><CardTitle>Supported networks</CardTitle></CardHeader>
					<CardContent className="flex flex-wrap gap-2">
						{chains.length > 0 ? (
							<>
								{chains.map((c) => <ChainBadge key={c} chain={c} />)}
								<p className="mt-3 w-full text-xs text-muted-foreground">Pick the right network when sending — Clusteer will auto-select the cheapest route.</p>
							</>
						) : (
							<p className="text-sm text-muted-foreground">Fiat currency — bank transfer only.</p>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
