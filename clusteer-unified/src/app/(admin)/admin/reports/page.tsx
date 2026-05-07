"use client";

import { useState } from "react";
import { Download, ArrowUp } from "lucide-react";

/* ── inline mock data ── */
const KPI = [
  { label: "Volume (30d)", val: "\u20A64.82B", sub: "+18% MoM", up: true },
  { label: "Revenue (30d)", val: "\u20A624.1M", sub: "+22% MoM", up: true },
  { label: "New users", val: "3,481", sub: "+412 vs prev", up: true },
  { label: "Churn (30d)", val: "2.1%", sub: "-0.4%", up: true },
];

const VOLUME_DATA = [
  { sym: "USDT", val: 2_840 },
  { sym: "BTC", val: 1_120 },
  { sym: "ETH", val: 580 },
  { sym: "USDC", val: 210 },
  { sym: "BNB", val: 70 },
];
const maxVol = Math.max(...VOLUME_DATA.map((d) => d.val));

const SAVED_REPORTS = [
  ["CBN monthly digital asset report", "Feb 2026", "Mar 5", "2.4 MB"],
  ["NFIU compliance summary", "Q1 2026", "Mar 3", "1.1 MB"],
  ["Reserve attestation", "Mar 1, 2026", "Mar 1", "842 KB"],
  ["Revenue breakdown", "Feb 2026", "Mar 2", "620 KB"],
  ["User KYC status", "Mar 14, 2026", "Today", "1.8 MB"],
];

const PERIOD_TABS = ["Today", "7D", "30D", "90D", "YTD"] as const;
type Period = (typeof PERIOD_TABS)[number];

export default function AdminReports() {
  const [period, setPeriod] = useState<Period>("30D");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--c-text)", letterSpacing: "-0.02em" }}>Reports</h1>
          <p style={{ marginTop: 6, fontSize: 13, color: "var(--c-text-3)" }}>Daily, weekly, monthly business &amp; regulatory reports</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 10, background: "var(--c-surface-2)", border: "1px solid var(--c-line)" }}>
            {PERIOD_TABS.map((t) => (
              <button
                key={t}
                onClick={() => setPeriod(t)}
                style={{
                  padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", transition: "all 0.15s",
                  ...(period === t
                    ? { background: "var(--c-surface)", color: "var(--c-text)", boxShadow: "0 1px 2px rgba(0,0,0,.08)" }
                    : { background: "transparent", color: "var(--c-text-2)" }),
                }}
              >{t}</button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[var(--c-lime-500)] text-[var(--c-onyx-900)] text-[13px] font-semibold hover:opacity-90 transition-opacity">
            <Download className="size-3.5" />Generate report
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {KPI.map((k) => (
          <div key={k.label} className="ds-card" style={{ padding: "20px 20px 16px" }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-text-3)" }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 600, marginTop: 6, fontVariantNumeric: "tabular-nums", color: "var(--c-text)" }}>{k.val}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, marginTop: 4, color: "var(--c-up)" }}>
              <ArrowUp className="size-3" />{k.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Volume by asset bar chart */}
      <div className="ds-card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)", marginBottom: 20 }}>Volume by asset (30d)</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 220 }}>
          {VOLUME_DATA.map((d) => (
            <div key={d.sym} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 44, fontSize: 12, fontWeight: 600, color: "var(--c-text)", textAlign: "right" }}>{d.sym}</span>
              <div style={{ flex: 1, height: 28, background: "var(--c-surface-2)", borderRadius: 6, overflow: "hidden" }}>
                <div style={{ width: `${(d.val / maxVol) * 100}%`, height: "100%", background: "var(--c-lime-500)", borderRadius: 6, transition: "width 0.3s" }} />
              </div>
              <span style={{ width: 60, fontSize: 12, fontVariantNumeric: "tabular-nums", color: "var(--c-text-3)", textAlign: "right" }}>\u20A6{d.val}M</span>
            </div>
          ))}
        </div>
      </div>

      {/* Saved reports */}
      <div className="ds-card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--c-line)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)" }}>Saved reports</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--c-line)" }}>
              {["Report", "Period", "Generated", "Size", ""].map((h) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-text-3)", background: "var(--c-surface-2)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SAVED_REPORTS.map((r) => (
              <tr key={r[0]} style={{ borderBottom: "1px solid var(--c-line)" }} className="hover:bg-[var(--c-surface-2)] transition-colors">
                <td style={{ padding: "10px 16px", fontWeight: 600, fontSize: 13 }}>{r[0]}</td>
                <td style={{ padding: "10px 16px" }}>{r[1]}</td>
                <td style={{ padding: "10px 16px", color: "var(--c-text-3)" }}>{r[2]}</td>
                <td style={{ padding: "10px 16px", fontVariantNumeric: "tabular-nums", color: "var(--c-text-3)" }}>{r[3]}</td>
                <td style={{ padding: "10px 16px" }}>
                  <button className="flex items-center gap-1.5 h-7 px-3 rounded-md border border-[var(--c-line)] text-[12px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors">
                    <Download className="size-3" />Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
