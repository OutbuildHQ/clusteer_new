"use client";

import { useState } from "react";
import { Check } from "lucide-react";
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
	const stepIdx = STEP_INDEX[current];

	return (
		<div className="flex items-center gap-0 mb-1">
			{steps.map((s, i) => (
				<div
					key={s}
					className="flex items-center gap-2"
					style={{ flex: i < steps.length - 1 ? 1 : "0 0 auto" }}
				>
					<div className="flex items-center gap-2">
						<div
							className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[11px] font-semibold"
							style={{
								background:
									i < stepIdx
										? "var(--c-lime-500)"
										: i === stepIdx
											? "var(--c-onyx-900)"
											: "var(--c-surface-3)",
								color:
									i < stepIdx
										? "var(--c-onyx-900)"
										: i === stepIdx
											? "var(--c-cream)"
											: "var(--c-text-3)",
							}}
						>
							{i < stepIdx ? <Check size={12} strokeWidth={3} /> : i + 1}
						</div>
						<span
							className="text-[12px] whitespace-nowrap"
							style={{
								fontWeight: i === stepIdx ? 600 : 400,
								color: i <= stepIdx ? "var(--c-text)" : "var(--c-text-3)",
							}}
						>
							{s}
						</span>
					</div>
					{i < steps.length - 1 && (
						<div
							className="flex-1 h-0.5 mx-2"
							style={{
								background:
									i < stepIdx ? "var(--c-lime-500)" : "var(--c-line)",
							}}
						/>
					)}
				</div>
			))}
		</div>
	);
}

export function TradeWizard() {
	const [step, setStep] = useState<TradeStep>("form");
	const [state, setState] = useState<TradeState>(INITIAL);

	const updateState = (patch: Partial<TradeState>) =>
		setState((s) => ({ ...s, ...patch }));

	const reset = () => {
		setState(INITIAL);
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
					<BuyEntry state={state} updateState={updateState} onContinue={handleContinueToReview} onSwitchSide={() => updateState({ side: "sell" })} />
				) : (
					<SellEntry state={state} updateState={updateState} onContinue={handleContinueToReview} onSwitchSide={() => updateState({ side: "buy" })} />
				);
			case "review":
				return <OrderReview state={state} onOrderCreated={handleOrderCreated} onBack={() => setStep("form")} />;
			case "otp":
				return <OrderOtp order={state.order!} onVerified={handleOtpVerified} onBack={() => setStep("review")} />;
			case "handoff":
				return isBuy ? (
					<BuyHandoff order={state.order!} onDone={handleHandoffDone} onCancel={reset} />
				) : (
					<SellHandoff order={state.order!} onDone={handleHandoffDone} onCancel={reset} />
				);
			case "confirming":
				return <OrderConfirming order={state.order!} onConfirmed={handleConfirmed} onFailed={handleFailed} />;
			case "done":
				return <OrderDone order={state.order!} onTradeAgain={reset} />;
			case "failed":
				return <OrderFailed order={state.order!} message={state.errorMessage} onRetry={reset} />;
		}
	};

	return (
		<div className="flex flex-col gap-6 max-w-[520px] mx-auto w-full">
			<h1 className="text-[32px] font-semibold text-ds-text tracking-[-0.03em] m-0 font-display">
				Buy & Sell
			</h1>
			<Stepper current={step} isBuy={isBuy} />
			{step === "form" ? (
				renderStep()
			) : (
				<div className="bg-ds-surface rounded-[14px] border border-ds-line p-6">
					{renderStep()}
				</div>
			)}
		</div>
	);
}
