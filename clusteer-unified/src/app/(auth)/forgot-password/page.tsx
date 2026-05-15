"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({ email: z.string().email("Enter a valid email") });
type Values = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
	const [sent, setSent] = useState(false);
	const [sentEmail, setSentEmail] = useState("");
	const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
		resolver: zodResolver(schema),
	});

	async function onSubmit(values: Values) {
		try {
			const res = await fetch("/api/auth-firebase/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: values.email }),
			});
			const data = await res.json();
			if (!res.ok) {
				toast.error(data.message || "Failed to send reset link");
				return;
			}
			setSentEmail(values.email);
			setSent(true);
			toast.success("Reset link sent");
		} catch {
			toast.error("Unable to connect. Please try again.");
		}
	}

	const inputStyle = {
		padding: "0 14px", height: 46, border: "1px solid var(--c-line)", borderRadius: 10, background: "var(--c-bg)", transition: "box-shadow .15s, border-color .15s",
	} as const;
	const innerInputStyle = {
		flex: 1, border: 0, outline: "none", background: "transparent", fontSize: 14, color: "var(--c-text)", fontFamily: "var(--f-sans)",
	} as const;
	const btnPrimary = {
		height: 48, width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
		borderRadius: "var(--r-md)", border: "1px solid transparent", fontSize: 14.5, fontWeight: 600,
		background: "var(--c-lime-500)", color: "var(--c-onyx-900)", cursor: "pointer", fontFamily: "var(--f-sans)",
	} as const;
	const btnGhost = {
		width: "100%", height: 46, display: "flex", alignItems: "center", justifyContent: "center",
		borderRadius: "var(--r-md)", border: "1px solid var(--c-line)", background: "transparent",
		fontSize: 13.5, color: "var(--c-text)", fontFamily: "var(--f-sans)", cursor: "pointer",
	} as const;

	return (
		<div>
			{/* Eyebrow */}
			<div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10, fontWeight: 600, color: "var(--c-text-3)" }}>
				Account recovery
			</div>
			<h1 className="font-display" style={{ fontSize: 36, fontWeight: 600, lineHeight: 1.1, marginBottom: 10 }}>
				{sent ? "Check your inbox" : "Reset your password"}
			</h1>
			<div style={{ fontSize: 14.5, marginBottom: 28, lineHeight: 1.5, color: "var(--c-text-2)" }}>
				{sent
					? <>We sent a recovery link to {sentEmail}. The link expires in 30 minutes.</>
					: "Enter your email and we'll send a link to set a new password."}
			</div>

			{!sent ? (
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="flex flex-col gap-2 mb-4">
						<label style={{ fontSize: 13, fontWeight: 500 }}>Email</label>
						<div className="flex items-center gap-2 auth-input-wrap" style={inputStyle}>
							<input
								{...register("email")}
								type="email"
								placeholder="adaeze@example.com"
								autoFocus
								autoComplete="email"
								style={innerInputStyle}
							/>
						</div>
						{errors.email && <div style={{ fontSize: 12, color: "var(--c-down)" }}>{errors.email.message}</div>}
					</div>
					<button
						type="submit"
						disabled={isSubmitting}
						style={{ ...btnPrimary, opacity: isSubmitting ? 0.6 : 1 }}
					>
						{isSubmitting ? (
							<span style={{ width: 18, height: 18, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block" }} />
						) : "Send reset link"}
					</button>
				</form>
			) : (
				<>
					{/* Success card */}
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
								margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
							}}
						>
							&#10003;
						</div>
						<div style={{ marginTop: 16, fontWeight: 500 }}>Sent successfully</div>
					</div>
					<button
						type="button"
						onClick={() => window.open("https://mail.google.com", "_blank")}
						style={btnPrimary}
					>
						Open my email
					</button>
					<button
						type="button"
						onClick={() => setSent(false)}
						style={{ ...btnGhost, marginTop: 10 }}
					>
						Use different email
					</button>
				</>
			)}

			{/* Back to sign in */}
			<button
				type="button"
				onClick={() => window.location.href = "/login"}
				style={{ ...btnGhost, marginTop: 16 }}
			>
				&larr; Back to sign in
			</button>
		</div>
	);
}
