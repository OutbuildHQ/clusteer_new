import { cn } from "@/lib/utils";

export function Logo({ className, monogramOnly = false }: { className?: string; monogramOnly?: boolean }) {
	return (
		<span className={cn("inline-flex items-center gap-2 font-display font-bold text-foreground", className)}>
			<svg
				viewBox="0 0 32 32"
				aria-hidden
				className="size-7 shrink-0"
			>
				<defs>
					<linearGradient id="clusteer-logo-g" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0%" stopColor="var(--clusteer-blue-400)" />
						<stop offset="100%" stopColor="var(--clusteer-blue-700)" />
					</linearGradient>
				</defs>
				<rect x="1" y="1" width="30" height="30" rx="8" fill="url(#clusteer-logo-g)" />
				<path
					d="M10 12.5a5.5 5.5 0 0 1 10.6-2"
					stroke="white"
					strokeWidth="2.25"
					strokeLinecap="round"
					fill="none"
				/>
				<path
					d="M10 19.5a5.5 5.5 0 0 0 10.6 2"
					stroke="white"
					strokeWidth="2.25"
					strokeLinecap="round"
					fill="none"
				/>
				<circle cx="22" cy="10" r="1.75" fill="white" />
				<circle cx="22" cy="22" r="1.75" fill="white" />
			</svg>
			{!monogramOnly && <span className="text-lg tracking-tight">Clusteer</span>}
		</span>
	);
}
