import { SiteHeader } from "@/components/app/site-header";
import { Footer } from "@/components/app/footer";
import { ThemeProvider } from "@/providers/ThemeProvider";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider forcedTheme="light">
			<div className="cl-marketing cl-public-pages">
				<a className="cl-skip" href="#public-content">
					Skip to content
				</a>
				<SiteHeader />
				<div id="public-content" tabIndex={-1}>
					{children}
				</div>
				<Footer />
			</div>
		</ThemeProvider>
	);
}
