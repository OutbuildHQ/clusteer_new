"use client";

import { useState, useEffect } from "react";
import { Copy, Check, AlertTriangle, ShieldCheck } from "lucide-react";
import { QR } from "@/components/primitives/qr";
import { ChainBadge } from "@/components/primitives/chain-badge";
import { Button } from "@/components/ui/button";
import type { QxOrder } from "@/lib/types";

type Props = {
	order: QxOrder;
	onDone: () => void;
	onCancel: () => void;
};

function CopyField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
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
				padding: "12px 14px", borderRadius: 10, border: "2px solid var(--c-text)",
				background: "var(--c-surface)", cursor: "pointer", display: "flex", flexDirection: "column", gap: 2,
			}}
		>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<span style={{ fontSize: 10, fontWeight: 700, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
				{copied ? <Check size={14} style={{ color: "var(--c-up)" }} /> : <Copy size={14} style={{ color: "var(--c-text-3)" }} />}
			</div>
			<span style={{
				fontSize: 13, fontWeight: 600, color: "var(--c-text)", wordBreak: "break-all", lineHeight: 1.4,
				fontFamily: mono ? "var(--font-mono)" : "inherit",
			}}>{value}</span>
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
			<span style={{ fontSize: 12, fontWeight: 600, color: urgent ? "var(--c-down)" : "var(--c-text-2)" }}>Expires in</span>
			<span style={{ marginLeft: "auto", fontWeight: 700, fontSize: 14, color: urgent ? "var(--c-down)" : "var(--c-text)", fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)" }}>
				{mins}:{secs.toString().padStart(2, "0")}
			</span>
		</div>
	);
}

export function SellHandoff({ order, onDone, onCancel }: Props) {
	const dd = order.depositDetails;
	if (!dd) return null;

	const chainLabel = dd.chain === "TRC20" ? "TRC-20" : dd.chain === "BEP20" ? "BEP-20" : "ERC-20";
	const networkName = dd.chain === "TRC20" ? "Tron" : dd.chain === "BEP20" ? "BNB Smart Chain" : "Ethereum";

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			{/* Header */}
			<div style={{ textAlign: "center" }}>
				<h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--c-text)", letterSpacing: "-0.03em", margin: 0 }}>
					Send exactly
				</h2>
				<p style={{ fontSize: 32, fontWeight: 700, color: "var(--c-text)", fontVariantNumeric: "tabular-nums", margin: "8px 0 0" }}>
					{dd.amountUsdt.toFixed(2)} USDT
				</p>
				<div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
					<ChainBadge chain={chainLabel} />
				</div>
			</div>

			{/* QR Code */}
			<div style={{ display: "flex", justifyContent: "center", padding: 16 }}>
				<div style={{ padding: 12, borderRadius: 16, border: "2.5px solid var(--c-text)", background: "#fff" }}>
					<QR value={dd.qrValue || dd.address} size={140} />
				</div>
			</div>

			{/* Address — copyable */}
			<CopyField label={`${chainLabel} deposit address`} value={dd.address} mono />

			{/* Expiry */}
			<ExpiryBar expiresAt={dd.expiresAt} />

			{/* Chain warning */}
			<div style={{ display: "flex", gap: 10, padding: 12, borderRadius: 10, background: "var(--c-warn-soft)", border: "1px solid var(--c-warn)" }}>
				<AlertTriangle size={16} style={{ color: "var(--c-warn)", flexShrink: 0, marginTop: 1 }} />
				<p style={{ fontSize: 12, color: "var(--c-text)", lineHeight: 1.5, margin: 0 }}>
					Send <strong>only USDT</strong> on the <strong>{networkName} ({chainLabel})</strong> network. Sending any other token or using the wrong network will result in permanent loss.
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
				I&apos;ve sent the USDT
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
