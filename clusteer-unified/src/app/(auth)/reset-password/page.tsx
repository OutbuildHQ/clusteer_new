"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z
	.object({
		password: z.string().min(8, "At least 8 characters"),
		confirm: z.string(),
	})
	.refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Passwords don't match" });

type Values = z.infer<typeof schema>;

export default function ResetPasswordPage() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
		resolver: zodResolver(schema),
	});

	async function onSubmit() {
		await new Promise((r) => setTimeout(r, 400));
		toast.success("Password updated. Please log in.");
		router.push("/login");
	}

	return (
		<div>
			<h1 className="font-display text-3xl font-bold tracking-tight">Set a new password</h1>
			<p className="mt-1 text-sm text-muted-foreground">Choose something strong and unique.</p>
			<form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-3">
				<div className="space-y-1.5">
					<Label htmlFor="password">New password <span className="text-danger">*</span></Label>
					<div className="relative">
						<Input id="password" type={showPassword ? "text" : "password"} {...register("password")} />
						<button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
							{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
						</button>
					</div>
					<div className="min-h-[16px]">
						{errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
					</div>
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="confirm">Confirm password <span className="text-danger">*</span></Label>
					<div className="relative">
						<Input id="confirm" type={showConfirm ? "text" : "password"} {...register("confirm")} />
						<button type="button" tabIndex={-1} onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
							{showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
						</button>
					</div>
					<div className="min-h-[16px]">
						{errors.confirm && <p className="text-xs text-danger">{errors.confirm.message}</p>}
					</div>
				</div>
				<Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
					{isSubmitting ? "Saving…" : "Update password"}
				</Button>
			</form>
			<div className="mt-6 text-center text-sm text-muted-foreground">
				<Link href="/login" className="hover:text-foreground">Back to login</Link>
			</div>
		</div>
	);
}
