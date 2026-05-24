"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { inputWrapStyle, innerInputStyle, btnPrimaryStyle, btnGhostStyle, showHideBtnStyle, spinnerStyle } from "@/lib/auth-styles";
import { GoogleIcon, AppleIcon } from "@/components/brand/auth-icons";
import { useAuth } from "@/stores/auth";



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
						<div className="flex items-center gap-2 auth-input-wrap" style={inputWrapStyle}>
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
						<div className="flex items-center gap-2 auth-input-wrap" style={inputWrapStyle}>
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
						<div className="flex items-center gap-2 auth-input-wrap" style={inputWrapStyle}>
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
						style={{ ...btnPrimaryStyle, width: "100%", opacity: (!data.name || !data.email || !data.phone) ? 0.5 : 1 }}
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
							style={{ ...btnGhostStyle, flex: 1, height: 46, gap: 8, fontSize: 13.5 }}
						>
							<GoogleIcon />
							<span className="sm:hidden">Google</span><span className="hidden sm:inline">Continue with Google</span>
						</button>
						<button
							type="button"
							onClick={() => toast.info("Coming soon: Apple")}
							style={{ ...btnGhostStyle, flex: 1, height: 46, gap: 8, fontSize: 13.5 }}
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
						<div className="flex items-center gap-2 auth-input-wrap" style={inputWrapStyle}>
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
							style={{ ...btnGhostStyle, padding: "0 20px" }}
						>
							Back
						</button>
						<button
							type="button"
							onClick={onSubmit}
							disabled={!ok8 || strength < 2 || !data.terms || submitting}
							style={{
								...btnPrimaryStyle, flex: 1,
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
