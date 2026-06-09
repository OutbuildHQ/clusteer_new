"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/store/auth";

function VerifyOtpContent() {
	const router = useRouter();
	const params = useSearchParams();
	const flow = params.get("flow") ?? "login";
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const refs = useRef<(HTMLInputElement | null)[]>([]);
	const [countdown, setCountdown] = useState(30);
	const [submitting, setSubmitting] = useState(false);
	const { email, completeTwoFactor, signIn } = useAuth();

	useEffect(() => {
		if (countdown <= 0) return;
		const t = setInterval(() => setCountdown((c) => {
			if (c <= 1) { clearInterval(t); return 0; }
			return c - 1;
		}), 1000);
		return () => clearInterval(t);
	}, [countdown > 0]);

	const submitCode = useCallback(async (digits: string[]) => {
		const joined = digits.join("");
		if (joined.length !== 6 || submitting) return;
		setSubmitting(true);

		try {
			if (flow === "login") {
				const res = await fetch("/api/auth-firebase/verify-2fa", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ code: joined }),
				});
				const data = await res.json();

				if (!res.ok || !data.status) {
					toast.error(data.message || "Invalid code. Please try again.");
					setCode(["", "", "", "", "", ""]);
					refs.current[0]?.focus();
					return;
				}

				completeTwoFactor();
				toast.success("Verified. Welcome back.");
				window.location.href = "/dashboard";
			} else {
				signIn(email ?? "");
				toast.success("Verified.");
				router.push("/dashboard");
			}
		} catch {
			toast.error("Unable to connect. Please try again.");
		} finally {
			setSubmitting(false);
		}
	}, [flow, submitting, completeTwoFactor, signIn, email, router]);

	const onChange = (i: number, v: string) => {
		v = v.replace(/\D/g, "");
		if (v.length > 1) {
			// Paste handling
			const nc = [...code];
			for (let j = 0; j < 6 && j < v.length; j++) {
				nc[Math.min(i + j, 5)] = v[j];
			}
			setCode(nc);
			const last = Math.min(5, i + v.length - 1);
			refs.current[last]?.focus();
			if (nc.every((x) => x)) submitCode(nc);
			return;
		}
		v = v.slice(-1);
		const nc = [...code];
		nc[i] = v;
		setCode(nc);
		if (v && i < 5) refs.current[i + 1]?.focus();
		if (nc.every((x) => x)) submitCode(nc);
	};

	const onKey = (i: number, e: React.KeyboardEvent) => {
		if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus();
	};

	const btnPrimary = {
		height: 48, width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
		borderRadius: "var(--r-md)", border: "1px solid transparent", fontSize: 14.5, fontWeight: 600,
		background: "var(--c-lime-500)", color: "var(--c-onyx-900)", cursor: "pointer", fontFamily: "var(--f-sans)",
	} as const;

	return (
		<div>
			{/* Eyebrow */}
			<div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10, fontWeight: 600, color: "var(--c-text-3)" }}>
				Verify it&apos;s you
			</div>
			<h1 className="font-display text-[28px] sm:text-[36px]" style={{ fontWeight: 600, lineHeight: 1.1, marginBottom: 10 }}>
				{flow === "login" ? "Enter your 6-digit code" : "Check your email"}
			</h1>
			<div style={{ fontSize: 14.5, marginBottom: 28, lineHeight: 1.5, color: "var(--c-text-2)" }}>
				{flow === "login"
					? "Open your authenticator app (Authy, Google Authenticator, 1Password) and copy the current code."
					: <>We sent a 6-digit code to <span style={{ fontWeight: 500, color: "var(--c-text)" }}>{email ?? "your email"}</span>. It expires in 10 minutes.</>
				}
			</div>

			{/* OTP boxes — responsive: flex-1 on mobile, fixed 54px on sm+ */}
			<div className="flex items-center justify-between gap-1.5 sm:gap-2" style={{ marginBottom: 24 }}>
				{code.map((c, i) => (
					<input
						key={i}
						ref={(el) => { refs.current[i] = el; }}
						value={c}
						onChange={(e) => onChange(i, e.target.value)}
						onKeyDown={(e) => onKey(i, e)}
						inputMode="numeric"
						maxLength={6}
						autoFocus={i === 0}
						className="tabular-nums flex-1 sm:flex-none sm:w-[54px] auth-otp-box"
						style={{
							maxWidth: 54, height: 56,
							border: `1.5px solid ${c ? "var(--c-onyx-900)" : "var(--c-line)"}`,
							borderRadius: 10, textAlign: "center",
							fontSize: 22, fontWeight: 600,
							background: "var(--c-bg)", outline: "none",
							fontFamily: "var(--f-mono)", color: "var(--c-text)",
						}}
					/>
				))}
			</div>

			{/* Resend countdown */}
			<div style={{ fontSize: 13, textAlign: "center", marginBottom: 24, color: "var(--c-text-2)" }}>
				Didn&apos;t get it?{" "}
				{countdown > 0 ? (
					<span>Resend in <span className="mono tabular-nums">{countdown}s</span></span>
				) : (
					<button
						type="button"
						onClick={() => { setCountdown(30); toast.info("Code resent"); }}
						style={{ color: "var(--c-lime-600)", fontWeight: 600, cursor: "pointer", background: "none", fontFamily: "var(--f-sans)" }}
					>
						Resend code
					</button>
				)}
			</div>

			{/* Verify button */}
			<button
				type="button"
				onClick={() => submitCode(code)}
				disabled={!code.every((x) => x) || submitting}
				style={{ ...btnPrimary, opacity: (!code.every((x) => x) || submitting) ? 0.5 : 1 }}
			>
				{submitting ? (
					<span style={{ width: 18, height: 18, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block" }} />
				) : "Verify"}
			</button>

			{/* Alternate channel */}
			<button
				type="button"
				onClick={() => toast.info(flow === "login" ? "SMS verification coming soon" : "Phone OTP coming soon")}
				style={{
					width: "100%", height: 46, display: "flex", alignItems: "center", justifyContent: "center",
					marginTop: 10, borderRadius: "var(--r-md)", border: "1px solid var(--c-line)", background: "transparent",
					fontSize: 13.5, color: "var(--c-text)", fontFamily: "var(--f-sans)", cursor: "pointer",
				}}
			>
				Use {flow === "login" ? "SMS" : "phone"} instead
			</button>

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

export default function VerifyOtpPage() {
	return (
		<Suspense fallback={<div className="text-center py-12" style={{ color: "var(--c-text-2)" }}>Loading&hellip;</div>}>
			<VerifyOtpContent />
		</Suspense>
	);
}
