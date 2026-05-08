"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download, Plus, MoreHorizontal } from "lucide-react";

/* ── fallback mock data ── */
const FALLBACK_FEE_SCHEDULE = [
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

type FeeRow = { type: string; asset: string; method: string; fee: string; min: string };

export default function AdminFees() {
  const queryClient = useQueryClient();

  // Track which row is being edited and what the edited fee value is
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editFeeValue, setEditFeeValue] = useState("");
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-fees"],
    queryFn: async () => {
      const res = await fetch("/api/admin/fees");
      if (!res.ok) throw new Error("Failed to fetch fees");
      return res.json();
    },
    staleTime: 60_000,
  });

  // Normalise API fee rows into the same shape as the fallback
  function normaliseFees(raw: any[]): FeeRow[] {
    return raw.map((r) => ({
      type:   r.type   ?? r.transactionType ?? "",
      asset:  r.asset  ?? r.currency        ?? "",
      method: r.method ?? r.paymentMethod   ?? "",
      fee:    r.fee    ?? (r.feeRate != null ? `${r.feeRate}%` : ""),
      min:    r.min    ?? (r.minFee  != null ? `\u20A6${r.minFee}` : ""),
    }));
  }

  const rawFees: any[] | null = data?.fees ?? null;
  const feeSchedule: FeeRow[] =
    Array.isArray(rawFees) && rawFees.length > 0
      ? normaliseFees(rawFees)
      : FALLBACK_FEE_SCHEDULE;

  function startEdit(i: number) {
    setEditingIndex(i);
    setEditFeeValue(feeSchedule[i].fee);
  }

  function cancelEdit() {
    setEditingIndex(null);
    setEditFeeValue("");
  }

  async function saveFee(i: number) {
    const row = feeSchedule[i];
    setSaving(true);
    try {
      const res = await fetch("/api/admin/fees", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: row.type, asset: row.asset, fee: editFeeValue }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Save failed");
      }
      toast.success(`Fee updated for ${row.type} ${row.asset}`);
      queryClient.invalidateQueries({ queryKey: ["admin-fees"] });
      setEditingIndex(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to save fee");
    } finally {
      setSaving(false);
    }
  }

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
          ["Active rules", String(feeSchedule.length), "Last edit 3d ago"],
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
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--c-line)" }}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} style={{ padding: "12px 16px" }}>
                      <div style={{ height: 14, borderRadius: 6, background: "var(--c-line)", animation: "pulse 1.5s ease-in-out infinite" }} />
                    </td>
                  ))}
                </tr>
              ))
              : feeSchedule.map((f, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--c-line)" }} className="hover:bg-[var(--c-surface-2)] transition-colors">
                  <td style={{ padding: "10px 16px", fontWeight: 600 }}>{f.type}</td>
                  <td style={{ padding: "10px 16px" }}>{f.asset}</td>
                  <td style={{ padding: "10px 16px" }}>{f.method}</td>
                  <td style={{ padding: "10px 16px", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                    {editingIndex === i ? (
                      <input
                        autoFocus
                        value={editFeeValue}
                        onChange={(e) => setEditFeeValue(e.target.value)}
                        style={{
                          width: 90, padding: "3px 8px", fontSize: 13, borderRadius: 6,
                          border: "1px solid var(--c-lime-500)", background: "var(--c-surface)",
                          color: "var(--c-text)", outline: "none",
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveFee(i);
                          if (e.key === "Escape") cancelEdit();
                        }}
                      />
                    ) : f.fee}
                  </td>
                  <td style={{ padding: "10px 16px", fontVariantNumeric: "tabular-nums", color: "var(--c-text-3)" }}>{f.min}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "var(--c-up-soft)", color: "var(--c-up)" }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--c-up)" }} />Active
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {editingIndex === i ? (
                        <>
                          <button
                            onClick={() => saveFee(i)}
                            disabled={saving}
                            className="h-7 px-3 rounded-md text-[12px] font-semibold transition-opacity"
                            style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", opacity: saving ? 0.6 : 1, cursor: saving ? "wait" : "pointer" }}
                          >
                            {saving ? "…" : "Save"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="h-7 px-3 rounded-md border border-[var(--c-line)] text-[12px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(i)}
                            className="h-7 px-3 rounded-md border border-[var(--c-line)] text-[12px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors"
                          >Edit</button>
                          <button style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, border: "none", background: "transparent", color: "var(--c-text-3)", cursor: "pointer" }}>
                            <MoreHorizontal className="size-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            }
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
