"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ShieldCheck, ArrowLeft, Clock } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import type { QxOrder } from "@/lib/types";

type Props = {
	order: QxOrder;
	onVerified: (order: QxOrder) => void;
	onBack: () => void;
};

export function OrderOtp({ order, onVerified, onBack }: Props) {
	const [code, setCode] = useState("");
	const [countdown, setCountdown] = useState(42);

	const verify = useMutation({
		mutationFn: async () => {
			const res = await fetch("/api/order/otp/validate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ orderId: order.id, otpCode: code }),
			});
			const data = await res.json();
			if (!res.ok || !data.status) throw new Error(data.message || "OTP verification failed");
			return data.data as QxOrder;
		},
		onSuccess: (verified) => onVerified(verified),
		onError: (err: Error) => {
			toast.error(err.message);
			setCode("");
		},
	});

	const resend = useMutation({
		mutationFn: async () => {
			const res = await fetch("/api/order/otp/resend", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ orderId: order.id }),
			});
			const data = await res.json();
			if (!res.ok || !data.status) throw new Error(data.message || "Failed to resend OTP");
		},
		onSuccess: () => {
			toast.success("OTP resent");
			setCountdown(42);
		},
		onError: (err: Error) => toast.error(err.message),
	});

	const sideLabel = order.side === "buy" ? "buy" : "sell";

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
			{/* Back button */}
			<button
				onClick={onBack}
				style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "var(--c-text-2)", fontSize: 13, fontWeight: 600, padding: 0 }}
			>
				<ArrowLeft size={16} /> Back
			</button>

			{/* Icon */}
			<div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--c-lime-500)", display: "flex", alignItems: "center", justifyContent: "center" }}>
				<ShieldCheck size={26} style={{ color: "var(--c-onyx-900)" }} />
			</div>

			{/* Title */}
			<div>
				<h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--c-text)", letterSpacing: "-0.03em", margin: 0 }}>
					Verify it&apos;s you
				</h2>
				<p style={{ fontSize: 14, color: "var(--c-text-2)", marginTop: 6, lineHeight: 1.5 }}>
					Enter the 6-digit code sent to your registered phone number to authorise this {sideLabel} order.
				</p>
			</div>

			{/* OTP Input */}
			<div>
				<InputOTP maxLength={6} value={code} onChange={setCode}>
					<InputOTPGroup className="gap-2">
						{[0, 1, 2, 3, 4, 5].map((i) => (
							<InputOTPSlot
								key={i}
								index={i}
								className="w-12 h-14 text-xl font-bold rounded-xl border-2"
								style={{
									borderColor: code[i] ? "var(--c-text)" : "var(--c-line)",
									background: "var(--c-surface)",
									color: "var(--c-text)",
									fontVariantNumeric: "tabular-nums",
								}}
							/>
						))}
					</InputOTPGroup>
				</InputOTP>
			</div>

			{/* Resend */}
			<div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--c-text-2)" }}>
				<Clock size={14} />
				{countdown > 0 ? (
					<span>Resend code in 0:{countdown.toString().padStart(2, "0")}</span>
				) : (
					<button
						onClick={() => resend.mutate()}
						disabled={resend.isPending}
						style={{ background: "none", border: "none", color: "var(--c-lime-500)", fontWeight: 600, cursor: "pointer", padding: 0 }}
					>
						Resend code
					</button>
				)}
			</div>

			{/* CTA */}
			<Button
				size="lg"
				className="w-full"
				disabled={code.length < 6 || verify.isPending}
				onClick={() => verify.mutate()}
				style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", fontWeight: 700, fontSize: 15 }}
			>
				{verify.isPending ? "Verifying…" : `Authorise ${sideLabel} order`}
			</Button>
		</div>
	);
}
