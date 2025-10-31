"use client";

import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import Image from "next/image";
import { Toast } from "./toast";
import { Button } from "./ui/button";

function copyToClipboard(text?: string) {
	if (text) {
		navigator.clipboard.writeText(text);
		Toast.success("Copied to clipboard");
	}
}

interface Props {
	icon?: string;
	className?: string;
	value?: string;
	withoutText?: boolean;
}

export function CopyButton({
	className,
	value,
	icon,
	withoutText = false,
}: Props) {
	return (
		<Button
			type="button"
			variant={withoutText ? "ghost" : "outline"}
			size="icon"
			className={cn("transition-colors w-fit px-2", className)}
			onClick={() => copyToClipboard(value)}
		>
			{icon ? (
				<Image
					src={icon}
					alt="copy icon"
					width={18}
					height={18}
				/>
			) : (
				<Copy className="size-4.5" />
			)}
			{withoutText && <span className="text-base font-medium">Copy</span>}
		</Button>
	);
}
