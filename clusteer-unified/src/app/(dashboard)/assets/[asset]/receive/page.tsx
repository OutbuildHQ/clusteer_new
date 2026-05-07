"use client";

import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserWallet } from "@/lib/api/wallet/queries";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { QR } from "@/components/primitives/qr";
import { CopyButton } from "@/components/primitives/copy-button";
import { AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";

const CHAIN_MAP: Record<string, string[]> = {
	USDT: ["Tron", "BSC", "Ethereum"],
	USDC: ["Ethereum", "Solana", "Polygon"],
};

export default function ReceivePage({ params }: { params: Promise<{ asset: string }> }) {
	const { asset } = use(params);
	const { data: walletData, isLoading } = useQuery({ queryKey: ["wallet"], queryFn: getUserWallet });

	const wallets = walletData?.walletAssets ?? [];
	const a = wallets.find((w) => w.currency.toLowerCase() === asset.toLowerCase());
	const networks = CHAIN_MAP[asset.toUpperCase()] ?? [];
	const [network, setNetwork] = useState(networks[0] ?? "Tron");
	const address = a?.address ?? "";

	if (isLoading) {
		return (
			<div className="max-w-xl mx-auto py-12 text-center">
				<Loader2 className="size-8 animate-spin mx-auto text-muted-foreground" />
				<p className="mt-3 text-sm text-muted-foreground">Loading wallet...</p>
			</div>
		);
	}

	if (!a) {
		return (
			<div className="max-w-xl mx-auto py-12 text-center">
				<p className="font-medium">Asset not found</p>
				<p className="text-sm text-muted-foreground mt-1">{asset.toUpperCase()} is not in your wallet.</p>
				<Link href="/assets">
					<button
						style={{ height: 36, padding: "0 14px", borderRadius: 10, fontSize: 13.5, fontWeight: 500, border: "1px solid var(--c-line)", background: "transparent", color: "var(--c-text)", cursor: "pointer" }}
						className="mt-4"
					>
						Back to assets
					</button>
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-xl mx-auto">
			<div className="ds-card">
				<div className="ds-card-hd">
					<div className="flex items-center gap-3">
						<AssetLogo symbol={a.currency} size="lg" />
						<div>
							<h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--c-text)" }}>Receive {a.name}</h3>
							<p className="text-sm text-muted-foreground">Scan the QR or copy your address</p>
						</div>
					</div>
				</div>
				<div className="space-y-4 p-4 sm:p-6">
					{networks.length > 0 && (
						<div>
							<label style={{ fontSize: 12, color: "var(--c-text-3)" }} className="uppercase tracking-wide font-medium">Network</label>
							<select
								value={network}
								onChange={(e) => setNetwork(e.target.value)}
								style={{ height: 38, padding: "0 12px", border: "1px solid var(--c-line)", borderRadius: 10, background: "var(--c-surface)", color: "var(--c-text)", fontSize: 13.5, width: "100%", marginTop: 4 }}
							>
								{networks.map((n) => <option key={n} value={n}>{n}</option>)}
							</select>
						</div>
					)}

					<div className="flex flex-col items-center gap-4 py-4">
						{address ? (
							<>
								<QR value={address} size={192} />
								<div className="w-full">
									<label style={{ fontSize: 12, color: "var(--c-text-3)" }} className="uppercase tracking-wide font-medium">Deposit address</label>
									<div className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3">
										<code className="mono flex-1 break-all text-xs">{address}</code>
										<CopyButton value={address} label="Address" />
									</div>
								</div>
							</>
						) : (
							<div className="py-8 text-center">
								<p className="text-sm text-muted-foreground">Wallet address not yet generated. Try trading first to initialize your wallet.</p>
							</div>
						)}
					</div>

					{address && (
						<div className="flex gap-3 rounded-lg border border-warning/30 bg-warning-bg p-3 text-warning">
							<AlertTriangle className="size-5 shrink-0 mt-0.5" />
							<div className="text-xs">
								Only send <strong>{a.currency}</strong> on the <strong>{network}</strong> network to this address.
								Other assets or networks will be lost permanently.
							</div>
						</div>
					)}

					<button
						style={{ height: 36, padding: "0 14px", borderRadius: 10, fontSize: 13.5, fontWeight: 500, border: "1px solid var(--c-line)", background: "transparent", color: "var(--c-text)", cursor: "pointer", width: "100%" }}
					>
						Share address
					</button>
				</div>
			</div>
		</div>
	);
}
