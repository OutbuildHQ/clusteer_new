"use client";

import { Check, ArrowRight, Copy } from "lucide-react";
import { toast } from "sonner";
import { Drawer } from "./drawer";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = {
	entry?: any;
	onClose: () => void;
};

const AUDIT_META: Record<string, { cat: string; sev: string; diff?: [string, string, string]; note?: string }> = {
	"Updated fee schedule": { cat: "Configuration", sev: "Medium", diff: ["Sell crypto · Bank payout", "0.50%", "0.75%"] },
	"Approved KYC submission": { cat: "Compliance", sev: "Low", note: "Tier upgrade granted after document + liveness review." },
	"Rejected KYC: blurry ID": { cat: "Compliance", sev: "Low", note: "Submission returned to user with reason: document not legible." },
	"Suspended user": { cat: "Account", sev: "High", note: "Account frozen pending review. All sessions terminated." },
	"Reset 2FA": { cat: "Security", sev: "Medium", note: "Two-factor enrolment cleared; user must re-enrol on next login." },
	"Manual transaction approval": { cat: "Operations", sev: "High", note: "Order released manually after settlement reconciliation." },
	"Rotated hot wallet key": { cat: "Security", sev: "High", note: "Settlement signing key rotated as part of scheduled rotation." },
	"Published banner": { cat: "Content", sev: "Low", note: "Customer-facing banner published to dashboard placement." },
	"Triggered AML rescan": { cat: "Compliance", sev: "Medium", note: "Re-screened user against sanctions + risk lists." },
};

function computeHash(id: string, when: string): string {
	const str = id + when;
	let h = 5381;
	for (let i = 0; i < str.length; i++) {
		h = ((h << 5) - h + str.charCodeAt(i)) >>> 0;
	}
	return `0x${h.toString(16).padStart(8, "0")}…`;
}

export function AuditDetailDrawer({ entry, onClose }: Props) {
	if (!entry) return null;

	const a = entry;
	const m = AUDIT_META[a.action] || { cat: "System", sev: "Low" };
	const sevColor = m.sev === "High" ? "var(--c-down)" : m.sev === "Medium" ? "var(--c-warn)" : "var(--c-text-2)";
	const sevBg = m.sev === "High" ? "var(--c-down-soft)" : m.sev === "Medium" ? "var(--c-warn-soft)" : "var(--c-surface-3)";
	const isSystem = a.actor === "system";

	function KVRow({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
		return (
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--c-line)", fontSize: 13 }}>
				<span style={{ color: "var(--c-text-2)" }}>{k}</span>
				<span style={{ fontWeight: 600, color: "var(--c-text)", ...(mono ? { fontFamily: "var(--font-mono, monospace)", fontVariantNumeric: "tabular-nums" } : {}), maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</span>
			</div>
		);
	}

	return (
		<Drawer open onClose={onClose} title={`Event ${a.id}`} width={500}
			footer={
				<>
					<button
						onClick={() => { try { navigator.clipboard?.writeText(a.id); } catch { /* noop */ } toast.success("Event ID copied"); }}
						style={{ height: 36, padding: "0 14px", borderRadius: 10, border: "1px solid var(--c-line)", background: "transparent", fontSize: 13, fontWeight: 500, color: "var(--c-text)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
					><Copy size={13} />Copy ID</button>
					<button onClick={onClose} style={{ height: 36, padding: "0 14px", borderRadius: 10, border: "none", background: "var(--c-lime-500)", fontSize: 13, fontWeight: 600, color: "var(--c-onyx-900)", cursor: "pointer" }}>Close</button>
				</>
			}
		>
			{/* Badges */}
			<div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
				<span style={{ display: "inline-flex", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "var(--c-surface-3)", color: "var(--c-text-2)" }}>{m.cat}</span>
				<span style={{ display: "inline-flex", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: sevBg, color: sevColor }}>{m.sev}</span>
				<span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "var(--c-up-soft)", color: "var(--c-up)" }}>
					<Check size={10} />Verified
				</span>
			</div>

			{/* Action title */}
			<div style={{ padding: "4px 0" }}>
				<div style={{ fontSize: 18, fontWeight: 600, color: "var(--c-text)" }}>{a.action}</div>
				<div style={{ fontSize: 12, color: "var(--c-text-3)", marginTop: 2 }}>{a.when}</div>
			</div>

			{/* Details card */}
			<div style={{ background: "var(--c-surface-2)", borderRadius: 14, padding: "4px 14px" }}>
				<KVRow k="Event ID" v={a.id} mono />
				<KVRow k="Actor" v={isSystem ? "system (automated)" : a.actor} mono />
				<KVRow k="Target" v={a.target} mono />
				<KVRow k="IP address" v={a.ip} mono />
				<KVRow k="Location" v={isSystem ? "Internal · data center" : "Lagos, NG"} />
				<KVRow k="Client" v={isSystem ? "Clusteer rules engine" : "Admin console · Chrome 122 / macOS"} />
				<KVRow k="Timestamp" v={`${a.when} WAT`} />
			</div>

			{/* Change diff */}
			{m.diff && (
				<div style={{ background: "var(--c-surface-2)", borderRadius: 14, padding: 16 }}>
					<h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)", margin: "0 0 10px" }}>Change</h4>
					<div style={{ fontSize: 12, color: "var(--c-text-3)", marginBottom: 8 }}>{m.diff[0]}</div>
					<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
						<span style={{ display: "inline-flex", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "var(--c-down-soft)", color: "var(--c-down)", textDecoration: "line-through" }}>{m.diff[1]}</span>
						<ArrowRight size={14} style={{ color: "var(--c-text-3)" }} />
						<span style={{ display: "inline-flex", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "var(--c-up-soft)", color: "var(--c-up)" }}>{m.diff[2]}</span>
					</div>
				</div>
			)}

			{/* Note */}
			{m.note && (
				<div style={{ background: "var(--c-surface-2)", borderRadius: 14, padding: 16 }}>
					<div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--c-text)" }}>{m.note}</div>
				</div>
			)}

			{/* Integrity */}
			<div style={{ background: "var(--c-surface-2)", borderRadius: 14, padding: "4px 14px" }}>
				<h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)", margin: "10px 0" }}>Integrity</h4>
				<KVRow k="Hash" v={computeHash(a.id, a.when)} mono />
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", fontSize: 13 }}>
					<span style={{ color: "var(--c-text-2)" }}>Chained</span>
					<span style={{ fontWeight: 600, color: "var(--c-text)" }}>Yes · tamper-evident</span>
				</div>
			</div>
		</Drawer>
	);
}
