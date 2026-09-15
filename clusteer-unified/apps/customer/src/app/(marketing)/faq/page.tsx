import { HelpCenter } from "@/components/brand/help-center";
export const metadata = {
	title: "Frequently asked questions — Clusteer",
	description:
		"Answers about Clusteer access, conversion quotes, external wallets and order support.",
};
export default function Page() {
	return <HelpCenter faq={true} />;
}
