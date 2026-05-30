import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { Home, ArrowRight } from "lucide-react";

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col bg-muted/40">
			<nav className="border-b border-border bg-background px-6 py-4">
				<Logo />
			</nav>
			<main className="flex flex-1 items-center justify-center px-6">
				<div className="max-w-md text-center">
					<div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-light-green/10 font-display text-4xl font-bold text-light-green">404</div>
					<h1 className="font-display text-3xl font-bold tracking-tight">Page not found</h1>
					<p className="mt-3 text-muted-foreground">The page you were looking for doesn't exist or may have been moved.</p>
					<div className="mt-8 flex flex-wrap justify-center gap-3">
						<Button asChild><Link href="/dashboard"><Home className="size-4" />Go to dashboard</Link></Button>
						<Button variant="outline" asChild><Link href="/">Back to homepage <ArrowRight className="size-4" /></Link></Button>
					</div>
				</div>
			</main>
		</div>
	);
}
