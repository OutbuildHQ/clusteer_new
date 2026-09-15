import { Logo } from "@/components/brand/logo";
import { PageIntro, ResourceLink } from "@/components/brand/marketing-sections";
export const metadata = {
	title: "Press & brand — Clusteer",
	description: "Company information, Clusteer brand assets and press contact.",
};
export default function PressPage() {
	return (
		<main>
			<PageIntro
				eyebrow="Press & brand"
				title="The Clusteer story."
				description="Company information and brand resources for people telling our story."
			/>
			<section className="cl-container cl-press-brand">
				<div>
					<Logo />
					<span>Clusteer on light</span>
				</div>
				<div>
					<Logo inverted />
					<span>Clusteer on dark</span>
				</div>
			</section>
			<section className="cl-prose-section cl-container">
				<h2>About the company</h2>
				<p>
					Clusteer is a financial technology product of Outbuild Ltd (RC 8076384), built around
					conversions between stablecoins and Nigerian naira. Buy orders are intended for external
					wallets; sell orders pay out to Nigerian bank accounts. Public access is being prepared
					for launch.
				</p>
				<h2>Brand assets</h2>
				<p>
					Use the Clusteer name and mark without altering their proportions. Contact the team for
					publication-ready files and current usage guidance.
				</p>
				<ResourceLink href="mailto:press@clusteer.com">Request brand assets</ResourceLink>
				<h2>For press enquiries</h2>
				<p>
					For interviews, company details or a fact check before publication, email
					press@clusteer.com. Ask the team for current product availability and pricing instead of
					before publishing.
				</p>
				<ResourceLink href="mailto:press@clusteer.com">Contact the press team</ResourceLink>
			</section>
		</main>
	);
}
