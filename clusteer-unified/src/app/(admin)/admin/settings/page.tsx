"use client";

import { useState } from "react";
import { toast } from "sonner";

/* ── inline mock data for the 2x2 grid ── */
const WITHDRAWAL_LIMITS = [
  ["Tier 1 daily", "\u20A6300,000"],
  ["Tier 2 daily", "\u20A65,000,000"],
  ["Tier 3 daily", "\u20A620,000,000"],
  ["Single tx max", "\u20A65,000,000"],
];

const APPROVAL_THRESHOLDS = [
  ["Auto-approve <", "\u20A6500,000"],
  ["Manual review \u2265", "\u20A65,000,000"],
  ["Dual approval \u2265", "\u20A610,000,000"],
  ["Cooling period (new device)", "24 hours"],
];

const PROVIDERS = [
  ["Paystack (NGN)", "Connected"],
  ["NIBSS", "Connected"],
  ["Sumsub KYC", "Connected"],
  ["Chainalysis", "Connected"],
  ["Fireblocks (custody)", "Connected"],
  ["Twilio SMS", "Connected"],
];

const MAINTENANCE_TOGGLES = [
  "Pause deposits",
  "Pause withdrawals",
  "Pause trading",
  "Read-only mode",
];

export default function AdminSettings() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({});

  const handleToggle = (key: string) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 className="text-[32px] font-semibold tracking-[-0.03em] font-display" style={{ color: "var(--c-text)" }}>System settings</h1>
        <button
          onClick={() => toast.success("Settings saved")}
          className="flex items-center h-9 px-4 rounded-lg text-[13px] font-semibold transition-colors"
          style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}
        >
          Save changes
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Withdrawal limits */}
        <div className="ds-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)", marginBottom: 16 }}>Withdrawal limits</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {WITHDRAWAL_LIMITS.map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ fontSize: 13, color: "var(--c-text)" }}>{k}</label>
                <input
                  defaultValue={v}
                  style={{
                    maxWidth: 160, textAlign: "right", padding: "6px 12px", borderRadius: 8,
                    border: "1px solid var(--c-line)", background: "var(--c-surface)", color: "var(--c-text)",
                    fontSize: 13, fontVariantNumeric: "tabular-nums", outline: "none",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Approval thresholds */}
        <div className="ds-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)", marginBottom: 16 }}>Approval thresholds</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {APPROVAL_THRESHOLDS.map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ fontSize: 13, color: "var(--c-text)" }}>{k}</label>
                <input
                  defaultValue={v}
                  style={{
                    maxWidth: 160, textAlign: "right", padding: "6px 12px", borderRadius: 8,
                    border: "1px solid var(--c-line)", background: "var(--c-surface)", color: "var(--c-text)",
                    fontSize: 13, fontVariantNumeric: "tabular-nums", outline: "none",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Provider integrations */}
        <div className="ds-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)", marginBottom: 16 }}>Provider integrations</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {PROVIDERS.map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "var(--c-text)" }}>{k}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "var(--c-up-soft)", color: "var(--c-up)" }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--c-up)" }} />{v}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance */}
        <div className="ds-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)", marginBottom: 16 }}>Maintenance</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {MAINTENANCE_TOGGLES.map((k) => {
              const on = !!toggles[k];
              return (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--c-text)" }}>{k}</span>
                  <button
                    onClick={() => handleToggle(k)}
                    style={{
                      width: 42, height: 24, borderRadius: 999, position: "relative", border: "none", cursor: "pointer", transition: "background 0.2s",
                      background: on ? "var(--c-lime-500)" : "var(--c-surface-3)",
                    }}
                  >
                    <div style={{
                      position: "absolute", top: 2, left: on ? 20 : 2, width: 20, height: 20,
                      background: "#fff", borderRadius: "50%", transition: "left 0.2s",
                    }} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
