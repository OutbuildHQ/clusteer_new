"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { QuoteSummary } from "@/components/brand/quote-summary";
import type { QxOrder } from "@/lib/types";
import type { TradeState } from "./trade-wizard";

const DEFAULT_FEE_PCT = 0.0075;

function PreviewTimer({ seconds = 45, onExpire }: { seconds?: number; onExpire: () => void }) {
	const [left, setLeft] = useState(seconds);

	useEffect(() => {
		setLeft(seconds);
	}, [seconds]);

	useEffect(() => {
		if (left <= 0) {
			onExpire();
			return;
		}
		const t = setTimeout(() => setLeft((l) => l - 1), 1000);
		return () => clearTimeout(t);
	}, [left, onExpire]);

	const low = left > 0 && left <= 10;

	return (
		<span
			className={`font-mono tabular-nums text-[12px] font-semibold px-2 py-0.5 rounded-full ${
				left === 0
					? "bg-down-soft text-down"
					: low
						? "bg-warn-soft text-warn"
						: "bg-up-soft text-up"
			}`}
		>
			{left > 0 ? `Preview expires · 0:${String(left).padStart(2, "0")}` : "Preview expired"}
		</span>
	);
}

function makeMockOrder(state: TradeState, rate: number, fee: number): QxOrder {
	const isBuy = state.side === "buy";
	const ngnAmount = isBuy ? state.amount - fee : state.amount * rate;
	const cryptoAmount = isBuy ? ngnAmount / rate : state.amount;
	const orderId = `${isBuy ? "BUY" : "SELL"}-${(7000 + Math.floor(state.amount)) % 9999}`;

	return {
		id: orderId,
		side: state.side,
		asset: "USDT",
		channel: state.channel,
		amountUsdt: cryptoAmount,
		amountNgn: ngnAmount,
		rate,
		fee,
		status: isBuy ? "awaiting_payment" : "awaiting_deposit",
		destination: isBuy ? state.destinationAddress : undefined,
		paymentDetails: isBuy
			? {
					bankName: "Example Bank",
					accountNumber: "DEMO ONLY",
					accountName: "Illustrative account — do not pay",
					reference: orderId,
					amountNgn: ngnAmount + fee,
					expiresAt: new Date(Date.now() + 900_000).toISOString(),
				}
			: undefined,
		depositDetails: !isBuy
			? {
					address:
						state.channel === "TRC20" ? "DEMO-ADDRESS-DO-NOT-SEND" : "DEMO-ADDRESS-DO-NOT-SEND",
					chain: state.channel,
					amountUsdt: cryptoAmount,
					qrValue: `usdt:${state.channel === "TRC20" ? "DEMO-ADDRESS-DO-NOT-SEND" : "DEMO-ADDRESS-DO-NOT-SEND"}?amount=${cryptoAmount.toFixed(2)}`,
					expiresAt: new Date(Date.now() + 1_800_000).toISOString(),
				}
			: undefined,
		createdAt: new Date().toISOString(),
	};
}

type Props = {
	state: TradeState;
	onOrderCreated: (order: QxOrder) => void;
	onBack: () => void;
};

