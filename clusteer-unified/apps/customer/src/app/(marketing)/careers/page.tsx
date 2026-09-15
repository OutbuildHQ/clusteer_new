import { PageIntro, ResourceLink } from "@/components/brand/marketing-sections";
export const metadata = {
	title: "Careers — Clusteer",
	description:
		"Meet Clusteer and get in touch about future opportunities. No open positions are currently listed.",
};
export default function CareersPage() {
	return (
		<main>
			<PageIntro
				eyebrow="Careers"
				title="Build money that works."
				description="We are a small team working on how Nigerians move between stablecoins and naira. The details matter, because the money belongs to real people."
			/>
			<section className="cl-prose-section cl-container">
				<span className="cl-availability">No open positions right now</span>
				<h2>We would still like to meet you.</h2>
				<p>
					If you work in engineering, design, compliance or operations and care about getting money
					movement right, send a note to careers@clusteer.com. Tell us about the work you do and
					what you would like to build.
				</p>
				<ResourceLink href="mailto:careers@clusteer.com">
					Get in touch about future roles
				</ResourceLink>
				<h2>How we work</h2>
				<p>
					Build deliberately. Test the details. Make the status of the work clear. We value people
					who take responsibility for both the experience and what happens behind it.
				</p>
			</section>
		</main>
	);
}
