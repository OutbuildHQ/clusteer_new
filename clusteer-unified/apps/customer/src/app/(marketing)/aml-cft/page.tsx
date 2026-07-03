import Link from "next/link";
import { LegalTocSpy } from "@/components/app/legal-toc-spy";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "AML/CFT Policy — Clusteer",
	description: "Clusteer’s Anti-Money Laundering and Counter-Financing of Terrorism policy.",
};

export default function AmlCftPolicyPage() {
	return (
		<main>
			<LegalTocSpy />
			<div className="max-w-[1280px] mx-auto my-0 pt-[clamp(48px,7vw,92px)] px-[28px] pb-[100px]">
				<div className="max-w-[880px] mb-[12px]">
					<div className="opacity-100">
						<div className="f-mono text-[12px] font-semibold tracking-[1.5px] uppercase text-[#0f4f26] mb-[16px]">
							Legal · AML/CFT Policy
						</div>
					</div>
					<div className="opacity-100">
						<h1 className="f-display font-extrabold text-[clamp(34px,6vw,60px)] tracking-[-2px] leading-[1.02] m-0">
							AML/CFT Policy
						</h1>
					</div>
					<div className="opacity-100">
						<div className="flex flex-wrap gap-[10px] items-center mt-[22px]">
							<span className="f-mono inline-flex items-center gap-[6px] text-[11.5px] font-semibold py-[5px] px-[11px] rounded-full bg-[#21241d] text-[#9fe870] border-[1.5px] border-[#21241d]">
								<svg
									width="13"
									height="13"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
									<path d="m9 12 2 2 4-4"></path>
								</svg>{" "}
								Last updated · 21 June 2026
							</span>
							<span className="f-mono inline-flex items-center gap-[6px] text-[11.5px] font-semibold py-[5px] px-[11px] rounded-full bg-[#ffffff] text-[#21241d] border-[1.5px] border-[#21241d]">
								<svg
									width="13"
									height="13"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
									<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
								</svg>{" "}
								~9 min read
							</span>
							<span className="f-mono inline-flex items-center gap-[6px] text-[11.5px] font-semibold py-[5px] px-[11px] rounded-full bg-[#effcd0] text-[#0f4f26] border-[1.5px] border-[#21241d]">
								<svg
									width="13"
									height="13"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M20 6L9 17l-5-5"></path>
								</svg>{" "}
								NDPA 2023 · GAID 2025
							</span>
						</div>
					</div>
				</div>
				<div className="opacity-100">
					<div className="bento-card bento-pop bg-[#ffffff] border-[1.5px] border-[#21241d] rounded-[22px] p-[clamp(22px,3vw,34px)] mt-[26px] mx-0 mb-[44px]">
						<p className="lg-p">
							This Policy sets out the commitment of <strong>Outbuild Ltd</strong> (RC 8076384),
							operating the <strong>Clusteer</strong> platform ("<strong>Clusteer</strong>", "
							<strong>we</strong>", "<strong>us</strong>", "<strong>our</strong>"), to preventing
							money laundering, terrorism financing, and other financial crime. It explains, in
							summary, the controls we apply. It does not disclose details that would compromise the
							effectiveness of those controls.
						</p>
					</div>
				</div>
				<div className="legal-grid">
					<aside className="legal-toc">
						<div className="legal-toc-label">On this page</div>
						<nav className="legal-toc-list">
							<a href="#commitment" className="toc-link active">
								<span className="toc-n">01</span>
								<span className="toc-txt">Our Commitment</span>
							</a>
							<a href="#framework" className="toc-link">
								<span className="toc-n">02</span>
								<span className="toc-txt">Legal and Regulatory Framework</span>
							</a>
							<a href="#scope" className="toc-link">
								<span className="toc-n">03</span>
								<span className="toc-txt">Scope</span>
							</a>
							<a href="#risk-based" className="toc-link">
								<span className="toc-n">04</span>
								<span className="toc-txt">Risk-Based Approach</span>
							</a>
							<a href="#cdd" className="toc-link">
								<span className="toc-n">05</span>
								<span className="toc-txt">Customer Due Diligence (CDD)</span>
							</a>
							<a href="#monitoring" className="toc-link">
								<span className="toc-n">06</span>
								<span className="toc-txt">
									Ongoing Monitoring, Transaction Monitoring, and the Travel Rule
								</span>
							</a>
							<a href="#sanctions" className="toc-link">
								<span className="toc-n">07</span>
								<span className="toc-txt">Sanctions and PEP Screening</span>
							</a>
							<a href="#prohibited" className="toc-link">
								<span className="toc-n">08</span>
								<span className="toc-txt">Prohibited Customers and Activities</span>
							</a>
							<a href="#records" className="toc-link">
								<span className="toc-n">09</span>
								<span className="toc-txt">Record-Keeping</span>
							</a>
							<a href="#reporting" className="toc-link">
								<span className="toc-n">10</span>
								<span className="toc-txt">Suspicious and Threshold Transaction Reporting</span>
							</a>
							<a href="#governance" className="toc-link">
								<span className="toc-n">11</span>
								<span className="toc-txt">Governance, Compliance Officer, and Training</span>
							</a>
							<a href="#cooperation" className="toc-link">
								<span className="toc-n">12</span>
								<span className="toc-txt">Cooperation with Authorities</span>
							</a>
							<a href="#data" className="toc-link">
								<span className="toc-n">13</span>
								<span className="toc-txt">Data Protection</span>
							</a>
							<a href="#review" className="toc-link">
								<span className="toc-n">14</span>
								<span className="toc-txt">Review</span>
							</a>
							<a href="#contact" className="toc-link">
								<span className="toc-n">15</span>
								<span className="toc-txt">Contact</span>
							</a>
						</nav>
					</aside>
					<div className="legal-prose">
						<section id="commitment" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">01</span>
								<h2 className="lg-h2 f-display">Our Commitment</h2>
							</div>
							<p className="lg-p">
								Clusteer has zero tolerance for money laundering (ML), terrorism financing (TF), and
								proliferation financing. We are committed to complying with applicable Nigerian law
								and to applying a risk-based approach consistent with international standards set by
								the Financial Action Task Force (FATF).
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="framework" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">02</span>
								<h2 className="lg-h2 f-display">Legal and Regulatory Framework</h2>
							</div>
							<p className="lg-p">This Policy is designed to comply with, among others:</p>
							<ul className="lg-list">
								<li>
									the <strong>Money Laundering (Prevention and Prohibition) Act 2022</strong>;
								</li>
								<li>
									the <strong>Terrorism (Prevention and Prohibition) Act 2022</strong>;
								</li>
								<li>
									regulations and guidance of the{" "}
									<strong>Nigeria Financial Intelligence Unit (NFIU)</strong> and the{" "}
									<strong>Special Control Unit Against Money Laundering (SCUML)</strong>;
								</li>
								<li>
									applicable <strong>Securities and Exchange Commission (SEC)</strong> and{" "}
									<strong>Central Bank of Nigeria (CBN)</strong> requirements; and
								</li>
								<li>
									the <strong>Nigeria Data Protection Act 2023 (NDPA)</strong> in respect of
									personal data processed for AML/CFT purposes.
								</li>
							</ul>
							<p className="lg-p">
								The regulated digital-asset exchange and custody functions are provided through a{" "}
								<strong>licensed third-party exchange and custody partner</strong>, whose own
								AML/CFT obligations apply alongside ours.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="scope" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">03</span>
								<h2 className="lg-h2 f-display">Scope</h2>
							</div>
							<p className="lg-p">
								This Policy applies to all customers, employees, officers, contractors, and partners
								involved in the Clusteer service, and to all transactions processed through the
								Platform.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="risk-based" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">04</span>
								<h2 className="lg-h2 f-display">Risk-Based Approach</h2>
							</div>
							<p className="lg-p">
								We assess and manage ML/TF risk across customers, products, channels, geographies,
								and transactions. Controls are applied in proportion to risk, with enhanced measures
								for higher-risk situations. We maintain a documented enterprise risk assessment that
								is reviewed periodically and when material changes occur.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="cdd" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">05</span>
								<h2 className="lg-h2 f-display">Customer Due Diligence (CDD)</h2>
							</div>
							<p className="lg-p">
								We do not permit anonymous accounts. Before a customer transacts, and on an ongoing
								basis, we carry out customer due diligence, including:
							</p>
							<ul className="lg-list">
								<li>
									verifying identity using reliable, independent sources (including{" "}
									<strong>BVN</strong>, <strong>NIN</strong>, government-issued identity documents,
									and biometric/liveness verification);
								</li>
								<li>
									screening against sanctions lists and politically-exposed-person (PEP) databases;
								</li>
								<li>
									screening wallet addresses and on-chain activity using blockchain-analytics tools
									to assess exposure to illicit sources;
								</li>
								<li>
									understanding the nature and intended purpose of the customer relationship; and
								</li>
								<li>assigning a customer risk rating.</li>
							</ul>
							<p className="lg-p">
								Where we provide services to a legal entity, we also identify the entity and verify
								its <strong>beneficial owners</strong> and the persons authorised to act on its
								behalf.
							</p>
							<div className="lg-callout">
								<strong>Enhanced Due Diligence (EDD)</strong> is applied to higher-risk customers,
								including PEPs, customers from higher-risk jurisdictions, and unusual or
								higher-value activity. This may include obtaining source-of-funds or
								source-of-wealth information and senior-level approval to proceed.
							</div>
							<p className="lg-p">
								Where required CDD cannot be completed, we will not establish or continue the
								relationship and will consider whether a report to the authorities is required.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="monitoring" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">06</span>
								<h2 className="lg-h2 f-display">
									Ongoing Monitoring, Transaction Monitoring, and the Travel Rule
								</h2>
							</div>
							<p className="lg-p">
								We monitor customer activity on a risk-sensitive basis to detect transactions that
								are unusual, inconsistent with a customer’s profile, or potentially linked to
								financial crime. We may request additional information, place holds, or decline
								transactions as a result.
							</p>
							<div className="lg-callout">
								<strong>Travel Rule.</strong> Consistent with FATF Recommendation 16 and applicable
								Nigerian requirements, originator and beneficiary information is obtained, held, and
								transmitted for qualifying virtual-asset transfers at or above the applicable
								threshold. Where our licensed exchange and custody partner executes the transfer,
								this obligation is performed by, or coordinated with, that partner under our agreed
								allocation of responsibilities.
							</div>
							<hr className="lg-divider" />
						</section>
						<section id="sanctions" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">07</span>
								<h2 className="lg-h2 f-display">Sanctions and PEP Screening</h2>
							</div>
							<p className="lg-p">
								We screen customers and, where relevant, counterparties and wallet addresses against
								applicable sanctions and watchlists, including those maintained by the{" "}
								<strong>Nigeria Sanctions Committee (NSC)</strong>, the United Nations, and —
								because US-dollar stablecoins carry US-sanctions exposure — the US Office of Foreign
								Assets Control (OFAC), among other applicable regimes. We do not provide services to
								sanctioned persons or entities, and we will freeze and report assets where required
								by law.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="prohibited" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">08</span>
								<h2 className="lg-h2 f-display">Prohibited Customers and Activities</h2>
							</div>
							<p className="lg-p">
								We do not knowingly provide services to, among others: persons who refuse or fail
								CDD; sanctioned persons; persons using false or third-party identities; shell
								entities without a verifiable beneficial owner; and persons using the Service for
								unlawful purposes. We prohibit the use of the Service to launder proceeds of crime
								or finance terrorism.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="records" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">09</span>
								<h2 className="lg-h2 f-display">Record-Keeping</h2>
							</div>
							<p className="lg-p">
								We retain customer identification, verification, and transaction records for at
								least <strong>five (5) years</strong> from the end of the business relationship or
								the completion of the relevant transaction (whichever is later), or longer where the
								law requires. Records are stored securely and made available to regulators and
								authorities on lawful request.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="reporting" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">10</span>
								<h2 className="lg-h2 f-display">Suspicious and Threshold Transaction Reporting</h2>
							</div>
							<p className="lg-p">
								Where we know or suspect that funds or activity are linked to ML, TF, or other
								financial crime, a <strong>Suspicious Transaction Report (STR)</strong> is filed
								with the NFIU, and <strong>Currency/Threshold Transaction Reports</strong> are made
								where required, within the timeframes set by law. Where our licensed partner is the
								reporting entity of record for the regulated activity, the filing obligation is
								allocated between us and the partner by written agreement so that a report is always
								made by the responsible party; we do not rely on an assumption that the other party
								will report. We comply with <strong>no-tipping-off</strong> rules: we will not
								disclose to a customer that a report has been or may be made.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="governance" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">11</span>
								<h2 className="lg-h2 f-display">Governance, Compliance Officer, and Training</h2>
							</div>
							<ul className="lg-list">
								<li>
									<strong>Accountability.</strong> Senior management is responsible for AML/CFT
									compliance and for fostering a culture of compliance.
								</li>
								<li>
									<strong>Compliance Officer / MLRO.</strong> We designate a Compliance Officer
									(Money Laundering Reporting Officer) responsible for this Policy, for filing
									reports with the NFIU, and for liaising with regulators — their details are below.
								</li>
								<li>
									<strong>Training.</strong> Relevant personnel receive AML/CFT training appropriate
									to their role, refreshed periodically.
								</li>
								<li>
									<strong>Independent review.</strong> Our controls are subject to periodic
									independent testing and review.
								</li>
							</ul>
							<div className="lg-callout">
								<strong>Compliance Officer / MLRO.</strong> Ajiboye Olawale Kazeem.
								<div className="mt-[10px] flex flex-col gap-[6px]">
									<div>
										<strong>Telephone:</strong>{" "}
										<a href="tel:+2349055352271" className="underline">
											+234 905 535 2271
										</a>
									</div>
									<div>
										<strong>Email:</strong>{" "}
										<a href="mailto:compliance@clusteer.com" className="underline">
											compliance@clusteer.com
										</a>
									</div>
									<div>
										<strong>Address:</strong> 14, Shosanya Street, Egbeda, Lagos.
									</div>
								</div>
							</div>
							<hr className="lg-divider" />
						</section>
						<section id="cooperation" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">12</span>
								<h2 className="lg-h2 f-display">Cooperation with Authorities</h2>
							</div>
							<p className="lg-p">
								We cooperate fully with the NFIU, SCUML, EFCC, SEC, CBN, the NSC, and law
								enforcement, including by responding to lawful requests, freezing assets, and
								providing records, in line with applicable law and our Privacy Policy.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="data" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">13</span>
								<h2 className="lg-h2 f-display">Data Protection</h2>
							</div>
							<p className="lg-p">
								Personal data processed for AML/CFT purposes is handled in accordance with the NDPA
								and our Privacy Policy. AML/CFT obligations are a legal basis for processing and,
								where applicable, override certain data-subject requests (such as erasure) for the
								period we are required to retain records.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="review" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">14</span>
								<h2 className="lg-h2 f-display">Review</h2>
							</div>
							<p className="lg-p">
								We review and update this Policy periodically and in response to changes in law,
								regulation, or our risk profile.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="contact" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">15</span>
								<h2 className="lg-h2 f-display">Contact</h2>
							</div>
							<div className="lg-kv">
								<div className="lg-kv-row">
									<span className="lg-kv-k">Outbuild Ltd (Clusteer)</span>
									<span className="lg-kv-v">
										<a href="mailto:compliance@clusteer.com" className="underline">
											compliance@clusteer.com
										</a>
									</span>
								</div>
							</div>
							<p className="lg-p">
								Clusteer is a product operated by Outbuild Ltd (RC 8076384). This is a summary
								AML/CFT policy statement and does not reproduce our internal compliance program.
							</p>
							<hr className="lg-divider" />
						</section>
					</div>
				</div>
				<div className="mt-[24px]">
					<div className="bento-card bento-pop opacity-100 bg-[#9fe870] border-[1.5px] border-[#21241d] rounded-[28px] p-[clamp(32px,5vw,64px)] text-center max-w-[1100px] mx-auto my-0">
						<h2 className="f-display text-[clamp(28px,4vw,46px)] font-extrabold tracking-[-1.5px] leading-[1.05] m-0 max-w-[720px] mx-auto">Ready to get started?</h2>
						<div className="flex gap-[12px] justify-center flex-wrap mt-[28px]">
							<Link
								href="/early-access"
								className="btn-shine lift inline-flex items-center gap-[8px] font-semibold text-[16px] text-[#9fe870] py-[15px] px-[28px] rounded-full bg-[#21241d] border-[1.5px] border-[#21241d]"
							>
								Join the waitlist{" "}
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M5 12h14M13 6l6 6-6 6"></path>
								</svg>
							</Link>
							<Link
								href="/#how"
								className="lift font-semibold text-[16px] text-[#21241d] py-[15px] px-[26px] rounded-full bg-transparent border-[1.5px] border-[#21241d]"
							>
								See how it works
							</Link>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
