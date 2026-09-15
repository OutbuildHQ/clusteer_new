"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuoteSummary } from "@/components/brand/quote-summary";
import type { QxOrder } from "@/lib/types";

export function OrderDone({ order, onTradeAgain }: { order: QxOrder; onTradeAgain: () => void }) {
	return (
		<div className="flex flex-col gap-6">
			<div className="text-center">
				<CheckCircle size={40} className="mx-auto mb-4" style={{ color: "var(--c-up)" }} />
				<h2 className="text-xl font-medium">Your example receipt.</h2>
				<p className="mt-2 text-sm" style={{ color: "var(--c-text-2)" }}>
					Preview complete. No funds were sent, received or credited.
				</p>
			</div>
			<QuoteSummary
				amount={order.amountUsdt}
				rate={order.rate}
				fee={order.fee}
				side={order.side}
				destination={
					order.destination || (order.side === "buy" ? "Example wallet" : "Example bank")
				}
				illustrative
			/>
			<dl className="flex flex-col gap-3 text-sm">
				<div className="flex justify-between gap-4">
					<dt>Preview reference</dt>
					<dd className="break-all text-right">{order.id}</dd>
				</div>
				<div className="flex justify-between gap-4">
					<dt>Network</dt>
					<dd>{order.channel}</dd>
				</div>
			</dl>
			<Button size="lg" className="w-full" onClick={onTradeAgain}>
				Explore another conversion
			</Button>
		</div>
	);
}
