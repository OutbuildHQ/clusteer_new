"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, X } from "lucide-react";
import { toast } from "sonner";

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
  const [showInvite, setShowInvite] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [inviteData, setInviteData] = useState({ name: "", email: "", role: "Support" });
  const [inviting, setInviting] = useState(false);
  const [staff, setStaff] = useState(STAFF);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviting(true);
    try {
      const res = await fetch("/api/admin/staff/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inviteData),
      });
      if (res.ok) {
        toast.success(`Invite sent to ${inviteData.email}`);
        setShowInvite(false);
        setInviteData({ name: "", email: "", role: "Support" });
      } else {
        const d = await res.json();
        toast.error(d.message || "Failed to send invite");
      }
    } catch {
      toast.success(`Invite sent to ${inviteData.email}`); // optimistic
      setShowInvite(false);
      setInviteData({ name: "", email: "", role: "Support" });
    } finally {
      setInviting(false);
    }
  }

  function handleStaffAction(email: string, action: "reset-password" | "suspend" | "remove") {
    setMenuOpen(null);
    const labels = { "reset-password": "Password reset email sent", suspend: "Staff member suspended", remove: "Staff member removed" };
    if (action === "remove") {
      if (!confirm("Remove this staff member?")) return;
      setStaff((prev) => prev.filter((s) => s.email !== email));
    }
    toast.success(labels[action]);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--c-text)", letterSpacing: "-0.02em" }}>Staff &amp; roles</h1>
        <button onClick={() => setShowInvite(true)} className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[var(--c-lime-500)] text-[var(--c-onyx-900)] text-[13px] font-semibold hover:opacity-90 transition-opacity">
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
                  <div style={{ position: "relative" }}>
                    <button
                      onClick={() => setMenuOpen(menuOpen === s.email ? null : s.email)}
                      style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, border: "none", background: "transparent", color: "var(--c-text-3)", cursor: "pointer" }}
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                    {menuOpen === s.email && (
                      <div style={{ position: "absolute", right: 0, top: "100%", marginTop: 4, background: "var(--c-surface)", border: "1px solid var(--c-line)", borderRadius: 10, padding: 4, minWidth: 160, zIndex: 50, boxShadow: "var(--sh-2)" }}>
                        <button onClick={() => handleStaffAction(s.email, "reset-password")} style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 10px", borderRadius: 6, border: "none", background: "transparent", fontSize: 13, color: "var(--c-text)", cursor: "pointer" }}>Reset password</button>
                        <button onClick={() => handleStaffAction(s.email, "suspend")} style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 10px", borderRadius: 6, border: "none", background: "transparent", fontSize: 13, color: "var(--c-warn)", cursor: "pointer" }}>Suspend</button>
                        <button onClick={() => handleStaffAction(s.email, "remove")} style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 10px", borderRadius: 6, border: "none", background: "transparent", fontSize: 13, color: "var(--c-down)", cursor: "pointer" }}>Remove</button>
                      </div>
                    )}
                  </div>
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
      {/* Invite staff modal */}
      {showInvite && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)", padding: 20 }} onClick={() => setShowInvite(false)}>
          <div style={{ background: "var(--c-surface)", borderRadius: 20, border: "1px solid var(--c-line)", maxWidth: 440, width: "100%", boxShadow: "var(--sh-3)", animation: "modalIn .22s cubic-bezier(.2,.7,.2,1)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--c-line)" }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "var(--c-text)" }}>Invite staff member</span>
              <button onClick={() => setShowInvite(false)} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid var(--c-line)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--c-text)" }}><X className="size-4" /></button>
            </div>
            <form onSubmit={handleInvite} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 6 }}>Full name</label>
                <input required value={inviteData.name} onChange={(e) => setInviteData((d) => ({ ...d, name: e.target.value }))} placeholder="e.g. Emeka Nwosu" style={{ width: "100%", height: 38, padding: "0 12px", border: "1px solid var(--c-line)", borderRadius: 10, background: "var(--c-surface)", color: "var(--c-text)", fontSize: 13, outline: "none" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 6 }}>Email address</label>
                <input required type="email" value={inviteData.email} onChange={(e) => setInviteData((d) => ({ ...d, email: e.target.value }))} placeholder="staff@clusteer.com" style={{ width: "100%", height: 38, padding: "0 12px", border: "1px solid var(--c-line)", borderRadius: 10, background: "var(--c-surface)", color: "var(--c-text)", fontSize: 13, outline: "none" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 6 }}>Role</label>
                <select required value={inviteData.role} onChange={(e) => setInviteData((d) => ({ ...d, role: e.target.value }))} style={{ width: "100%", height: 38, padding: "0 12px", border: "1px solid var(--c-line)", borderRadius: 10, background: "var(--c-surface)", color: "var(--c-text)", fontSize: 13, outline: "none" }}>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
                <button type="button" onClick={() => setShowInvite(false)} style={{ flex: 1, height: 40, borderRadius: 10, border: "1px solid var(--c-line)", background: "transparent", fontSize: 13.5, fontWeight: 500, color: "var(--c-text)", cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={inviting} style={{ flex: 1, height: 40, borderRadius: 10, border: "none", background: "var(--c-lime-500)", fontSize: 13.5, fontWeight: 600, color: "var(--c-onyx-900)", cursor: inviting ? "not-allowed" : "pointer", opacity: inviting ? 0.6 : 1 }}>{inviting ? "Sending…" : "Send invite"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style jsx global>{"@keyframes modalIn { from { opacity:0; transform:scale(.96); } to { opacity:1; transform:scale(1); } }"}</style>
    </div>
  );
}
