"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { formatMoney } from "@/lib/utils";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { ChainBadge } from "@/components/primitives/chain-badge";
import { Num } from "@/components/primitives/num";
import { AlertTriangle, ArrowRight, Check, QrCode, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getUserWallet } from "@/lib/api/wallet/queries";
import type { Wallet } from "@/store/wallet";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const NG_BANKS = [
	{ code: "044", name: "Access Bank" },
	{ code: "058", name: "GTBank" },
	{ code: "011", name: "First Bank" },
	{ code: "033", name: "UBA" },
	{ code: "057", name: "Zenith Bank" },
	{ code: "232", name: "Sterling Bank" },
	{ code: "070", name: "Fidelity Bank" },
	{ code: "221", name: "Stanbic IBTC" },
	{ code: "50211", name: "Kuda" },
	{ code: "100004", name: "Opay" },
	{ code: "50515", name: "Moniepoint" },
	{ code: "999992", name: "Palmpay" },
];

interface AssetDef {
	sym: string;
	name: string;
	chain: string;
	networks: string[];
	price: number;
	bal: number;
	balNgn: number;
}

const FALLBACK_ASSETS: AssetDef[] = [
	{ sym: "USDT", name: "Tether USD", chain: "Tron", networks: ["Tron", "BSC", "Ethereum"], price: 1.0, bal: 0, balNgn: 0 },
	{ sym: "USDC", name: "USD Coin", chain: "BSC", networks: ["BSC", "Ethereum", "Solana"], price: 1.0, bal: 0, balNgn: 0 },
	{ sym: "NGN", name: "Naira", chain: "Bank", networks: ["Bank transfer"], price: 0.000621, bal: 0, balNgn: 0 },
];

const CHAIN_MAP: Record<string, string[]> = {
	USDT: ["Tron", "BSC", "Ethereum"],
	USDC: ["BSC", "Ethereum", "Solana"],
	NGN: ["Bank transfer"],
};

const NGN_RATE = 1610.5;

function walletToAssets(wallets: Wallet[]): AssetDef[] {
	return wallets
		.filter((w) => ["USDT", "USDC", "NGN"].includes(w.currency))
		.map((w) => ({
			sym: w.currency,
			name: w.name,
			chain: CHAIN_MAP[w.currency]?.[0] ?? "Tron",
			networks: CHAIN_MAP[w.currency] ?? ["Tron"],
			price: (w.currency as string) === "NGN" ? 0.000621 : 1.0,
			bal: w.balance,
			balNgn: (w.currency as string) === "NGN" ? w.balance : w.balance * NGN_RATE,
		}));
}

/* ------------------------------------------------------------------ */
/*  Step indicator                                                     */
/* ------------------------------------------------------------------ */

const STEP_LABELS = ["Asset", "Recipient", "Amount", "Review"];

