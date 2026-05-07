"use client";

import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { formatMoney } from "@/lib/utils";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Num } from "@/components/primitives/num";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getUserWallet } from "@/lib/api/wallet/queries";
import { getExchangeRate } from "@/lib/api/blockchain/queries";
import type { Wallet } from "@/store/wallet";

const CHAIN_MAP: Record<string, string[]> = {
	USDT: ["Tron", "BSC", "Ethereum"],
	USDC: ["Ethereum", "Solana", "Polygon"],
};

const FIAT = { symbol: "NGN", name: "Nigerian Naira" };

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

	const { data: walletData, isLoading: walletLoading } = useQuery({
		queryKey: ["wallet"],
		queryFn: getUserWallet,
		retry: false,
	});

	const assets = useMemo(() => walletToAssets(walletData?.walletAssets ?? []), [walletData]);
	const ngnWallet = walletData?.walletAssets?.find((w) => w.currency === "NGN");
	const ngnBalance = ngnWallet?.balance ?? 0;

	const chainCode = asset === "USDT" ? "TRON" : "ETH";
	const { data: exchangeRateData } = useQuery({
		queryKey: ["exchangeRate", chainCode],
		queryFn: () => getExchangeRate({ baseCurrency: chainCode as Parameters<typeof getExchangeRate>[0]["baseCurrency"], targetCurrency: "NGN", amount: 1 }),
		retry: false,
		refetchInterval: 10_000,
	});

	const rate = useMemo(() => {
		if (!exchangeRateData) return 1_570;
		return mode === "buy" ? exchangeRateData.purchase : exchangeRateData.sale;
	}, [exchangeRateData, mode]);

	const selected = assets.find((a) => a.symbol === asset) ?? {
		symbol: asset, name: asset, chains: CHAIN_MAP[asset] ?? ["Tron"], balance: 0, address: "",
	};

	const amtNum = parseFloat(amount) || 0;
	const youPay = mode === "buy" ? amtNum : amtNum * rate;
	const youGet = mode === "buy" ? amtNum / rate : amtNum;
	const feePct = 0.0075;
	const feeAmt = useMemo(() => (mode === "buy" ? amtNum * feePct : amtNum * rate * feePct), [mode, amtNum, rate]);

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
				body: JSON.stringify({ side: mode, amount: amtNum, chain }),
			});
			const data = await res.json();
			if (data.status) {
				toast.success(data.message ?? `Order placed: ${mode === "buy" ? "Buy" : "Sell"} ${asset}`);
			} else {
				toast.error(data.message ?? "Trade failed");
			}
		} catch {
			toast.error("Network error. Please try again.");
		} finally {
			setSubmitting(false);
			setAmount("");
			setShowConfirm(false);
		}
	};

	if (walletLoading) {
		return (
			<div className="max-w-[520px] mx-auto flex items-center justify-center py-24">
				<Loader2 className="size-6 animate-spin text-[var(--c-text-3)]" />
			</div>
		);
	}

	return (
		<div className="max-w-[520px] mx-auto space-y-5">
			<h1 className="text-[22px] font-semibold tracking-tight text-[var(--c-text)]">Buy &amp; Sell</h1>

			<div className="ds-card p-5 space-y-4">
				{/* Seg control: Buy / Sell */}
				<div className="flex items-center gap-1 p-1 rounded-[10px]" style={{ background: "var(--c-onyx-900)" }}>
					{(["buy", "sell"] as const).map((m) => (
						<button
							key={m}
							onClick={() => { setMode(m); setShowConfirm(false); }}
							className="flex-1 h-9 rounded-lg text-[13.5px] font-medium transition-colors capitalize"
							style={mode === m
								? { background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }
								: { color: "var(--c-cream)", opacity: 0.7 }
							}
						>
							{m === "buy" ? "Buy with Naira" : "Sell to Naira"}
						</button>
					))}
				</div>

				<AnimatePresence mode="wait">
					{showConfirm ? (
						<motion.div key="confirm" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }} className="space-y-4">
							{/* Order summary */}
							<div className="rounded-[14px] p-4 space-y-3" style={{ background: "var(--c-surface-2)", border: "1px solid var(--c-line)" }}>
								<h3 className="text-[14px] font-semibold text-[var(--c-text)]">Order summary</h3>
								<div className="space-y-2 text-[13px]">
									<div className="flex justify-between">
										<span className="text-[var(--c-text-3)]">You {mode === "buy" ? "pay" : "sell"}</span>
										<span className="tabular-nums font-medium text-[var(--c-text)]">
											{mode === "buy" ? formatMoney(amtNum, "NGN", { decimals: 0 }) : `${amtNum.toFixed(amtNum > 1 ? 4 : 6)} ${asset}`}
										</span>
									</div>
									<div className="flex justify-center"><ArrowDown className="size-4 text-[var(--c-text-3)]" /></div>
									<div className="flex justify-between">
										<span className="text-[var(--c-text-3)]">You receive</span>
										<span className="tabular-nums font-medium text-[var(--c-text)]">
											{mode === "buy" ? `${youGet.toFixed(youGet > 1 ? 4 : 8)} ${asset}` : formatMoney(youPay, "NGN", { decimals: 0 })}
										</span>
									</div>
								</div>
								<div className="border-t border-[var(--c-line)] pt-3 space-y-1.5 text-[12px]">
									<div className="flex justify-between">
										<span className="text-[var(--c-text-3)]">Exchange rate</span>
										<span className="tabular-nums text-[var(--c-text)]">1 {asset} = {formatMoney(rate, "NGN", { decimals: 0 })}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-[var(--c-text-3)]">Fee (0.75%)</span>
										<span className="tabular-nums text-[var(--c-text)]">{formatMoney(feeAmt, "NGN", { decimals: 0 })}</span>
									</div>
								</div>
							</div>

							<div className="flex items-center gap-2 rounded-[10px] px-3 py-2.5 text-[12px]" style={{ background: "var(--c-warn-soft)", border: "1px solid var(--c-warn)", color: "var(--c-warn)" }}>
								<AlertTriangle className="size-3.5 shrink-0" />
								<span>Quote refreshes every 10s. Final rate is locked on confirmation.</span>
							</div>

							<p className="text-center text-[12px] text-[var(--c-text-3)] inline-flex items-center justify-center gap-1.5 w-full font-mono">
								<Clock className="size-3" />
								Rate refreshes in {countdown}s
							</p>

							<div className="flex gap-3">
								<button
									onClick={() => setShowConfirm(false)}
									disabled={submitting}
									className="flex-1 h-11 rounded-lg border border-[var(--c-line)] text-[13.5px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors"
								>
									Cancel
								</button>
								<button
									onClick={confirmOrder}
									disabled={submitting}
									className="flex-1 h-11 rounded-lg text-[13.5px] font-semibold transition-colors"
									style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}
								>
									{submitting ? <Loader2 className="size-4 animate-spin mx-auto" /> : "Confirm order"}
								</button>
							</div>
						</motion.div>
					) : (
						<motion.div key="form" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.15 }} className="space-y-3">
							{mode === "buy" ? (
								<>
									<InputPanel
										label="You pay"
										amount={amount}
										onAmount={setAmount}
										asset={<FiatPill />}
										helper={`From NGN wallet · ${formatMoney(ngnBalance, "NGN", { decimals: 0 })} available`}
										unit="NGN"
									/>
									<ArrowDivider />
									<InputPanel
										label="You receive"
										amount={amtNum ? (amtNum / rate).toFixed(8) : ""}
										readOnly
										asset={<AssetSelect value={asset} onChange={setAsset} assets={assets} />}
										helper={`1 ${asset} ≈ ${formatMoney(rate, "NGN", { decimals: 0 })}`}
										unit={asset}
									/>
								</>
							) : (
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
										helper={`1 ${asset} ≈ ${formatMoney(rate, "NGN", { decimals: 0 })}`}
										unit="NGN"
									/>
								</>
							)}

							{/* Fee summary */}
							<div className="rounded-[12px] p-4 text-[12.5px] space-y-1.5" style={{ background: "var(--c-surface-2)", border: "1px solid var(--c-line)" }}>
								<div className="flex justify-between">
									<span className="text-[var(--c-text-3)]">Rate</span>
									<span className="tabular-nums text-[var(--c-text)]">1 {asset} = {formatMoney(rate, "NGN", { decimals: 0 })}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-[var(--c-text-3)]">Fee (0.75%)</span>
									<span className="tabular-nums text-[var(--c-text)]">{formatMoney(feeAmt, "NGN", { decimals: 0 })}</span>
								</div>
								<div className="flex justify-between font-semibold border-t border-[var(--c-line)] pt-1.5 mt-1">
									<span className="text-[var(--c-text)]">You&#39;ll receive</span>
									<Num className="tabular-nums text-[var(--c-text)]" value={mode === "buy" ? `${youGet.toFixed(2)} ${asset}` : formatMoney(youPay, "NGN", { decimals: 0 })} />
								</div>
							</div>

							{/* Quick fill */}
							<div className="grid grid-cols-4 gap-2">
								{["25%", "50%", "75%", "100%"].map((p) => (
									<button
										key={p}
										className="h-8 rounded-lg border border-[var(--c-line)] text-[12px] font-medium text-[var(--c-text-2)] hover:bg-[var(--c-surface-2)] transition-colors"
									>
										{p}
									</button>
								))}
							</div>

							<button
								onClick={handleSubmitClick}
								className="w-full h-12 rounded-lg text-[15px] font-semibold transition-colors"
								style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}
							>
								Continue → Review
							</button>

							<p className="text-center text-[12px] text-[var(--c-text-3)] inline-flex items-center justify-center gap-1.5 w-full font-mono">
								<Clock className="size-3" />
								Rate refreshes in {countdown}s
							</p>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}

