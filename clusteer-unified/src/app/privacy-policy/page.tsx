import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
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
					<h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
					<p className="text-gray-600">Last Updated: October 30, 2025</p>
				</header>

				<div className="space-y-8 text-gray-800">
					<section>
						<h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
						<p className="mb-4">
							Welcome to Clusteer. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our cryptocurrency exchange platform.
						</p>
						<p>
							By using Clusteer, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
						<h3 className="text-xl font-semibold mb-3 mt-6">2.1 Personal Information</h3>
						<p className="mb-4">We collect the following types of personal information:</p>
						<ul className="list-disc pl-6 space-y-2 mb-4">
							<li><strong>Identity Information:</strong> Full name, date of birth, nationality, government-issued ID numbers</li>
							<li><strong>Contact Information:</strong> Email address, phone number, residential address</li>
							<li><strong>Financial Information:</strong> Bank account details, transaction history, wallet addresses</li>
							<li><strong>Verification Documents:</strong> Government-issued IDs, proof of address, Bank Verification Number (BVN)</li>
							<li><strong>Biometric Information:</strong> Facial recognition data for identity verification</li>
						</ul>

						<h3 className="text-xl font-semibold mb-3 mt-6">2.2 Technical Information</h3>
						<ul className="list-disc pl-6 space-y-2">
							<li>IP address and device information</li>
							<li>Browser type and version</li>
							<li>Operating system</li>
							<li>Login timestamps and activity logs</li>
							<li>Cookies and similar tracking technologies</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
						<p className="mb-4">We use your personal information for the following purposes:</p>
						<ul className="list-disc pl-6 space-y-2">
							<li><strong>Account Management:</strong> Create and manage your account</li>
							<li><strong>Identity Verification:</strong> Comply with Know Your Customer (KYC) and Anti-Money Laundering (AML) regulations</li>
							<li><strong>Transaction Processing:</strong> Execute and record cryptocurrency transactions</li>
							<li><strong>Security:</strong> Prevent fraud, unauthorized access, and other illegal activities</li>
							<li><strong>Customer Support:</strong> Respond to your inquiries and provide technical assistance</li>
							<li><strong>Legal Compliance:</strong> Comply with applicable laws, regulations, and legal processes</li>
							<li><strong>Service Improvement:</strong> Analyze usage patterns to enhance our platform</li>
							<li><strong>Communications:</strong> Send important updates, security alerts, and service notifications</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">4. How We Share Your Information</h2>
						<p className="mb-4">We may share your information with:</p>
						<ul className="list-disc pl-6 space-y-2">
							<li><strong>Service Providers:</strong> Third-party vendors who assist with identity verification, payment processing, and security services</li>
							<li><strong>Regulatory Authorities:</strong> Government agencies and law enforcement when required by law</li>
							<li><strong>Financial Institutions:</strong> Banks and payment processors for transaction settlement</li>
							<li><strong>Legal Proceedings:</strong> Courts, arbitrators, or parties to litigation when legally required</li>
							<li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
						</ul>
						<p className="mt-4">
							<strong>We do not sell or rent your personal information to third parties for marketing purposes.</strong>
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
						<p className="mb-4">We implement industry-standard security measures to protect your information:</p>
						<ul className="list-disc pl-6 space-y-2">
							<li>AES-256-GCM encryption for sensitive data at rest</li>
							<li>TLS/SSL encryption for data in transit</li>
							<li>Multi-factor authentication (MFA) for account access</li>
							<li>Regular security audits and penetration testing</li>
							<li>Strict access controls and employee training</li>
							<li>Secure backup and disaster recovery procedures</li>
						</ul>
						<p className="mt-4">
							However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
						<p className="mb-4">
							We retain your personal information for as long as necessary to:
						</p>
						<ul className="list-disc pl-6 space-y-2">
							<li>Provide our services to you</li>
							<li>Comply with legal and regulatory obligations (minimum 5 years for financial records)</li>
							<li>Resolve disputes and enforce our agreements</li>
							<li>Prevent fraud and abuse</li>
						</ul>
						<p className="mt-4">
							When your data is no longer needed, we will securely delete or anonymize it.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">7. Your Privacy Rights</h2>
						<p className="mb-4">Depending on your location, you may have the following rights:</p>
						<ul className="list-disc pl-6 space-y-2">
							<li><strong>Access:</strong> Request a copy of your personal information</li>
							<li><strong>Correction:</strong> Update or correct inaccurate information</li>
							<li><strong>Deletion:</strong> Request deletion of your data (subject to legal obligations)</li>
							<li><strong>Objection:</strong> Object to certain processing activities</li>
							<li><strong>Data Portability:</strong> Receive your data in a structured format</li>
							<li><strong>Withdraw Consent:</strong> Revoke consent for data processing (where applicable)</li>
						</ul>
						<p className="mt-4">
							To exercise these rights, please contact us at <a href="mailto:privacy@clusteer.com" className="text-dark-green underline">privacy@clusteer.com</a>
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking</h2>
						<p className="mb-4">
							We use cookies and similar technologies to enhance your experience. You can control cookie preferences through your browser settings. Note that disabling cookies may affect platform functionality.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">9. Third-Party Links</h2>
						<p>
							Our platform may contain links to third-party websites. We are not responsible for their privacy practices. We encourage you to review their privacy policies before providing any information.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
						<p>
							Clusteer is not intended for individuals under 18 years of age. We do not knowingly collect personal information from minors. If you believe we have collected information from a child, please contact us immediately.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">11. International Data Transfers</h2>
						<p>
							Your information may be transferred to and processed in countries outside your residence. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">12. Changes to This Policy</h2>
						<p className="mb-4">
							We may update this Privacy Policy periodically. We will notify you of significant changes by:
						</p>
						<ul className="list-disc pl-6 space-y-2">
							<li>Posting the updated policy on our website</li>
							<li>Sending email notifications to registered users</li>
							<li>Displaying in-app notifications</li>
						</ul>
						<p className="mt-4">
							Your continued use of Clusteer after changes constitutes acceptance of the updated policy.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
						<p className="mb-4">
							If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
						</p>
						<div className="bg-gray-50 p-6 rounded-lg">
							<p className="mb-2"><strong>Email:</strong> <a href="mailto:privacy@clusteer.com" className="text-dark-green underline">privacy@clusteer.com</a></p>
							<p className="mb-2"><strong>Support:</strong> <a href="mailto:support@clusteer.com" className="text-dark-green underline">support@clusteer.com</a></p>
							<p><strong>Data Protection Officer:</strong> <a href="mailto:dpo@clusteer.com" className="text-dark-green underline">dpo@clusteer.com</a></p>
						</div>
					</section>

					<section className="border-t pt-8 mt-12">
						<h2 className="text-2xl font-semibold mb-4">Nigeria-Specific Privacy Rights</h2>
						<p className="mb-4">
							As a Nigerian user, you have rights under the Nigeria Data Protection Regulation (NDPR):
						</p>
						<ul className="list-disc pl-6 space-y-2">
							<li>Right to information about data processing</li>
							<li>Right to access your personal data</li>
							<li>Right to rectification of inaccurate data</li>
							<li>Right to erasure (right to be forgotten)</li>
							<li>Right to object to processing</li>
							<li>Right to data portability</li>
							<li>Right to lodge complaints with the National Information Technology Development Agency (NITDA)</li>
						</ul>
					</section>
				</div>

				<footer className="mt-16 pt-8 border-t text-center text-gray-600">
					<p>&copy; 2025 Clusteer. All rights reserved.</p>
				</footer>
			</div>
		</div>
	);
}
