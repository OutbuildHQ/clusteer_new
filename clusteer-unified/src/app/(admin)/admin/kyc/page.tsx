"use client";

import { useState } from "react";
import { KYC_QUEUE } from "@/lib/mock-data";
import { relativeTime } from "@/lib/utils";
import { Num } from "@/components/primitives/num";
import { Check, X, RotateCcw, Camera, FileText, Clock, Filter } from "lucide-react";
import { toast } from "sonner";

/* ─── helpers ─── */
function initials(name: string) {
	return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

/* Smile ID scores per submission (deterministic mock) */
const SMILE_SCORES: Record<string, number> = {
	k_301: 83, k_302: 52, k_303: 91, k_304: 78,
};

const AUDIT_TRAIL = [
	{ t: "Submitted BVN",            a: "User",   ago: "12m ago" },
	{ t: "Smile ID returned result", a: "System", ago: "12m ago" },
	{ t: "Assigned to Emeka",        a: "System", ago: "11m ago" },
];

/* ─── page ─── */
export default function AdminKyc() {
	const [queue, setQueue] = useState(KYC_QUEUE);
	const [activeId, setActiveId] = useState<string | null>(queue[0]?.id ?? null);
	const [note, setNote]         = useState("");

	const pending  = queue.filter((k) => k.status === "pending");
	const current  = pending.find((k) => k.id === activeId) ?? pending[0] ?? null;
	const score    = current ? (SMILE_SCORES[current.id] ?? 72) : 0;
	const scoreOk  = score >= 70;

	function approve() {
		if (!current) return;
		setQueue((prev) => prev.filter((k) => k.id !== current.id));
		toast.success(`Tier ${current.tier} approved for ${current.userName}`);
		setActiveId(pending.find((k) => k.id !== current.id)?.id ?? null);
		setNote("");
	}

	function reject() {
		if (!current) return;
		setQueue((prev) => prev.filter((k) => k.id !== current.id));
		toast.error(`Submission rejected for ${current.userName}${note ? ` — ${note}` : ""}`);
		setActiveId(pending.find((k) => k.id !== current.id)?.id ?? null);
		setNote("");
	}

	function reRequest() {
		if (!current) return;
		toast.info(`Re-request sent to ${current.userName}`);
	}

	return (
		<div className="space-y-5">
			{/* Header */}
			<div className="flex items-center justify-between gap-4">
				<div>
					<h1 className="text-[22px] font-semibold tracking-tight text-[var(--c-text)]">KYC queue</h1>
					<p className="text-[13px] text-[var(--c-text-3)] mt-0.5">{pending.length} submissions awaiting review</p>
				</div>
				<button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-[var(--c-line)] text-[13px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors">
					<Filter className="size-3.5 text-[var(--c-text-3)]" />Filter
				</button>
			</div>

			{pending.length === 0 ? (
				<div className="ds-card p-16 text-center">
					<div className="inline-flex size-12 items-center justify-center rounded-full mb-3" style={{ background: "var(--c-up-soft)" }}>
						<Check className="size-6 text-[var(--c-up)]" />
					</div>
					<div className="text-[15px] font-semibold text-[var(--c-text)]">Queue cleared</div>
					<p className="text-[13px] text-[var(--c-text-3)] mt-1">No submissions awaiting review.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">

					{/* ── Left: queue list ── */}
					<div className="ds-card overflow-hidden">
						<div
							className="flex items-center gap-2 px-4 py-3"
							style={{ borderBottom: "1px solid var(--c-line)" }}
						>
							<span className="text-[15px] font-semibold text-[var(--c-text)]">Pending</span>
							<span
								className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
								style={{ background: "var(--c-warn-soft)", color: "var(--c-warn)" }}
							>
								{pending.length}
							</span>
							<div className="flex-1" />
							<Clock className="size-3.5 text-[var(--c-text-3)]" />
						</div>

						{pending.map((k, i) => {
							const sc    = SMILE_SCORES[k.id] ?? 72;
							const isAct = k.id === (current?.id ?? null);
							return (
								<button
									key={k.id}
									onClick={() => setActiveId(k.id)}
									className="w-full text-left px-4 py-3.5 transition-colors hover:bg-[var(--c-surface-2)]"
									style={{
										borderBottom: i < pending.length - 1 ? "1px solid var(--c-line)" : undefined,
										borderLeft: `3px solid ${isAct ? "var(--c-lime-500)" : "transparent"}`,
										background: isAct ? "var(--c-surface-2)" : undefined,
									}}
								>
									<div className="flex items-center gap-3">
										<div
											className="size-9 shrink-0 rounded-full flex items-center justify-center text-[12px] font-bold"
											style={{ background: "var(--c-onyx-700)", color: "var(--c-cream)" }}
										>
											{initials(k.userName)}
										</div>
										<div className="flex-1 min-w-0">
											<div className="font-semibold text-[13.5px] text-[var(--c-text)] truncate">{k.userName}</div>
											<div className="text-[11.5px] text-[var(--c-text-3)] mt-0.5">
												{k.documents.map((d) => d.type).join(" · ")}
											</div>
										</div>
										<div className="shrink-0 text-right">
											<div
												className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
												style={{ background: "var(--c-warn-soft)", color: "var(--c-warn)" }}
											>
												{relativeTime(k.submittedAt)}
											</div>
											<div className="mt-1 text-[11px] text-[var(--c-text-3)]">
												Smile ID <span className={sc >= 70 ? "text-[var(--c-up)]" : "text-[var(--c-down)]"}>{sc}%</span>
											</div>
										</div>
									</div>
								</button>
							);
						})}
					</div>

					{/* ── Right: detail panel ── */}
					{current && (
						<div className="ds-card overflow-hidden">
							{/* Detail header */}
							<div
								className="flex items-center gap-3 px-5 py-4"
								style={{ borderBottom: "1px solid var(--c-line)" }}
							>
								<div
									className="size-11 shrink-0 rounded-full flex items-center justify-center text-[14px] font-bold"
									style={{ background: "var(--c-onyx-900)", color: "var(--c-cream)" }}
								>
									{initials(current.userName)}
								</div>
								<div className="flex-1 min-w-0">
									<div className="font-semibold text-[16px] text-[var(--c-text)]">{current.userName}</div>
									<div className="text-[12px] text-[var(--c-text-3)]">
										{current.userEmail} · submitted {relativeTime(current.submittedAt)}
									</div>
								</div>
								<div
									className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
									style={{ background: "var(--c-warn-soft)", color: "var(--c-warn)" }}
								>
									<span className="size-[5px] rounded-full bg-[var(--c-warn)]" />
									Awaiting review
								</div>
								<span
									className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
									style={{ background: "var(--c-info-soft)", color: "var(--c-info)" }}
								>
									Tier {current.tier}
								</span>
							</div>

							{/* Body: 2-col */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-5">

								{/* Left col: BVN + audit */}
								<div className="space-y-4">
									<div>
										<div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--c-text-3)] mb-2">Verification data</div>
										<div className="rounded-[12px] p-4 space-y-3" style={{ background: "var(--c-surface-2)", border: "1px solid var(--c-line)" }}>
											{[
												{ label: "BVN / NIN",    value: current.bvn || current.nin || "—", mono: true },
												{ label: "Date of birth", value: "14 May 1996" },
												{ label: "Name match",    value: "Exact", ok: true },
												{ label: "Phone match",   value: "Match", ok: true },
												{
													label: "Smile ID score",
													value: `${score}% · ${scoreOk ? "pass" : "fail"}`,
													ok: scoreOk, fail: !scoreOk,
												},
												{ label: "Device risk", value: "Low" },
											].map((row) => (
												<div key={row.label} className="flex items-center justify-between gap-2 text-[13px]">
													<span className="text-[11px] text-[var(--c-text-3)]">{row.label}</span>
													<span
														className={`font-medium ${row.mono ? "font-mono tabular-nums" : ""}`}
														style={{ color: row.ok ? "var(--c-up)" : row.fail ? "var(--c-down)" : "var(--c-text)" }}
													>
														{row.value}
													</span>
												</div>
											))}
										</div>
									</div>

									{/* Audit trail */}
									<div>
										<div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--c-text-3)] mb-2">Audit trail</div>
										<div className="space-y-0">
											{AUDIT_TRAIL.map((l, i) => (
												<div key={i} className="flex gap-3 py-2.5" style={{ borderBottom: i < AUDIT_TRAIL.length - 1 ? "1px solid var(--c-line)" : undefined }}>
													<span
														className="mt-1.5 size-[6px] shrink-0 rounded-full"
														style={{ background: "var(--c-lime-500)" }}
													/>
													<div className="flex-1 min-w-0">
														<div className="text-[13px] text-[var(--c-text)]">{l.t}</div>
														<div className="text-[11px] text-[var(--c-text-3)]">{l.a} · {l.ago}</div>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>

								{/* Right col: documents + actions */}
								<div className="space-y-4">
									<div>
										<div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--c-text-3)] mb-2">Documents</div>
										<div className="grid grid-cols-2 gap-2.5">
											{current.documents.map((doc, i) => (
												<div
													key={doc.type}
													className="aspect-[3/4] rounded-[12px] flex flex-col items-center justify-center relative"
													style={{
														background: "linear-gradient(135deg, var(--c-surface-2), var(--c-surface-3))",
														border: "1px solid var(--c-line)",
													}}
												>
													{doc.type.toLowerCase().includes("selfie") ? (
														<Camera className="size-8 text-[var(--c-text-3)]" />
													) : (
														<FileText className="size-8 text-[var(--c-text-3)]" />
													)}
													<div className="mt-2 text-[12px] text-[var(--c-text-3)] font-medium">{doc.type}</div>
													{i === 0 && (
														<span
															className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-semibold"
															style={{ background: "var(--c-warn-soft)", color: "var(--c-warn)" }}
														>
															New
														</span>
													)}
												</div>
											))}
										</div>
									</div>

									{/* Review note */}
									<div>
										<div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--c-text-3)] mb-2">Review note</div>
										<textarea
											className="w-full h-[72px] px-3 py-2.5 rounded-[10px] border border-[var(--c-line)] bg-[var(--c-surface)] text-[13px] text-[var(--c-text)] resize-none outline-none focus:ring-2 focus:ring-[var(--c-lime-500)] focus:border-transparent placeholder:text-[var(--c-text-3)]"
											placeholder="Optional note for audit log…"
											value={note}
											onChange={(e) => setNote(e.target.value)}
										/>
									</div>

									{/* Action buttons */}
									<div className="grid grid-cols-2 gap-2">
										<button
											onClick={approve}
											className="flex items-center justify-center gap-2 h-10 rounded-lg text-[13.5px] font-semibold transition-colors"
											style={{ background: "var(--c-up)", color: "#fff" }}
										>
											<Check className="size-4" />Approve
										</button>
										<button
											onClick={reject}
											className="flex items-center justify-center gap-2 h-10 rounded-lg text-[13.5px] font-semibold transition-colors"
											style={{ background: "var(--c-down)", color: "#fff" }}
										>
											<X className="size-4" />Reject
										</button>
									</div>
									<button
										onClick={reRequest}
										className="w-full flex items-center justify-center gap-2 h-9 rounded-lg border border-[var(--c-line)] text-[13px] font-medium text-[var(--c-text-2)] hover:bg-[var(--c-surface-2)] transition-colors"
									>
										<RotateCcw className="size-3.5" />Re-request documents
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
