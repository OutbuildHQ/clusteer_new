"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MailCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/stores/auth";

export default function VerifyEmailPage() {
	const { email } = useAuth();
	const [resending, setResending] = useState(false);
	const [resent, setResent] = useState(false);

	async function resend() {
		if (!email || resending) return;
		setResending(true);
		try {
			const res = await fetch("/api/auth-firebase/resend-verification", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			const data = await res.json();
			if (res.ok) {
				setResent(true);
				toast.success("Verification email sent — check your inbox");
			} else {
				toast.error(data.message || "Failed to resend. Please try again.");
			}
		} catch {
			toast.error("Unable to connect. Please try again.");
		} finally {
			setResending(false);
		}
	}

	return (
		<div>
			<div className="flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
				<MailCheck className="size-5" />
			</div>

			<h1 className="mt-5 font-display text-2xl sm:text-3xl font-bold tracking-tight">Verify your email</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				We sent a verification link to{" "}
				<span className="font-semibold text-foreground">{email ?? "your email address"}</span>.
				Click the link in that email to activate your account.
			</p>

			<div className="mt-6 rounded-lg border border-brand-100 bg-brand-50/40 p-4 text-sm space-y-1.5">
				<p className="font-semibold text-foreground">What to do next</p>
				<ol className="list-decimal list-inside space-y-1 text-muted-foreground">
					<li>Open your email inbox (check spam too)</li>
					<li>Click the <span className="font-medium text-foreground">Verify email</span> link</li>
					<li>Return here and log in</li>
				</ol>
			</div>

			<div className="mt-6 space-y-3">
				<Button
					size="lg"
					variant="outline"
					className="w-full min-h-[52px]"
					onClick={resend}
					disabled={resending || resent}
				>
					<RefreshCw className={`size-4 mr-2 ${resending ? "animate-spin" : ""}`} />
					{resent ? "Email sent" : resending ? "Sending\u2026" : "Resend verification email"}
				</Button>

				<Link
					href="/login"
					className="flex items-center justify-center min-h-[44px] text-sm font-semibold text-brand-800 hover:underline"
				>
					Already verified? Log in &rarr;
				</Link>
			</div>

			<div className="mt-8 text-center">
				<Link href="/login" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center min-h-[44px]">
					Back to login
				</Link>
			</div>
		</div>
	);
}
