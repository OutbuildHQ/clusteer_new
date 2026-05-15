"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import { useAuth } from "@/stores/auth";

const schema = z.object({
	email: z.string().email("Enter a valid email"),
	password: z.string().min(8, "At least 8 characters"),
	remember: z.boolean().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
	const router = useRouter();
	const { signIn, requireTwoFactor } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { email: "", password: "", remember: true },
	});

	async function onSubmit(values: FormValues) {
		try {
			const res = await fetch("/api/auth-firebase/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: values.email, password: values.password }),
			});

			const data = await res.json();

			if (!res.ok || !data.status) {
				if (data.requiresEmailVerification) {
					requireTwoFactor(values.email);
					toast.error("Please verify your email first.");
					router.push("/verify-email");
					return;
				}
				toast.error(data.message || "Login failed");
				return;
			}

			if (data.requiresTwoFactor) {
				requireTwoFactor(values.email);
				router.push("/verify-otp?flow=login");
				return;
			}

			signIn(values.email);
			toast.success("Welcome back!");
			window.location.href = "/dashboard";
		} catch {
			toast.error("Unable to connect. Please try again.");
		}
	}

	return (
		<div>
			{/* Top-right link (positioned via layout) */}
			<div className="flex items-center justify-end gap-2 mb-6 -mt-2" style={{ fontSize: 13 }}>
				New here?{" "}
				<Link href="/signup" style={{ color: "var(--c-onyx-900)", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 2 }}>
					Create account
				</Link>
			</div>

			{/* Eyebrow */}
			<div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10, fontWeight: 600, color: "var(--c-text-3)" }}>
				Welcome back
			</div>
			{/* Title */}
			<h1 className="font-display" style={{ fontSize: 36, fontWeight: 600, lineHeight: 1.1, marginBottom: 10 }}>
				Sign in to Clusteer
			</h1>
			{/* Subtitle */}
			<div style={{ fontSize: 14.5, marginBottom: 28, lineHeight: 1.5, color: "var(--c-text-2)" }}>
				Use the email or phone you registered with.
			</div>

			<form onSubmit={handleSubmit(onSubmit)}>
				{/* Email field */}
				<div className="flex flex-col gap-2 mb-4">
					<label style={{ fontSize: 13, fontWeight: 500 }}>Email or phone</label>
					<div
						className="flex items-center gap-2 auth-input-wrap"
						style={{ padding: "0 14px", height: 46, border: "1px solid var(--c-line)", borderRadius: 10, background: "var(--c-bg)", transition: "box-shadow .15s, border-color .15s" }}
					>
						<input
							{...register("email")}
							type="email"
							placeholder="adaeze@example.com or +234..."
							autoFocus
							autoComplete="email"
							className="flex-1 border-0 bg-transparent outline-none"
							style={{ fontSize: 14, color: "var(--c-text)", fontFamily: "var(--f-sans)" }}
						/>
					</div>
					{errors.email && <div style={{ fontSize: 12, color: "var(--c-down)" }}>{errors.email.message}</div>}
				</div>

				{/* Password field */}
				<div className="flex flex-col gap-2 mb-4">
					<div className="flex items-center justify-between">
						<label style={{ fontSize: 13, fontWeight: 500 }}>Password</label>
						<Link href="/forgot-password" style={{ fontSize: 12, color: "var(--c-text-3)", cursor: "pointer" }}>Forgot?</Link>
					</div>
					<div
						className="flex items-center gap-2 auth-input-wrap"
						style={{ padding: "0 14px", height: 46, border: "1px solid var(--c-line)", borderRadius: 10, background: "var(--c-bg)", transition: "box-shadow .15s, border-color .15s" }}
					>
						<input
							{...register("password")}
							type={showPassword ? "text" : "password"}
							placeholder="Min. 8 characters"
							autoComplete="current-password"
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
					{errors.password && <div style={{ fontSize: 12, color: "var(--c-down)" }}>{errors.password.message}</div>}
				</div>

				{/* Remember me */}
				<div className="flex items-center gap-2" style={{ marginBottom: 18, fontSize: 13 }}>
					<input id="rm" type="checkbox" {...register("remember")} defaultChecked style={{ accentColor: "var(--c-lime-500)" }} />
					<label htmlFor="rm">Keep me signed in for 30 days</label>
				</div>

				{/* Submit */}
				<button
					type="submit"
					disabled={isSubmitting}
					style={{
						height: 48, width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
						borderRadius: "var(--r-md)", border: "1px solid transparent", fontSize: 14.5, fontWeight: 600,
						background: "var(--c-lime-500)", color: "var(--c-onyx-900)", cursor: "pointer",
						fontFamily: "var(--f-sans)", opacity: isSubmitting ? 0.6 : 1,
					}}
				>
					{isSubmitting ? (
						<span style={{ width: 18, height: 18, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block" }} />
					) : "Sign in"}
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
						style={{
							flex: 1, height: 46, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
							borderRadius: "var(--r-md)", border: "1px solid var(--c-line)", background: "transparent",
							fontSize: 13.5, fontWeight: 500, color: "var(--c-text)", fontFamily: "var(--f-sans)", cursor: "pointer",
						}}
					>
						<span style={{ width: 18, height: 18, borderRadius: 4, background: "#fff", color: "#444", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, border: "1px solid var(--c-line)" }}>G</span>
						Continue with Google
					</button>
					<button
						type="button"
						onClick={() => toast.info("Coming soon: Apple")}
						style={{
							flex: 1, height: 46, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
							borderRadius: "var(--r-md)", border: "1px solid var(--c-line)", background: "transparent",
							fontSize: 13.5, fontWeight: 500, color: "var(--c-text)", fontFamily: "var(--f-sans)", cursor: "pointer",
						}}
					>
						<span style={{ width: 18, height: 18, borderRadius: 4, background: "#000", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}></span>
						Apple
					</button>
				</div>

				{/* Passkey */}
				<button
					type="button"
					onClick={() => toast.info("Passkey sign-in coming soon")}
					style={{
						width: "100%", height: 46, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
						marginTop: 10, borderRadius: "var(--r-md)", border: "1px solid var(--c-line)", background: "transparent",
						fontSize: 13.5, fontWeight: 500, color: "var(--c-text)", fontFamily: "var(--f-sans)", cursor: "pointer",
					}}
				>
					<Shield className="size-4" />
					<span>Sign in with Passkey</span>
				</button>
			</form>
		</div>
	);
}
