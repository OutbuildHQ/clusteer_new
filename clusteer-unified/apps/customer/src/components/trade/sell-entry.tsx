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

export function SellEntry({ state, updateState, onContinue, onSwitchSide }: Props) {
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

	const valid = usdt >= 1 && bankCode && accountNumber.length >= 10;
	const handleContinue = () => {
		updateState({ amount: usdt, bankCode, accountNumber });
		onContinue();
	};
	const selectedBank = banks?.find((b: { bankCode: string; accountNumber: string; bankName: string }) => b.bankCode === bankCode && b.accountNumber === accountNumber);

	return (
		<div className="bg-ds-surface rounded-[14px] border border-ds-line p-6">
			{/* Buy/Sell segmented control — dark onyx bg, lime active */}
			<div className="flex gap-0.5 p-[3px] rounded-[10px] bg-onyx-900 mb-[18px]">
				<button onClick={onSwitchSide} className="flex-1 py-2 px-[14px] rounded-[7px] font-semibold text-[13px] border-none cursor-pointer bg-transparent text-cream">
					Buy
				</button>
				<button className="flex-1 py-2 px-[14px] rounded-[7px] font-semibold text-[13px] border-none cursor-pointer bg-lime-500 text-onyx-900">
					Sell
				</button>
			</div>

			<div className="flex flex-col gap-4">
				{/* You sell */}
				<div>
					<label className="text-[12px] text-ds-text-3">You sell</label>
					<div className="flex items-center h-16 px-[14px] border border-ds-line rounded-[14px] bg-ds-surface-2 mt-1 transition-shadow focus-within:ring-[3px] focus-within:ring-[rgba(201,245,66,0.45)] focus-within:border-lime-500">
						<input
							type="text" inputMode="decimal" placeholder="0" value={usdtAmount}
							onChange={(e) => setUsdtAmount(e.target.value.replace(/[^0-9.]/g, ""))}
							className="flex-1 border-none outline-none bg-transparent text-[28px] font-semibold text-ds-text tabular-nums font-display"
						/>
						<select className="h-9 px-[14px] mr-1 rounded-[10px] border border-ds-line bg-transparent text-ds-text font-medium text-[13.5px] font-sans cursor-pointer outline-none">
							<option>USDT</option>
							<option>USDC</option>
						</select>
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
					<div className="flex items-center h-16 px-[14px] border border-ds-line rounded-[14px] bg-ds-surface-2 mt-1">
						<div className="flex-1 text-[28px] font-semibold text-ds-text tabular-nums font-display">
							{ngnNet > 0 ? `₦${fmt(ngnNet)}` : "0"}
						</div>
						<span className="text-[18px] font-semibold text-ds-text-3 font-display">NGN</span>
					</div>
				</div>

				{/* Network */}
				<div>
					<label className="text-[12px] text-ds-text-3">Network</label>
					<div className="grid grid-cols-3 gap-1.5 mt-1">
						{CHANNELS.map((ch) => (
							<button key={ch.id} onClick={() => updateState({ channel: ch.id })}
								className={`flex flex-col items-center justify-center gap-0.5 h-auto py-2 px-1 rounded-[10px] cursor-pointer font-sans ${
									state.channel === ch.id
										? "border-[1.5px] border-lime-500 bg-[rgba(201,245,66,0.08)]"
										: "border border-ds-line bg-transparent"
								}`}>
								<span className="font-semibold text-[12px] text-ds-text">{ch.label}</span>
								<span className="text-[10px] text-ds-text-3">{ch.net}</span>
							</button>
						))}
					</div>
				</div>

				{/* Pay NGN to */}
				<div>
					<label className="text-[12px] text-ds-text-3">Pay NGN to</label>
					{banks && banks.length > 0 ? (
						<div className="flex justify-between items-center mt-1 py-2.5 px-3 border border-ds-line rounded-xl">
							<span className="font-semibold text-[13px] text-ds-text">
								{selectedBank ? `${selectedBank.bankName} ·· ${selectedBank.accountNumber?.slice(-4)}` : "Select bank"}
							</span>
							<div className="relative">
								<button
									type="button"
									onClick={() => {
										const sel = document.getElementById("bank-select") as HTMLSelectElement;
										sel?.click();
									}}
									className="h-[30px] px-2.5 rounded-[10px] border border-ds-line bg-transparent text-ds-text text-[12.5px] font-medium font-sans cursor-pointer"
								>
									Change
								</button>
								<select
									id="bank-select"
									value={bankCode + "|" + accountNumber}
									onChange={(e) => { const [bc, an] = e.target.value.split("|"); setBankCode(bc); setAccountNumber(an); }}
									className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
								>
									<option value="|">Select</option>
									{banks.map((b: { bankName: string; bankCode: string; accountNumber: string }) => (
										<option key={b.accountNumber} value={b.bankCode + "|" + b.accountNumber}>{b.bankName} · ••{b.accountNumber.slice(-4)}</option>
									))}
								</select>
							</div>
						</div>
					) : (
						<div className="mt-1 py-2.5 px-3 border border-ds-line rounded-xl flex justify-between items-center">
							<span className="text-[13px] text-ds-text-3">No bank linked</span>
							<a href="/settings" className="text-[12px] font-semibold text-onyx-900 dark:text-lime-500 no-underline">Add bank</a>
						</div>
					)}
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
				<button disabled={!valid} onClick={handleContinue}
					className={`w-full h-12 rounded-xl border-none font-semibold text-[15px] mt-1.5 ${
						valid
							? "cursor-pointer bg-lime-500 text-onyx-900"
							: "cursor-not-allowed bg-ds-surface-3 text-ds-text-3 opacity-50 pointer-events-none"
					}`}>
					Continue → Review order
				</button>
			</div>
		</div>
	);
}
