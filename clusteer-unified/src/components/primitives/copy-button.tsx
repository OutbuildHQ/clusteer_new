"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CopyButton({
	value,
	label,
	className,
}: {
	value: string;
	label?: string;
	className?: string;
}) {
	const [copied, setCopied] = useState(false);
	return (
		<button
			type="button"
			onClick={async () => {
				try {
					await navigator.clipboard.writeText(value);
					setCopied(true);
					toast.success(label ? `${label} copied` : "Copied to clipboard");
					setTimeout(() => setCopied(false), 1500);
				} catch {
					toast.error("Unable to copy");
				}
			}}
			className={cn(
				"inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted",
				className,
			)}
		>
			<AnimatePresence mode="wait">
				{copied ? (
					<motion.span key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}>
						<Check className="size-3.5 text-success" />
					</motion.span>
				) : (
					<motion.span key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}>
						<Copy className="size-3.5" />
					</motion.span>
				)}
			</AnimatePresence>
			<span>{copied ? "Copied" : "Copy"}</span>
		</button>
	);
}
