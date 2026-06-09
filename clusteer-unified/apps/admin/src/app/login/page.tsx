"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
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
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "var(--c-bg, #0B0E0C)",
				padding: 24,
			}}
		>
			<form
				onSubmit={handleSubmit}
				style={{
					width: "100%",
					maxWidth: 400,
					background: "var(--c-surface, #151916)",
					borderRadius: 14,
					padding: 32,
				}}
			>
				<h1
					style={{
						fontSize: 24,
						fontWeight: 700,
						color: "var(--c-text, #fff)",
						marginBottom: 8,
						fontFamily: "var(--font-sora)",
					}}
				>
					Admin Login
				</h1>
				<p style={{ fontSize: 14, color: "var(--c-text-2, #999)", marginBottom: 24 }}>
					Sign in to the Clusteer admin dashboard
				</p>

				{error && (
					<div
						style={{
							padding: "10px 14px",
							borderRadius: 8,
							background: "rgba(239,68,68,0.1)",
							color: "#ef4444",
							fontSize: 13,
							marginBottom: 16,
						}}
					>
						{error}
					</div>
				)}

				<label style={{ display: "block", marginBottom: 16 }}>
					<span style={{ fontSize: 13, color: "var(--c-text-2, #999)", display: "block", marginBottom: 6 }}>
						Email
					</span>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						style={{
							width: "100%",
							height: 38,
							borderRadius: 8,
							border: "1px solid var(--c-border, #2a2d2b)",
							background: "var(--c-surface-2, #1a1d1b)",
							color: "var(--c-text, #fff)",
							padding: "0 12px",
							fontSize: 14,
							outline: "none",
						}}
					/>
				</label>

				<label style={{ display: "block", marginBottom: 24 }}>
					<span style={{ fontSize: 13, color: "var(--c-text-2, #999)", display: "block", marginBottom: 6 }}>
						Password
					</span>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						style={{
							width: "100%",
							height: 38,
							borderRadius: 8,
							border: "1px solid var(--c-border, #2a2d2b)",
							background: "var(--c-surface-2, #1a1d1b)",
							color: "var(--c-text, #fff)",
							padding: "0 12px",
							fontSize: 14,
							outline: "none",
						}}
					/>
				</label>

				<button
					type="submit"
					disabled={loading}
					style={{
						width: "100%",
						height: 36,
						borderRadius: 8,
						border: "none",
						background: "var(--c-lime-500, #C9F542)",
						color: "var(--c-onyx-900, #0B0E0C)",
						fontSize: 14,
						fontWeight: 600,
						cursor: loading ? "not-allowed" : "pointer",
						opacity: loading ? 0.6 : 1,
					}}
				>
					{loading ? "Signing in..." : "Sign in"}
				</button>
			</form>
		</div>
	);
}
