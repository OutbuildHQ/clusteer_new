import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthAccentPanel } from "./auth-accent-panel";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider forcedTheme="light">
		<div
			className="min-h-[100dvh] grid lg:grid-cols-2"
			style={{ background: "var(--c-bg)", color: "var(--c-text)", fontFamily: "var(--f-sans)" }}
		>
			{/* Form side — scrollable on mobile */}
			<div className="flex flex-col min-h-[100dvh] lg:min-h-0 overflow-auto">
				{/* Top bar */}
				<div className="flex items-center justify-between px-5 sm:px-10 py-4 sm:py-6">
					<Link href="/" className="flex items-center gap-3">
						<Logo monogramOnly />
						<span className="font-display text-lg font-semibold" style={{ fontFamily: "var(--f-display)" }}>Clusteer</span>
					</Link>
				</div>

				{/* Content — top-aligned on mobile, centered on desktop */}
				<div className="flex-1 flex lg:items-center justify-center px-5 sm:px-10 py-4 sm:py-6">
					<div className="w-full max-w-[420px]">{children}</div>
				</div>

				{/* Footer */}
				<div
					className="flex items-center justify-between px-5 sm:px-10 py-4 sm:py-5 text-xs"
					style={{ color: "var(--c-text-3)" }}
				>
					<div>&copy; Clusteer</div>
					<div className="flex items-center gap-3">
						<Link href="/terms-of-service" className="hover:underline">Terms</Link>
						<Link href="/privacy-policy" className="hover:underline">Privacy</Link>
						<span className="hidden sm:inline">
							<Link href="/contact" className="hover:underline">Help</Link>
						</span>
					</div>
				</div>
			</div>

			{/* Accent panel — hidden on mobile/tablet */}
			<AuthAccentPanel />
		</div>
		</ThemeProvider>
	);
}
