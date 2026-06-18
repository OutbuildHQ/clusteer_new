import { SiteHeader } from "@/components/app/site-header";
import { Footer } from "@/components/app/footer";
import { ThemeProvider } from "@/providers/ThemeProvider";

export default function MarketingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ThemeProvider forcedTheme="light">
			<div className="min-h-screen bg-background">
				<SiteHeader />
				{children}
				<Footer />
			</div>
		</ThemeProvider>
	);
}
