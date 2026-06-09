"use client";

import { useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";

/* ── inline mock data ── */
const USERS = [
  { name: "Adaeze Okonkwo" },
  { name: "Tunde Bakare" },
  { name: "Chinedu Eze" },
  { name: "Fatima Yusuf" },
  { name: "Emeka Nwosu" },
  { name: "Blessing Adeyemi" },
];

const CASES = [
  { id: "CASE-2391", trigger: "High velocity (24 txns/24h)", sev: "High" },
  { id: "CASE-2387", trigger: "Sanctions name match", sev: "Critical" },
  { id: "CASE-2385", trigger: "Structured deposits \u20A64.99M \u00D73", sev: "High" },
  { id: "CASE-2382", trigger: "New device + large withdrawal", sev: "Medium" },
  { id: "CASE-2378", trigger: "Mixer-tainted UTXO", sev: "Critical" },
  { id: "CASE-2372", trigger: "Incomplete source-of-funds", sev: "Low" },
];

const SANCTIONS_LISTS = ["OFAC SDN", "UN Consolidated", "EU Sanctions", "UK HMT", "Nigerian SCUML", "PEP \u2014 Worldcheck"];

const SAR_REPORTS = [
  ["SAR-1042", "SAR", "USR-10047", "Tunde B.", "Mar 12", "NFIU-298471"],
  ["STR-2031", "STR", "USR-10052", "Adaeze O.", "Mar 10", "NFIU-298440"],
  ["SAR-1041", "SAR", "USR-10044", "Tunde B.", "Mar 8", "NFIU-298401"],
];

const TABS = ["Cases", "Sanctions", "SAR/STR", "Travel rule"] as const;
type Tab = (typeof TABS)[number];

function sevStyle(sev: string) {
  if (sev === "Critical") return { background: "var(--c-down-soft)", color: "var(--c-down)" };
  if (sev === "High") return { background: "var(--c-warn-soft)", color: "var(--c-warn)" };
  return { background: "var(--c-surface-3)", color: "var(--c-text-3)" };
}

export default function AdminCompliance() {
  const [tab, setTab] = useState<Tab>("Cases");
  const [reviewCase, setReviewCase] = useState<typeof CASES[number] | null>(null);
  const [reviewUserIdx, setReviewUserIdx] = useState<number>(0);
  const [resolving, setResolving] = useState<string | null>(null);

  async function handleResolve(caseId: string, action: "escalate" | "dismiss" | "close") {
    setResolving(action);
    try {
      await fetch(`/api/admin/compliance/${caseId}/${action}`, { method: "POST" });
      const labels: Record<string, string> = { escalate: "Escalated", dismiss: "Dismissed", close: "Closed" };
      toast.success(`Case ${caseId} ${labels[action]}`);
      setReviewCase(null);
    } catch {
      toast.error("Action failed. Please try again.");
    } finally {
      setResolving(null);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="text-[32px] font-semibold tracking-[-0.03em] font-display" style={{ color: "var(--c-text)" }}>Compliance</h1>
          <p style={{ marginTop: 6, fontSize: 13, color: "var(--c-text-3)" }}>AML cases, sanctions screening, regulatory reporting</p>
        </div>
        <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 10, background: "var(--c-surface-2)", border: "1px solid var(--c-line)" }}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "4px 14px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", transition: "all 0.15s", whiteSpace: "nowrap",
                ...(tab === t
                  ? { background: "var(--c-surface)", color: "var(--c-text)", boxShadow: "0 1px 2px rgba(0,0,0,.08)" }
                  : { background: "transparent", color: "var(--c-text-2)" }),
              }}
            >{t}</button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {([
          ["Open cases", "12", "3 high priority"],
          ["SARs filed (30d)", "4", "SLA 100%"],
          ["Sanctions hits (24h)", "2", "1 cleared, 1 pending"],
          ["STR threshold", "\u20A65M", "Per CBN guideline"],
        ] as const).map(([k, v, s]) => (
          <div key={k} className="ds-card" style={{ padding: "20px 20px 16px" }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-text-3)" }}>{k}</div>
            <div style={{ fontSize: 24, fontWeight: 600, marginTop: 6, fontVariantNumeric: "tabular-nums", color: "var(--c-text)" }}>{v}</div>
            <div style={{ fontSize: 12, marginTop: 2, color: "var(--c-text-3)" }}>{s}</div>
          </div>
        ))}
      </div>

      {/* Cases tab */}
      {tab === "Cases" && (
        <div className="ds-card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--c-line)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)" }}>Open cases</h3>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--c-line)" }}>
                {["Case", "User", "Trigger", "Severity", "Assignee", "Opened", "Status", ""].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-text-3)", background: "var(--c-surface-2)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CASES.map((c, i) => {
                const ss = sevStyle(c.sev);
                return (
                  <tr key={c.id} style={{ borderBottom: "1px solid var(--c-line)", cursor: "pointer" }} className="hover:bg-[var(--c-surface-2)] transition-colors" onClick={() => window.openFlow("caseReview", { kase: { ...c, user: USERS[i].name, opened: `${i + 1}d ago` } })}>
                    <td style={{ padding: "10px 16px", fontFamily: "monospace", fontSize: 11, color: "var(--c-text-3)" }}>{c.id}</td>
                    <td style={{ padding: "10px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--c-surface-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "var(--c-text)" }}>
                          {USERS[i].name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span style={{ fontSize: 13 }}>{USERS[i].name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 16px" }}>{c.trigger}</td>
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{ display: "inline-flex", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, ...ss }}>{c.sev}</span>
                    </td>
                    <td style={{ padding: "10px 16px", color: "var(--c-text-3)" }}>Tunde B.</td>
                    <td style={{ padding: "10px 16px", color: "var(--c-text-3)" }}>{i + 1}d ago</td>
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "var(--c-warn-soft)", color: "var(--c-warn)" }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--c-warn)" }} />Pending
                      </span>
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <button className="h-7 px-3 rounded-md border border-[var(--c-line)] text-[12px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors" onClick={(e) => { e.stopPropagation(); window.openFlow("caseReview", { kase: { ...c, user: USERS[i].name, opened: `${i + 1}d ago` } }); }}>Review</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Sanctions tab */}
      {tab === "Sanctions" && (
        <div className="ds-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)", marginBottom: 16 }}>Sanctions screening</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {SANCTIONS_LISTS.map((l) => (
              <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: "var(--c-up-soft)", color: "var(--c-up)" }}>
                <CheckCircle2 className="size-3" />{l}
              </span>
            ))}
          </div>
          <div style={{ fontSize: 12, marginTop: 14, color: "var(--c-text-3)" }}>Lists refreshed every 24h &middot; last sync: 2 hours ago</div>
        </div>
      )}

      {/* SAR/STR tab */}
      {tab === "SAR/STR" && (
        <div className="ds-card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--c-line)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)" }}>Filed reports</h3>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--c-line)" }}>
                {["Report", "Type", "Subject", "Filed by", "Filed on", "NFIU ref"].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-text-3)", background: "var(--c-surface-2)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAR_REPORTS.map((r) => (
                <tr key={r[0]} style={{ borderBottom: "1px solid var(--c-line)" }} className="hover:bg-[var(--c-surface-2)] transition-colors">
                  {r.map((c, i) => (
                    <td key={i} style={{ padding: "10px 16px", ...(i === 5 ? { fontFamily: "monospace" } : {}) }}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Travel rule tab */}
      {tab === "Travel rule" && (
        <div className="ds-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)", marginBottom: 12 }}>Travel rule (FATF)</h3>
          <div style={{ fontSize: 13, color: "var(--c-text-3)", lineHeight: 1.6 }}>
            All transfers &ge; &nbsp;\u20A61,000,000 enrich originator + beneficiary metadata via Sumsub Travel Rule. Coverage: 99.4% (last 30d).
          </div>
        </div>
      )}
      {/* ── Case review modal ── */}
      {reviewCase && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)", padding: 20 }} onClick={() => setReviewCase(null)}>
          <div style={{ background: "var(--c-surface)", borderRadius: 20, border: "1px solid var(--c-line)", maxWidth: 520, width: "100%", maxHeight: "90vh", overflow: "auto", boxShadow: "var(--sh-3)", animation: "modalIn .22s cubic-bezier(.2,.7,.2,1)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--c-line)" }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "var(--c-text)" }}>{reviewCase.id}</span>
              <button onClick={() => setReviewCase(null)} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid var(--c-line)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--c-text)" }}><X className="size-4" /></button>
            </div>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--c-surface-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--c-text)" }}>
                  {USERS[reviewUserIdx].name.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--c-text)" }}>{USERS[reviewUserIdx].name}</div>
                  <div style={{ fontSize: 12, color: "var(--c-text-3)" }}>Subject of case</div>
                </div>
              </div>
              {[
                ["Case ID", reviewCase.id],
                ["Trigger", reviewCase.trigger],
                ["Severity", reviewCase.sev],
                ["Status", "Pending review"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, paddingBottom: 12, borderBottom: "1px solid var(--c-line)" }}>
                  <span style={{ color: "var(--c-text-3)" }}>{k}</span>
                  <span style={{ color: "var(--c-text)", fontWeight: k === "Severity" ? 600 : 400 }}>{v}</span>
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 6 }}>Notes</label>
                <textarea
                  placeholder="Add investigation notes…"
                  rows={3}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--c-line)", borderRadius: 10, background: "var(--c-surface-2)", color: "var(--c-text)", fontSize: 13, resize: "vertical", outline: "none" }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, padding: "12px 20px", borderTop: "1px solid var(--c-line)", justifyContent: "flex-end" }}>
              <button
                disabled={resolving !== null}
                onClick={() => handleResolve(reviewCase.id, "dismiss")}
                style={{ height: 36, padding: "0 14px", borderRadius: 10, border: "1px solid var(--c-line)", background: "transparent", fontSize: 13, fontWeight: 500, color: "var(--c-text-2)", cursor: "pointer", opacity: resolving ? 0.5 : 1 }}
              >{resolving === "dismiss" ? "Dismissing…" : "Dismiss"}</button>
              <button
                disabled={resolving !== null}
                onClick={() => handleResolve(reviewCase.id, "escalate")}
                style={{ height: 36, padding: "0 14px", borderRadius: 10, border: "1px solid var(--c-warn)", background: "var(--c-warn-soft)", fontSize: 13, fontWeight: 600, color: "var(--c-warn)", cursor: "pointer", opacity: resolving ? 0.5 : 1 }}
              >{resolving === "escalate" ? "Escalating…" : "Escalate"}</button>
              <button
                disabled={resolving !== null}
                onClick={() => handleResolve(reviewCase.id, "close")}
                style={{ height: 36, padding: "0 14px", borderRadius: 10, border: "none", background: "var(--c-lime-500)", fontSize: 13, fontWeight: 600, color: "var(--c-onyx-900)", cursor: "pointer", opacity: resolving ? 0.5 : 1 }}
              >{resolving === "close" ? "Closing…" : "Close case"}</button>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{"@keyframes modalIn { from { opacity:0; transform:scale(.96); } to { opacity:1; transform:scale(1); } }"}</style>
    </div>

  );
}
