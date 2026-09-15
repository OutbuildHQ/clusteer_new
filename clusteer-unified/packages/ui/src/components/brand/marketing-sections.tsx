import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { WaitlistForm } from "./waitlist-form";
export function MarketingFaq({ items }: { items: readonly { q: string; a: string }[] }) {
	return (
		<div className="cl-answers">
			{items.map((item) => (
				<details key={item.q}>
					<summary>
						{item.q}
						<Plus size={18} />
					</summary>
					<div>
						<p>{item.a}</p>
					</div>
				</details>
			))}
		</div>
	);
}
export function MarketingClose({
	side,
	home = false,
}: { side?: "buy" | "sell"; home?: boolean } = {}) {
	return (
		<section id={home ? "early-access" : undefined} className="cl-market-close cl-container">
			<div>
				<span>Early access</span>
				<h2>Get the launch email.</h2>
				<p>
					{home
						? "Join the waitlist for the public launch. We’ll email you when access opens; joining doesn’t create a trading account."
						: "We’ll let you know when Clusteer opens for public access."}
				</p>
				<Link className="cl-text-link" href={side ? `/demo?side=${side}` : "/demo"}>
					Open the conversion walkthrough <ArrowUpRight size={16} />
				</Link>
			</div>
			<WaitlistForm />
		</section>
	);
}
export function PageIntro({
	eyebrow,
	title,
	description,
}: {
	eyebrow: string;
	title: string;
	description: string;
}) {
	return (
		<header className="cl-page-intro cl-container">
			<span>{eyebrow}</span>
			<h1>{title}</h1>
			<p>{description}</p>
		</header>
	);
}
export function ResourceLink({ href, children }: { href: string; children: React.ReactNode }) {
	return (
		<Link href={href} className="cl-text-link">
			{children}
			<ArrowUpRight size={16} />
		</Link>
	);
}
