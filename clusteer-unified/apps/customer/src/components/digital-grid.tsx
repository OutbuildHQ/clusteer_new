"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

const CHARS = ["0", "1", "■", "□", "▪", "●", "○"];
const COLORS = [
	"oklch(0.75 0.12 145)",   // soft green
	"oklch(0.78 0.08 200)",   // soft blue
	"oklch(0.80 0.10 80)",    // soft amber
	"oklch(0.76 0.12 330)",   // soft pink
	"oklch(0.82 0.06 260)",   // soft lavender
	"oklch(0.78 0.10 160)",   // soft teal
];

function seededRandom(seed: number) {
	const x = Math.sin(seed * 9301 + 49297) * 49297;
	return x - Math.floor(x);
}

export function DigitalGrid({
	className,
	cols = 36,
	rows = 16,
	seed = 42,
}: {
	className?: string;
	cols?: number;
	rows?: number;
	seed?: number;
}) {
	const cells = useMemo(() => {
		const out: { char: string; color: string; peakOpacity: number; x: number; y: number; delay: number; duration: number; driftX: number; driftY: number }[] = [];
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				const i = r * cols + c;
				const rand = seededRandom(seed + i);
				if (rand > 0.65) continue;
				const charIdx = Math.floor(seededRandom(seed + i * 7) * CHARS.length);
				const colorIdx = Math.floor(seededRandom(seed + i * 13) * COLORS.length);
				const peakOpacity = 0.20 + seededRandom(seed + i * 3) * 0.20;
				const delay = seededRandom(seed + i * 23) * -25;
				const duration = 8 + seededRandom(seed + i * 31) * 14; // 8-22s per cycle
				const driftX = (seededRandom(seed + i * 41) - 0.5) * 6; // ±3px
				const driftY = (seededRandom(seed + i * 47) - 0.5) * 8; // ±4px
				out.push({
					char: CHARS[charIdx],
					color: COLORS[colorIdx],
					peakOpacity,
					x: (c / cols) * 100,
					y: (r / rows) * 100,
					delay,
					duration,
					driftX,
					driftY,
				});
			}
		}
		return out;
	}, [cols, rows, seed]);

	return (
		<div className={cn("absolute inset-0 overflow-hidden pointer-events-none select-none", className)} aria-hidden="true">
			<style>{`
				@keyframes digital-breathe {
					0%, 100% { opacity: 0; transform: translate(0, 0); }
					15% { opacity: var(--peak); }
					50% { opacity: var(--peak); transform: translate(var(--dx), var(--dy)); }
					85% { opacity: var(--peak); }
				}
			`}</style>
			{cells.map((cell, i) => (
				<span
					key={i}
					className="absolute font-mono text-xs sm:text-sm leading-none"
					style={{
						left: `${cell.x}%`,
						top: `${cell.y}%`,
						color: cell.color,
						"--peak": cell.peakOpacity,
						"--dx": `${cell.driftX}px`,
						"--dy": `${cell.driftY}px`,
						animation: `digital-breathe ${cell.duration}s ease-in-out ${cell.delay}s infinite`,
					} as React.CSSProperties}
				>
					{cell.char}
				</span>
			))}
		</div>
	);
}
