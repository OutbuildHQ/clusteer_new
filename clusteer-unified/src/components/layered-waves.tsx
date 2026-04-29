"use client";

import { cn } from "@/lib/utils";

export function LayeredWaves({ className, dark = false }: { className?: string; dark?: boolean }) {
	const stroke = dark ? "rgba(0,0,0," : "rgba(255,255,255,";
	return (
		<div className={cn("absolute inset-0 overflow-hidden pointer-events-none select-none", className)} aria-hidden="true">
			<style>{`
				@keyframes wave-drift-1 { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-40px); } }
				@keyframes wave-drift-2 { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(30px); } }
				@keyframes wave-drift-3 { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-20px); } }
				@keyframes wave-drift-4 { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(50px); } }
			`}</style>
			<svg
				className="absolute inset-0 w-full h-full"
				viewBox="0 0 1200 800"
				preserveAspectRatio="none"
				fill="none"
			>
				{/* Wave 1 — top, slow */}
				<path
					d="M-100,250 C150,180 350,320 600,250 C850,180 1050,320 1300,250"
					stroke={`${stroke}0.04)`}
					strokeWidth="1.5"
					style={{ animation: "wave-drift-1 18s ease-in-out infinite" }}
				/>
				{/* Wave 2 — upper middle */}
				<path
					d="M-100,350 C200,280 400,420 650,350 C900,280 1100,420 1300,350"
					stroke={`${stroke}0.07)`}
					strokeWidth="1.5"
					style={{ animation: "wave-drift-2 14s ease-in-out infinite" }}
				/>
				{/* Wave 3 — center, most visible */}
				<path
					d="M-100,450 C180,380 380,520 630,450 C880,380 1080,520 1300,450"
					stroke={`${stroke}0.10)`}
					strokeWidth="2"
					style={{ animation: "wave-drift-3 10s ease-in-out infinite" }}
				/>
				{/* Wave 4 — lower */}
				<path
					d="M-100,550 C250,480 450,620 700,550 C950,480 1150,620 1300,550"
					stroke={`${stroke}0.06)`}
					strokeWidth="1.5"
					style={{ animation: "wave-drift-4 16s ease-in-out infinite" }}
				/>

				{/* Filled area under wave 3 for depth */}
				<path
					d="M-100,450 C180,380 380,520 630,450 C880,380 1080,520 1300,450 L1300,800 L-100,800 Z"
					fill={`${stroke}0.02)`}
					style={{ animation: "wave-drift-3 10s ease-in-out infinite" }}
				/>
			</svg>
		</div>
	);
}
