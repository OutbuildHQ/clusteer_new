import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Footer } from "@/components/app/footer";
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
						<Link href="/about" className="rounded-full px-3 py-1.5 hover:bg-warm-beige transition-all duration-200">About</Link>
						<Link href="/contact" className="rounded-full px-3 py-1.5 hover:bg-warm-beige transition-all duration-200">Contact</Link>
						<Link href="/press" className="rounded-full px-3 py-1.5 hover:bg-warm-beige transition-all duration-200">Press</Link>
						<Link href="/status" className="rounded-full px-3 py-1.5 hover:bg-warm-beige transition-all duration-200">Status</Link>
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
			<Footer />
		</div>
	);
}
