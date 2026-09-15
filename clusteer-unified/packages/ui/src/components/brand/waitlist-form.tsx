"use client";
import { useId, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
export function WaitlistForm() {
	const id = useId();
	const [email, setEmail] = useState("");
	const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [message, setMessage] = useState("");
	const [submittedEmail, setSubmittedEmail] = useState("");
	async function submit(e: React.FormEvent) {
		e.preventDefault();
		if (state === "loading") return;
		const address = email.trim();
		setSubmittedEmail(address);
		setState("loading");
		try {
			const res = await fetch("/api/waitlist", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: address }),
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok || !data.status)
				throw new Error(data.message || "We couldn’t add you. Please try again.");
			setState("success");
			setMessage(data.message || "We’ll email you when access opens.");
		} catch (error) {
			setState("error");
			setMessage(
				error instanceof TypeError || !(error instanceof Error)
					? "We couldn’t connect. Check your connection and try again."
					: error.message
			);
		}
	}
	return (
		<div className="cl-waitlist">
			{state === "success" ? (
				<div className="cl-waitlist-success" role="status">
					<Check size={22} />
					<div>
						<strong>You’re on the list.</strong>
						<p>{message}</p>
						<p className="cl-submitted-email">{submittedEmail}</p>
					</div>
				</div>
			) : (
				<form onSubmit={submit} aria-busy={state === "loading"}>
					<label className="sr-only" htmlFor={id}>
						Email address
					</label>
					<input
						id={id}
						type="email"
						autoComplete="email"
						placeholder="Your email address"
						required
						disabled={state === "loading"}
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							if (state === "error") setState("idle");
						}}
						aria-describedby={`${id}-message`}
					/>
					<button className="cl-button" type="submit" disabled={state === "loading"}>
						{state === "loading" ? (
							"Joining…"
						) : (
							<>
								Join the waitlist <ArrowRight size={16} />
							</>
						)}
					</button>
				</form>
			)}
			<p
				id={`${id}-message`}
				className={state === "error" ? "cl-form-error" : "cl-form-note"}
				role={state === "error" ? "alert" : undefined}
			>
				{state === "error"
					? message
					: state === "success"
						? "No payment or wallet connection was needed."
						: "Just your email. No payment or wallet connection."}
			</p>
		</div>
	);
}
