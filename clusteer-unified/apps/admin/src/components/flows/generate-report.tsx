"use client";

import { useState } from "react";
import { toast } from "sonner";

const REPORT_TYPES = ["Transaction volume", "Revenue & fees", "KYC & compliance", "User growth", "Regulatory (CBN)", "AML / suspicious activity"];
const DATE_RANGES = ["7D", "30D", "90D", "YTD", "Custom"];
const FORMATS = ["CSV", "PDF", "XLSX"];

export function GenerateReportFlow({ onClose }: { onClose: () => void }) {
	const [type, setType] = useState("Transaction volume");
	const [range, setRange] = useState("30D");
	const [fmt, setFmt] = useState("CSV");
	const [busy, setBusy] = useState(false);

	function handleGenerate() {
		setBusy(true);
		setTimeout(() => {
			toast.success(`${type} (${range}) ready · ${fmt}`);
			onClose();
		}, 1200);
	}

	const selectStyle: React.CSSProperties = { width: "100%", height: 38, padding: "0 12px", border: "1px solid var(--c-line)", borderRadius: 10, background: "var(--c-surface)", color: "var(--c-text)", fontSize: 13, outline: "none" };

	function SegControl({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
		return (
			<div style={{ display: "flex", gap: 0, padding: 3, borderRadius: 10, background: "var(--c-surface-2)", border: "1px solid var(--c-line)" }}>
				{options.map((o) => (
					<button
						key={o} onClick={() => onChange(o)}
						style={{
							flex: 1, padding: "6px 0", borderRadius: 7, fontSize: 12.5, fontWeight: 500, cursor: "pointer", border: "none", transition: "all 0.15s",
							...(value === o
								? { background: "var(--c-surface)", color: "var(--c-text)", boxShadow: "0 1px 2px rgba(0,0,0,.08)" }
								: { background: "transparent", color: "var(--c-text-2)" }),
						}}
					>{o}</button>
				))}
			</div>
		);
	}

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			<h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-text)", margin: 0 }}>Generate report</h3>

			<div>
				<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 5 }}>Report</label>
				<select value={type} onChange={(e) => setType(e.target.value)} style={selectStyle}>
					{REPORT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
				</select>
			</div>

			<div>
				<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 5 }}>Date range</label>
				<SegControl options={DATE_RANGES} value={range} onChange={setRange} />
			</div>

			<div>
				<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 5 }}>Format</label>
				<SegControl options={FORMATS} value={fmt} onChange={setFmt} />
			</div>

			<div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 4 }}>
				<button onClick={onClose} style={{ height: 36, padding: "0 16px", borderRadius: 10, border: "1px solid var(--c-line)", background: "transparent", fontSize: 13, fontWeight: 500, color: "var(--c-text)", cursor: "pointer" }}>Cancel</button>
				<button onClick={handleGenerate} disabled={busy} style={{ height: 36, padding: "0 20px", borderRadius: 10, border: "none", background: "var(--c-lime-500)", fontSize: 13, fontWeight: 600, color: "var(--c-onyx-900)", cursor: busy ? "not-allowed" : "pointer", opacity: busy ? 0.6 : 1, minWidth: 140 }}>
					{busy ? "Generating…" : "Generate"}
				</button>
			</div>
		</div>
	);
}
