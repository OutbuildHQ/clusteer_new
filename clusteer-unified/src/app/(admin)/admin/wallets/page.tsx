"use client";

import { useState } from "react";
import { Download, RefreshCw, CheckCircle2, MoreHorizontal } from "lucide-react";

/* ── inline mock data ── */
const WALLETS = [
  { sym: "USDT", chain: "Tron (TRC-20)", hot: 842_100, cold: 6_200_000, hotNgn: 1_355_781_000, coldNgn: 9_982_000_000, threshold: 500_000, addr: "TXqH...v4Kz" },
  { sym: "BTC",  chain: "Bitcoin",       hot: 12.48,   cold: 84.2,      hotNgn: 810_480_000,    coldNgn: 5_472_900_000,  threshold: 5,       addr: "bc1q...m8fe" },
  { sym: "ETH",  chain: "Ethereum",      hot: 210.5,   cold: 1_420,     hotNgn: 525_250_000,    coldNgn: 3_550_000_000,  threshold: 100,     addr: "0xAb...3eD1" },
  { sym: "USDC", chain: "Ethereum",      hot: 320_000, cold: 1_800_000, hotNgn: 515_200_000,    coldNgn: 2_898_000_000,  threshold: 200_000, addr: "0x7c...f2A9" },
  { sym: "BNB",  chain: "BSC",           hot: 480,     cold: 2_100,     hotNgn: 192_000_000,    coldNgn: 840_000_000,    threshold: 200,     addr: "0x3e...a1B7" },
];

const TABS = ["All", "Hot", "Cold", "Low"] as const;
type Tab = (typeof TABS)[number];

function fmt(n: number) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toFixed(2);
}
function ngn(n: number) { return "\u20A6" + fmt(n); }
function num(n: number, d = 2) { return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d }); }

const totalReserves = WALLETS.reduce((a, b) => a + b.hotNgn + b.coldNgn, 0);
const userLiabilities = totalReserves * 0.94;

export default function AdminWalletPool() {
  const [tab, setTab] = useState<Tab>("All");

  const filtered = WALLETS.filter((w) => {
    if (tab === "Hot") return true;
    if (tab === "Cold") return true;
    if (tab === "Low") return w.hot < w.threshold;
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--c-text)", letterSpacing: "-0.02em" }}>Wallet pool</h1>
          <p style={{ marginTop: 6, fontSize: 13, color: "var(--c-text-3)" }}>Custodial reserves across hot, warm, and cold wallets</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-[var(--c-line)] text-[13px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors">
            <Download className="size-3.5 text-[var(--c-text-3)]" />Reserve attestation
          </button>
          <button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[var(--c-lime-500)] text-[var(--c-onyx-900)] text-[13px] font-semibold hover:opacity-90 transition-opacity">
            <RefreshCw className="size-3.5" />Rebalance
          </button>
        </div>
      </div>

      {/* Reserve stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {([
          ["Total reserves", "\u20A6" + fmt(totalReserves)],
          ["User liabilities", "\u20A6" + fmt(userLiabilities)],
          ["Reserve ratio", "106.4%"],
        ] as const).map(([k, v]) => (
          <div key={k} className="ds-card" style={{ padding: "20px 20px 16px" }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-text-3)" }}>{k}</div>
            <div style={{ fontSize: 30, fontWeight: 600, marginTop: 6, fontVariantNumeric: "tabular-nums", color: "var(--c-text)" }}>{v}</div>
            <div style={{ fontSize: 12, marginTop: 4, color: "var(--c-up)", display: "flex", alignItems: "center", gap: 4 }}>
              <CheckCircle2 className="size-3" />Fully reserved
            </div>
          </div>
        ))}
      </div>

      {/* Wallet inventory table */}
      <div className="ds-card" style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid var(--c-line)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)" }}>Wallet inventory</h3>
          <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 10, background: "var(--c-surface-2)", border: "1px solid var(--c-line)" }}>
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "4px 12px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  border: "none",
                  transition: "all 0.15s",
                  ...(tab === t
                    ? { background: "var(--c-surface)", color: "var(--c-text)", boxShadow: "0 1px 2px rgba(0,0,0,.08)" }
                    : { background: "transparent", color: "var(--c-text-2)" }),
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--c-line)" }}>
              {["Asset", "Hot", "Cold", "Threshold", "Hot address", "Status", ""].map((h) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-text-3)", background: "var(--c-surface-2)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => {
              const low = w.hot < w.threshold;
              return (
                <tr key={w.sym + w.chain} style={{ borderBottom: "1px solid var(--c-line)" }} className="hover:bg-[var(--c-surface-2)] transition-colors">
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--c-surface-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "var(--c-text)" }}>{w.sym.slice(0, 2)}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{w.sym}</div>
                        <div style={{ fontSize: 11, color: "var(--c-text-3)" }}>{w.chain}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontVariantNumeric: "tabular-nums" }}>{num(w.hot, 2)} <span style={{ color: "var(--c-text-3)" }}>({ngn(w.hotNgn)})</span></td>
                  <td style={{ padding: "12px 16px", fontVariantNumeric: "tabular-nums" }}>{num(w.cold, 2)} <span style={{ color: "var(--c-text-3)" }}>({ngn(w.coldNgn)})</span></td>
                  <td style={{ padding: "12px 16px", fontVariantNumeric: "tabular-nums", color: "var(--c-text-3)" }}>{num(w.threshold, 2)}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: 11, color: "var(--c-text-3)" }}>{w.addr}</td>
                  <td style={{ padding: "12px 16px" }}>
                    {low ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "var(--c-warn-soft)", color: "var(--c-warn)" }}>Low</span>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "var(--c-up-soft)", color: "var(--c-up)" }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--c-up)" }} />Active
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <button className="h-7 px-3 rounded-md border border-[var(--c-line)] text-[12px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors">Top up</button>
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
