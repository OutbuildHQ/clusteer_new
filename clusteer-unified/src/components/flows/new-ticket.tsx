"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const CATEGORIES = ["Buy/Sell order", "Identity/KYC", "Payments", "Account", "Other"];
const PRIORITIES = ["Low", "Normal", "High", "Urgent"];

export function NewTicketFlow({ onClose }: { onClose: () => void }) {
	const [subject, setSubject] = useState("");
	const [category, setCategory] = useState("Other");
	const [priority, setPriority] = useState("Normal");
	const [message, setMessage] = useState("");
	const [ticketId, setTicketId] = useState<string | null>(null);

	const submit = useMutation({
		mutationFn: async () => {
			const res = await fetch("/api/support", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ subject, category, priority, message }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to create ticket");
			return data.data;
		},
		onSuccess: (data) => {
			setTicketId(data?.ticketNumber || "CLR-0000");
			toast.success("Ticket created");
		},
		onError: (err: Error) => toast.error(err.message),
	});

	if (ticketId) {
		return (
			<div style={{ textAlign: "center", padding: "20px 0" }}>
				<CheckCircle size={48} style={{ color: "var(--c-up)", margin: "0 auto 16px" }} />
				<h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-text)", margin: 0 }}>Ticket created</h3>
				<p style={{ fontSize: 13, color: "var(--c-text-2)", marginTop: 8 }}>Your ticket <strong>#{ticketId}</strong> is open. We'll respond within 24 hours.</p>
				<Button onClick={onClose} className="mt-4" style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", fontWeight: 600 }}>Done</Button>
			</div>
		);
	}

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			<h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-text)", margin: 0 }}>New support ticket</h3>

			<div>
				<label style={{ fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, display: "block" }}>Subject</label>
				<input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What do you need help with?"
					style={{ width: "100%", height: 42, borderRadius: 10, border: "1.5px solid var(--c-line)", padding: "0 12px", fontSize: 14, color: "var(--c-text)", background: "var(--c-surface)" }} />
			</div>

			<div style={{ display: "flex", gap: 12 }}>
				<div style={{ flex: 1 }}>
					<label style={{ fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, display: "block" }}>Category</label>
					<select value={category} onChange={(e) => setCategory(e.target.value)}
						style={{ width: "100%", height: 42, borderRadius: 10, border: "1.5px solid var(--c-line)", padding: "0 12px", fontSize: 14, color: "var(--c-text)", background: "var(--c-surface)" }}>
						{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
					</select>
				</div>
				<div style={{ flex: 1 }}>
					<label style={{ fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, display: "block" }}>Priority</label>
					<select value={priority} onChange={(e) => setPriority(e.target.value)}
						style={{ width: "100%", height: 42, borderRadius: 10, border: "1.5px solid var(--c-line)", padding: "0 12px", fontSize: 14, color: "var(--c-text)", background: "var(--c-surface)" }}>
						{PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
					</select>
				</div>
			</div>

			<div>
				<label style={{ fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, display: "block" }}>Message</label>
				<textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Describe your issue in detail..."
					style={{ width: "100%", borderRadius: 10, border: "1.5px solid var(--c-line)", padding: 12, fontSize: 14, color: "var(--c-text)", background: "var(--c-surface)", resize: "vertical" }} />
			</div>

			<Button onClick={() => submit.mutate()} disabled={!subject.trim() || !message.trim() || submit.isPending}
				style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", fontWeight: 700, height: 44 }}>
				{submit.isPending ? "Submitting..." : "Submit ticket"}
			</Button>
		</div>
	);
}
