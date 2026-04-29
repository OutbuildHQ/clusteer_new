"use client";

import { cn } from "@/lib/utils";

export function CurrencyMorph({ className }: { className?: string }) {
	return (
		<div className={cn("absolute inset-0 overflow-hidden pointer-events-none select-none", className)} aria-hidden="true">
			<style>{`
				@keyframes morph-pulse {
					0%, 100% { opacity: 0.06; transform: scale(1); }
					50% { opacity: 0.12; transform: scale(1.03); }
				}
				@keyframes morph-drift-left {
					0%, 100% { transform: translateX(0); }
					50% { transform: translateX(-8px); }
				}
				@keyframes morph-drift-right {
					0%, 100% { transform: translateX(0); }
					50% { transform: translateX(8px); }
				}
				@keyframes morph-blend {
					0%, 100% { opacity: 0.04; filter: blur(2px); }
					50% { opacity: 0.10; filter: blur(0px); }
				}
			`}</style>

			{/* Naira symbol — left side */}
			<div
				className="absolute top-1/2 left-[20%] -translate-y-1/2 font-display font-bold text-white leading-none"
				style={{
					fontSize: "clamp(280px, 35vw, 420px)",
					animation: "morph-drift-left 12s ease-in-out infinite, morph-pulse 12s ease-in-out infinite",
					opacity: 0.07,
				}}
			>
				₦
			</div>

			{/* USDT symbol — right side */}
			<div
				className="absolute top-1/2 right-[15%] -translate-y-1/2 font-display font-bold text-white leading-none"
				style={{
					fontSize: "clamp(280px, 35vw, 420px)",
					animation: "morph-drift-right 12s ease-in-out infinite, morph-pulse 12s ease-in-out 1s infinite",
					opacity: 0.07,
				}}
			>
				₮
			</div>

			{/* Overlap zone — center blend */}
			<div className="absolute inset-0 flex items-center justify-center">
				<div
					className="font-display font-bold text-white/10 leading-none"
					style={{
						fontSize: "clamp(100px, 14vw, 160px)",
						animation: "morph-blend 8s ease-in-out infinite",
						letterSpacing: "0.1em",
					}}
				>
					↔
				</div>
			</div>

			{/* Subtle connecting dots between the two symbols */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3">
				{Array.from({ length: 5 }).map((_, i) => (
					<span
						key={i}
						className="size-1.5 rounded-full bg-white"
						style={{
							opacity: 0.08 + i * 0.03,
							animation: `morph-pulse ${6 + i * 1.5}s ease-in-out ${i * -1.2}s infinite`,
						}}
					/>
				))}
			</div>
		</div>
	);
}
