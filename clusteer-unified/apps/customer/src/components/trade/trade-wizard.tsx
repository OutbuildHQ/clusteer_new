"use client";

import { useEffect, useState } from "react";
import { Info, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { SettlementProgress } from "@/components/brand/quote-summary";
import type { QxOrderSide, QxChannel, QxOrder } from "@/lib/types";
import { BuyEntry } from "./buy-entry";
import { SellEntry } from "./sell-entry";
import { OrderReview } from "./order-review";
import { OrderOtp } from "./order-otp";
import { BuyHandoff } from "./buy-handoff";
import { SellHandoff } from "./sell-handoff";
import { OrderConfirming } from "./order-confirming";
import { OrderDone } from "./order-done";
import { OrderFailed } from "./order-failed";

type TradeStep = "form" | "review" | "otp" | "handoff" | "confirming" | "done" | "failed";

export type TradeState = {
	side: QxOrderSide;
	amount: number;
	channel: QxChannel;
	destinationAddress?: string;
	bankCode?: string;
	accountNumber?: string;
	order?: QxOrder;
	errorMessage?: string;
};

const INITIAL: TradeState = {
	side: "buy",
	amount: 0,
	channel: "TRC20",
};

const STEP_INDEX: Record<TradeStep, number> = {
	form: 0,
	review: 1,
	otp: 2,
	handoff: 3,
	confirming: 3,
	done: 4,
	failed: 3,
};

function Stepper({ current, isBuy }: { current: TradeStep; isBuy: boolean }) {
	const steps = ["Details", "Review", "Verify", isBuy ? "Pay" : "Send", "Done"];
	return (
		<SettlementProgress
			current={current === "done" ? steps.length : STEP_INDEX[current]}
			labels={steps}
		/>
	);
}

export function TradeWizard({ initialSide = "buy" }: { initialSide?: QxOrderSide }) {
	const [step, setStep] = useState<TradeStep>("form");
	const [state, setState] = useState<TradeState>({ ...INITIAL, side: initialSide });
	useEffect(() => {
		if (new URLSearchParams(window.location.search).get("side") === "sell")
			setState((s) => ({ ...s, side: "sell" }));
	}, []);

	const updateState = (patch: Partial<TradeState>) => setState((s) => ({ ...s, ...patch }));

	const reset = () => {
		setState({ ...INITIAL, side: state.side });
		setStep("form");
	};

	const handleContinueToReview = () => setStep("review");

	const handleOrderCreated = (order: QxOrder) => {
		updateState({ order });
		setStep("otp");
	};

	const handleOtpVerified = (order: QxOrder) => {
		updateState({ order });
		setStep("handoff");
	};

	const handleHandoffDone = () => setStep("confirming");

	const handleConfirmed = (order: QxOrder) => {
		updateState({ order });
		setStep("done");
	};

	const handleFailed = (order: QxOrder, errorMessage?: string) => {
		updateState({ order, errorMessage });
		setStep("failed");
	};

	const isBuy = state.side === "buy";

	const renderStep = () => {
		switch (step) {
			case "form":
				return isBuy ? (
					<BuyEntry
						state={state}
						updateState={updateState}
						onContinue={handleContinueToReview}
						onSwitchSide={() => updateState({ side: "sell", amount: 0 })}
					/>
				) : (
					<SellEntry
						state={state}
						updateState={updateState}
						onContinue={handleContinueToReview}
						onSwitchSide={() => updateState({ side: "buy", amount: 0 })}
					/>
				);
			case "review":
				return (
					<OrderReview
						state={state}
						onOrderCreated={handleOrderCreated}
						onBack={() => setStep("form")}
					/>
				);
			case "otp":
				return (
					<OrderOtp
						order={state.order!}
						onVerified={handleOtpVerified}
						onBack={() => setStep("review")}
					/>
				);
			case "handoff":
				return isBuy ? (
					<BuyHandoff order={state.order!} onDone={handleHandoffDone} onCancel={reset} />
				) : (
					<SellHandoff order={state.order!} onDone={handleHandoffDone} onCancel={reset} />
				);
			case "confirming":
				return (
					<OrderConfirming
						order={state.order!}
						onConfirmed={handleConfirmed}
						onFailed={handleFailed}
					/>
				);
			case "done":
				return <OrderDone order={state.order!} onTradeAgain={reset} />;
			case "failed":
				return <OrderFailed order={state.order!} message={state.errorMessage} onRetry={reset} />;
		}
	};

	return (
		<div className="cl-workspace">
			<div className="cl-page-heading">
				<div>
					<h1>Make your next move.</h1>
					<p>One clear journey, from your quote to your receipt.</p>
				</div>
			</div>
			<div className="cl-preview-notice">
				<Info size={16} />
				<span>
					Interactive preview. This flow simulates an order; no payment is submitted and no funds
					are moved. Do not send money to preview details.
				</span>
			</div>
			<div className="cl-trade-layout">
				<div className="cl-trade-form flex flex-col gap-6">
					<h2 className="text-[22px] font-medium text-ds-text tracking-[-0.03em] m-0 font-display">
						Buy or sell stablecoins
					</h2>
					<Stepper current={step} isBuy={isBuy} />
					{step === "form" ? (
						renderStep()
					) : (
						<div className="bg-ds-surface rounded-[14px] border border-ds-line p-6">
							{renderStep()}
						</div>
					)}
				</div>
				<aside className="cl-trade-aside">
					<h2>Clarity at every step.</h2>
					<p>
						Review the amount, network and destination together. Your summary keeps the details
						close throughout the journey.
					</p>
					<SettlementProgress
						labels={
							isBuy
								? ["Quote reviewed", "Payment received", "Wallet delivery confirmed"]
								: ["Quote reviewed", "Transfer received", "Bank payout confirmed"]
						}
						current={step === "form" || step === "review" ? 0 : step === "done" ? 3 : 1}
					/>
					<Link href="/support" className="cl-text-link">
						Get help with an order <ArrowUpRight size={15} />
					</Link>
					<p>
						Always use the network shown in your order. Transfers on a different network may not be
						recoverable.
					</p>
				</aside>
			</div>
		</div>
	);
}
