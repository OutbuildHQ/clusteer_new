"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/primitives/copy-button";
import { Key, AlertTriangle } from "lucide-react";

export function CreateApiKeyFlow({ onClose }: { onClose: () => void }) {
	const [name, setName] = useState("");
	const [perms, setPerms] = useState({ read: true, trade: false });
	const [createdKey, setCreatedKey] = useState<string | null>(null);

	const create = useMutation({
		mutationFn: async () => {
			const res = await fetch("/api/user/api-keys", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, permissions: JSON.stringify(perms) }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to create key");
			return data.data;
		},
		onSuccess: (data) => {
			setCreatedKey(data.key);
			toast.success("API key created");
		},
		onError: (err: Error) => toast.error(err.message),
	});

	if (createdKey) {
		return (
			<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
				<h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-text)", margin: 0 }}>API key created</h3>

				<div style={{ display: "flex", gap: 10, padding: 12, borderRadius: 10, background: "var(--c-warn-soft)", border: "1px solid var(--c-warn)" }}>
					<AlertTriangle size={16} style={{ color: "var(--c-warn)", flexShrink: 0, marginTop: 1 }} />
					<p style={{ fontSize: 12, color: "var(--c-text)", lineHeight: 1.5, margin: 0 }}>
						<strong>Copy this key now.</strong> It won't be shown again.
					</p>
				</div>

				<div style={{ padding: 12, borderRadius: 10, background: "var(--c-surface-2)", display: "flex", alignItems: "center", gap: 8 }}>
					<code style={{ flex: 1, fontSize: 12, color: "var(--c-text)", wordBreak: "break-all", fontFamily: "var(--font-mono)" }}>{createdKey}</code>
					<CopyButton value={createdKey} />
				</div>

				<Button onClick={onClose} style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", fontWeight: 700, height: 36 }}>Done</Button>
			</div>
		);
	}

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
				<div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--c-surface-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
					<Key size={20} style={{ color: "var(--c-text)" }} />
				</div>
				<h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-text)", margin: 0 }}>Create API key</h3>
			</div>

			<div>
				<label style={{ fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, display: "block" }}>Key name</label>
				<input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Trading bot"
					style={{ width: "100%", height: 38, borderRadius: 10, border: "1px solid var(--c-line)", padding: "0 12px", fontSize: 13, color: "var(--c-text)", background: "var(--c-surface)" }} />
			</div>

			<div>
				<label style={{ fontSize: 12, fontWeight: 600, color: "var(--c-text-2)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, display: "block" }}>Permissions</label>
				<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
					<label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--c-text)" }}>
						<input type="checkbox" checked={perms.read} onChange={(e) => setPerms({ ...perms, read: e.target.checked })} />
						<span><strong>Read</strong> — view balances, orders, transactions</span>
					</label>
					<label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--c-text)" }}>
						<input type="checkbox" checked={perms.trade} onChange={(e) => setPerms({ ...perms, trade: e.target.checked })} />
						<span><strong>Trade</strong> — create buy/sell orders</span>
					</label>
				</div>
			</div>

			<Button onClick={() => create.mutate()} disabled={!name.trim() || create.isPending}
				style={{ background: "var(--c-lime-500)", color: "var(--c-onyx-900)", border: "none", fontWeight: 700, height: 36 }}>
				{create.isPending ? "Creating..." : "Create API key"}
			</Button>
		</div>
	);
}
