import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen grid lg:grid-cols-[1fr_1fr] bg-background">
			<div className="relative hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 text-white overflow-hidden">
				<div className="absolute inset-0 bg-grid opacity-[0.08]" aria-hidden />
				<Link href="/" className="relative z-10">
					<Logo className="text-white [&>svg_rect]:fill-white/15" />
				</Link>
				<div className="relative z-10 max-w-md">
					<h2 className="font-display text-4xl font-bold leading-tight tracking-tight">
						Move Naira in, crypto out. Bank-grade, mobile-first.
					</h2>
					<p className="mt-4 text-white/70">
						Trusted by thousands across Nigeria. Licensed, audited, and insured.
					</p>
					<div className="mt-8 flex flex-wrap gap-2 text-xs text-white/80">
						<span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">SEC Nigeria · VASP</span>
						<span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">ISO 27001</span>
						<span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">Multi-sig custody</span>
					</div>
				</div>
				<div className="relative z-10 text-xs text-white/60">© {new Date().getFullYear()} Clusteer</div>
			</div>
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
