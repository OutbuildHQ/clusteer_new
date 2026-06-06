"use client";

import { useState, useCallback } from "react";
import { ShieldCheck, ArrowLeft, Clock } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import type { QxOrder } from "@/lib/types";

type Props = {
	order: QxOrder;
	onVerified: (order: QxOrder) => void;
	onBack: () => void;
};

export function OrderOtp({ order, onVerified, onBack }: Props) {
	const [code, setCode] = useState("");
	const [countdown, setCountdown] = useState(42);
	const [verifying, setVerifying] = useState(false);

	const handleVerify = useCallback(() => {
		setVerifying(true);
		// Demo: simulate OTP verification with a short delay
		setTimeout(() => {
			onVerified({ ...order, status: order.side === "buy" ? "awaiting_payment" : "awaiting_deposit" });
		}, 500);
	}, [order, onVerified]);

	const sideLabel = order.side === "buy" ? "buy" : "sell";

	return (
		<div className="flex flex-col gap-5">
			{/* Back button */}
			<button
				onClick={onBack}
				className="flex items-center gap-1.5 bg-none border-none cursor-pointer text-ds-text-2 text-[13px] font-semibold p-0"
			>
				<ArrowLeft size={16} /> Back
			</button>

			{/* Icon */}
			<div className="w-14 h-14 rounded-[14px] bg-lime-500 flex items-center justify-center">
				<ShieldCheck size={26} className="text-onyx-900" />
			</div>

			{/* Title */}
			<div>
				<h2 className="text-[22px] font-bold text-ds-text tracking-[-0.03em] m-0">
					Verify it&apos;s you
				</h2>
				<p className="text-[14px] text-ds-text-2 mt-1.5 leading-normal">
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
								className={`w-12 h-14 text-xl font-bold rounded-xl border-2 bg-ds-surface text-ds-text tabular-nums ${
									code[i] ? "border-ds-text" : "border-ds-line"
								}`}
							/>
						))}
					</InputOTPGroup>
				</InputOTP>
			</div>

			{/* Resend */}
			<div className="flex items-center gap-1.5 text-[13px] text-ds-text-2">
				<Clock size={14} />
				{countdown > 0 ? (
					<span>Resend code in 0:{countdown.toString().padStart(2, "0")}</span>
				) : (
					<button
						onClick={() => setCountdown(42)}
						className="bg-none border-none text-lime-500 font-semibold cursor-pointer p-0"
					>
						Resend code
					</button>
				)}
			</div>

			{/* CTA */}
			<button
				disabled={code.length < 6 || verifying}
				onClick={handleVerify}
				className={`w-full h-12 rounded-[10px] border-none bg-lime-500 text-onyx-900 font-semibold text-[15px] font-sans transition-opacity duration-150 ${
					code.length < 6
						? "cursor-not-allowed opacity-45 pointer-events-none"
						: verifying
							? "cursor-pointer opacity-70"
							: "cursor-pointer opacity-100"
				}`}
			>
				{verifying ? "Verifying…" : `Authorise ${sideLabel} order`}
			</button>
		</div>
	);
}
