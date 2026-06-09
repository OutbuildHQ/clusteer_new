"use client";

import { Check, Copy, AlertTriangle, Flag } from "lucide-react";
import { toast } from "sonner";
import { Drawer } from "@/components/flows/drawer";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = {
	txn?: any;
	onClose: () => void;
};

function fmtNgn(n: number) {
	return "₦" + Math.round(n).toLocaleString("en-NG");
}

function copyText(t: string) {
	try { navigator.clipboard?.writeText(t); } catch { /* noop */ }
	toast.success("Copied to clipboard");
}

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

const STATUS_BADGE: Record<string, { label: string; bg: string; color: string }> = {
	Completed: { label: "Completed", bg: "var(--c-up-soft)", color: "var(--c-up)" },
	Pending: { label: "Pending", bg: "var(--c-warn-soft)", color: "var(--c-warn)" },
	Failed: { label: "Failed", bg: "var(--c-down-soft)", color: "var(--c-down)" },
	Flagged: { label: "Flagged", bg: "var(--c-down-soft)", color: "var(--c-down)" },
};

export function TxnDetailAdminDrawer({ txn, onClose }: Props) {
	if (!txn) return null;

	const t = txn;
	const status = STATUS_BADGE[t.status] || STATUS_BADGE.Completed;
	const isFlagged = t.status === "Flagged" || t.flag;

	function KVRow({ k, v, mono, copy: showCopy }: { k: string; v: string; mono?: boolean; copy?: boolean }) {
		return (
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--c-line)", fontSize: 13 }}>
				<span style={{ color: "var(--c-text-2)" }}>{k}</span>
				<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
					<span style={{ fontWeight: 600, color: "var(--c-text)", ...(mono ? { fontFamily: "var(--font-mono, monospace)", fontVariantNumeric: "tabular-nums" } : {}), maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</span>
					{showCopy && (
						<button onClick={() => copyText(v)} style={{ width: 24, height: 24, borderRadius: 6, border: "none", background: "var(--c-surface-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
							<Copy size={11} style={{ color: "var(--c-text-3)" }} />
						</button>
					)}
				</div>
			</div>
		);
	}

	const timeline = [
		{ label: "Transaction initiated", time: t.when || t.time || "2m ago", done: true },
		{ label: "AML screening passed", time: "", done: t.status !== "Flagged" },
		{ label: "Settlement processed", time: "", done: t.status === "Completed", active: t.status === "Pending" },
		{ label: t.status === "Completed" ? "Completed" : "Awaiting completion", time: t.status === "Completed" ? "done" : "", done: t.status === "Completed" },
	];

	return (
		<Drawer open onClose={onClose} title={`Transaction ${t.id}`} width={520}
			footer={
				<>
					{isFlagged && (
						<button
							onClick={() => { toast.success("Transaction approved manually"); onClose(); }}
							style={{ height: 36, padding: "0 14px", borderRadius: 10, border: "1px solid var(--c-line)", background: "transparent", fontSize: 13, fontWeight: 500, color: "var(--c-text)", cursor: "pointer" }}
						>Approve</button>
					)}
					{isFlagged && (
						<button
							onClick={() => { toast.success("Transaction rejected"); onClose(); }}
							style={{ height: 36, padding: "0 14px", borderRadius: 10, border: "1px solid var(--c-line)", background: "transparent", fontSize: 13, fontWeight: 500, color: "var(--c-down)", cursor: "pointer" }}
						>Reject</button>
					)}
					<button onClick={onClose} style={{ height: 36, padding: "0 14px", borderRadius: 10, border: "none", background: "var(--c-lime-500)", fontSize: 13, fontWeight: 600, color: "var(--c-onyx-900)", cursor: "pointer" }}>Close</button>
				</>
			}
		>
			{/* Amount header */}
			<div style={{ textAlign: "center", padding: "8px 0 4px" }}>
				<div style={{ fontSize: 32, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: "var(--c-text)" }}>{t.amount || fmtNgn(t.ngn || 0)}</div>
				<div style={{ fontSize: 13, color: "var(--c-text-3)", marginTop: 2 }}>{t.type || t.action || "Transfer"}</div>
				<div style={{ marginTop: 10 }}>
					<span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: status.bg, color: status.color }}>
						<span style={{ width: 5, height: 5, borderRadius: "50%", background: status.color }} />{status.label}
					</span>
				</div>
			</div>

			{/* Details card */}
			<div style={{ background: "var(--c-surface-2)", borderRadius: 14, padding: "4px 14px" }}>
				<KVRow k="Transaction ID" v={t.id} mono copy />
				<KVRow k="User" v={t.user || t.sender || "—"} />
				<KVRow k="Type" v={t.type || t.action || "Transfer"} />
				<KVRow k="Amount" v={t.amount || fmtNgn(t.ngn || 0)} mono />
				<KVRow k="Fee (0.75%)" v={t.fee || fmtNgn((t.ngn || 0) * 0.0075)} mono />
				<KVRow k="Channel" v={t.channel || t.method || "Bank transfer"} />
				<KVRow k="Time" v={t.when || t.time || "—"} />
			</div>

			{/* Flagged warning */}
			{isFlagged && (
				<div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 14, background: "var(--c-down-soft)", borderRadius: 14 }}>
					<AlertTriangle size={16} style={{ color: "var(--c-down)", flexShrink: 0, marginTop: 1 }} />
					<div>
						<div style={{ fontWeight: 600, fontSize: 13, color: "var(--c-down)" }}>Flagged for review</div>
						<div style={{ fontSize: 12, color: "var(--c-text-2)", marginTop: 4 }}>{t.flagReason || "This transaction was flagged by the AML screening engine. Review and approve or reject."}</div>
					</div>
				</div>
			)}

			{/* Timeline */}
			<div style={{ background: "var(--c-surface-2)", borderRadius: 14, padding: 16 }}>
				<h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)", margin: "0 0 12px" }}>Status</h4>
				<Timeline steps={timeline} />
			</div>
		</Drawer>
	);
}
