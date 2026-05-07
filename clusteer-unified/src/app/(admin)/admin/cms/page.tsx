"use client";

import { Plus, MoreHorizontal } from "lucide-react";

/* ── inline mock data ── */
const CMS_CONTENT = [
  { id: "CMS-018", title: "Earn 2% cashback on USDT deposits", type: "Banner", audience: "All users", status: "Active", views: "12.4K", updated: "2h ago" },
  { id: "CMS-017", title: "Tron network maintenance Mar 20", type: "Alert", audience: "USDT holders", status: "Scheduled", views: "—", updated: "1d ago" },
  { id: "CMS-016", title: "New: instant NGN withdrawals", type: "Banner", audience: "Verified users", status: "Active", views: "8.1K", updated: "3d ago" },
  { id: "CMS-015", title: "How to upgrade to Tier 2", type: "FAQ", audience: "Tier 1 users", status: "Active", views: "24.8K", updated: "1w ago" },
  { id: "CMS-014", title: "Fee schedule update", type: "Announcement", audience: "All users", status: "Expired", views: "31.2K", updated: "2w ago" },
  { id: "CMS-013", title: "What are trading fees?", type: "FAQ", audience: "All users", status: "Active", views: "18.9K", updated: "3w ago" },
];

function statusStyle(s: string) {
  if (s === "Active") return { background: "var(--c-up-soft)", color: "var(--c-up)" };
  if (s === "Scheduled") return { background: "var(--c-warn-soft)", color: "var(--c-warn)" };
  return { background: "var(--c-surface-3)", color: "var(--c-text-3)" };
}

export default function AdminCMS() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--c-text)", letterSpacing: "-0.02em" }}>Content</h1>
          <p style={{ marginTop: 6, fontSize: 13, color: "var(--c-text-3)" }}>Banners, announcements, FAQ &mdash; visible to customers</p>
        </div>
        <button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[var(--c-lime-500)] text-[var(--c-onyx-900)] text-[13px] font-semibold hover:opacity-90 transition-opacity">
          <Plus className="size-3.5" />New content
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        {/* Content table */}
        <div className="ds-card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--c-line)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)" }}>All content</h3>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--c-line)" }}>
                {["Title", "Type", "Audience", "Status", "Views", "Updated", ""].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--c-text-3)", background: "var(--c-surface-2)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CMS_CONTENT.map((c) => {
                const ss = statusStyle(c.status);
                return (
                  <tr key={c.id} style={{ borderBottom: "1px solid var(--c-line)" }} className="hover:bg-[var(--c-surface-2)] transition-colors">
                    <td style={{ padding: "10px 16px", fontWeight: 600, fontSize: 13 }}>{c.title}</td>
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{ display: "inline-flex", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "var(--c-surface-3)", color: "var(--c-text-2)" }}>{c.type}</span>
                    </td>
                    <td style={{ padding: "10px 16px", color: "var(--c-text-3)" }}>{c.audience}</td>
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, ...ss }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: ss.color }} />{c.status}
                      </span>
                    </td>
                    <td style={{ padding: "10px 16px", fontVariantNumeric: "tabular-nums" }}>{c.views}</td>
                    <td style={{ padding: "10px 16px", color: "var(--c-text-3)" }}>{c.updated}</td>
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

        {/* Live banner preview */}
        <div className="ds-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text)", marginBottom: 16 }}>Live banner preview</h3>
          <div style={{ padding: 20, background: "var(--c-onyx-900)", color: "var(--c-cream)", borderRadius: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <span style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>NEW</span>
              Promo
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, marginTop: 8, lineHeight: 1.2 }}>
              Earn 2% cashback on USDT deposits
            </div>
            <div style={{ color: "rgba(244,241,234,0.6)", fontSize: 12, marginTop: 6 }}>
              Valid until Mar 31, 2026 &middot; No min
            </div>
            <button style={{ marginTop: 14, padding: "6px 14px", borderRadius: 8, border: "none", background: "var(--c-lime-500)", color: "var(--c-onyx-900)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Learn more
            </button>
          </div>
          <div style={{ fontSize: 12, marginTop: 14, color: "var(--c-text-3)", lineHeight: 1.6 }}>
            Targeting: All users<br />Placement: Dashboard top, Wallet header
          </div>
        </div>
      </div>
    </div>
  );
}
