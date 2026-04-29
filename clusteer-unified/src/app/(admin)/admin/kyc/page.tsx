"use client";

import { useState } from "react";
import { KYC_QUEUE } from "@/lib/mock-data";
import { relativeTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Eye, FileText, Camera } from "lucide-react";
import { toast } from "sonner";

export default function AdminKyc() {
	const [queue, setQueue] = useState(KYC_QUEUE);
	const [open, setOpen] = useState<string | null>(null);
	const [reviewingId, setReviewingId] = useState<string | null>(null);
	const [reviewNote, setReviewNote] = useState("");
	const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null);

	const current = queue.find((k) => k.id === open);

	function handleReviewAction(id: string, action: "approve" | "reject") {
		setReviewingId(id);
		setReviewAction(action);
	}

	function confirmReview() {
		if (!reviewingId || !reviewAction) return;
		const item = queue.find((k) => k.id === reviewingId);
		if (!item) return;

		setQueue((prev) => prev.filter((k) => k.id !== reviewingId));

		if (reviewAction === "approve") {
			toast.success(`Tier ${item.tier} approved for ${item.userName}${reviewNote ? ` — ${reviewNote}` : ""}`);
		} else {
			toast.error(`Submission rejected for ${item.userName}${reviewNote ? ` — ${reviewNote}` : ""}`);
		}

		setReviewingId(null);
		setReviewAction(null);
		setReviewNote("");
		setOpen(null);
	}

	function cancelReview() {
		setReviewingId(null);
		setReviewAction(null);
		setReviewNote("");
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-display text-2xl font-bold tracking-tight">KYC review queue</h1>
				<p className="text-sm text-muted-foreground">{queue.length} submissions awaiting review</p>
			</div>

			{queue.length === 0 && (
				<Card>
					<CardContent className="py-12 text-center text-muted-foreground">
						No submissions awaiting review.
					</CardContent>
				</Card>
			)}

			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
				{queue.map((k) => (
					<Card key={k.id}>
						<CardHeader className="flex-row items-start gap-3 space-y-0">
							<Avatar className="size-10"><AvatarFallback className="bg-primary/10 text-primary font-semibold">{k.userName.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
							<div className="flex-1">
								<CardTitle className="text-base">{k.userName}</CardTitle>
								<CardDescription className="text-xs">{k.userEmail}</CardDescription>
							</div>
							<Badge variant="info">Tier {k.tier}</Badge>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex flex-wrap gap-1.5">
								{k.documents.map((d) => (
									<span key={d.type} className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[11px]">
										{d.type.includes("Selfie") ? <Camera className="size-3" /> : <FileText className="size-3" />}
										{d.type}
									</span>
								))}
							</div>
							<div className="flex items-center justify-between border-t border-border pt-3">
								<span className="text-xs text-muted-foreground">{relativeTime(k.submittedAt)}</span>
								<div className="flex gap-1.5">
									<Button variant="outline" size="sm" onClick={() => setOpen(k.id)}><Eye className="size-3.5" />Review</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Review dialog */}
			<Dialog open={!!current} onOpenChange={(o) => { if (!o) { setOpen(null); cancelReview(); } }}>
				<DialogContent className="sm:max-w-2xl">
					{current && (
						<>
							<DialogHeader>
								<DialogTitle>Review {current.userName}</DialogTitle>
								<CardDescription>Tier {current.tier} upgrade · submitted {relativeTime(current.submittedAt)}</CardDescription>
							</DialogHeader>
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-3">
									<div><Label>BVN / NIN</Label><Input className="mono mt-1.5" readOnly value={current.bvn || current.nin || "—"} /></div>
									<div><Label>Email</Label><Input className="mt-1.5" readOnly value={current.userEmail} /></div>
								</div>
								<div>
									<Label>Documents</Label>
									<div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
										{current.documents.map((d) => (
											<div key={d.type} className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3">
												<div className="rounded-md bg-primary/10 p-2 text-primary">{d.type.includes("Selfie") ? <Camera className="size-4" /> : <FileText className="size-4" />}</div>
												<div className="flex-1 text-sm font-medium">{d.type}</div>
												<Button variant="ghost" size="sm">View</Button>
											</div>
										))}
									</div>
								</div>
								<div>
									<Label htmlFor="note">Review notes</Label>
									<textarea
										id="note"
										className="mt-1.5 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
										placeholder="Add notes for the audit log…"
										value={reviewNote}
										onChange={(e) => setReviewNote(e.target.value)}
									/>
								</div>
							</div>
							<DialogFooter className="gap-2 sm:justify-between">
								<Button variant="destructive" onClick={() => handleReviewAction(current.id, "reject")}><X className="size-4" />Reject</Button>
								<div className="flex gap-2">
									<Button variant="outline" onClick={() => { setOpen(null); cancelReview(); }}>Cancel</Button>
									<Button onClick={() => handleReviewAction(current.id, "approve")}><Check className="size-4" />Approve</Button>
								</div>
							</DialogFooter>
						</>
					)}
				</DialogContent>
			</Dialog>

			{/* Confirmation dialog */}
			<Dialog open={!!reviewingId && !!reviewAction} onOpenChange={(o) => { if (!o) cancelReview(); }}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>
							{reviewAction === "approve" ? "Confirm approval" : "Confirm rejection"}
						</DialogTitle>
					</DialogHeader>
					<p className="text-sm text-muted-foreground">
						{reviewAction === "approve"
							? `Are you sure you want to approve this KYC submission${queue.find(k => k.id === reviewingId) ? ` for ${queue.find(k => k.id === reviewingId)!.userName}` : ""}?`
							: `Are you sure you want to reject this KYC submission${queue.find(k => k.id === reviewingId) ? ` for ${queue.find(k => k.id === reviewingId)!.userName}` : ""}?`
						}
					</p>
					{reviewNote && (
						<div className="rounded-md bg-muted p-3 text-sm">
							<span className="font-medium">Note:</span> {reviewNote}
						</div>
					)}
					<DialogFooter className="gap-2">
						<Button variant="outline" onClick={cancelReview}>Cancel</Button>
						<Button
							variant={reviewAction === "reject" ? "destructive" : "default"}
							onClick={confirmReview}
						>
							{reviewAction === "approve" ? "Yes, approve" : "Yes, reject"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
