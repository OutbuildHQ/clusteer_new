"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeftRight, Wallet, AlertTriangle } from "lucide-react";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { ChainBadge } from "@/components/primitives/chain-badge";
import { Num } from "@/components/primitives/num";
import { Button } from "@/components/ui/button";
import type { QxOrder, QxChannel } from "@/lib/types";
import type { TradeState } from "./trade-wizard";

const CHANNELS: { id: QxChannel; label: string; chain: string; fee: string; speed: string }[] = [
	{ id: "TRC20", label: "TRC-20", chain: "Tron", fee: "Lowest fee", speed: "~1 min" },
	{ id: "BEP20", label: "BEP-20", chain: "BNB Smart Chain", fee: "Low fee", speed: "~1 min" },
	{ id: "ERC20", label: "ERC-20", chain: "Ethereum", fee: "Higher fee", speed: "~3 min" },
];
const FEE_PCT = 0.005;

type Props = {
	state: TradeState;
	updateState: (patch: Partial<TradeState>) => void;
	onOrderCreated: (order: QxOrder) => void;
	onSwitchSide: () => void;
};

export function BuyEntry({ state, updateState, onOrderCreated, onSwitchSide }: Props) {
	const [ngnAmount, setNgnAmount] = useState("");
	const [address, setAddress] = useState(state.destinationAddress || "");

	const { data: rateData } = useQuery({
		queryKey: ["exchange-rate"],
		queryFn: async () => {
			const r = await fetch("/api/system/exchange-rate?targetCurrency=NGN&amount=1&type=buy");
			return r.json();
		},
		refetchInterval: 30_000,
		staleTime: 10_000,
	});

	const rate = rateData?.buyRate || 1614.5;
	const ngn = parseFloat(ngnAmount) || 0;
	const fee = ngn * FEE_PCT;
	const totalNgn = ngn + fee;
	const usdt = ngn > 0 ? ngn / rate : 0;

	const createOrder = useMutation({
		mutationFn: async () => {
			const res = await fetch("/api/trade", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					side: "buy",
					amount: ngn,
					channel: state.channel,
					destinationAddress: address,
				}),
			});
			const data = await res.json();
			if (!res.ok || !data.status) throw new Error(data.message || "Order creation failed");
			return data.data as QxOrder;
		},
		onSuccess: (order) => {
			updateState({ amount: ngn, destinationAddress: address });
			onOrderCreated(order);
		},
		onError: (err: Error) => toast.error(err.message),
	});

	const valid = ngn >= 1000 && address.length >= 20;
	const ch = CHANNELS.find((c) => c.id === state.channel) || CHANNELS[0];

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
			{/* Buy/Sell toggle */}
			<div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 12, background: "var(--c-surface-2)" }}>
				<button
					onClick={() => {}}
					style={{ flex: 1, padding: "10px 0", borderRadius: 9, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer", background: "var(--c-surface)", color: "var(--c-text)", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
				>
					Buy
				</button>
				<button
					onClick={onSwitchSide}
					style={{ flex: 1, padding: "10px 0", borderRadius: 9, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer", background: "transparent", color: "var(--c-text-2)" }}
				>
					Sell
				</button>
			</div>

			{/* Live rate */}
			<div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "var(--c-surface-2)" }}>
				<AssetLogo symbol="USDT" size="sm" />
				<span style={{ fontSize: 13, fontWeight: 600, color: "var(--c-text-2)" }}>USDT / NGN</span>
				<span style={{ marginLeft: "auto", fontWeight: 700, fontSize: 14, color: "var(--c-text)", fontVariantNumeric: "tabular-nums" }}>
					₦{rate.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
				</span>
				<span style={{ fontSize: 11, fontWeight: 600, color: "var(--c-up)" }}>Live</span>
			</div>

			{/* Amount */}
			<div>
				<label style={{ fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "block" }}>
					You pay (NGN)
				</label>
				<div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 14px", height: 52, borderRadius: 12, border: "1.5px solid var(--c-line)", background: "var(--c-surface)" }}>
					<span style={{ fontSize: 18, fontWeight: 600, color: "var(--c-text-2)" }}>₦</span>
					<input
						type="text"
						inputMode="numeric"
						placeholder="50,000"
						value={ngnAmount}
						onChange={(e) => setNgnAmount(e.target.value.replace(/[^0-9.]/g, ""))}
						style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 18, fontWeight: 600, color: "var(--c-text)", fontVariantNumeric: "tabular-nums" }}
					/>
				</div>
				{ngn > 0 && (
					<div style={{ fontSize: 13, color: "var(--c-text-2)", marginTop: 6 }}>
						≈ <span style={{ fontSize: 13, fontWeight: 600, color: "var(--c-text)", fontVariantNumeric: "tabular-nums" }}>{usdt.toFixed(2)}</span> USDT
					</div>
				)}
			</div>

			{/* Quick amounts */}
			<div style={{ display: "flex", gap: 8 }}>
				{["10000", "50000", "100000", "500000"].map((v) => (
					<button
						key={v}
						onClick={() => setNgnAmount(v)}
						style={{
							flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 600,
							border: ngnAmount === v ? "1.5px solid var(--c-text)" : "1.5px solid var(--c-line)",
							background: ngnAmount === v ? "var(--c-text)" : "var(--c-surface)",
							color: ngnAmount === v ? "var(--c-lime-500)" : "var(--c-text-2)",
							cursor: "pointer",
						}}
					>
						₦{Number(v).toLocaleString()}
					</button>
				))}
			</div>

			{/* Channel picker */}
			<div>
				<label style={{ fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, display: "block" }}>
					Network
				</label>
				<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
					{CHANNELS.map((c) => (
						<button
							key={c.id}
							onClick={() => updateState({ channel: c.id })}
							style={{
								display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12,
								border: state.channel === c.id ? "2px solid var(--c-text)" : "1.5px solid var(--c-line)",
								background: state.channel === c.id ? "var(--c-surface-2)" : "var(--c-surface)",
								cursor: "pointer", textAlign: "left",
							}}
						>
							<ChainBadge chain={c.label} />
							<div style={{ flex: 1 }}>
								<div style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)" }}>{c.chain}</div>
								<div style={{ fontSize: 12, color: "var(--c-text-3)" }}>{c.fee} · {c.speed}</div>
							</div>
							{state.channel === c.id && (
								<div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid var(--c-text)", display: "flex", alignItems: "center", justifyContent: "center" }}>
									<div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--c-lime-500)" }} />
								</div>
							)}
						</button>
					))}
				</div>
			</div>

			{/* Destination address */}
			<div>
				<label style={{ fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "block" }}>
					Your {ch.label} wallet address
				</label>
				<div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 14px", height: 48, borderRadius: 12, border: "1.5px solid var(--c-line)", background: "var(--c-surface)" }}>
					<Wallet size={16} style={{ color: "var(--c-text-3)", flexShrink: 0 }} />
					<input
						type="text"
						placeholder="Paste your wallet address"
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13, color: "var(--c-text)", fontFamily: "var(--font-mono)" }}
					/>
				</div>
				<p style={{ fontSize: 11, color: "var(--c-text-3)", marginTop: 4 }}>
					Quidax sends the USDT straight here — Clusteer never holds it.
				</p>
			</div>

			{/* Summary */}
			{ngn > 0 && (
				<div style={{ padding: 14, borderRadius: 12, background: "var(--c-surface-2)", display: "flex", flexDirection: "column", gap: 8 }}>
					<div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--c-text-2)" }}>
						<span>Rate</span>
						<span style={{ fontWeight: 600, color: "var(--c-text)", fontVariantNumeric: "tabular-nums" }}>₦{rate.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
					</div>
					<div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--c-text-2)" }}>
						<span>Service fee (0.5%)</span>
						<span style={{ fontWeight: 600, color: "var(--c-text)", fontVariantNumeric: "tabular-nums" }}>₦{fee.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
					</div>
					<div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--c-text-2)" }}>
						<span>Network</span>
						<span style={{ fontWeight: 600, color: "var(--c-text)" }}>{ch.label}</span>
					</div>
					<div style={{ borderTop: "1px solid var(--c-line)", paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 14 }}>
						<span style={{ fontWeight: 600, color: "var(--c-text)" }}>Total to pay</span>
						<span style={{ fontWeight: 700, color: "var(--c-text)", fontVariantNumeric: "tabular-nums" }}>₦{totalNgn.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
					</div>
				</div>
			)}

			{/* CTA */}
			<Button
				size="lg"
				className="w-full"
				disabled={!valid || createOrder.isPending}
				onClick={() => createOrder.mutate()}
				style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", fontWeight: 700, fontSize: 15 }}
			>
				{createOrder.isPending ? "Creating order…" : "Continue"}
			</Button>
		</div>
	);
}
