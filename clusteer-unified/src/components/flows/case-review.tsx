"use client";

import { useState } from "react";
import { Flag, Check } from "lucide-react";
import { toast } from "sonner";
import { Drawer } from "./drawer";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = {
	kase?: any;
	onClose: () => void;
};

const DEFAULT_SIGNALS = [
	"Transaction velocity above 95th percentile",
	"Counterparty on internal watchlist",
	"Source-of-funds documentation incomplete",
];

function Timeline({ steps }: { steps: { label: string; time: string; done?: boolean; active?: boolean }[] }) {
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
			{steps.map((s, i) => (
				<div key={i} style={{ display: "flex", gap: 12, position: "relative", paddingBottom: i < steps.length - 1 ? 20 : 0 }}>
					{i < steps.length - 1 && (
						<div style={{ position: "absolute", left: 7, top: 18, width: 2, bottom: 0, background: s.done ? "var(--c-up)" : "var(--c-line)" }} />
					)}
					<div style={{
						width: 16, height: 16, borderRadius: "50%", flexShrink: 0, marginTop: 1,
						display: "flex", alignItems: "center", justifyContent: "center",
						background: s.done ? "var(--c-up)" : s.active ? "var(--c-warn)" : "var(--c-surface-3)",
					}}>
						{s.done && <Check size={10} style={{ color: "#fff" }} />}
						{s.active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
					</div>
					<div>
						<div style={{ fontSize: 13, fontWeight: 500, color: s.done || s.active ? "var(--c-text)" : "var(--c-text-3)" }}>{s.label}</div>
						{s.time && <div style={{ fontSize: 11, color: "var(--c-text-3)", marginTop: 2 }}>{s.time}</div>}
					</div>
				</div>
			))}
		</div>
	);
}

export function CaseReviewDrawer({ kase, onClose }: Props) {
	const [note, setNote] = useState("");

	if (!kase) return null;

	const c = kase;
	const sevCls = c.sev === "Critical" ? "var(--c-down)" : c.sev === "High" ? "var(--c-warn)" : "var(--c-text-2)";
	const sevBg = c.sev === "Critical" ? "var(--c-down-soft)" : c.sev === "High" ? "var(--c-warn-soft)" : "var(--c-surface-3)";

	function resolve(status: string, msg: string) {
		toast.success(msg);
		onClose();
	}

	const signals = c.signals || DEFAULT_SIGNALS;
	const timeline = [
		{ label: "Case auto-opened by rules engine", time: c.opened || "2d ago", done: true },
		{ label: `Assigned to ${c.assignee || "Tunde B."}`, time: "", done: true },
		{ label: "Awaiting analyst decision", time: "", active: true },
	];

	return (
		<Drawer open onClose={onClose} title={`Case ${c.id}`} width={520}
			footer={
				<>
					<button
						onClick={() => {
							window.openFlow("confirm", {
								title: "File SAR/STR?",
								message: `File a Suspicious Activity Report for ${c.user} with the NFIU? This is logged to the audit trail.`,
								confirmLabel: "File report",
								danger: true,
								onConfirm: () => resolve("Reported", "SAR filed · NFIU reference generated"),
							});
						}}
						style={{ height: 36, padding: "0 14px", borderRadius: 10, border: "1px solid var(--c-line)", background: "transparent", fontSize: 13, fontWeight: 500, color: "var(--c-down)", cursor: "pointer", marginRight: "auto" }}
					>File SAR</button>
					<button onClick={() => resolve("Escalated", "Case escalated to senior compliance")} style={{ height: 36, padding: "0 14px", borderRadius: 10, border: "1px solid var(--c-line)", background: "transparent", fontSize: 13, fontWeight: 500, color: "var(--c-text)", cursor: "pointer" }}>Escalate</button>
					<button onClick={() => resolve("Cleared", "Case cleared · no action needed")} style={{ height: 36, padding: "0 14px", borderRadius: 10, border: "none", background: "var(--c-lime-500)", fontSize: 13, fontWeight: 600, color: "var(--c-onyx-900)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
						<Check size={14} />Clear case
					</button>
				</>
			}
		>
			{/* Badges */}
			<div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
				<span style={{ display: "inline-flex", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: sevBg, color: sevCls }}>{c.sev}</span>
				<span style={{ display: "inline-flex", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "var(--c-warn-soft)", color: "var(--c-warn)" }}>{c.status || "Pending"}</span>
				<span style={{ display: "inline-flex", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "var(--c-surface-3)", color: "var(--c-text-2)" }}>{c.trigger}</span>
			</div>

			{/* Details */}
			<div style={{ background: "var(--c-surface-2)", borderRadius: 14, padding: "4px 14px" }}>
				{[
					["Case ID", c.id],
					["User", c.user],
					["Trigger", c.trigger],
					["Opened", c.opened || "2d ago"],
					["Assignee", c.assignee || "Tunde B."],
				].map(([k, v]) => (
					<div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--c-line)", fontSize: 13 }}>
						<span style={{ color: "var(--c-text-2)" }}>{k}</span>
						<span style={{ fontWeight: 600, color: "var(--c-text)", fontFamily: k === "Case ID" ? "var(--font-mono, monospace)" : undefined }}>{v}</span>
					</div>
				))}
			</div>

			{/* Risk signals */}
			<div style={{ background: "var(--c-surface-2)", borderRadius: 14, padding: "16px" }}>
				<h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)", margin: "0 0 10px" }}>Risk signals</h4>
				<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
					{signals.map((s: string) => (
						<div key={s} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
							<Flag size={13} style={{ color: "var(--c-down)", flexShrink: 0 }} />
							<span style={{ color: "var(--c-text)" }}>{s}</span>
						</div>
					))}
				</div>
			</div>

			{/* Timeline */}
			<div style={{ background: "var(--c-surface-2)", borderRadius: 14, padding: "16px" }}>
				<h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)", margin: "0 0 12px" }}>Timeline</h4>
				<Timeline steps={timeline} />
			</div>

			{/* Analyst note */}
			<div>
				<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 4 }}>Analyst note</label>
				<textarea
					value={note} onChange={(e) => setNote(e.target.value)}
					rows={3} placeholder="Document your rationale…"
					style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--c-line)", borderRadius: 10, background: "var(--c-surface)", color: "var(--c-text)", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit" }}
				/>
			</div>
		</Drawer>
	);
}
