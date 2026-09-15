import { PageIntro, MarketingClose, ResourceLink } from "@/components/brand/marketing-sections";
export const metadata = {
	title: "Market view — In development | Clusteer",
	description: "The market view is in development.",
};
export default function Page() {
	return (
		<main>
			<PageIntro
				eyebrow="Market view"
				title="A closer view of the rate."
				description="The market view is in development."
			/>
			<section className="cl-container">
				<div className="cl-coming-content">
					<span className="cl-availability">In development</span>
					<h2>Follow what comes next.</h2>
					<p>
						Explore a conversion to understand a quote, or read how rates and fees fit together.
					</p>
					<ResourceLink href="/demo">Explore a conversion</ResourceLink>
					<br />
					<ResourceLink href="/fees">Understand fees & rates</ResourceLink>
				</div>
			</section>
			<MarketingClose />
		</main>
	);
}
