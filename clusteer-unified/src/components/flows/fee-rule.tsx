"use client";

import { useState } from "react";
import { toast } from "sonner";

export function FeeRuleFlow({ onClose }: { onClose: () => void }) {
	const [side, setSide] = useState("Buy");
	const [method, setMethod] = useState("Bank transfer");
	const [fee, setFee] = useState("0.75");
	const [min, setMin] = useState("500");

	const ok = fee !== "" && !isNaN(parseFloat(fee));

	function handleAdd() {
		toast.success(`Fee rule added · ${side} ${method} ${fee}%`);
		onClose();
	}

	const selectStyle: React.CSSProperties = { width: "100%", height: 38, padding: "0 12px", border: "1px solid var(--c-line)", borderRadius: 10, background: "var(--c-surface)", color: "var(--c-text)", fontSize: 13, outline: "none" };
	const inputStyle = selectStyle;

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			<h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-text)", margin: 0 }}>New fee rule</h3>

			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
				<div>
					<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 5 }}>Transaction</label>
					<select value={side} onChange={(e) => setSide(e.target.value)} style={selectStyle}>
						{["Buy", "Sell"].map((o) => <option key={o} value={o}>{o}</option>)}
					</select>
				</div>
				<div>
					<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 5 }}>Method</label>
					<select value={method} onChange={(e) => setMethod(e.target.value)} style={selectStyle}>
						{["Bank transfer", "Card", "Bank payout", "Quidax payout"].map((o) => <option key={o} value={o}>{o}</option>)}
					</select>
				</div>
			</div>

			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
				<div>
					<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 5 }}>Fee (%)</label>
					<input value={fee} onChange={(e) => setFee(e.target.value.replace(/[^\d.]/g, ""))} inputMode="decimal" style={inputStyle} />
				</div>
				<div>
					<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 5 }}>Minimum (₦)</label>
					<input value={min} onChange={(e) => setMin(e.target.value.replace(/\D/g, ""))} inputMode="numeric" style={inputStyle} />
				</div>
			</div>

			<div style={{ padding: "10px 14px", background: "var(--c-surface-2)", borderRadius: 10, fontSize: 12.5, color: "var(--c-text-2)" }}>
				<span style={{ color: "var(--c-text-3)" }}>Preview · </span>
				{side} via {method}: <strong style={{ color: "var(--c-text)" }}>{fee || "0"}%</strong>, min ₦{Number(min || 0).toLocaleString()}
			</div>

			<div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 4 }}>
				<button onClick={onClose} style={{ height: 36, padding: "0 16px", borderRadius: 10, border: "1px solid var(--c-line)", background: "transparent", fontSize: 13, fontWeight: 500, color: "var(--c-text)", cursor: "pointer" }}>Cancel</button>
				<button onClick={handleAdd} disabled={!ok} style={{ height: 36, padding: "0 16px", borderRadius: 10, border: "none", background: "var(--c-lime-500)", fontSize: 13, fontWeight: 600, color: "var(--c-onyx-900)", cursor: ok ? "pointer" : "not-allowed", opacity: ok ? 1 : 0.45 }}>Add rule</button>
			</div>
		</div>
	);
}
