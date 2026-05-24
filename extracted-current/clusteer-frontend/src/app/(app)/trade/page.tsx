"use client";

import { useState, useMemo } from "react";
import { ASSETS } from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Num } from "@/components/primitives/num";
import { ArrowDown } from "lucide-react";
import { toast } from "sonner";

const FIAT = { symbol: "NGN", name: "Nigerian Naira" };

export default function TradePage() {
	const [mode, setMode] = useState<"buy" | "sell" | "swap">("buy");
	const [asset, setAsset] = useState("BTC");
	const [pair, setPair] = useState("USDT");
	const [amount, setAmount] = useState("");

	const selected = ASSETS.find((a) => a.symbol === asset)!;
	const pairAsset = ASSETS.find((a) => a.symbol === pair)!;

	const amtNum = parseFloat(amount) || 0;
	const youPay = mode === "buy" ? amtNum : amtNum * selected.priceNgn;
	const youGet = mode === "buy" ? amtNum / selected.priceNgn : amtNum;
	const swapGet = mode === "swap" ? (amtNum * selected.priceNgn) / pairAsset.priceNgn : 0;
	const rate = selected.priceNgn;

	const feePct = 0.0075; // 0.75%
	const feeAmt = useMemo(() => {
		if (mode === "buy") return amtNum * feePct;
		if (mode === "sell") return amtNum * selected.priceNgn * feePct;
		return amtNum * selected.priceNgn * feePct;
	}, [mode, amtNum, selected.priceNgn]);

	const submit = () => {
		if (!amount) return toast.error("Enter an amount");
		toast.success(`Order placed: ${mode === "buy" ? "Buy" : mode === "sell" ? "Sell" : "Swap"} ${asset}`);
		setAmount("");
	};

	return (
		<div className="max-w-2xl mx-auto">
			<h1 className="font-display text-2xl font-bold tracking-tight mb-6">Trade</h1>
			<Card>
				<CardHeader>
					<Tabs value={mode} onValueChange={(v) => setMode(v as "buy" | "sell" | "swap")}>
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="buy">Buy</TabsTrigger>
							<TabsTrigger value="sell">Sell</TabsTrigger>
							<TabsTrigger value="swap">Swap</TabsTrigger>
						</TabsList>
					</Tabs>
				</CardHeader>

				<CardContent className="space-y-3">
					{mode === "buy" && (
						<>
							<InputPanel
								label="You pay"
								amount={amount}
								onAmount={setAmount}
								asset={<FiatPill />}
								helper="From NGN wallet · ₦248,400 available"
								unit="NGN"
							/>
							<ArrowDivider />
							<InputPanel
								label="You receive"
								amount={amtNum ? (amtNum / selected.priceNgn).toFixed(8) : ""}
								readOnly
								asset={<AssetSelect value={asset} onChange={setAsset} />}
								helper={`1 ${asset} ≈ ${formatMoney(rate, "NGN", { decimals: 0 })}`}
								unit={asset}
							/>
						</>
					)}
					{mode === "sell" && (
						<>
							<InputPanel
								label="You sell"
								amount={amount}
								onAmount={setAmount}
								asset={<AssetSelect value={asset} onChange={setAsset} />}
								helper={`Available: ${selected.balance} ${asset}`}
								unit={asset}
							/>
							<ArrowDivider />
							<InputPanel
								label="You receive"
								amount={amtNum ? (amtNum * selected.priceNgn).toFixed(0) : ""}
								readOnly
								asset={<FiatPill />}
								helper={`1 ${asset} ≈ ${formatMoney(rate, "NGN", { decimals: 0 })}`}
								unit="NGN"
							/>
						</>
					)}
					{mode === "swap" && (
						<>
							<InputPanel
								label="From"
								amount={amount}
								onAmount={setAmount}
								asset={<AssetSelect value={asset} onChange={setAsset} />}
								helper={`Available: ${selected.balance} ${asset}`}
								unit={asset}
							/>
							<ArrowDivider />
							<InputPanel
								label="To"
								amount={amtNum ? swapGet.toFixed(8) : ""}
								readOnly
								asset={<AssetSelect value={pair} onChange={setPair} />}
								helper={`1 ${asset} ≈ ${(selected.priceNgn / pairAsset.priceNgn).toFixed(8)} ${pair}`}
								unit={pair}
							/>
						</>
					)}

					<div className="rounded-lg bg-muted/50 p-3 text-xs space-y-1.5">
						<div className="flex justify-between"><span className="text-muted-foreground">Rate</span><Num value={`1 ${asset} = ${formatMoney(rate, "NGN", { decimals: 0 })}`} /></div>
						<div className="flex justify-between"><span className="text-muted-foreground">Fee (0.75%)</span><Num value={formatMoney(feeAmt, mode === "sell" || mode === "swap" ? "NGN" : "NGN", { decimals: 0 })} /></div>
						<div className="flex justify-between"><span className="text-muted-foreground">Slippage</span><Num value="0.00%" /></div>
						<div className="flex justify-between font-medium border-t border-border pt-1.5 mt-1.5">
							<span>{mode === "buy" ? "You'll receive" : mode === "sell" ? "You'll receive" : "You'll receive"}</span>
							<Num value={mode === "buy" ? youGet.toFixed(6) + " " + asset : mode === "sell" ? formatMoney(youPay, "NGN", { decimals: 0 }) : swapGet.toFixed(6) + " " + pair} />
						</div>
					</div>

					<Button size="lg" className="w-full" onClick={submit}>
						{mode === "buy" ? "Buy " + asset : mode === "sell" ? "Sell " + asset : `Swap ${asset} → ${pair}`}
					</Button>
					<p className="text-center text-xs text-muted-foreground">
						Quote refreshes every 10s. Final rate locked on confirmation.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}

function InputPanel({ label, amount, onAmount, readOnly, asset, helper, unit }: { label: string; amount: string; onAmount?: (v: string) => void; readOnly?: boolean; asset: React.ReactNode; helper?: string; unit: string }) {
	return (
		<div className="rounded-xl border border-border bg-background p-4">
			<div className="flex items-center justify-between">
				<span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
				{helper && <span className="text-xs text-muted-foreground">{helper}</span>}
			</div>
			<div className="mt-2 flex items-center gap-3">
				<input
					inputMode="decimal"
					readOnly={readOnly}
					className="mono flex-1 bg-transparent outline-none text-3xl font-semibold tabular-nums placeholder:text-muted-foreground/40"
					placeholder="0"
					value={amount}
					onChange={(e) => onAmount?.(e.target.value)}
				/>
				<div>{asset}</div>
			</div>
			<div className="mt-1 text-xs text-muted-foreground">{unit}</div>
		</div>
	);
}

function ArrowDivider() {
	return (
		<div className="flex justify-center -my-1">
			<div className="z-10 rounded-full border border-border bg-background p-1.5 shadow-sm">
				<ArrowDown className="size-4 text-muted-foreground" />
			</div>
		</div>
	);
}

function FiatPill() {
	return (
		<div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-sm font-medium">
			<span className="size-6 rounded-full bg-emerald-600 text-white text-[10px] font-bold grid place-items-center">₦</span>
			{FIAT.symbol}
		</div>
	);
}

function AssetSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger className="h-9 w-auto gap-2 rounded-full border-border bg-muted px-3 text-sm font-medium">
				<span className="inline-flex items-center gap-2"><AssetLogo symbol={value} size="sm" />{value}</span>
			</SelectTrigger>
			<SelectContent>
				{ASSETS.map((a) => (
					<SelectItem key={a.symbol} value={a.symbol}>
						<span className="inline-flex items-center gap-2"><AssetLogo symbol={a.symbol} size="sm" />{a.name} <span className="text-muted-foreground">{a.symbol}</span></span>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
