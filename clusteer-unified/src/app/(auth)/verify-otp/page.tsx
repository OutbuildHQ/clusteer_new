"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/stores/auth";

function VerifyOtpContent() {
	const router = useRouter();
	const params = useSearchParams();
	const flow = params.get("flow") ?? "login";
	const [code, setCode] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const { email, completeTwoFactor, signIn } = useAuth();

	async function submit() {
		if (code.length !== 6 || submitting) return;
		setSubmitting(true);

		try {
			if (flow === "login") {
				// Validate the TOTP against the server — pending_2fa_token cookie is sent automatically
				const res = await fetch("/api/auth-firebase/verify-2fa", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ code }),
				});
				const data = await res.json();

				if (!res.ok || !data.status) {
					toast.error(data.message || "Invalid code. Please try again.");
					setCode("");
					return;
				}

				completeTwoFactor();
				toast.success("Verified. Welcome back.");
				window.location.href = "/dashboard";
			} else {
				// Non-login OTP flows (e.g. email change) — complete sign-in
				signIn(email ?? "");
				toast.success("Verified.");
				router.push("/dashboard");
			}
		} catch {
			toast.error("Unable to connect. Please try again.");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div>
			<h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Enter your code</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				{flow === "login"
					? "Open Google Authenticator and enter the 6-digit code for Clusteer."
					: <>We sent a 6-digit code to <span className="font-medium text-foreground">{email ?? "your email"}</span>.</>
				}
			</p>

			<div className="mt-8">
				<InputOTP
					maxLength={6}
					value={code}
					onChange={setCode}
					onComplete={submit}
				>
					<InputOTPGroup>
						{Array.from({ length: 6 }).map((_, i) => <InputOTPSlot key={i} index={i} />)}
					</InputOTPGroup>
				</InputOTP>
			</div>

			<Button
				size="lg"
				className="mt-6 w-full min-h-[52px] text-[15px] font-bold btn-shine shadow-brutal-sm"
				disabled={code.length !== 6 || submitting}
				onClick={submit}
			>
				{submitting ? "Verifying\u2026" : "Verify"}
			</Button>

			{flow !== "login" && (
				<div className="mt-6 text-center text-sm text-muted-foreground">
					Didn&apos;t receive a code?{" "}
					<button
						className="font-medium text-primary hover:underline min-h-[44px] inline-flex items-center"
						onClick={() => toast.info("Check your email or contact support to resend.")}
					>
						Resend
					</button>
				</div>
			)}

			<div className="mt-3 text-center">
				<Link href="/login" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center min-h-[44px]">Back to login</Link>
			</div>
		</div>
	);
}

export default function VerifyOtpPage() {
	return (
		<Suspense fallback={<div className="text-center text-muted-foreground py-12">Loading&hellip;</div>}>
			<VerifyOtpContent />
		</Suspense>
	);
}
