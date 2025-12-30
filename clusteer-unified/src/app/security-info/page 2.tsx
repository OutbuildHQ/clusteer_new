import NavBar from "@/components/nav-bar";
import Container from "@/components/container";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Security - Clusteer | How We Protect Your Crypto & Data",
	description: "Learn how Clusteer protects your funds and data with bank-grade encryption, 2FA authentication, secure escrow, and industry-leading security protocols.",
};

export default function SecurityPage() {
	return (
		<>
			<NavBar />
			<div className="pt-16 lg:pt-20 font-mona bg-[#FAFAFA]">
				<Container>
					<section className="max-w-4xl mx-auto py-16 lg:py-20">
						<header className="text-center mb-12 lg:mb-16">
							<h1 className="font-bold text-[40px] leading-tight lg:text-5xl mb-6">
								Your Security is Our Priority
							</h1>
							<p className="text-xl text-reviews-text font-avenir-next">
								We use industry-leading security measures to protect your funds and personal data.
							</p>
						</header>

						{/* Security Features */}
						<div className="space-y-12">
							<div className="bg-[#F0EBE6] rounded-2xl p-8 border-2 border-black">
								<div className="flex items-start gap-6">
									<div className="w-16 h-16 bg-light-green rounded-full border-2 border-black flex items-center justify-center shrink-0">
										<Image
											src="/assets/icons/shield.svg"
											alt="Shield icon"
											width={32}
											height={32}
										/>
									</div>
									<div>
										<h2 className="text-2xl font-bold mb-4 font-avenir-next">Bank-Grade Encryption</h2>
										<p className="text-reviews-text leading-relaxed font-lexend">
											All sensitive data is encrypted using AES-256 encryption, the same standard used by banks and financial institutions worldwide. Your personal information, transaction details, and wallet addresses are protected with military-grade security.
										</p>
									</div>
								</div>
							</div>

							<div className="bg-[#F0EBE6] rounded-2xl p-8 border-2 border-black">
								<div className="flex items-start gap-6">
									<div className="w-16 h-16 bg-light-green rounded-full border-2 border-black flex items-center justify-center shrink-0">
										<Image
											src="/assets/icons/2fa_security.svg"
											alt="2FA icon"
											width={32}
											height={32}
										/>
									</div>
									<div>
										<h2 className="text-2xl font-bold mb-4 font-avenir-next">Two-Factor Authentication (2FA)</h2>
										<p className="text-reviews-text leading-relaxed font-lexend">
											Add an extra layer of security to your account with 2FA. We support Google Authenticator, SMS verification, and biometric authentication. Even if someone gets your password, they can't access your account without your second factor.
										</p>
									</div>
								</div>
							</div>

							<div className="bg-[#F0EBE6] rounded-2xl p-8 border-2 border-black">
								<div className="flex items-start gap-6">
									<div className="w-16 h-16 bg-light-green rounded-full border-2 border-black flex items-center justify-center shrink-0">
										<Image
											src="/assets/icons/secure.svg"
											alt="Secure icon"
											width={32}
											height={32}
										/>
									</div>
									<div>
										<h2 className="text-2xl font-bold mb-4 font-avenir-next">Secure Escrow System</h2>
										<p className="text-reviews-text leading-relaxed font-lexend">
											For P2P trades, funds are held securely in escrow until both parties fulfill their obligations. Our smart escrow system automatically releases funds only when all conditions are met, protecting both buyers and sellers from fraud.
										</p>
									</div>
								</div>
							</div>

							<div className="bg-[#F0EBE6] rounded-2xl p-8 border-2 border-black">
								<div className="flex items-start gap-6">
									<div className="w-16 h-16 bg-light-green rounded-full border-2 border-black flex items-center justify-center shrink-0">
										<Image
											src="/assets/icons/data_transfer.svg"
											alt="Data icon"
											width={32}
											height={32}
										/>
									</div>
									<div>
										<h2 className="text-2xl font-bold mb-4 font-avenir-next">Cold Storage for Funds</h2>
										<p className="text-reviews-text leading-relaxed font-lexend">
											The majority of user funds are stored in cold wallets, completely offline and inaccessible to hackers. Only a small percentage needed for daily operations is kept in hot wallets, minimizing exposure to online threats.
										</p>
									</div>
								</div>
							</div>

							<div className="bg-[#F0EBE6] rounded-2xl p-8 border-2 border-black">
								<div className="flex items-start gap-6">
									<div className="w-16 h-16 bg-light-green rounded-full border-2 border-black flex items-center justify-center shrink-0">
										<Image
											src="/assets/icons/code.svg"
											alt="Code icon"
											width={32}
											height={32}
										/>
									</div>
									<div>
										<h2 className="text-2xl font-bold mb-4 font-avenir-next">Regular Security Audits</h2>
										<p className="text-reviews-text leading-relaxed font-lexend">
											Our platform undergoes regular third-party security audits and penetration testing. We continuously monitor for vulnerabilities and patch any issues immediately to ensure your funds remain safe.
										</p>
									</div>
								</div>
							</div>

							<div className="bg-[#F0EBE6] rounded-2xl p-8 border-2 border-black">
								<div className="flex items-start gap-6">
									<div className="w-16 h-16 bg-light-green rounded-full border-2 border-black flex items-center justify-center shrink-0">
										<Image
											src="/assets/icons/customer_service.svg"
											alt="Support icon"
											width={32}
											height={32}
										/>
									</div>
									<div>
										<h2 className="text-2xl font-bold mb-4 font-avenir-next">24/7 Fraud Monitoring</h2>
										<p className="text-reviews-text leading-relaxed font-lexend">
											Our security team monitors transactions around the clock for suspicious activity. Advanced AI algorithms detect unusual patterns and flag potentially fraudulent transactions for immediate review.
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Best Practices */}
						<div className="mt-16 bg-white rounded-2xl p-8 border-2 border-black">
							<h2 className="text-2xl font-bold mb-6 font-avenir-next">Best Practices to Keep Your Account Secure</h2>
							<ul className="space-y-4 text-reviews-text font-lexend">
								<li className="flex items-start gap-3">
									<span className="text-dark-green font-bold">•</span>
									<span>Enable 2FA on your account immediately after signup</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="text-dark-green font-bold">•</span>
									<span>Use a strong, unique password that you don't use elsewhere</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="text-dark-green font-bold">•</span>
									<span>Never share your password, 2FA codes, or recovery phrases with anyone</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="text-dark-green font-bold">•</span>
									<span>Verify wallet addresses carefully before sending crypto</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="text-dark-green font-bold">•</span>
									<span>Be cautious of phishing emails or fake websites impersonating Clusteer</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="text-dark-green font-bold">•</span>
									<span>Log out of your account when using public or shared devices</span>
								</li>
							</ul>
						</div>

						{/* Contact */}
						<div className="mt-16 text-center">
							<h2 className="text-2xl font-bold mb-4 font-avenir-next">Have Security Concerns?</h2>
							<p className="text-reviews-text mb-8 font-lexend">
								If you notice any suspicious activity or have security questions, contact our team immediately.
							</p>
							<Link
								href="/login"
								className="inline-block bg-light-green border-2 border-black rounded-full px-8 py-4 font-bold hover:bg-light-green/80 transition-colors"
							>
								Contact Security Team
							</Link>
						</div>
					</section>
				</Container>
			</div>
		</>
	);
}
