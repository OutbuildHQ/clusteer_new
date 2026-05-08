"use client";

import { Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useUserId } from "@/hooks/use-user-id";
import { getKYCVerification, type KYCVerification } from "@/lib/api/settings";

function StatusBadge({ s }: { s: string }) {
	const style = s === "Verified"
		? { background: "var(--c-up-soft)", color: "var(--c-up)" }
		: { background: "var(--c-surface-2)", color: "var(--c-text-2)", border: "1px solid var(--c-line)" };
	return (
		<span className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full text-[11.5px] font-medium" style={style}>
			<span className="text-[9px]">{s === "Verified" ? "\u2713" : "\u25CF"}</span>{s}
		</span>
	);
}

const FALLBACK_TIERS = [
	{ tier: "Tier 1", limit: "\u20A6300K/day", status: "Pending", items: ["Email", "Phone"], current: false },
	{ tier: "Tier 2", limit: "\u20A65M/day", status: "Pending", items: ["BVN", "NIN", "Selfie"], current: false },
	{ tier: "Tier 3", limit: "\u20A620M/day", status: "Available", items: ["Address proof", "Source of funds"], current: false },
];

const FALLBACK_DOCS: [string, string, string][] = [
	["BVN", "Not submitted", "Required"],
	["NIN", "Not submitted", "Required"],
	["Selfie", "Not captured", "Required"],
	["Proof of address", "Not uploaded", "Required for Tier 3"],
];

function deriveTiers(kyc: KYCVerification | null | undefined) {
	if (!kyc || kyc.status === "not_submitted") return FALLBACK_TIERS;

	const isApproved = kyc.status === "approved";
	const isPendingOrReview = kyc.status === "pending" || kyc.status === "under_review";

	return [
		{
			tier: "Tier 1",
			limit: "\u20A6300K/day",
			status: "Verified",
			items: ["Email", "Phone"],
			current: false,
		},
		{
			tier: "Tier 2",
			limit: "\u20A65M/day",
			status: isApproved ? "Verified" : isPendingOrReview ? "Pending" : "Available",
			items: ["BVN", "NIN", "Selfie"],
			current: isApproved,
		},
		{
			tier: "Tier 3",
			limit: "\u20A620M/day",
			status: "Available",
			items: ["Address proof", "Source of funds"],
			current: false,
		},
	];
}

function deriveDocs(kyc: KYCVerification | null | undefined): [string, string, string][] {
	if (!kyc || kyc.status === "not_submitted") return FALLBACK_DOCS;

	const isApproved = kyc.status === "approved";
	const isPending = kyc.status === "pending" || kyc.status === "under_review";
	const docStatus = isApproved ? "Verified" : isPending ? "Under Review" : "Required";

	return [
		["BVN", kyc.document_number ?? "Not submitted", kyc.document_type ? docStatus : "Required"],
		["NIN", kyc.document_number ?? "Not submitted", kyc.document_type ? docStatus : "Required"],
		["Selfie", kyc.selfie_url ? (isApproved ? "Verified" : "Submitted") : "Not captured", kyc.selfie_url ? docStatus : "Required"],
		["Proof of address", kyc.address_document_url ? "Uploaded" : "Not uploaded", "Required for Tier 3"],
	];
}

export default function IdentityVerificationPage() {
	const userId = useUserId();

	const { data: kycData, isLoading, isError } = useQuery({
		queryKey: ["kyc-verification", userId],
		queryFn: () => getKYCVerification(userId!),
		enabled: !!userId,
	});

	const TIERS = deriveTiers(kycData);
	const DOCS = deriveDocs(kycData);

	if (isLoading) {
		return (
			<div className="space-y-6" style={{ maxWidth: 780, margin: "0 auto", width: "100%" }}>
				<div>
					<h1 className="text-[22px] lg:text-[32px] font-semibold leading-tight tracking-tight" style={{ color: "var(--c-text)", letterSpacing: "-0.03em" }}>Identity verification</h1>
					<p className="mt-1.5 text-[14px]" style={{ color: "var(--c-text-2)" }}>Loading your verification status...</p>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="space-y-6" style={{ maxWidth: 780, margin: "0 auto", width: "100%" }}>
				<div>
					<h1 className="text-[22px] lg:text-[32px] font-semibold leading-tight tracking-tight" style={{ color: "var(--c-text)", letterSpacing: "-0.03em" }}>Identity verification</h1>
					<p className="mt-1.5 text-[14px]" style={{ color: "var(--c-text-2)" }}>Failed to load verification status. Please refresh the page.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6" style={{ maxWidth: 780, margin: "0 auto", width: "100%" }}>
			<div>
				<h1 className="text-[22px] lg:text-[32px] font-semibold leading-tight tracking-tight" style={{ color: "var(--c-text)", letterSpacing: "-0.03em" }}>Identity verification</h1>
				<p className="mt-1.5 text-[14px]" style={{ color: "var(--c-text-2)" }}>Upgrade your tier to lift transaction limits and unlock features.</p>
			</div>

			{/* Rejection banner */}
			{kycData?.status === "rejected" && (
				<div className="rounded-[14px] p-4" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" }}>
					<p className="text-[13px] font-medium" style={{ color: "var(--c-danger, #ef4444)" }}>
						Your verification was rejected: {kycData.rejection_reason || "Please review your documents and try again."}
					</p>
				</div>
			)}

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
								{t.status === "Verified" ? "Completed" : t.status === "Pending" ? "Under Review" : "Upgrade"}
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
							) : s === "Under Review" ? (
								<StatusBadge s="Under Review" />
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
