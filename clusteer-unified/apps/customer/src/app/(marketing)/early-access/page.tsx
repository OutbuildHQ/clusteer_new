"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Bolt, ShieldCheck, Lock, Sparkles } from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";

const PERKS = [
	{ icon: Bolt, title: "First in line", body: "Skip the queue when access opens — waitlist members get in before public launch." },
	{ icon: ShieldCheck, title: "Best launch rates", body: "Founding members get our sharpest USDT/USDC → naira rates, locked in at go-live." },
	{ icon: Lock, title: "Non-custodial", body: "You always hold your own keys. We never take custody of your crypto." },
];

export default function EarlyAccessPage() {
	const [email, setEmail] = useState("");
	const [state, setState] = useState<FormState>("idle");
	const [message, setMessage] = useState("");

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (state === "loading") return;
		setState("loading");
		try {
			const res = await fetch("/api/waitlist", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			const data = await res.json().catch(() => ({}));
			if (res.ok && data.status) {
				setState("success");
				setMessage(data.message || "You're on the list.");
			} else {
				setState("error");
				setMessage(data.message || "Something went wrong. Please try again.");
			}
		} catch {
			setState("error");
			setMessage("Network error — please try again.");
		}
	}

	return (
		<main className="pb-[clamp(72px,9vw,120px)]">
			{/* Hero */}
			<section className="relative overflow-hidden">
				<div className="mx-auto max-w-[760px] px-4 sm:px-8 py-14 sm:py-20 lg:py-24 text-center">
					{/* Announce pill */}
					<div className="inline-flex items-center gap-2 rounded-full border-2 border-custom-black bg-white px-3 py-1.5 text-[11px] sm:text-[13px] font-medium shadow-brutal-sm mb-7 sm:mb-9">
						<span className="rounded-full bg-light-green px-2 sm:px-2.5 py-0.5 font-display text-[11px] font-bold tracking-wide text-custom-black shrink-0">SOON</span>
						<span className="inline-flex items-center gap-1.5">
							<span className="live-dot size-2 rounded-full bg-custom-black" />
							Clusteer is launching soon
						</span>
					</div>

					<h1 className="font-display text-[clamp(34px,8vw,76px)] font-bold leading-[0.95] tracking-[-0.04em]">
						Be first to{" "}<span className="lime-highlight">cash out.</span>
					</h1>
					<p className="mx-auto mt-5 sm:mt-6 max-w-[520px] text-[15px] sm:text-[18px] text-muted-foreground leading-[1.55]">
						We&apos;re putting the finishing touches on Clusteer. Join the waitlist and we&apos;ll let you know the moment you can off-ramp <strong className="text-foreground">USDT &amp; USDC</strong> straight to your Nigerian bank.
					</p>

					{/* Form / success */}
					<div className="mx-auto mt-8 sm:mt-10 max-w-[480px]">
						{state === "success" ? (
							<div className="flex items-center gap-3 rounded-2xl border-2 border-custom-black bg-light-green px-5 py-4 text-left shadow-brutal-sm">
								<span className="grid size-9 shrink-0 place-items-center rounded-full bg-custom-black text-light-green">
									<Check className="size-5" strokeWidth={2.6} />
								</span>
								<div>
									<div className="font-display font-bold text-custom-black">You&apos;re on the list.</div>
									<div className="text-[13px] text-custom-black/75">{message}</div>
								</div>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
								<input
									type="email"
									required
									autoComplete="email"
									value={email}
									onChange={(e) => {
										setEmail(e.target.value);
										if (state === "error") setState("idle");
									}}
									placeholder="you@email.com"
									aria-label="Email address"
									className="h-14 flex-1 rounded-2xl border-2 border-custom-black bg-white px-5 text-base font-medium text-foreground placeholder:text-muted-foreground/60 shadow-brutal-sm outline-none transition-transform focus:-translate-y-0.5"
								/>
								<Button
									type="submit"
									size="xl"
									disabled={state === "loading"}
									className="btn-shine shadow-brutal w-full sm:w-auto text-base sm:text-[17px] disabled:opacity-70"
								>
									{state === "loading" ? "Joining…" : <>Join the waitlist <ArrowRight className="size-5" /></>}
								</Button>
							</form>
						)}

						{state === "error" && (
							<p className="mt-3 text-left text-[13px] font-medium text-red-600">{message}</p>
						)}
					</div>

					{/* Trust row */}
					<div className="mt-7 sm:mt-9 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12px] sm:text-[13px] text-muted-foreground">
						<span className="inline-flex items-center gap-2"><Check className="size-3.5 text-custom-black/70" strokeWidth={2.6} /> <strong className="text-foreground">No spam</strong>, ever</span>
						<span className="inline-flex items-center gap-2"><Check className="size-3.5 text-custom-black/70" strokeWidth={2.6} /> <strong className="text-foreground">NDPR</strong> compliant</span>
						<span className="inline-flex items-center gap-2"><Check className="size-3.5 text-custom-black/70" strokeWidth={2.6} /> One-tap unsubscribe</span>
					</div>
				</div>
			</section>

			{/* Perks */}
			<section className="px-4 sm:px-8 max-w-[1080px] mx-auto">
				<div className="grid gap-4 sm:gap-5 sm:grid-cols-3">
					{PERKS.map((p) => (
						<div key={p.title} className="rounded-[22px] border-2 border-custom-black bg-white p-6 shadow-brutal-sm">
							<span className="grid size-11 place-items-center rounded-2xl bg-warm-beige border-2 border-custom-black text-custom-black">
								<p.icon className="size-5" strokeWidth={2.2} />
							</span>
							<h3 className="mt-4 font-display text-[19px] font-bold tracking-[-0.01em]">{p.title}</h3>
							<p className="mt-1.5 text-[14px] text-muted-foreground leading-[1.5]">{p.body}</p>
						</div>
					))}
				</div>

				{/* Secondary line */}
				<div className="mt-10 sm:mt-12 flex flex-col items-center gap-3 text-center">
					<span className="inline-flex items-center gap-2 font-mono text-xs font-medium text-custom-black/70 tracking-wider">
						<Sparkles className="size-3.5" /> ALREADY HAVE ACCESS?
					</span>
					<Link href="/login" className="font-display font-bold text-custom-black underline underline-offset-4 hover:text-custom-black/70">
						Sign in to your account
					</Link>
				</div>
			</section>
		</main>
	);
}
