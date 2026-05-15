"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/stores/auth";

const GoogleIcon = () => (
	<svg width="18" height="18" viewBox="0 0 24 24">
		<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
		<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
		<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
		<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
	</svg>
);

const AppleIcon = () => (
	<svg width="16" height="18" viewBox="0 0 17 20" fill="currentColor">
		<path d="M13.34 10.17c-.01-2.09 1.7-3.1 1.78-3.15-1-1.42-2.5-1.62-3.03-1.63-1.27-.14-2.52.76-3.17.76-.67 0-1.68-.75-2.77-.73A4.07 4.07 0 0 0 2.7 7.65c-1.48 2.56-.38 6.33 1.04 8.4.72 1.01 1.56 2.13 2.66 2.09 1.08-.04 1.48-.68 2.78-.68 1.28 0 1.65.68 2.77.66 1.15-.02 1.87-1.02 2.56-2.04.83-1.17 1.16-2.32 1.17-2.38-.03-.01-2.23-.86-2.25-3.4l-.09-.13zM11.28 4.04c.57-.72.97-1.7.86-2.7-.83.04-1.87.57-2.47 1.27-.53.62-1.01 1.64-.89 2.6.94.07 1.9-.47 2.5-1.17z"/>
	</svg>
);

export default function SignupPage() {
	const router = useRouter();
	const requireTwoFactor = useAuth((s) => s.requireTwoFactor);
	const [step, setStep] = useState(1);
	const [submitting, setSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [data, setData] = useState({ name: "", email: "", phone: "", password: "", terms: false });
	const [strength, setStrength] = useState(0);

	useEffect(() => {
		const p = data.password;
		let s = 0;
		if (p.length >= 8) s++;
		if (/[A-Z]/.test(p)) s++;
		if (/\d/.test(p)) s++;
		if (/[^A-Za-z0-9]/.test(p)) s++;
		setStrength(s);
	}, [data.password]);

	const ok8 = data.password.length >= 8;
	const strengthLabel = strength <= 1 ? "Weak" : strength === 2 ? "Okay" : strength === 3 ? "Good" : "Strong";
	const strengthHint = strength < 4 ? "add uppercase / number / symbol for max strength" : "Top-shelf \uD83D\uDD10";

	async function onSubmit() {
		if (submitting) return;
		setSubmitting(true);
		try {
			const username = data.email
				.split("@")[0]
				.toLowerCase()
				.replace(/[^a-z0-9_]/g, "")
				.slice(0, 20) || "user";

			const res = await fetch("/api/auth-firebase/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username,
					email: data.email,
					phone: data.phone.startsWith("+") ? data.phone : `+234${data.phone.replace(/^0/, "")}`,
					password: data.password,
					name: data.name,
				}),
			});

			const result = await res.json();

			if (!res.ok) {
				toast.error(result.message || "Registration failed");
				return;
			}

			requireTwoFactor(data.email);
			toast.success("Account created! Check your inbox for a verification link.");
			router.push("/verify-email");
		} catch {
			toast.error("Unable to connect. Please try again.");
		} finally {
			setSubmitting(false);
		}
	}

	const inputStyle = {
		padding: "0 14px", height: 46, border: "1px solid var(--c-line)", borderRadius: 10, background: "var(--c-bg)", transition: "box-shadow .15s, border-color .15s",
	} as const;
	const innerInputStyle = {
		flex: 1, border: 0, outline: "none", background: "transparent", fontSize: 14, color: "var(--c-text)", fontFamily: "var(--f-sans)",
	} as const;
	const btnPrimary = {
		height: 48, display: "flex", alignItems: "center", justifyContent: "center",
		borderRadius: "var(--r-md)", border: "1px solid transparent", fontSize: 14.5, fontWeight: 600,
		background: "var(--c-lime-500)", color: "var(--c-onyx-900)", cursor: "pointer", fontFamily: "var(--f-sans)",
	} as const;
	const btnGhost = {
		height: 48, display: "flex", alignItems: "center", justifyContent: "center",
		borderRadius: "var(--r-md)", border: "1px solid var(--c-line)", background: "transparent",
		fontSize: 14, fontWeight: 500, color: "var(--c-text)", fontFamily: "var(--f-sans)", cursor: "pointer",
	} as const;

	return (
		<div>
			{/* Top-right link */}
			<div className="flex items-center justify-end gap-2 mb-6 -mt-2" style={{ fontSize: 13 }}>
				Already a member?{" "}
				<Link href="/login" style={{ color: "var(--c-onyx-900)", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 2 }}>
					Sign in
				</Link>
			</div>

			{/* Eyebrow */}
			<div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10, fontWeight: 600, color: "var(--c-text-3)" }}>
				Step {step} of 2
			</div>
			<h1 className="font-display text-[28px] sm:text-[36px]" style={{ fontWeight: 600, lineHeight: 1.1, marginBottom: 10 }}>
				{step === 1 ? "Create your account" : "Secure your account"}
			</h1>
			<div style={{ fontSize: 14.5, marginBottom: 28, lineHeight: 1.5, color: "var(--c-text-2)" }}>
				{step === 1
					? "NDPR-aligned. We never share your data with third parties."
					: "Pick a strong password. You can add 2FA in the next step."}
			</div>

			{step === 1 && (
				<>
					{/* Full name */}
					<div className="flex flex-col gap-2 mb-4">
						<label style={{ fontSize: 13, fontWeight: 500 }}>Full name as on NIN</label>
						<div className="flex items-center gap-2 auth-input-wrap" style={inputStyle}>
							<input
								placeholder="Adaeze Chukwu"
								value={data.name}
								onChange={(e) => setData({ ...data, name: e.target.value })}
								autoFocus
								style={innerInputStyle}
							/>
						</div>
					</div>

					{/* Email */}
					<div className="flex flex-col gap-2 mb-4">
						<label style={{ fontSize: 13, fontWeight: 500 }}>Email</label>
						<div className="flex items-center gap-2 auth-input-wrap" style={inputStyle}>
							<input
								type="email"
								placeholder="adaeze@example.com"
								value={data.email}
								onChange={(e) => setData({ ...data, email: e.target.value })}
								autoComplete="email"
								style={innerInputStyle}
							/>
						</div>
					</div>

					{/* Phone */}
					<div className="flex flex-col gap-2 mb-4">
						<label style={{ fontSize: 13, fontWeight: 500 }}>Phone number</label>
						<div className="flex items-center gap-2 auth-input-wrap" style={inputStyle}>
							<span style={{ fontSize: 14, fontWeight: 600 }}>&#x1F1F3;&#x1F1EC; +234</span>
							<input
								placeholder="80 1234 5678"
								value={data.phone}
								onChange={(e) => setData({ ...data, phone: e.target.value })}
								style={innerInputStyle}
							/>
						</div>
						<div style={{ fontSize: 12, color: "var(--c-text-2)" }}>Nigerian numbers only</div>
					</div>

					{/* Continue */}
					<button
						type="button"
						onClick={() => setStep(2)}
						disabled={!data.name || !data.email || !data.phone}
						style={{ ...btnPrimary, width: "100%", opacity: (!data.name || !data.email || !data.phone) ? 0.5 : 1 }}
					>
						Continue &rarr;
					</button>

					{/* Divider */}
					<div className="flex items-center gap-3" style={{ margin: "18px 0" }}>
						<div className="flex-1" style={{ height: 1, background: "var(--c-line)" }} />
						<div style={{ fontSize: 11, letterSpacing: ".1em", color: "var(--c-text-3)" }}>OR</div>
						<div className="flex-1" style={{ height: 1, background: "var(--c-line)" }} />
					</div>

					{/* Social buttons */}
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={() => toast.info("Coming soon: Google")}
							style={{ ...btnGhost, flex: 1, height: 46, gap: 8, fontSize: 13.5 }}
						>
							<GoogleIcon />
							<span className="sm:hidden">Google</span><span className="hidden sm:inline">Continue with Google</span>
						</button>
						<button
							type="button"
							onClick={() => toast.info("Coming soon: Apple")}
							style={{ ...btnGhost, flex: 1, height: 46, gap: 8, fontSize: 13.5 }}
						>
							<AppleIcon />
							Apple
						</button>
					</div>
				</>
			)}

			{step === 2 && (
				<>
					{/* Password */}
					<div className="flex flex-col gap-2 mb-4">
						<label style={{ fontSize: 13, fontWeight: 500 }}>Password</label>
						<div className="flex items-center gap-2 auth-input-wrap" style={inputStyle}>
							<input
								type={showPassword ? "text" : "password"}
								placeholder="Min 8 chars, 1 number"
								value={data.password}
								onChange={(e) => setData({ ...data, password: e.target.value })}
								autoFocus
								style={innerInputStyle}
							/>
							<button
								type="button"
								tabIndex={-1}
								onClick={() => setShowPassword(!showPassword)}
								style={{ height: 30, padding: "0 10px", borderRadius: "var(--r-md)", border: "1px solid var(--c-line)", background: "transparent", fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", fontFamily: "var(--f-sans)", cursor: "pointer" }}
							>
								{showPassword ? "Hide" : "Show"}
							</button>
						</div>
					</div>

					{/* Strength meter */}
					<div className="flex items-center gap-1" style={{ marginBottom: 18 }}>
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className="flex-1"
								style={{
									height: 4, borderRadius: 2,
									background: strength >= i
										? (strength <= 1 ? "var(--c-down)" : strength <= 2 ? "var(--c-warn)" : strength <= 3 ? "#86CC57" : "var(--c-up)")
										: "var(--c-line)",
								}}
							/>
						))}
					</div>
					<div style={{ fontSize: 12, marginBottom: 18, marginTop: -12, color: "var(--c-text-2)" }}>
						{strengthLabel} &middot; {strengthHint}
					</div>

					{/* Terms */}
					<div className="flex items-start gap-2" style={{ marginBottom: 18, fontSize: 13 }}>
						<input
							id="terms"
							type="checkbox"
							checked={data.terms}
							onChange={(e) => setData({ ...data, terms: e.target.checked })}
							style={{ marginTop: 3, accentColor: "var(--c-lime-500)" }}
						/>
						<label htmlFor="terms" style={{ color: "var(--c-text-2)" }}>
							I agree to Clusteer&apos;s{" "}
							<Link href="/terms-of-service" style={{ color: "var(--c-lime-600)", fontWeight: 500 }}>Terms</Link> and{" "}
							<Link href="/privacy-policy" style={{ color: "var(--c-lime-600)", fontWeight: 500 }}>Privacy Policy</Link>.
						</label>
					</div>

					{/* Buttons */}
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setStep(1)}
							style={{ ...btnGhost, padding: "0 20px" }}
						>
							Back
						</button>
						<button
							type="button"
							onClick={onSubmit}
							disabled={!ok8 || strength < 2 || !data.terms || submitting}
							style={{
								...btnPrimary, flex: 1,
								opacity: (!ok8 || strength < 2 || !data.terms || submitting) ? 0.5 : 1,
							}}
						>
							{submitting ? (
								<span style={{ width: 18, height: 18, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block" }} />
							) : "Create account"}
						</button>
					</div>
				</>
			)}
		</div>
	);
}
