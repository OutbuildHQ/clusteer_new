import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { ArrowRight, ArrowLeft, LifeBuoy } from "lucide-react";

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			{/* ─── Nav ─── */}
			<nav className="border-b border-custom-black/6 px-4 sm:px-8 py-4">
				<div className="mx-auto flex max-w-[1280px] items-center justify-between">
					<Link href="/">
						<Logo />
					</Link>
					<Button asChild size="sm" className="btn-shine shadow-brutal-sm">
						<Link href="/early-access">
							Join the waitlist <ArrowRight className="size-4" />
						</Link>
					</Button>
				</div>
			</nav>

			{/* ─── 404 ─── */}
			<main className="flex flex-1 items-center px-4 sm:px-8">
				<div className="mx-auto w-full max-w-[1280px] py-16 sm:py-24">
					<div className="max-w-[760px]">
						<div className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-custom-black/70 mb-3 sm:mb-4">
							&#9670; ERROR 404
						</div>
						<h1 className="font-display text-[clamp(40px,11vw,104px)] sm:text-[clamp(56px,8vw,104px)] font-bold leading-[0.9] tracking-[-0.045em]">
							Page not <em className="italic">found.</em>
						</h1>
						<p className="mt-5 sm:mt-7 text-[15px] sm:text-[17px] lg:text-[19px] text-muted-foreground max-w-[560px] leading-[1.55]">
							The page you were looking for doesn&apos;t exist, may have been
							moved, or is still on its way. Let&apos;s get you back on track.
						</p>
						<div className="mt-8 sm:mt-10 flex flex-wrap gap-3">
							<Button asChild size="lg" className="btn-shine shadow-brutal-sm">
								<Link href="/">
									<ArrowLeft className="size-4" /> Back to homepage
								</Link>
							</Button>
							<Button
								variant="outline"
								asChild
								size="lg"
								className="border-2 border-custom-black shadow-brutal-sm"
							>
								<Link href="/help">
									<LifeBuoy className="size-4" /> Visit help center
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