export function OrderReview({ state, onOrderCreated, onBack }: Props) {
	const [expired, setExpired] = useState(false);
	const [lockKey, setLockKey] = useState(0);
	const [submitting, setSubmitting] = useState(false);
	const isBuy = state.side === "buy";

	const { data: rateData } = useQuery({
		queryKey: ["exchange-rate", state.side],
		queryFn: async () => {
			const r = await fetch(
				`/api/system/exchange-rate?targetCurrency=NGN&amount=1&type=${state.side}`
			);
			return r.json();
		},
		refetchInterval: 30_000,
		staleTime: 10_000,
	});

	const rate = isBuy
		? rateData?.buyRate || 1614.5
		: rateData?.sellRate || rateData?.buyRate || 1614.5;
	const feePct = rateData?.feePercent != null ? rateData.feePercent / 100 : DEFAULT_FEE_PCT;

	const amount = state.amount || 0;
	const ngnAmount = isBuy ? amount / (1 + feePct) : amount * rate;
	const cryptoAmount = isBuy ? ngnAmount / rate : amount;
	const fee = isBuy ? amount - ngnAmount : ngnAmount * feePct;
	const buyTotal = ngnAmount + fee;
	const sellPayout = ngnAmount - fee;

	const fmt = (n: number) =>
		n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	const handleConfirm = useCallback(() => {
		setSubmitting(true);
		// Demo: simulate order creation with a short delay
		setTimeout(() => {
			const mockOrder = makeMockOrder(state, rate, fee);
			onOrderCreated(mockOrder);
		}, 600);
	}, [state, rate, fee, onOrderCreated]);

	const refreshQuote = () => {
		setExpired(false);
		setLockKey((k) => k + 1);
	};

	const summaryRows = [
		["Type", `${isBuy ? "Buy" : "Sell"} USDT`],
		["Network", state.channel],
		["Rate", `1 USDT = ₦${fmt(rate)}`],
		[
			isBuy ? "Deliver to" : "Payout to",
			isBuy ? state.destinationAddress || "Your wallet" : "Bank account",
		],
		[`Service fee (${(feePct * 100).toFixed(2)}%)`, `₦${fmt(fee)}`],
		["Settlement", "Quidax"],
	];

	return (
		<div className="flex flex-col gap-4">
			{/* Badge + Rate lock */}
			<div className="flex items-center justify-between">
				<span
					className={`inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium capitalize ${
						isBuy ? "bg-up-soft text-up" : "bg-down-soft text-down"
					}`}
				>
					{isBuy ? "Buy" : "Sell"} USDT
				</span>
				<PreviewTimer key={lockKey} seconds={45} onExpire={() => setExpired(true)} />
			</div>

			<QuoteSummary
				amount={cryptoAmount}
				rate={rate}
				fee={fee}
				side={state.side}
				destination={isBuy ? state.destinationAddress || "Your wallet" : "Your selected bank"}
				illustrative
			/>
			<div className="cl-details">
				<div>
					<span>Selected network</span>
					<strong>{state.channel}</strong>
				</div>
			</div>

			{/* Rate warning */}
			{expired ? (
				<div className="rounded-[14px] bg-down-soft px-[14px] py-[10px]">
					<p className="text-[12.5px] text-ds-text m-0">
						The preview expired. Refresh to restart the demonstration.
					</p>
				</div>
			) : (
				<div className="rounded-[14px] bg-warn-soft px-[14px] py-[10px]">
					<p className="text-[12.5px] text-ds-text m-0">
						This is an illustrative quote. Continue to explore verification and transfer
						instructions. No real order is created.
					</p>
				</div>
			)}

			{/* Actions */}
			<div className="flex gap-3">
				<button
					onClick={onBack}
					className="flex-1 h-[46px] rounded-xl border border-ds-line bg-transparent text-ds-text font-semibold text-[14px] cursor-pointer"
				>
					Back
				</button>
				{expired ? (
					<button
						onClick={refreshQuote}
						className="flex-[2] h-[46px] rounded-xl border-none bg-onyx-900 text-cream font-semibold text-[14px] cursor-pointer flex items-center justify-center gap-2"
					>
						<RefreshCw size={16} /> Refresh quote
					</button>
				) : (
					<button
						disabled={submitting}
						onClick={handleConfirm}
						className={`flex-[2] h-[46px] rounded-xl border-none bg-lime-500 text-onyx-900 font-semibold text-[14px] cursor-pointer ${
							submitting ? "opacity-70" : "opacity-100"
						}`}
					>
						{submitting ? "Creating order…" : "Continue → Confirm with OTP"}
					</button>
				)}
			</div>
		</div>
	);
}