function InputPanel({ label, amount, onAmount, readOnly, asset, helper, unit }: {
	label: string; amount: string; onAmount?: (v: string) => void; readOnly?: boolean;
	asset: React.ReactNode; helper?: string; unit: string;
}) {
	return (
		<div className="rounded-[14px] p-4" style={{ border: "1px solid var(--c-line)", background: "var(--c-surface-2)" }}>
			<div className="flex items-center justify-between mb-2 gap-2">
				<span className="text-[11.5px] font-medium uppercase tracking-[0.06em] text-[var(--c-text-3)]">{label}</span>
				{helper && <span className="text-[11px] text-[var(--c-text-3)] truncate">{helper}</span>}
			</div>
			<div className="flex items-center gap-3">
				<input
					inputMode="decimal"
					readOnly={readOnly}
					className="flex-1 min-w-0 bg-transparent outline-none font-display tabular-nums text-[28px] font-semibold placeholder:text-[var(--c-text-3)] text-[var(--c-text)]"
					placeholder="0"
					value={amount}
					onChange={(e) => onAmount?.(e.target.value)}
				/>
				<div className="shrink-0">{asset}</div>
			</div>
			<div className="mt-1 text-[11px] text-[var(--c-text-3)] font-mono">{unit}</div>
		</div>
	);
}

