"use client";

import { TradeWizard } from "@/components/trade/trade-wizard";

export default function TradePage() {
	return (
		<div className="w-full max-w-[520px] mx-auto">
			<h1
				className="font-display"
				style={{
					fontSize: 32,
					fontWeight: 600,
					color: "var(--c-text)",
					letterSpacing: "-0.03em",
					marginBottom: 24,
				}}
			>
				Buy &amp; Sell
			</h1>
			<TradeWizard />
		</div>
	);
}
