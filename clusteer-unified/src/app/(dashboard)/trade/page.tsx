"use client";

import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { formatMoney } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Num } from "@/components/primitives/num";
import { ArrowDown, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getUserWallet } from "@/lib/api/wallet/queries";
import { getExchangeRate } from "@/lib/api/blockchain/queries";
import type { Wallet } from "@/store/wallet";

/** Known chains per stablecoin on the Clusteer platform */
const CHAIN_MAP: Record<string, string[]> = {
	USDT: ["Tron", "BSC", "Ethereum"],
	USDC: ["Ethereum", "Solana", "Polygon"],
};

const FIAT = { symbol: "NGN", name: "Nigerian Naira" };

/** Map Wallet[] from API into a shape the UI can use */
function walletToAssets(wallets: Wallet[]) {
	return wallets
		.filter((w) => w.type === "CRYPTO")
		.map((w) => ({
			symbol: w.currency,
			name: w.name,
			chains: CHAIN_MAP[w.currency] ?? ["Tron"],
			balance: w.balance,
			address: w.address,
		}));
}

export default function TradePage() {
	const [mode, setMode] = useState<"buy" | "sell">("buy");
	const [asset, setAsset] = useState("USDT");
	const [amount, setAmount] = useState("");
	const [showConfirm, setShowConfirm] = useState(false);
	const [countdown, setCountdown] = useState(10);
	const [submitting, setSubmitting] = useState(false);

	// Fetch wallet data
	const { data: walletData, isLoading: walletLoading } = useQuery({
		queryKey: ["wallet"],
		queryFn: getUserWallet,
		retry: false,
	});

	const assets = useMemo(() => walletToAssets(walletData?.walletAssets ?? []), [walletData]);

	// Find NGN wallet for fiat balance
	const ngnWallet = walletData?.walletAssets?.find((w) => w.currency === "NGN");
	const ngnBalance = ngnWallet?.balance ?? 0;

	// Fetch exchange rate for selected asset
	const chainCode = asset === "USDT" ? "TRON" : "ETH";
	const { data: exchangeRateData } = useQuery({
		queryKey: ["exchangeRate", chainCode],
		queryFn: () => getExchangeRate({ baseCurrency: chainCode as any, targetCurrency: "NGN", amount: 1 }),
		retry: false,
		refetchInterval: 10_000, // refresh every 10s
	});

	const rate = useMemo(() => {
		if (!exchangeRateData) return 1_570; // fallback
		return mode === "buy" ? exchangeRateData.purchase : exchangeRateData.sale;
	}, [exchangeRateData, mode]);

	const selected = assets.find((a) => a.symbol === asset) ?? {
		symbol: asset,
		name: asset,
		chains: CHAIN_MAP[asset] ?? ["Tron"],
		balance: 0,
		address: "",
	};

	const amtNum = parseFloat(amount) || 0;
	const youPay = mode === "buy" ? amtNum : amtNum * rate;
	const youGet = mode === "buy" ? amtNum / rate : amtNum;

	const feePct = 0.0075; // 0.75%
	const feeAmt = useMemo(() => {
		if (mode === "buy") return amtNum * feePct;
		return amtNum * rate * feePct;
	}, [mode, amtNum, rate]);

	// Reset countdown whenever exchange rate data refreshes
	useEffect(() => {
		setCountdown(10);
		const timer = setInterval(() => setCountdown((c) => (c <= 1 ? 10 : c - 1)), 1000);
		return () => clearInterval(timer);
	}, [exchangeRateData]);

	const handleSubmitClick = () => {
		if (!amount) return toast.error("Enter an amount");
		setShowConfirm(true);
	};

	const confirmOrder = async () => {
		setSubmitting(true);
		try {
			const chain = selected.chains[0]?.toLowerCase() ?? "tron";
			const res = await fetch("/api/trade", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					side: mode,
					amount: amtNum,
					chain,
				}),
			});
			const data = await res.json();
			if (data.status) {
				toast.success(data.message ?? `Order placed: ${mode === "buy" ? "Buy" : "Sell"} ${asset}`);
			} else {
				toast.error(data.message ?? "Trade failed");
			}
		} catch (err) {
			toast.error("Network error. Please try again.");
		} finally {
			setSubmitting(false);
			setAmount("");
			setShowConfirm(false);
		}
	};

	const cancelConfirm = () => {
		setShowConfirm(false);
	};

	if (walletLoading) {
		return (
			<div className="max-w-2xl mx-auto flex items-center justify-center py-24">
				<Loader2 className="size-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto">
			<p className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-brand-800 mb-1">&#9670; Exchange</p>
			<h1 className="font-display text-xl sm:text-2xl font-bold tracking-[-0.02em] mb-4 sm:mb-6">Buy & Sell Stablecoins</h1>
			<Card className="border-2 border-custom-black rounded-[16px] sm:rounded-[20px]">
				<CardHeader className="p-4 sm:p-6 lg:p-8">
					<Tabs value={mode} onValueChange={(v) => { setMode(v as "buy" | "sell"); setShowConfirm(false); }}>
						<TabsList className="grid w-full grid-cols-2 border-2 border-custom-black rounded-[14px] p-1 bg-warm-beige/40">
							<TabsTrigger value="buy" className="rounded-[10px] font-display font-bold text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-brutal-sm">Buy with Naira</TabsTrigger>
							<TabsTrigger value="sell" className="rounded-[10px] font-display font-bold text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-brutal-sm">Sell to Naira</TabsTrigger>
						</TabsList>
					</Tabs>
				</CardHeader>

				<CardContent className="space-y-3 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
					<AnimatePresence mode="wait">
						{showConfirm ? (
							<motion.div key="confirm" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }}>
								<div className="space-y-4">
									<div className="rounded-[14px] border-2 border-custom-black bg-warm-beige p-4 space-y-3">
										<h3 className="font-display font-bold text-sm">Order summary</h3>
										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span className="text-muted-foreground">You {mode === "buy" ? "pay" : "sell"}</span>
												<span className="font-mono font-medium tabular-nums">
													{mode === "buy"
														? formatMoney(amtNum, "NGN", { decimals: 0 })
														: amtNum.toFixed(amtNum > 1 ? 4 : 6) + " " + asset}
												</span>
											</div>
											<div className="flex justify-center"><ArrowDown className="size-4 text-muted-foreground" /></div>
											<div className="flex justify-between">
												<span className="text-muted-foreground">You receive</span>
												<span className="font-mono font-medium tabular-nums">
													{mode === "buy"
														? youGet.toFixed(youGet > 1 ? 4 : 8) + " " + asset
														: formatMoney(youPay, "NGN", { decimals: 0 })}
												</span>
											</div>
										</div>
										<div className="border-t border-custom-black/10 pt-3 space-y-1.5 text-xs">
											<div className="flex justify-between">
												<span className="text-muted-foreground">Exchange rate</span>
												<span className="font-mono tabular-nums">1 {asset} = {formatMoney(rate, "NGN", { decimals: 0 })}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-muted-foreground">Fee (0.75%)</span>
												<span className="font-mono tabular-nums">{formatMoney(feeAmt, "NGN", { decimals: 0 })}</span>
											</div>
										</div>
									</div>

									<div className="flex items-center gap-2 rounded-[14px] bg-amber-500/10 border-2 border-amber-500/20 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
										<AlertTriangle className="size-3.5 shrink-0" />
										<span>Quote refreshes every 10s. Final rate is locked on confirmation.</span>
									</div>

									<p className="text-center text-xs text-muted-foreground inline-flex items-center justify-center gap-1.5 w-full font-mono">
										<Clock className="size-3" />
										Rate refreshes in {countdown}s
									</p>

									<div className="flex gap-3">
										<Button variant="outline" size="lg" className="flex-1 rounded-full border-2 border-custom-black" onClick={cancelConfirm} disabled={submitting}>
											Cancel
										</Button>
										<Button size="lg" className="flex-1 rounded-full btn-shine shadow-brutal-sm" onClick={confirmOrder} disabled={submitting}>
											{submitting ? <Loader2 className="size-4 animate-spin" /> : "Confirm order"}
										</Button>
									</div>
								</div>
							</motion.div>
						) : (
							<motion.div key="form" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.15 }}>
								<>
									{mode === "buy" && (
										<>
											<InputPanel
												label="You pay"
												amount={amount}
												onAmount={setAmount}
												asset={<FiatPill />}
												helper={`From NGN wallet \u00B7 ${formatMoney(ngnBalance, "NGN", { decimals: 0 })} available`}
												unit="NGN"
											/>
											<ArrowDivider />
											<InputPanel
												label="You receive"
												amount={amtNum ? (amtNum / rate).toFixed(8) : ""}
												readOnly
												asset={<AssetSelect value={asset} onChange={setAsset} assets={assets} />}
												helper={`1 ${asset} \u2248 ${formatMoney(rate, "NGN", { decimals: 0 })}`}
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
												asset={<AssetSelect value={asset} onChange={setAsset} assets={assets} />}
												helper={`Available: ${selected.balance} ${asset}`}
												unit={asset}
											/>
											<ArrowDivider />
											<InputPanel
												label="You receive"
												amount={amtNum ? (amtNum * rate).toFixed(0) : ""}
												readOnly
												asset={<FiatPill />}
												helper={`1 ${asset} \u2248 ${formatMoney(rate, "NGN", { decimals: 0 })}`}
												unit="NGN"
											/>
										</>
									)}
									<div className="rounded-[14px] bg-warm-beige p-4 text-xs space-y-1.5">
										<div className="flex justify-between"><span className="text-muted-foreground">Rate</span><Num className="font-mono tabular-nums" value={`1 ${asset} = ${formatMoney(rate, "NGN", { decimals: 0 })}`} /></div>
										<div className="flex justify-between"><span className="text-muted-foreground">Fee (0.75%)</span><Num className="font-mono tabular-nums" value={formatMoney(feeAmt, "NGN", { decimals: 0 })} /></div>
										<div className="flex justify-between font-medium border-t border-custom-black/10 pt-1.5 mt-1.5">
											<span>You&#39;ll receive</span>
											<Num className="font-mono tabular-nums" value={mode === "buy" ? youGet.toFixed(2) + " " + asset : formatMoney(youPay, "NGN", { decimals: 0 })} />
										</div>
									</div>

									<Button size="lg" className="w-full rounded-full btn-shine shadow-brutal-sm" onClick={handleSubmitClick}>
										{mode === "buy" ? "Buy " + asset : "Sell " + asset}
									</Button>
									<p className="text-center text-xs text-muted-foreground inline-flex items-center justify-center gap-1.5 w-full font-mono">
										<Clock className="size-3" />
										Rate refreshes in {countdown}s
									</p>
								</>
							</motion.div>
						)}
					</AnimatePresence>
				</CardContent>
			</Card>
		</div>
	);
}

