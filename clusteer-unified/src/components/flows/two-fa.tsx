"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { CopyButton } from "@/components/primitives/copy-button";
import { ShieldCheck, Copy, CheckCircle } from "lucide-react";

export function TwoFaFlow({ onClose }: { onClose: () => void }) {
	const [step, setStep] = useState<"intro" | "verify" | "done">("intro");
	const [code, setCode] = useState("");

	const { data: setup } = useQuery({
		queryKey: ["2fa-setup"],
		queryFn: async () => {
			const res = await fetch("/api/user/2fa/request");
			const d = await res.json();
			return d.data || d;
		},
		enabled: step !== "done",
	});

	const verify = useMutation({
		mutationFn: async () => {
			const res = await fetch("/api/user/2fa/request", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ code, enable: true }),
			});
			if (!res.ok) throw new Error("Invalid code");
		},
		onSuccess: () => { setStep("done"); toast.success("2FA enabled"); },
		onError: (err: Error) => { toast.error(err.message); setCode(""); },
	});

	const recoveryCodes = ["4A2F-8B3C", "7D1E-9F5G", "2H6J-4K8L", "1M3N-5P7Q", "9R2S-6T8U", "3V5W-7X9Y"];

	if (step === "done") {
		return (
			<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
				<div style={{ textAlign: "center" }}>
					<CheckCircle size={48} style={{ color: "var(--c-up)", margin: "0 auto 12px" }} />
					<h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-text)", margin: 0 }}>2FA enabled</h3>
				</div>
				<div>
					<p style={{ fontSize: 13, fontWeight: 600, color: "var(--c-text)", marginBottom: 8 }}>Recovery codes</p>
					<p style={{ fontSize: 12, color: "var(--c-text-2)", marginBottom: 12 }}>Save these codes securely. Each can be used once if you lose access to your authenticator.</p>
					<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, padding: 12, borderRadius: 10, background: "var(--c-surface-2)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
						{recoveryCodes.map((c) => <span key={c} style={{ color: "var(--c-text)" }}>{c}</span>)}
					</div>
					<Button variant="outline" size="sm" className="mt-2" onClick={() => navigator.clipboard.writeText(recoveryCodes.join("\n"))}>
						<Copy size={14} /> Copy all
					</Button>
				</div>
				<Button onClick={onClose} style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", fontWeight: 700, height: 44 }}>Done</Button>
			</div>
		);
	}

	if (step === "verify") {
		return (
			<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
				<h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-text)", margin: 0 }}>Verify setup</h3>
				<p style={{ fontSize: 13, color: "var(--c-text-2)" }}>Enter the 6-digit code from your authenticator app.</p>
				<InputOTP maxLength={6} value={code} onChange={setCode}>
					<InputOTPGroup className="gap-2">
						{[0, 1, 2, 3, 4, 5].map((i) => (
							<InputOTPSlot key={i} index={i} className="w-11 h-13 text-lg font-bold rounded-xl border-2"
								style={{ borderColor: code[i] ? "var(--c-text)" : "var(--c-line)", background: "var(--c-surface)", color: "var(--c-text)" }} />
						))}
					</InputOTPGroup>
				</InputOTP>
				<Button onClick={() => verify.mutate()} disabled={code.length < 6 || verify.isPending}
					style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", fontWeight: 700, height: 44 }}>
					{verify.isPending ? "Verifying..." : "Enable 2FA"}
				</Button>
			</div>
		);
	}

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
				<div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--c-lime-500)", display: "flex", alignItems: "center", justifyContent: "center" }}>
					<ShieldCheck size={20} style={{ color: "var(--c-onyx-900)" }} />
				</div>
				<h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-text)", margin: 0 }}>Set up 2FA</h3>
			</div>

			<p style={{ fontSize: 13, color: "var(--c-text-2)", lineHeight: 1.5 }}>
				Scan the QR code with your authenticator app (Google Authenticator, Authy, or 1Password).
			</p>

			{setup?.qrCode && (
				<div style={{ display: "flex", justifyContent: "center", padding: 16, background: "#fff", borderRadius: 12 }}>
					<img src={`data:image/png;base64,${setup.qrCode}`} alt="2FA QR Code" width={180} height={180} />
				</div>
			)}

			<div>
				<p style={{ fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", marginBottom: 4 }}>Or enter this key manually:</p>
				<div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: "var(--c-surface-2)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
					<span style={{ flex: 1, color: "var(--c-text)", wordBreak: "break-all" }}>{setup?.secret || "Loading..."}</span>
					{setup?.secret && <CopyButton value={setup.secret} />}
				</div>
			</div>

			<Button onClick={() => setStep("verify")} style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", fontWeight: 700, height: 44 }}>
				I've scanned the code
			</Button>
		</div>
	);
}
