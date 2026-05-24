"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { ASSETS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { QR } from "@/components/primitives/qr";
import { CopyButton } from "@/components/primitives/copy-button";
import { AlertTriangle } from "lucide-react";

const ADDRESSES: Record<string, Record<string, string>> = {
	USDT: { Tron: "TXfM9pA2kL8c6D4wQ3rX5zYH8m2bN9J1fA", BSC: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", Ethereum: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", Solana: "8vEWcqJQhM5xT9vYqZ6Nk4H3dKgP1mNrT7Bv" },
	USDC: { BSC: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", Ethereum: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", Solana: "8vEWcqJQhM5xT9vYqZ6Nk4H3dKgP1mNrT7Bv" },
};

export default function ReceivePage({ params }: { params: Promise<{ asset: string }> }) {
	const { asset } = use(params);
	const a = ASSETS.find((x) => x.symbol.toLowerCase() === asset.toLowerCase());
	if (!a) notFound();
	const networks = a.chains;
	const [network, setNetwork] = useState(networks[0]);
	const address = ADDRESSES[a.symbol]?.[network] ?? "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";

	return (
		<div className="max-w-xl mx-auto">
			<Card>
				<CardHeader>
					<div className="flex items-center gap-3">
						<AssetLogo symbol={a.symbol} size="lg" />
						<div>
							<CardTitle>Receive {a.name}</CardTitle>
							<p className="text-sm text-muted-foreground">Scan the QR or copy your address</p>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Network</label>
						<Select value={network} onValueChange={setNetwork}>
							<SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
							<SelectContent>
								{networks.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col items-center gap-4 py-4">
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
						<div className="text-xs">
							Only send <strong>{a.symbol}</strong> on the <strong>{network}</strong> network to this address.
							Other assets or networks will be lost permanently.
						</div>
					</div>

					<Button variant="outline" className="w-full">Share address</Button>
				</CardContent>
			</Card>
		</div>
	);
}
