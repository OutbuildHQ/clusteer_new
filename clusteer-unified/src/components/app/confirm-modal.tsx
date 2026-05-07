"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ConfirmModalProps {
	open: boolean;
	onClose: () => void;
	title: string;
	message: string;
	confirmLabel?: string;
	danger?: boolean;
	onConfirm: () => void;
}

export default function ConfirmModal({
	open,
	onClose,
	title,
	message,
	confirmLabel = "Confirm",
	danger = false,
	onConfirm,
}: ConfirmModalProps) {
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
			className="fixed inset-0 z-[60] flex items-center justify-center"
			style={{ background: "rgba(0,0,0,0.5)" }}
			onClick={onClose}
		>
			<div
				className="flex flex-col bg-[var(--c-surface)] rounded-2xl overflow-hidden"
				style={{
					maxWidth: 400,
					width: "100%",
					animation: "modalIn .22s cubic-bezier(.2,.7,.2,1)",
					border: "1px solid var(--c-line)",
					boxShadow: "var(--sh-3)",
				}}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div
					className="flex items-center justify-between px-5 py-4"
					style={{ borderBottom: "1px solid var(--c-line)" }}
				>
					<div className="text-[15px] font-semibold text-[var(--c-text)]">{title}</div>
					<button
						className="flex items-center justify-center size-8 rounded-md hover:bg-[var(--c-surface-3)] transition-colors"
						onClick={onClose}
					>
						<X className="size-4 text-[var(--c-text-3)]" />
					</button>
				</div>

				{/* Body */}
				<div className="px-5 py-5">
					<div className="text-[14px] leading-relaxed text-[var(--c-text)]">{message}</div>
				</div>

				{/* Footer */}
				<div
					className="flex items-center justify-end gap-2 px-5 py-4"
					style={{ borderTop: "1px solid var(--c-line)" }}
				>
					<button
						className="flex items-center h-9 px-4 rounded-lg border border-[var(--c-line)] text-[13px] font-medium text-[var(--c-text)] hover:bg-[var(--c-surface-2)] transition-colors"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						className="flex items-center h-9 px-4 rounded-lg text-[13px] font-semibold transition-colors"
						style={
							danger
								? { background: "var(--c-down)", color: "#fff" }
								: { background: "var(--c-lime-500)", color: "var(--c-onyx-900)" }
						}
						onClick={() => {
							onConfirm();
							onClose();
						}}
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
}
