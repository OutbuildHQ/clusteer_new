"use client";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

// The application keeps real links; an embedded dashboard supplies its own navigator.
export function DashboardLink({
	href,
	children,
	onNavigate,
	onClick,
	...props
}: {
	href: string;
	children: ReactNode;
	onNavigate?: (href: string) => void;
	onClick?: () => void;
	className?: string;
	style?: CSSProperties;
	"aria-current"?: "page";
}) {
	if (onNavigate)
		return (
			<button
				type="button"
				{...props}
				onClick={() => {
					onClick?.();
					onNavigate(href);
				}}
			>
				{children}
			</button>
		);
	return (
		<Link href={href} {...props} onClick={onClick}>
			{children}
		</Link>
	);
}
