"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

const CHARS = ["0", "1", "₦", "₮", "$", "·"];

function seededRandom(seed: number) {
	const x = Math.sin(seed * 9301 + 49297) * 49297;
	return x - Math.floor(x);
}

export function PixelRain({
	className,
	columns = 14,
	seed = 33,
	variant = "light",
}: {
	className?: string;
	columns?: number;
	seed?: number;
	variant?: "light" | "dark";
}) {
	const cols = useMemo(() => {
		return Array.from({ length: columns }).map((_, c) => {
			const charCount = 8 + Math.floor(seededRandom(seed + c * 7) * 8); // 8-15 chars per column
			const speed = 14 + seededRandom(seed + c * 13) * 18; // 14-32s
			const delay = seededRandom(seed + c * 19) * -30;
			const left = (c / columns) * 100;
			const opacity = variant === "dark"
				? 0.15 + seededRandom(seed + c * 31) * 0.25  // 0.15-0.40 on light bg
				: 0.06 + seededRandom(seed + c * 31) * 0.12; // 0.06-0.18 on dark bg

			const chars = Array.from({ length: charCount }).map((_, i) => {
				const charIdx = Math.floor(seededRandom(seed + c * 100 + i * 11) * CHARS.length);
				return CHARS[charIdx];
			});

			return { chars, speed, delay, left, opacity };
		});
	}, [columns, seed]);

	return (
		<div className={cn("absolute inset-0 overflow-hidden pointer-events-none select-none", className)} aria-hidden="true">
			<style>{`
				@keyframes pixel-fall {
					0% { transform: translateY(-100%); }
					100% { transform: translateY(100vh); }
				}
			`}</style>
			{cols.map((col, c) => (
				<div
					key={c}
					className={`absolute top-0 flex flex-col items-center gap-4 font-mono ${variant === "dark" ? "text-sm text-custom-black/70" : "text-xs text-light-green"}`}
					style={{
						left: `${col.left}%`,
						opacity: col.opacity,
						animation: `pixel-fall ${col.speed}s linear ${col.delay}s infinite`,
					}}
				>
					{col.chars.map((char, i) => (
						<span
							key={i}
							style={{
								opacity: i < 2 ? 0.3 + i * 0.2 : i > col.chars.length - 3 ? 0.3 : 0.7 + seededRandom(c * 50 + i) * 0.3,
							}}
						>
							{char}
						</span>
					))}
				</div>
			))}
		</div>
	);
}
