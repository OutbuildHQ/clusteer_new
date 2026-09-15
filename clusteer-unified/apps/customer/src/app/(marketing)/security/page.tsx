import {
	PageIntro,
	MarketingClose,
	ResourceLink,
	MarketingFaq,
} from "@/components/brand/marketing-sections";
import { publicProduct } from "@/lib/marketing-content";
export const metadata = {
	title: "Safety & fund flow — Clusteer",
	description:
		"Understand the role of Clusteer, settlement partners and your external wallet or bank in a conversion.",
};
export default function SecurityPage() {
	return (
		<main>
			<PageIntro
				eyebrow="Safety & fund flow"
				title="Understand the journey your money takes."
				description="Your destination, the settlement process and your account each have a part to play. Here is how they fit together."
			/>
			<section className="cl-steps-section cl-container">
				<h2>Three parts of one conversion.</h2>
				<div className="cl-steps-grid">
					<article>
						<span>Your destination</span>
						<h3>A wallet or a bank account.</h3>
						<p>
							You choose an external wallet for a buy, or a Nigerian bank account for a sell. Always
							check that the details match your intended destination.
						</p>
					</article>
					<article>
						<span>Your Clusteer order</span>
						<h3>The quote and instructions.</h3>
						<p>
							Clusteer brings the conversion details and status into one order. Keep its reference
							when asking for help.
						</p>
					</article>
					<article>
						<span>Settlement partners</span>
						<h3>The transfer process.</h3>
						<p>
							Payment and stablecoin transfers are processed through settlement partners. Funds move
							through that process to the selected destination.
						</p>
					</article>
				</div>
			</section>
			<section className="cl-prose-section cl-container">
				<h2>Keep account secrets private.</h2>
				<p>
					Never share your password, one-time codes or wallet recovery phrase. When contacting
					support, use an order reference or transaction hash to identify a transfer.
				</p>
				<h2>Check the current order every time.</h2>
				<p>
					Verify the asset, network, amount and destination before sending. Do not reuse previous
					payment details unless the current order specifically instructs you to.
				</p>
				<ResourceLink href="/contact">Get help from the team</ResourceLink>
				<h2>Questions about the process.</h2>
				<MarketingFaq
					items={[
						{ q: "Does Clusteer hold a wallet balance for me?", a: publicProduct.custody },
						{ q: "When will my conversion arrive?", a: publicProduct.timing },
						{
							q: "How do I check for a service issue?",
							a: "Visit Service status for the available service checks. If your order needs attention, contact support with its reference.",
						},
					]}
				/>
				<ResourceLink href="/status">Check service status</ResourceLink>
			</section>
			<MarketingClose />
		</main>
	);
}