function InputPanel({ label, amount, onAmount, readOnly, asset, helper, unit }: { label: string; amount: string; onAmount?: (v: string) => void; readOnly?: boolean; asset: React.ReactNode; helper?: string; unit: string }) {
	return (
		<div className="rounded-[14px] border-2 border-custom-black/20 bg-[#EFFCD0]/30 p-3 sm:p-4">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
				<span className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-brand-800">{label}</span>
				{helper && <span className="text-[10px] sm:text-xs text-muted-foreground truncate">{helper}</span>}
			</div>
			<div className="mt-2 flex items-center gap-2 sm:gap-3">
				<input
					inputMode="decimal"
					readOnly={readOnly}
					className="font-mono flex-1 min-w-0 bg-transparent outline-none text-xl sm:text-2xl lg:text-3xl font-semibold tabular-nums placeholder:text-muted-foreground/40"
					placeholder="0"
					value={amount}
					onChange={(e) => onAmount?.(e.target.value)}
				/>
				<div className="shrink-0">{asset}</div>
			</div>
			<div className="mt-1 text-xs text-muted-foreground font-mono">{unit}</div>
		</div>
	);
}

function ArrowDivider() {
	return (
		<div className="flex justify-center -my-1">
			<div className="z-10 rounded-full border-2 border-custom-black bg-white p-1.5 shadow-brutal-sm">
				<ArrowDown className="size-4 text-custom-black" />
			</div>
		</div>
	);
}

function FiatPill() {
	return (
		<div className="inline-flex items-center gap-2 rounded-full border-2 border-custom-black bg-warm-beige px-3 py-1.5 text-sm font-medium">
			<AssetLogo symbol="NGN" size="sm" />
			{FIAT.symbol}
		</div>
	);
}

function AssetSelect({ value, onChange, assets }: { value: string; onChange: (v: string) => void; assets: { symbol: string; name: string }[] }) {
	// If no assets from API yet, show a default list
	const items = assets.length > 0 ? assets : [
		{ symbol: "USDT", name: "Tether" },
		{ symbol: "USDC", name: "USD Coin" },
	];
	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger className="h-9 w-auto gap-2 rounded-full border-2 border-custom-black bg-warm-beige px-3 text-sm font-medium">
				<span className="inline-flex items-center gap-2"><AssetLogo symbol={value} size="sm" />{value}</span>
			</SelectTrigger>
			<SelectContent>
				{items.map((a) => (
					<SelectItem key={a.symbol} value={a.symbol}>
						<span className="inline-flex items-center gap-2"><AssetLogo symbol={a.symbol} size="sm" />{a.name} <span className="text-muted-foreground">{a.symbol}</span></span>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
