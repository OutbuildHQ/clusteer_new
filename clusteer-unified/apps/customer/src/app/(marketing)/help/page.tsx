import { HelpCenter } from "@/components/brand/help-center";
export const metadata = {
	title: "Help centre — Clusteer",
	description:
		"Answers about Clusteer access, conversion quotes, external wallets and order support.",
};
export default function Page() {
	return <HelpCenter faq={false} />;
}
