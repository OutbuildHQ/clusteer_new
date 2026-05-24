"use client";

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
	const requireTwoFactor = useAuth((s) => s.requireTwoFactor);
	const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { email: "", password: "", remember: true },
	});

	async function onSubmit(values: FormValues) {
		await new Promise((r) => setTimeout(r, 500));
		requireTwoFactor(values.email);
		toast.success("Verification code sent");
		router.push("/verify-otp?flow=login");
	}

	return (
		<div>
			<h1 className="font-display text-3xl font-bold tracking-tight">Welcome back</h1>
			<p className="mt-1 text-sm text-muted-foreground">Log in to continue to your account.</p>
			<form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input id="email" type="email" autoComplete="email" {...register("email")} />
					{errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
				</div>
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<Label htmlFor="password">Password</Label>
						<Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link>
					</div>
					<Input id="password" type="password" autoComplete="current-password" {...register("password")} />
					{errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
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
