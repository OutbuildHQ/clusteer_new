import { PageIntro, MarketingClose, ResourceLink } from "@/components/brand/marketing-sections";
export const metadata = {
	title: "Payment requests — In development | Clusteer",
	description:
		"Payment requests are in development. The intended experience is a shareable request with an amount and a way to follow its progress.",
};
export default function Page() {
	return (
		<main>
			<PageIntro
				eyebrow="Payment requests"
				title="A simpler way to ask for a payment."
				description="Payment requests are in development. The intended experience is a shareable request with an amount and a way to follow its progress."
			/>
			<section className="cl-container">
				<div className="cl-coming-content">
					<span className="cl-availability">In development</span>
					<h2>Follow what comes next.</h2>
					<p>
						There is no public payment-request flow available through this website. Join the
						waitlist for news about access, or explore buying and selling.
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
