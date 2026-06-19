import Link from "next/link";
import { LegalTocSpy } from "@/components/app/legal-toc-spy";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Privacy Policy — Clusteer",
	description:
		"How Clusteer collects, uses and protects your personal data, and your rights under the NDPR.",
};

export default function PrivacyPolicyPage() {
	return (
		<main>
			<LegalTocSpy />
			<div className="max-w-[1280px] mx-auto my-0 pt-[clamp(48px,7vw,92px)] px-[28px] pb-[100px]">
				<div className="max-w-[880px] mb-[12px]">
					<div className="opacity-100">
						<div className="f-mono text-[12px] font-semibold tracking-[1.5px] uppercase text-[#0f4f26] mb-[16px]">
							Legal · Privacy
						</div>
					</div>
					<div className="opacity-100">
						<h1 className="f-display font-extrabold text-[clamp(34px,6vw,60px)] tracking-[-2px] leading-[1.02] m-0">
							Privacy Policy
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
								Last updated · 19 June 2026
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
								~11 min read
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
							Clusteer ("Clusteer", "we", "us", "our") is a stablecoin-to-Naira transaction platform
							operated by <strong>Outbuild Ltd</strong> (RC 8076384), a company registered in
							Nigeria. Crypto-asset exchange, custody, and related functions are provided through a{" "}
							<strong>licensed third-party exchange and custody partner</strong>; Clusteer provides
							the user-facing platform and Naira settlement experience.
						</p>
						<p className="lg-p">
							This Policy explains how we collect, use, share, and protect your personal data when
							you use Clusteer, and your rights under the{" "}
							<strong>Nigeria Data Protection Act 2023 (NDPA)</strong>, the NDPC's{" "}
							<strong>General Application and Implementation Directive 2025 (GAID)</strong>, and
							related laws.
						</p>
						<p className="lg-p">
							By using Clusteer, you acknowledge that you have read and understood this Policy.
							Please read it alongside our Terms of Service and our Cookie Policy.
						</p>
					</div>
				</div>
				<div className="legal-grid">
					<aside className="legal-toc">
						<div className="legal-toc-label">On this page</div>
						<nav className="legal-toc-list">
							<a href="#controller" className="toc-link active">
								<span className="toc-n">01</span>
								<span className="toc-txt">Who We Are (Data Controller)</span>
							</a>
							<a href="#data-we-collect" className="toc-link">
								<span className="toc-n">02</span>
								<span className="toc-txt">The Personal Data We Collect</span>
							</a>
							<a href="#how-we-collect" className="toc-link">
								<span className="toc-n">03</span>
								<span className="toc-txt">How We Collect Your Data</span>
							</a>
							<a href="#why-we-use" className="toc-link">
								<span className="toc-n">04</span>
								<span className="toc-txt">Why We Use Your Data, and Our Lawful Basis</span>
							</a>
							<a href="#sensitive-data" className="toc-link">
								<span className="toc-n">05</span>
								<span className="toc-txt">Sensitive Personal Data (Including Biometrics)</span>
							</a>
							<a href="#who-we-share" className="toc-link">
								<span className="toc-n">06</span>
								<span className="toc-txt">Who We Share Your Data With</span>
							</a>
							<a href="#international" className="toc-link">
								<span className="toc-n">07</span>
								<span className="toc-txt">International Transfers</span>
							</a>
							<a href="#retention" className="toc-link">
								<span className="toc-n">08</span>
								<span className="toc-txt">How Long We Keep Your Data</span>
							</a>
							<a href="#security" className="toc-link">
								<span className="toc-n">09</span>
								<span className="toc-txt">How We Protect Your Data</span>
							</a>
							<a href="#your-rights" className="toc-link">
								<span className="toc-n">10</span>
								<span className="toc-txt">Your Rights Under the NDPA</span>
							</a>
							<a href="#cookies" className="toc-link">
								<span className="toc-n">11</span>
								<span className="toc-txt">Cookies</span>
							</a>
							<a href="#children" className="toc-link">
								<span className="toc-n">12</span>
								<span className="toc-txt">Children</span>
							</a>
							<a href="#changes" className="toc-link">
								<span className="toc-n">13</span>
								<span className="toc-txt">Changes to This Policy</span>
							</a>
							<a href="#contact" className="toc-link">
								<span className="toc-n">14</span>
								<span className="toc-txt">Contact Us</span>
							</a>
						</nav>
					</aside>
					<div className="legal-prose">
						<section id="controller" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">01</span>
								<h2 className="lg-h2 f-display">Who We Are (Data Controller)</h2>
							</div>
							<p className="lg-p">
								The data controller responsible for the personal data you provide to Clusteer is{" "}
								<strong>Outbuild Ltd</strong>, operating the Clusteer platform.
							</p>
							<p className="lg-p">
								Certain processing necessary for the crypto-exchange leg of your transactions —
								including digital-asset custody, exchange execution, settlement, and elements of
								identity verification — is carried out by our{" "}
								<strong>licensed exchange and custody partner</strong>, which acts as a separate or
								joint data controller, or our data processor, for that processing under appropriate
								data-protection terms.
							</p>
							<div className="lg-kv">
								<div className="lg-kv-row">
									<span className="lg-kv-k">Contact</span>
									<span className="lg-kv-v">
										<span className="legal-ph" title="To be completed before launch">
											legal@clusteer.com
										</span>
									</span>
								</div>
								<div className="lg-kv-row">
									<span className="lg-kv-k">Supervisory authority</span>
									<span className="lg-kv-v">Nigeria Data Protection Commission (NDPC)</span>
								</div>
							</div>
							<p className="lg-p">
								As a processor of identity, biometric, and financial data, Outbuild Ltd is a{" "}
								<strong>data controller of major importance</strong> under the NDPA/GAID and is{" "}
								<span className="legal-ph" title="To be completed before launch">
									registered / in the process of registering
								</span>{" "}
								with the NDPC.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="data-we-collect" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">02</span>
								<h2 className="lg-h2 f-display">The Personal Data We Collect</h2>
							</div>
							<p className="lg-p">
								To provide a regulated financial service, we (and, for verification and the crypto
								leg, our exchange and custody partner) collect:
							</p>
							<p className="lg-p">
								<strong>Identity data</strong> — full name, date of birth, gender, nationality,
								residential address; government identification numbers (such as <strong>BVN</strong>{" "}
								and <strong>NIN</strong>) and identity documents (e.g. passport, driver's licence,
								voter's card, national ID).
							</p>
							<p className="lg-p">
								<strong>Biometric data</strong> — a facial image and "liveness" data captured during
								identity verification.
							</p>
							<div className="lg-callout">
								<strong>Biometric data is sensitive personal data</strong> and is treated with
								additional safeguards (see Section 5).
							</div>
							<p className="lg-p">
								<strong>Contact data</strong> — email address, phone number.
							</p>
							<p className="lg-p">
								<strong>Financial and transaction data</strong> — your Nigerian bank account
								details; records of your buy/sell transactions; amounts; stablecoin wallet addresses
								you send to or receive from; and related transaction details.
							</p>
							<p className="lg-p">
								<strong>Verification and compliance data</strong> — the results of identity,
								sanctions, politically-exposed-person (PEP), and screening checks; your risk rating;
								and, where applicable, source-of-funds information.
							</p>
							<p className="lg-p">
								<strong>Technical and usage data</strong> — device information, IP address, log
								data, and information collected via cookies and similar technologies (see our Cookie
								Policy).
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="how-we-collect" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">03</span>
								<h2 className="lg-h2 f-display">How We Collect Your Data</h2>
							</div>
							<ul className="lg-list">
								<li>
									<strong>Directly from you</strong> — when you register, complete verification, or
									transact.
								</li>
								<li>
									<strong>Automatically</strong> — through your use of the platform (technical/usage
									data, cookies).
								</li>
								<li>
									<strong>From third parties</strong> — our exchange and custody partner and
									licensed identity-verification providers and authoritative databases used to
									verify your identity; blockchain networks (publicly visible wallet and transaction
									data); and our banking, payment, custodial, and liquidity partners.
								</li>
							</ul>
							<hr className="lg-divider" />
						</section>
						<section id="why-we-use" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">04</span>
								<h2 className="lg-h2 f-display">Why We Use Your Data, and Our Lawful Basis</h2>
							</div>
							<p className="lg-p">
								We process your personal data on the following lawful bases under the NDPA:
							</p>
							<div className="lg-table-wrap">
								<table className="lg-table">
									<thead>
										<tr>
											<th>Purpose</th>
											<th>Lawful basis</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>
												Verifying your identity and meeting Know Your Customer (KYC), Anti-Money
												Laundering (AML), and counter-terrorism-financing obligations
											</td>
											<td>
												<strong>Compliance with a legal obligation</strong>
											</td>
										</tr>
										<tr>
											<td>
												Processing <strong>sensitive personal data</strong> (biometric/liveness
												data) for identity verification and fraud prevention
											</td>
											<td>
												<strong>
													Necessary for compliance with a legal obligation / for the establishment,
													exercise or defence of a legal claim
												</strong>
												, and, where required, your <strong>explicit consent</strong> (see Section
												5)
											</td>
										</tr>
										<tr>
											<td>
												Providing the Clusteer service (processing your buy/sell orders, settlement,
												support)
											</td>
											<td>
												<strong>Performance of a contract</strong> with you
											</td>
										</tr>
										<tr>
											<td>
												Detecting, preventing, and investigating fraud and financial crime;
												transaction monitoring; sanctions and PEP screening
											</td>
											<td>
												<strong>Legal obligation</strong> and <strong>legitimate interests</strong>
											</td>
										</tr>
										<tr>
											<td>Maintaining records required by law</td>
											<td>
												<strong>Legal obligation</strong>
											</td>
										</tr>
										<tr>
											<td>Improving and securing the platform</td>
											<td>
												<strong>Legitimate interests</strong>
											</td>
										</tr>
										<tr>
											<td>Optional communications (e.g. marketing, where offered)</td>
											<td>
												<strong>Consent</strong>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div className="lg-callout">
								<strong>Important:</strong> Identity verification and AML/KYC processing are legal
								requirements for a regulated service. We do <strong>not</strong> rely on your
								consent for this processing, and you cannot opt out of it while using Clusteer.
								Consent is used only for genuinely optional processing (such as marketing) and,
								where the law requires it, for certain sensitive-data processing — you may withdraw
								any such consent at any time.
							</div>
							<hr className="lg-divider" />
						</section>
						<section id="sensitive-data" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">05</span>
								<h2 className="lg-h2 f-display">Sensitive Personal Data (Including Biometrics)</h2>
							</div>
							<p className="lg-p">
								Your facial image and liveness data are <strong>sensitive personal data</strong>{" "}
								under Section 30 of the NDPA. We process them only on a lawful ground permitted for
								sensitive data (identity verification and fraud prevention required by AML law,
								and/or your explicit consent). We:
							</p>
							<ul className="lg-list">
								<li>
									collect them only to verify your identity and prevent impersonation and fraud;
								</li>
								<li>
									protect them with enhanced security measures, including encryption and strict
									access controls;
								</li>
								<li>
									do not use them for any purpose beyond verification and fraud prevention; and
								</li>
								<li>retain them only for as long as the law requires (see Section 8).</li>
							</ul>
							<p className="lg-p">
								Where identity/biometric verification is performed by our exchange and custody
								partner or a licensed verification provider, that party processes this data under
								appropriate data-protection terms.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="who-we-share" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">06</span>
								<h2 className="lg-h2 f-display">Who We Share Your Data With</h2>
							</div>
							<p className="lg-p">We share personal data only where necessary, with:</p>
							<ul className="lg-list">
								<li>
									<strong>Our licensed exchange and custody partner</strong> — which provides
									digital-asset exchange, custody, settlement, and related regulated functions, and
									may perform or coordinate identity verification.
								</li>
								<li>
									<strong>Licensed identity-verification providers</strong> — to verify your
									identity.
								</li>
								<li>
									<strong>Our custodial, liquidity, banking, and payment partners</strong> — to
									settle transactions and pay out to your bank account.
								</li>
								<li>
									<strong>Regulators and authorities</strong> — directly, or through our licensed
									partner where the obligation sits with them — including the{" "}
									<strong>Securities and Exchange Commission (SEC)</strong>, the{" "}
									<strong>Nigeria Financial Intelligence Unit (NFIU)</strong>, the{" "}
									<strong>Special Control Unit Against Money Laundering (SCUML)</strong>, the{" "}
									<strong>Economic and Financial Crimes Commission (EFCC)</strong>, the{" "}
									<strong>Central Bank of Nigeria (CBN)</strong>, the{" "}
									<strong>Nigeria Sanctions Committee (NSC)</strong>, and law enforcement, where
									required by law (for example, suspicious-transaction or threshold-transaction
									reporting). Where the law requires it, we may be prohibited from informing you of
									such disclosures.
								</li>
								<li>
									<strong>Service providers</strong> — technology, hosting, security, and support
									providers acting on our instructions under appropriate data-protection terms.
								</li>
								<li>
									<strong>Successors</strong> — in the event of a merger, acquisition, or
									reorganisation, subject to this Policy.
								</li>
							</ul>
							<div className="lg-callout">
								We do <strong>not</strong> sell your personal data.
							</div>
							<hr className="lg-divider" />
						</section>
						<section id="international" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">07</span>
								<h2 className="lg-h2 f-display">International Transfers</h2>
							</div>
							<p className="lg-p">
								The NDPA prohibits transfers of personal data outside Nigeria by default (Sections
								41–43). Where personal data is transferred or stored outside Nigeria (for example,
								by our exchange and custody partner, a KYC provider, or our hosting/service
								providers), we rely on one of the lawful bases the NDPA permits:
							</p>
							<ul className="lg-list">
								<li>
									transfer to a country/region the NDPC has determined provides an{" "}
									<strong>adequate</strong> level of protection (Section 42); or
								</li>
								<li>
									where no adequacy decision applies, <strong>appropriate safeguards</strong> such
									as <strong>Standard Contractual Clauses (SCCs)</strong> or binding corporate rules
									that give you enforceable rights (Sections 41 and 43); or
								</li>
								<li>
									a specific statutory derogation under Section 43 (e.g. necessity for performance
									of your contract).
								</li>
							</ul>
							<hr className="lg-divider" />
						</section>
						<section id="retention" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">08</span>
								<h2 className="lg-h2 f-display">How Long We Keep Your Data</h2>
							</div>
							<p className="lg-p">
								We keep your personal data for as long as you are a customer and, after your
								relationship with us ends, for at least <strong>five (5) years</strong> from the{" "}
								<strong>
									end of the business relationship or the completion of the relevant transaction
									(whichever is later)
								</strong>
								, as required by Nigeria's Money Laundering (Prevention and Prohibition) Act 2022
								(or longer where a law or authority requires).
							</p>
							<div className="lg-callout">
								Because this retention is a <strong>legal obligation</strong>, it overrides any
								request to delete your data: where you ask us to erase data that we are legally
								required to keep, we will retain it for the required period and explain why.
							</div>
							<hr className="lg-divider" />
						</section>
						<section id="security" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">09</span>
								<h2 className="lg-h2 f-display">How We Protect Your Data</h2>
							</div>
							<p className="lg-p">
								We apply appropriate technical and organisational measures to protect your data,
								including encryption, access controls on a need-to-know basis, access logging,
								secure backups, and staff confidentiality obligations. No system is completely
								secure, but we work to protect your information and to respond promptly to any
								incident.
							</p>
							<div className="lg-callout">
								<strong>Data breaches.</strong> Where a personal data breach occurs, we will notify
								the NDPC and, where the breach is likely to result in a high risk to your rights and
								freedoms, notify you, within the timeframes required by Section 40 of the NDPA (the
								applicable standard being within 72 hours of becoming aware of the breach).
							</div>
							<hr className="lg-divider" />
						</section>
						<section id="your-rights" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">10</span>
								<h2 className="lg-h2 f-display">Your Rights Under the NDPA</h2>
							</div>
							<p className="lg-p">
								Subject to legal limits (including our retention obligations), you have the right
								to:
							</p>
							<ul className="lg-list">
								<li>
									<strong>access</strong> the personal data we hold about you;
								</li>
								<li>
									request <strong>correction</strong> of inaccurate or incomplete data;
								</li>
								<li>
									request <strong>erasure</strong> of your data (except where we must keep it by
									law);
								</li>
								<li>
									<strong>object to</strong> or request <strong>restriction of</strong> certain
									processing;
								</li>
								<li>
									request <strong>portability</strong> of data you provided to us;
								</li>
								<li>
									not be subject to a decision based solely on <strong>automated processing</strong>
									, including profiling, that produces legal or similarly significant effects,
									except as permitted by law (Section 37);
								</li>
								<li>
									<strong>withdraw consent</strong> for any processing based on consent (e.g.
									marketing); and
								</li>
								<li>
									<strong>lodge a complaint</strong> with the{" "}
									<strong>Nigeria Data Protection Commission (NDPC)</strong>.
								</li>
							</ul>
							<p className="lg-p">
								To exercise any right, contact us at{" "}
								<span className="legal-ph" title="To be completed before launch">
									legal@clusteer.com
								</span>
								. We will respond within the timeframe required by law. We may need to verify your
								identity before acting on a request. Where a right relates to data held by our
								exchange and custody partner or a verification provider, we will direct or assist
								your request to the relevant party.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="cookies" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">11</span>
								<h2 className="lg-h2 f-display">Cookies</h2>
							</div>
							<p className="lg-p">
								We use cookies and similar technologies on our website. Please see our{" "}
								<strong>Cookie Policy</strong> for details and your choices.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="children" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">12</span>
								<h2 className="lg-h2 f-display">Children</h2>
							</div>
							<p className="lg-p">
								Clusteer is not intended for, and may not be used by, anyone under{" "}
								<strong>18</strong>. We do not knowingly collect data from minors.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="changes" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">13</span>
								<h2 className="lg-h2 f-display">Changes to This Policy</h2>
							</div>
							<p className="lg-p">
								We may update this Policy from time to time. We will post the updated version with a
								new "Last updated" date and, where appropriate, notify you. Continued use of
								Clusteer after changes take effect constitutes acceptance of the updated Policy.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="contact" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">14</span>
								<h2 className="lg-h2 f-display">Contact Us</h2>
							</div>
							<p className="lg-p">Questions about this Policy or your data:</p>
							<div className="lg-kv">
								<div className="lg-kv-row">
									<span className="lg-kv-k">Outbuild Ltd (Clusteer)</span>
									<span className="lg-kv-v">
										<span className="legal-ph" title="To be completed before launch">
											legal@clusteer.com
										</span>{" "}
										·{" "}
										<span className="legal-ph" title="To be completed before launch">
											phone
										</span>
									</span>
								</div>
								<div className="lg-kv-row">
									<span className="lg-kv-k">Data protection authority</span>
									<span className="lg-kv-v">
										Nigeria Data Protection Commission (NDPC) —{" "}
										<span className="legal-ph" title="To be completed before launch">
											NDPC contact / website
										</span>
									</span>
								</div>
							</div>
							<p className="lg-p">
								*Clusteer is a product operated by Outbuild Ltd (RC 8076384). Crypto-asset exchange
								and custody services are provided by a licensed third-party partner.*
							</p>
							<hr className="lg-divider" />
						</section>
					</div>
				</div>
				<div className="mt-[24px]">
					<div className="bento-card bento-pop opacity-100 bg-[#9fe870] border-[1.5px] border-[#21241d] rounded-[28px] p-[clamp(32px,5vw,64px)] text-center max-w-[1100px] mx-auto my-0">
						<h2 className="f-display text-[clamp(28px,4vw,46px)] font-extrabold tracking-[-1.5px] leading-[1.05] m-0 max-w-[720px] mx-auto"></h2>
						<div className="flex gap-[12px] justify-center flex-wrap mt-[28px]">
							<Link
								href="/signup"
								className="btn-shine lift inline-flex items-center gap-[8px] font-semibold text-[16px] text-[#9fe870] py-[15px] px-[28px] rounded-full bg-[#21241d] border-[1.5px] border-[#21241d]"
							>
								Create free account{" "}
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
								href="/signup"
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
