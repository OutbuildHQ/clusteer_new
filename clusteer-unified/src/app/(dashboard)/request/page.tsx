"use client";

import { useState } from "react";
import { QrCode, Copy, Check, ExternalLink } from "lucide-react";
import { QR } from "@/components/primitives/qr";
import { toast } from "sonner";

export default function RequestPage() {
	const [amt, setAmt] = useState("");
	const [cur, setCur] = useState("USDT");
	const [note, setNote] = useState("");
	const [stage, setStage] = useState<"form" | "share">("form");
	const [copied, setCopied] = useState(false);

	const handle = "adaeze";
	const link = `clusteer.app/pay/${handle}/${amt || 0}${cur.toLowerCase()}`;
	const ngnEquiv = (parseFloat(amt) || 0) * 1610;

	const copy = () => {
		navigator.clipboard?.writeText("https://" + link);
		setCopied(true);
		toast.success("Payment link copied");
		setTimeout(() => setCopied(false), 1400);
	};

	return (
		<div style={{ maxWidth: 680, margin: "0 auto", width: "100%" }}>
			<div style={{ marginBottom: 24 }}>
				<h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--c-text)", letterSpacing: "-0.03em", margin: 0 }}>
					Request payment
				</h1>
				<p style={{ fontSize: 14, color: "var(--c-text-2)", marginTop: 6 }}>
					Create a request anyone can pay — by QR or a link you share.
				</p>
			</div>

			{stage === "form" ? (
				<div style={{ background: "var(--c-surface)", borderRadius: 14, border: "1px solid var(--c-line)", padding: 24 }}>
					<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
						{/* Amount + currency */}
						<div>
							<label style={{ fontSize: 12, color: "var(--c-text-3)" }}>Amount</label>
							<div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "stretch" }}>
								<input
									type="number" min="0" placeholder="50" value={amt}
									onChange={(e) => setAmt(e.target.value)}
									style={{
										flex: 1, height: 48, borderRadius: 10, border: "1px solid var(--c-line)",
										padding: "0 14px", fontSize: 20, fontWeight: 600, color: "var(--c-text)",
										background: "var(--c-surface)", fontVariantNumeric: "tabular-nums",
									}}
								/>
								<div style={{ display: "flex", gap: 0, padding: 3, borderRadius: 10, background: "var(--c-surface-2)", width: 180 }}>
									{["USDT", "USDC", "NGN"].map((c) => (
										<button key={c} onClick={() => setCur(c)} style={{
											flex: 1, padding: "8px 0", borderRadius: 7, fontSize: 12, fontWeight: 600,
											border: "none", cursor: "pointer",
											background: cur === c ? "var(--c-surface)" : "transparent",
											color: cur === c ? "var(--c-text)" : "var(--c-text-3)",
											boxShadow: cur === c ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
										}}>
											{c}
										</button>
									))}
								</div>
							</div>
							{cur !== "NGN" && parseFloat(amt) > 0 && (
								<div style={{ fontSize: 12, color: "var(--c-text-3)", marginTop: 6, fontVariantNumeric: "tabular-nums" }}>
									≈ ₦{ngnEquiv.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
								</div>
							)}
						</div>

						{/* Note */}
						<div>
							<label style={{ fontSize: 12, color: "var(--c-text-3)" }}>Note (optional)</label>
							<input
								placeholder="What's it for?" value={note}
								onChange={(e) => setNote(e.target.value)}
								style={{
									width: "100%", height: 44, borderRadius: 10, border: "1px solid var(--c-line)",
									padding: "0 14px", fontSize: 14, color: "var(--c-text)", background: "var(--c-surface)", marginTop: 6,
								}}
							/>
						</div>

						{/* CTA */}
						<button
							onClick={() => setStage("share")}
							disabled={!amt || parseFloat(amt) <= 0}
							style={{
								display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
								width: "100%", height: 46, borderRadius: 12, border: "none", cursor: "pointer",
								background: amt && parseFloat(amt) > 0 ? "var(--c-lime-500)" : "var(--c-surface-3)",
								color: amt && parseFloat(amt) > 0 ? "var(--c-onyx-900)" : "var(--c-text-3)",
								fontWeight: 600, fontSize: 14,
							}}
						>
							<QrCode size={16} /> Create request
						</button>
					</div>
				</div>
			) : (
				<div style={{ background: "var(--c-surface)", borderRadius: 14, border: "1px solid var(--c-line)", padding: 24 }}>
					<div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16 }}>
						{/* Header */}
						<div style={{ fontSize: 12, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Requesting</div>
						<div style={{ fontSize: 34, fontWeight: 600, color: "var(--c-text)", fontVariantNumeric: "tabular-nums", fontFamily: "var(--f-display)" }}>
							{amt} {cur}
						</div>
						{cur !== "NGN" && (
							<div style={{ fontSize: 13, color: "var(--c-text-2)", marginTop: -8, fontVariantNumeric: "tabular-nums" }}>
								≈ ₦{ngnEquiv.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
							</div>
						)}
						{note && <div style={{ fontSize: 13.5, color: "var(--c-text)" }}>{note}</div>}

						{/* QR Code */}
						<div style={{ padding: 14, background: "#fff", borderRadius: 16, border: "1px solid var(--c-line)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "inline-block" }}>
							<QR value={"https://" + link} size={160} />
						</div>

						{/* Link */}
						<div style={{
							padding: "10px 14px", width: "100%", maxWidth: 420,
							display: "flex", alignItems: "center", gap: 10,
							background: "var(--c-surface-2)", borderRadius: 10,
						}}>
							<span style={{ flex: 1, fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "left", fontFamily: "var(--f-mono)", color: "var(--c-text)" }}>
								{link}
							</span>
							<button onClick={copy} style={{
								display: "flex", alignItems: "center", gap: 4, padding: "4px 10px",
								borderRadius: 6, border: "1px solid var(--c-line)", background: "var(--c-surface)",
								fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", cursor: "pointer",
							}}>
								{copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
							</button>
						</div>

						{/* Actions */}
						<div style={{ display: "flex", gap: 8, width: "100%", maxWidth: 420 }}>
							<button onClick={() => setStage("form")} style={{
								flex: 1, height: 42, borderRadius: 10, border: "1px solid var(--c-line)",
								background: "var(--c-surface)", color: "var(--c-text-2)", fontWeight: 600, fontSize: 13, cursor: "pointer",
							}}>
								New request
							</button>
							<button onClick={() => toast.success("Share sheet opened")} style={{
								flex: 1, height: 42, borderRadius: 10, border: "none",
								background: "var(--c-lime-500)", color: "var(--c-onyx-900)", fontWeight: 600, fontSize: 13,
								cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
							}}>
								<ExternalLink size={14} /> Share request
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
