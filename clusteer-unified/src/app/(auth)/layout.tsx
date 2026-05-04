import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-[100dvh] grid lg:grid-cols-[1fr_1fr] bg-background">
			{/* Brand side — warm beige with bold Clusteer personality */}
			<div className="relative hidden lg:flex flex-col justify-between p-10 bg-warm-beige overflow-hidden">
				{/* Large watermark logo */}
				<div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-[0.04]">
					<svg viewBox="0 0 100 100" className="w-[600px] h-[600px] text-custom-black">
						<circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
						<text x="50" y="58" textAnchor="middle" fontSize="24" fontWeight="bold" fill="currentColor">C</text>
					</svg>
				</div>

				{/* Decorative dots grid */}
				<svg className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<pattern id="auth-dots" width="24" height="24" patternUnits="userSpaceOnUse">
							<circle cx="2" cy="2" r="1" fill="currentColor" className="text-custom-black" />
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#auth-dots)" />
				</svg>

				<Link href="/" className="relative z-10">
					<Logo />
				</Link>

				<div className="relative z-10 max-w-md">
					{/* Kicker */}
					<p className="mb-3 font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-brand-800">
						&#9670; Secure &middot; Fast &middot; Licensed
					</p>
					<h2 className="font-display text-4xl font-bold leading-tight tracking-[-0.03em] text-custom-black">
						Your stablecoins,{" "}
						<span className="text-light-green bg-custom-black px-2 py-0.5 rounded-lg inline-block">your Naira.</span>
					</h2>
					<p className="mt-4 text-custom-black/60 text-[15px] leading-relaxed">
						Buy, sell, and hold USDT — directly from your Nigerian bank account. No debit card required.
					</p>

					{/* Trust pills */}
					<div className="mt-8 flex flex-wrap gap-2">
						<span className="rounded-full border-2 border-custom-black bg-white px-3.5 py-1.5 text-xs font-semibold text-custom-black shadow-brutal-xs">
							SEC Nigeria &middot; VASP
						</span>
						<span className="rounded-full border-2 border-custom-black bg-white px-3.5 py-1.5 text-xs font-semibold text-custom-black shadow-brutal-xs">
							AES-256 encryption
						</span>
						<span className="rounded-full border-2 border-custom-black bg-white px-3.5 py-1.5 text-xs font-semibold text-custom-black shadow-brutal-xs">
							Multi-sig custody
						</span>
					</div>

					{/* Mini stats */}
					<div className="mt-8 flex gap-8">
						<div>
							<p className="font-display text-2xl font-bold text-custom-black">12K+</p>
							<p className="text-xs text-custom-black/50 font-medium">Users</p>
						</div>
						<div>
							<p className="font-display text-2xl font-bold text-custom-black">₦4B+</p>
							<p className="text-xs text-custom-black/50 font-medium">Traded</p>
						</div>
						<div>
							<p className="font-display text-2xl font-bold text-custom-black">5</p>
							<p className="text-xs text-custom-black/50 font-medium">Chains</p>
						</div>
					</div>
				</div>

				<div className="relative z-10 text-xs text-custom-black/30">
					&copy; {new Date().getFullYear()} Clusteer Technologies Ltd. RC 1234567
				</div>
			</div>

			{/* Form side */}
			<div className="flex flex-col">
				<div className="lg:hidden border-b-2 border-custom-black px-4 sm:px-6 py-3 sm:py-4">
					<Link href="/"><Logo /></Link>
				</div>
				<div className="flex-1 flex items-center justify-center px-4 py-6 sm:p-6 md:p-10">
					<div className="w-full max-w-md">{children}</div>
				</div>
			</div>
		</div>
	);
}
