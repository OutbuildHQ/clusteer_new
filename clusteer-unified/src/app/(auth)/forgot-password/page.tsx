"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({ email: z.string().email("Enter a valid email") });
type Values = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
	const [sent, setSent] = useState(false);
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
			setSent(true);
		} catch {
			toast.error("Unable to connect. Please try again.");
		}
	}

	return (
		<div>
			<h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Reset password</h1>
			<p className="mt-1 text-sm text-muted-foreground">We&apos;ll email a link to reset your password.</p>

			{sent ? (
				<div role="alert" className="mt-8 rounded-lg border border-success/20 bg-success-bg p-4 text-sm text-success">
					Check your inbox for a reset link. It may take a minute to arrive.
				</div>
			) : (
				<form onSubmit={handleSubmit(onSubmit)} className="mt-6 sm:mt-8 space-y-4">
					<div className="space-y-1.5">
						<Label htmlFor="email">Email <span className="text-danger">*</span></Label>
						<Input id="email" type="email" className="min-h-[48px]" {...register("email")} />
						<div className="min-h-[16px]">
							{errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
						</div>
					</div>
					<Button type="submit" size="lg" className="w-full min-h-[52px] text-[15px] font-bold btn-shine shadow-brutal-sm" disabled={isSubmitting}>
						{isSubmitting ? "Sending\u2026" : "Send reset link"}
					</Button>
				</form>
			)}

			<div className="mt-6 text-center text-sm text-muted-foreground">
				<Link href="/login" className="hover:text-foreground inline-flex items-center min-h-[44px]">Back to login</Link>
			</div>
		</div>
	);
}
