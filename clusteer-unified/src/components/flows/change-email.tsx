"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";

export function ChangeEmailFlow({ onClose }: { onClose: () => void }) {
	const [stage, setStage] = useState<"form" | "sent">("form");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const submit = async () => {
		setLoading(true);
		try {
			toast.success("Verification link sent to " + email);
			setStage("sent");
		} catch {
			toast.error("Failed to send verification");
		} finally {
			setLoading(false);
		}
	};

	if (stage === "sent") {
		return (
			<div style={{ textAlign: "center", padding: "20px 0" }}>
				<Mail size={48} style={{ color: "var(--c-lime-500)", margin: "0 auto 16px" }} />
				<h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-text)", margin: 0 }}>Check your inbox</h3>
				<p style={{ fontSize: 13, color: "var(--c-text-2)", marginTop: 8, lineHeight: 1.5 }}>
					We sent a verification link to <strong>{email}</strong>. Click it to confirm the change.
				</p>
				<Button onClick={onClose} className="mt-4" style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", fontWeight: 600 }}>Done</Button>
			</div>
		);
	}

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			<h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-text)", margin: 0 }}>Change email</h3>
			<p style={{ fontSize: 13, color: "var(--c-text-2)", margin: 0 }}>We'll send a verification link to your new email address.</p>

			<div>
				<label style={{ fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, display: "block" }}>New email</label>
				<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
					style={{ width: "100%", height: 42, borderRadius: 10, border: "1.5px solid var(--c-line)", padding: "0 12px", fontSize: 14, color: "var(--c-text)", background: "var(--c-surface)" }} />
			</div>

			<div>
				<label style={{ fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, display: "block" }}>Confirm password</label>
				<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your current password"
					style={{ width: "100%", height: 42, borderRadius: 10, border: "1.5px solid var(--c-line)", padding: "0 12px", fontSize: 14, color: "var(--c-text)", background: "var(--c-surface)" }} />
			</div>

			<Button onClick={submit} disabled={!email.includes("@") || !password || loading}
				style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", fontWeight: 700, height: 44 }}>
				{loading ? "Sending..." : "Send verification link"}
			</Button>
		</div>
	);
}
