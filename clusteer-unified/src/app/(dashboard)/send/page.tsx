"use client";

import { useState, useMemo } from "react";
import { formatMoney } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { ChainBadge } from "@/components/primitives/chain-badge";
import { Num } from "@/components/primitives/num";
import { StepsHorizontal } from "@/components/primitives/steps";
import { AlertTriangle, ArrowRight, Shield, Loader2 } from "lucide-react";
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

const SAVED = [
	{ label: "Chidi's wallet", address: "0x8aC7230489E80000d4f3bB9C3C4f48e12f3" },
	{ label: "Mum (Tron)", address: "TXfM9pA2kL8c6D4wQ3rX5zYH8m2bN9J1fA" },
	{ label: "Freelance client", address: "0x32b7e5A4b4D2a1eF9c8B7a6D5c4E3f2a1B0aC11" },
];

export default function SendPage() {
	const [step, setStep] = useState<"form" | "review" | "otp" | "done">("form");
	const [asset, setAsset] = useState("USDT");
	const [chain, setChain] = useState("Tron");
	const [amount, setAmount] = useState("");
	const [address, setAddress] = useState("");
	const [note, setNote] = useState("");
	const [otp, setOtp] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [recipientVerified, setRecipientVerified] = useState<boolean | null>(null);
	const [recipientUsername, setRecipientUsername] = useState("");
	const [verifyingRecipient, setVerifyingRecipient] = useState(false);

	// Fetch wallet data
	const { data: walletData, isLoading: walletLoading } = useQuery({
		queryKey: ["wallet"],
		queryFn: getUserWallet,
		retry: false,
	});

	const assets = useMemo(() => walletToAssets(walletData?.walletAssets ?? []), [walletData]);

	// Fetch exchange rate for NGN conversion display
	const chainCode = asset === "USDT" ? "TRON" : "ETH";
	const { data: exchangeRateData } = useQuery({
		queryKey: ["exchangeRate", chainCode],
		queryFn: () => getExchangeRate({ baseCurrency: chainCode as any, targetCurrency: "NGN", amount: 1 }),
		retry: false,
	});
	const priceNgn = exchangeRateData?.sale ?? 1_570;

	const selected = assets.find((a) => a.symbol === asset) ?? {
		symbol: asset,
		name: asset,
		chains: CHAIN_MAP[asset] ?? ["Tron"],
		balance: 0,
		address: "",
	};

	const amtNum = parseFloat(amount) || 0;

	// Fetch fee estimate from Django; fall back to hardcoded values on error
	const hardcodedFee = chain === "Tron" ? 1 : chain === "BSC" ? 0.5 : 2.5;
	const { data: feeData, isLoading: feeLoading } = useQuery({
		queryKey: ["estimateFee", chain, amtNum],
		queryFn: async () => {
			if (amtNum <= 0) return null;
			const res = await fetch(`/api/system/estimate-fee?chain=${chain.toLowerCase()}&amount=${amtNum}`);
			const json = await res.json();
			if (!json.status) return null;
			return json.data;
		},
		enabled: amtNum > 0,
		retry: false,
		staleTime: 15_000,
	});
	const fee = feeData?.fee ?? hardcodedFee;
	const total = amtNum + fee;
	const amountNgn = amtNum * priceNgn;

	const verifyRecipient = async (recipientId: string) => {
		if (!recipientId) return;
		setVerifyingRecipient(true);
		setRecipientVerified(null);
		setRecipientUsername("");
		try {
			const res = await fetch(`/api/transfer/verify-recipient/${encodeURIComponent(recipientId)}`);
			const json = await res.json();
			if (json.status && json.data?.exists) {
				setRecipientVerified(true);
				setRecipientUsername(json.data.username || recipientId);
			} else {
				setRecipientVerified(false);
			}
		} catch {
			setRecipientVerified(false);
		} finally {
			setVerifyingRecipient(false);
		}
	};

	const submit = async () => {
		if (!amount || !address) {
			toast.error("Fill in all required fields");
			return;
		}
		if (amtNum <= 0) {
			toast.error("Amount must be greater than zero");
			return;
		}
		if (total > selected.balance) {
			toast.error(`Insufficient balance. You have ${selected.balance.toFixed(2)} ${asset} but need ${total.toFixed(2)} ${asset} (including fee).`);
			return;
		}
		// Basic address format validation
		if (chain === "Tron" && !address.startsWith("T")) {
			toast.error("Invalid Tron address. Tron addresses start with T.");
			return;
		}
		if ((chain === "Ethereum" || chain === "BSC" || chain === "Polygon") && !address.startsWith("0x")) {
			toast.error(`Invalid ${chain} address. EVM addresses start with 0x.`);
			return;
		}
		if (address.length < 20) {
			toast.error("Address is too short. Please check and try again.");
			return;
		}

		// Verify recipient exists before proceeding to review
		if (recipientVerified !== true) {
			setVerifyingRecipient(true);
			try {
				const res = await fetch(`/api/transfer/verify-recipient/${encodeURIComponent(address)}`);
				const json = await res.json();
				if (json.status && json.data?.exists) {
					setRecipientVerified(true);
					setRecipientUsername(json.data.username || address);
					setStep("review");
				} else {
					setRecipientVerified(false);
					toast.error("Recipient not found. Please check the address or username.");
				}
			} catch {
				toast.error("Unable to verify recipient. Please try again.");
			} finally {
				setVerifyingRecipient(false);
			}
			return;
		}

		setStep("review");
	};

	const confirm = () => {
		setStep("otp");
	};

	const authorize = async () => {
		if (otp.length < 6) {
			toast.error("Enter the 6-digit code");
			return;
		}
		setSubmitting(true);
		try {
			const res = await fetch("/api/transfer/internal", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					// For internal P2P transfers, `address` holds a Clusteer username/user ID
					// (not a blockchain address). The Django endpoint validates this value.
					recipient_user_id: address,
					asset: asset,
					amount: amtNum,
					chain: chain.toLowerCase(),
					note: note || undefined,
				}),
			});
			const data = await res.json();
			if (data.status) {
				setStep("done");
				toast.success(data.message ?? "Transaction submitted");
			} else {
				toast.error(data.message ?? "Transfer failed");
			}
		} catch (err) {
			toast.error("Network error. Please try again.");
		} finally {
			setSubmitting(false);
		}
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
			<p className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-brand-800 mb-1">&#9670; Transfer</p>
			<h1 className="font-display text-xl sm:text-2xl font-bold tracking-[-0.02em] mb-4 sm:mb-6">Send stablecoins</h1>
			<Card className="border-2 border-custom-black rounded-[16px] sm:rounded-[20px]">
				<CardHeader className="p-4 sm:p-6 lg:p-8">
					<StepsHorizontal
						current={step === "form" ? 0 : step === "review" ? 1 : step === "otp" ? 2 : 3}
						steps={["Details", "Review", "Authorize", "Submitted"]}
					/>
				</CardHeader>
				<CardContent className="space-y-4 sm:space-y-5 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
					{step === "form" && (
						<>
							<div>
								<Label>Asset</Label>
								<Select value={asset} onValueChange={(v) => { setAsset(v); const found = assets.find((a) => a.symbol === v); setChain(found?.chains[0] ?? "Tron"); }}>
									<SelectTrigger className="mt-1.5">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{(assets.length > 0 ? assets : [{ symbol: "USDT", name: "Tether" }, { symbol: "USDC", name: "USD Coin" }]).map((a) => (
											<SelectItem key={a.symbol} value={a.symbol}>
												<span className="inline-flex items-center gap-2">
													<AssetLogo symbol={a.symbol} size="sm" />
													{a.name} <span className="text-muted-foreground">{a.symbol}</span>
												</span>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<div className="mt-1.5 text-xs text-muted-foreground">
									Available: <Num className="font-mono tabular-nums" value={selected.balance + " " + selected.symbol} /> · <Num className="font-mono tabular-nums" value={formatMoney(selected.balance * priceNgn, "NGN", { decimals: 0 })} />
								</div>
							</div>

							<div>
								<Label>Network</Label>
								<div className="mt-1.5 flex flex-wrap gap-2">
									{selected.chains.map((c) => (
										<button
											key={c}
											onClick={() => setChain(c)}
											className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition ${chain === c ? "border-custom-black bg-[#EFFCD0] text-foreground shadow-brutal-sm" : "border-custom-black/30 text-muted-foreground hover:bg-warm-beige"}`}
										>
											<ChainBadge chain={c} />
										</button>
									))}
								</div>
							</div>

							<div>
								<div className="flex items-center justify-between">
									<Label htmlFor="address">Recipient address</Label>
									<Select onValueChange={setAddress}>
										<SelectTrigger className="h-7 w-auto border-0 bg-transparent text-xs text-primary shadow-none hover:bg-muted">
											<SelectValue placeholder="From saved…" />
										</SelectTrigger>
										<SelectContent>
											{SAVED.map((s) => (
												<SelectItem key={s.address} value={s.address}>{s.label}</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<Input id="address" className="font-mono mt-1.5" placeholder={`e.g. 0x… or ${chain === "Tron" ? "T…" : chain === "Solana" ? "8v…" : "bc1…"}`} value={address} onChange={(e) => { setAddress(e.target.value); setRecipientVerified(null); }} onBlur={() => { if (address.length >= 5) verifyRecipient(address); }} />
								{verifyingRecipient && <p className="mt-1 text-xs text-muted-foreground">Verifying recipient...</p>}
								{recipientVerified === true && <p className="mt-1 text-xs text-green-600 flex items-center gap-1">&#10003; Verified: {recipientUsername}</p>}
								{recipientVerified === false && <p className="mt-1 text-xs text-red-500">Recipient not found. Check the address or username.</p>}
							</div>

							<div>
								<Label htmlFor="amount">Amount</Label>
								<div className="mt-1.5 flex items-center gap-2 rounded-[14px] border-2 border-custom-black/20 bg-[#EFFCD0]/30 px-3 py-0 focus-within:ring-2 focus-within:ring-ring">
									<input
										id="amount"
										inputMode="decimal"
										className="font-mono h-11 flex-1 bg-transparent outline-none text-lg tabular-nums"
										placeholder="0.00"
										value={amount}
										onChange={(e) => setAmount(e.target.value)}
									/>
									<span className="text-sm font-medium text-muted-foreground">{asset}</span>
									<button onClick={() => setAmount(selected.balance.toString())} className="rounded-full px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/5">MAX</button>
								</div>
								<div className="mt-1 text-xs text-muted-foreground font-mono">≈ <Num className="font-mono tabular-nums" value={formatMoney(amountNgn, "NGN", { decimals: 0 })} /></div>
							</div>

							<div>
								<Label htmlFor="note">Note (optional)</Label>
								<Input id="note" className="mt-1.5" placeholder="What's this for?" value={note} onChange={(e) => setNote(e.target.value)} />
							</div>

							<div className="rounded-[14px] bg-warm-beige p-4 text-xs space-y-1">
								<div className="flex justify-between"><span className="text-muted-foreground">Network fee</span>{feeLoading && amtNum > 0 ? <span className="font-mono tabular-nums text-muted-foreground">estimating...</span> : <Num className="font-mono tabular-nums" value={fee + " " + asset} />}</div>
								<div className="flex justify-between font-medium"><span>You'll send</span><Num className="font-mono tabular-nums" value={total.toFixed(4) + " " + asset} /></div>
							</div>

							<Button onClick={submit} size="lg" className="w-full rounded-full shadow-brutal-sm" disabled={verifyingRecipient}>{verifyingRecipient ? <Loader2 className="size-4 animate-spin" /> : <>Continue <ArrowRight className="size-4" /></>}</Button>
						</>
					)}

					{step === "review" && (
						<div className="space-y-4">
							<div className="rounded-[14px] border-2 border-custom-black bg-warm-beige p-4 sm:p-6">
								<div className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-brand-800">&#9670; You're sending</div>
								<Num as="div" className="mt-1 font-mono text-xl sm:text-2xl lg:text-3xl font-bold tabular-nums" value={amount + " " + asset} />
								<Num as="div" tone="muted" className="font-mono tabular-nums" value={formatMoney(amountNgn, "NGN", { decimals: 0 })} />
							</div>
							<dl className="divide-y divide-border rounded-[14px] border-2 border-custom-black">
								<Row k="To">
									<code className="font-mono text-xs">{address.slice(0, 12)}…{address.slice(-8)}</code>
								</Row>
								<Row k="Network"><ChainBadge chain={chain} /></Row>
								<Row k="Network fee"><Num className="font-mono tabular-nums" value={fee + " " + asset} /></Row>
								<Row k="Total"><Num className="font-mono font-semibold tabular-nums" value={total.toFixed(4) + " " + asset} /></Row>
								{note && <Row k="Note">{note}</Row>}
							</dl>
							<div className="flex gap-3 rounded-[14px] border-2 border-warning/30 bg-warning-bg p-3 text-warning">
								<AlertTriangle className="size-5 shrink-0 mt-0.5" />
								<div className="text-xs">Double-check the address. On-chain transactions cannot be reversed.</div>
							</div>
							<div className="flex gap-2">
								<Button variant="outline" className="flex-1 rounded-full border-2 border-custom-black" onClick={() => setStep("form")}>Back</Button>
								<Button className="flex-1 rounded-full shadow-brutal-sm" onClick={confirm}>Confirm & authorize</Button>
							</div>
						</div>
					)}

					{step === "otp" && (
						<div className="space-y-4">
							<div className="flex items-center gap-3 rounded-[14px] border-2 border-custom-black bg-[#EFFCD0]/30 p-4">
								<div className="size-10 sm:size-12 rounded-xl bg-light-green border-[1.5px] border-custom-black flex items-center justify-center">
									<Shield className="size-5 text-custom-black" />
								</div>
								<div className="text-sm">Enter the 6-digit code from your authenticator app.</div>
							</div>
							<Input className="font-mono text-center text-lg sm:text-xl lg:text-2xl tracking-widest rounded-[14px] border-2 border-custom-black" maxLength={6} placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} />
							<div className="flex gap-2">
								<Button variant="outline" className="flex-1 rounded-full border-2 border-custom-black" onClick={() => setStep("review")} disabled={submitting}>Back</Button>
								<Button className="flex-1 rounded-full shadow-brutal-sm" onClick={authorize} disabled={submitting}>
									{submitting ? <Loader2 className="size-4 animate-spin" /> : "Authorize"}
								</Button>
							</div>
						</div>
					)}

					{step === "done" && (
						<DoneDialog open onClose={() => { setStep("form"); setAmount(""); setAddress(""); }} amount={amount} asset={asset} chain={chain} />
					)}
				</CardContent>
			</Card>
		</div>
	);
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
	return (
		<div className="flex items-center justify-between px-4 py-3 text-sm">
			<dt className="text-muted-foreground">{k}</dt>
			<dd>{children}</dd>
		</div>
	);
}

function DoneDialog({ open, onClose, amount, asset, chain }: { open: boolean; onClose: () => void; amount: string; asset: string; chain: string }) {
	return (
		<Dialog open={open} onOpenChange={(o) => !o && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="font-display font-bold tracking-[-0.02em]">Transaction submitted</DialogTitle>
					<DialogDescription>Your {asset} transfer is broadcasting to the {chain} network.</DialogDescription>
				</DialogHeader>
				<div className="rounded-[14px] border-2 border-custom-black bg-[#EFFCD0]/30 p-4 text-sm">
					<div className="flex items-center justify-between"><span className="text-muted-foreground">Amount</span><Num className="font-mono tabular-nums" value={amount + " " + asset} /></div>
					<div className="mt-1 flex items-center justify-between"><span className="text-muted-foreground">Network</span><ChainBadge chain={chain} /></div>
					<div className="mt-1 flex items-center justify-between"><span className="text-muted-foreground">Status</span><span className="text-warning">Broadcasting…</span></div>
				</div>
				<DialogFooter>
					<Button className="rounded-full shadow-brutal-sm" onClick={onClose}>Done</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
