"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
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
				"inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted overflow-hidden",
				className,
			)}
		>
			<AnimatePresence mode="wait" initial={false}>
				{copied ? (
					<motion.span
						key="check"
						initial={{ scale: 0.5, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.5, opacity: 0 }}
						transition={{ duration: 0.12, ease: "easeOut" }}
						className="inline-flex items-center gap-1.5"
					>
						<Check className="size-3.5 text-success" />
						<span>Copied</span>
					</motion.span>
				) : (
					<motion.span
						key="copy"
						initial={{ scale: 0.5, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.5, opacity: 0 }}
						transition={{ duration: 0.12, ease: "easeOut" }}
						className="inline-flex items-center gap-1.5"
					>
						<Copy className="size-3.5" />
						<span>Copy</span>
					</motion.span>
				)}
			</AnimatePresence>
		</button>
	);
}
