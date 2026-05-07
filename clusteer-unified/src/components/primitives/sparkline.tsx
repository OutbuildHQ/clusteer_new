"use client";

import { cn } from "@/lib/utils";

export function Sparkline({
	data,
	width = 120,
	height = 36,
	tone = "auto",
	className,
}: {
	data: number[];
	width?: number;
	height?: number;
	tone?: "auto" | "positive" | "negative" | "neutral";
	className?: string;
}) {
	if (!data.length) return null;
	const min = Math.min(...data);
	const max = Math.max(...data);
	const range = max - min || 1;
	const points = data
		.map((v, i) => {
			const x = (i / (data.length - 1)) * width;
			const y = height - ((v - min) / range) * height;
			return `${x.toFixed(1)},${y.toFixed(1)}`;
		})
		.join(" ");

	const direction = data[data.length - 1] >= data[0] ? "positive" : "negative";
	const effective = tone === "auto" ? direction : tone;
	const stroke =
		effective === "positive"
			? "var(--success)"
			: effective === "negative"
			? "var(--danger)"
			: "var(--muted-foreground)";

	return (
		<svg
			viewBox={`0 0 ${width} ${height}`}
			width={width}
			height={height}
			className={cn("block", className)}
			preserveAspectRatio="none"
		>
			<polyline
				fill="none"
				stroke={stroke}
				strokeWidth="1.75"
				strokeLinecap="round"
				strokeLinejoin="round"
				points={points}
			/>
		</svg>
	);
}
