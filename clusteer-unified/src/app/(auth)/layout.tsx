import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ThemeProvider } from "@/providers/ThemeProvider";

function AuthAccentPanel() {
	return (
		<div
			className="relative hidden lg:flex items-center justify-center overflow-hidden"
			style={{ background: "var(--c-onyx-900)", color: "var(--c-cream)" }}
		>
			{/* Lime gradient blobs */}
			<div
				className="absolute rounded-full"
				style={{
					width: 520, height: 520, top: -120, right: -160,
					background: "radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--c-lime-500) 55%, transparent), transparent 70%)",
				}}
			/>
			<div
				className="absolute rounded-full"
				style={{
					width: 360, height: 360, bottom: -80, left: -100,
					background: "radial-gradient(circle, color-mix(in oklab, var(--c-lime-500) 32%, transparent), transparent 65%)",
				}}
			/>

			<div className="relative z-10 p-12 max-w-[480px]">
				{/* Live rate badge */}
				<div
					className="flex items-center gap-2 mb-4"
					style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--c-lime-500)", fontWeight: 600 }}
				>
					<span
						className="inline-block rounded-full"
						style={{
							width: 6, height: 6,
							background: "var(--c-lime-500)",
							boxShadow: "0 0 12px var(--c-lime-500)",
						}}
					/>
					Live &middot; USDT / NGN
				</div>

				{/* Price */}
				<h2
					className="font-display tabular-nums"
					style={{ fontSize: 64, fontWeight: 600, letterSpacing: "-.03em", lineHeight: 1, color: "var(--c-cream)" }}
				>
					&#8358;1,610.50
				</h2>
				<div style={{ color: "rgba(244,241,234,.6)", marginTop: 8, fontSize: 13 }}>
					+0.32% (24h) &middot; 3.8M USDT volume today
				</div>

				{/* Tagline */}
				<div
					className="font-display"
					style={{ marginTop: 48, fontSize: 22, fontWeight: 500, letterSpacing: "-.02em", lineHeight: 1.3, color: "var(--c-cream)" }}
				>
					Naira &#8596; Stablecoins, settled in{" "}
					<span style={{ color: "var(--c-lime-500)" }}>5 minutes</span>.
				</div>
				<div style={{ color: "rgba(244,241,234,.6)", marginTop: 14, fontSize: 13.5, lineHeight: 1.55 }}>
					Verified Nigerians use Clusteer to buy, sell, send and receive USDT &amp; USDC at the fairest rate. No spread games.
				</div>

				{/* Stats */}
				<div
					className="flex items-center gap-4"
					style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(244,241,234,.1)" }}
				>
					{[["92k+", "Verified users"], ["\u20A642B", "Volume settled"], ["4.9\u2605", "App rating"]].map(([v, l]) => (
						<div key={l}>
							<div className="font-display tabular-nums" style={{ fontSize: 20, fontWeight: 600, color: "var(--c-cream)" }}>{v}</div>
							<div style={{ fontSize: 11, color: "rgba(244,241,234,.5)" }}>{l}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider forcedTheme="light">
		<div
			className="min-h-[100dvh] grid lg:grid-cols-2"
			style={{ background: "var(--c-bg)", color: "var(--c-text)", fontFamily: "var(--f-sans)" }}
		>
			{/* Form side */}
			<div className="flex flex-col overflow-auto">
				{/* Top bar */}
				<div className="flex items-center justify-between px-6 sm:px-10 py-6">
					<Link href="/">
						<Logo />
					</Link>
				</div>

				{/* Content */}
				<div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-6">
					<div className="w-full max-w-[420px]">{children}</div>
				</div>

				{/* Footer */}
				<div
					className="flex items-center justify-between px-6 sm:px-10 py-5 text-xs"
					style={{ color: "var(--c-text-3)" }}
				>
					<div>&copy; Clusteer &middot; NDPR-aligned &middot; BVN encrypted</div>
					<div className="hidden sm:flex items-center gap-3">
						<Link href="/terms-of-service" className="hover:underline">Terms</Link>
						<Link href="/privacy-policy" className="hover:underline">Privacy</Link>
						<Link href="/contact" className="hover:underline">Help</Link>
					</div>
				</div>
			</div>

			{/* Accent panel */}
			<AuthAccentPanel />
		</div>
		</ThemeProvider>
	);
}
