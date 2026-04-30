"use client";

import { useEffect } from "react";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Application error:", error);
	}, [error]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
			<h2 className="text-xl font-semibold text-foreground">Something went wrong</h2>
			<p className="text-sm text-muted-foreground text-center max-w-md">
				An unexpected error occurred. Please try again or contact support if the issue persists.
			</p>
			<button
				onClick={reset}
				className="px-4 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-md hover:bg-background"
			>
				Try again
			</button>
		</div>
	);
}
