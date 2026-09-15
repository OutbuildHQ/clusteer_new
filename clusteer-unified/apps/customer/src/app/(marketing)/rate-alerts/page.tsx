import { PageIntro, MarketingClose, ResourceLink } from "@/components/brand/marketing-sections";
export const metadata = {
	title: "Rate alerts — In development | Clusteer",
	description: "Rate alerts are a planned way to follow a conversion rate that matters to you.",
};
export default function Page() {
	return (
		<main>
			<PageIntro
				eyebrow="Rate alerts"
				title="A rate worth coming back for."
				description="Rate alerts are a planned way to follow a conversion rate that matters to you."
			/>
			<section className="cl-container">
				<div className="cl-coming-content">
					<span className="cl-availability">In development</span>
					<h2>Follow what comes next.</h2>
					<p>
						Alerts are not active on this website. Joining the general waitlist does not create a
						rate alert or subscribe you to market notifications.
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
