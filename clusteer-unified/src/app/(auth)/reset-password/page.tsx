"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebase";

const schema = z
	.object({
		password: z.string().min(8, "At least 8 characters").regex(/[A-Z]/, "Add an uppercase letter").regex(/[0-9]/, "Add a number"),
		confirm: z.string(),
	})
	.refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Passwords don't match" });

type Values = z.infer<typeof schema>;

function ResetPasswordContent() {
	const router = useRouter();
	const params = useSearchParams();
	const oobCode = params.get("oobCode");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [done, setDone] = useState(false);

	const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
		resolver: zodResolver(schema),
	});

	// Missing oobCode means the user landed here without a valid reset link
	if (!oobCode) {
		return (
			<div>
				<h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Invalid reset link</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					This password reset link is invalid or has expired.{" "}
					<Link href="/forgot-password" className="font-semibold text-brand-800 hover:underline">Request a new one</Link>.
				</p>
			</div>
		);
	}

	if (done) {
		return (
			<div>
				<h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Password updated</h1>
				<p className="mt-2 text-sm text-muted-foreground">Your password has been changed successfully.</p>
				<Button
					size="lg"
					className="mt-6 w-full min-h-[52px] text-[15px] font-bold btn-shine shadow-brutal-sm"
					onClick={() => router.push("/login")}
				>
					Log in now
				</Button>
			</div>
		);
	}

	async function onSubmit(values: Values) {
		if (!auth) {
			toast.error("Authentication not configured");
			return;
		}
		try {
			// Verify the code is still valid before resetting
			await verifyPasswordResetCode(auth, oobCode!);
			await confirmPasswordReset(auth, oobCode!, values.password);
			setDone(true);
			toast.success("Password updated successfully");
		} catch (error: unknown) {
			const code = (error as { code?: string }).code;
			if (code === "auth/expired-action-code" || code === "auth/invalid-action-code") {
				toast.error("This reset link has expired. Please request a new one.");
			} else if (code === "auth/weak-password") {
				toast.error("Password is too weak. Use at least 8 characters.");
			} else {
				toast.error("Failed to reset password. Please try again.");
			}
		}
	}

	return (
		<div>
			<h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Set a new password</h1>
			<p className="mt-1 text-sm text-muted-foreground">Choose something strong and unique.</p>

			<form onSubmit={handleSubmit(onSubmit)} className="mt-6 sm:mt-8 space-y-4">
				<div className="space-y-1.5">
					<Label htmlFor="password">New password <span className="text-danger">*</span></Label>
					<div className="relative">
						<Input id="password" type={showPassword ? "text" : "password"} className="min-h-[48px]" {...register("password")} />
						<button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground">
							{showPassword ? "Hide" : "Show"}
						</button>
					</div>
					<div className="min-h-[16px]">
						{errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
					</div>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="confirm">Confirm password <span className="text-danger">*</span></Label>
					<div className="relative">
						<Input id="confirm" type={showConfirm ? "text" : "password"} className="min-h-[48px]" {...register("confirm")} />
						<button type="button" tabIndex={-1} onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground">
							{showConfirm ? "Hide" : "Show"}
						</button>
					</div>
					<div className="min-h-[16px]">
						{errors.confirm && <p className="text-xs text-danger">{errors.confirm.message}</p>}
					</div>
				</div>

				<Button type="submit" size="lg" className="w-full min-h-[52px] text-[15px] font-bold btn-shine shadow-brutal-sm" disabled={isSubmitting}>
					{isSubmitting ? "Saving\u2026" : "Update password"}
				</Button>
			</form>

			<div className="mt-6 text-center text-sm text-muted-foreground">
				<Link href="/login" className="hover:text-foreground inline-flex items-center min-h-[44px]">Back to login</Link>
			</div>
		</div>
	);
}

export default function ResetPasswordPage() {
	return (
		<Suspense fallback={<div className="text-center text-muted-foreground py-12">Loading&hellip;</div>}>
			<ResetPasswordContent />
		</Suspense>
	);
}
