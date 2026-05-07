"use client";

import { useState } from "react";
import { Download, Flag, MoreHorizontal } from "lucide-react";

/* ── inline mock data ── */
const TXNS = [
  { id: "TXN-90481", user: { name: "Adaeze Okonkwo" }, type: "Buy", asset: "USDT", amount: 12_400, ngn: 19_964_000, status: "Completed", date: "Mar 14", when: "14:32" },
  { id: "TXN-90479", user: { name: "Tunde Bakare" }, type: "Sell", asset: "BTC", amount: 0.42, ngn: 27_300_000, status: "Pending", date: "Mar 14", when: "14:18" },
  { id: "TXN-90477", user: { name: "Chinedu Eze" }, type: "Withdraw", asset: "ETH", amount: 3.8, ngn: 9_500_000, status: "Completed", date: "Mar 14", when: "13:55" },
  { id: "TXN-90475", user: { name: "Fatima Yusuf" }, type: "Buy", asset: "USDC", amount: 5_000, ngn: 8_050_000, status: "Completed", date: "Mar 14", when: "13:42" },
  { id: "TXN-90473", user: { name: "Emeka Nwosu" }, type: "Send", asset: "BTC", amount: 1.2, ngn: 78_000_000, status: "Failed", date: "Mar 14", when: "13:28" },
  { id: "TXN-90471", user: { name: "Blessing Adeyemi" }, type: "Buy", asset: "USDT", amount: 50_000, ngn: 80_500_000, status: "Completed", date: "Mar 14", when: "13:10" },
  { id: "TXN-90469", user: { name: "Ibrahim Musa" }, type: "Sell", asset: "ETH", amount: 8.5, ngn: 21_250_000, status: "Pending", date: "Mar 14", when: "12:58" },
  { id: "TXN-90467", user: { name: "Ngozi Okafor" }, type: "Withdraw", asset: "BNB", amount: 24, ngn: 9_600_000, status: "Completed", date: "Mar 14", when: "12:44" },
  { id: "TXN-90465", user: { name: "Yemi Alade" }, type: "Buy", asset: "BTC", amount: 0.08, ngn: 5_200_000, status: "Completed", date: "Mar 14", when: "12:30" },
  { id: "TXN-90463", user: { name: "Olusegun Taiwo" }, type: "Send", asset: "USDT", amount: 2_800, ngn: 4_508_000, status: "Completed", date: "Mar 14", when: "12:15" },
  { id: "TXN-90461", user: { name: "Kemi Fashola" }, type: "Buy", asset: "ETH", amount: 1.5, ngn: 3_750_000, status: "Failed", date: "Mar 14", when: "11:58" },
  { id: "TXN-90459", user: { name: "Damilola Oni" }, type: "Sell", asset: "USDC", amount: 15_000, ngn: 24_150_000, status: "Completed", date: "Mar 14", when: "11:42" },
];

const STATUS_TABS = ["All", "Pending", "Failed", "Flagged", "Completed"] as const;
type StatusTab = (typeof STATUS_TABS)[number];

function ngn(n: number) {
  if (n >= 1e9) return "\u20A6" + (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return "\u20A6" + (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return "\u20A6" + (n / 1e3).toFixed(1) + "K";
  return "\u20A6" + n.toFixed(0);
}
function num(n: number, d = 4) { return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d }); }

function statusStyle(s: string) {
  if (s === "Completed") return { background: "var(--c-up-soft)", color: "var(--c-up)" };
  if (s === "Failed") return { background: "var(--c-down-soft)", color: "var(--c-down)" };
  return { background: "var(--c-warn-soft)", color: "var(--c-warn)" };
}

export default function AdminTxMonitor() {
  const [tab, setTab] = useState<StatusTab>("All");

  const list = TXNS.filter((t) => {
    if (tab === "All") return true;
    if (tab === "Flagged") return t.ngn > 3_000_000;
    return t.status === tab;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--c-text)", letterSpacing: "-0.02em" }}>Transaction monitor</h1>
          <p style={{ marginTop: 6, fontSize: 13, color: "var(--c-text-3)" }}>Live feed of customer transactions</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 10, background: "var(--c-surface-2)", border: "1px solid var(--c-line)" }}>
            {STATUS_TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", transition: "all 0.15s", whiteSpace: "nowrap",
                  ...(tab === t
                    ? { background: "var(--c-surface)", color: "var(--c-text)", boxShadow: "0 1px 2px rgba(0,0,0,.08)" }
                    : { background: "transparent", color: "var(--c-text-2)" }),
                }}
              >{t}</button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-[var(--c-line)] text-[13px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors">
            <Download className="size-3.5 text-[var(--c-text-3)]" />Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="ds-card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--c-line)" }}>
              {["ID", "User", "Type", "Asset", "Amount", "Value", "Status", "Time", ""].map((h) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-text-3)", background: "var(--c-surface-2)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.slice(0, 18).map((t) => {
              const flagged = t.ngn > 3_000_000;
              const ss = statusStyle(t.status);
              return (
                <tr key={t.id} style={{ borderBottom: "1px solid var(--c-line)", background: flagged ? "color-mix(in srgb, var(--c-warn-soft) 30%, transparent)" : "transparent" }} className="hover:bg-[var(--c-surface-2)] transition-colors">
                  <td style={{ padding: "10px 16px", fontFamily: "monospace", fontSize: 11, color: "var(--c-text-3)" }}>{t.id}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--c-surface-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "var(--c-text)" }}>
                        {t.user.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span style={{ fontSize: 13 }}>{t.user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 16px" }}>{t.type}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--c-surface-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700 }}>{t.asset.slice(0, 2)}</div>
                      {t.asset}
                    </div>
                  </td>
                  <td style={{ padding: "10px 16px", fontVariantNumeric: "tabular-nums" }}>{num(t.amount)}</td>
                  <td style={{ padding: "10px 16px", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                    {ngn(t.ngn)}
                    {flagged && (
                      <span style={{ marginLeft: 6, display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 600, background: "var(--c-warn-soft)", color: "var(--c-warn)" }}>
                        <Flag className="size-2.5" />High
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, ...ss }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: ss.color }} />{t.status}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px", color: "var(--c-text-3)" }}>{t.date} {t.when}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <button style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, border: "none", background: "transparent", color: "var(--c-text-3)", cursor: "pointer" }}>
                      <MoreHorizontal className="size-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
