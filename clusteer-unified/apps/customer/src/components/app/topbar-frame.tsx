import type { ReactNode } from "react";

export function TopBarFrame({ children }: { children: ReactNode }) {
	return (
		<header
			className="sticky top-0 z-30 flex items-center gap-2 sm:gap-3 shrink-0 px-3 sm:px-4 lg:px-6"
			style={{
				borderBottom: "1px solid var(--c-line)",
				background: "var(--c-surface)",
				height: 68,
			}}
		>
			{children}
		</header>
	);
}
