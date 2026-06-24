import Link from "next/link";
import { LegalTocSpy } from "@/components/app/legal-toc-spy";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Cookie Policy — Clusteer",
	description:
		"How Clusteer uses cookies and similar technologies, and how to manage your preferences.",
};

export default function CookiePolicyPage() {
	return (
		<main>
			<LegalTocSpy />
			<div className="max-w-[1280px] mx-auto my-0 pt-[clamp(48px,7vw,92px)] px-[28px] pb-[100px]">
				<div className="max-w-[880px] mb-[12px]">
					<div className="opacity-100">
						<div className="f-mono text-[12px] font-semibold tracking-[1.5px] uppercase text-[#0f4f26] mb-[16px]">
							Legal · Cookie Policy
						</div>
					</div>
					<div className="opacity-100">
						<h1 className="f-display font-extrabold text-[clamp(34px,6vw,60px)] tracking-[-2px] leading-[1.02] m-0">
							Cookie Policy
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
								~5 min read
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
							This Cookie Policy explains how <strong>Outbuild Ltd</strong> (RC 8076384), operating
							the <strong>Clusteer</strong> platform ("<strong>Clusteer</strong>", "
							<strong>we</strong>", "<strong>us</strong>", "<strong>our</strong>"), uses cookies and
							similar technologies on our website and applications. Read it alongside our Privacy
							Policy.
						</p>
					</div>
				</div>
				<div className="legal-grid">
					<aside className="legal-toc">
						<div className="legal-toc-label">On this page</div>
						<nav className="legal-toc-list">
							<a href="#what-are-cookies" className="toc-link active">
								<span className="toc-n">01</span>
								<span className="toc-txt">What Are Cookies?</span>
							</a>
							<a href="#how-we-use" className="toc-link">
								<span className="toc-n">02</span>
								<span className="toc-txt">How We Use Cookies</span>
							</a>
							<a href="#types" className="toc-link">
								<span className="toc-n">03</span>
								<span className="toc-txt">Types of Cookies We Use</span>
							</a>
							<a href="#third-party" className="toc-link">
								<span className="toc-n">04</span>
								<span className="toc-txt">Third-Party Cookies</span>
							</a>
							<a href="#choices" className="toc-link">
								<span className="toc-n">05</span>
								<span className="toc-txt">Your Choices and Consent</span>
							</a>
							<a href="#changes" className="toc-link">
								<span className="toc-n">06</span>
								<span className="toc-txt">Changes to This Policy</span>
							</a>
							<a href="#contact" className="toc-link">
								<span className="toc-n">07</span>
								<span className="toc-txt">Contact</span>
							</a>
						</nav>
					</aside>
					<div className="legal-prose">
						<section id="what-are-cookies" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">01</span>
								<h2 className="lg-h2 f-display">What Are Cookies?</h2>
							</div>
							<p className="lg-p">
								Cookies are small text files placed on your device when you visit a website. Similar
								technologies (such as pixels, local storage, and SDKs) work in comparable ways. They
								help a site function, remember your preferences, keep you secure, and understand how
								the site is used.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="how-we-use" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">02</span>
								<h2 className="lg-h2 f-display">How We Use Cookies</h2>
							</div>
							<p className="lg-p">We use cookies and similar technologies to:</p>
							<ul className="lg-list">
								<li>
									keep the Platform secure and operate core features such as login and session
									management;
								</li>
								<li>remember your settings and preferences;</li>
								<li>understand how the Platform is used so we can improve it; and</li>
								<li>detect and prevent fraud and abuse.</li>
							</ul>
							<hr className="lg-divider" />
						</section>
						<section id="types" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">03</span>
								<h2 className="lg-h2 f-display">Types of Cookies We Use</h2>
							</div>
							<ul className="lg-list">
								<li>
									<strong>Strictly necessary</strong> — required for the Platform to function and to
									keep your account secure (for example, authentication and session cookies). These
									cannot be switched off in our systems.
								</li>
								<li>
									<strong>Functional</strong> — remember your choices and preferences to improve
									your experience.
								</li>
								<li>
									<strong>Performance and analytics</strong> — help us understand usage and improve
									the Platform. These are used only with your consent where required.
								</li>
								<li>
									<strong>Marketing</strong> — measure the performance of our ads and campaigns.
									These are set only with your consent.
								</li>
							</ul>
							<p className="lg-p">
								We do not use cookies to sell your personal data. Analytics and marketing cookies
								are only ever set after you opt in.
							</p>
							<div className="lg-callout">
								<strong>Cookies we use.</strong> The table below lists the cookies and similar
								storage we use today, grouped by category. Analytics and marketing entries are only
								active with your consent.
							</div>
							<div className="lg-table-wrap">
								<table className="lg-table">
									<thead>
										<tr>
											<th>Cookie / technology</th>
											<th>Provider</th>
											<th>Purpose</th>
											<th>Category</th>
											<th>Duration</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>auth_token</td>
											<td>Clusteer (first-party)</td>
											<td>Keeps you securely signed in to your session</td>
											<td>Strictly necessary</td>
											<td>Session (up to 30 days with keep-me-signed-in)</td>
										</tr>
										<tr>
											<td>clusteer-cookie-consent</td>
											<td>Clusteer (first-party)</td>
											<td>Stores your cookie preferences so we do not ask again</td>
											<td>Strictly necessary</td>
											<td>Persistent (local storage)</td>
										</tr>
										<tr>
											<td>theme</td>
											<td>Clusteer (first-party)</td>
											<td>Remembers your light / dark display preference</td>
											<td>Functional</td>
											<td>Persistent (local storage)</td>
										</tr>
										<tr>
											<td>_ga, _gid</td>
											<td>Google Analytics</td>
											<td>Measures site traffic and usage so we can improve the product</td>
											<td>Analytics</td>
											<td>_ga: 2 years; _gid: 24 hours</td>
										</tr>
										<tr>
											<td>_fbp</td>
											<td>Meta (Facebook)</td>
											<td>Measures the performance of our ads and campaigns</td>
											<td>Marketing</td>
											<td>90 days</td>
										</tr>
									</tbody>
								</table>
							</div>
							<hr className="lg-divider" />
						</section>
						<section id="third-party" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">04</span>
								<h2 className="lg-h2 f-display">Third-Party Cookies</h2>
							</div>
							<p className="lg-p">
								Some cookies may be set by third parties that provide services on our behalf (for
								example, analytics or security providers). These third parties process data under
								their own terms and our instructions. Where required, we obtain your consent before
								setting non-essential third-party cookies.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="choices" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">05</span>
								<h2 className="lg-h2 f-display">Your Choices and Consent</h2>
							</div>
							<p className="lg-p">
								Under the <strong>Nigeria Data Protection Act 2023</strong>, non-essential cookies
								(such as analytics and functional cookies) are{" "}
								<strong>not set before you give consent</strong>. We present a cookie banner on your
								first visit so you can accept or reject categories of non-essential cookies; until
								you opt in, only strictly necessary cookies are used. You can change or withdraw
								your choices at any time through the banner or your settings.
							</p>
							<p className="lg-p">
								You can also control cookies through your browser settings — including blocking or
								deleting cookies — though disabling strictly necessary cookies may stop parts of the
								Platform from working.
							</p>
							<p className="lg-p">
								Most browsers let you manage cookies via their help or settings menus (for example,
								Chrome, Safari, Firefox, and Edge each provide cookie controls).
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="changes" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">06</span>
								<h2 className="lg-h2 f-display">Changes to This Policy</h2>
							</div>
							<p className="lg-p">
								We may update this Cookie Policy from time to time. We will post the updated version
								with a new "Last updated" date and, where appropriate, notify you.
							</p>
							<hr className="lg-divider" />
						</section>
						<section id="contact" className="lg-sec">
							<div className="lg-sec-head">
								<span className="lg-sec-n f-mono">07</span>
								<h2 className="lg-h2 f-display">Contact</h2>
							</div>
							<div className="lg-kv">
								<div className="lg-kv-row">
									<span className="lg-kv-k">Outbuild Ltd (Clusteer)</span>
									<span className="lg-kv-v">legal@clusteer.com</span>
								</div>
							</div>
							<p className="lg-p">Clusteer is a product operated by Outbuild Ltd (RC 8076384).</p>
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
