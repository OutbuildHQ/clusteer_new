import { ProductWalkthrough } from "@/components/brand/product-walkthrough";
import { PageIntro, MarketingClose } from "@/components/brand/marketing-sections";
export const metadata = {
	title: "Explore the Clusteer experience",
	description: "Explore buying and selling, from the first quote through transfer and receipt.",
};
export default async function DemoPage({
	searchParams,
}: {
	searchParams: Promise<{ side?: string }>;
}) {
	const { side } = await searchParams;
	return (
		<main>
			<PageIntro
				eyebrow="The Clusteer experience"
				title="Take a closer look."
				description="Choose Buy or Sell, enter an amount, and follow the conversion from quote to receipt."
			/>
			<section className="cl-container cl-demo-page">
				<ProductWalkthrough initialSide={side === "buy" ? "buy" : "sell"} />
			</section>
			<MarketingClose />
		</main>
	);
}
