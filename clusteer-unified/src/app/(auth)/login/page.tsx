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
	const signIn = useAuth((s) => s.signIn);
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

			if (!res.ok) {
				toast.error(data.message || "Login failed");
				return;
			}

			// Update client-side auth state
			signIn(values.email);
			toast.success("Welcome back!");
			router.push("/dashboard");
		} catch {
			toast.error("Unable to connect. Please try again.");
		}
	}

	return (
		<div>
			<h1 className="font-display text-3xl font-bold tracking-tight">Welcome back</h1>
			<p className="mt-1 text-sm text-muted-foreground">Log in to continue to your account.</p>
			<form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-3">
				<div className="space-y-1.5">
					<Label htmlFor="email">Email <span className="text-danger">*</span></Label>
					<Input id="email" type="email" autoComplete="email" {...register("email")} />
					<div className="min-h-[16px]">
						{errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
					</div>
				</div>
				<div className="space-y-1.5">
					<div className="flex items-center justify-between">
						<Label htmlFor="password">Password <span className="text-danger">*</span></Label>
						<Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link>
					</div>
					<div className="relative">
						<Input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" {...register("password")} />
						<button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground">
							{showPassword ? "Hide" : "Show"}
						</button>
					</div>
					<div className="min-h-[16px]">
						{errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
					</div>
				</div>
				<label className="flex items-center gap-2 text-sm">
					<Checkbox {...register("remember")} defaultChecked /> Keep me logged in
				</label>
				<Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
					{isSubmitting ? "Signing in…" : "Continue"}
				</Button>
			</form>
			<p className="mt-6 text-center text-sm text-muted-foreground">
				New to Clusteer? <Link href="/signup" className="font-medium text-primary hover:underline">Create an account</Link>
			</p>
		</div>
	);
}
