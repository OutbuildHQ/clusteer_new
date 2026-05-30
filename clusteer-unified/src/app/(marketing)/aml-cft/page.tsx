import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AmlCftPolicyPage() {
	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
			<header className="mb-8 sm:mb-12">
				<Link href="/">
					<Button
						variant="ghost"
						className="mb-6 px-4 py-2 flex items-center gap-2 hover:gap-3 hover:px-3 transition-all min-h-[44px]"
					>
						<ArrowLeft className="size-5" />
						Back to Home
					</Button>
				</Link>
				<div className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-custom-black/70 mb-3">
					&#9670; LEGAL
				</div>
				<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
					Anti-Money Laundering &amp; Counter Financing of Terrorism Policy
				</h1>
				<p className="text-muted-foreground">Last Updated: May 2026</p>
			</header>

			<div className="space-y-8 text-foreground">
				<section>
					<h2 className="text-xl sm:text-2xl font-semibold mb-4">1. Our Commitment</h2>
					<p className="mb-4">
						Clusteer is committed to the highest standards of Anti-Money Laundering (AML) and Counter Financing of Terrorism (CFT) compliance. We take our legal and regulatory obligations seriously and have implemented robust policies and procedures to prevent our platform from being used for money laundering, terrorist financing, or any other financial crime.
					</p>
					<p className="mb-4">
						This policy applies to all Clusteer employees, officers, directors, contractors, and agents, as well as all users of the Clusteer platform. We comply with applicable Nigerian laws and regulations, including the Money Laundering (Prohibition) Act, the Terrorism (Prevention) Act, and all directives issued by the Central Bank of Nigeria (CBN) and the Nigerian Financial Intelligence Unit (NFIU).
					</p>
				</section>

				<section>
					<h2 className="text-xl sm:text-2xl font-semibold mb-4">2. Customer Due Diligence</h2>
					<p className="mb-4">
						We perform thorough Customer Due Diligence (CDD) on all users before they can access our trading services. Our verification process includes:
					</p>
					<h3 className="text-lg sm:text-xl font-semibold mb-3 mt-6">2.1 Bank Verification Number (BVN)</h3>
					<p className="mb-4">
						All Nigerian users must provide a valid BVN for identity verification. We cross-reference BVN data with the Nigeria Inter-Bank Settlement System (NIBSS) to confirm user identity.
					</p>
					<h3 className="text-lg sm:text-xl font-semibold mb-3 mt-6">2.2 Identity Verification</h3>
					<ul className="list-disc pl-6 space-y-2 mb-4">
						<li><strong>Tier 1:</strong> BVN verification and basic personal information (name, date of birth, phone number)</li>
						<li><strong>Tier 2:</strong> Government-issued photo ID (NIN slip, international passport, driver&apos;s licence, or voter&apos;s card) and facial recognition verification</li>
						<li><strong>Tier 3:</strong> Proof of address, source of funds documentation, and enhanced due diligence for high-volume traders</li>
					</ul>
					<h3 className="text-lg sm:text-xl font-semibold mb-3 mt-6">2.3 Ongoing Monitoring</h3>
					<p className="mb-4">
						We continuously monitor user accounts and transactions to detect unusual or suspicious activity. Our monitoring includes reviewing transaction patterns, account behaviour, and changes in user risk profiles over time.
					</p>
				</section>

				<section>
					<h2 className="text-xl sm:text-2xl font-semibold mb-4">3. Transaction Monitoring</h2>
					<p className="mb-4">
						Clusteer employs automated transaction monitoring systems to detect and flag potentially suspicious activity. Our monitoring covers:
					</p>
					<ul className="list-disc pl-6 space-y-2 mb-4">
						<li>Transactions that exceed defined thresholds</li>
						<li>Unusual patterns of trading activity (rapid buy-sell cycles, structuring)</li>
						<li>Transactions involving high-risk jurisdictions</li>
						<li>Multiple accounts linked to the same identity or device</li>
						<li>Large or frequent transfers inconsistent with a user&apos;s stated profile or income</li>
						<li>Transactions involving known sanctioned individuals or entities</li>
					</ul>
					<p className="mb-4">
						Flagged transactions are reviewed by our compliance team and may result in account restrictions, enhanced due diligence, or a report to the relevant authorities.
					</p>
				</section>

				<section>
					<h2 className="text-xl sm:text-2xl font-semibold mb-4">4. Reporting Obligations</h2>
					<p className="mb-4">
						We are committed to fulfilling all reporting obligations under Nigerian law. This includes:
					</p>
					<ul className="list-disc pl-6 space-y-2 mb-4">
						<li><strong>Suspicious Transaction Reports (STRs):</strong> Filed with the Nigerian Financial Intelligence Unit (NFIU) when we identify transactions or activities that appear suspicious or potentially linked to money laundering or terrorist financing</li>
						<li><strong>Currency Transaction Reports (CTRs):</strong> Filed for transactions that exceed the regulatory reporting threshold</li>
						<li><strong>Terrorism Financing Reports:</strong> Immediate reports filed when we suspect any connection to terrorist financing activities</li>
					</ul>
					<p className="mb-4">
						It is strictly prohibited for any Clusteer employee or agent to tip off a user about a pending or filed suspicious activity report.
					</p>
				</section>

				<section>
					<h2 className="text-xl sm:text-2xl font-semibold mb-4">5. Record Keeping</h2>
					<p className="mb-4">
						Clusteer maintains comprehensive records in accordance with regulatory requirements:
					</p>
					<ul className="list-disc pl-6 space-y-2 mb-4">
						<li>All customer identification and verification documents are retained for a minimum of five years after the business relationship ends</li>
						<li>Transaction records, including amounts, dates, parties involved, and the nature of the transaction, are retained for a minimum of five years after the transaction date</li>
						<li>All internal reports, analyses, and correspondence related to suspicious activity are retained for a minimum of five years</li>
						<li>Records are stored securely with appropriate access controls and encryption</li>
					</ul>
				</section>

				<section>
					<h2 className="text-xl sm:text-2xl font-semibold mb-4">6. Sanctions Screening</h2>
					<p className="mb-4">
						We screen all users and transactions against applicable sanctions lists, including:
					</p>
					<ul className="list-disc pl-6 space-y-2 mb-4">
						<li>United Nations Security Council Consolidated List</li>
						<li>OFAC Specially Designated Nationals (SDN) List</li>
						<li>EU Consolidated Financial Sanctions List</li>
						<li>Nigerian sanctions and watchlists</li>
					</ul>
					<p className="mb-4">
						Users or transactions that match a sanctioned party are immediately blocked and reported to the relevant authorities.
					</p>
				</section>

				<section>
					<h2 className="text-xl sm:text-2xl font-semibold mb-4">7. Staff Training</h2>
					<p className="mb-4">
						All Clusteer employees receive regular training on AML/CFT compliance, including:
					</p>
					<ul className="list-disc pl-6 space-y-2 mb-4">
						<li>Recognising the indicators of money laundering and terrorist financing</li>
						<li>Understanding their legal obligations and reporting responsibilities</li>
						<li>Proper procedures for customer due diligence and transaction monitoring</li>
						<li>Updates on new regulatory requirements, typologies, and emerging risks</li>
						<li>Role-specific training for compliance, customer support, and operations staff</li>
					</ul>
					<p className="mb-4">
						Training is conducted at onboarding and refreshed at least annually. Records of all training sessions and participant attendance are maintained.
					</p>
				</section>

				<section>
					<h2 className="text-xl sm:text-2xl font-semibold mb-4">8. Risk Assessment</h2>
					<p className="mb-4">
						Clusteer conducts periodic risk assessments to identify, evaluate, and mitigate money laundering and terrorist financing risks. Our risk assessment considers:
					</p>
					<ul className="list-disc pl-6 space-y-2 mb-4">
						<li>Customer risk (user profiles, transaction volumes, geographies)</li>
						<li>Product and service risk (stablecoin types, blockchain networks, transaction speeds)</li>
						<li>Geographic risk (jurisdictions, cross-border transactions)</li>
						<li>Delivery channel risk (web, mobile, API)</li>
					</ul>
				</section>

				<section>
					<h2 className="text-xl sm:text-2xl font-semibold mb-4">9. Contact Information</h2>
					<p className="mb-4">
						For questions about this AML/CFT Policy or to report suspicious activity, please contact us at:
					</p>
					<ul className="list-none space-y-2 mb-4">
						<li><strong>Compliance:</strong> <a href="mailto:compliance@clusteer.com" className="text-custom-black/70 underline">compliance@clusteer.com</a></li>
						<li><strong>Legal:</strong> <a href="mailto:legal@clusteer.com" className="text-custom-black/70 underline">legal@clusteer.com</a></li>
						<li><strong>Support:</strong> <a href="mailto:support@clusteer.com" className="text-custom-black/70 underline">support@clusteer.com</a></li>
					</ul>
				</section>

				<section className="border-t border-border pt-8 mt-8">
					<p className="text-sm text-muted-foreground">
						By using Clusteer, you acknowledge that you have read and understood this Anti-Money Laundering &amp; Counter Financing of Terrorism Policy and agree to comply with its requirements.
					</p>
				</section>
			</div>
		</div>
	);
}
