import { PageIntro, MarketingClose, ResourceLink } from "@/components/brand/marketing-sections";
export const metadata = {
	title: "Clusteer mobile — In development | Clusteer",
	description: "A mobile experience for Clusteer is in development.",
};
export default function Page() {
	return (
		<main>
			<PageIntro
				eyebrow="Clusteer mobile"
				title="The next step. In your pocket."
				description="A mobile experience for Clusteer is in development."
			/>
			<section className="cl-container">
				<div className="cl-coming-content">
					<span className="cl-availability">In development</span>
					<h2>Follow what comes next.</h2>
					<p>
						There is no app-store download available from this page yet. Join the waitlist to hear
						when access opens.
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
