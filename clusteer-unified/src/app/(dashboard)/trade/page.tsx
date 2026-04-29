"use client";

import { useState, useMemo, useEffect } from "react";
import { ASSETS } from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Num } from "@/components/primitives/num";
import { ArrowDown, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const FIAT = { symbol: "NGN", name: "Nigerian Naira" };

export default function TradePage() {
	const [mode, setMode] = useState<"buy" | "sell">("buy");
	const [asset, setAsset] = useState("USDT");
	const [amount, setAmount] = useState("");
	const [showConfirm, setShowConfirm] = useState(false);
	const [countdown, setCountdown] = useState(10);

	const selected = ASSETS.find((a) => a.symbol === asset)!;

	const amtNum = parseFloat(amount) || 0;
	const youPay = mode === "buy" ? amtNum : amtNum * selected.priceNgn;
	const youGet = mode === "buy" ? amtNum / selected.priceNgn : amtNum;
	const rate = selected.priceNgn;

	const feePct = 0.0075; // 0.75%
	const feeAmt = useMemo(() => {
		if (mode === "buy") return amtNum * feePct;
		if (mode === "sell") return amtNum * selected.priceNgn * feePct;
		return amtNum * selected.priceNgn * feePct;
	}, [mode, amtNum, selected.priceNgn]);

	useEffect(() => {
		const timer = setInterval(() => setCountdown((c) => (c <= 1 ? 10 : c - 1)), 1000);
		return () => clearInterval(timer);
	}, []);

	const handleSubmitClick = () => {
		if (!amount) return toast.error("Enter an amount");
		setShowConfirm(true);
	};

	const confirmOrder = () => {
		toast.success(`Order placed: ${mode === "buy" ? "Buy" : "Sell"} ${asset}`);
		setAmount("");
		setShowConfirm(false);
	};

	const cancelConfirm = () => {
		setShowConfirm(false);
	};

	return (
		<div className="max-w-2xl mx-auto">
			<h1 className="font-display text-2xl font-bold tracking-tight mb-6">Buy & Sell Stablecoins</h1>
			<Card>
				<CardHeader>
					<Tabs value={mode} onValueChange={(v) => { setMode(v as "buy" | "sell"); setShowConfirm(false); }}>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="buy">Buy with Naira</TabsTrigger>
							<TabsTrigger value="sell">Sell to Naira</TabsTrigger>
						</TabsList>
					</Tabs>
				</CardHeader>

				<CardContent className="space-y-3">
					{!showConfirm ? (
						<>
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
							<div className="rounded-lg bg-muted/50 p-3 text-xs space-y-1.5">
								<div className="flex justify-between"><span className="text-muted-foreground">Rate</span><Num value={`1 ${asset} = ${formatMoney(rate, "NGN", { decimals: 0 })}`} /></div>
								<div className="flex justify-between"><span className="text-muted-foreground">Fee (0.75%)</span><Num value={formatMoney(feeAmt, "NGN", { decimals: 0 })} /></div>
								<div className="flex justify-between font-medium border-t border-border pt-1.5 mt-1.5">
									<span>You&#39;ll receive</span>
									<Num value={mode === "buy" ? youGet.toFixed(2) + " " + asset : formatMoney(youPay, "NGN", { decimals: 0 })} />
								</div>
							</div>

							<Button size="lg" className="w-full" onClick={handleSubmitClick}>
								{mode === "buy" ? "Buy " + asset : "Sell " + asset}
							</Button>
							<p className="text-center text-xs text-muted-foreground inline-flex items-center justify-center gap-1.5 w-full">
								<Clock className="size-3" />
								Rate refreshes in {countdown}s
							</p>
						</>
					) : (
						<div className="space-y-4">
							<div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
								<h3 className="font-semibold text-sm">Order summary</h3>
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">You {mode === "buy" ? "pay" : "sell"}</span>
										<span className="font-medium">
											{mode === "buy"
												? formatMoney(amtNum, "NGN", { decimals: 0 })
												: amtNum.toFixed(amtNum > 1 ? 4 : 6) + " " + asset}
										</span>
									</div>
									<div className="flex justify-center"><ArrowDown className="size-4 text-muted-foreground" /></div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">You receive</span>
										<span className="font-medium">
											{mode === "buy"
												? youGet.toFixed(youGet > 1 ? 4 : 8) + " " + asset
												: formatMoney(youPay, "NGN", { decimals: 0 })}
										</span>
									</div>
								</div>
								<div className="border-t border-border pt-3 space-y-1.5 text-xs">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Exchange rate</span>
										<span>1 {asset} = {formatMoney(rate, "NGN", { decimals: 0 })}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Fee (0.75%)</span>
										<span>{formatMoney(feeAmt, "NGN", { decimals: 0 })}</span>
									</div>
								</div>
							</div>

							<div className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
								<AlertTriangle className="size-3.5 shrink-0" />
								<span>Quote refreshes every 10s. Final rate is locked on confirmation.</span>
							</div>

							<p className="text-center text-xs text-muted-foreground inline-flex items-center justify-center gap-1.5 w-full">
								<Clock className="size-3" />
								Rate refreshes in {countdown}s
							</p>

							<div className="flex gap-3">
								<Button variant="outline" size="lg" className="flex-1" onClick={cancelConfirm}>
									Cancel
								</Button>
								<Button size="lg" className="flex-1" onClick={confirmOrder}>
									Confirm order
								</Button>
							</div>
						</div>
					)}
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
					className="mono flex-1 bg-transparent outline-none text-2xl sm:text-3xl font-semibold tabular-nums placeholder:text-muted-foreground/40"
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
			<AssetLogo symbol="NGN" size="sm" />
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
