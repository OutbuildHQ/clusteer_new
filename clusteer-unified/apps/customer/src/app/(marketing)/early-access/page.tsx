import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { WaitlistForm } from "@/components/brand/waitlist-form";
export default function EarlyAccessPage() {
	return (
		<main className="cl-early-access">
			<section className="cl-early-copy">
				<span className="cl-kicker">Public launch · Join the waitlist</span>
				<h1>
					Your wallet. Your bank.
					<br />
					Your next move.
				</h1>
				<p>
					Get an email when public access opens. Explore how Clusteer connects stablecoins in your
					wallet and naira in your Nigerian bank account.
				</p>
				<WaitlistForm />
				<div className="cl-early-note">
					<span>Already have an invitation?</span>
					<Link href="/login" className="cl-text-link">
						Sign in to Clusteer <ArrowUpRight size={16} />
					</Link>
				</div>
			</section>
			<div className="cl-early-image">
				<Image
					src="/images/clusteer-estuary.png"
					alt="A quiet waterway opening toward the horizon"
					fill
					sizes="(max-width: 760px) 100vw, 45vw"
					priority
				/>
				<div>
					<span>Global money.</span>
					<strong>Closer to home.</strong>
				</div>
			</div>
		</main>
	);
}
