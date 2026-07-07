"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/primitives/copy-button";
import { KeyRound, CheckCircle } from "lucide-react";

export function CreateApiKeyFlow({ onClose }: { onClose: () => void }) {
	const queryClient = useQueryClient();
	const [name, setName] = useState("");
	const [allowTrading, setAllowTrading] = useState(false);
	const [createdKey, setCreatedKey] = useState<string | null>(null);

	const create = useMutation({
		mutationFn: async () => {
			const res = await fetch("/api/user/api-keys", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: name.trim() || "API Key",
					permissions: JSON.stringify({ read: true, trade: allowTrading }),
				}),
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.message || "Failed to create API key");
			return json.data as { key: string };
		},
		onSuccess: (data) => {
			setCreatedKey(data.key);
			queryClient.invalidateQueries({ queryKey: ["api-keys"] });
		},
		onError: (err: Error) => toast.error(err.message),
	});

	if (createdKey) {
		return (
			<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
				<div style={{ textAlign: "center" }}>
					<CheckCircle size={48} style={{ color: "var(--c-up)", margin: "0 auto 12px" }} />
					<h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-text)", margin: 0 }}>API key created</h3>
				</div>
				<div>
					<p style={{ fontSize: 13, color: "var(--c-text-2)", marginBottom: 8 }}>
						Copy this key now — it won&apos;t be shown again.
					</p>
					<div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, background: "var(--c-surface-2)", fontFamily: "var(--font-mono)", fontSize: 12.5 }}>
						<span style={{ flex: 1, color: "var(--c-text)", wordBreak: "break-all" }}>{createdKey}</span>
						<CopyButton value={createdKey} />
					</div>
				</div>
				<Button onClick={onClose} style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", fontWeight: 700, height: 36 }}>
					Done
				</Button>
			</div>
		);
	}

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
				<div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--c-lime-500)", display: "flex", alignItems: "center", justifyContent: "center" }}>
					<KeyRound size={20} style={{ color: "var(--c-onyx-900)" }} />
				</div>
				<h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-text)", margin: 0 }}>Create API key</h3>
			</div>

			<div>
				<label style={{ fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, display: "block" }}>
					Name
				</label>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="e.g. Portfolio tracker"
					style={{ width: "100%", height: 38, borderRadius: 10, border: "1px solid var(--c-line)", padding: "0 12px", fontSize: 13, color: "var(--c-text)", background: "var(--c-surface)" }}
				/>
			</div>

			<label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--c-text-2)" }}>
				<input type="checkbox" checked={allowTrading} onChange={(e) => setAllowTrading(e.target.checked)} style={{ marginTop: 2 }} />
				<span>
					Allow this key to place trades (buy/sell orders). Leave unchecked for read-only access.
				</span>
			</label>

			<Button
				onClick={() => create.mutate()}
				disabled={create.isPending}
				style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", fontWeight: 700, height: 36 }}
			>
				{create.isPending ? "Creating..." : "Create key"}
			</Button>
		</div>
	);
}
