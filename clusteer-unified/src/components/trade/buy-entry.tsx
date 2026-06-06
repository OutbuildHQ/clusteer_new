"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownUp } from "lucide-react";
import type { QxChannel } from "@/lib/types";
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
	onContinue: () => void;
	onSwitchSide: () => void;
};

export function BuyEntry({ state, updateState, onContinue, onSwitchSide }: Props) {
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

	const valid = ngn >= 1000 && address.length >= 20;
	const handleContinue = () => {
		updateState({ amount: ngn, destinationAddress: address });
		onContinue();
	};
	const fmt = (n: number) => n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	return (
		<div className="bg-ds-surface rounded-[14px] border border-ds-line p-6">
			{/* Buy/Sell segmented control — dark onyx bg, lime active */}
			<div className="flex gap-0.5 p-[3px] rounded-[10px] bg-onyx-900 mb-[18px]">
				<button className="flex-1 py-2 px-[14px] rounded-[7px] font-semibold text-[13px] border-none cursor-pointer bg-lime-500 text-onyx-900">
					Buy
				</button>
				<button onClick={onSwitchSide} className="flex-1 py-2 px-[14px] rounded-[7px] font-semibold text-[13px] border-none cursor-pointer bg-transparent text-cream">
					Sell
				</button>
			</div>

			<div className="flex flex-col gap-4">
				{/* You pay */}
				<div>
					<label className="text-[12px] text-ds-text-3">You pay</label>
					<div className="flex items-center h-16 px-[14px] border border-ds-line rounded-[14px] bg-ds-surface-2 mt-1 transition-shadow focus-within:ring-[3px] focus-within:ring-[rgba(201,245,66,0.45)] focus-within:border-lime-500">
						<input
							type="text" inputMode="numeric" placeholder="0" value={ngnAmount}
							onChange={(e) => setNgnAmount(e.target.value.replace(/[^0-9.]/g, ""))}
							className="flex-1 border-none outline-none bg-transparent text-[28px] font-semibold text-ds-text tabular-nums font-display"
						/>
						<span className="text-[18px] font-semibold text-ds-text-3 font-display">NGN</span>
					</div>
				</div>

				{/* Swap icon */}
				<div className="flex justify-center">
					<div className="w-9 h-9 rounded-full bg-onyx-900 text-cream flex items-center justify-center">
						<ArrowDownUp size={16} />
					</div>
				</div>

				{/* You receive */}
				<div>
					<label className="text-[12px] text-ds-text-3">You receive</label>
					<div className="flex items-center h-16 px-[14px] border border-ds-line rounded-[14px] bg-ds-surface-2 mt-1 transition-shadow focus-within:ring-[3px] focus-within:ring-[rgba(201,245,66,0.45)] focus-within:border-lime-500">
						<div className="flex-1 text-[28px] font-semibold text-ds-text tabular-nums font-display">
							{usdt > 0 ? usdt.toFixed(6) : "0"}
						</div>
						<select className="h-9 px-[14px] mr-1 rounded-[10px] border border-ds-line bg-transparent text-ds-text font-medium text-[13.5px] font-sans cursor-pointer outline-none">
							<option>USDT</option>
							<option>USDC</option>
						</select>
					</div>
				</div>

				{/* Network — 3-column grid */}
				<div>
					<label className="text-[12px] text-ds-text-3">Network</label>
					<div className="grid grid-cols-3 gap-1.5 mt-1">
						{CHANNELS.map((ch) => (
							<button
								key={ch.id}
								onClick={() => updateState({ channel: ch.id })}
								className={`flex flex-col items-center justify-center gap-0.5 h-auto py-2 px-1 rounded-[10px] cursor-pointer font-sans ${
									state.channel === ch.id
										? "border-[1.5px] border-lime-500 bg-[rgba(201,245,66,0.08)]"
										: "border border-ds-line bg-transparent"
								}`}
							>
								<span className="font-semibold text-[12px] text-ds-text">{ch.label}</span>
								<span className="text-[10px] text-ds-text-3">{ch.net}</span>
							</button>
						))}
					</div>
				</div>

				{/* Wallet address */}
				<div>
					<label className="text-[12px] text-ds-text-3">Deliver to your wallet</label>
					<input
						type="text" placeholder={`Your USDT address`} value={address}
						onChange={(e) => setAddress(e.target.value)}
						className="w-full h-[38px] rounded-[10px] border border-ds-line px-3 text-[13.5px] text-ds-text bg-ds-surface font-mono mt-1 outline-none focus:ring-[3px] focus:ring-[rgba(201,245,66,0.45)] focus:border-[var(--c-line-strong)]"
					/>
					<div className="text-[11px] text-ds-text-3 mt-1">
						Quidax sends the USDT straight here — Clusteer never holds it.
					</div>
				</div>

				{/* Rate + fee summary — always visible (design: card card-pad) */}
				<div className="p-[14px] rounded-[14px] bg-ds-surface-2 border border-ds-line">
					<div className="flex justify-between text-[12.5px]">
						<span className="text-ds-text-2">Rate</span>
						<span className="font-mono tabular-nums text-ds-text">
							1 USDT = ₦{fmt(rate)}
						</span>
					</div>
					<div className="flex justify-between text-[12.5px] mt-1.5">
						<span className="text-ds-text-2">Service fee ({(feePct * 100).toFixed(2)}%)</span>
						<span className="font-mono tabular-nums text-ds-text">
							₦{fmt(fee)}
						</span>
					</div>
				</div>

				{/* CTA */}
				<button
					disabled={!valid}
					onClick={handleContinue}
					className={`w-full h-12 rounded-xl border-none font-semibold text-[15px] mt-1.5 ${
						valid
							? "cursor-pointer bg-lime-500 text-onyx-900"
							: "cursor-not-allowed bg-ds-surface-3 text-ds-text-3 opacity-50 pointer-events-none"
					}`}
				>
					Continue → Review order
				</button>
			</div>
		</div>
	);
}
