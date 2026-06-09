"use client";

import { useState } from "react";
import { toast } from "sonner";

const ROLES: Record<string, string> = {
	Admin: "Full access to all tools and settings",
	Compliance: "KYC queue, AML cases, user freezes",
	Support: "Tickets, user lookup, read-only ops",
	Finance: "Fees, reports, settlement",
	"Read-only": "View dashboards, no actions",
};

export function InviteStaffFlow({ onClose }: { onClose: () => void }) {
	const [email, setEmail] = useState("");
	const [role, setRole] = useState("Support");

	const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

	function handleSend() {
		toast.success(`Invite sent to ${email} · ${role}`);
		onClose();
	}

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			<h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-text)", margin: 0 }}>Invite staff</h3>

			<div>
				<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 5 }}>Work email</label>
				<input
					value={email} onChange={(e) => setEmail(e.target.value)}
					placeholder="name@clusteer.ng" type="email"
					style={{ width: "100%", height: 38, padding: "0 12px", border: "1px solid var(--c-line)", borderRadius: 10, background: "var(--c-surface)", color: "var(--c-text)", fontSize: 13, outline: "none" }}
				/>
			</div>

			<div>
				<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 5 }}>Role</label>
				<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
					{Object.entries(ROLES).map(([r, desc]) => (
						<label
							key={r}
							style={{
								display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 12px", borderRadius: 10, cursor: "pointer",
								border: `1px solid ${role === r ? "var(--c-lime-500)" : "var(--c-line)"}`,
								background: role === r ? "color-mix(in srgb, var(--c-lime-500) 6%, transparent)" : "transparent",
							}}
						>
							<input type="radio" name="role" checked={role === r} onChange={() => setRole(r)} style={{ marginTop: 2 }} />
							<div>
								<div style={{ fontWeight: 600, fontSize: 13, color: "var(--c-text)" }}>{r}</div>
								<div style={{ fontSize: 11.5, color: "var(--c-text-3)", marginTop: 2 }}>{desc}</div>
							</div>
						</label>
					))}
				</div>
			</div>

			<div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 4 }}>
				<button onClick={onClose} style={{ height: 36, padding: "0 16px", borderRadius: 10, border: "1px solid var(--c-line)", background: "transparent", fontSize: 13, fontWeight: 500, color: "var(--c-text)", cursor: "pointer" }}>Cancel</button>
				<button onClick={handleSend} disabled={!ok} style={{ height: 36, padding: "0 16px", borderRadius: 10, border: "none", background: "var(--c-lime-500)", fontSize: 13, fontWeight: 600, color: "var(--c-onyx-900)", cursor: ok ? "pointer" : "not-allowed", opacity: ok ? 1 : 0.45 }}>Send invite</button>
			</div>
		</div>
	);
}
