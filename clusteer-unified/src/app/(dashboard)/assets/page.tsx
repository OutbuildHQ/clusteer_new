"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUserWallet } from "@/lib/api/wallet/queries";
import { formatMoney } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Num } from "@/components/primitives/num";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/primitives/table-skeleton";
import { Sparkline } from "@/components/primitives/sparkline";
import { generateSparkData } from "@/lib/spark-utils";
import { Wallet, AlertCircle } from "lucide-react";

export default function AssetsPage() {
	const { data: walletData, isLoading, error } = useQuery({
		queryKey: ["wallet"],
		queryFn: getUserWallet,
	});

	const assets = walletData?.walletAssets ?? [];

	return (
		<div className="space-y-4 sm:space-y-6">
			<div>
				<p className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-brand-800">&#9670; Wallet</p>
				<h1 className="font-display text-xl sm:text-2xl font-bold tracking-[-0.02em]">Assets</h1>
			</div>
			<Card className="border-2 border-custom-black rounded-[16px] sm:rounded-[20px]">
				<CardHeader className="p-4 sm:p-6 lg:p-8"><CardTitle className="font-display font-bold tracking-[-0.02em]">All supported assets</CardTitle></CardHeader>
				<CardContent className="p-0">
					{isLoading ? (
						<TableSkeleton columns={4} rows={5} />
					) : error ? (
						<div className="py-12 text-center px-4">
							<AlertCircle className="size-10 text-destructive/40 mx-auto mb-3" />
							<p className="font-display font-bold">Failed to load assets</p>
							<p className="text-sm text-muted-foreground mt-1">Please try refreshing the page.</p>
						</div>
					) : assets.length === 0 ? (
						<div className="py-12 text-center px-4 bg-grid">
							<div className="size-14 rounded-2xl bg-light-green border-[1.5px] border-custom-black inline-flex items-center justify-center mb-4">
								<Wallet className="size-6 text-custom-black" />
							</div>
							<p className="font-display font-bold text-lg">Your wallet is waiting</p>
							<p className="text-sm text-muted-foreground mt-1">Supported assets will appear once you start trading</p>
							<Button asChild size="sm" className="mt-4 w-full sm:w-auto btn-shine shadow-brutal-sm"><Link href="/trade">Start trading</Link></Button>
						</div>
					) : (
					<Table>
						<TableHeader>
							<TableRow className="bg-warm-beige/40">
								<TableHead className="px-3 sm:px-4">Asset</TableHead>
								<TableHead className="hidden sm:table-cell">Type</TableHead>
								<TableHead className="hidden md:table-cell">Address</TableHead>
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
									<TableCell className="hidden sm:table-cell"><Badge variant="outline" className="capitalize">{a.type}</Badge></TableCell>
									<TableCell className="hidden md:table-cell">
										<code className="font-mono tabular-nums text-xs text-muted-foreground truncate max-w-[160px] block">
											{a.address || "\u2014"}
										</code>
									</TableCell>
									<TableCell className="hidden md:table-cell">
										<Sparkline data={generateSparkData(a.currency || a.name)} width={80} height={24} />
									</TableCell>
									<TableCell className="text-right px-3 sm:px-4">
										<Num as="div" className="font-mono tabular-nums text-sm" value={(a.balance ?? 0).toFixed(2) + " " + a.currency} />
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
