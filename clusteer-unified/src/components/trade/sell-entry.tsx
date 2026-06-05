"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowDownUp } from "lucide-react";
import { AssetLogo } from "@/components/primitives/asset-logo";
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

export function SellEntry({ state, updateState, onOrderCreated, onSwitchSide }: Props) {
	const [usdtAmount, setUsdtAmount] = useState("");
	const [bankCode, setBankCode] = useState(state.bankCode || "");
	const [accountNumber, setAccountNumber] = useState(state.accountNumber || "");

	const { data: rateData } = useQuery({
		queryKey: ["exchange-rate"],
		queryFn: async () => { const r = await fetch("/api/system/exchange-rate?targetCurrency=NGN&amount=1&type=sell"); return r.json(); },
		refetchInterval: 30_000, staleTime: 10_000,
	});

	const { data: banks } = useQuery({
		queryKey: ["banks"],
		queryFn: async () => { const r = await fetch("/api/user/bank-accounts"); const d = await r.json(); return d.data || []; },
	});

	const rate = rateData?.sellRate || rateData?.buyRate || 1614.5;
	const feePct = rateData?.feePercent ? rateData.feePercent / 100 : DEFAULT_FEE_PCT;
	const usdt = parseFloat(usdtAmount) || 0;
	const ngnGross = usdt * rate;
	const fee = ngnGross * feePct;
	const ngnNet = ngnGross - fee;
	const fmt = (n: number) => n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	const createOrder = useMutation({
		mutationFn: async () => {
			const res = await fetch("/api/trade", {
				method: "POST", headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ side: "sell", amount: usdt, channel: state.channel, bankCode, accountNumber }),
			});
			const data = await res.json();
			if (!res.ok || !data.status) throw new Error(data.message || "Order creation failed");
			return data.data as QxOrder;
		},
		onSuccess: (order) => { updateState({ amount: usdt, bankCode, accountNumber }); onOrderCreated(order); },
		onError: (err: Error) => toast.error(err.message),
	});

	const valid = usdt >= 1 && bankCode && accountNumber.length >= 10;
	const selectedBank = banks?.find((b: { bankCode: string; accountNumber: string; bankName: string }) => b.bankCode === bankCode && b.accountNumber === accountNumber);

	return (
		<div style={{ background: "var(--c-surface)", borderRadius: 14, border: "1px solid var(--c-line)", padding: 24 }}>
			{/* Buy/Sell segmented control — dark onyx bg, lime active */}
			<div style={{ display: "flex", gap: 2, padding: 3, borderRadius: 10, background: "var(--c-onyx-900)", marginBottom: 18 }}>
				<button onClick={onSwitchSide} style={{ flex: 1, padding: "8px 14px", borderRadius: 7, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer", background: "transparent", color: "var(--c-cream)" }}>
					Buy
				</button>
				<button style={{ flex: 1, padding: "8px 14px", borderRadius: 7, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer", background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}>
					Sell
				</button>
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
				{/* You sell */}
				<div>
					<label style={{ fontSize: 12, color: "var(--c-text-3)" }}>You sell</label>
					<div style={{ display: "flex", alignItems: "center", height: 64, padding: "0 14px", border: "1px solid var(--c-line)", borderRadius: 14, background: "var(--c-surface-2)", marginTop: 4 }}>
						<input
							type="text" inputMode="decimal" placeholder="0" value={usdtAmount}
							onChange={(e) => setUsdtAmount(e.target.value.replace(/[^0-9.]/g, ""))}
							style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 28, fontWeight: 600, color: "var(--c-text)", fontVariantNumeric: "tabular-nums", fontFamily: "var(--f-display)" }}
						/>
						<select style={{
							height: 36, padding: "0 14px", borderRadius: 10, border: "1px solid var(--c-line)",
							background: "transparent", color: "var(--c-text)", fontWeight: 500, fontSize: 13.5,
							fontFamily: "var(--f-sans)", cursor: "pointer", outline: "none",
						}}>
							<option>USDT</option>
							<option>USDC</option>
						</select>
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
							{ngnNet > 0 ? `₦${fmt(ngnNet)}` : "0"}
						</div>
						<span style={{ fontSize: 18, fontWeight: 600, color: "var(--c-text-3)", fontFamily: "var(--f-display)" }}>NGN</span>
					</div>
				</div>

				{/* Network */}
				<div>
					<label style={{ fontSize: 12, color: "var(--c-text-3)" }}>Network</label>
					<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginTop: 4 }}>
						{CHANNELS.map((ch) => (
							<button key={ch.id} onClick={() => updateState({ channel: ch.id })}
								style={{
									display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
									height: "auto", padding: "8px 4px", borderRadius: 10, cursor: "pointer",
									border: "1px solid var(--c-line)", background: "transparent",
									fontFamily: "var(--f-sans)",
									outline: state.channel === ch.id ? "2px solid var(--c-onyx-900)" : "none",
									outlineOffset: -1,
								}}>
								<span style={{ fontWeight: 600, fontSize: 12, color: "var(--c-text)" }}>{ch.label}</span>
								<span style={{ fontSize: 10, color: "var(--c-text-3)" }}>{ch.net}</span>
							</button>
						))}
					</div>
				</div>

				{/* Pay NGN to */}
				<div>
					<label style={{ fontSize: 12, color: "var(--c-text-3)" }}>Pay NGN to</label>
					{banks && banks.length > 0 ? (
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4, padding: "10px 12px", border: "1px solid var(--c-line)", borderRadius: 12 }}>
							<span style={{ fontWeight: 600, fontSize: 13, color: "var(--c-text)" }}>
								{selectedBank ? `${selectedBank.bankName} ·· ${selectedBank.accountNumber?.slice(-4)}` : "Select bank"}
							</span>
							<select value={bankCode + "|" + accountNumber}
								onChange={(e) => { const [bc, an] = e.target.value.split("|"); setBankCode(bc); setAccountNumber(an); }}
								style={{ height: 30, padding: "0 10px", borderRadius: 10, border: "1px solid var(--c-line)", background: "transparent", color: "var(--c-text)", fontSize: 12.5, fontWeight: 500, fontFamily: "var(--f-sans)", cursor: "pointer", outline: "none" }}>
								<option value="|">Change</option>
								{banks.map((b: { bankName: string; bankCode: string; accountNumber: string }) => (
									<option key={b.accountNumber} value={b.bankCode + "|" + b.accountNumber}>{b.bankName} · ••{b.accountNumber.slice(-4)}</option>
								))}
							</select>
						</div>
					) : (
						<div style={{ marginTop: 4, padding: "10px 12px", border: "1px solid var(--c-line)", borderRadius: 12, display: "flex", justifyContent: "space-between" }}>
							<span style={{ fontSize: 13, color: "var(--c-text-3)" }}>No bank linked</span>
							<a href="/settings" style={{ fontSize: 12, fontWeight: 600, color: "var(--c-lime-500)", textDecoration: "none" }}>Add bank</a>
						</div>
					)}
				</div>

				{/* Rate + fee summary — always visible (design: card card-pad) */}
				<div style={{
					padding: 14, borderRadius: 14, background: "var(--c-surface-2)",
					border: "1px solid var(--c-line)",
				}}>
					<div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
						<span style={{ color: "var(--c-text-2)" }}>Rate</span>
						<span style={{ fontFamily: "var(--f-mono)", fontVariantNumeric: "tabular-nums", color: "var(--c-text)" }}>
							1 USDT = ₦{fmt(rate)}
						</span>
					</div>
					<div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginTop: 6 }}>
						<span style={{ color: "var(--c-text-2)" }}>Service fee ({(feePct * 100).toFixed(2)}%)</span>
						<span style={{ fontFamily: "var(--f-mono)", fontVariantNumeric: "tabular-nums", color: "var(--c-text)" }}>
							₦{fmt(fee)}
						</span>
					</div>
				</div>

				{/* CTA */}
				<button disabled={!valid || createOrder.isPending} onClick={() => createOrder.mutate()}
					style={{
						width: "100%", height: 48, borderRadius: 12, border: "none", cursor: valid ? "pointer" : "not-allowed",
						background: valid ? "var(--c-lime-500)" : "var(--c-surface-3)",
						color: valid ? "var(--c-onyx-900)" : "var(--c-text-3)",
						fontWeight: 600, fontSize: 15, marginTop: 6, opacity: createOrder.isPending ? 0.7 : 1,
					}}>
					{createOrder.isPending ? "Creating order…" : "Continue → Confirm with OTP"}
				</button>
			</div>
		</div>
	);
}
