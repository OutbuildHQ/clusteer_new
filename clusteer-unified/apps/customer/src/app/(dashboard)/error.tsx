"use client";

import { useEffect } from "react";

export default function DashboardError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Dashboard error:", error);
	}, [error]);

	return (
		<div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-8">
			<h2 className="text-xl font-semibold text-foreground">Something went wrong</h2>
			<p className="text-sm text-muted-foreground text-center max-w-md">
				An unexpected error occurred. Please try again or contact support if the issue persists.
			</p>
			<button
				onClick={reset}
				style={{ height: 36, padding: "0 14px", borderRadius: 10, fontSize: 13.5, fontWeight: 500, border: "1px solid var(--c-line)", background: "transparent", color: "var(--c-text)", cursor: "pointer" }}
			>
				Try again
			</button>
		</div>
	);
}
