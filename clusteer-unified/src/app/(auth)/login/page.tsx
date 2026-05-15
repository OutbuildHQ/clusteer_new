"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Fingerprint } from "lucide-react";
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

const PasskeyIcon = () => (
	<Fingerprint className="size-[18px]" />
);

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
			<h1 className="font-display text-[28px] sm:text-[36px]" style={{ fontWeight: 600, lineHeight: 1.1, marginBottom: 10 }}>
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
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
					<button
						type="button"
						onClick={() => toast.info("Coming soon: Google")}
						style={{
							flex: 1, height: 46, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
							borderRadius: "var(--r-md)", border: "1px solid var(--c-line)", background: "transparent",
							fontSize: 13.5, fontWeight: 500, color: "var(--c-text)", fontFamily: "var(--f-sans)", cursor: "pointer",
						}}
					>
						<GoogleIcon />
						<span className="sm:hidden">Google</span><span className="hidden sm:inline">Continue with Google</span>
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
						<AppleIcon />
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
					<PasskeyIcon />
					<span>Sign in with Passkey</span>
				</button>
			</form>
		</div>
	);
}
