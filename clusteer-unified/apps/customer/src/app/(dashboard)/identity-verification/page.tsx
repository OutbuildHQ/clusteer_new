"use client";

import { Check } from "lucide-react";
import { useRef, useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUserId } from "@/hooks/use-user-id";
import { getKYCVerification, type KYCVerification } from "@/lib/api/settings";

const STATUS_BADGE_CLASSES: Record<string, string> = {
	Verified: "bg-up-soft text-up",
	"Under Review": "bg-warn-soft text-warn",
};

function StatusBadge({ s }: { s: string }) {
	const cls = STATUS_BADGE_CLASSES[s] ?? "bg-ds-surface-2 text-ds-text-2 border border-ds-line";
	const icon = s === "Verified" ? "✓" : "◐";
	return (
		<span className={`inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full text-[11.5px] font-medium ${cls}`}>
			<span className="text-[9px]">{icon}</span>{s}
		</span>
	);
}

const FALLBACK_TIERS = [
	{ tier: "Tier 1", limit: "₦300K/day", status: "Pending", items: ["Email", "Phone"], current: false },
	{ tier: "Tier 2", limit: "₦5M/day", status: "Pending", items: ["BVN", "NIN", "Selfie"], current: false },
	{ tier: "Tier 3", limit: "₦20M/day", status: "Available", items: ["Address proof", "Source of funds"], current: false },
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
		{ tier: "Tier 1", limit: "₦300K/day", status: "Verified", items: ["Email", "Phone"], current: false },
		{ tier: "Tier 2", limit: "₦5M/day", status: isApproved ? "Verified" : isPendingOrReview ? "Pending" : "Available", items: ["BVN", "NIN", "Selfie"], current: isApproved },
		{ tier: "Tier 3", limit: "₦20M/day", status: "Available", items: ["Address proof", "Source of funds"], current: false },
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
	const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const pendingDocType = useRef<string | null>(null);
	const docsRef = useRef<HTMLDivElement>(null);

	const handleUpload = useCallback(async (docType: string, file: File) => {
		setUploadingDoc(docType);
		try {
			const formData = new FormData();
			if (docType === "Selfie") {
				formData.append("documentType", "id_card");
				formData.append("selfie", file);
			} else {
				formData.append("documentType", "id_card");
				formData.append("documentFront", file);
			}
			const res = await fetch("/api/kyc/upload", { method: "POST", body: formData });
			const data = await res.json();
			if (res.ok) toast.success(`${docType} uploaded successfully`);
			else toast.error(data.message || "Upload failed");
		} catch {
			toast.error("Upload failed. Please try again.");
		} finally {
			setUploadingDoc(null);
			pendingDocType.current = null;
		}
	}, []);

	const { data: kycData, isLoading, isError } = useQuery({
		queryKey: ["kyc-verification", userId],
		queryFn: () => getKYCVerification(userId!),
		enabled: !!userId,
	});

	const TIERS = deriveTiers(kycData);
	const DOCS = deriveDocs(kycData);

	if (isLoading) {
		return (
			<div className="flex flex-col gap-6 max-w-[780px] mx-auto w-full">
				<div>
					<h1 className="text-[32px] font-semibold text-ds-text tracking-[-0.03em] m-0 font-display">Identity verification</h1>
					<p className="mt-1.5 text-ds-text-2 text-[13.5px]">Loading your verification status…</p>
				</div>
				<div className="flex justify-center pt-10">
					<div className="w-8 h-8 border-[3px] border-ds-line border-t-lime-500 rounded-full animate-spin" />
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-col gap-6 max-w-[780px] mx-auto w-full">
				<div>
					<h1 className="text-[32px] font-semibold text-ds-text tracking-[-0.03em] m-0 font-display">Identity verification</h1>
					<p className="mt-1.5 text-ds-text-2 text-[13.5px]">Failed to load verification status. Please refresh the page.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 max-w-[780px] mx-auto w-full">
			{/* Header */}
			<div>
				<h1 className="text-[32px] font-semibold text-ds-text tracking-[-0.03em] m-0 font-display">Identity verification</h1>
				<p className="mt-1.5 text-ds-text-2 text-[13.5px]">Upgrade your tier to lift transaction limits and unlock features.</p>
			</div>

			{/* Rejection banner */}
			{kycData?.status === "rejected" && (
				<div className="rounded-[14px] p-4 bg-down-soft border border-down/30">
					<p className="text-[13px] font-medium text-down">
						Your verification was rejected: {kycData.rejection_reason || "Please review your documents and try again."}
					</p>
				</div>
			)}

			{/* Tier cards */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
				{TIERS.map((t) => (
					<div
						key={t.tier}
						className={`bg-ds-surface rounded-[14px] p-5 relative ${
							t.current
								? "border-2 border-lime-500"
								: "border border-ds-line"
						}`}
					>
						{t.current && (
							<span className="absolute -top-2.5 right-3.5 inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium bg-lime-500 text-onyx-900">
								Current
							</span>
						)}
						<h3 className="text-[15px] font-semibold text-ds-text m-0">{t.tier}</h3>
						<div className="text-[22px] font-semibold mt-1.5 font-mono tabular-nums text-ds-text tracking-[-0.025em]">
							{t.limit}
						</div>
						<div className="text-[12px] mt-0.5 text-ds-text-3">Daily limit</div>
						<div className="flex flex-col gap-2 mt-3.5">
							{t.items.map((item) => (
								<div key={item} className="flex items-center gap-2 text-[13px] text-ds-text">
									<span className="text-up"><Check size={14} /></span>{item}
								</div>
							))}
						</div>
						{!t.current && (
							<button
								disabled={t.status === "Verified" || t.tier === "Tier 3"}
								onClick={() => docsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
								title={t.tier === "Tier 3" ? "Coming soon — source of funds verification isn't available yet" : undefined}
								className="w-full mt-3.5 inline-flex items-center justify-center h-[36px] rounded-[10px] text-[13.5px] font-medium border-none cursor-pointer bg-onyx-900 text-cream dark:bg-cream dark:text-onyx-900 disabled:opacity-50 disabled:pointer-events-none"
							>
								{t.status === "Verified" ? "Completed" : t.status === "Pending" ? "Under Review" : t.tier === "Tier 3" ? "Coming soon" : "Upgrade"}
							</button>
						)}
					</div>
				))}
			</div>

			{/* Verification documents */}
			<div ref={docsRef} className="bg-ds-surface border border-ds-line rounded-[14px] overflow-hidden">
				<div className="px-5 py-4 border-b border-ds-line">
					<h3 className="text-[15px] font-semibold text-ds-text m-0">Verification documents</h3>
				</div>
				<div className="flex flex-col gap-3 p-5">
					{DOCS.map(([k, v, s]) => (
						<div key={k} className="flex items-center justify-between p-3.5 rounded-[10px] border border-ds-line">
							<div>
								<div className="font-semibold text-[13px] text-ds-text">{k}</div>
								<div className="tabular-nums text-[12px] mt-0.5 font-mono text-ds-text-3">{v}</div>
							</div>
							{s === "Verified" ? (
								<StatusBadge s="Verified" />
							) : s === "Under Review" ? (
								<StatusBadge s="Under Review" />
							) : (
								<button
									disabled={uploadingDoc === k}
									className="inline-flex items-center h-[30px] px-2.5 rounded-[10px] text-[12.5px] font-medium border border-ds-line bg-transparent text-ds-text cursor-pointer disabled:opacity-60"
									onClick={() => {
										pendingDocType.current = k;
										fileInputRef.current?.click();
									}}
								>
									{uploadingDoc === k ? "Uploading…" : "Upload"}
								</button>
							)}
						</div>
					))}
				</div>
			</div>

			<input
				type="file"
				accept="image/*,.pdf"
				ref={fileInputRef}
				className="hidden"
				onChange={(e) => {
					const file = e.target.files?.[0];
					if (file && pendingDocType.current) {
						handleUpload(pendingDocType.current, file);
					}
					e.target.value = "";
				}}
			/>
		</div>
	);
}
