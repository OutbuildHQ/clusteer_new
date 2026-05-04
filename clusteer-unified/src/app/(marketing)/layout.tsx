import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-background">
			{/* ─── Nav ─── */}
			<nav className="sticky top-0 z-50 border-b border-custom-black/6 bg-background/85 backdrop-blur-xl">
				<div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-8">
					<Link href="/">
						<Logo />
					</Link>
					<div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
						<Link href="/about" className="hover:text-foreground transition-colors">About</Link>
						<Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
						<Link href="/press" className="hover:text-foreground transition-colors">Press</Link>
						<Link href="/status" className="hover:text-foreground transition-colors">Status</Link>
					</div>
					<div className="flex items-center gap-3">
						<Button variant="ghost" asChild size="sm" className="hidden sm:inline-flex font-semibold">
							<Link href="/login">Sign in</Link>
						</Button>
						<Button asChild size="sm" className="btn-shine shadow-brutal-sm">
							<Link href="/signup">Get started <ArrowRight className="size-4" /></Link>
						</Button>
					</div>
				</div>
			</nav>

			{children}

			{/* ─── Footer ─── */}
			<footer className="bg-custom-black text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-8">
				<div className="max-w-[1280px] mx-auto">
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-10 mb-10 sm:mb-16">
						<div className="col-span-2 sm:col-span-3 lg:col-span-1">
							<Logo inverted />
							<p className="mt-4 sm:mt-5 text-[13px] sm:text-[14px] leading-[1.6] text-white/60 max-w-[280px]">
								Stablecoins to naira, fast. Built for traders, freelancers, and anyone moving money in and out of Nigeria.
							</p>
							<Link href="/status" className="inline-flex items-center gap-2 mt-5 px-3 py-1.5 rounded-full bg-light-green/[0.12] font-mono text-[11px] font-medium text-light-green hover:bg-light-green/[0.18] transition-colors">
								<span className="live-dot size-1.5 rounded-full bg-light-green" />
								All systems operational
							</Link>
						</div>
						{[
							{ t: "Product", l: [["Buy stables", "/signup"], ["Sell stables", "/signup"], ["Swap", "/signup"], ["Pricing", "/#rates"]] },
							{ t: "Company", l: [["About", "/about"], ["Press", "/press"], ["Contact", "/contact"], ["Status", "/status"]] },
							{ t: "Resources", l: [["Help center", "/contact"], ["Security", "/security-info"], ["FAQ", "/#faq"]] },
							{ t: "Legal", l: [["Terms", "/terms-of-service"], ["Privacy", "/privacy-policy"]] },
						].map((c) => (
							<div key={c.t}>
								<div className="font-mono text-[11px] font-semibold text-white/40 tracking-[1.5px] mb-4">{c.t.toUpperCase()}</div>
								<ul className="flex flex-col gap-2.5">
									{c.l.map(([label, href]) => (
										<li key={label}>
											<Link href={href} className="text-sm text-white/75 hover:text-white transition-colors">{label}</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
					<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 pt-6 sm:pt-7 border-t border-white/10 text-[11px] sm:text-xs text-white/50">
						<span>&copy; {new Date().getFullYear()} Clusteer. All rights reserved.</span>
						<span className="font-mono">A product of Outbuild Ltd.</span>
					</div>
				</div>
			</footer>
		</div>
	);
}
