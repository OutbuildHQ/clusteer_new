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
	name: z.string().min(2, "Enter your full name"),
	email: z.string().email("Enter a valid email"),
	phone: z.string().min(10, "Enter your phone"),
	password: z.string().min(8, "At least 8 characters").regex(/[A-Z]/, "Add an uppercase letter").regex(/[0-9]/, "Add a number"),
	terms: z.literal(true, { errorMap: () => ({ message: "Accept the terms to continue" }) }),
});
type FormValues = z.infer<typeof schema>;

export default function SignupPage() {
	const router = useRouter();
	const requireTwoFactor = useAuth((s) => s.requireTwoFactor);
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
			<h1 className="font-display text-3xl font-bold tracking-tight">Create your account</h1>
			<p className="mt-1 text-sm text-muted-foreground">Free to open. Takes 60 seconds.</p>
			<form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
				<div className="space-y-2">
					<Label htmlFor="name">Full name</Label>
					<Input id="name" {...register("name")} />
					{errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
				</div>
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input id="email" type="email" autoComplete="email" {...register("email")} />
					{errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
				</div>
				<div className="space-y-2">
					<Label htmlFor="phone">Phone number</Label>
					<Input id="phone" type="tel" placeholder="+234…" {...register("phone")} />
					{errors.phone && <p className="text-xs text-danger">{errors.phone.message}</p>}
				</div>
				<div className="space-y-2">
					<Label htmlFor="password">Password</Label>
					<Input id="password" type="password" {...register("password")} />
					{errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
					<p className="text-xs text-muted-foreground">8+ characters with a number and uppercase letter.</p>
				</div>
				<label className="flex items-start gap-2 text-sm">
					<Checkbox className="mt-0.5" {...register("terms")} />
					<span className="text-muted-foreground">
						I agree to the <Link href="#" className="text-primary hover:underline">Terms</Link> and acknowledge the{" "}
						<Link href="#" className="text-primary hover:underline">Privacy Policy</Link>.
					</span>
				</label>
				{errors.terms && <p className="text-xs text-danger">{errors.terms.message}</p>}
				<Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
					{isSubmitting ? "Creating…" : "Create account"}
				</Button>
			</form>
			<p className="mt-6 text-center text-sm text-muted-foreground">
				Already have an account? <Link href="/login" className="font-medium text-primary hover:underline">Log in</Link>
			</p>
		</div>
	);
}
