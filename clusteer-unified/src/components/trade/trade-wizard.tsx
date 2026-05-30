"use client";

import { useState } from "react";
import type { QxOrderSide, QxChannel, QxOrder } from "@/lib/types";
import { BuyEntry } from "./buy-entry";
import { SellEntry } from "./sell-entry";
import { OrderOtp } from "./order-otp";
import { BuyHandoff } from "./buy-handoff";
import { SellHandoff } from "./sell-handoff";
import { OrderConfirming } from "./order-confirming";
import { OrderDone } from "./order-done";
import { OrderFailed } from "./order-failed";

type TradeStep = "form" | "otp" | "handoff" | "confirming" | "done" | "failed";

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

export function TradeWizard() {
	const [step, setStep] = useState<TradeStep>("form");
	const [state, setState] = useState<TradeState>(INITIAL);

	const updateState = (patch: Partial<TradeState>) =>
		setState((s) => ({ ...s, ...patch }));

	const reset = () => {
		setState(INITIAL);
		setStep("form");
	};

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

	switch (step) {
		case "form":
			return state.side === "buy" ? (
				<BuyEntry state={state} updateState={updateState} onOrderCreated={handleOrderCreated} onSwitchSide={() => updateState({ side: "sell" })} />
			) : (
				<SellEntry state={state} updateState={updateState} onOrderCreated={handleOrderCreated} onSwitchSide={() => updateState({ side: "buy" })} />
			);
		case "otp":
			return <OrderOtp order={state.order!} onVerified={handleOtpVerified} onBack={() => setStep("form")} />;
		case "handoff":
			return state.side === "buy" ? (
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
}
