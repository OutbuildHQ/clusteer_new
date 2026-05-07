"use client";

import { Download, Plus, MoreHorizontal } from "lucide-react";

/* ── inline mock data ── */
const FEE_SCHEDULE = [
  { type: "Buy",      asset: "USDT", method: "Bank transfer", fee: "0.50%", min: "\u20A6500" },
  { type: "Sell",     asset: "USDT", method: "Bank transfer", fee: "0.50%", min: "\u20A6500" },
  { type: "Buy",      asset: "BTC",  method: "On-chain",      fee: "0.60%", min: "\u20A61,000" },
  { type: "Sell",     asset: "BTC",  method: "On-chain",      fee: "0.60%", min: "\u20A61,000" },
  { type: "Withdraw", asset: "NGN",  method: "Bank transfer", fee: "Flat \u20A650", min: "\u20A650" },
  { type: "Withdraw", asset: "USDT", method: "TRC-20",        fee: "1 USDT",  min: "1 USDT" },
  { type: "Send",     asset: "All",  method: "Internal",      fee: "Free",    min: "\u20A60" },
];

const SPREAD_ORACLES = [
  ["Buy spread", "+0.40%"],
  ["Sell spread", "-0.35%"],
  ["NGN reference", "Binance P2P median"],
  ["Refresh interval", "15s"],
  ["Slippage tolerance", "0.50%"],
  ["Failover oracle", "Bybit P2P"],
];

export default function AdminFees() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--c-text)", letterSpacing: "-0.02em" }}>Fee schedule</h1>
          <p style={{ marginTop: 6, fontSize: 13, color: "var(--c-text-3)" }}>Live fees applied to user transactions</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-[var(--c-line)] text-[13px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors">
            <Download className="size-3.5 text-[var(--c-text-3)]" />Export
          </button>
          <button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[var(--c-lime-500)] text-[var(--c-onyx-900)] text-[13px] font-semibold hover:opacity-90 transition-opacity">
            <Plus className="size-3.5" />New rule
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {([
          ["Effective fee (24h)", "0.51%", "+0.02% vs 7d avg"],
          ["Fee revenue (24h)", "\u20A64.82M", "+12% WoW"],
          ["Active rules", "7", "Last edit 3d ago"],
        ] as const).map(([k, v, s]) => (
          <div key={k} className="ds-card" style={{ padding: "20px 20px 16px" }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-text-3)" }}>{k}</div>
            <div style={{ fontSize: 28, fontWeight: 600, marginTop: 6, fontVariantNumeric: "tabular-nums", color: "var(--c-text)" }}>{v}</div>
            <div style={{ fontSize: 12, marginTop: 2, color: "var(--c-text-3)" }}>{s}</div>
          </div>
        ))}
      </div>

      {/* Fee schedule table */}
      <div className="ds-card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--c-line)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)" }}>Fee schedule</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--c-line)" }}>
              {["Type", "Asset", "Method", "Fee", "Min", "Status", ""].map((h) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-text-3)", background: "var(--c-surface-2)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FEE_SCHEDULE.map((f, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--c-line)" }} className="hover:bg-[var(--c-surface-2)] transition-colors">
                <td style={{ padding: "10px 16px", fontWeight: 600 }}>{f.type}</td>
                <td style={{ padding: "10px 16px" }}>{f.asset}</td>
                <td style={{ padding: "10px 16px" }}>{f.method}</td>
                <td style={{ padding: "10px 16px", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{f.fee}</td>
                <td style={{ padding: "10px 16px", fontVariantNumeric: "tabular-nums", color: "var(--c-text-3)" }}>{f.min}</td>
                <td style={{ padding: "10px 16px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "var(--c-up-soft)", color: "var(--c-up)" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--c-up)" }} />Active
                  </span>
                </td>
                <td style={{ padding: "10px 16px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="h-7 px-3 rounded-md border border-[var(--c-line)] text-[12px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors">Edit</button>
                    <button style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, border: "none", background: "transparent", color: "var(--c-text-3)", cursor: "pointer" }}>
                      <MoreHorizontal className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Spread & price oracles */}
      <div className="ds-card" style={{ padding: "20px" }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)", marginBottom: 16 }}>Spread &amp; price oracles</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {SPREAD_ORACLES.map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "var(--c-surface-2)", borderRadius: 8 }}>
              <span style={{ fontSize: 13, color: "var(--c-text)" }}>{k}</span>
              <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600, color: "var(--c-text)" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
