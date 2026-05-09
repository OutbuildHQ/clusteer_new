"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
				// Email not yet verified — send user to verify-email page
				if (data.requiresEmailVerification) {
					requireTwoFactor(values.email); // stores email in auth store
					toast.error("Please verify your email first.");
					router.push("/verify-email");
					return;
				}
				toast.error(data.message || "Login failed");
				return;
			}

			// 2FA required — store email, redirect to OTP challenge
			if (data.requiresTwoFactor) {
				requireTwoFactor(values.email);
				router.push("/verify-otp?flow=login");
				return;
			}

			// Full login success
			signIn(values.email);
			toast.success("Welcome back!");
			window.location.href = "/dashboard";
		} catch {
			toast.error("Unable to connect. Please try again.");
		}
	}

	return (
		<div>
			<p className="mb-2 font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-brand-800">&#9670; Welcome back</p>
			<h1 className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.03em]">Log in to Clusteer</h1>
			<p className="mt-1.5 text-sm text-muted-foreground">Enter your credentials to access your account.</p>

			<form onSubmit={handleSubmit(onSubmit)} className="mt-6 sm:mt-8 space-y-4">
				<div className="space-y-1.5">
					<Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide">Email <span className="text-danger">*</span></Label>
					<Input id="email" type="email" placeholder="you@example.com" autoComplete="email" className="min-h-[48px]" {...register("email")} />
					<div className="min-h-[16px]">
						{errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
					</div>
				</div>

				<div className="space-y-1.5">
					<div className="flex items-center justify-between">
						<Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide">Password <span className="text-danger">*</span></Label>
						<Link href="/forgot-password" className="text-xs font-medium text-brand-800 hover:underline">Forgot?</Link>
					</div>
					<div className="relative">
						<Input id="password" type={showPassword ? "text" : "password"} placeholder="Min. 8 characters" autoComplete="current-password" className="min-h-[48px]" {...register("password")} />
						<button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-wide text-muted-foreground hover:text-foreground">
							{showPassword ? "Hide" : "Show"}
						</button>
					</div>
					<div className="min-h-[16px]">
						{errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
					</div>
				</div>

				<label className="flex items-center gap-2.5 text-sm min-h-[44px]">
					<Checkbox {...register("remember")} defaultChecked /> Keep me logged in
				</label>

				<Button type="submit" size="lg" className="w-full min-h-[52px] text-[15px] font-bold btn-shine shadow-brutal-sm" disabled={isSubmitting}>
					{isSubmitting ? "Signing in\u2026" : "Continue"}
				</Button>
			</form>

			<p className="mt-6 text-center text-sm text-muted-foreground">
				New to Clusteer?{" "}
				<Link href="/signup" className="font-bold text-custom-black hover:underline">Create an account</Link>
			</p>
		</div>
	);
}