function StepIndicator({ current }: { current: number }) {
	return (
		<div className="flex gap-3">
			{STEP_LABELS.map((label, i) => {
				const stepNum = i + 1;
				const done = current > stepNum;
				const active = current === stepNum;
				return (
					<div key={label} className="flex items-center gap-2 flex-1">
						<div
							className="flex items-center justify-center rounded-full text-xs font-semibold shrink-0"
							style={{
								width: 24,
								height: 24,
								background: done
									? "var(--c-lime-500)"
									: active
										? "var(--c-onyx-900)"
										: "var(--c-surface-3)",
								color: done
									? "var(--c-onyx-900)"
									: active
										? "var(--c-cream)"
										: "var(--c-text-3)",
							}}
						>
							{done ? <Check className="size-3" /> : stepNum}
						</div>
						<span className={`text-xs ${active ? "font-semibold" : "font-normal text-muted-foreground"}`}>
							{label}
						</span>
					</div>
				);
			})}
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  Send Confirm Modal                                                 */
/* ------------------------------------------------------------------ */

interface SendPayload {
	amount: number;
	asset: string;
	ngn: number;
	to: string;
	network: string;
	fee: string;
	total: string;
}

function SendConfirmModal({
	open,
	onClose,
	payload,
	onConfirm,
}: {
	open: boolean;
	onClose: () => void;
	payload: SendPayload | null;
	onConfirm: () => Promise<void>;
}) {
	const [pin, setPin] = useState("");
	const [modalStep, setModalStep] = useState<"review" | "pin" | "processing" | "done">("review");
	const hiddenInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (open) {
			setModalStep("review");
			setPin("");
		}
	}, [open]);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	const handleAuthorize = useCallback(async () => {
		if (pin.length !== 6) return;
		setModalStep("processing");
		try {
			await onConfirm();
			setModalStep("done");
		} catch {
			setModalStep("pin");
			toast.error("Transaction failed. Please try again.");
		}
	}, [pin, onConfirm]);

	if (!open || !payload) return null;

	const numpadKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "\u232b"];

	return (
		<div className="send-modal-back" onClick={onClose}>
			<div className="send-modal" onClick={(e) => e.stopPropagation()}>
				{/* Header */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "14px 18px",
						borderBottom: "1px solid var(--c-line)",
					}}
				>
					<span style={{ fontWeight: 600, fontSize: 15 }}>
						{modalStep === "done"
							? "Sent"
							: modalStep === "review"
								? "Confirm transaction"
								: "Enter PIN"}
					</span>
					<button
						onClick={onClose}
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							width: 28,
							height: 28,
							borderRadius: 6,
							border: "none",
							background: "var(--c-surface-2)",
							color: "var(--c-text-2)",
						}}
					>
						<X className="size-3.5" />
					</button>
				</div>

				{/* Body */}
				<div style={{ padding: "16px 18px" }}>
					{/* REVIEW step */}
					{modalStep === "review" && (
						<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
							<div style={{ textAlign: "center", padding: "8px 0" }}>
								<div
									style={{
										fontSize: 12,
										textTransform: "uppercase",
										color: "var(--c-text-3)",
										letterSpacing: "0.04em",
									}}
								>
									You&apos;re sending
								</div>
								<div
									style={{
										fontSize: 34,
										fontWeight: 600,
										fontFamily: "var(--f-mono)",
										marginTop: 6,
									}}
								>
									{payload.amount} {payload.asset}
								</div>
								<div
									style={{
										color: "var(--c-text-3)",
										fontFamily: "var(--f-mono)",
										marginTop: 4,
										fontSize: 14,
									}}
								>
									&asymp; &nbsp;&#x20A6;{payload.ngn.toLocaleString()}
								</div>
							</div>

							{/* Detail rows */}
							<div
								style={{
									background: "var(--c-surface-2)",
									borderRadius: 10,
									padding: "4px 14px",
								}}
							>
								{(
									[
										["To", payload.to],
										["Network", payload.network],
										["Fee", payload.fee],
										["Total", payload.total],
									] as const
								).map(([k, v]) => (
									<div
										key={k}
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											padding: "10px 0",
											borderBottom: "1px solid var(--c-line)",
											fontSize: 13,
										}}
									>
										<span style={{ color: "var(--c-text-3)" }}>{k}</span>
										<span
											style={{
												fontFamily: "var(--f-mono)",
												fontWeight: 500,
												maxWidth: 240,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											}}
										>
											{v}
										</span>
									</div>
								))}
							</div>

							{/* Warning */}
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: 8,
									padding: "10px 12px",
									background: "var(--c-warn-soft)",
									borderRadius: 8,
									fontSize: 12,
									color: "var(--c-warn)",
								}}
							>
								<AlertTriangle className="size-4 shrink-0" />
								<span>Crypto transactions are irreversible. Double-check the address.</span>
							</div>

							{/* Buttons */}
							<div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
								<button
									onClick={onClose}
									style={{
										height: 38,
										padding: "0 16px",
										borderRadius: 10,
										border: "1px solid var(--c-line)",
										background: "transparent",
										color: "var(--c-text)",
										fontSize: 13.5,
										fontWeight: 500,
										cursor: "pointer",
									}}
								>
									Cancel
								</button>
								<button
									onClick={() => setModalStep("pin")}
									style={{
										height: 38,
										padding: "0 16px",
										borderRadius: 10,
										border: "none",
										background: "var(--c-lime-500)",
										color: "var(--c-onyx-900)",
										fontSize: 13.5,
										fontWeight: 500,
										cursor: "pointer",
									}}
								>
									Continue
								</button>
							</div>
						</div>
					)}

					{/* PIN step */}
					{modalStep === "pin" && (
						<div style={{ textAlign: "center" }}>
							<div style={{ fontSize: 14, marginBottom: 14 }}>
								Enter your 6-digit PIN to authorize
							</div>

							{/* PIN display boxes */}
							<div
								style={{ display: "flex", gap: 8, justifyContent: "center" }}
								onClick={() => hiddenInputRef.current?.focus()}
							>
								{[0, 1, 2, 3, 4, 5].map((i) => (
									<div
										key={i}
										style={{
											width: 40,
											height: 48,
											borderRadius: 8,
											border: `1px solid ${pin.length > i ? "var(--c-lime-500)" : "var(--c-line)"}`,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											fontSize: 20,
											fontWeight: 600,
											background:
												pin.length > i
													? "color-mix(in oklab, var(--c-lime-500) 8%, transparent)"
													: "var(--c-bg)",
											transition: "border-color 0.15s, background 0.15s",
										}}
									>
										{pin[i] ? "\u2022" : ""}
									</div>
								))}
							</div>

							{/* Hidden real input for keyboard typing */}
							<input
								ref={hiddenInputRef}
								autoFocus
								type="password"
								inputMode="numeric"
								maxLength={6}
								value={pin}
								onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
								style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
							/>

							{/* Numpad */}
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "repeat(3, 1fr)",
									gap: 6,
									marginTop: 18,
									maxWidth: 240,
									marginLeft: "auto",
									marginRight: "auto",
								}}
							>
								{numpadKeys.map((k, i) => (
									<button
										key={i}
										onClick={() => {
											if (k === "\u232b") setPin((p) => p.slice(0, -1));
											else if (k && pin.length < 6) setPin((p) => p + k);
										}}
										disabled={!k}
										style={{
											padding: "14px 0",
											borderRadius: 8,
											border: k ? "1px solid var(--c-line)" : "none",
											background: k ? "var(--c-surface)" : "transparent",
											color: "var(--c-text)",
											fontSize: 18,
											fontWeight: 500,
											cursor: k ? "pointer" : "default",
										}}
									>
										{k}
									</button>
								))}
							</div>

							{/* Authorize button */}
							<button
								style={{
									width: "100%",
									height: 42,
									marginTop: 18,
									borderRadius: 10,
									border: "none",
									background:
										pin.length === 6 ? "var(--c-lime-500)" : "var(--c-surface-3)",
									color:
										pin.length === 6 ? "var(--c-onyx-900)" : "var(--c-text-3)",
									fontSize: 14,
									fontWeight: 500,
									cursor: pin.length === 6 ? "pointer" : "not-allowed",
								}}
								disabled={pin.length !== 6}
								onClick={handleAuthorize}
							>
								Authorize
							</button>

							<div style={{ fontSize: 12, color: "var(--c-text-3)", marginTop: 10 }}>
								Or use{" "}
								<button
									style={{
										padding: "2px 6px",
										borderRadius: 4,
										border: "1px solid var(--c-line)",
										background: "transparent",
										color: "var(--c-text-2)",
										fontSize: 12,
									}}
								>
									Face ID
								</button>
							</div>
						</div>
					)}

					{/* PROCESSING step */}
					{modalStep === "processing" && (
						<div style={{ textAlign: "center", padding: "30px 0" }}>
							<div
								style={{
									width: 56,
									height: 56,
									borderRadius: "50%",
									border: "3px solid var(--c-line)",
									borderTopColor: "var(--c-lime-500)",
									margin: "0 auto",
									animation: "send-spin 0.8s linear infinite",
								}}
							/>
							<div style={{ marginTop: 16, fontSize: 14 }}>Broadcasting transaction...</div>
							<div style={{ color: "var(--c-text-3)", fontSize: 12, marginTop: 4 }}>
								This usually takes 5-15 seconds
							</div>
						</div>
					)}

					{/* DONE step */}
					{modalStep === "done" && (
						<div style={{ textAlign: "center", padding: "20px 0" }}>
							<div
								style={{
									width: 64,
									height: 64,
									borderRadius: "50%",
									background: "var(--c-up)",
									color: "#fff",
									margin: "0 auto",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: 30,
								}}
							>
								<Check className="size-8" />
							</div>
							<div style={{ fontSize: 18, fontWeight: 600, marginTop: 14 }}>
								Sent successfully
							</div>
							<div style={{ color: "var(--c-text-3)", fontSize: 13, marginTop: 4 }}>
								{payload.amount} {payload.asset} is on its way
							</div>
							<button
								onClick={onClose}
								style={{
									width: "100%",
									height: 42,
									marginTop: 18,
									borderRadius: 10,
									border: "none",
									background: "var(--c-lime-500)",
									color: "var(--c-onyx-900)",
									fontSize: 14,
									fontWeight: 500,
									cursor: "pointer",
								}}
							>
								Done
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function SendPage() {
	const [step, setStep] = useState(1);
	const [asset, setAsset] = useState("USDT");
	const [network, setNetwork] = useState("Tron");
	const [addr, setAddr] = useState("");
	const [bankCode, setBankCode] = useState("058");
	const [acctNo, setAcctNo] = useState("");
	const [acctName, setAcctName] = useState("");
	const [narration, setNarration] = useState("");
	const [amount, setAmount] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [confirmPayload, setConfirmPayload] = useState<SendPayload | null>(null);

	// Wallet data
	const { data: walletData, isLoading: walletLoading } = useQuery({
		queryKey: ["wallet"],
		queryFn: getUserWallet,
		retry: false,
	});

	const assets = useMemo(() => {
		const live = walletToAssets(walletData?.walletAssets ?? []);
		return live.length > 0 ? live : FALLBACK_ASSETS;
	}, [walletData]);

	const a = assets.find((x) => x.sym === asset) ?? FALLBACK_ASSETS[0];
	const isNgn = asset === "NGN";
	const networks = a.networks;

	// Keep network valid when switching asset
	useEffect(() => {
		if (!networks.includes(network)) setNetwork(networks[0]);
	}, [asset, networks, network]);

	// Address placeholders per network
	const placeholder =
		network === "Tron"
			? "TQrZ8xY9k2PpVm5Lq6Wc3FjN1Hm4Bg7Aa"
			: network === "BSC"
				? "0x742d35Cc6634C0532925a3b8D8c4f5e88aB12345"
				: network === "Ethereum"
					? "0xab47cd9e8c12fE3aB6F84d2E91d0f3aB84c12fE3"
					: network === "Solana"
						? "7xKXy2pPq8mLnVcRfTbKjW3sN1Hm4Bg7Aa9KdEsXrYz"
						: "bc1qxy7j8k2vh9m6qz3ld4p5wn8r2bf9k";

	// Fees
	const fee = isNgn ? 50 : network === "Tron" ? 1 : network === "BSC" ? 0.3 : network === "Solana" ? 0.01 : 5;
	const feeLbl = isNgn
		? `₦${fee}`
		: `${fee} ${network === "Tron" ? "TRX" : network === "BSC" ? "BNB" : network === "Solana" ? "SOL" : "USDT"}`;

	const amtNum = parseFloat(amount) || 0;
	const ngnValue = amtNum * (a.price > 1 ? a.price * NGN_RATE : a.price > 0.5 ? NGN_RATE : a.price);
	const recipientValid = isNgn ? acctNo.length >= 10 : addr.length >= 20;

	// Navigation validation
	const canContinue =
		step === 1
			? true
			: step === 2
				? recipientValid
				: step === 3
					? amtNum > 0
					: true;

	const handleContinue = () => {
		if (step < 4) {
			setStep(step + 1);
		} else {
			// Open the confirm modal instead of submitting directly
			const recipient = isNgn
				? `${NG_BANKS.find((b) => b.code === bankCode)?.name ?? ""} \u00b7 ${acctNo}`
				: addr
					? `${addr.slice(0, 12)}\u2026${addr.slice(-6)}`
					: "\u2014";

			setConfirmPayload({
				amount: amtNum,
				asset,
				ngn: ngnValue,
				to: recipient,
				network: isNgn ? "Bank transfer" : network,
				fee: feeLbl,
				total: isNgn
					? `\u20A6${(amtNum + fee).toLocaleString()}`
					: `${(amtNum + (["Tron", "BSC", "Solana"].includes(network) ? 0 : fee)).toFixed(4)} ${asset}`,
			});
			setConfirmOpen(true);
		}
	};

	const handleConfirm = useCallback(async () => {
		const apiPayload = isNgn
			? {
					asset: "NGN",
					amount: amtNum,
					bank_code: bankCode,
					account_number: acctNo,
					account_name: acctName,
					narration,
				}
			: {
					asset,
					amount: amtNum,
					network: network.toLowerCase(),
					recipient_address: addr,
				};

		const res = await fetch("/api/transfer/send", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(apiPayload),
		});
		const data = await res.json();
		if (data.status) {
			toast.success(data.message ?? "Transaction submitted");
			// Reset form after modal closes
			setStep(1);
			setAmount("");
			setAddr("");
			setAcctNo("");
			setAcctName("");
			setNarration("");
		} else {
			throw new Error(data.message ?? "Transfer failed");
		}
	}, [isNgn, amtNum, bankCode, acctNo, acctName, narration, asset, network, addr]);

	if (walletLoading) {
		return (
			<div className="max-w-[600px] mx-auto flex items-center justify-center py-24">
				<Loader2 className="size-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="max-w-[600px] mx-auto w-full space-y-5 lg:space-y-6 px-4 lg:px-0">
			<h1 className="font-display text-[22px] lg:text-[32px] font-semibold" style={{ letterSpacing: "-0.03em" }}>
				Send {isNgn ? "naira" : "crypto"}
			</h1>

			{/* Mobile progress bars (thin lines) */}
			<div className="flex gap-1.5 lg:hidden">
				{[1, 2, 3, 4].map((s) => (
					<div
						key={s}
						className="flex-1 h-1 rounded-sm"
						style={{
							background: s <= step ? "var(--c-lime-500)" : "var(--c-surface-3)",
						}}
					/>
				))}
			</div>

			{/* Desktop step indicator (numbered circles) */}
			<div className="hidden lg:block">
				<StepIndicator current={step} />
			</div>

			{/* Main card */}
			<div className="ds-card" style={{ borderRadius: 14 }}>
				<div className="space-y-4 p-4 lg:px-6 lg:py-4">
					{/* ============ STEP 1: Asset selection ============ */}
					{step === 1 && (
						<div className="space-y-3">
							<label style={{ fontSize: 12, color: "var(--c-text-3)" }}>Choose what to send</label>
							{assets.slice(0, 4).map((x) => (
								<button
									key={x.sym}
									type="button"
									onClick={() => setAsset(x.sym)}
									className="w-full flex items-center justify-between rounded-xl px-4 py-3.5 cursor-pointer transition-colors text-left"
									style={{
										border: `1px solid ${asset === x.sym ? "var(--c-onyx-900)" : "var(--c-line)"}`,
										background: asset === x.sym ? "var(--c-surface-2)" : "var(--c-surface)",
									}}
								>
									<div className="flex items-center gap-3">
										<AssetLogo symbol={x.sym} size="md" />
										<div>
											<div className="flex items-center gap-2">
												<span className="font-semibold text-sm">{x.name}</span>
												{(x.sym === "USDT" || x.sym === "USDC" || x.sym === "NGN") && (
													<span
														className="text-[10px] font-semibold rounded-full px-2 py-0.5"
														style={{
															background: "var(--c-lime-500)",
															color: "var(--c-onyx-900)",
														}}
													>
														Recommended
													</span>
												)}
											</div>
											<div className="text-[11px] text-muted-foreground">
												{x.sym === "NGN"
													? "Bank transfer \u00b7 Nigeria"
													: x.networks.join(" \u00b7 ")}
											</div>
										</div>
									</div>
									<div className="text-right">
										<div className="font-mono font-semibold text-sm tabular-nums">
											{x.sym === "NGN"
												? formatMoney(x.bal, "NGN", { decimals: 0 })
												: `${x.bal.toFixed(4)} ${x.sym}`}
										</div>
										<div className="font-mono text-[11px] text-muted-foreground tabular-nums">
											{x.sym === "NGN"
												? "Available"
												: formatMoney(x.balNgn, "NGN", { decimals: 0 })}
										</div>
									</div>
								</button>
							))}
						</div>
					)}

					{/* ============ STEP 2: Recipient (crypto) ============ */}
					{step === 2 && !isNgn && (
						<div className="space-y-4">
							{/* Network selector */}
							{networks.length > 1 ? (
								<div>
									<label style={{ fontSize: 12, color: "var(--c-text-3)" }}>Network</label>
									<div className="flex flex-wrap gap-2 mt-1.5">
										{networks.map((n) => (
											<button
												key={n}
												type="button"
												onClick={() => setNetwork(n)}
												className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
													network === n
														? "bg-[var(--c-onyx-900)] text-[var(--c-cream)] border-[var(--c-onyx-900)]"
														: "bg-transparent border-[var(--c-line)] text-[var(--c-text)] hover:bg-[var(--c-surface-2)]"
												}`}
											>
												{n}
											</button>
										))}
									</div>
									<p className="text-[11px] text-muted-foreground mt-2">
										Tron has the lowest fees for {asset}. Use the same network as the
										recipient&apos;s wallet.
									</p>
								</div>
							) : (
								<div>
									<label style={{ fontSize: 12, color: "var(--c-text-3)" }}>Network</label>
									<div className="flex items-center gap-2 mt-1.5 rounded-xl border border-[var(--c-line)] px-4 py-3">
										<AssetLogo symbol={asset} size="sm" />
										<span className="text-sm">{network}</span>
									</div>
								</div>
							)}

							{/* Recipient address */}
							<div>
								<label style={{ fontSize: 12, color: "var(--c-text-3)" }}>Recipient address</label>
								<input
									className="font-mono mt-1.5"
									style={{ border: "1px solid var(--c-line)", borderRadius: 10, height: 38, padding: "0 12px", background: "var(--c-surface)", color: "var(--c-text)", fontSize: 13, width: "100%", outline: "none" }}
									placeholder={placeholder}
									value={addr}
									onChange={(e) => setAddr(e.target.value)}
								/>
							</div>

							{/* QR / Saved buttons */}
							<div className="flex gap-2">
								<button
									className="flex-1 flex items-center justify-center gap-1.5"
									style={{
										height: 38,
										borderRadius: 10,
										border: "1px solid var(--c-line)",
										background: "transparent",
										color: "var(--c-text)",
										fontSize: 13.5,
										fontWeight: 500,
										cursor: "pointer",
									}}
								>
									<QrCode className="size-4" />
									Scan QR
								</button>
								<button
									className="flex-1 flex items-center justify-center"
									style={{
										height: 38,
										borderRadius: 10,
										border: "1px solid var(--c-line)",
										background: "transparent",
										color: "var(--c-text)",
										fontSize: 13.5,
										fontWeight: 500,
										cursor: "pointer",
									}}
								>
									Saved addresses
								</button>
							</div>

							{/* Warning card */}
							<div
								className="rounded-xl p-3.5 text-xs"
								style={{
									background: "var(--c-warn-soft, oklch(0.95 0.05 85))",
									border: "1px solid var(--c-warn, oklch(0.75 0.15 85))",
								}}
							>
								<div className="flex items-center gap-2">
									<AlertTriangle className="size-4 shrink-0" style={{ color: "var(--c-warn, oklch(0.75 0.15 85))" }} />
									<span className="font-semibold">Triple-check the network.</span>
								</div>
								<p className="text-muted-foreground mt-1">
									Sending {asset} on {network} to a wrong-network address means lost funds
									&mdash; Clusteer cannot recover them.
								</p>
							</div>
						</div>
					)}

					{/* ============ STEP 2: Recipient (NGN) ============ */}
					{step === 2 && isNgn && (
						<div className="space-y-4">
							{/* Bank selector */}
							<div>
								<label style={{ fontSize: 12, color: "var(--c-text-3)" }}>Bank</label>
								<select
									className="mt-1.5 flex h-10 w-full rounded-xl border border-[var(--c-line)] bg-[var(--c-surface)] px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
									value={bankCode}
									onChange={(e) => setBankCode(e.target.value)}
								>
									{NG_BANKS.map((b) => (
										<option key={b.code} value={b.code}>
											{b.name}
										</option>
									))}
								</select>
							</div>

							{/* Account number */}
							<div>
								<label style={{ fontSize: 12, color: "var(--c-text-3)" }}>Account number</label>
								<input
									className="font-mono mt-1.5 tabular-nums"
									style={{ border: "1px solid var(--c-line)", borderRadius: 10, height: 38, padding: "0 12px", background: "var(--c-surface)", color: "var(--c-text)", fontSize: 13.5, width: "100%", outline: "none" }}
									maxLength={10}
									inputMode="numeric"
									placeholder="0123456789"
									value={acctNo}
									onChange={(e) => {
										const val = e.target.value.replace(/\D/g, "").slice(0, 10);
										setAcctNo(val);
										setAcctName("");
										if (val.length === 10) {
											fetch("/api/bank/verify-account", {
												method: "POST",
												headers: { "Content-Type": "application/json" },
												body: JSON.stringify({ bank_code: bankCode, account_number: val }),
											})
												.then((res) => res.json())
												.then((data) => {
													if (data.status && data.data?.account_name) {
														setAcctName(data.data.account_name);
													} else {
														toast.error(data.message || "Could not verify account");
													}
												})
												.catch(() => {
													toast.error("Account verification failed");
												});
										}
									}}
								/>
							</div>

							{/* Account name (resolved) */}
							{acctName && (
								<div
									className="rounded-xl p-3 text-sm"
									style={{
										background: "var(--c-up-soft, oklch(0.95 0.1 145))",
										border: "1px solid var(--c-up, oklch(0.6 0.2 145))",
									}}
								>
									<div className="text-[11px] text-muted-foreground uppercase tracking-wider">
										Account name
									</div>
									<div className="font-semibold mt-0.5">{acctName}</div>
								</div>
							)}

							{/* Narration */}
							<div>
								<label style={{ fontSize: 12, color: "var(--c-text-3)" }}>Narration (optional)</label>
								<input
									className="mt-1.5"
									style={{ border: "1px solid var(--c-line)", borderRadius: 10, height: 38, padding: "0 12px", background: "var(--c-surface)", color: "var(--c-text)", fontSize: 13.5, width: "100%", outline: "none" }}
									placeholder="What's it for?"
									value={narration}
									onChange={(e) => setNarration(e.target.value)}
								/>
							</div>
						</div>
					)}

					{/* ============ STEP 3: Amount ============ */}
					{step === 3 && (
						<div className="space-y-4">
							{/* Large centered display */}
							<div className="text-center">
								<div className="font-mono text-[42px] lg:text-5xl font-semibold tabular-nums">
									{isNgn
										? `₦${(amtNum).toLocaleString()}`
										: `${amount || "0"} `}
									{!isNgn && (
										<span className="text-muted-foreground">{asset}</span>
									)}
								</div>
								<div className="text-muted-foreground text-sm mt-1">
									{isNgn
										? `≈ ${(amtNum / NGN_RATE).toFixed(2)} USDT`
										: `≈ ${formatMoney(ngnValue, "NGN", { decimals: 0 })}`}
								</div>
							</div>

							{/* Amount input */}
							<input
								className="flex h-12 w-full rounded-xl border border-[var(--c-line)] bg-[var(--c-surface)] px-4 text-lg font-mono tabular-nums text-center focus:outline-none focus:ring-2 focus:ring-ring"
								placeholder="0.00"
								inputMode="decimal"
								value={amount}
								onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
							/>

							{/* Quick fill buttons */}
							<div className="grid grid-cols-4 gap-1.5">
								{(["25%", "50%", "75%", "MAX"] as const).map((p) => {
									const mult = p === "25%" ? 0.25 : p === "50%" ? 0.5 : p === "75%" ? 0.75 : 1;
									return (
										<button
											key={p}
											style={{
												height: 32,
												borderRadius: 8,
												border: "1px solid var(--c-line)",
												background: "transparent",
												color: "var(--c-text)",
												fontSize: 12.5,
												fontWeight: 500,
												cursor: "pointer",
											}}
											onClick={() =>
												setAmount((a.bal * mult).toFixed(isNgn ? 0 : 4))
											}
										>
											{p}
										</button>
									);
								})}
							</div>

							{/* Available balance */}
							<div className="flex items-center justify-between text-xs text-muted-foreground">
								<span>Available</span>
								<Num
									className="font-mono tabular-nums"
									value={
										isNgn
											? formatMoney(a.bal, "NGN", { decimals: 0 })
											: `${a.bal.toFixed(4)} ${asset}`
									}
								/>
							</div>
						</div>
					)}

					{/* ============ STEP 4: Review ============ */}
					{step === 4 && (
						<div className="space-y-3">
							{[
								[
									"Sending",
									isNgn
										? `₦${amtNum.toLocaleString()}`
										: `${amount} ${asset}`,
								],
								...(isNgn
									? [
											["To bank", NG_BANKS.find((b) => b.code === bankCode)?.name ?? ""],
											["Account", `${acctNo} \u00b7 ${acctName}`],
										]
									: [
											["Network", network],
											[
												"To address",
												addr
													? `${addr.slice(0, 12)}…${addr.slice(-6)}`
													: "—",
											],
										]),
								["Fee", feeLbl],
								[
									"Total",
									isNgn
										? `₦${(amtNum + fee).toLocaleString()}`
										: `${(
												amtNum +
												(["Tron", "BSC", "Solana"].includes(network) ? 0 : fee)
											).toFixed(4)} ${asset}`,
								],
							].map(([k, v]) => (
								<div
									key={k}
									className="flex items-center justify-between text-[13.5px] py-2.5 border-b border-[var(--c-line)]"
								>
									<span className="text-muted-foreground">{k}</span>
									<span className="font-mono font-semibold tabular-nums text-right">
										{v}
									</span>
								</div>
							))}

							{/* Disclaimer */}
							<p className="text-[11.5px] text-muted-foreground mt-1">
								By tapping Confirm, you authorise this transfer.{" "}
								{isNgn
									? "Bank transfers settle in under 60 seconds via NIP."
									: "Crypto transfers are irreversible once broadcast."}
							</p>
						</div>
					)}

					{/* ============ Navigation buttons ============ */}
					<div className="flex gap-3 pt-2">
						{step > 1 && (
							<button
								className="flex-1 flex items-center justify-center h-10 rounded-[10px] text-[13.5px] font-medium transition-colors"
								style={{ border: "1px solid var(--c-line)", color: "var(--c-text)", background: "transparent" }}
								onClick={() => setStep(step - 1)}
								disabled={submitting}
							>
								Back
							</button>
						)}
						<button
							className="h-[50px] lg:h-12"
							style={{
								flex: 2,
								borderRadius: 10,
								border: "none",
								fontSize: 15,
								fontWeight: 500,
								fontFamily: "var(--f-sans)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								background: !canContinue || submitting ? "var(--c-surface-3)" : "var(--c-lime-500)",
								color: !canContinue || submitting ? "var(--c-text-3)" : "var(--c-onyx-900)",
								cursor: !canContinue || submitting ? "not-allowed" : "pointer",
								opacity: !canContinue || submitting ? 0.7 : 1,
							}}
							disabled={!canContinue || submitting}
							onClick={handleContinue}
						>
							{submitting ? (
								<Loader2 className="size-4 animate-spin" />
							) : step === 4 ? (
								"Confirm send"
							) : (
								"Continue →"
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Send Confirmation Modal */}
			<SendConfirmModal
				open={confirmOpen}
				onClose={() => setConfirmOpen(false)}
				payload={confirmPayload}
				onConfirm={handleConfirm}
			/>
		</div>
	);
}
