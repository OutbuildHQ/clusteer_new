"use client";

import { useState, useEffect } from "react";
import { Copy, Check, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QxOrder } from "@/lib/types";

type Props = {
	order: QxOrder;
	onDone: () => void;
	onCancel: () => void;
};

function CopyField({ label, value, emphasize }: { label: string; value: string; emphasize?: boolean }) {
	const [copied, setCopied] = useState(false);
	const copy = () => {
		navigator.clipboard.writeText(value);
		setCopied(true);
		setTimeout(() => setCopied(false), 1400);
	};
	return (
		<div
			onClick={copy}
			style={{
				padding: "12px 14px",
				borderRadius: 10,
				border: emphasize ? "2px solid var(--c-text)" : "1px solid var(--c-line)",
				background: "var(--c-surface)",
				cursor: "pointer",
				display: "flex",
				flexDirection: "column",
				gap: 2,
			}}
		>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<span style={{ fontSize: 10, fontWeight: 700, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
				{copied ? <Check size={14} style={{ color: "var(--c-up)" }} /> : <Copy size={14} style={{ color: "var(--c-text-3)" }} />}
			</div>
			<span style={{ fontSize: emphasize ? 16 : 14, fontWeight: emphasize ? 700 : 600, color: "var(--c-text)", fontVariantNumeric: "tabular-nums" }}>{value}</span>
		</div>
	);
}

function ExpiryBar({ expiresAt }: { expiresAt: string }) {
	const [remaining, setRemaining] = useState(0);

	useEffect(() => {
		const update = () => {
			const diff = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
			setRemaining(diff);
		};
		update();
		const id = setInterval(update, 1000);
		return () => clearInterval(id);
	}, [expiresAt]);

	const mins = Math.floor(remaining / 60);
	const secs = remaining % 60;
	const urgent = remaining < 120;

	return (
		<div style={{
			display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10,
			background: urgent ? "var(--c-down-soft)" : "var(--c-surface-2)",
		}}>
			{urgent && <AlertTriangle size={14} style={{ color: "var(--c-down)" }} />}
			<span style={{ fontSize: 12, fontWeight: 600, color: urgent ? "var(--c-down)" : "var(--c-text-2)" }}>
				Expires in
			</span>
			<span style={{ marginLeft: "auto", fontWeight: 700, fontSize: 14, color: urgent ? "var(--c-down)" : "var(--c-text)", fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)" }}>
				{mins}:{secs.toString().padStart(2, "0")}
			</span>
		</div>
	);
}

export function BuyHandoff({ order, onDone, onCancel }: Props) {
	const pd = order.paymentDetails;
	if (!pd) return null;

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			{/* Header */}
			<div style={{ textAlign: "center" }}>
				<h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--c-text)", letterSpacing: "-0.03em", margin: 0 }}>
					Transfer exactly
				</h2>
				<p style={{ fontSize: 32, fontWeight: 700, color: "var(--c-text)", fontVariantNumeric: "tabular-nums", margin: "8px 0 0" }}>
					₦{pd.amountNgn.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
				</p>
				<p style={{ fontSize: 13, color: "var(--c-text-2)", marginTop: 4 }}>
					from your bank app to the account below
				</p>
			</div>

			{/* Expiry */}
			<ExpiryBar expiresAt={pd.expiresAt} />

			{/* Bank details — all copyable */}
			<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
				<CopyField label="Account number" value={pd.accountNumber} emphasize />
				<CopyField label="Bank" value={pd.bankName} />
				<CopyField label="Account name" value={pd.accountName} />
				<CopyField label="Amount" value={`₦${pd.amountNgn.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`} />
				<CopyField label="Reference (required)" value={pd.reference} emphasize />
			</div>

			{/* Info */}
			<div style={{ display: "flex", gap: 10, padding: 12, borderRadius: 10, background: "var(--c-info-soft)", border: "1px solid var(--c-info)" }}>
				<AlertTriangle size={16} style={{ color: "var(--c-info)", flexShrink: 0, marginTop: 1 }} />
				<p style={{ fontSize: 12, color: "var(--c-text-2)", lineHeight: 1.5, margin: 0 }}>
					Use the <strong>exact amount</strong> and <strong>reference code</strong>. Incorrect details may delay or fail the order.
				</p>
			</div>

			{/* Partner trust */}
			<div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", padding: "8px 0" }}>
				<ShieldCheck size={14} style={{ color: "var(--c-up)" }} />
				<span style={{ fontSize: 11, color: "var(--c-text-3)" }}>Settled securely via licensed payments partner</span>
			</div>

			{/* Actions */}
			<Button
				size="lg"
				className="w-full"
				onClick={onDone}
				style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", fontWeight: 700, fontSize: 15 }}
			>
				I&apos;ve sent the transfer
			</Button>
			<Button
				variant="ghost"
				size="lg"
				className="w-full"
				onClick={onCancel}
				style={{ color: "var(--c-text-2)", fontWeight: 600 }}
			>
				Cancel order
			</Button>
		</div>
	);
}
