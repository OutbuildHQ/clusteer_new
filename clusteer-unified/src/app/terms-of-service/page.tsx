import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsOfServicePage() {
	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-4xl mx-auto px-6 py-12">
				<header className="mb-12">
					<Link href="/">
						<Button
							variant="ghost"
							className="mb-6 px-4 py-2 flex items-center gap-2 hover:gap-3 hover:px-3 transition-all"
						>
							<ArrowLeft className="size-5" />
							Back to Home
						</Button>
					</Link>
					<h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
					<p className="text-gray-600">Last Updated: January 1, 2025</p>
				</header>

				<div className="space-y-8 text-gray-800">
					<section>
						<h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
						<p className="mb-4">
							By accessing and using Clusteer (&quot;the Platform&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
						<p className="mb-4">
							Clusteer is a cryptocurrency exchange platform that allows users to buy, sell, and trade digital assets including but not limited to USDT and other cryptocurrencies. We provide:
						</p>
						<ul className="list-disc pl-6 space-y-2 mb-4">
							<li>Cryptocurrency trading services</li>
							<li>Digital wallet services</li>
							<li>Peer-to-peer trading facilitation</li>
							<li>Cross-chain transfer services</li>
							<li>Market data and analytics</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">3. User Eligibility</h2>
						<p className="mb-4">
							To use Clusteer, you must:
						</p>
						<ul className="list-disc pl-6 space-y-2 mb-4">
							<li>Be at least 18 years of age</li>
							<li>Have the legal capacity to enter into a binding agreement</li>
							<li>Not be located in a country where cryptocurrency trading is prohibited</li>
							<li>Complete our Know Your Customer (KYC) verification process</li>
							<li>Provide accurate and truthful information</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">4. Account Registration and Security</h2>
						<h3 className="text-xl font-semibold mb-3 mt-6">4.1 Account Creation</h3>
						<p className="mb-4">
							You must create an account to use our services. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
						</p>

						<h3 className="text-xl font-semibold mb-3 mt-6">4.2 Account Security</h3>
						<p className="mb-4">
							You are responsible for:
						</p>
						<ul className="list-disc pl-6 space-y-2 mb-4">
							<li>Maintaining the confidentiality of your account credentials</li>
							<li>All activities that occur under your account</li>
							<li>Notifying us immediately of any unauthorized access or security breach</li>
							<li>Enabling two-factor authentication (2FA) when available</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">5. KYC and AML Compliance</h2>
						<p className="mb-4">
							Clusteer complies with Know Your Customer (KYC) and Anti-Money Laundering (AML) regulations. You agree to:
						</p>
						<ul className="list-disc pl-6 space-y-2 mb-4">
							<li>Provide valid identification documents</li>
							<li>Submit to identity verification processes</li>
							<li>Provide Bank Verification Number (BVN) for Nigerian users</li>
							<li>Allow us to conduct background checks as required by law</li>
							<li>Update your information when requested</li>
						</ul>
						<p className="mb-4">
							We reserve the right to suspend or terminate accounts that fail to complete KYC verification or provide false information.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">6. Trading and Transactions</h2>
						<h3 className="text-xl font-semibold mb-3 mt-6">6.1 Trading Services</h3>
						<p className="mb-4">
							All trades executed on the Platform are final and cannot be reversed except in cases of technical errors or fraud as determined by Clusteer.
						</p>

						<h3 className="text-xl font-semibold mb-3 mt-6">6.2 Fees and Charges</h3>
						<p className="mb-4">
							You agree to pay all applicable fees for transactions conducted through the Platform. Fees are displayed before transaction confirmation and may include:
						</p>
						<ul className="list-disc pl-6 space-y-2 mb-4">
							<li>Trading fees</li>
							<li>Withdrawal fees</li>
							<li>Network fees (gas fees)</li>
							<li>Conversion fees</li>
						</ul>

						<h3 className="text-xl font-semibold mb-3 mt-6">6.3 Price Fluctuations</h3>
						<p className="mb-4">
							Cryptocurrency prices are volatile. You acknowledge that prices may change between the time you initiate and complete a transaction. Clusteer is not responsible for price fluctuations.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">7. Wallet Services</h2>
						<p className="mb-4">
							Clusteer provides digital wallet services for storing cryptocurrencies. You acknowledge that:
						</p>
						<ul className="list-disc pl-6 space-y-2 mb-4">
							<li>You are responsible for backing up your wallet recovery information</li>
							<li>Lost private keys or recovery phrases cannot be recovered by Clusteer</li>
							<li>Transactions sent to incorrect addresses cannot be reversed</li>
							<li>We may suspend wallet access for security or compliance reasons</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">8. Prohibited Activities</h2>
						<p className="mb-4">
							You agree not to:
						</p>
						<ul className="list-disc pl-6 space-y-2 mb-4">
							<li>Use the Platform for illegal activities including money laundering or terrorist financing</li>
							<li>Manipulate market prices or engage in fraudulent trading practices</li>
							<li>Circumvent or attempt to circumvent security measures</li>
							<li>Create multiple accounts to abuse promotions or evade restrictions</li>
							<li>Use automated systems (bots) without written permission</li>
							<li>Engage in activities that interfere with the Platform&apos;s operation</li>
							<li>Provide false or misleading information</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">9. Intellectual Property</h2>
						<p className="mb-4">
							All content, features, and functionality on the Platform, including but not limited to text, graphics, logos, and software, are owned by Clusteer and protected by international copyright, trademark, and other intellectual property laws.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
						<p className="mb-4">
							To the fullest extent permitted by law, Clusteer shall not be liable for:
						</p>
						<ul className="list-disc pl-6 space-y-2 mb-4">
							<li>Loss of profits, revenue, or data</li>
							<li>Indirect, incidental, or consequential damages</li>
							<li>Losses resulting from unauthorized access to your account</li>
							<li>Price fluctuations in cryptocurrency markets</li>
							<li>Technical failures, system downtime, or network issues</li>
							<li>Actions or inactions of third-party service providers</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
						<p className="mb-4">
							You agree to indemnify and hold harmless Clusteer, its affiliates, and their respective officers, directors, employees, and agents from any claims, losses, damages, liabilities, and expenses arising from your use of the Platform or violation of these Terms.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">12. Suspension and Termination</h2>
						<p className="mb-4">
							We reserve the right to suspend or terminate your account at any time for:
						</p>
						<ul className="list-disc pl-6 space-y-2 mb-4">
							<li>Violation of these Terms of Service</li>
							<li>Suspected fraudulent or illegal activity</li>
							<li>Failure to complete KYC verification</li>
							<li>Extended period of inactivity</li>
							<li>Regulatory or legal requirements</li>
						</ul>
						<p className="mb-4">
							Upon termination, you may withdraw your funds subject to applicable fees and compliance requirements.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">13. Dispute Resolution</h2>
						<p className="mb-4">
							Any disputes arising from these Terms shall be resolved through:
						</p>
						<ul className="list-disc pl-6 space-y-2 mb-4">
							<li>Good faith negotiations between parties</li>
							<li>Mediation, if negotiations fail</li>
							<li>Binding arbitration in accordance with Nigerian law</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">14. Governing Law</h2>
						<p className="mb-4">
							These Terms shall be governed by and construed in accordance with the laws of Nigeria, without regard to its conflict of law provisions.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">15. Changes to Terms</h2>
						<p className="mb-4">
							We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through the Platform. Continued use of the Platform after changes constitutes acceptance of the modified Terms.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">16. Contact Information</h2>
						<p className="mb-4">
							For questions about these Terms of Service, please contact us at:
						</p>
						<ul className="list-none space-y-2 mb-4">
							<li><strong>Email:</strong> <a href="mailto:legal@clusteer.com" className="text-dark-green underline">legal@clusteer.com</a></li>
							<li><strong>Support:</strong> <a href="mailto:support@clusteer.com" className="text-dark-green underline">support@clusteer.com</a></li>
						</ul>
					</section>

					<section className="border-t pt-8 mt-8">
						<p className="text-sm text-gray-600">
							By using Clusteer, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}
