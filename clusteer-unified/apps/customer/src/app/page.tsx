/* THESIS: A waterfront workroom leads into a real conversion workspace, then answers the buyer’s questions.
 * OWN-WORLD: Forest, paper, restrained lime, original workspace photography, Sora and shared product components.
 * STORY: See both conversion directions, follow the money, understand costs, join early access.
 * FIRST VIEWPORT: Architectural scene with centred proposition, two actions, and the approaching product window.
 * FORM: Extension of the approved Mercury direction and the accepted comparative-audit storyboard. */
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/app/site-header";
import { Footer } from "@/components/app/footer";
import { ConversionStories } from "@/components/brand/conversion-stories";
import { CustomerDashboardShowcase } from "@/components/app/customer-dashboard-showcase";
import { ScrollStory } from "@/components/brand/scroll-story";
import { MarketingFaq, MarketingClose } from "@/components/brand/marketing-sections";
import { BrandAssets } from "@/components/brand/brand-assets";
import { homeFaqs } from "@/lib/marketing-content";
import { ThemeProvider } from "@/providers/ThemeProvider";
export default function HomePage() {
	return (
		<ThemeProvider forcedTheme="light">
			<div className="cl-marketing cl-home">
				<a className="cl-skip" href="#how">
					Skip to content
				</a>
				<SiteHeader overlay />
				<main id="main">
					<ScrollStory product={<CustomerDashboardShowcase />} />
					<ConversionStories />
					<section className="cl-fund-section" id="trust">
						<div className="cl-container">
							<div className="cl-assurance-heading">
								<div>
									<span>The details stay with you</span>
									<h2>
										Know the quote.
										<br />
										Follow the order.
									</h2>
								</div>
								<p>Your quote, transfer progress and receipt stay together.</p>
							</div>
							<BrandAssets />
							<div className="cl-operator-note">
								<div>
									<strong>
										Built by Outbuild Ltd <span>RC 8076384</span>
									</strong>
									<p>
										Clusteer is a financial technology product, not a bank. Access is currently by
										invitation.
									</p>
								</div>
								<Link className="cl-text-link" href="/about">
									Meet Clusteer <ArrowUpRight size={16} />
								</Link>
							</div>
						</div>
					</section>
					<section className="cl-home-faq cl-container">
						<div>
							<span>A few useful answers</span>
							<h2>
								Before your
								<br />
								first conversion.
							</h2>
							<Link className="cl-text-link" href="/help">
								Visit the help centre <ArrowRight size={16} />
							</Link>
						</div>
						<MarketingFaq items={homeFaqs} />
					</section>
					<MarketingClose home />
				</main>
				<Footer />
			</div>
		</ThemeProvider>
	);
}
