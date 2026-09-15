import { ArrowUpRight } from "lucide-react";
import { PageIntro, MarketingClose } from "@/components/brand/marketing-sections";
export const metadata = {
	title: "Contact — Clusteer",
	description: "Contact Clusteer for support, general enquiries, partnerships or press.",
};
export default function ContactPage() {
	return (
		<main>
			<PageIntro
				eyebrow="Contact"
				title="A conversation starts here."
				description="A question about an order, an idea for a partnership, or something you would like to know. Here is where to reach us."
			/>
			<section className="cl-contact-list cl-container">
				{[
					{
						title: "Customer support",
						copy: "For account access, conversions and payout questions.",
						email: "support@clusteer.com",
					},
					{
						title: "General enquiries",
						copy: "For partnerships and other questions about Clusteer.",
						email: "hello@clusteer.com",
					},
					{
						title: "Press",
						copy: "For company information and media enquiries.",
						email: "press@clusteer.com",
					},
				].map((item) => (
					<a href={`mailto:${item.email}`} key={item.email}>
						<div>
							<h2>{item.title}</h2>
							<p>{item.copy}</p>
						</div>
						<span>{item.email}</span>
						<ArrowUpRight size={22} />
					</a>
				))}
			</section>
			<section className="cl-prose-section cl-container">
				<h2>Asking about an order?</h2>
				<p>
					Include the order reference and a short description of what happened. For an on-chain
					transfer, include the transaction hash. Never send passwords, one-time codes or wallet
					recovery phrases.
				</p>
			</section>
			<MarketingClose />
		</main>
	);
}
