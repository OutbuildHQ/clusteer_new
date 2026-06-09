"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import type { QxOrder } from "@/lib/types";
import type { TradeState } from "./trade-wizard";

const DEFAULT_FEE_PCT = 0.0075;

function RateLock({ seconds = 45, onExpire }: { seconds?: number; onExpire: () => void }) {
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
			{left > 0 ? `Rate locked · 0:${String(left).padStart(2, "0")}` : "Rate expired"}
		</span>
	);
}

function makeMockOrder(state: TradeState, rate: number, fee: number): QxOrder {
	const isBuy = state.side === "buy";
	const ngnAmount = isBuy ? state.amount : state.amount * rate;
	const cryptoAmount = isBuy ? state.amount / rate : state.amount;
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
					bankName: "Providus Bank",
					accountNumber: "9901234567",
					accountName: "Quidax / Clusteer",
					reference: orderId,
					amountNgn: ngnAmount + fee,
					expiresAt: new Date(Date.now() + 900_000).toISOString(),
				}
			: undefined,
		depositDetails: !isBuy
			? {
					address: state.channel === "TRC20" ? "TYz8Mh3pqgDdQc5QqVzHmgK4kQ4LQX8kQ4" : "0x7Ac9F4e1b2C8d3A5e6F70891aB2cD3e4F5061a2b",
					chain: state.channel,
					amountUsdt: cryptoAmount,
					qrValue: `usdt:${state.channel === "TRC20" ? "TYz8Mh3pqgDdQc5QqVzHmgK4kQ4LQX8kQ4" : "0x7Ac9F4e1b2C8d3A5e6F70891aB2cD3e4F5061a2b"}?amount=${cryptoAmount.toFixed(2)}`,
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
		queryKey: ["exchange-rate"],
		queryFn: async () => {
			const r = await fetch(`/api/system/exchange-rate?targetCurrency=NGN&amount=1&type=${state.side}`);
			return r.json();
		},
		refetchInterval: 30_000,
		staleTime: 10_000,
	});

	const rate = isBuy
		? rateData?.buyRate || 1614.5
		: rateData?.sellRate || rateData?.buyRate || 1614.5;
	const feePct = rateData?.feePercent ? rateData.feePercent / 100 : DEFAULT_FEE_PCT;

	const amount = state.amount || 0;
	const ngnAmount = isBuy ? amount : amount * rate;
	const cryptoAmount = isBuy ? amount / rate : amount;
	const fee = ngnAmount * feePct;
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
		[isBuy ? "Deliver to" : "Payout to", isBuy ? (state.destinationAddress || "Your wallet") : "Bank account"],
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
				<RateLock key={lockKey} seconds={45} onExpire={() => setExpired(true)} />
			</div>

			{/* Big amount display */}
			<div className="text-center py-1">
				<div className="font-display font-semibold text-[34px] tabular-nums text-ds-text tracking-[-0.03em]">
					{isBuy
						? `${cryptoAmount.toFixed(4)} USDT`
						: `₦${fmt(sellPayout)}`}
				</div>
				<div className="text-ds-text-2 font-mono tabular-nums text-[13px] mt-0.5">
					{isBuy
						? `for ₦${fmt(buyTotal)}`
						: `for ${cryptoAmount.toFixed(4)} USDT`}
				</div>
			</div>

			{/* Summary card */}
			<div className="rounded-[14px] bg-ds-surface-2 px-[14px] py-1">
				{summaryRows.map(([k, v]) => (
					<div
						key={k}
						className="flex justify-between items-center text-[13px] py-[9px] border-b border-ds-line"
					>
						<span className="text-ds-text-2">{k}</span>
						<span className="font-mono tabular-nums font-semibold text-ds-text max-w-[240px] text-right overflow-hidden text-ellipsis">
							{v}
						</span>
					</div>
				))}
				<div className="flex justify-between items-center text-[14px] py-[11px]">
					<span className="font-semibold text-ds-text">
						{isBuy ? "Total to pay" : "Total to receive"}
					</span>
					<span className="font-mono tabular-nums font-bold text-ds-text">
						{isBuy ? `₦${fmt(buyTotal)}` : `₦${fmt(sellPayout)}`}
					</span>
				</div>
			</div>

			{/* Rate warning */}
			{expired ? (
				<div className="rounded-[14px] bg-down-soft px-[14px] py-[10px]">
					<p className="text-[12.5px] text-ds-text m-0">
						The locked rate expired. Refresh to get Quidax&apos;s latest quote before you continue.
					</p>
				</div>
			) : (
				<div className="rounded-[14px] bg-warn-soft px-[14px] py-[10px]">
					<p className="text-[12.5px] text-ds-text m-0">
						This quote is rate-locked. You&apos;ll confirm with a one-time code, then complete the{" "}
						{isBuy ? "payment" : "transfer"} with Quidax.
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
