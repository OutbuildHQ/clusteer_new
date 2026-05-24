"use client";

import { useState, useMemo } from "react";
import { ASSETS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { QR } from "@/components/primitives/qr";
import { CopyButton } from "@/components/primitives/copy-button";
import { AlertTriangle } from "lucide-react";

const MOCK_ADDR = (sym: string, chain: string) => {
	if (chain === "Bitcoin") return "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq";
	if (chain === "Tron") return "TXfM9pA2kL8c6D4wQ3rX5zYH8m2bN9J1fA";
	if (chain === "Solana") return "8vEWcqJQhM5xT9vYqZ6Nk4H3dKgP1mNrT7Bv";
	return "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
};

export default function ReceiveIndex() {
	const [asset, setAsset] = useState("USDT");
	const selected = ASSETS.find((a) => a.symbol === asset)!;
	const [chain, setChain] = useState(selected.chains[0]);
	const address = useMemo(() => MOCK_ADDR(asset, chain), [asset, chain]);
	return (
		<div className="max-w-xl mx-auto space-y-4">
			<h1 className="font-display text-2xl font-bold tracking-tight">Receive</h1>
			<Card>
				<CardHeader><CardTitle>Scan or share your deposit address</CardTitle></CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Asset</label>
							<Select value={asset} onValueChange={(v) => { setAsset(v); setChain(ASSETS.find((a) => a.symbol === v)!.chains[0]); }}>
								<SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
								<SelectContent>
									{ASSETS.map((a) => (
										<SelectItem key={a.symbol} value={a.symbol}>
											<span className="inline-flex items-center gap-2"><AssetLogo symbol={a.symbol} size="sm" />{a.symbol}</span>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Network</label>
							<Select value={chain} onValueChange={setChain}>
								<SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
								<SelectContent>
									{selected.chains.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="flex flex-col items-center gap-4 py-2">
						<QR value={address} size={192} />
						<div className="w-full">
							<label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Deposit address</label>
							<div className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3">
								<code className="mono flex-1 break-all text-xs">{address}</code>
								<CopyButton value={address} label="Address" />
							</div>
						</div>
					</div>

					<div className="flex gap-3 rounded-lg border border-warning/30 bg-warning-bg p-3 text-warning">
						<AlertTriangle className="size-5 shrink-0 mt-0.5" />
						<div className="text-xs">Only send <strong>{asset}</strong> on <strong>{chain}</strong>. Wrong network = lost funds.</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
