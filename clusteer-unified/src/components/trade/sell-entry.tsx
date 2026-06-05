"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Building2 } from "lucide-react";
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
const DEFAULT_FEE_PCT = 0.005;

type Props = {
	state: TradeState;
	updateState: (patch: Partial<TradeState>) => void;
	onOrderCreated: (order: QxOrder) => void;
	onSwitchSide: () => void;
};

export function SellEntry({ state, updateState, onOrderCreated, onSwitchSide }: Props) {
	const [usdtAmount, setUsdtAmount] = useState("");
	const [bankCode, setBankCode] = useState(state.bankCode || "");
	const [accountNumber, setAccountNumber] = useState(state.accountNumber || "");

	const { data: rateData } = useQuery({
		queryKey: ["exchange-rate"],
		queryFn: async () => {
			const r = await fetch("/api/system/exchange-rate?targetCurrency=NGN&amount=1&type=sell");
			return r.json();
		},
		refetchInterval: 30_000,
		staleTime: 10_000,
	});

	const { data: banks } = useQuery({
		queryKey: ["banks"],
		queryFn: async () => {
			const r = await fetch("/api/user/bank-accounts");
			const d = await r.json();
			return d.data || [];
		},
	});

	const rate = rateData?.sellRate || rateData?.buyRate || 1614.5;
	const usdt = parseFloat(usdtAmount) || 0;
	const ngnGross = usdt * rate;
	const feePct = rateData?.feePercent ? rateData.feePercent / 100 : DEFAULT_FEE_PCT;
	const fee = ngnGross * feePct;
	const ngnNet = ngnGross - fee;

	const createOrder = useMutation({
		mutationFn: async () => {
			const res = await fetch("/api/trade", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					side: "sell",
					amount: usdt,
					channel: state.channel,
					bankCode,
					accountNumber,
				}),
			});
			const data = await res.json();
			if (!res.ok || !data.status) throw new Error(data.message || "Order creation failed");
			return data.data as QxOrder;
		},
		onSuccess: (order) => {
			updateState({ amount: usdt, bankCode, accountNumber });
			onOrderCreated(order);
		},
		onError: (err: Error) => toast.error(err.message),
	});

	const valid = usdt >= 1 && bankCode && accountNumber.length >= 10;
	const ch = CHANNELS.find((c) => c.id === state.channel) || CHANNELS[0];

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
			{/* Buy/Sell toggle */}
			<div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 12, background: "var(--c-surface-2)" }}>
				<button
					onClick={onSwitchSide}
					style={{ flex: 1, padding: "10px 0", borderRadius: 9, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer", background: "transparent", color: "var(--c-text-2)" }}
				>
					Buy
				</button>
				<button
					onClick={() => {}}
					style={{ flex: 1, padding: "10px 0", borderRadius: 9, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer", background: "var(--c-surface)", color: "var(--c-text)", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
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

			{/* USDT amount */}
			<div>
				<label style={{ fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "block" }}>
					You sell (USDT)
				</label>
				<div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 14px", height: 52, borderRadius: 12, border: "1.5px solid var(--c-line)", background: "var(--c-surface)" }}>
					<AssetLogo symbol="USDT" size="sm" />
					<input
						type="text"
						inputMode="decimal"
						placeholder="100"
						value={usdtAmount}
						onChange={(e) => setUsdtAmount(e.target.value.replace(/[^0-9.]/g, ""))}
						style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 18, fontWeight: 600, color: "var(--c-text)", fontVariantNumeric: "tabular-nums" }}
					/>
				</div>
				{usdt > 0 && (
					<div style={{ fontSize: 13, color: "var(--c-text-2)", marginTop: 6 }}>
						You receive ≈ <span style={{ fontSize: 13, fontWeight: 600, color: "var(--c-text)", fontVariantNumeric: "tabular-nums" }}>₦{ngnNet.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
					</div>
				)}
			</div>

			{/* Channel picker */}
			<div>
				<label style={{ fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, display: "block" }}>
					Send USDT via
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

			{/* Bank account */}
			<div>
				<label style={{ fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "block" }}>
					Payout bank account
				</label>
				{banks && banks.length > 0 ? (
					<select
						value={bankCode + "|" + accountNumber}
						onChange={(e) => {
							const [bc, an] = e.target.value.split("|");
							setBankCode(bc);
							setAccountNumber(an);
						}}
						style={{ width: "100%", height: 48, borderRadius: 12, border: "1.5px solid var(--c-line)", background: "var(--c-surface)", padding: "0 14px", fontSize: 14, color: "var(--c-text)", cursor: "pointer" }}
					>
						<option value="|">Select bank account</option>
						{banks.map((b: { bankName: string; bankCode: string; accountNumber: string; accountName: string }) => (
							<option key={b.accountNumber} value={b.bankCode + "|" + b.accountNumber}>
								{b.bankName} · ••{b.accountNumber.slice(-4)} · {b.accountName}
							</option>
						))}
					</select>
				) : (
					<div style={{ padding: 14, borderRadius: 12, border: "1.5px dashed var(--c-line)", textAlign: "center" }}>
						<Building2 size={20} style={{ color: "var(--c-text-3)", margin: "0 auto 6px" }} />
						<p style={{ fontSize: 13, color: "var(--c-text-2)" }}>No bank accounts linked</p>
						<a href="/settings/payment-methods" style={{ fontSize: 13, fontWeight: 600, color: "var(--c-lime-500)" }}>Add a bank account →</a>
					</div>
				)}
			</div>

			{/* Summary */}
			{usdt > 0 && (
				<div style={{ padding: 14, borderRadius: 12, background: "var(--c-surface-2)", display: "flex", flexDirection: "column", gap: 8 }}>
					<div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--c-text-2)" }}>
						<span>Rate</span>
						<span style={{ fontWeight: 600, color: "var(--c-text)", fontVariantNumeric: "tabular-nums" }}>₦{rate.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
					</div>
					<div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--c-text-2)" }}>
						<span>Service fee ({(feePct * 100).toFixed(1)}%)</span>
						<span style={{ fontWeight: 600, color: "var(--c-text)", fontVariantNumeric: "tabular-nums" }}>₦{fee.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
					</div>
					<div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--c-text-2)" }}>
						<span>Network</span>
						<span style={{ fontWeight: 600, color: "var(--c-text)" }}>{ch.label}</span>
					</div>
					<div style={{ borderTop: "1px solid var(--c-line)", paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 14 }}>
						<span style={{ fontWeight: 600, color: "var(--c-text)" }}>You receive</span>
						<span style={{ fontWeight: 700, color: "var(--c-up)", fontVariantNumeric: "tabular-nums" }}>₦{ngnNet.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
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
