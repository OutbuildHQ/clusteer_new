"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import { useAuth } from "@/store/auth";

export default function TwoFactorPage() {
	const router = useRouter();
	const [code, setCode] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const { completeTwoFactor } = useAuth();

	async function submit() {
		if (code.length !== 6 || submitting) return;
		setSubmitting(true);

		try {
			const res = await fetch("/api/auth-firebase/verify-2fa", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ code }),
			});
			const data = await res.json();

			if (!res.ok || !data.status) {
				toast.error(data.message || "Invalid code. Please try again.");
				setCode("");
				return;
			}

			completeTwoFactor();
			toast.success("Verified. Welcome back.");
			window.location.href = "/dashboard";
		} catch {
			toast.error("Unable to connect. Please try again.");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div>
			{/* Eyebrow */}
			<div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10, fontWeight: 600, color: "var(--c-text-3)" }}>
				Two-factor authentication
			</div>
			<h1 className="font-display text-[28px] sm:text-[36px]" style={{ fontWeight: 600, lineHeight: 1.1, marginBottom: 10 }}>
				Enter your 6-digit code
			</h1>
			<div style={{ fontSize: 14.5, marginBottom: 28, lineHeight: 1.5, color: "var(--c-text-2)" }}>
				Open your authenticator app (Authy, Google Authenticator, 1Password) and copy the current code.
			</div>

			{/* Code input */}
			<div className="flex flex-col gap-2 mb-6">
				<div
					className="flex items-center gap-2 auth-input-wrap"
					style={{ padding: "0 14px", height: 46, border: "1px solid var(--c-line)", borderRadius: 10, background: "var(--c-bg)", transition: "box-shadow .15s, border-color .15s" }}
				>
					<Shield className="shrink-0" style={{ width: 18, height: 18, color: "var(--c-text-3)" }} />
					<input
						value={code}
						onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
						placeholder="000 000"
						autoFocus
						inputMode="numeric"
						className="flex-1 border-0 bg-transparent outline-none mono tabular-nums"
						style={{ fontSize: 14, color: "var(--c-text)", fontFamily: "var(--f-mono)" }}
					/>
				</div>
			</div>

			{/* Submit */}
			<button
				type="button"
				onClick={submit}
				disabled={code.length !== 6 || submitting}
				style={{
					height: 48, width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
					borderRadius: "var(--r-md)", border: "1px solid transparent", fontSize: 14.5, fontWeight: 600,
					background: "var(--c-lime-500)", color: "var(--c-onyx-900)", cursor: "pointer", fontFamily: "var(--f-sans)",
					opacity: (code.length !== 6 || submitting) ? 0.5 : 1,
				}}
			>
				{submitting ? (
					<span style={{ width: 18, height: 18, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block" }} />
				) : "Verify & sign in"}
			</button>

			{/* Recovery links */}
			<div className="flex items-center justify-center gap-3 mt-4" style={{ fontSize: 13 }}>
				<button
					type="button"
					onClick={() => toast.info("Backup-code flow coming soon")}
					style={{ color: "var(--c-text-3)", cursor: "pointer", background: "none", fontFamily: "var(--f-sans)" }}
				>
					Use a backup code
				</button>
				<span style={{ color: "var(--c-text-3)" }}>&middot;</span>
				<button
					type="button"
					onClick={() => toast.info("Help link sent to email")}
					style={{ color: "var(--c-text-3)", cursor: "pointer", background: "none", fontFamily: "var(--f-sans)" }}
				>
					Lost access?
				</button>
			</div>
		</div>
	);
}
