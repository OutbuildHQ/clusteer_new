"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/lib/firebase";

function ResetPasswordContent() {
	const router = useRouter();
	const params = useSearchParams();
	const oobCode = params.get("oobCode");
	const [showP1, setShowP1] = useState(false);
	const [showP2, setShowP2] = useState(false);
	const [p1, setP1] = useState("");
	const [p2, setP2] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [done, setDone] = useState(false);

	const match = p1 && p1 === p2;

	const inputStyle = {
		padding: "0 14px", height: 46, border: "1px solid var(--c-line)", borderRadius: 10, background: "var(--c-bg)", transition: "box-shadow .15s, border-color .15s",
	} as const;
	const innerInputStyle = {
		flex: 1, border: 0, outline: "none", background: "transparent", fontSize: 14, color: "var(--c-text)", fontFamily: "var(--f-sans)",
	} as const;
	const btnPrimary = {
		height: 48, width: "100%", display: "flex" as const, alignItems: "center" as const, justifyContent: "center" as const,
		borderRadius: "var(--r-md)", border: "1px solid transparent", fontSize: 14.5, fontWeight: 600,
		background: "var(--c-lime-500)", color: "var(--c-onyx-900)", cursor: "pointer", fontFamily: "var(--f-sans)",
	};

	// Missing oobCode
	if (!oobCode) {
		return (
			<div>
				<div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10, fontWeight: 600, color: "var(--c-text-3)" }}>
					Account recovery
				</div>
				<h1 className="font-display text-[28px] sm:text-[36px]" style={{ fontWeight: 600, lineHeight: 1.1, marginBottom: 10 }}>
					Invalid reset link
				</h1>
				<div style={{ fontSize: 14.5, marginBottom: 28, lineHeight: 1.5, color: "var(--c-text-2)" }}>
					This password reset link is invalid or has expired.{" "}
					<a href="/forgot-password" style={{ fontWeight: 600, color: "var(--c-lime-600)" }}>Request a new one</a>.
				</div>
			</div>
		);
	}

	// Success state
	if (done) {
		return (
			<div>
				<div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10, fontWeight: 600, color: "var(--c-text-3)" }}>
					Account recovery
				</div>
				<h1 className="font-display text-[28px] sm:text-[36px]" style={{ fontWeight: 600, lineHeight: 1.1, marginBottom: 10 }}>
					Password updated
				</h1>
				<div style={{ fontSize: 14.5, marginBottom: 28, lineHeight: 1.5, color: "var(--c-text-2)" }}>
					Your password has been changed successfully.
				</div>
				<button
					type="button"
					onClick={() => router.push("/login")}
					style={btnPrimary}
				>
					Log in now
				</button>
			</div>
		);
	}

	async function onSubmit() {
		if (!auth || !match || p1.length < 8 || submitting) return;
		setSubmitting(true);
		try {
			const email = await verifyPasswordResetCode(auth, oobCode!);
			await confirmPasswordReset(auth, oobCode!, p1);
			// Invalidate any session issued before this reset — otherwise an old
			// auth_token stays valid until its natural expiry even after the
			// password changes. Best-effort: the reset itself already succeeded.
			try {
				await fetch("/api/auth-firebase/invalidate-sessions", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email }),
				});
			} catch {
				// non-blocking
			}
			setDone(true);
			toast.success("Password updated successfully");
		} catch (error: unknown) {
			const code = (error as { code?: string }).code;
			if (code === "auth/expired-action-code" || code === "auth/invalid-action-code") {
				toast.error("This reset link has expired. Please request a new one.");
			} else if (code === "auth/weak-password") {
				toast.error("Password is too weak. Use at least 8 characters.");
			} else {
				toast.error("Failed to reset password. Please try again.");
			}
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div>
			{/* Eyebrow */}
			<div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10, fontWeight: 600, color: "var(--c-text-3)" }}>
				New password
			</div>
			<h1 className="font-display text-[28px] sm:text-[36px]" style={{ fontWeight: 600, lineHeight: 1.1, marginBottom: 10 }}>
				Set a new password
			</h1>
			<div style={{ fontSize: 14.5, marginBottom: 28, lineHeight: 1.5, color: "var(--c-text-2)" }}>
				Pick something strong &mdash; at least 8 characters with a number and a symbol.
			</div>

			{/* New password */}
			<div className="flex flex-col gap-2 mb-4">
				<label style={{ fontSize: 13, fontWeight: 500 }}>New password</label>
				<div className="flex items-center gap-2 auth-input-wrap" style={inputStyle}>
					<input
						type={showP1 ? "text" : "password"}
						placeholder="Min. 8 characters"
						value={p1}
						onChange={(e) => setP1(e.target.value)}
						autoFocus
						style={innerInputStyle}
					/>
					<button
						type="button"
						tabIndex={-1}
						onClick={() => setShowP1(!showP1)}
						style={{ height: 30, padding: "0 10px", borderRadius: "var(--r-md)", border: "1px solid var(--c-line)", background: "transparent", fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", fontFamily: "var(--f-sans)", cursor: "pointer" }}
					>
						{showP1 ? "Hide" : "Show"}
					</button>
				</div>
			</div>

			{/* Confirm password */}
			<div className="flex flex-col gap-2 mb-4">
				<label style={{ fontSize: 13, fontWeight: 500 }}>Confirm new password</label>
				<div className="flex items-center gap-2 auth-input-wrap" style={inputStyle}>
					<input
						type={showP2 ? "text" : "password"}
						placeholder="Re-enter password"
						value={p2}
						onChange={(e) => setP2(e.target.value)}
						style={innerInputStyle}
					/>
					<button
						type="button"
						tabIndex={-1}
						onClick={() => setShowP2(!showP2)}
						style={{ height: 30, padding: "0 10px", borderRadius: "var(--r-md)", border: "1px solid var(--c-line)", background: "transparent", fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", fontFamily: "var(--f-sans)", cursor: "pointer" }}
					>
						{showP2 ? "Hide" : "Show"}
					</button>
				</div>
				{p2 && !match && <div style={{ fontSize: 12, color: "var(--c-down)" }}>Passwords don&apos;t match</div>}
			</div>

			{/* Submit */}
			<button
				type="button"
				onClick={onSubmit}
				disabled={!match || p1.length < 8 || submitting}
				style={{ ...btnPrimary, opacity: (!match || p1.length < 8 || submitting) ? 0.5 : 1 }}
			>
				{submitting ? (
					<span style={{ width: 18, height: 18, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block" }} />
				) : "Update password"}
			</button>
		</div>
	);
}

export default function ResetPasswordPage() {
	return (
		<Suspense fallback={<div className="text-center py-12" style={{ color: "var(--c-text-2)" }}>Loading&hellip;</div>}>
			<ResetPasswordContent />
		</Suspense>
	);
}
