"use client";

import { useState } from "react";
import { Download } from "lucide-react";

/* ── inline mock data ── */
const AUDIT = [
  { id: "AUD-8421", actor: "emeka@clusteer.com", action: "Approved KYC for USR-10047", target: "USR-10047", ip: "102.89.44.12", when: "2m ago" },
  { id: "AUD-8420", actor: "system", action: "Auto-flagged high-value transaction", target: "TXN-90479", ip: "—", when: "5m ago" },
  { id: "AUD-8419", actor: "tunde@clusteer.com", action: "Updated fee schedule (Buy BTC)", target: "FEE-003", ip: "105.112.78.91", when: "12m ago" },
  { id: "AUD-8418", actor: "system", action: "Rebalanced hot wallet (USDT TRC-20)", target: "WAL-001", ip: "—", when: "18m ago" },
  { id: "AUD-8417", actor: "adaeze@clusteer.com", action: "Suspended user for AML investigation", target: "USR-10052", ip: "102.89.44.15", when: "24m ago" },
  { id: "AUD-8416", actor: "emeka@clusteer.com", action: "Generated reserve attestation report", target: "RPT-042", ip: "102.89.44.12", when: "31m ago" },
  { id: "AUD-8415", actor: "system", action: "Sanctions list sync completed (OFAC SDN)", target: "SYS-SANCTIONS", ip: "—", when: "45m ago" },
  { id: "AUD-8414", actor: "tunde@clusteer.com", action: "Approved withdrawal \u20A618.5M", target: "TXN-90468", ip: "105.112.78.91", when: "52m ago" },
  { id: "AUD-8413", actor: "system", action: "Low hot wallet alert triggered (BTC)", target: "WAL-002", ip: "—", when: "1h ago" },
  { id: "AUD-8412", actor: "emeka@clusteer.com", action: "Published system banner (USDT promo)", target: "CMS-018", ip: "102.89.44.12", when: "1h ago" },
  { id: "AUD-8411", actor: "adaeze@clusteer.com", action: "Filed SAR-1042 with NFIU", target: "CASE-2391", ip: "102.89.44.15", when: "1h ago" },
  { id: "AUD-8410", actor: "system", action: "Backup completed (2.4 GB)", target: "SYS-BACKUP", ip: "—", when: "2h ago" },
  { id: "AUD-8409", actor: "tunde@clusteer.com", action: "Invited new staff member", target: "STAFF-011", ip: "105.112.78.91", when: "2h ago" },
  { id: "AUD-8408", actor: "system", action: "Rate oracle failover to Bybit P2P", target: "SYS-ORACLE", ip: "—", when: "3h ago" },
  { id: "AUD-8407", actor: "emeka@clusteer.com", action: "Adjusted account limits for Tier 3", target: "CFG-LIMITS", ip: "102.89.44.12", when: "3h ago" },
  { id: "AUD-8406", actor: "system", action: "Scheduled maintenance window created", target: "SYS-MAINT", ip: "—", when: "4h ago" },
  { id: "AUD-8405", actor: "adaeze@clusteer.com", action: "Rejected KYC submission", target: "USR-10058", ip: "102.89.44.15", when: "4h ago" },
  { id: "AUD-8404", actor: "tunde@clusteer.com", action: "Updated provider integration (Paystack)", target: "INT-PAYSTACK", ip: "105.112.78.91", when: "5h ago" },
  { id: "AUD-8403", actor: "system", action: "Daily compliance report generated", target: "RPT-041", ip: "—", when: "6h ago" },
  { id: "AUD-8402", actor: "emeka@clusteer.com", action: "Reset 2FA for USR-10044", target: "USR-10044", ip: "102.89.44.12", when: "7h ago" },
];

const FILTER_TABS = ["All", "Admin", "System"] as const;
type FilterTab = (typeof FILTER_TABS)[number];

export default function AdminAuditLog() {
  const [filter, setFilter] = useState<FilterTab>("All");

  const filtered = AUDIT.filter((a) => {
    if (filter === "Admin") return a.actor !== "system";
    if (filter === "System") return a.actor === "system";
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--c-text)", letterSpacing: "-0.02em" }}>Audit log</h1>
          <p style={{ marginTop: 6, fontSize: 13, color: "var(--c-text-3)" }}>Immutable record of admin &amp; system actions</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 10, background: "var(--c-surface-2)", border: "1px solid var(--c-line)" }}>
            {FILTER_TABS.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                style={{
                  padding: "4px 14px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", transition: "all 0.15s",
                  ...(filter === t
                    ? { background: "var(--c-surface)", color: "var(--c-text)", boxShadow: "0 1px 2px rgba(0,0,0,.08)" }
                    : { background: "transparent", color: "var(--c-text-2)" }),
                }}
              >{t}</button>
            ))}
          </div>
          <button
            onClick={() => {
              const rows = [["ID","Actor","Action","Target","IP","When"], ...filtered.slice(0,20).map(a=>[a.id,a.actor,a.action,a.target,a.ip,a.when])];
              const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = `audit-log-${new Date().toISOString().split("T")[0]}.csv`; a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-[var(--c-line)] text-[13px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors">
            <Download className="size-3.5 text-[var(--c-text-3)]" />Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="ds-card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--c-line)" }}>
              {["ID", "Actor", "Action", "Target", "IP", "When"].map((h, i) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: i === 5 ? "right" : "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-text-3)", background: "var(--c-surface-2)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 20).map((a) => (
              <tr key={a.id} style={{ borderBottom: "1px solid var(--c-line)" }} className="hover:bg-[var(--c-surface-2)] transition-colors">
                <td style={{ padding: "10px 16px", fontFamily: "monospace", fontSize: 11, color: "var(--c-text-3)" }}>{a.id}</td>
                <td style={{ padding: "10px 16px", fontFamily: "monospace", fontSize: 12, color: "var(--c-text)" }}>{a.actor}</td>
                <td style={{ padding: "10px 16px" }}>{a.action}</td>
                <td style={{ padding: "10px 16px", fontFamily: "monospace", fontSize: 11, color: "var(--c-text-3)" }}>{a.target}</td>
                <td style={{ padding: "10px 16px", fontFamily: "monospace", fontSize: 11, color: "var(--c-text-3)" }}>{a.ip}</td>
                <td style={{ padding: "10px 16px", color: "var(--c-text-3)", textAlign: "right" }}>{a.when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
