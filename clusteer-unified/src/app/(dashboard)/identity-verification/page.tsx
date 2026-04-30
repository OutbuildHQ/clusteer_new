"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StepsHorizontal } from "@/components/primitives/steps";
import { CheckCircle2, CircleDashed, FileText, Upload, Camera, ShieldCheck, Lock, Loader2, AlertCircle } from "lucide-react";
import { useUser } from "@/store/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getKYCVerification, submitKYCVerification, type KYCVerification } from "@/lib/api/settings";

const TIERS = [
	{ tier: 1, title: "Basic", daily: "\u20A6100,000", monthly: "\u20A6500,000", reqs: ["Email verified", "Phone verified"] },
	{ tier: 2, title: "Standard", daily: "\u20A62,000,000", monthly: "\u20A620,000,000", reqs: ["BVN", "Government ID", "Selfie"] },
	{ tier: 3, title: "Premium", daily: "Unlimited", monthly: "Unlimited", reqs: ["Proof of address", "Source of funds"] },
];

function kycStatusToTier(status?: KYCVerification["status"]): number {
	if (status === "approved") return 2;
	if (status === "pending" || status === "under_review") return 1;
	return 1;
}

export default function KYCPage() {
	const user = useUser();
	const queryClient = useQueryClient();
	const [step, setStep] = useState(1);
	const [bvn, setBvn] = useState("");
	const [idType, setIdType] = useState("nin");
	const [idNumber, setIdNumber] = useState("");

	/* ---- KYC status query ---- */
	const kycQuery = useQuery({
		queryKey: ["kyc", user?.id],
		queryFn: () => getKYCVerification(user!.id),
		enabled: !!user?.id,
	});

	/* ---- KYC submit mutation ---- */
	const submitMutation = useMutation({
		mutationFn: (data: Partial<KYCVerification>) => submitKYCVerification(user!.id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["kyc", user?.id] });
			setStep(4);
		},
	});

	const currentTier = kycQuery.data ? kycStatusToTier(kycQuery.data.status) : 1;
	const kycStatus = kycQuery.data?.status ?? "not_submitted";

	/* If KYC is already pending/under_review/approved, show status banner */
	const isSubmitted = kycStatus === "pending" || kycStatus === "under_review" || kycStatus === "approved";
	const isRejected = kycStatus === "rejected";

	function handleSubmitStep1() {
		if (!bvn || !idNumber) return;
		submitMutation.mutate({
			document_type: idType,
			document_number: idNumber,
		});
	}

	return (
		<div className="space-y-6 max-w-4xl">
			<div>
				<h1 className="font-display text-2xl font-bold tracking-tight">Identity verification</h1>
				<p className="mt-1 text-sm text-muted-foreground">Verify your identity to unlock higher limits and faster withdrawals.</p>
			</div>

			{/* ---- Loading state ---- */}
			{kycQuery.isLoading && (
				<div className="flex items-center justify-center py-12">
					<Loader2 className="size-5 animate-spin text-muted-foreground" />
					<span className="ml-2 text-sm text-muted-foreground">Loading verification status...</span>
				</div>
			)}

			{/* ---- Error state ---- */}
			{kycQuery.isError && (
				<div className="rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm text-danger flex items-center gap-3">
					<AlertCircle className="size-5 shrink-0" />
					<div>
						Failed to load verification status.{" "}
						<button className="underline" onClick={() => kycQuery.refetch()}>Retry</button>
					</div>
				</div>
			)}

			{/* ---- Rejection banner ---- */}
			{isRejected && kycQuery.data && (
				<div className="rounded-lg border border-danger/30 bg-danger/5 p-4 text-danger flex gap-3">
					<AlertCircle className="size-5 shrink-0 mt-0.5" />
					<div>
						<div className="font-medium">Verification rejected</div>
						<div className="text-sm opacity-90">{kycQuery.data.rejection_reason ?? "Please resubmit your documents."}</div>
					</div>
				</div>
			)}

			{/* ---- Tier cards ---- */}
			{!kycQuery.isLoading && (
				<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
					{TIERS.map((t) => {
						const state = currentTier > t.tier ? "done" : currentTier === t.tier ? "current" : "locked";
						return (
							<Card key={t.tier} className={state === "current" ? "border-primary ring-1 ring-primary/30" : ""}>
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between">
										<CardDescription className="text-xs uppercase tracking-wide">Tier {t.tier}</CardDescription>
										{state === "done" && <CheckCircle2 className="size-4 text-success" />}
										{state === "current" && <Badge variant="success">Current</Badge>}
										{state === "locked" && <Lock className="size-4 text-muted-foreground" />}
									</div>
									<CardTitle className="font-display">{t.title}</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2 text-sm">
									<div className="flex justify-between"><span className="text-muted-foreground">Daily</span><span className="font-medium">{t.daily}</span></div>
									<div className="flex justify-between"><span className="text-muted-foreground">Monthly</span><span className="font-medium">{t.monthly}</span></div>
									<ul className="mt-3 space-y-1 border-t border-border pt-3 text-xs">
										{t.reqs.map((r) => (
											<li key={r} className="flex items-center gap-2">
												{currentTier >= t.tier ? <CheckCircle2 className="size-3 text-success" /> : <CircleDashed className="size-3 text-muted-foreground" />}
												{r}
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}

			{/* ---- Already submitted / approved banner ---- */}
			{isSubmitted && !kycQuery.isLoading && (
				<Card>
					<CardContent className="py-6">
						<div className="rounded-lg border border-success/30 bg-success-bg p-4 text-success flex gap-3">
							<ShieldCheck className="size-5 shrink-0 mt-0.5" />
							<div>
								<div className="font-medium">
									{kycStatus === "approved" ? "Verification approved" : "Verification in progress"}
								</div>
								<div className="text-sm opacity-90">
									{kycStatus === "approved"
										? "Your identity has been verified. You have access to Tier 2 limits."
										: "Your documents are being reviewed. We'll email you when verification is complete — usually within 5 minutes."}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* ---- Upgrade form (only when not already submitted or when rejected) ---- */}
			{(!isSubmitted || isRejected) && !kycQuery.isLoading && (
				<Card>
					<CardHeader>
						<CardTitle>Upgrade to Tier {currentTier + 1}</CardTitle>
						<CardDescription>Complete the following steps. Most verifications are instant.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<StepsHorizontal current={step - 1} steps={["BVN & ID", "Document upload", "Selfie", "Review"]} />

						{step === 1 && (
							<div className="space-y-4">
								<div>
									<Label htmlFor="bvn">Bank Verification Number (BVN)</Label>
									<Input id="bvn" className="mono mt-1.5" maxLength={11} placeholder="12345678901" value={bvn} onChange={(e) => setBvn(e.target.value.replace(/\D/g, ""))} />
									<p className="mt-1 text-xs text-muted-foreground">Dial *565*0# on the phone linked to your bank to retrieve it.</p>
								</div>
								<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
									<div>
										<Label>ID type</Label>
										<Select value={idType} onValueChange={setIdType}>
											<SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
											<SelectContent>
												<SelectItem value="nin">National ID (NIN)</SelectItem>
												<SelectItem value="drivers">Driver's License</SelectItem>
												<SelectItem value="passport">International Passport</SelectItem>
												<SelectItem value="voters">Voter's Card</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label>ID number</Label>
										<Input className="mono mt-1.5" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
									</div>
								</div>
								<div className="flex justify-end"><Button onClick={() => setStep(2)}>Continue</Button></div>
							</div>
						)}

						{step === 2 && (
							<div className="space-y-4">
								<UploadCard icon={<FileText className="size-5" />} title="Front of ID" hint="JPG or PDF · max 10MB" />
								<UploadCard icon={<FileText className="size-5" />} title="Back of ID" hint="JPG or PDF · max 10MB" />
								<div className="flex justify-between">
									<Button variant="outline" onClick={() => setStep(1)}>Back</Button>
									<Button onClick={() => setStep(3)}>Continue</Button>
								</div>
							</div>
						)}

						{step === 3 && (
							<div className="space-y-4">
								<UploadCard icon={<Camera className="size-5" />} title="Selfie with ID" hint="Hold your ID next to your face in good lighting." />
								<div className="flex justify-between">
									<Button variant="outline" onClick={() => setStep(2)}>Back</Button>
									<Button
										onClick={handleSubmitStep1}
										disabled={submitMutation.isPending || !bvn || !idNumber}
									>
										{submitMutation.isPending ? <><Loader2 className="size-4 animate-spin mr-1" />Submitting...</> : "Submit for review"}
									</Button>
								</div>
								{submitMutation.isError && (
									<p className="text-sm text-danger">Submission failed. Please try again.</p>
								)}
							</div>
						)}

						{step === 4 && (
							<div className="space-y-4">
								<div className="rounded-lg border border-success/30 bg-success-bg p-4 text-success flex gap-3">
									<ShieldCheck className="size-5 shrink-0 mt-0.5" />
									<div>
										<div className="font-medium">Submitted for review</div>
										<div className="text-sm opacity-90">We'll email you when verification is complete — usually within 5 minutes.</div>
									</div>
								</div>
								<div className="flex justify-end"><Button onClick={() => setStep(1)}>Done</Button></div>
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}

function UploadCard({ icon, title, hint }: { icon: React.ReactNode; title: string; hint: string }) {
	return (
		<label className="flex cursor-pointer items-center gap-4 rounded-lg border-2 border-dashed border-border bg-muted/30 p-4 transition hover:border-primary/50 hover:bg-primary/5">
			<div className="rounded-lg bg-primary/10 p-3 text-primary">{icon}</div>
			<div className="flex-1">
				<div className="font-medium">{title}</div>
				<div className="text-xs text-muted-foreground">{hint}</div>
			</div>
			<Button variant="outline" size="sm" asChild><span><Upload className="size-4" />Upload</span></Button>
			<input type="file" className="hidden" />
		</label>
	);
}
