"use client";

import { AlertTriangle } from "lucide-react";

type Props = {
	title?: string;
	message?: string;
	confirmLabel?: string;
	danger?: boolean;
	onConfirm?: () => void;
	onClose: () => void;
};

export function ConfirmDialog({
	title = "Are you sure?",
	message = "This action cannot be undone.",
	confirmLabel = "Confirm",
	danger = false,
	onConfirm,
	onClose,
}: Props) {
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "8px 0" }}>
			{danger && (
				<div
					style={{
						width: 48, height: 48, borderRadius: 12,
						background: "var(--c-down-soft)",
						display: "flex", alignItems: "center", justifyContent: "center",
					}}
				>
					<AlertTriangle size={22} style={{ color: "var(--c-down)" }} />
				</div>
			)}
			<div>
				<h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--c-text)", margin: 0 }}>{title}</h3>
				<p style={{ fontSize: 13.5, color: "var(--c-text-2)", marginTop: 6, lineHeight: 1.55 }}>{message}</p>
			</div>
			<div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
				<button
					onClick={onClose}
					style={{
						height: 36, padding: "0 14px", borderRadius: 10,
						border: "1px solid var(--c-line)", background: "transparent",
						color: "var(--c-text)", fontSize: 13.5, fontWeight: 600,
						cursor: "pointer", fontFamily: "inherit",
					}}
				>
					Cancel
				</button>
				<button
					onClick={() => { onConfirm?.(); onClose(); }}
					style={{
						height: 36, padding: "0 14px", borderRadius: 10, border: "none",
						background: danger ? "var(--c-down)" : "var(--c-lime-500)",
						color: danger ? "#fff" : "var(--c-onyx-900)",
						fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
					}}
				>
					{confirmLabel}
				</button>
			</div>
		</div>
	);
}
