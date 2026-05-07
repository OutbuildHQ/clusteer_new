"use client";

import { Plus, MoreHorizontal } from "lucide-react";

/* ── inline mock data ── */
const STAFF = [
  { name: "Emeka Nwosu", role: "Admin", email: "emeka@clusteer.com", twoFa: true, lastActive: "Just now" },
  { name: "Tunde Bakare", role: "Compliance", email: "tunde@clusteer.com", twoFa: true, lastActive: "12m ago" },
  { name: "Adaeze Okonkwo", role: "Compliance", email: "adaeze@clusteer.com", twoFa: true, lastActive: "1h ago" },
  { name: "Fatima Yusuf", role: "Support", email: "fatima@clusteer.com", twoFa: false, lastActive: "3h ago" },
  { name: "Chinedu Eze", role: "Finance", email: "chinedu@clusteer.com", twoFa: true, lastActive: "5h ago" },
  { name: "Blessing Adeyemi", role: "Support", email: "blessing@clusteer.com", twoFa: true, lastActive: "1d ago" },
  { name: "Ibrahim Musa", role: "Read-only", email: "ibrahim@clusteer.com", twoFa: false, lastActive: "2d ago" },
];

const PERMISSIONS: [string, ...number[]][] = [
  ["Approve KYC", 1, 1, 0, 0, 0],
  ["Suspend users", 1, 1, 1, 0, 0],
  ["Manual transactions", 1, 0, 0, 1, 0],
  ["Edit fees", 1, 0, 0, 1, 0],
  ["Rotate keys", 1, 0, 0, 0, 0],
  ["View audit log", 1, 1, 0, 1, 1],
  ["Publish content", 1, 0, 0, 0, 0],
  ["Generate reports", 1, 1, 0, 1, 1],
];

const ROLES = ["Admin", "Compliance", "Support", "Finance", "Read-only"];

export default function AdminStaff() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--c-text)", letterSpacing: "-0.02em" }}>Staff &amp; roles</h1>
        <button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[var(--c-lime-500)] text-[var(--c-onyx-900)] text-[13px] font-semibold hover:opacity-90 transition-opacity">
          <Plus className="size-3.5" />Invite staff
        </button>
      </div>

      {/* Staff table */}
      <div className="ds-card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--c-line)" }}>
              {["Name", "Role", "Email", "2FA", "Last active", ""].map((h) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-text-3)", background: "var(--c-surface-2)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STAFF.map((s) => (
              <tr key={s.email} style={{ borderBottom: "1px solid var(--c-line)" }} className="hover:bg-[var(--c-surface-2)] transition-colors">
                <td style={{ padding: "10px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--c-surface-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "var(--c-text)" }}>
                      {s.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</span>
                  </div>
                </td>
                <td style={{ padding: "10px 16px" }}>
                  <span style={{ display: "inline-flex", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "var(--c-surface-3)", color: "var(--c-text-2)" }}>{s.role}</span>
                </td>
                <td style={{ padding: "10px 16px", fontFamily: "monospace", fontSize: 12, color: "var(--c-text-3)" }}>{s.email}</td>
                <td style={{ padding: "10px 16px" }}>
                  {s.twoFa ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "var(--c-up-soft)", color: "var(--c-up)" }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--c-up)" }} />Active
                    </span>
                  ) : (
                    <span style={{ display: "inline-flex", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "var(--c-warn-soft)", color: "var(--c-warn)" }}>Off</span>
                  )}
                </td>
                <td style={{ padding: "10px 16px", color: "var(--c-text-3)" }}>{s.lastActive}</td>
                <td style={{ padding: "10px 16px" }}>
                  <button style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, border: "none", background: "transparent", color: "var(--c-text-3)", cursor: "pointer" }}>
                    <MoreHorizontal className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Roles & permissions matrix */}
      <div className="ds-card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)", marginBottom: 16 }}>Roles &amp; permissions</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--c-line)" }}>
              <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-text-3)" }}>Permission</th>
              {ROLES.map((r) => (
                <th key={r} style={{ padding: "10px 16px", textAlign: "center", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-text-3)" }}>{r}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERMISSIONS.map((row) => (
              <tr key={row[0] as string} style={{ borderBottom: "1px solid var(--c-line)" }}>
                <td style={{ padding: "10px 16px", color: "var(--c-text)" }}>{row[0]}</td>
                {(row.slice(1) as number[]).map((v, i) => (
                  <td key={i} style={{ padding: "10px 16px", textAlign: "center", color: v ? "var(--c-up)" : "var(--c-text-3)", fontSize: 14 }}>
                    {v ? "\u2713" : "\u2014"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
