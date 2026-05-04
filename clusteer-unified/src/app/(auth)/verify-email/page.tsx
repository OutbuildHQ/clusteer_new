"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/stores/auth";

export default function VerifyEmailPage() {
	const router = useRouter();
	const { email, signIn } = useAuth();
	const [code, setCode] = useState("");

	async function submit() {
		if (code.length !== 6) return;
		await new Promise((r) => setTimeout(r, 400));
		signIn(email ?? "user@example.ng");
		toast.success("Email verified");
		router.push("/dashboard");
	}

	return (
		<div>
			<div className="flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
				<MailCheck className="size-5" />
			</div>
			<h1 className="mt-5 font-display text-2xl sm:text-3xl font-bold tracking-tight">Verify your email</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>.
			</p>
			<div className="mt-8">
				<InputOTP maxLength={6} value={code} onChange={setCode}>
					<InputOTPGroup>
						{Array.from({ length: 6 }).map((_, i) => <InputOTPSlot key={i} index={i} />)}
					</InputOTPGroup>
				</InputOTP>
			</div>
			<Button size="lg" className="mt-6 w-full min-h-[52px] text-[15px] font-bold shadow-brutal-sm" disabled={code.length !== 6} onClick={submit}>
				Verify email
			</Button>
			<div className="mt-6 text-center text-sm text-muted-foreground">
				<Link href="/login" className="hover:text-foreground inline-flex items-center min-h-[44px]">Back to login</Link>
			</div>
		</div>
	);
}
