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
			{/* Icon badge — neobrutalist */}
			<div className="flex size-14 items-center justify-center rounded-2xl border-2 border-custom-black bg-light-green shadow-brutal-sm">
				<MailCheck className="size-6 text-custom-black" />
			</div>

			<h1 className="mt-5 font-display text-2xl sm:text-3xl font-bold tracking-tight text-custom-black">
				Verify your email
			</h1>
			<p className="mt-1.5 text-sm text-muted-foreground">
				We sent a verification link to{" "}
				<span className="font-semibold text-custom-black">{email ?? "your email address"}</span>.
				Click the link in that email to activate your account.
			</p>

			{/* Steps card — neobrutalist */}
			<div className="mt-6 rounded-2xl border-2 border-custom-black bg-warm-beige p-4 shadow-brutal-sm space-y-2">
				<p className="font-bold text-sm text-custom-black uppercase tracking-wide">What to do next</p>
				<ol className="list-decimal list-inside space-y-1.5 text-sm text-custom-black/70">
					<li>Open your email inbox <span className="text-custom-black/50">(check spam too)</span></li>
					<li>Click the <span className="font-semibold text-custom-black">Verify email</span> link</li>
					<li>Return here and log in</li>
				</ol>
			</div>

			<div className="mt-6 space-y-3">
				<Button
					size="lg"
					variant="outline"
					className="w-full min-h-[52px] border-2 border-custom-black font-bold shadow-brutal-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
					onClick={resend}
					disabled={resending || resent}
				>
					<RefreshCw className={`size-4 mr-2 ${resending ? "animate-spin" : ""}`} />
					{resent ? "Email sent ✓" : resending ? "Sending…" : "Resend verification email"}
				</Button>

				<Link
					href="/login"
					className="flex items-center justify-center min-h-[44px] text-sm font-bold text-custom-black hover:underline"
				>
					Already verified? Log in &rarr;
				</Link>
			</div>

			<div className="mt-8 text-center">
				<Link
					href="/login"
					className="text-xs text-muted-foreground hover:text-custom-black inline-flex items-center min-h-[44px] transition-colors"
				>
					&larr; Back to login
				</Link>
			</div>
		</div>
	);
}
