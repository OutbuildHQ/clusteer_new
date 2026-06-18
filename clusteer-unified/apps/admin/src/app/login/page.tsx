"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { ThemeProvider } from "@/providers/ThemeProvider";

function AdminAccentPanel() {
	return (
		<div
			className="relative hidden lg:flex items-center justify-center overflow-hidden"
			style={{ background: "var(--c-onyx-900)", color: "var(--c-cream)" }}
		>
			{/* Lime gradient blobs */}
			<div
				className="absolute rounded-full"
				style={{
					width: 520, height: 520, top: -120, right: -160,
					background: "radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--c-lime-500) 55%, transparent), transparent 70%)",
				}}
			/>
			<div
				className="absolute rounded-full"
				style={{
					width: 360, height: 360, bottom: -80, left: -100,
					background: "radial-gradient(circle, color-mix(in oklab, var(--c-lime-500) 32%, transparent), transparent 65%)",
				}}
			/>

			<div className="relative z-10 p-12 max-w-[480px]">
				{/* Badge */}
				<div
					className="flex items-center gap-2 mb-4"
					style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--c-lime-500)", fontWeight: 600 }}
				>
					<span className="inline-block rounded-full live-dot" style={{ width: 6, height: 6, background: "var(--c-lime-500)" }} />
					Secure &middot; Admin console
				</div>

				{/* Title */}
				<h2
					className="font-display"
					style={{ fontSize: 52, fontWeight: 600, letterSpacing: "-.03em", lineHeight: 1.05, color: "var(--c-cream)" }}
				>
					Clusteer <span style={{ color: "var(--c-lime-500)" }}>Admin</span>
				</h2>

				{/* Tagline */}
				<div
					className="font-display"
					style={{ marginTop: 28, fontSize: 21, fontWeight: 500, letterSpacing: "-.02em", lineHeight: 1.3, color: "var(--c-cream)" }}
				>
					Operations, compliance and oversight — in one console.
				</div>
				<div style={{ color: "rgba(244,241,234,.6)", marginTop: 14, fontSize: 13.5, lineHeight: 1.55 }}>
					Authorized personnel only. Every action is logged and audited.
				</div>

				{/* Stats */}
				<div
					className="flex items-center gap-4"
					style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(244,241,234,.1)" }}
				>
					{[["2FA", "Required"], ["Audit", "Tamper-evident"], ["RBAC", "Role-scoped"]].map(([v, l]) => (
						<div key={l}>
							<div className="font-display" style={{ fontSize: 18, fontWeight: 600, color: "var(--c-cream)" }}>{v}</div>
							<div style={{ fontSize: 11, color: "rgba(244,241,234,.5)" }}>{l}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default function AdminLoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Login failed");
			}
			router.push("/");
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
		} finally {
			setLoading(false);
		}
	}

	return (
		<ThemeProvider forcedTheme="light">
			<div
				className="min-h-[100dvh] grid lg:grid-cols-2"
				style={{ background: "var(--c-bg)", color: "var(--c-text)", fontFamily: "var(--f-sans)" }}
			>
				{/* Form side */}
				<div className="flex flex-col min-h-[100dvh] lg:min-h-0 overflow-auto">
					{/* Top bar */}
					<div className="flex items-center justify-between px-5 sm:px-10 py-4 sm:py-6">
						<div className="flex items-center gap-3">
							<Logo monogramOnly />
							<span className="font-display text-lg font-semibold" style={{ fontFamily: "var(--f-display)" }}>
								Clusteer <span style={{ color: "var(--c-text-3)" }}>Admin</span>
							</span>
						</div>
					</div>

					{/* Content */}
					<div className="flex-1 flex lg:items-center justify-center px-5 sm:px-10 py-4 sm:py-6">
						<div className="w-full max-w-[420px]">
							{/* Eyebrow */}
							<div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10, fontWeight: 600, color: "var(--c-text-3)" }}>
								Admin access
							</div>
							{/* Title */}
							<h1 className="font-display text-[28px] sm:text-[36px]" style={{ fontWeight: 600, lineHeight: 1.1, marginBottom: 10 }}>
								Sign in to Clusteer Admin
							</h1>
							{/* Subtitle */}
							<div style={{ fontSize: 14.5, marginBottom: 28, lineHeight: 1.5, color: "var(--c-text-2)" }}>
								Authorized personnel only. Use your admin credentials.
							</div>

							{error && (
								<div
									className="mb-4"
									style={{ padding: "10px 14px", borderRadius: 10, background: "color-mix(in oklab, var(--c-down) 10%, transparent)", color: "var(--c-down)", fontSize: 13 }}
								>
									{error}
								</div>
							)}

							<form onSubmit={handleSubmit}>
								{/* Email */}
								<div className="flex flex-col gap-2 mb-4">
									<label style={{ fontSize: 13, fontWeight: 500 }}>Email</label>
									<div
										className="flex items-center gap-2 auth-input-wrap"
										style={{ padding: "0 14px", height: 46, border: "1px solid var(--c-line)", borderRadius: 10, background: "var(--c-bg)", transition: "box-shadow .15s, border-color .15s" }}
									>
										<input
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
											autoFocus
											autoComplete="email"
											placeholder="you@clusteer.com"
											className="flex-1 border-0 bg-transparent outline-none"
											style={{ fontSize: 14, color: "var(--c-text)", fontFamily: "var(--f-sans)" }}
										/>
									</div>
								</div>

								{/* Password */}
								<div className="flex flex-col gap-2 mb-5">
									<label style={{ fontSize: 13, fontWeight: 500 }}>Password</label>
									<div
										className="flex items-center gap-2 auth-input-wrap"
										style={{ padding: "0 14px", height: 46, border: "1px solid var(--c-line)", borderRadius: 10, background: "var(--c-bg)", transition: "box-shadow .15s, border-color .15s" }}
									>
										<input
											type={showPassword ? "text" : "password"}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
											autoComplete="current-password"
											placeholder="Enter your password"
											className="flex-1 border-0 bg-transparent outline-none"
											style={{ fontSize: 14, color: "var(--c-text)", fontFamily: "var(--f-sans)" }}
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

								{/* Submit */}
								<button
									type="submit"
									disabled={loading}
									style={{
										height: 48, width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
										borderRadius: "var(--r-md)", border: "1px solid transparent", fontSize: 14.5, fontWeight: 600,
										background: "var(--c-lime-500)", color: "var(--c-onyx-900)", cursor: loading ? "not-allowed" : "pointer",
										fontFamily: "var(--f-sans)", opacity: loading ? 0.6 : 1,
									}}
								>
									{loading ? (
										<span style={{ width: 18, height: 18, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block" }} />
									) : "Sign in"}
								</button>
							</form>
						</div>
					</div>

					{/* Footer */}
					<div
						className="flex items-center justify-between px-5 sm:px-10 py-4 sm:py-5 text-xs"
						style={{ color: "var(--c-text-3)" }}
					>
						<div>&copy; Clusteer Admin</div>
						<div className="flex items-center gap-3">
							<span>Restricted access</span>
						</div>
					</div>
				</div>

				{/* Accent panel */}
				<AdminAccentPanel />
			</div>
		</ThemeProvider>
	);
}
