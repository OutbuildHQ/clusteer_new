import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { QuoteSummary } from "./quote-summary";
import { MarketingClose, MarketingFaq } from "./marketing-sections";
import { publicProduct } from "@/lib/marketing-content";
export function ProductPage({ side }: { side: "buy" | "sell" }) {
	const sell = side === "sell";
	const steps = sell
		? [
				[
					"Review the quote",
					"Choose your bank destination and review the rate, fee and naira amount before continuing.",
				],
				[
					"Follow the transfer instructions",
					"Use the asset, network, amount and destination provided for this specific order.",
				],
				[
					"Track the bank payout",
					"Follow the transfer and payout status. Keep the order reference if you need support.",
				],
			]
		: [
				[
					"Choose your destination",
					"Select an available asset and network, then enter an external wallet address you control.",
				],
				[
					"Review and pay",
					"Check the quote and total naira cost, then follow the payment instructions on your order.",
				],
				[
					"Follow the delivery",
					"Track payment confirmation and stablecoin delivery to your chosen wallet.",
				],
			];
	return (
		<main>
			<section className="cl-product-hero cl-container">
				<div>
					<span>{sell ? "Sell stablecoins" : "Buy stablecoins"}</span>
					<h1>
						{sell ? (
							<>
								Your stablecoins.
								<br />
								Closer to home.
							</>
						) : (
							<>
								Your naira.
								<br />
								Ready to go further.
							</>
						)}
					</h1>
					<p>
						{sell
							? "Move from stablecoins to naira in your Nigerian bank account. Review the quote and follow the payout, all in one order."
							: "Move from naira to stablecoins in your own wallet. Review the cost and destination before taking the next step."}
					</p>
					<Link href="/early-access" className="cl-button cl-button-dark">
						Join the waitlist <ArrowRight size={16} />
					</Link>
					<p className="cl-product-access">
						Preparing for public launch. Invited customers can sign in.
					</p>
				</div>
				<div className="cl-product-art">
					<Image
						src="/images/clusteer-estuary.png"
						alt=""
						fill
						sizes="(max-width: 640px) 100vw, 50vw"
					/>
					<div className="cl-product-quote">
						<QuoteSummary
							amount={100}
							rate={1450}
							fee={1087.5}
							side={side}
							destination={sell ? "GTBank ••3421" : "Ethereum wallet ••12F3"}
						/>
					</div>
				</div>
			</section>
			<section className="cl-steps-section cl-container">
				<h2>{sell ? "From quote to bank payout." : "From quote to your wallet."}</h2>
				<div className="cl-steps-grid">
					{steps.map(([title, description], i) => (
						<article key={title}>
							<span>Step {i + 1}</span>
							<h3>{title}</h3>
							<p>{description}</p>
						</article>
					))}
				</div>
				<Link className="cl-text-link" href={`/demo?side=${side}`}>
					Explore a conversion <ArrowRight size={16} />
				</Link>
			</section>
			<section className="cl-home-faq cl-container">
				<div>
					<span>Before you start</span>
					<h2>
						The details
						<br />
						that matter.
					</h2>
					<Link href="/help" className="cl-text-link">
						Visit the help centre <ArrowRight size={16} />
					</Link>
				</div>
				<MarketingFaq
					items={[
						{ q: "What does a conversion cost?", a: publicProduct.fees },
						{ q: "Which networks can I use?", a: publicProduct.networks },
						{ q: "How long will it take?", a: publicProduct.timing },
						{ q: "Can I store a balance in Clusteer?", a: publicProduct.custody },
					]}
				/>
			</section>
			<MarketingClose side={side} />
		</main>
	);
}
