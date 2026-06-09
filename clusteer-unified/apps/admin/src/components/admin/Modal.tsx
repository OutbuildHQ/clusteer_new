"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	description?: string;
	children: React.ReactNode;
	size?: "sm" | "md" | "lg" | "xl" | "full";
	footer?: React.ReactNode;
}

export default function Modal({
	isOpen,
	onClose,
	title,
	description,
	children,
	size = "md",
	footer
}: ModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);
	const previousFocus = useRef<HTMLElement | null>(null);

	const sizeClasses = {
		sm: "max-w-md",
		md: "max-w-2xl",
		lg: "max-w-4xl",
		xl: "max-w-6xl",
		full: "max-w-full mx-4",
	};

	// Handle ESC key press
	useEffect(() => {
		if (!isOpen) return;

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isOpen, onClose]);

	// Handle focus trap and focus management
	useEffect(() => {
		if (!isOpen) return;

		// Save current focus
		previousFocus.current = document.activeElement as HTMLElement;

		// Focus modal
		const modal = modalRef.current;
		if (modal) {
			const focusableElements = modal.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);
			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			// Focus first element
			firstElement?.focus();

			// Handle tab key for focus trap
			const handleTab = (e: KeyboardEvent) => {
				if (e.key !== "Tab") return;

				if (e.shiftKey) {
					if (document.activeElement === firstElement) {
						e.preventDefault();
						lastElement?.focus();
					}
				} else {
					if (document.activeElement === lastElement) {
						e.preventDefault();
						firstElement?.focus();
					}
				}
			};

			document.addEventListener("keydown", handleTab);

			return () => {
				document.removeEventListener("keydown", handleTab);
				// Restore focus
				previousFocus.current?.focus();
			};
		}
	}, [isOpen]);

	// Prevent body scroll when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
			onClick={onClose}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			aria-describedby={description ? "modal-description" : undefined}
		>
			<div
				ref={modalRef}
				className={`bg-card rounded-lg ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="p-6 border-b border-border flex items-start justify-between sticky top-0 bg-card z-10">
					<div className="flex-1">
						<h2 id="modal-title" className="text-xl font-bold text-foreground">
							{title}
						</h2>
						{description && (
							<p id="modal-description" className="text-sm text-muted-foreground mt-1">
								{description}
							</p>
						)}
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0 ml-4"
						aria-label="Close modal"
					>
						<X className="w-5 h-5 text-muted-foreground" />
					</button>
				</div>

				{/* Content */}
				<div className="p-6">{children}</div>

				{/* Footer */}
				{footer && (
					<div className="p-6 border-t border-border sticky bottom-0 bg-card">
						{footer}
					</div>
				)}
			</div>
		</div>
	);
}

// Confirmation Modal
interface ConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	variant?: "danger" | "warning" | "info";
	isLoading?: boolean;
}

export function ConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = "Confirm",
	cancelText = "Cancel",
	variant = "danger",
	isLoading = false,
}: ConfirmModalProps) {
	const variantClasses = {
		danger: "bg-danger hover:bg-danger/90",
		warning: "bg-orange-600 hover:bg-orange-700",
		info: "bg-primary hover:bg-primary/90",
	};

	const iconClasses = {
		danger: "bg-danger/10",
		warning: "bg-orange-50",
		info: "bg-[var(--c-lime-500)]/10",
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			size="sm"
			footer={
				<div className="flex items-center gap-3">
					<button
						onClick={onClose}
						disabled={isLoading}
						className="flex-1 px-4 py-2 text-muted-foreground bg-card border border-border rounded-lg hover:bg-background transition-colors disabled:opacity-50"
					>
						{cancelText}
					</button>
					<button
						onClick={onConfirm}
						disabled={isLoading}
						className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${variantClasses[variant]}`}
					>
						{isLoading ? "Processing..." : confirmText}
					</button>
				</div>
			}
		>
			<div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${iconClasses[variant]}`}>
				<AlertIcon variant={variant} />
			</div>
			<p className="text-sm text-muted-foreground">{message}</p>
		</Modal>
	);
}

function AlertIcon({ variant }: { variant: "danger" | "warning" | "info" }) {
	const iconClasses = {
		danger: "text-danger",
		warning: "text-orange-600",
		info: "text-[var(--c-lime-500)]",
	};

	return (
		<svg
			className={`w-6 h-6 ${iconClasses[variant]}`}
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
			/>
		</svg>
	);
}
