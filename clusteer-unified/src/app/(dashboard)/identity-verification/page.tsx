"use client";

import { Check } from "lucide-react";

function StatusBadge({ s }: { s: string }) {
	const style = s === "Verified"
		? { background: "var(--c-up-soft)", color: "var(--c-up)" }
		: { background: "var(--c-surface-2)", color: "var(--c-text-2)", border: "1px solid var(--c-line)" };
	return (
		<span className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full text-[11.5px] font-medium" style={style}>
			<span className="text-[9px]">{s === "Verified" ? "✓" : "●"}</span>{s}
		</span>
	);
}

const TIERS = [
	{ tier: "Tier 1", limit: "₦300K/day", status: "Verified", items: ["Email", "Phone"], current: false },
	{ tier: "Tier 2", limit: "₦5M/day", status: "Verified", items: ["BVN", "NIN", "Selfie"], current: true },
	{ tier: "Tier 3", limit: "₦20M/day", status: "Available", items: ["Address proof", "Source of funds"], current: false },
];

const DOCS = [
	["BVN", "22101234567", "Verified"],
	["NIN", "12120000001", "Verified"],
	["Selfie", "Captured Mar 12", "Verified"],
	["Proof of address", "Not uploaded", "Required for Tier 3"],
];

export default function IdentityVerificationPage() {
	return (
		<div className="space-y-6" style={{ maxWidth: 780, margin: "0 auto", width: "100%" }}>
			<div>
				<h1 className="text-[22px] lg:text-[32px] font-semibold leading-tight tracking-tight" style={{ color: "var(--c-text)", letterSpacing: "-0.03em" }}>Identity verification</h1>
				<p className="mt-1.5 text-[14px]" style={{ color: "var(--c-text-2)" }}>Upgrade your tier to lift transaction limits and unlock features.</p>
			</div>

			{/* Tier cards */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
				{TIERS.map((t) => (
					<div
						key={t.tier}
						className="rounded-[14px] p-[var(--pad)] relative"
						style={{
							background: "var(--c-surface)",
							border: `${t.current ? 2 : 1}px solid ${t.current ? "var(--c-lime-500)" : "var(--c-line)"}`,
						}}
					>
						{t.current && (
							<span className="absolute -top-2.5 right-3.5 inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium"
								style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }}>Current</span>
						)}
						<h3 className="text-[17px] font-semibold" style={{ color: "var(--c-text)" }}>{t.tier}</h3>
						<div className="tabular-nums text-[22px] font-semibold mt-1.5" style={{ fontFamily: "var(--f-display)", color: "var(--c-text)", letterSpacing: "-0.025em" }}>
							{t.limit}
						</div>
						<div className="text-[12px] mt-0.5" style={{ color: "var(--c-text-3)" }}>Daily withdrawal limit</div>
						<div className="mt-3.5 space-y-2">
							{t.items.map((item) => (
								<div key={item} className="flex items-center gap-2 text-[13px]" style={{ color: "var(--c-text)" }}>
									<span style={{ color: "var(--c-up)" }}><Check className="size-3.5" /></span>{item}
								</div>
							))}
						</div>
						{!t.current && (
							<button className="w-full mt-3.5 inline-flex items-center justify-center h-9 rounded-[10px] text-[13.5px] font-medium"
								style={{ background: "var(--c-onyx-900)", color: "var(--c-cream)" }}>
								{t.status === "Verified" ? "Completed" : "Upgrade"}
							</button>
						)}
					</div>
				))}
			</div>

			{/* Verification documents */}
			<div className="rounded-[14px] p-[var(--pad)]" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
				<h3 className="text-[17px] font-semibold mb-4" style={{ color: "var(--c-text)" }}>Verification documents</h3>
				<div className="space-y-3">
					{DOCS.map(([k, v, s]) => (
						<div key={k} className="flex items-center justify-between p-3.5 rounded-[10px]" style={{ border: "1px solid var(--c-line)" }}>
							<div>
								<div className="font-semibold text-[13px]" style={{ color: "var(--c-text)" }}>{k}</div>
								<div className="tabular-nums text-[12px] mt-0.5" style={{ fontFamily: "var(--f-mono)", color: "var(--c-text-3)" }}>{v}</div>
							</div>
							{s === "Verified" ? (
								<StatusBadge s="Verified" />
							) : (
								<button className="inline-flex items-center h-[30px] px-2.5 rounded-[10px] text-[12.5px] font-medium"
									style={{ color: "var(--c-text)", border: "1px solid var(--c-line)" }}>Upload</button>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
