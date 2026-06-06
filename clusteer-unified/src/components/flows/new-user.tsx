"use client";

import { useState } from "react";
import { toast } from "sonner";

const TIERS = ["Tier 1", "Tier 2", "Tier 3"];

export function NewUserFlow({ onClose }: { onClose: () => void }) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [tier, setTier] = useState("Tier 1");
	const [invite, setInvite] = useState(true);

	const ok = name.trim() && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

	function handleSubmit() {
		toast.success(`${invite ? "Invite sent to" : "User created:"} ${email}`);
		onClose();
	}

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			<h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-text)", margin: 0 }}>New user</h3>

			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
				<div>
					<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 5 }}>Full name</label>
					<input
						value={name} onChange={(e) => setName(e.target.value)}
						placeholder="Jane Doe"
						style={{ width: "100%", height: 38, padding: "0 12px", border: "1px solid var(--c-line)", borderRadius: 10, background: "var(--c-surface)", color: "var(--c-text)", fontSize: 13, outline: "none" }}
					/>
				</div>
				<div>
					<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 5 }}>Phone</label>
					<input
						value={phone} onChange={(e) => setPhone(e.target.value)}
						placeholder="+234 …"
						style={{ width: "100%", height: 38, padding: "0 12px", border: "1px solid var(--c-line)", borderRadius: 10, background: "var(--c-surface)", color: "var(--c-text)", fontSize: 13, outline: "none" }}
					/>
				</div>
			</div>

			<div>
				<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 5 }}>Email</label>
				<input
					value={email} onChange={(e) => setEmail(e.target.value)}
					placeholder="name@email.com" type="email"
					style={{ width: "100%", height: 38, padding: "0 12px", border: "1px solid var(--c-line)", borderRadius: 10, background: "var(--c-surface)", color: "var(--c-text)", fontSize: 13, outline: "none" }}
				/>
			</div>

			<div>
				<label style={{ fontSize: 12, color: "var(--c-text-3)", display: "block", marginBottom: 5 }}>Starting tier</label>
				<div style={{ display: "flex", gap: 0, padding: 3, borderRadius: 10, background: "var(--c-surface-2)", border: "1px solid var(--c-line)" }}>
					{TIERS.map((t) => (
						<button
							key={t} onClick={() => setTier(t)}
							style={{
								flex: 1, padding: "6px 0", borderRadius: 7, fontSize: 12.5, fontWeight: 500, cursor: "pointer", border: "none", transition: "all 0.15s",
								...(tier === t
									? { background: "var(--c-surface)", color: "var(--c-text)", boxShadow: "0 1px 2px rgba(0,0,0,.08)" }
									: { background: "transparent", color: "var(--c-text-2)" }),
							}}
						>{t}</button>
					))}
				</div>
			</div>

			<label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", color: "var(--c-text)" }}>
				<input type="checkbox" checked={invite} onChange={(e) => setInvite(e.target.checked)} />
				<span>Email an invite to set their password</span>
			</label>

			<div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 4 }}>
				<button onClick={onClose} style={{ height: 36, padding: "0 16px", borderRadius: 10, border: "1px solid var(--c-line)", background: "transparent", fontSize: 13, fontWeight: 500, color: "var(--c-text)", cursor: "pointer" }}>Cancel</button>
				<button onClick={handleSubmit} disabled={!ok} style={{ height: 36, padding: "0 16px", borderRadius: 10, border: "none", background: "var(--c-lime-500)", fontSize: 13, fontWeight: 600, color: "var(--c-onyx-900)", cursor: ok ? "pointer" : "not-allowed", opacity: ok ? 1 : 0.45 }}>
					{invite ? "Send invite" : "Create user"}
				</button>
			</div>
		</div>
	);
}
