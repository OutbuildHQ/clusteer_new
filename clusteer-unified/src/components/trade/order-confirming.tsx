"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Bell, Check } from "lucide-react";
import type { QxOrder, QxOrderSide } from "@/lib/types";

const BUY_STAGES = ["Payment received", "Quidax buying USDT", "Sending to your wallet"];
const SELL_STAGES = ["Deposit detected", "Confirming on-chain", "Paying NGN to your bank"];

type Props = {
	order: QxOrder;
	onConfirmed: (order: QxOrder) => void;
	onFailed: (order: QxOrder, message?: string) => void;
};

export function OrderConfirming({ order, onConfirmed, onFailed }: Props) {
	const stages = order.side === "buy" ? BUY_STAGES : SELL_STAGES;
	const [stage, setStage] = useState(0);

	const { data: latest } = useQuery({
		queryKey: ["order-status", order.id],
		queryFn: async () => {
			const res = await fetch(`/api/order?id=${order.id}`);
			const d = await res.json();
			return d.data as QxOrder | undefined;
		},
		refetchInterval: 5000,
	});

	useEffect(() => {
		if (!latest) return;
		if (latest.status === "completed") {
			setStage(stages.length);
			setTimeout(() => onConfirmed(latest), 600);
		} else if (latest.status === "failed" || latest.status === "expired") {
			onFailed(latest, latest.status === "expired" ? "Order expired" : "Order failed");
		}
	}, [latest]);

	useEffect(() => {
		if (stage >= stages.length) return;
		const t = setTimeout(() => setStage((s) => Math.min(s + 1, stages.length - 1)), 1100);
		return () => clearTimeout(t);
	}, [stage, stages.length]);

	const title = order.side === "buy" ? "Confirming payment" : "Confirming deposit";
	const subtitle = order.side === "buy"
		? "We're verifying your bank transfer. Usually takes a minute or two."
		: "We're confirming your crypto deposit on-chain. This may take a few minutes.";

	return (
		<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, paddingTop: 40, paddingBottom: 40 }}>
			{/* Spinner */}
			<div style={{ position: "relative", width: 80, height: 80 }}>
				<Loader2 size={80} style={{ color: "var(--c-lime-500)", animation: "spin 1.2s linear infinite" }} />
			</div>

			{/* Title */}
			<div style={{ textAlign: "center" }}>
				<h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--c-text)", letterSpacing: "-0.03em", margin: 0 }}>{title}</h2>
				<p style={{ fontSize: 13, color: "var(--c-text-2)", marginTop: 8, lineHeight: 1.5, maxWidth: 300 }}>{subtitle}</p>
			</div>

			{/* Stages */}
			<div style={{ display: "flex", flexDirection: "column", gap: 0, width: "100%", maxWidth: 300 }}>
				{stages.map((s, i) => {
					const done = i < stage;
					const active = i === stage;
					return (
						<div key={s} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}>
							<div style={{
								width: 24, height: 24, borderRadius: "50%",
								display: "flex", alignItems: "center", justifyContent: "center",
								background: done ? "var(--c-up)" : active ? "var(--c-lime-500)" : "var(--c-surface-2)",
								border: active ? "2px solid var(--c-text)" : "none",
								transition: "all 0.3s ease",
							}}>
								{done ? <Check size={14} style={{ color: "#fff" }} /> : active ? <Loader2 size={12} style={{ color: "var(--c-text)", animation: "spin 1s linear infinite" }} /> : null}
							</div>
							<span style={{
								fontSize: 13, fontWeight: done || active ? 600 : 400,
								color: done ? "var(--c-up)" : active ? "var(--c-text)" : "var(--c-text-3)",
								transition: "all 0.3s ease",
							}}>
								{s}
							</span>
						</div>
					);
				})}
			</div>

			{/* Dismiss hint */}
			<div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--c-text-3)", marginTop: 16 }}>
				<Bell size={14} />
				<span>You can close this — we&apos;ll notify you</span>
			</div>
		</div>
	);
}
