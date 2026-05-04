import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { PixelRain } from "@/components/pixel-rain";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen grid lg:grid-cols-[1fr_1fr] bg-background">
			{/* Brand side — onyx bg with green grid + pixel rain */}
			<div className="relative hidden lg:flex flex-col justify-between p-10 bg-custom-black text-light-green overflow-hidden">
				{/* SVG grid pattern overlay */}
				<svg className="pointer-events-none absolute inset-0 z-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<pattern id="auth-grid" width="40" height="40" patternUnits="userSpaceOnUse">
							<path d="M 40 0 L 0 0 0 40" fill="none" stroke="#9FE870" strokeWidth="0.5" opacity="0.06" />
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#auth-grid)" />
				</svg>
				<PixelRain className="z-[1]" />
				<Link href="/" className="relative z-10">
					<Logo inverted />
				</Link>
				<div className="relative z-10 max-w-md">
					<p className="mb-3 font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-light-green/60">Secure Platform</p>
					<h2 className="font-display text-4xl font-bold leading-tight tracking-[-0.03em] text-light-green">
						Move Naira in, stablecoins out. Bank-grade, mobile-first.
					</h2>
					<p className="mt-4 text-white/60">
						Trusted by thousands across Nigeria. Licensed, audited, and insured.
					</p>
					<div className="mt-8 flex flex-wrap gap-2 text-xs text-light-green/80">
						<span className="rounded-full border-2 border-light-green/20 bg-light-green/10 px-3 py-1">SEC Nigeria &middot; VASP</span>
						<span className="rounded-full border-2 border-light-green/20 bg-light-green/10 px-3 py-1">AES-256 encryption</span>
						<span className="rounded-full border-2 border-light-green/20 bg-light-green/10 px-3 py-1">Multi-sig custody</span>
					</div>
				</div>
				<div className="relative z-10 text-xs text-white/30">&copy; {new Date().getFullYear()} Clusteer Technologies Ltd.</div>
			</div>
			{/* Form side */}
			<div className="flex flex-col">
				<div className="lg:hidden border-b-2 border-custom-black px-6 py-4">
					<Link href="/"><Logo /></Link>
				</div>
				<div className="flex-1 flex items-center justify-center p-6 md:p-10">
					<div className="w-full max-w-md">{children}</div>
				</div>
			</div>
		</div>
	);
}
