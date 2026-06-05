"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Wallet, ArrowDownUp } from "lucide-react";
import { AssetLogo } from "@/components/primitives/asset-logo";
import { Button } from "@/components/ui/button";
import type { QxOrder, QxChannel } from "@/lib/types";
import type { TradeState } from "./trade-wizard";

const CHANNELS: { id: QxChannel; label: string; net: string }[] = [
	{ id: "TRC20", label: "TRC20", net: "Tron" },
	{ id: "BEP20", label: "BEP20", net: "BNB Chain" },
	{ id: "ERC20", label: "ERC20", net: "Ethereum" },
];
const DEFAULT_FEE_PCT = 0.0075;

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
	const feePct = rateData?.feePercent ? rateData.feePercent / 100 : DEFAULT_FEE_PCT;
	const ngn = parseFloat(ngnAmount) || 0;
	const fee = ngn * feePct;
	const usdt = ngn > 0 ? ngn / (rate * (1 + feePct)) : 0;

	const createOrder = useMutation({
		mutationFn: async () => {
			const res = await fetch("/api/trade", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ side: "buy", amount: ngn, channel: state.channel, destinationAddress: address }),
			});
			const data = await res.json();
			if (!res.ok || !data.status) throw new Error(data.message || "Order creation failed");
			return data.data as QxOrder;
		},
		onSuccess: (order) => { updateState({ amount: ngn, destinationAddress: address }); onOrderCreated(order); },
		onError: (err: Error) => toast.error(err.message),
	});

	const valid = ngn >= 1000 && address.length >= 20;
	const fmt = (n: number) => n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	return (
		<div style={{ background: "var(--c-surface)", borderRadius: 14, border: "1px solid var(--c-line)", padding: 24 }}>
			{/* Buy/Sell segmented control — dark onyx bg, lime active */}
			<div style={{ display: "flex", gap: 2, padding: 3, borderRadius: 10, background: "var(--c-onyx-900)", marginBottom: 18 }}>
				<button style={{ flex: 1, padding: "8px 14px", borderRadius: 7, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer", background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}>
					Buy
				</button>
				<button onClick={onSwitchSide} style={{ flex: 1, padding: "8px 14px", borderRadius: 7, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer", background: "transparent", color: "var(--c-cream)" }}>
					Sell
				</button>
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
				{/* You pay */}
				<div>
					<label style={{ fontSize: 12, color: "var(--c-text-3)" }}>You pay</label>
					<div style={{ display: "flex", alignItems: "center", height: 64, padding: "0 14px", border: "1px solid var(--c-line)", borderRadius: 14, background: "var(--c-surface-2)", marginTop: 4 }}>
						<input
							type="text" inputMode="numeric" placeholder="0" value={ngnAmount}
							onChange={(e) => setNgnAmount(e.target.value.replace(/[^0-9.]/g, ""))}
							style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 28, fontWeight: 600, color: "var(--c-text)", fontVariantNumeric: "tabular-nums", fontFamily: "var(--f-display, Sora, sans-serif)" }}
						/>
						<span style={{ fontSize: 18, fontWeight: 600, color: "var(--c-text-3)", fontFamily: "var(--f-display)" }}>NGN</span>
					</div>
				</div>

				{/* Swap icon */}
				<div style={{ display: "flex", justifyContent: "center" }}>
					<div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--c-onyx-900)", color: "var(--c-cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
						<ArrowDownUp size={16} />
					</div>
				</div>

				{/* You receive */}
				<div>
					<label style={{ fontSize: 12, color: "var(--c-text-3)" }}>You receive</label>
					<div style={{ display: "flex", alignItems: "center", height: 64, padding: "0 14px", border: "1px solid var(--c-line)", borderRadius: 14, background: "var(--c-surface-2)", marginTop: 4 }}>
						<div style={{ flex: 1, fontSize: 28, fontWeight: 600, color: "var(--c-text)", fontVariantNumeric: "tabular-nums", fontFamily: "var(--f-display)" }}>
							{usdt > 0 ? usdt.toFixed(6) : "0"}
						</div>
						<select style={{
							height: 36, padding: "0 10px", borderRadius: 8, border: "1px solid var(--c-line)",
							background: "var(--c-surface)", color: "var(--c-text)", fontWeight: 600, fontSize: 13,
							fontFamily: "var(--f-sans)", cursor: "pointer", outline: "none",
						}}>
							<option>USDT</option>
							<option>USDC</option>
						</select>
					</div>
				</div>

				{/* Network — 3-column grid */}
				<div>
					<label style={{ fontSize: 12, color: "var(--c-text-3)" }}>Network</label>
					<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginTop: 4 }}>
						{CHANNELS.map((ch) => (
							<button
								key={ch.id}
								onClick={() => updateState({ channel: ch.id })}
								style={{
									display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
									padding: "8px 4px", borderRadius: 10, cursor: "pointer",
									border: state.channel === ch.id ? "2px solid var(--c-onyx-900)" : "1px solid var(--c-line)",
									background: state.channel === ch.id ? "var(--c-surface-2)" : "var(--c-surface)",
								}}
							>
								<span style={{ fontWeight: 600, fontSize: 12, color: "var(--c-text)" }}>{ch.label}</span>
								<span style={{ fontSize: 10, color: "var(--c-text-3)" }}>{ch.net}</span>
							</button>
						))}
					</div>
				</div>

				{/* Wallet address */}
				<div>
					<label style={{ fontSize: 12, color: "var(--c-text-3)" }}>Deliver to your wallet</label>
					<input
						type="text" placeholder={`Your USDT address`} value={address}
						onChange={(e) => setAddress(e.target.value)}
						style={{
							width: "100%", height: 38, borderRadius: 10, border: "1px solid var(--c-line)",
							padding: "0 12px", fontSize: 13.5, color: "var(--c-text)", background: "var(--c-surface)",
							fontFamily: "var(--f-mono)", marginTop: 4, outline: "none",
						}}
						onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,245,66,0.45)"; e.currentTarget.style.borderColor = "var(--c-line-strong)"; }}
						onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "var(--c-line)"; }}
					/>
					<div style={{ fontSize: 11, color: "var(--c-text-3)", marginTop: 4 }}>
						Quidax sends the USDT straight here — Clusteer never holds it.
					</div>
				</div>

				{/* Summary */}
				{ngn > 0 && (
					<div style={{ padding: 14, borderRadius: 12, background: "var(--c-surface-2)" }}>
						<div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
							<span style={{ color: "var(--c-text-3)" }}>Rate</span>
							<span style={{ fontVariantNumeric: "tabular-nums", color: "var(--c-text)" }}>1 USDT = ₦{fmt(rate)}</span>
						</div>
						<div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginTop: 6 }}>
							<span style={{ color: "var(--c-text-3)" }}>Service fee ({(feePct * 100).toFixed(2)}%)</span>
							<span style={{ fontVariantNumeric: "tabular-nums", color: "var(--c-text)" }}>₦{fmt(fee)}</span>
						</div>
					</div>
				)}

				{/* CTA */}
				<button
					disabled={!valid || createOrder.isPending}
					onClick={() => createOrder.mutate()}
					style={{
						width: "100%", height: 48, borderRadius: 12, border: "none", cursor: valid ? "pointer" : "not-allowed",
						background: valid ? "var(--c-lime-500)" : "var(--c-surface-3)",
						color: valid ? "var(--c-onyx-900)" : "var(--c-text-3)",
						fontWeight: 600, fontSize: 15, marginTop: 6,
						opacity: createOrder.isPending ? 0.7 : 1,
					}}
				>
					{createOrder.isPending ? "Creating order…" : "Continue → Confirm with OTP"}
				</button>
			</div>
		</div>
	);
}
