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
	name: z.string().min(2, "Enter your full name"),
	email: z.string().email("Enter a valid email"),
	phone: z.string().regex(/^(\+234|0)(7|8|9)(0|1)\d{8}$/, "Enter a valid Nigerian phone number (e.g. 08012345678)"),
	password: z.string().min(8, "At least 8 characters").regex(/[A-Z]/, "Add an uppercase letter").regex(/[0-9]/, "Add a number"),
	terms: z.literal(true, { errorMap: () => ({ message: "Accept the terms to continue" }) }),
});
type FormValues = z.infer<typeof schema>;

export default function SignupPage() {
	const router = useRouter();
	const requireTwoFactor = useAuth((s) => s.requireTwoFactor);
	const [showPassword, setShowPassword] = useState(false);
	const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
		resolver: zodResolver(schema),
	});

	async function onSubmit(values: FormValues) {
		await new Promise((r) => setTimeout(r, 500));
		requireTwoFactor(values.email);
		toast.success("Check your inbox for the verification code");
		router.push("/verify-email");
	}

	return (
		<div>
			<p className="mb-2 font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-brand-800">&#9670; Get started</p>
			<h1 className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.03em]">Create your account</h1>
			<p className="mt-1.5 text-sm text-muted-foreground">Free to open. Takes 60 seconds.</p>

			<form onSubmit={handleSubmit(onSubmit)} className="mt-6 sm:mt-8 space-y-4">
				<div className="space-y-1.5">
					<Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide">Full name <span className="text-danger">*</span></Label>
					<Input id="name" placeholder="John Doe" className="min-h-[48px]" {...register("name")} />
					<div className="min-h-[16px]">
						{errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
					</div>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide">Email <span className="text-danger">*</span></Label>
					<Input id="email" type="email" placeholder="you@example.com" autoComplete="email" className="min-h-[48px]" {...register("email")} />
					<div className="min-h-[16px]">
						{errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
					</div>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wide">Phone <span className="text-danger">*</span></Label>
					<Input id="phone" type="tel" placeholder="08012345678" className="min-h-[48px]" {...register("phone")} />
					<div className="min-h-[16px]">
						{errors.phone && <p className="text-xs text-danger">{errors.phone.message}</p>}
					</div>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide">Password <span className="text-danger">*</span></Label>
					<div className="relative">
						<Input id="password" type={showPassword ? "text" : "password"} placeholder="Min. 8 characters" className="min-h-[48px]" {...register("password")} />
						<button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-wide text-muted-foreground hover:text-foreground">
							{showPassword ? "Hide" : "Show"}
						</button>
					</div>
					<div className="min-h-[16px]">
						{errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
					</div>
					<p className="text-[11px] text-muted-foreground">8+ characters, one uppercase, one number.</p>
				</div>

				<label className="flex items-start gap-2.5 text-sm min-h-[44px]">
					<Checkbox className="mt-0.5" {...register("terms")} />
					<span className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
						I agree to the <Link href="/terms-of-service" className="font-bold text-custom-black hover:underline">Terms</Link> and acknowledge the{" "}
						<Link href="/privacy-policy" className="font-bold text-custom-black hover:underline">Privacy Policy</Link>.
					</span>
				</label>
				{errors.terms && <p className="text-xs text-danger">{errors.terms.message}</p>}

				<Button type="submit" size="lg" className="w-full min-h-[52px] text-[15px] font-bold btn-shine shadow-brutal-sm" disabled={isSubmitting}>
					{isSubmitting ? "Creating\u2026" : "Create account"}
				</Button>
			</form>

			<p className="mt-6 text-center text-sm text-muted-foreground">
				Already have an account?{" "}
				<Link href="/login" className="font-bold text-custom-black hover:underline">Log in</Link>
			</p>
		</div>
	);
}
