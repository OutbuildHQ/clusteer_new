"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Num } from "@/components/primitives/num";
import { formatMoney, formatCrypto } from "@/lib/utils";

/* Placeholder stablecoin data for landing page swap widget */
const ASSETS = [
	{ symbol: "USDT", name: "Tether", priceNgn: 1_570 },
	{ symbol: "USDC", name: "USD Coin", priceNgn: 1_565 },
];
import { ArrowDownUp, ArrowRight, RefreshCw } from "lucide-react";

// Clusteer only trades stablecoins: USDT and USDC
const STABLECOIN_OPTIONS = ASSETS.filter((a) => a.symbol === "USDT" || a.symbol === "USDC");

export function HeroSwap() {
	const [mode, setMode] = useState<"buy" | "sell">("buy");
	const [amount, setAmount] = useState("100000");
	const [selected, setSelected] = useState("USDT");

	const asset = STABLECOIN_OPTIONS.find((a) => a.symbol === selected)!;
	const amtNum = parseFloat(amount.replace(/,/g, "")) || 0;

	const receive = useMemo(() => {
		if (mode === "buy") return amtNum / asset.priceNgn;
		return amtNum * asset.priceNgn;
	}, [mode, amtNum, asset.priceNgn]);

	const fee = amtNum * 0.0075;

	return (
		<Card className="hidden lg:block shadow-xl border-border/60 bg-card/95 backdrop-blur">
			<CardContent className="p-5">
				<Tabs
					value={mode}
					onValueChange={(v) => setMode(v as "buy" | "sell")}
				>
					<TabsList className="grid w-full grid-cols-2 mb-5">
						<TabsTrigger value="buy">Buy</TabsTrigger>
						<TabsTrigger value="sell">Sell</TabsTrigger>
					</TabsList>
				</Tabs>

				{/* You pay */}
				<div className="rounded-xl border border-border bg-muted/40 p-4">
					<p className="text-xs font-medium text-muted-foreground mb-2">
						You {mode === "buy" ? "pay" : "send"}
					</p>
					<div className="flex items-center gap-3">
						<Input
							type="text"
							inputMode="decimal"
							value={amount}
							onChange={(e) =>
								setAmount(e.target.value.replace(/[^0-9.,]/g, ""))
							}
							className="border-0 bg-transparent p-0 text-2xl font-display font-bold shadow-none focus-visible:ring-0 tabular-nums"
							placeholder="0"
						/>
						<span className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium">
							{mode === "buy" ? (
								<>
									<AssetLogo symbol="NGN" size="sm" />
									NGN
								</>
							) : (
								<>
									<AssetLogo symbol={selected} size="sm" />
									{selected}
								</>
							)}
						</span>
					</div>
				</div>

				{/* Swap indicator */}
				<div className="relative my-2 flex justify-center">
					<button
						onClick={() => setMode(mode === "buy" ? "sell" : "buy")}
						className="z-10 flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
						aria-label="Switch direction"
					>
						<ArrowDownUp className="size-4" />
					</button>
				</div>

				{/* You receive */}
				<div className="rounded-xl border border-border bg-muted/40 p-4">
					<p className="text-xs font-medium text-muted-foreground mb-2">
						You receive
					</p>
					<div className="flex items-center gap-3">
						<Num
							value={
								mode === "buy"
									? formatCrypto(receive, "")
									: formatMoney(receive, "NGN", { decimals: 2 })
							}
							className="min-w-0 flex-1 truncate text-2xl font-display font-bold"
						/>
						{mode === "buy" ? (
							<div className="flex shrink-0 gap-1">
								{STABLECOIN_OPTIONS.map((a) => (
									<button
										key={a.symbol}
										onClick={() => setSelected(a.symbol)}
										className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors ${
											selected === a.symbol
												? "border-primary bg-primary/10 text-primary"
												: "border-border bg-card text-muted-foreground hover:border-primary/40"
										}`}
									>
										<AssetLogo symbol={a.symbol} size="sm" />
										{a.symbol}
									</button>
								))}
							</div>
						) : (
							<span className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium">
								<AssetLogo symbol="NGN" size="sm" />
								NGN
							</span>
						)}
					</div>
				</div>

				{/* Rate + fee */}
				<div className="mt-4 space-y-2 text-xs text-muted-foreground">
					<div className="flex items-center justify-between">
						<span className="inline-flex items-center gap-1">
							<RefreshCw className="size-3" /> Rate
						</span>
						<Num
							value={`1 ${selected} = ${formatMoney(asset.priceNgn, "NGN", { decimals: 0 })}`}
							className="text-xs font-medium text-foreground"
						/>
					</div>
					<div className="flex items-center justify-between">
						<span>Fee (0.75%)</span>
						<Num
							value={formatMoney(fee, "NGN", { decimals: 2 })}
							className="text-xs"
							tone="muted"
						/>
					</div>
				</div>

				{/* CTA */}
				<Button asChild className="mt-5 w-full" size="lg">
					<Link href="/signup">
						{mode === "buy" ? "Buy" : "Sell"} {selected} <ArrowRight className="size-4" />
					</Link>
				</Button>
			</CardContent>
		</Card>
	);
}
