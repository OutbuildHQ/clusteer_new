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
	const fee = chain === "Tron" ? 1 : chain === "BSC" ? 0.5 : 2.5;
	const total = amtNum + fee;
	const amountNgn = amtNum * priceNgn;

	const submit = () => {
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
					recipientUserId: address,
					asset: asset,
					amount: amtNum,
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
			<h1 className="font-display text-2xl font-bold tracking-tight mb-6">Send stablecoins</h1>
			<Card>
				<CardHeader>
					<StepsHorizontal
						current={step === "form" ? 0 : step === "review" ? 1 : step === "otp" ? 2 : 3}
						steps={["Details", "Review", "Authorize", "Submitted"]}
					/>
				</CardHeader>
				<CardContent className="space-y-5">
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
									Available: <Num value={selected.balance + " " + selected.symbol} /> · <Num value={formatMoney(selected.balance * priceNgn, "NGN", { decimals: 0 })} />
								</div>
							</div>

							<div>
								<Label>Network</Label>
								<div className="mt-1.5 flex flex-wrap gap-2">
									{selected.chains.map((c) => (
										<button
											key={c}
											onClick={() => setChain(c)}
											className={`rounded-lg border px-3 py-2 text-sm transition ${chain === c ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:bg-muted"}`}
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
								<Input id="address" className="mono mt-1.5" placeholder={`e.g. 0x… or ${chain === "Tron" ? "T…" : chain === "Solana" ? "8v…" : "bc1…"}`} value={address} onChange={(e) => setAddress(e.target.value)} />
							</div>

							<div>
								<Label htmlFor="amount">Amount</Label>
								<div className="mt-1.5 flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-0 focus-within:ring-2 focus-within:ring-ring">
									<input
										id="amount"
										inputMode="decimal"
										className="mono h-11 flex-1 bg-transparent outline-none text-lg tabular-nums"
										placeholder="0.00"
										value={amount}
										onChange={(e) => setAmount(e.target.value)}
									/>
									<span className="text-sm font-medium text-muted-foreground">{asset}</span>
									<button onClick={() => setAmount(selected.balance.toString())} className="rounded-md px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/5">MAX</button>
								</div>
								<div className="mt-1 text-xs text-muted-foreground">≈ <Num value={formatMoney(amountNgn, "NGN", { decimals: 0 })} /></div>
							</div>

							<div>
								<Label htmlFor="note">Note (optional)</Label>
								<Input id="note" className="mt-1.5" placeholder="What's this for?" value={note} onChange={(e) => setNote(e.target.value)} />
							</div>

							<div className="rounded-lg bg-muted/50 p-3 text-xs space-y-1">
								<div className="flex justify-between"><span className="text-muted-foreground">Network fee</span><Num value={fee + " " + asset} /></div>
								<div className="flex justify-between font-medium"><span>You'll send</span><Num value={total.toFixed(4) + " " + asset} /></div>
							</div>

							<Button onClick={submit} size="lg" className="w-full">Continue <ArrowRight className="size-4" /></Button>
						</>
					)}

					{step === "review" && (
						<div className="space-y-4">
							<div className="rounded-lg border border-border p-4">
								<div className="text-xs uppercase text-muted-foreground tracking-wide">You're sending</div>
								<Num as="div" className="mt-1 font-display text-2xl sm:text-3xl font-bold" value={amount + " " + asset} />
								<Num as="div" tone="muted" value={formatMoney(amountNgn, "NGN", { decimals: 0 })} />
							</div>
							<dl className="divide-y divide-border rounded-lg border border-border">
								<Row k="To">
									<code className="mono text-xs">{address.slice(0, 12)}…{address.slice(-8)}</code>
								</Row>
								<Row k="Network"><ChainBadge chain={chain} /></Row>
								<Row k="Network fee"><Num value={fee + " " + asset} /></Row>
								<Row k="Total"><Num className="font-semibold" value={total.toFixed(4) + " " + asset} /></Row>
								{note && <Row k="Note">{note}</Row>}
							</dl>
							<div className="flex gap-3 rounded-lg border border-warning/30 bg-warning-bg p-3 text-warning">
								<AlertTriangle className="size-5 shrink-0 mt-0.5" />
								<div className="text-xs">Double-check the address. On-chain transactions cannot be reversed.</div>
							</div>
							<div className="flex gap-2">
								<Button variant="outline" className="flex-1" onClick={() => setStep("form")}>Back</Button>
								<Button className="flex-1" onClick={confirm}>Confirm & authorize</Button>
							</div>
						</div>
					)}

					{step === "otp" && (
						<div className="space-y-4">
							<div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
								<Shield className="size-5 text-primary" />
								<div className="text-sm">Enter the 6-digit code from your authenticator app.</div>
							</div>
							<Input className="mono text-center text-xl sm:text-2xl tracking-widest" maxLength={6} placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} />
							<div className="flex gap-2">
								<Button variant="outline" className="flex-1" onClick={() => setStep("review")} disabled={submitting}>Back</Button>
								<Button className="flex-1" onClick={authorize} disabled={submitting}>
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
					<DialogTitle>Transaction submitted</DialogTitle>
					<DialogDescription>Your {asset} transfer is broadcasting to the {chain} network.</DialogDescription>
				</DialogHeader>
				<div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
					<div className="flex items-center justify-between"><span className="text-muted-foreground">Amount</span><Num value={amount + " " + asset} /></div>
					<div className="mt-1 flex items-center justify-between"><span className="text-muted-foreground">Network</span><ChainBadge chain={chain} /></div>
					<div className="mt-1 flex items-center justify-between"><span className="text-muted-foreground">Status</span><span className="text-warning">Broadcasting…</span></div>
				</div>
				<DialogFooter>
					<Button onClick={onClose}>Done</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
