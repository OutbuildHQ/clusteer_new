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

const schema = z
	.object({
		password: z.string().min(8, "At least 8 characters"),
		confirm: z.string(),
	})
	.refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Passwords don't match" });

type Values = z.infer<typeof schema>;

export default function ResetPasswordPage() {
	const router = useRouter();
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
			<form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
				<div className="space-y-2">
					<Label htmlFor="password">New password</Label>
					<Input id="password" type="password" {...register("password")} />
					{errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
				</div>
				<div className="space-y-2">
					<Label htmlFor="confirm">Confirm password</Label>
					<Input id="confirm" type="password" {...register("confirm")} />
					{errors.confirm && <p className="text-xs text-danger">{errors.confirm.message}</p>}
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
