"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
	id: string;
	type: ToastType;
	title: string;
	message?: string;
	duration?: number;
}

interface ToastContextValue {
	showToast: (toast: Omit<Toast, "id">) => void;
	success: (title: string, message?: string) => void;
	error: (title: string, message?: string) => void;
	warning: (title: string, message?: string) => void;
	info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	const showToast = useCallback(
		({ type, title, message, duration = 5000 }: Omit<Toast, "id">) => {
			const id = Math.random().toString(36).substring(7);
			const toast: Toast = { id, type, title, message, duration };

			setToasts((prev) => [...prev, toast]);

			if (duration > 0) {
				setTimeout(() => removeToast(id), duration);
			}
		},
		[removeToast]
	);

	const success = useCallback(
		(title: string, message?: string) => {
			showToast({ type: "success", title, message });
		},
		[showToast]
	);

	const error = useCallback(
		(title: string, message?: string) => {
			showToast({ type: "error", title, message });
		},
		[showToast]
	);

	const warning = useCallback(
		(title: string, message?: string) => {
			showToast({ type: "warning", title, message });
		},
		[showToast]
	);

	const info = useCallback(
		(title: string, message?: string) => {
			showToast({ type: "info", title, message });
		},
		[showToast]
	);

	return (
		<ToastContext.Provider value={{ showToast, success, error, warning, info }}>
			{children}
			<ToastContainer toasts={toasts} onRemove={removeToast} />
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within ToastProvider");
	}
	return context;
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
	return (
		<div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
			{toasts.map((toast) => (
				<ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
			))}
		</div>
	);
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
	const { type, title, message, id } = toast;

	const icons = {
		success: <CheckCircle className="w-5 h-5" />,
		error: <XCircle className="w-5 h-5" />,
		warning: <AlertCircle className="w-5 h-5" />,
		info: <Info className="w-5 h-5" />,
	};

	const styles = {
		success: "bg-[var(--cl-up-soft)] border-[var(--cl-up)] text-[var(--cl-up)]",
		error: "bg-[var(--cl-down-soft)] border-[var(--cl-down)] text-[var(--cl-down)]",
		warning: "bg-orange-50 border-orange-200 text-orange-800",
		info: "bg-[var(--cl-info-soft)] border-[var(--cl-brand-200)] text-[var(--cl-info)]",
	};

	const iconStyles = {
		success: "text-[var(--cl-up)]",
		error: "text-[var(--cl-down)]",
		warning: "text-orange-600",
		info: "text-[var(--cl-brand-600)]",
	};

	return (
		<div
			className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-in slide-in-from-right duration-300 ${styles[type]}`}
			role="alert"
			aria-live="polite"
		>
			<div className={iconStyles[type]}>{icons[type]}</div>
			<div className="flex-1 min-w-0">
				<p className="text-sm font-semibold">{title}</p>
				{message && <p className="text-sm mt-1 opacity-90">{message}</p>}
			</div>
			<button
				onClick={() => onRemove(id)}
				className="flex-shrink-0 p-1 hover:bg-black/10 rounded transition-colors"
				aria-label="Close notification"
			>
				<X className="w-4 h-4" />
			</button>
		</div>
	);
}
