"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { QR } from "@/components/primitives/qr";
import { CopyButton } from "@/components/primitives/copy-button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUserWallet } from "@/lib/api/wallet/queries";
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

export default function ReceiveIndex() {
	const [asset, setAsset] = useState("USDT");

	// Fetch wallet data
	const { data: walletData, isLoading: walletLoading } = useQuery({
		queryKey: ["wallet"],
		queryFn: getUserWallet,
		retry: false,
	});

	const assets = useMemo(() => walletToAssets(walletData?.walletAssets ?? []), [walletData]);

	const selected = assets.find((a) => a.symbol === asset) ?? {
		symbol: asset,
		name: asset,
		chains: CHAIN_MAP[asset] ?? ["Tron"],
		balance: 0,
		address: "",
	};

	const [chain, setChain] = useState(selected.chains[0]);

	// Use the real deposit address from wallet data, or show placeholder
	const address = useMemo(() => {
		if (selected.address) return selected.address;
		return "No address available — wallet not initialized";
	}, [selected.address]);

	if (walletLoading) {
		return (
			<div className="max-w-xl mx-auto flex items-center justify-center py-24">
				<Loader2 className="size-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="max-w-xl mx-auto space-y-4">
			<div>
				<p className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-[var(--c-text-3)]">&#9670; Deposit</p>
				<h1 className="font-display text-xl sm:text-2xl font-bold tracking-[-0.02em]">Receive</h1>
			</div>
			<Card className="rounded-[16px] border border-[var(--c-line)]">
				<CardHeader className="p-4 sm:p-6 lg:p-8"><CardTitle className="font-display font-bold tracking-[-0.02em] text-base sm:text-lg">Scan or share your deposit address</CardTitle></CardHeader>
				<CardContent className="space-y-4 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div>
							<label className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-[var(--c-text-3)]">Asset</label>
							<Select value={asset} onValueChange={(v) => { setAsset(v); const found = assets.find((a) => a.symbol === v); setChain(found?.chains[0] ?? "Tron"); }}>
								<SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
								<SelectContent>
									{(assets.length > 0 ? assets : [{ symbol: "USDT", name: "Tether" }, { symbol: "USDC", name: "USD Coin" }]).map((a) => (
										<SelectItem key={a.symbol} value={a.symbol}>
											<span className="inline-flex items-center gap-2"><AssetLogo symbol={a.symbol} size="sm" />{a.symbol}</span>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<label className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-[var(--c-text-3)]">Network</label>
							<Select value={chain} onValueChange={(v) => setChain(v as any)}>
								<SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
								<SelectContent>
									{selected.chains.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="flex flex-col items-center gap-4 py-2">
						{selected.address ? (
							<div className="rounded-[14px] border border-[var(--c-line)] p-4 bg-white">
								<QR value={address} size={192} />
							</div>
						) : (
							<div className="flex items-center justify-center w-48 h-48 rounded-[14px] border-2 border-dashed border-custom-black/30 bg-[var(--c-surface-2)]/30 text-xs text-muted-foreground text-center p-4">
								No deposit address available yet. Your wallet may still be initializing.
							</div>
						)}
						<div className="w-full">
							<label className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-[var(--c-text-3)]">Deposit address</label>
							<div className="mt-1 flex items-center gap-2 rounded-[14px] border border-[var(--c-line)] bg-[var(--c-surface-2)] p-3">
								<code className="font-mono flex-1 break-all text-xs tabular-nums">{address}</code>
								{selected.address && <CopyButton value={address} label="Address" />}
							</div>
						</div>
					</div>

					<div className="flex gap-3 rounded-[14px] border-2 border-warning/30 bg-warning-bg p-3 text-warning">
						<AlertTriangle className="size-5 shrink-0 mt-0.5" />
						<div className="text-xs">Only send <strong>{asset}</strong> on <strong>{chain}</strong>. Wrong network = lost funds.</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
