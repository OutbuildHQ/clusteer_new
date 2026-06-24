import Link from "next/link";
import { LegalTocSpy } from "@/components/app/legal-toc-spy";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Terms of Service — Clusteer",
	description: "The terms governing your use of Clusteer, operated by Outbuild Ltd (RC 8076384).",
};

export default function TermsOfServicePage() {
	return (
		<main>
			<LegalTocSpy />
			<div className="max-w-[1280px] mx-auto my-0 pt-[clamp(48px,7vw,92px)] px-[28px] pb-[100px]">
				<div className="max-w-[880px] mb-[12px]">
					<div className="opacity-100">
						<div className="f-mono text-[12px] font-semibold tracking-[1.5px] uppercase text-[#0f4f26] mb-[16px]">
							Legal · Terms of Service
						</div>
					</div>
					<div className="opacity-100">
						<h1 className="f-display font-extrabold text-[clamp(34px,6vw,60px)] tracking-[-2px] leading-[1.02] m-0">
							Terms of Service
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
								~14 min read
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
							These Terms of Service ("<strong>Terms</strong>") govern your access to and use of the
							Clusteer platform, website, and applications (together, the "<strong>Platform</strong>
							" or "<strong>Service</strong>"). Clusteer is operated by{" "}
							<strong>Outbuild Ltd</strong> (RC 8076384), a company registered in Nigeria ("
							<strong>Clusteer</strong>", "<strong>we</strong>", "<strong>us</strong>", "
							<strong>our</strong>").
						</p>
						<p className="lg-p">
							By creating an account, accessing, or using the Platform, you agree to these Terms,
							our Privacy Policy, our AML/CFT Policy, and our Cookie Policy.{" "}
							<strong>If you do not agree, do not use the Service.</strong>
						</p>
					</div>
				</div>
				<div className="legal-grid">
					<aside className="legal-toc">
						<div className="legal-toc-label">On this page</div>
						<nav className="legal-toc-list">
							<a href="#definitions" className="toc-link active">
								<span className="toc-n">00</span>
								<span className="toc-txt">Definitions</span>
							</a>
							<a href="#about" className="toc-link">
								<span className="toc-n">01</span>
								<span className="toc-txt">About the Service</span>
							</a>
							<a href="#eligibility" className="toc-link">
								<span className="toc-n">02</span>
								<span className="toc-txt">Eligibility</span>
							</a>
							<a href="#account" className="toc-link">
								<span className="toc-n">03</span>
								<span className="toc-txt">Account Registration and Verification</span>
							</a>
							<a href="#transactions" className="toc-link">
								<span className="toc-n">04</span>
								<span className="toc-txt">Transactions</span>
							</a>
							<a href="#fees" className="toc-link">
								<span className="toc-n">05</span>
								<span className="toc-txt">Fees</span>
							</a>
							<a href="#limits" className="toc-link">
								<span className="toc-n">06</span>
								<span className="toc-txt">Limits</span>
							</a>
							<a href="#prohibited" className="toc-link">
								<span className="toc-n">07</span>
								<span className="toc-txt">Prohibited Use</span>
							</a>
							<a href="#compliance" className="toc-link">
								<span className="toc-n">08</span>
								<span className="toc-txt">Compliance and Monitoring</span>
							</a>
							<a href="#risks" className="toc-link">
								<span className="toc-n">09</span>
								<span className="toc-txt">Risks</span>
							</a>
							<a href="#ip" className="toc-link">
								<span className="toc-n">10</span>
								<span className="toc-txt">Intellectual Property</span>
							</a>
							<a href="#third-party" className="toc-link">
								<span className="toc-n">11</span>
								<span className="toc-txt">Third-Party Services</span>
							</a>
							<a href="#termination" className="toc-link">
								<span className="toc-n">12</span>
								<span className="toc-txt">Suspension and Termination</span>
							</a>
							<a href="#liability" className="toc-link">
								<span className="toc-n">13</span>
								<span className="toc-txt">Disclaimers and Limitation of Liability</span>
							</a>
							<a href="#indemnity" className="toc-link">
								<span className="toc-n">14</span>
								<span className="toc-txt">Indemnity</span>
							</a>
							<a href="#disputes" className="toc-link">
								<span className="toc-n">15</span>
								<span className="toc-txt">Complaints, Governing Law, and Disputes</span>
							</a>
							<a href="#changes" className="toc-link">
								<span className="toc-n">16</span>
								<span className="toc-txt">Changes to These Terms</span>
							</a>
							<a href="#force-majeure" className="toc-link">
								<span className="toc-n">17</span>
								<span className="toc-txt">Force Majeure</span>
							</a>
							<a href="#general" className="toc-link">
								<span className="toc-n">18</span>
								<span className="toc-txt">General</span>
							</a>
							<a href="#contact" className="toc-link">
								<span className="toc-n">19</span>
								<span className="toc-txt">Contact Us</span>
							</a>
						</nav>
					</aside>
					<div className="legal-prose">
						<section id="definitions" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">00</span>
								<h2 className="lg-h2 f-display">Definitions</h2>
							</div>
							<p className="lg-p">
								In these Terms: "<strong>Digital Asset</strong>" means a stablecoin or other
								crypto-asset supported on the Platform; "<strong>Stablecoin</strong>" means a
								digital asset designed to maintain a stable value relative to a reference currency
								(such as the US dollar); "<strong>NGN</strong>" or "<strong>Naira</strong>" means
								Nigerian Naira; "<strong>Business Day</strong>" means a day other than a Saturday,
								Sunday, or public holiday in Nigeria; "<strong>KYC</strong>" means the
								identity-verification and customer due-diligence checks described in these Terms and
								our AML/CFT Policy.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="about" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">01</span>
								<h2 className="lg-h2 f-display">About the Service</h2>
							</div>
							<p className="lg-p">
								Clusteer is a platform that lets you buy and sell stablecoins for Nigerian Naira
								(NGN). The digital-asset exchange, custody, and settlement functions are provided
								through a <strong>licensed third-party exchange and custody partner</strong>;
								Clusteer provides the user-facing platform and the Naira settlement experience.
							</p>
							<p className="lg-p">
								Clusteer is <strong>not</strong> a bank, and amounts handled through the Platform
								are <strong>not</strong> deposits insured by the Nigeria Deposit Insurance
								Corporation (NDIC) or guaranteed by any government agency. We do not provide
								investment, tax, or legal advice, and nothing on the Platform should be taken as
								such.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="eligibility" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">02</span>
								<h2 className="lg-h2 f-display">Eligibility</h2>
							</div>
							<p className="lg-p">To use the Service, you must:</p>
							<ul className="lg-list">
								<li>
									be at least <strong>18 years old</strong> and have full legal capacity to enter
									into a contract;
								</li>
								<li>
									be a resident of, and use the Service from, a jurisdiction where we operate and
									where your use is lawful;
								</li>
								<li>
									not be a person subject to sanctions, or located in or acting on behalf of a
									sanctioned country, person, or entity; and
								</li>
								<li>
									use the Service for your own account and not on behalf of an undisclosed third
									party.
								</li>
							</ul>
							<p className="lg-p">
								We may refuse, restrict, or terminate access to anyone who does not meet these
								requirements. Each user may hold <strong>one account</strong> unless we agree
								otherwise in writing.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="account" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">03</span>
								<h2 className="lg-h2 f-display">Account Registration and Verification</h2>
							</div>
							<p className="lg-p">
								You must register an account and complete identity verification (KYC) before
								transacting. You agree to:
							</p>
							<ul className="lg-list">
								<li>
									provide accurate, current, and complete information, and keep it up to date;
								</li>
								<li>
									complete the identity, sanctions, and screening checks we (or our partners)
									require, including providing your BVN, NIN, identity documents, and biometric
									verification where requested; and
								</li>
								<li>keep your login credentials confidential and secure.</li>
							</ul>
							<p className="lg-p">
								You are responsible for all activity under your account. Notify us immediately at{" "}
								<span className="legal-ph" title="To be completed before launch">
									support@clusteer.com
								</span>{" "}
								if you suspect unauthorised access. We may suspend access while we verify your
								identity or investigate a concern, and we may decline to open or may close an
								account at our discretion where required for legal or risk reasons.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="transactions" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">04</span>
								<h2 className="lg-h2 f-display">Transactions</h2>
							</div>
							<ul className="lg-list">
								<li>
									<strong>Quotes and rates.</strong> When you place an order, we display a price or
									rate. Rates reflect market conditions plus applicable fees and may change rapidly.
									A quote is only binding once the order is confirmed and executed.
								</li>
								<li>
									<strong>Settlement.</strong> Naira payouts are made to a Nigerian bank account in
									your name that matches your verified identity. We do not pay out to third-party
									accounts. Settlement times may vary with banking, network, and compliance checks.
								</li>
								<li>
									<strong>Crypto transfers are irreversible.</strong> Blockchain transactions cannot
									be reversed once confirmed. You are solely responsible for the accuracy of any
									wallet address, network selection, and transaction details. We are not liable for
									losses arising from incorrect details, wrong-network transfers, or transfers to
									addresses you do not control.
								</li>
								<li>
									<strong>Network fees.</strong> Blockchain network fees may apply and are your
									responsibility.
								</li>
								<li>
									<strong>Holds.</strong> We may place a temporary hold on an order, account, or
									payout where required for verification, fraud prevention, sanctions screening, or
									compliance.
								</li>
							</ul>
							<div className="lg-callout">
								<strong>Our errors.</strong> If a transaction is processed in error (for example, a
								duplicate, miscalculated, or misdirected payout, or a credit made to your account by
								mistake), we may correct it — including by reversing the entry, reprocessing it
								correctly, or recovering any amount overpaid — and you authorise us to set off such
								amounts against your account balance or future payouts. We will act fairly and
								notify you of any material correction.
							</div>
							<hr className="lg-divider" />
						</section>
						<section id="fees" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">05</span>
								<h2 className="lg-h2 f-display">Fees</h2>
							</div>
							<p className="lg-p">
								Our fees and any applicable spread are shown before you confirm a transaction or are
								otherwise published on the Platform. We may change our fees at any time; changes
								apply to transactions made after the change takes effect. You are responsible for
								your own taxes arising from your use of the Service. Where the law requires us to
								withhold tax or to report transaction or account information to a tax authority
								(including the Federal Inland Revenue Service), we may do so.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="limits" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">06</span>
								<h2 className="lg-h2 f-display">Limits</h2>
							</div>
							<p className="lg-p">
								Transaction and balance limits apply based on your verification tier and our risk
								assessment. We may set, vary, or remove limits at any time, including for legal,
								regulatory, or risk-management reasons.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="prohibited" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">07</span>
								<h2 className="lg-h2 f-display">Prohibited Use</h2>
							</div>
							<p className="lg-p">You must not use the Service to:</p>
							<ul className="lg-list">
								<li>
									engage in or facilitate money laundering, terrorism financing, fraud, or any
									illegal activity;
								</li>
								<li>
									transact on behalf of, or for the benefit of, a sanctioned person or a person you
									are concealing;
								</li>
								<li>
									evade KYC/AML controls, including by using false information, another person’s
									identity, or someone else’s bank account;
								</li>
								<li>engage in market manipulation, abusive, or deceptive practices;</li>
								<li>use the Service where doing so is unlawful in your jurisdiction; or</li>
								<li>
									interfere with, attack, reverse-engineer, or gain unauthorised access to the
									Platform or its systems.
								</li>
							</ul>
							<p className="lg-p">
								Breach of this section may result in immediate suspension or termination; the
								freezing and holding of pending transactions or funds pending a lawful
								determination, after which they will be returned to you or dealt with as required by
								law or a competent authority; and reporting to the relevant authorities.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="compliance" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">08</span>
								<h2 className="lg-h2 f-display">Compliance and Monitoring</h2>
							</div>
							<p className="lg-p">
								As part of a regulated financial service, we (and our partners) carry out identity
								verification, sanctions and PEP screening, and transaction monitoring. You agree
								that we may:
							</p>
							<ul className="lg-list">
								<li>
									request additional information or documentation, including source-of-funds
									information, at any time;
								</li>
								<li>
									delay, suspend, freeze, decline, or reverse (where technically possible) a
									transaction or account;
								</li>
								<li>
									report transactions or activity to regulators and authorities (including the NFIU,
									SCUML, EFCC, SEC, CBN, and law enforcement) where required by law; and
								</li>
								<li>where the law requires it, take these actions without notifying you.</li>
							</ul>
							<p className="lg-p">
								We are not liable to you for any action taken in good faith to comply with legal or
								regulatory obligations.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="risks" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">09</span>
								<h2 className="lg-h2 f-display">Risks</h2>
							</div>
							<p className="lg-p">You acknowledge and accept that:</p>
							<ul className="lg-list">
								<li>
									the value of stablecoins and other digital assets can change, and stablecoins may
									de-peg or lose value;
								</li>
								<li>
									digital assets are not legal tender and are not protected by deposit-insurance or
									similar schemes;
								</li>
								<li>
									the regulatory treatment of digital assets in Nigeria continues to evolve and may
									affect the Service;
								</li>
								<li>blockchain transactions are irreversible and carry technical risks; and</li>
								<li>access to the Platform may be interrupted, delayed, or suspended.</li>
							</ul>
							<p className="lg-p">
								You use the Service at your own risk and should only transact with funds you can
								afford to commit.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="ip" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">10</span>
								<h2 className="lg-h2 f-display">Intellectual Property</h2>
							</div>
							<p className="lg-p">
								The Platform, including its software, content, branding, and trademarks, is owned by
								Outbuild Ltd or its licensors. We grant you a limited, non-exclusive,
								non-transferable, revocable licence to use the Platform for its intended purpose.
								You may not copy, modify, distribute, or create derivative works without our written
								permission.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="third-party" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">11</span>
								<h2 className="lg-h2 f-display">Third-Party Services</h2>
							</div>
							<p className="lg-p">
								The Service relies on third parties, including our licensed exchange and custody
								partner, banking and payment partners, identity-verification providers, and public
								blockchain networks. We are not responsible for the acts, omissions, availability,
								or terms of third parties, and your use of certain features may be subject to their
								terms.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="termination" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">12</span>
								<h2 className="lg-h2 f-display">Suspension and Termination</h2>
							</div>
							<p className="lg-p">
								We may suspend or terminate your access, with or without notice, where: you breach
								these Terms; we are required to by law or a regulator; we reasonably suspect fraud,
								money laundering, sanctions risk, or other illegal activity; or we discontinue the
								Service. You may stop using the Service at any time. Provisions that by their nature
								should survive termination (including compliance, liability, indemnity, and
								governing law) will survive.
							</p>
							<div className="lg-callout">
								<strong>Dormant accounts and unclaimed funds.</strong> Where an account is inactive
								for a prolonged period, or we hold funds we are unable to pay out to you (for
								example, because we cannot verify or reach you), we will hold and deal with those
								funds in accordance with applicable law and may apply reasonable dormancy
								procedures. We will return verified funds to you on a valid request, subject to our
								legal and compliance obligations.
							</div>
							<hr className="lg-divider" />
						</section>
						<section id="liability" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">13</span>
								<h2 className="lg-h2 f-display">Disclaimers and Limitation of Liability</h2>
							</div>
							<p className="lg-p">
								The Service is provided "<strong>as is</strong>" and "<strong>as available</strong>
								", without warranties of any kind to the fullest extent permitted by law. To the
								maximum extent permitted by law, we are not liable for indirect, incidental,
								special, consequential, or punitive losses, or for loss of profits, data, or
								goodwill. Our total aggregate liability for all other claims arising out of or
								relating to the Service will not exceed the greater of (a) the total fees you paid
								to us in the <strong>three (3) months</strong> before the event giving rise to the
								claim, or (b){" "}
								<span className="legal-ph" title="To be completed before launch">
									₦____
								</span>
								.
							</p>
							<div className="lg-callout">
								<strong>This cap does not apply to, and we remain fully liable for:</strong> (i) our
								obligation to remit or return funds properly due to you; (ii) our own fraud, wilful
								misconduct, or gross negligence; and (iii) any liability that cannot be excluded or
								limited under applicable Nigerian law, including under the Federal Competition and
								Consumer Protection Act.
							</div>
							<hr className="lg-divider" />
						</section>
						<section id="indemnity" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">14</span>
								<h2 className="lg-h2 f-display">Indemnity</h2>
							</div>
							<p className="lg-p">
								You agree to indemnify and hold harmless Outbuild Ltd, its officers, employees, and
								partners from any claims, losses, liabilities, and expenses (including reasonable
								legal fees) arising from your breach of these Terms, your misuse of the Service, or
								your violation of any law or third-party right.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="disputes" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">15</span>
								<h2 className="lg-h2 f-display">Complaints, Governing Law, and Disputes</h2>
							</div>
							<p className="lg-p">
								<strong>Complaints.</strong> If you have a complaint, contact us first at{" "}
								<span className="legal-ph" title="To be completed before launch">
									support@clusteer.com
								</span>
								. We will acknowledge it within{" "}
								<span className="legal-ph" title="To be completed before launch">
									2
								</span>{" "}
								Business Days and aim to resolve it within{" "}
								<span className="legal-ph" title="To be completed before launch">
									15
								</span>{" "}
								Business Days, keeping you informed if we need longer. We maintain a record of
								complaints and their resolution.
							</p>
							<p className="lg-p">
								<strong>Governing law.</strong> These Terms are governed by the laws of the{" "}
								<strong>Federal Republic of Nigeria</strong>.
							</p>
							<p className="lg-p">
								<strong>Disputes.</strong> If a complaint is not resolved through our internal
								process, the parties will attempt to resolve the dispute amicably. Failing
								resolution within{" "}
								<span className="legal-ph" title="To be completed before launch">
									30
								</span>{" "}
								days, the dispute will be subject to{" "}
								<span className="legal-ph" title="To be completed before launch">
									the exclusive jurisdiction of the courts of Nigeria / arbitration in Lagos under
									the Arbitration and Mediation Act 2023, with the seat in Lagos and proceedings in
									English
								</span>
								.{" "}
								<span className="legal-ph" title="To be completed before launch">
									Choose one and confirm with counsel.
								</span>{" "}
								Nothing prevents you from pursuing any remedy available under applicable
								consumer-protection law or from complaining to a relevant regulator.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="changes" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">16</span>
								<h2 className="lg-h2 f-display">Changes to These Terms</h2>
							</div>
							<p className="lg-p">
								We may update these Terms from time to time. For material changes, we will give you
								reasonable advance notice (at least{" "}
								<span className="legal-ph" title="To be completed before launch">
									14
								</span>{" "}
								days where practicable) before they take effect, except where an immediate change is
								required by law or for security or risk reasons. Before a material change takes
								effect, you may close your account and withdraw your verified available funds,
								subject to our legal and compliance obligations. We will post the updated version
								with a new "Last updated" date. Your continued use of the Service after changes take
								effect constitutes acceptance.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="force-majeure" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">17</span>
								<h2 className="lg-h2 f-display">Force Majeure</h2>
							</div>
							<p className="lg-p">
								We are not liable for any failure or delay caused by events beyond our reasonable
								control, including network or blockchain failures, banking outages, regulatory
								action, power or internet failures, or acts of God.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="general" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">18</span>
								<h2 className="lg-h2 f-display">General</h2>
							</div>
							<p className="lg-p">
								These Terms, together with the policies referenced in them, are the entire agreement
								between you and us regarding the Service. If any provision is found unenforceable,
								the rest remains in effect. Our failure to enforce a provision is not a waiver. You
								may not assign your rights without our consent; we may assign ours in connection
								with a merger, acquisition, or reorganisation.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="contact" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">19</span>
								<h2 className="lg-h2 f-display">Contact Us</h2>
							</div>
							<div className="lg-kv">
								<div className="lg-kv-row">
									<span className="lg-kv-k">Outbuild Ltd (Clusteer)</span>
									<span className="lg-kv-v">
										<a href="mailto:support@clusteer.com" className="underline">
											support@clusteer.com
										</a>{" "}
										·{" "}
										<a href="tel:+2347048696558" className="underline">
											+234 704 869 6558
										</a>
									</span>
								</div>
							</div>
							<p className="lg-p">
								Clusteer is a product operated by Outbuild Ltd (RC 8076384). Crypto-asset exchange
								and custody services are provided by a licensed third-party partner.
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
