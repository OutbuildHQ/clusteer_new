import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { PixelRain } from "@/components/pixel-rain";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen grid lg:grid-cols-[1fr_1fr] bg-background">
			{/* Brand side — dark bg, lime green text & accents */}
			<div className="relative hidden lg:flex flex-col justify-between p-10 bg-custom-black text-light-green overflow-hidden">
				<PixelRain className="z-0" />
				<Link href="/" className="relative z-10">
					<Logo inverted />
				</Link>
				<div className="relative z-10 max-w-md">
					<h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-light-green">
						Move Naira in, stablecoins out. Bank-grade, mobile-first.
					</h2>
					<p className="mt-4 text-white/50">
						Trusted by thousands across Nigeria. Licensed, audited, and insured.
					</p>
					<div className="mt-8 flex flex-wrap gap-2 text-xs text-light-green/80">
						<span className="rounded-full border border-light-green/20 bg-light-green/10 px-3 py-1">SEC Nigeria · VASP</span>
						<span className="rounded-full border border-light-green/20 bg-light-green/10 px-3 py-1">AES-256 encryption</span>
						<span className="rounded-full border border-light-green/20 bg-light-green/10 px-3 py-1">Multi-sig custody</span>
					</div>
				</div>
				<div className="relative z-10 text-xs text-white/30">© {new Date().getFullYear()} Clusteer Technologies Ltd.</div>
			</div>
			{/* Form side */}
			<div className="flex flex-col">
				<div className="lg:hidden border-b border-border px-6 py-4">
					<Link href="/"><Logo /></Link>
				</div>
				<div className="flex-1 flex items-center justify-center p-6 md:p-10">
					<div className="w-full max-w-md">{children}</div>
				</div>
			</div>
		</div>
	);
}
