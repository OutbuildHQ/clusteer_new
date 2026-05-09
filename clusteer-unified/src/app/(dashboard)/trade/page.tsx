"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getUserWallet } from "@/lib/api/wallet/queries";
import { formatMoney } from "@/lib/utils";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { ArrowDownUp, ArrowLeftRight, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

type Side = "Buy" | "Sell" | "Swap";

const SUPPORTED_ASSETS = [
	{ symbol: "USDT", name: "Tether", chains: ["tron", "bsc", "ethereum"] },
	{ symbol: "USDC", name: "USD Coin", chains: ["ethereum", "solana"] },
];

const CHAIN_LABELS: Record<string, string> = {
	tron: "Tron (TRC-20)",
	bsc: "BNB Chain (BEP-20)",
	ethereum: "Ethereum (ERC-20)",
	solana: "Solana",
};

export default function TradePage() {
	const [side, setSide] = useState<Side>("Buy");
	const [asset, setAsset] = useState("USDT");
	const [amount, setAmount] = useState("");
	const [chain, setChain] = useState("tron");

	// Swap tab state
	const [swapFrom, setSwapFrom] = useState<"USDT" | "USDC">("USDT");
	const [swapAmount, setSwapAmount] = useState("");
	const swapTo = swapFrom === "USDT" ? "USDC" : "USDT";
	const SWAP_FEE_PCT = 0.001; // 0.1%
	const swapAmtNum = parseFloat(swapAmount) || 0;
	const swapReceive = swapAmtNum > 0 ? swapAmtNum * (1 - SWAP_FEE_PCT) : 0;
	const swapFeeAmt = swapAmtNum * SWAP_FEE_PCT;

	const { data: walletData } = useQuery({
		queryKey: ["wallet"],
		queryFn: getUserWallet,
	});

	const { data: bankAccounts = [] } = useQuery<{ id: number; bank_name: string; account_number: string; is_default: boolean }[]>({
		queryKey: ["bank-accounts"],
		queryFn: async () => {
			const res = await fetch("/api/user/bank-accounts");
			if (!res.ok) return [];
			const json = await res.json();
			return json.data ?? [];
		},
	});
	const hasBankAccount = bankAccounts.length > 0;

	const {
		data: rateData,
		isLoading: rateLoading,
		isError: rateError,
	} = useQuery({
		queryKey: ["exchange-rate", "NGN"],
		queryFn: async () => {
			const res = await fetch("/api/system/exchange-rate?targetCurrency=NGN&type=sell");
			if (!res.ok) throw new Error("Failed to fetch rate");
			return res.json() as Promise<{ buyRate: number; sellRate: number; rate: number }>;
		},
		refetchInterval: 30_000,
	});

	const tradeMutation = useMutation({
		mutationFn: async (payload: { side: string; amount: number; chain: string }) => {
			const res = await fetch("/api/trade", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Trade failed");
			return data;
		},
		onSuccess: (_, vars) => {
			if (vars.side === "sell") {
				toast.success("Sell order submitted — NGN credited to your wallet", {
					description: "Withdraw to your bank account when ready.",
					action: { label: "Withdraw now", onClick: () => { window.location.href = "/withdraw"; } },
					duration: 8000,
				});
			} else {
				toast.success("Trade submitted successfully");
			}
			setAmount("");
		},
		onError: (err: Error) => {
			toast.error(err.message || "Trade failed. Please try again.");
		},
	});

	const swapMutation = useMutation({
		mutationFn: async (payload: { from_currency: string; to_currency: string; amount: number; chain: string }) => {
			const res = await fetch("/api/swap", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Swap failed");
			return data;
		},
		onSuccess: () => {
			toast.success(`Swapped ${swapAmtNum} ${swapFrom} → ${swapTo}`, { description: "Balance updated." });
			setSwapAmount("");
		},
		onError: (err: Error) => {
			toast.error(err.message || "Swap failed. Please try again.");
		},
	});

	const selected = SUPPORTED_ASSETS.find((a) => a.symbol === asset) ?? SUPPORTED_ASSETS[0];
	// Keep chain valid when asset changes
	const effectiveChain = selected.chains.includes(chain) ? chain : selected.chains[0];

	// Use buyRate for Buy (user buys USDT with NGN), sellRate for Sell (user gets NGN)
	const buyRate: number | null = rateData?.buyRate ?? null;
	const sellRate: number | null = rateData?.sellRate ?? null;
	const rate = side === "Sell" ? sellRate : buyRate;

	const amtNum = parseFloat(amount) || 0;
	const feePct = 0.015;
	// For Buy: amtNum is NGN → ngnValue = amtNum. For Sell: amtNum is USDT → ngnValue = amtNum * sellRate
	const ngnValue = side === "Buy" ? amtNum : (rate !== null ? amtNum * rate : 0);
	const feeAmt = ngnValue * feePct;

	// Wallet balances
	const walletBalance = walletData?.walletAssets?.find((w) => w.currency === asset)?.balance;
	const ngnWalletBalance = walletData?.walletAssets?.find((w) => w.currency === "NGN")?.balance;

	const receiveValue = (() => {
		if (rate === null) return "Rate unavailable";
		if (side === "Buy") return amtNum ? (amtNum / rate).toFixed(6) : "0";
		if (side === "Sell") return formatMoney(ngnValue, "NGN", { decimals: 0 });
		return amtNum ? amtNum.toFixed(6) : "0";
	})();

	const payLabel = side === "Buy" ? "You pay" : "You sell";

	const handleContinue = () => {
		if (!amtNum || amtNum <= 0) {
			toast.error("Please enter a valid amount");
			return;
		}
		if (rate === null) {
			toast.error("Exchange rate unavailable. Please try again later.");
			return;
		}
		tradeMutation.mutate({
			side: side.toLowerCase(),
			amount: amtNum,
			chain: effectiveChain,
		});
	};

	const handleSwap = () => {
		if (!swapAmtNum || swapAmtNum <= 0) {
			toast.error("Please enter a valid amount");
			return;
		}
		const chain = swapFrom === "USDT" ? "tron" : "ethereum";
		swapMutation.mutate({ from_currency: swapFrom, to_currency: swapTo, amount: swapAmtNum, chain });
	};

	return (
		<div className="w-full max-w-[520px] mx-auto flex flex-col gap-5 lg:gap-6 px-4 lg:px-0">
			{/* Title */}
			<h1
				className="text-[22px] lg:text-[32px]"
				style={{
					fontWeight: 600,
					color: "var(--c-text)",
					letterSpacing: "-0.03em",
					margin: 0,
				}}
			>
				Buy &amp; Sell
			</h1>

			{/* Card */}
			<div
				className="p-4 lg:p-5"
				style={{
					background: "var(--c-surface)",
					border: "1px solid var(--c-line)",
					borderRadius: 14,
				}}
			>
				{/* Segmented control: Buy / Sell / Swap */}
				<div
					className="w-full"
					style={{
						display: "flex",
						alignItems: "center",
						gap: 2,
						padding: 4,
						borderRadius: 10,
						background: "var(--c-onyx-900)",
					}}
				>
					{(["Buy", "Sell", "Swap"] as Side[]).map((s) => (
						<button
							key={s}
							onClick={() => setSide(s)}
							className="py-[10px] lg:py-0 lg:h-9 rounded-lg lg:rounded-md"
							style={{
								flex: 1,
								border: "none",
								cursor: "pointer",
								fontSize: 13.5,
								fontWeight: 500,
								fontFamily: "var(--f-sans)",
								transition: "background 0.15s, color 0.15s",
								...(side === s
									? { background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }
									: { background: "transparent", color: "var(--c-cream)" }),
							}}
						>
							{s}
						</button>
					))}
				</div>

				{side === "Sell" && !hasBankAccount && (
					<Link
						href="/settings/payment-methods"
						style={{
							display: "flex", alignItems: "center", gap: 10, marginTop: 14,
							padding: "10px 12px", borderRadius: 10,
							background: "oklch(0.965 0.035 22)",
							border: "1px solid oklch(0.588 0.218 27 / 0.25)",
							textDecoration: "none",
						}}
					>
						<AlertTriangle className="size-4 shrink-0" style={{ color: "var(--danger)" }} />
						<div style={{ flex: 1 }}>
							<p style={{ fontSize: 12.5, fontWeight: 600, color: "var(--danger)", margin: 0 }}>No bank account on file</p>
							<p style={{ fontSize: 11.5, color: "var(--danger)", margin: 0, opacity: 0.8 }}>Add a bank account to withdraw your NGN after selling →</p>
						</div>
					</Link>
				)}

				{/* ---- Swap UI ---- */}
				{side === "Swap" && (
					<div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 18 }}>
						{/* From */}
						<div>
							<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
								<label style={{ fontSize: 12, color: "var(--c-text-3)", fontWeight: 500 }}>You swap</label>
								{(() => {
									const bal = walletData?.walletAssets?.find((w) => w.currency === swapFrom)?.balance;
									return bal !== undefined ? (
										<span style={{ fontSize: 11.5, color: "var(--c-text-3)", fontFamily: "var(--f-mono)", fontVariantNumeric: "tabular-nums" }}>
											Bal: {bal.toLocaleString()} {swapFrom}
										</span>
									) : null;
								})()}
							</div>
							<div
								className="h-[54px] lg:h-16"
								style={{
									padding: "0 14px",
									border: "1px solid var(--c-line)",
									borderRadius: 14,
									background: "var(--c-surface-2)",
									display: "flex",
									alignItems: "center",
									gap: 8,
								}}
							>
								<input
									inputMode="decimal"
									placeholder="0"
									value={swapAmount}
									onChange={(e) => setSwapAmount(e.target.value)}
									style={{
										flex: 1, border: "none", background: "transparent", outline: "none",
										height: "100%", fontSize: 28, fontWeight: 600,
										fontFamily: "var(--f-display)", fontVariantNumeric: "tabular-nums",
										color: "var(--c-text)", padding: 0, minWidth: 0,
									}}
								/>
								<AssetSelector value={swapFrom} onChange={(v) => setSwapFrom(v as "USDT" | "USDC")} />
							</div>
						</div>

						{/* Flip */}
						<div style={{ display: "flex", justifyContent: "center" }}>
							<button
								onClick={() => setSwapFrom(swapTo as "USDT" | "USDC")}
								style={{
									width: 36, height: 36, borderRadius: "50%",
									background: "var(--c-onyx-900)", color: "var(--c-cream)",
									display: "flex", alignItems: "center", justifyContent: "center",
									border: "none", cursor: "pointer",
								}}
							>
								<ArrowLeftRight size={16} />
							</button>
						</div>

						{/* To */}
						<div>
							<label style={{ display: "block", fontSize: 12, color: "var(--c-text-3)", marginBottom: 6, fontWeight: 500 }}>You receive</label>
							<div
								className="h-[54px] lg:h-16"
								style={{
									padding: "0 14px",
									border: "1px solid var(--c-line)",
									borderRadius: 14,
									background: "var(--c-surface-2)",
									display: "flex",
									alignItems: "center",
									gap: 8,
								}}
							>
								<div style={{
									flex: 1, fontSize: 28, fontWeight: 600,
									fontFamily: "var(--f-display)", fontVariantNumeric: "tabular-nums",
									color: swapAmtNum > 0 ? "var(--c-text)" : "var(--c-text-3)",
								}}>
									{swapAmtNum > 0 ? swapReceive.toFixed(6) : "0"}
								</div>
								<AssetSelector value={swapTo} onChange={(v) => setSwapFrom(v === "USDT" ? "USDC" : "USDT")} />
							</div>
						</div>

						{/* Fee */}
						<div style={{ background: "var(--c-surface-2)", borderRadius: 14, padding: 14 }}>
							<div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
								<span style={{ color: "var(--c-text-3)" }}>Rate</span>
								<span style={{ fontFamily: "var(--f-mono)", fontVariantNumeric: "tabular-nums", color: "var(--c-text)" }}>
									1 {swapFrom} ≈ 1 {swapTo}
								</span>
							</div>
							<div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginTop: 6 }}>
								<span style={{ color: "var(--c-text-3)" }}>Fee (0.1%)</span>
								<span style={{ fontFamily: "var(--f-mono)", fontVariantNumeric: "tabular-nums", color: "var(--c-text)" }}>
									{swapFeeAmt > 0 ? swapFeeAmt.toFixed(4) : "0"} {swapFrom}
								</span>
							</div>
							<div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginTop: 6 }}>
								<span style={{ color: "var(--c-text-3)" }}>Network</span>
								<span style={{ fontFamily: "var(--f-mono)", fontVariantNumeric: "tabular-nums", color: "var(--c-text)" }}>
									{swapFrom === "USDT" ? "Tron (TRC-20)" : "Ethereum (ERC-20)"}
								</span>
							</div>
						</div>

						{/* Swap button */}
						<button
							onClick={handleSwap}
							disabled={swapMutation.isPending || swapAmtNum <= 0}
							className="h-[50px] lg:h-12"
							style={{
								width: "100%", borderRadius: 10, border: "none",
								cursor: (swapMutation.isPending || swapAmtNum <= 0) ? "not-allowed" : "pointer",
								fontSize: 15, fontWeight: 500, fontFamily: "var(--f-sans)",
								background: "var(--c-lime-500)",
								opacity: (swapMutation.isPending || swapAmtNum <= 0) ? 0.45 : 1,
								color: "var(--c-onyx-900)", marginTop: 6,
								display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
							}}
						>
							{swapMutation.isPending ? (
								<><Loader2 size={16} className="animate-spin" />Processing...</>
							) : (
								`Swap ${swapFrom} → ${swapTo}`
							)}
						</button>
					</div>
				)}

				{/* ---- Buy / Sell UI ---- */}
				{side !== "Swap" && (
				<div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 18 }}>
					{/* You pay / sell panel */}
					<div>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: 6,
							}}
						>
							<label
								style={{
									fontSize: 12,
									color: "var(--c-text-3)",
									fontWeight: 500,
								}}
							>
								{payLabel}
							</label>
							{side === "Buy" && ngnWalletBalance !== undefined && (
								<span style={{ fontSize: 11.5, color: "var(--c-text-3)", fontFamily: "var(--f-mono)", fontVariantNumeric: "tabular-nums" }}>
									Bal: {formatMoney(ngnWalletBalance, "NGN", { decimals: 0 })}
								</span>
							)}
							{side === "Sell" && walletBalance !== undefined && (
								<span style={{ fontSize: 11.5, color: "var(--c-text-3)", fontFamily: "var(--f-mono)", fontVariantNumeric: "tabular-nums" }}>
									Bal: {walletBalance.toLocaleString()} {asset}
								</span>
							)}
						</div>
						<div
							className="h-[54px] lg:h-16"
							style={{
								padding: "0 14px",
								border: "1px solid var(--c-line)",
								borderRadius: 14,
								background: "var(--c-surface-2)",
								display: "flex",
								alignItems: "center",
								gap: 8,
							}}
						>
							<input
								inputMode="decimal"
								placeholder="0"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								style={{
									flex: 1,
									border: "none",
									background: "transparent",
									outline: "none",
									height: "100%",
									fontSize: 28,
									fontWeight: 600,
									fontFamily: "var(--f-display)",
									fontVariantNumeric: "tabular-nums",
									color: "var(--c-text)",
									padding: 0,
									minWidth: 0,
								}}
							/>
							{side === "Buy" ? (
								<span
									style={{
										fontSize: 18,
										fontFamily: "var(--f-mono)",
										fontVariantNumeric: "tabular-nums",
										color: "var(--c-text-3)",
										fontWeight: 600,
									}}
								>
									NGN
								</span>
							) : (
								<AssetSelector value={asset} onChange={setAsset} />
							)}
						</div>
					</div>

					{/* Arrow divider */}
					<div style={{ display: "flex", justifyContent: "center" }}>
						<div
							style={{
								width: 36,
								height: 36,
								borderRadius: "50%",
								background: "var(--c-onyx-900)",
								color: "var(--c-cream)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<ArrowDownUp size={16} />
						</div>
					</div>

					{/* You receive panel */}
					<div>
						<label
							style={{
								display: "block",
								fontSize: 12,
								color: "var(--c-text-3)",
								marginBottom: 6,
								fontWeight: 500,
							}}
						>
							You receive
						</label>
						<div
							className="h-[54px] lg:h-16"
							style={{
								padding: "0 14px",
								border: "1px solid var(--c-line)",
								borderRadius: 14,
								background: "var(--c-surface-2)",
								display: "flex",
								alignItems: "center",
								gap: 8,
							}}
						>
							<div
								style={{
									flex: 1,
									fontSize: 28,
									fontWeight: 600,
									fontFamily: "var(--f-display)",
									fontVariantNumeric: "tabular-nums",
									color: rate === null ? "var(--c-text-3)" : "var(--c-text)",
								}}
							>
								{receiveValue}
							</div>
							{side === "Buy" ? (
								<AssetSelector value={asset} onChange={setAsset} />
							) : (
								<span
									style={{
										fontSize: 18,
										fontFamily: "var(--f-mono)",
										fontVariantNumeric: "tabular-nums",
										color: "var(--c-text-3)",
										fontWeight: 600,
									}}
								>
									NGN
								</span>
							)}
						</div>
					</div>

					{/* Fee breakdown card */}
					<div
						style={{
							background: "var(--c-surface-2)",
							borderRadius: 14,
							padding: 14,
						}}
					>
						{rateLoading ? (
							<div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", padding: "8px 0" }}>
								<Loader2 size={14} className="animate-spin" style={{ color: "var(--c-text-3)" }} />
								<span style={{ fontSize: 12.5, color: "var(--c-text-3)" }}>Loading rates...</span>
							</div>
						) : rateError || rate === null ? (
							<div style={{ display: "flex", justifyContent: "center", fontSize: 12.5, color: "var(--c-text-3)", padding: "8px 0" }}>
								Rate unavailable — please try again later
							</div>
						) : (
							<>
								<div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
									<span style={{ color: "var(--c-text-3)" }}>Rate</span>
									<span style={{ fontFamily: "var(--f-mono)", fontVariantNumeric: "tabular-nums", color: "var(--c-text)" }}>
										1 {asset} = {formatMoney(rate, "NGN", { decimals: 0 })}
									</span>
								</div>
								<div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginTop: 6 }}>
									<span style={{ color: "var(--c-text-3)" }}>Fee (1.5%)</span>
									<span style={{ fontFamily: "var(--f-mono)", fontVariantNumeric: "tabular-nums", color: "var(--c-text)" }}>
										{formatMoney(feeAmt, "NGN", { decimals: 0 })}
									</span>
								</div>
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, marginTop: 6 }}>
									<span style={{ color: "var(--c-text-3)" }}>Network</span>
									<select
										value={effectiveChain}
										onChange={(e) => setChain(e.target.value)}
										style={{ border: "1px solid var(--c-line)", borderRadius: 6, background: "var(--c-surface)", color: "var(--c-text)", fontSize: 12, padding: "2px 6px", cursor: "pointer" }}
									>
										{selected.chains.map((c) => (
											<option key={c} value={c}>{CHAIN_LABELS[c] ?? c}</option>
										))}
									</select>
								</div>
							</>
						)}
					</div>

					{/* Continue button */}
					<button
						onClick={handleContinue}
						disabled={tradeMutation.isPending || rateLoading || rate === null}
						className="h-[50px] lg:h-12"
						style={{
							width: "100%",
							borderRadius: 10,
							border: "none",
							cursor: (tradeMutation.isPending || rateLoading || rate === null) ? "not-allowed" : "pointer",
							fontSize: 15,
							fontWeight: 500,
							fontFamily: "var(--f-sans)",
							background: "var(--c-lime-500)",
							opacity: (tradeMutation.isPending || rateLoading || rate === null) ? 0.45 : 1,
							color: "var(--c-onyx-900)",
							marginTop: 6,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: 8,
						}}
					>
						{tradeMutation.isPending ? (
							<>
								<Loader2 size={16} className="animate-spin" />
								Processing...
							</>
						) : (
							"Continue → Review"
						)}
					</button>
				</div>
				)}
			</div>
		</div>
	);
}

/* ---- Asset selector pill ---- */
function AssetSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
	return (
		<div style={{ position: "relative", flexShrink: 0 }}>
			<div
				style={{
					display: "inline-flex",
					alignItems: "center",
					gap: 6,
					pointerEvents: "none",
				}}
			>
				<AssetLogo symbol={value} size="sm" />
				<span style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)" }}>{value}</span>
				<svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.5 }}>
					<path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				style={{
					position: "absolute",
					inset: 0,
					opacity: 0,
					cursor: "pointer",
					width: "100%",
					height: "100%",
				}}
			>
				{SUPPORTED_ASSETS.map((a) => (
					<option key={a.symbol} value={a.symbol}>
						{a.symbol}
					</option>
				))}
			</select>
		</div>
	);
}
