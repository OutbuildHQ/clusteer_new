"use client";

import { use, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { ArrowLeft, Upload, Camera, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const TYPE_META = {
	bvn: {
		label: "Bank Verification Number",
		abbr: "BVN",
		digits: 11,
		hint: "Your 11-digit BVN is the same across all Nigerian banks.",
		placeholder: "000 0000 0000",
	},
	nin: {
		label: "National Identity Number",
		abbr: "NIN",
		digits: 11,
		hint: "Your NIN is on your National ID card or NIMC slip.",
		placeholder: "0000 0000 000",
	},
} as const;

type KYCType = keyof typeof TYPE_META;

type Step = "number" | "selfie" | "processing" | "done";

function formatDigits(val: string, abbr: string): string {
	const digits = val.replace(/\D/g, "");
	if (abbr === "BVN") {
		if (digits.length <= 3) return digits;
		if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
		return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 11)}`;
	}
	// NIN: 4 4 3
	if (digits.length <= 4) return digits;
	if (digits.length <= 8) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
	return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 11)}`;
}

export default function VerifyTypePage({ params }: { params: Promise<{ type: string }> }) {
	const { type } = use(params);
	const meta = TYPE_META[type as KYCType];
	if (!meta) notFound();

	const router = useRouter();
	const [step, setStep] = useState<Step>("number");
	const [number, setNumber] = useState("");
	const [selfieFile, setSelfieFile] = useState<File | null>(null);
	const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const rawDigits = number.replace(/\D/g, "");
	const isNumberValid = rawDigits.length === meta.digits;

	function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
		const raw = e.target.value.replace(/\D/g, "").slice(0, meta.digits);
		setNumber(formatDigits(raw, meta.abbr));
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast.error("Please select an image file");
			return;
		}
		setSelfieFile(file);
		const url = URL.createObjectURL(file);
		setSelfiePreview(url);
	}

	async function handleSubmit() {
		if (!selfieFile) {
			toast.error("Please upload a selfie photo");
			return;
		}
		setSubmitting(true);
		setStep("processing");
		try {
			// ── Step 1: Submit BVN/NIN for identity verification ──────────────────
			const verifyRes = await fetch("/api/kyc/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					verificationType: meta.abbr,
					data: meta.abbr === "BVN" ? { bvn: rawDigits } : { nin: rawDigits },
				}),
			});
			const verifyData = await verifyRes.json();
			if (!verifyRes.ok && verifyRes.status !== 202) {
				toast.error(verifyData.message || "Verification failed. Please try again.");
				setStep("selfie");
				return;
			}

			// ── Step 2: Upload selfie document ────────────────────────────────────
			const uploadForm = new FormData();
			uploadForm.append("documentType", "id_card");
			uploadForm.append("selfie", selfieFile);
			const uploadRes = await fetch("/api/kyc/upload", { method: "POST", body: uploadForm });
			const uploadData = await uploadRes.json();
			if (!uploadRes.ok) {
				toast.error(uploadData.message || "Document upload failed. Please try again.");
				setStep("selfie");
				return;
			}

			setStep("done");
		} catch {
			toast.error("Network error. Please try again.");
			setStep("selfie");
		} finally {
			setSubmitting(false);
		}
	}

	/* ── Done ── */
	if (step === "done") {
		return (
			<div className="w-full lg:max-w-[478px] flex flex-col items-center text-center gap-5 py-8">
				<div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--c-up-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
					<CheckCircle2 style={{ color: "var(--c-up)" }} className="size-10" />
				</div>
				<div>
					<h1 className="font-semibold text-2xl" style={{ color: "var(--c-text)" }}>Submitted for review</h1>
					<p className="mt-2 text-[14px]" style={{ color: "var(--c-text-2)", lineHeight: 1.6 }}>
						Your {meta.abbr} and selfie have been submitted. Verification usually takes under 5 minutes.
						We&apos;ll notify you once it&apos;s complete.
					</p>
				</div>
				<button
					onClick={() => router.push("/identity-verification")}
					style={{ height: 44, padding: "0 32px", borderRadius: 9999, fontSize: 14, fontWeight: 600, background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", cursor: "pointer" }}
				>
					Back to verification
				</button>
			</div>
		);
	}

	/* ── Processing ── */
	if (step === "processing") {
		return (
			<div className="w-full lg:max-w-[478px] flex flex-col items-center text-center gap-4 py-12">
				<Loader2 className="size-10 animate-spin" style={{ color: "var(--c-lime-500)" }} />
				<p className="text-[14px] font-medium" style={{ color: "var(--c-text-2)" }}>Submitting your information…</p>
			</div>
		);
	}

	return (
		<div className="w-full lg:max-w-[478px]">
			{/* Header */}
			<header className="flex items-center gap-5 mb-6">
				<button
					onClick={step === "number" ? () => router.back() : () => setStep("number")}
					style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
				>
					<ArrowLeft className="size-6" style={{ color: "var(--c-text)" }} />
				</button>
				<div>
					<h1 className="font-semibold text-2xl" style={{ color: "var(--c-text)" }}>
						{step === "number" ? `Enter your ${meta.abbr}` : "Take a selfie"}
					</h1>
					<p className="text-[13px] mt-0.5" style={{ color: "var(--c-text-3)" }}>
						Step {step === "number" ? "1" : "2"} of 2
					</p>
				</div>
			</header>

			{/* Step indicator */}
			<div className="flex items-center gap-2 mb-7">
				{["number", "selfie"].map((s, i) => (
					<div
						key={s}
						style={{
							flex: 1,
							height: 4,
							borderRadius: 2,
							background: (step === "number" && i === 0) || step === "selfie" || i === 0 ? "var(--c-lime-500)" : "var(--c-line)",
							opacity: (step === "selfie" && i === 0) || (step === "number" && i === 0) ? 1 : step === "selfie" ? 1 : 0.35,
						}}
					/>
				))}
			</div>

			{/* ── Step 1: Number ── */}
			{step === "number" && (
				<div className="flex flex-col gap-6">
					<div>
						<label className="block text-[13px] font-medium mb-2" style={{ color: "var(--c-text)" }}>
							{meta.label}
						</label>
						<input
							type="tel"
							inputMode="numeric"
							value={number}
							onChange={handleNumberChange}
							placeholder={meta.placeholder}
							autoFocus
							style={{
								display: "block",
								width: "100%",
								height: 48,
								padding: "0 14px",
								border: `1px solid ${isNumberValid ? "var(--c-lime-500)" : "var(--c-line)"}`,
								borderRadius: 10,
								background: "var(--c-surface)",
								color: "var(--c-text)",
								fontSize: 20,
								fontFamily: "var(--f-mono, monospace)",
								letterSpacing: "0.08em",
								outline: "none",
								transition: "border-color 0.15s",
							}}
						/>
						<p className="mt-2 text-[12px]" style={{ color: "var(--c-text-3)" }}>{meta.hint}</p>
					</div>

					<div style={{ background: "var(--c-surface-2)", borderRadius: 10, padding: "12px 14px", fontSize: 12.5, color: "var(--c-text-2)", lineHeight: 1.6 }}>
						Your {meta.abbr} is encrypted and only used to verify your identity. We never share it with third parties.
					</div>

					<button
						disabled={!isNumberValid}
						onClick={() => setStep("selfie")}
						style={{
							height: 44,
							borderRadius: 9999,
							fontSize: 14,
							fontWeight: 600,
							border: "none",
							background: isNumberValid ? "var(--c-lime-500)" : "var(--c-surface-2)",
							color: isNumberValid ? "var(--c-onyx-900)" : "var(--c-text-3)",
							cursor: isNumberValid ? "pointer" : "not-allowed",
							transition: "all 0.15s",
						}}
					>
						Continue
					</button>
				</div>
			)}

			{/* ── Step 2: Selfie ── */}
			{step === "selfie" && (
				<div className="flex flex-col gap-6">
					<div>
						<label className="block text-[13px] font-medium mb-3" style={{ color: "var(--c-text)" }}>
							Liveness photo
						</label>

						{selfiePreview ? (
							<div style={{ position: "relative", borderRadius: 14, overflow: "hidden", aspectRatio: "1", background: "var(--c-surface-2)" }}>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img src={selfiePreview} alt="Selfie preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
								<button
									onClick={() => { setSelfieFile(null); setSelfiePreview(null); }}
									style={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}
								>
									×
								</button>
							</div>
						) : (
							<button
								onClick={() => fileInputRef.current?.click()}
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									gap: 12,
									width: "100%",
									aspectRatio: "1",
									maxHeight: 280,
									borderRadius: 14,
									border: "2px dashed var(--c-line)",
									background: "var(--c-surface)",
									cursor: "pointer",
									transition: "border-color 0.15s",
								}}
								onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--c-lime-500)")}
								onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--c-line)")}
							>
								<div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--c-surface-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
									<Camera className="size-6" style={{ color: "var(--c-text-3)" }} />
								</div>
								<div>
									<p className="text-[13px] font-medium" style={{ color: "var(--c-text)" }}>Upload selfie photo</p>
									<p className="text-[11px] mt-1" style={{ color: "var(--c-text-3)" }}>JPG or PNG · Face clearly visible</p>
								</div>
								<div style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px", borderRadius: 8, background: "var(--c-surface-2)", fontSize: 13, fontWeight: 500, color: "var(--c-text)" }}>
									<Upload className="size-3.5" />
									Choose photo
								</div>
							</button>
						)}

						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							capture="user"
							onChange={handleFileChange}
							style={{ display: "none" }}
						/>
					</div>

					<ul style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
						{["Face fully visible and well-lit", "No sunglasses or hats", "Match the face on your ID"].map((tip) => (
							<li key={tip} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--c-text-2)" }}>
								<CheckCircle2 className="size-3.5 shrink-0" style={{ color: "var(--c-up)" }} />
								{tip}
							</li>
						))}
					</ul>

					<button
						disabled={!selfieFile || submitting}
						onClick={handleSubmit}
						style={{
							height: 44,
							borderRadius: 9999,
							fontSize: 14,
							fontWeight: 600,
							border: "none",
							background: selfieFile ? "var(--c-lime-500)" : "var(--c-surface-2)",
							color: selfieFile ? "var(--c-onyx-900)" : "var(--c-text-3)",
							cursor: selfieFile ? "pointer" : "not-allowed",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: 8,
							transition: "all 0.15s",
						}}
					>
						{submitting ? <><Loader2 className="size-4 animate-spin" />Submitting…</> : "Submit verification"}
					</button>
				</div>
			)}
		</div>
	);
}
