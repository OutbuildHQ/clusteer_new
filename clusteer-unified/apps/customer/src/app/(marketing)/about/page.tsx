import Image from "next/image";
import { PageIntro, MarketingClose, ResourceLink } from "@/components/brand/marketing-sections";
export const metadata = {
	title: "About Clusteer",
	description:
		"Clusteer connects stablecoins and Nigerian naira, with external wallet and bank destinations.",
};
export default function AboutPage() {
	return (
		<main>
			<PageIntro
				eyebrow="About Clusteer"
				title="Money has places to be."
				description="A payment in stablecoins. A plan that needs naira. Clusteer is being built for the journey between the two."
			/>
			<div className="cl-about-image cl-container">
				<Image
					src="/images/clusteer-estuary.png"
					alt="An estuary opening toward the horizon"
					fill
					sizes="100vw"
				/>
			</div>
			<section className="cl-prose-section cl-container">
				<h2>Start with the destination.</h2>
				<p>
					Buy stablecoins to your own wallet, or sell to your Nigerian bank account. The quote,
					transfer instructions and order progress belong in one place.
				</p>
				<h2>A conversion service, built for Nigeria.</h2>
				<p>
					Clusteer is a financial technology product of Outbuild Ltd. It connects the stablecoin and
					naira sides of a conversion through settlement partners. It is not a bank or a wallet for
					storing a Clusteer balance.
				</p>
				<ResourceLink href="/security">Understand the fund flow</ResourceLink>
				<h2>Make the details understandable.</h2>
				<p>
					The amount you send, the rate, the charges and the destination all affect a conversion.
					Our approach is to bring those details into view before you continue, and keep the order
					reference close when you need help.
				</p>
				<h2>Built with room to get it right.</h2>
				<p>
					Clusteer is preparing for public launch. Access is currently by invitation. Join the
					waitlist to hear when access opens.
				</p>
				<ResourceLink href="/demo">Explore the product</ResourceLink>
			</section>
			<MarketingClose />
		</main>
	);
}