function ArrowDivider() {
	return (
		<div className="flex justify-center -my-1">
			<div className="z-10 size-9 rounded-full flex items-center justify-center shadow-[var(--sh-1)]" style={{ background: "var(--c-onyx-900)", border: "3px solid var(--c-surface)" }}>
				<ArrowDown className="size-4" style={{ color: "var(--c-lime-500)" }} />
			</div>
		</div>
	);
}

function FiatPill() {
	return (
		<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-medium text-[var(--c-text)]" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
			<AssetLogo symbol="NGN" size="sm" />
			{FIAT.symbol}
		</div>
	);
}

function AssetSelect({ value, onChange, assets }: { value: string; onChange: (v: string) => void; assets: { symbol: string; name: string }[] }) {
	const items = assets.length > 0 ? assets : [
		{ symbol: "USDT", name: "Tether" },
		{ symbol: "USDC", name: "USD Coin" },
	];
	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger className="h-9 w-auto gap-2 rounded-full border border-[var(--c-line)] bg-[var(--c-surface)] px-3 text-[13px] font-medium text-[var(--c-text)]">
				<span className="inline-flex items-center gap-2"><AssetLogo symbol={value} size="sm" />{value}</span>
			</SelectTrigger>
			<SelectContent>
				{items.map((a) => (
					<SelectItem key={a.symbol} value={a.symbol}>
						<span className="inline-flex items-center gap-2"><AssetLogo symbol={a.symbol} size="sm" />{a.name} <span className="text-[var(--c-text-3)]">{a.symbol}</span></span>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
