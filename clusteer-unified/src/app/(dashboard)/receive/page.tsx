"use client";

import { useState, useMemo } from "react";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { QR } from "@/components/primitives/qr";
import { CopyButton } from "@/components/primitives/copy-button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUserWallet } from "@/lib/api/wallet/queries";
import type { Wallet } from "@/store/wallet";

/* ── asset/chain catalogue ── */
const ASSET_NETWORKS: Record<string, string[]> = {
	USDT: ["Tron", "BSC", "Ethereum", "Solana"],
	USDC: ["BSC", "Ethereum", "Solana"],
	NGN: ["NIBSS"],
};

const RECEIVE_ASSETS = ["USDT", "USDC", "NGN"] as const;

/** Derive a placeholder address per chain when wallet data is unavailable */
function placeholderAddr(chain: string) {
	if (chain === "Tron") return "TQrZ8xY9k2PpVm5Lq6Wc3FjN1Hm4Bg7Aa";
	if (chain === "Solana") return "7xKXy2pPq8mLnVcRfTbKjW3sN1Hm4Bg7Aa9KdEsXrYz";
	if (chain === "NIBSS") return "NGN Bank Transfer — no on-chain address";
	return "0x742d35Cc6634C0532925a3b8D8c4f5e88aB12345"; // BSC / Ethereum (EVM)
}

function walletAddress(wallets: Wallet[], symbol: string): string {
	const w = wallets.find((w) => w.currency === symbol);
	return w?.address ?? "";
}

export default function ReceivePage() {
	const [asset, setAsset] = useState<string>("USDT");
	const [network, setNetwork] = useState<string>("Tron");

	const networks = ASSET_NETWORKS[asset] ?? ["Tron"];

	/* wallet query — real address when available */
	const { data: walletData, isLoading } = useQuery({
		queryKey: ["wallet"],
		queryFn: getUserWallet,
		retry: false,
	});

	// Reset network to first valid option when asset changes
	useMemo(() => {
		if (!networks.includes(network)) setNetwork(networks[0]);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [asset]);

	const address = useMemo(() => {
		if (asset === "NGN") return "Use the bank account listed in your profile";
		const real = walletAddress(walletData?.walletAssets ?? [], asset);
		return real || placeholderAddr(network);
	}, [walletData, asset, network]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-24" style={{ maxWidth: 560, margin: "0 auto" }}>
				<Loader2 className="size-6 animate-spin" style={{ color: "var(--c-text-3)" }} />
			</div>
		);
	}

	return (
		<div className="w-full max-w-[560px] mx-auto flex flex-col gap-5 lg:gap-6 px-4 lg:px-0">
			{/* Title */}
			<h1 className="text-[22px] lg:text-[32px]" style={{ fontWeight: 600, letterSpacing: "-0.03em", color: "var(--c-text)" }}>Receive</h1>

			{/* Main card */}
			<div className="ds-card p-4 lg:p-5">
				<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
					{/* Asset selector */}
					<div>
						<label style={{ fontSize: 12, color: "var(--c-text-3)" }}>Asset</label>
						<div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
							{RECEIVE_ASSETS.map((sym) => (
								<button
									key={sym}
									onClick={() => setAsset(sym)}
									style={{
										display: "inline-flex",
										alignItems: "center",
										gap: 6,
										padding: "6px 14px",
										borderRadius: 10,
										fontSize: 13,
										fontWeight: 500,
										border: "1px solid var(--c-line)",
										cursor: "pointer",
										transition: "all 150ms ease",
										background: asset === sym ? "var(--c-onyx-900)" : "transparent",
										color: asset === sym ? "var(--c-cream)" : "var(--c-text)",
										borderColor: asset === sym ? "var(--c-onyx-900)" : "var(--c-line)",
									}}
								>
									<AssetLogo symbol={sym} size="sm" />
									{sym}
								</button>
							))}
						</div>
					</div>

					{/* Network selector — only for USDT/USDC */}
					{networks.length > 1 && (
						<div>
							<label style={{ fontSize: 12, color: "var(--c-text-3)" }}>Network</label>
							<div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
								{networks.map((n) => (
									<button
										key={n}
										onClick={() => setNetwork(n)}
										style={{
											display: "inline-flex",
											alignItems: "center",
											gap: 6,
											padding: "5px 12px",
											borderRadius: 8,
											fontSize: 12.5,
											fontWeight: 500,
											border: "1px solid var(--c-line)",
											cursor: "pointer",
											transition: "all 150ms ease",
											background: network === n ? "var(--c-surface-2)" : "transparent",
											color: network === n ? "var(--c-text)" : "var(--c-text-3)",
											borderColor: network === n ? "var(--c-onyx-900)" : "var(--c-line)",
										}}
									>
										{n}
									</button>
								))}
							</div>
						</div>
					)}

					{/* QR code — crypto only */}
					{asset !== "NGN" && (
					<div style={{ textAlign: "center", padding: "18px 0" }}>
						<div
							className="w-[180px] h-[180px] lg:w-[220px] lg:h-[220px]"
							style={{
								margin: "0 auto",
								background: "var(--c-cream)",
								borderRadius: 16,
								padding: 14,
								boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<QR value={address} size={148} />
						</div>
					</div>
					)}

					{/* Address card */}
					<div
						style={{
							background: "var(--c-surface-2)",
							borderRadius: 12,
							padding: 14,
						}}
					>
						<div
							style={{
								fontSize: 11,
								textTransform: "uppercase",
								letterSpacing: "0.06em",
								color: "var(--c-text-3)",
							}}
						>
							Your {asset} address ({network})
						</div>
						<div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
							<div
								className="tabular-nums"
								style={{
									flex: 1,
									fontFamily: "var(--font-mono, monospace)",
									fontSize: 13,
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
									color: "var(--c-text)",
								}}
							>
								{address}
							</div>
							<CopyButton value={address} label="Address" />
						</div>
					</div>

					{/* Warning card */}
					<div
						style={{
							background: "var(--c-warn-soft)",
							border: "1px solid var(--c-warn)",
							borderRadius: 12,
							padding: 14,
							fontSize: 12.5,
							color: "var(--c-warn)",
						}}
					>
						<b>Send only {asset} on the {network} network.</b>
						<br />
						Sending other assets may result in permanent loss.
					</div>
				</div>
			</div>
		</div>
	);
}
