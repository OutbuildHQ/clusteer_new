"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/stores/auth";

export default function VerifyOtpPage() {
	const router = useRouter();
	const params = useSearchParams();
	const flow = params.get("flow") ?? "login";
	const [code, setCode] = useState("");
	const { email, completeTwoFactor, signIn } = useAuth();

	async function submit() {
		if (code.length !== 6) return;
		await new Promise((r) => setTimeout(r, 400));
		if (flow === "login") completeTwoFactor();
		else signIn(email ?? "user@example.ng");
		toast.success("Verified. Welcome back.");
		router.push("/dashboard");
	}

	return (
		<div>
			<h1 className="font-display text-3xl font-bold tracking-tight">Enter your code</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				We sent a 6-digit code to <span className="font-medium text-foreground">{email ?? "your email"}</span>.
			</p>
			<div className="mt-8">
				<InputOTP maxLength={6} value={code} onChange={setCode}>
					<InputOTPGroup>
						{Array.from({ length: 6 }).map((_, i) => <InputOTPSlot key={i} index={i} />)}
					</InputOTPGroup>
				</InputOTP>
			</div>
			<Button size="lg" className="mt-6 w-full" disabled={code.length !== 6} onClick={submit}>
				Verify
			</Button>
			<div className="mt-6 text-center text-sm text-muted-foreground">
				Didn&apos;t receive a code?{" "}
				<button className="font-medium text-primary hover:underline" onClick={() => toast.success("Code resent")}>
					Resend
				</button>
			</div>
			<div className="mt-3 text-center">
				<Link href="/login" className="text-xs text-muted-foreground hover:text-foreground">Back to login</Link>
			</div>
		</div>
	);
}
