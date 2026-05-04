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
import { Wallet, AlertCircle } from "lucide-react";

export default function AssetsPage() {
	const { data: walletData, isLoading, error } = useQuery({
		queryKey: ["wallet"],
		queryFn: getUserWallet,
	});

	const assets = walletData?.walletAssets ?? [];

	return (
		<div className="space-y-6">
			<div>
				<p className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-brand-800">&#9670; Wallet</p>
				<h1 className="font-display text-2xl font-bold tracking-[-0.02em]">Assets</h1>
			</div>
			<Card className="border-2 border-custom-black rounded-[20px]">
				<CardHeader className="p-6 sm:p-8"><CardTitle className="font-display font-bold tracking-[-0.02em]">All supported assets</CardTitle></CardHeader>
				<CardContent className="p-0">
					{isLoading ? (
						<TableSkeleton columns={4} rows={5} />
					) : error ? (
						<div className="py-12 text-center">
							<AlertCircle className="size-10 text-destructive/40 mx-auto mb-3" />
							<p className="font-display font-bold">Failed to load assets</p>
							<p className="text-sm text-muted-foreground mt-1">Please try refreshing the page.</p>
						</div>
					) : assets.length === 0 ? (
						<div className="py-12 text-center">
							<Wallet className="size-10 text-muted-foreground/40 mx-auto mb-3" />
							<p className="font-display font-bold">No assets available</p>
							<p className="text-sm text-muted-foreground mt-1">Supported assets will appear here once they are configured.</p>
							<Button asChild size="sm" className="mt-4 w-full sm:w-auto shadow-brutal-sm"><Link href="/trade">Start trading</Link></Button>
						</div>
					) : (
					<Table>
						<TableHeader>
							<TableRow className="bg-warm-beige/40">
								<TableHead>Asset</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Address</TableHead>
								<TableHead className="text-right">Balance</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{assets.map((a) => (
								<TableRow key={a.currency}>
									<TableCell>
										<Link href={`/assets/${a.currency}`} className="flex items-center gap-2 sm:gap-3">
											<AssetLogo symbol={a.currency} />
											<div className="min-w-0">
												<div className="font-medium truncate">{a.name}</div>
												<div className="text-xs text-muted-foreground">{a.currency}</div>
											</div>
										</Link>
									</TableCell>
									<TableCell><Badge variant="outline" className="capitalize">{a.type}</Badge></TableCell>
									<TableCell>
										<code className="font-mono tabular-nums text-xs text-muted-foreground truncate max-w-[160px] block">
											{a.address || "—"}
										</code>
									</TableCell>
									<TableCell className="text-right">
										<Num as="div" className="font-mono tabular-nums" value={(a.balance ?? 0).toFixed(2) + " " + a.currency} />
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
