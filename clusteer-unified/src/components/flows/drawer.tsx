"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type Props = {
	open: boolean;
	onClose: () => void;
	title: string;
	width?: number;
	children: React.ReactNode;
	footer?: React.ReactNode;
};

export function Drawer({ open, onClose, title, width = 520, children, footer }: Props) {
	useEffect(() => {
		if (!open) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div
			style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "flex-end", padding: 0 }}
			onClick={onClose}
		>
			{/* Scrim */}
			<div
				style={{
					position: "absolute", inset: 0,
					background: "rgba(10,11,8,0.55)",
					backdropFilter: "blur(1.5px)",
				}}
			/>
			{/* Panel */}
			<div
				onClick={(e) => e.stopPropagation()}
				style={{
					position: "relative", zIndex: 1,
					maxWidth: width, width: "100%", height: "100%", maxHeight: "100vh",
					borderRadius: "20px 0 0 20px",
					display: "flex", flexDirection: "column",
					background: "var(--c-surface)",
					boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
					animation: "drawerIn 0.22s cubic-bezier(.2,.7,.2,1)",
				}}
			>
				{/* Header */}
				<div
					style={{
						display: "flex", alignItems: "center", justifyContent: "space-between",
						padding: "16px 20px",
						borderBottom: "1px solid var(--c-line)",
					}}
				>
					<span style={{ fontWeight: 600, fontSize: 15, color: "var(--c-text)" }}>{title}</span>
					<button
						onClick={onClose}
						style={{
							width: 30, height: 30, borderRadius: "50%",
							background: "var(--c-surface-2)", border: "none",
							display: "flex", alignItems: "center", justifyContent: "center",
							cursor: "pointer",
						}}
					>
						<X size={16} style={{ color: "var(--c-text-2)" }} />
					</button>
				</div>
				{/* Body */}
				<div
					style={{
						flex: 1, overflow: "auto",
						padding: 20,
						display: "flex", flexDirection: "column", gap: 16,
					}}
				>
					{children}
				</div>
				{/* Footer */}
				{footer && (
					<div
						style={{
							borderTop: "1px solid var(--c-line)",
							padding: "14px 20px",
							display: "flex", gap: 8, justifyContent: "flex-end",
						}}
					>
						{footer}
					</div>
				)}
			</div>
		</div>
	);
}
