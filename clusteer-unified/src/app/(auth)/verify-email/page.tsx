"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
import { useAuth } from "@/stores/auth";

export default function VerifyEmailPage() {
	const { email } = useAuth();
	const [resending, setResending] = useState(false);
	const [resent, setResent] = useState(false);

	async function resend() {
		if (!email || resending) return;
		setResending(true);
		try {
			const res = await fetch("/api/auth-firebase/resend-verification", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			const data = await res.json();
			if (res.ok) {
				setResent(true);
				toast.success("Verification email sent — check your inbox");
			} else {
				toast.error(data.message || "Failed to resend. Please try again.");
			}
		} catch {
			toast.error("Unable to connect. Please try again.");
		} finally {
			setResending(false);
		}
	}

	const btnPrimary = {
		height: 48, width: "100%", display: "flex" as const, alignItems: "center" as const, justifyContent: "center" as const,
		borderRadius: "var(--r-md)", border: "1px solid transparent", fontSize: 14.5, fontWeight: 600,
		background: "var(--c-lime-500)", color: "var(--c-onyx-900)", cursor: "pointer", fontFamily: "var(--f-sans)",
	};
	const btnGhost = {
		width: "100%", height: 46, display: "flex" as const, alignItems: "center" as const, justifyContent: "center" as const,
		borderRadius: "var(--r-md)", border: "1px solid var(--c-line)", background: "transparent",
		fontSize: 13.5, color: "var(--c-text)", fontFamily: "var(--f-sans)", cursor: "pointer",
	};

	return (
		<div>
			{/* Eyebrow */}
			<div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10, fontWeight: 600, color: "var(--c-text-3)" }}>
				Email verification
			</div>
			<h1 className="font-display" style={{ fontSize: 36, fontWeight: 600, lineHeight: 1.1, marginBottom: 10 }}>
				Check your email
			</h1>
			<div style={{ fontSize: 14.5, marginBottom: 28, lineHeight: 1.5, color: "var(--c-text-2)" }}>
				We sent a verification link to{" "}
				<span style={{ fontWeight: 500, color: "var(--c-text)" }}>{email ?? "your email address"}</span>.
				Click the link in that email to activate your account.
			</div>

			{/* Instructions card */}
			<div
				style={{
					textAlign: "center", padding: "32px 24px", marginBottom: 18,
					background: "var(--c-surface)", border: "1px solid var(--c-line)", borderRadius: "var(--r-lg)",
				}}
			>
				<div
					style={{
						width: 64, height: 64, borderRadius: "50%",
						background: "var(--c-up-soft)", color: "var(--c-up)",
						margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center",
					}}
				>
					<MailCheck style={{ width: 28, height: 28 }} />
				</div>
				<div style={{ marginTop: 16, fontWeight: 500 }}>Check your inbox</div>
				<div style={{ marginTop: 8, fontSize: 13, color: "var(--c-text-2)", lineHeight: 1.5 }}>
					Open your email, click the verification link, then return here to log in. Check spam too.
				</div>
			</div>

			{/* Resend button */}
			<button
				type="button"
				onClick={resend}
				disabled={resending || resent}
				style={{
					...btnGhost,
					gap: 8,
					opacity: (resending || resent) ? 0.6 : 1,
				}}
			>
				{resending ? (
					<span style={{ width: 16, height: 16, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block" }} />
				) : null}
				{resent ? "Email sent" : resending ? "Sending..." : "Resend verification email"}
			</button>

			{/* Already verified */}
			<Link href="/login">
				<button
					type="button"
					style={{ ...btnPrimary, marginTop: 10 }}
				>
					Already verified? Log in
				</button>
			</Link>

			{/* Back to login */}
			<div className="mt-4 text-center">
				<Link
					href="/login"
					style={{ fontSize: 13, color: "var(--c-text-3)" }}
					className="hover:underline inline-flex items-center min-h-[44px]"
				>
					&larr; Back to sign in
				</Link>
			</div>
		</div>
	);
}
