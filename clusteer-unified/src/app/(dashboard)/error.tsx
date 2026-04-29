"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

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
			<h2 className="text-xl font-semibold text-[var(--cl-text)]">Something went wrong</h2>
			<p className="text-sm text-[var(--cl-text-3)] text-center max-w-md">
				An unexpected error occurred. Please try again or contact support if the issue persists.
			</p>
			<Button onClick={reset} variant="outline">
				Try again
			</Button>
		</div>
	);
}
