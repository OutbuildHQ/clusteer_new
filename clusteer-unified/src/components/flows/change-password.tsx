"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, CheckCircle, Circle } from "lucide-react";

function strengthLevel(pw: string) {
	let score = 0;
	if (pw.length >= 8) score++;
	if (/[A-Z]/.test(pw)) score++;
	if (/[0-9]/.test(pw)) score++;
	if (/[^A-Za-z0-9]/.test(pw)) score++;
	return score;
}

const STRENGTH = ["Weak", "Fair", "Good", "Strong"];
const COLORS = ["var(--c-down)", "var(--c-warn)", "var(--c-info)", "var(--c-up)"];

export function ChangePasswordFlow({ onClose }: { onClose: () => void }) {
	const [current, setCurrent] = useState("");
	const [newPw, setNewPw] = useState("");
	const [confirm, setConfirm] = useState("");
	const [showCurrent, setShowCurrent] = useState(false);
	const [showNew, setShowNew] = useState(false);

	const level = strengthLevel(newPw);
	const match = newPw === confirm && confirm.length > 0;
	const valid = current.length >= 1 && level >= 2 && match;

	const submit = useMutation({
		mutationFn: async () => {
			const res = await fetch("/api/user/profile/update", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ currentPassword: current, newPassword: newPw }),
			});
			if (!res.ok) throw new Error("Password change failed");
		},
		onSuccess: () => { toast.success("Password updated"); onClose(); },
		onError: (err: Error) => toast.error(err.message),
	});

	const checks = [
		{ label: "At least 8 characters", ok: newPw.length >= 8 },
		{ label: "Has an uppercase letter", ok: /[A-Z]/.test(newPw) },
		{ label: "Has a number", ok: /[0-9]/.test(newPw) },
		{ label: "Has a symbol", ok: /[^A-Za-z0-9]/.test(newPw) },
	];

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			<h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-text)", margin: 0 }}>Change password</h3>

			<PasswordField label="Current password" value={current} onChange={setCurrent} show={showCurrent} toggle={() => setShowCurrent(!showCurrent)} />
			<PasswordField label="New password" value={newPw} onChange={setNewPw} show={showNew} toggle={() => setShowNew(!showNew)} />

			{newPw && (
				<>
					<div style={{ display: "flex", gap: 4 }}>
						{[0, 1, 2, 3].map((i) => (
							<div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i < level ? COLORS[level - 1] : "var(--c-surface-2)" }} />
						))}
					</div>
					<span style={{ fontSize: 12, fontWeight: 600, color: COLORS[Math.max(0, level - 1)] }}>{STRENGTH[Math.max(0, level - 1)]}</span>
				</>
			)}

			<PasswordField label="Confirm new password" value={confirm} onChange={setConfirm} show={showNew} toggle={() => setShowNew(!showNew)}
				error={confirm && !match ? "Passwords don't match" : undefined} />

			<div style={{ padding: 12, borderRadius: 10, background: "var(--c-surface-2)", display: "flex", flexDirection: "column", gap: 6 }}>
				{checks.map((c) => (
					<div key={c.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
						{c.ok ? <CheckCircle size={14} style={{ color: "var(--c-up)" }} /> : <Circle size={14} style={{ color: "var(--c-text-3)" }} />}
						<span style={{ color: c.ok ? "var(--c-text)" : "var(--c-text-3)" }}>{c.label}</span>
					</div>
				))}
			</div>

			<Button onClick={() => submit.mutate()} disabled={!valid || submit.isPending}
				style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", fontWeight: 700, height: 44 }}>
				{submit.isPending ? "Updating..." : "Update password"}
			</Button>
		</div>
	);
}

function PasswordField({ label, value, onChange, show, toggle, error }: {
	label: string; value: string; onChange: (v: string) => void; show: boolean; toggle: () => void; error?: string;
}) {
	return (
		<div>
			<label style={{ fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, display: "block" }}>{label}</label>
			<div style={{ display: "flex", alignItems: "center", height: 42, borderRadius: 10, border: `1.5px solid ${error ? "var(--c-down)" : "var(--c-line)"}`, background: "var(--c-surface)", paddingRight: 8 }}>
				<input type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)}
					style={{ flex: 1, border: "none", outline: "none", background: "transparent", padding: "0 12px", fontSize: 14, color: "var(--c-text)" }} />
				<button onClick={toggle} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}>
					{show ? <EyeOff size={16} style={{ color: "var(--c-text-3)" }} /> : <Eye size={16} style={{ color: "var(--c-text-3)" }} />}
				</button>
			</div>
			{error && <p style={{ fontSize: 11, color: "var(--c-down)", marginTop: 4 }}>{error}</p>}
		</div>
	);
}
