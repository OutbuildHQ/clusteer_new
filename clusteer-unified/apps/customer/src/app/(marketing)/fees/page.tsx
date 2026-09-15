import { PageIntro, MarketingClose, ResourceLink } from "@/components/brand/marketing-sections";
import { QuoteSummary } from "@/components/brand/quote-summary";
export const metadata = {
	title: "Fees & rates — Clusteer",
	description:
		"Understand the exchange rate, service fee and final amount in a Clusteer conversion quote.",
};
export default function FeesPage() {
	return (
		<main>
			<PageIntro
				eyebrow="Fees & rates"
				title="See what goes in. Know what comes out."
				description="A rate is only part of the picture. Review the charges and final amount together before continuing with a conversion."
			/>
			<section className="cl-fund-grid cl-container cl-fees-content">
				<div className="cl-detail-list">
					<article>
						<h3>The exchange rate</h3>
						<p>
							The quoted rate determines how your selected stablecoin amount converts to naira.
							Rates can change; use the current order quote, before you send.
						</p>
					</article>
					<article>
						<h3>The charges</h3>
						<p>
							Review the service fee shown for the order. Network charges may also apply when moving
							stablecoins. Check the instructions before sending.
						</p>
					</article>
					<article>
						<h3>The final amount</h3>
						<p>
							For a sell, check the naira amount to receive. For a buy, check both the total naira
							cost and the stablecoin amount for your wallet.
						</p>
						<ResourceLink href="/demo">Explore a quote</ResourceLink>
					</article>
				</div>
				<div className="cl-fee-example">
					<QuoteSummary amount={100} rate={1450} fee={1087.5} />
				</div>
			</section>
			<MarketingClose />
		</main>
	);
}
