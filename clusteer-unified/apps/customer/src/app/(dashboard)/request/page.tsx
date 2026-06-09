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
		<div className="max-w-[680px] mx-auto w-full">
			<div className="mb-6">
				<h1 className="text-[32px] font-semibold text-ds-text tracking-[-0.03em] m-0 font-display">
					Request payment
				</h1>
				<p className="text-[13.5px] text-ds-text-2 mt-1.5">
					Create a request anyone can pay — by QR or a link you share.
				</p>
			</div>

			{stage === "form" ? (
				<div className="bg-ds-surface rounded-[14px] border border-ds-line p-5">
					<div className="flex flex-col gap-4">
						{/* Amount + currency */}
						<div>
							<label className="text-[12px] text-ds-text-3">Amount</label>
							<div className="flex gap-2 mt-1.5 items-stretch">
								<input
									type="number" min="0" placeholder="50" value={amt}
									onChange={(e) => setAmt(e.target.value)}
									className="flex-1 h-[38px] rounded-[10px] border border-ds-line px-3 text-[20px] font-semibold text-ds-text bg-ds-surface font-mono tabular-nums"
								/>
								<div className="inline-flex gap-0.5 p-[3px] rounded-[10px] bg-onyx-900 w-[180px]">
									{["USDT", "USDC", "NGN"].map((c) => (
										<button key={c} onClick={() => setCur(c)} className={`flex-1 py-1.5 px-3.5 rounded-[6px] text-[12.5px] font-medium border-none cursor-pointer ${
											cur === c
												? "bg-lime-500 text-onyx-900"
												: "bg-transparent text-cream"
										}`}>
											{c}
										</button>
									))}
								</div>
							</div>
							{cur !== "NGN" && parseFloat(amt) > 0 && (
								<div className="text-[12px] text-ds-text-3 mt-1.5 font-mono tabular-nums">
									≈ ₦{ngnEquiv.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
								</div>
							)}
						</div>

						{/* Note */}
						<div>
							<label className="text-[12px] text-ds-text-3">Note (optional)</label>
							<input
								placeholder="What's it for?" value={note}
								onChange={(e) => setNote(e.target.value)}
								className="w-full h-[38px] rounded-[10px] border border-ds-line px-3 text-[13.5px] text-ds-text bg-ds-surface mt-1.5"
							/>
						</div>

						{/* CTA */}
						<button
							onClick={() => setStage("share")}
							disabled={!amt || parseFloat(amt) <= 0}
							className="flex items-center justify-center gap-2 w-full h-[46px] rounded-[10px] border-none cursor-pointer font-medium text-[13.5px] bg-lime-500 text-onyx-900 disabled:opacity-45 disabled:pointer-events-none"
						>
							<QrCode size={16} /> Create request
						</button>
					</div>
				</div>
			) : (
				<div className="bg-ds-surface rounded-[14px] border border-ds-line p-6">
					<div className="flex flex-col items-center text-center gap-4">
						{/* Header */}
						<div className="text-[12px] text-ds-text-3 uppercase tracking-[0.06em]">Requesting</div>
						<div className="text-[34px] font-semibold text-ds-text tabular-nums font-display">
							{amt} {cur}
						</div>
						{cur !== "NGN" && (
							<div className="text-[13px] text-ds-text-2 -mt-2 font-mono tabular-nums">
								≈ ₦{ngnEquiv.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
							</div>
						)}
						{note && <div className="text-[13.5px] text-ds-text">{note}</div>}

						{/* QR Code */}
						<div className="p-3.5 bg-white rounded-2xl border border-ds-line shadow-[0_2px_12px_rgba(0,0,0,0.06)] inline-block leading-[0]">
							<QR value={"https://" + link} size={160} />
						</div>

						{/* Link */}
						<div className="px-3.5 py-2.5 w-full max-w-[420px] flex items-center gap-2.5 bg-ds-surface-2 rounded-[14px] border border-ds-line">
							<span className="flex-1 text-[12.5px] overflow-hidden text-ellipsis whitespace-nowrap text-left font-mono text-ds-text">
								{link}
							</span>
							<button onClick={copy} className="inline-flex items-center gap-1.5 h-[30px] px-2.5 rounded-[10px] border border-ds-line bg-transparent text-[12.5px] font-medium text-ds-text cursor-pointer">
								{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
							</button>
						</div>

						{/* Actions */}
						<div className="flex gap-2 w-full max-w-[420px]">
							<button onClick={() => setStage("form")} className="flex-1 h-[36px] rounded-[10px] border border-ds-line bg-transparent text-ds-text font-medium text-[13.5px] cursor-pointer flex items-center justify-center">
								New request
							</button>
							<button onClick={() => toast.success("Share sheet opened")} className="flex-1 h-[36px] rounded-[10px] border border-transparent bg-lime-500 text-onyx-900 font-medium text-[13.5px] cursor-pointer flex items-center justify-center gap-1.5">
								<ExternalLink size={14} /> Share request
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
