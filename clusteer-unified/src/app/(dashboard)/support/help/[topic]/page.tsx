"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Shield, XCircle, Scale, AlertCircle, DollarSign, Phone, MessageCircle, Mail, Headphones } from "lucide-react";
import Link from "next/link";

const HELP_CONTENT: Record<string, {
	icon: any;
	title: string;
	sections: Array<{ title: string; content: string }>;
}> = {
	"pending-order": {
		icon: Clock,
		title: "Pending Order",
		sections: [
			{
				title: "Why is my order pending?",
				content: "Orders may be pending for several reasons:\n\n• Payment processing delay - Your bank or payment provider is still processing the transaction\n• Verification required - Additional identity verification is needed for large transactions\n• Network congestion - High traffic on the blockchain network causing delays\n• Insufficient funds - Payment method has insufficient balance\n• Technical issues - Temporary system maintenance or upgrades",
			},
			{
				title: "How long does it take?",
				content: "Typical processing times:\n\n• Bank transfer: 1-3 business days\n• Card payment: 5-30 minutes\n• Crypto transfer: 10-60 minutes depending on network\n• P2P transfer: Instant to 24 hours\n\nIf your order has been pending for longer than expected, please contact support.",
			},
			{
				title: "What should I do?",
				content: "Steps to resolve:\n\n1. Check your email for any verification requests\n2. Verify your payment method has sufficient funds\n3. Check the transaction status in your account history\n4. Wait for the specified processing time\n5. If still pending after 24 hours, contact support with your order ID",
			},
		],
	},
	"account-verification": {
		icon: Shield,
		title: "Account Verification",
		sections: [
			{
				title: "Why verify your account?",
				content: "Verification benefits:\n\n• Higher transaction limits\n• Access to advanced features\n• Enhanced account security\n• Faster withdrawal processing\n• Priority customer support\n• Compliance with regulatory requirements",
			},
			{
				title: "Required documents",
				content: "To complete verification, you'll need:\n\n• Government-issued ID (Passport, Driver's License, or National ID)\n• Proof of address (Utility bill, bank statement - less than 3 months old)\n• Selfie with your ID document\n• Clear, unedited photos\n• Documents in color\n• All corners of documents visible",
			},
			{
				title: "Verification process",
				content: "Steps to verify:\n\n1. Go to Settings → Account Management\n2. Click 'Verify Now' button\n3. Choose your document type\n4. Upload front and back of your ID\n5. Take a selfie holding your ID\n6. Upload proof of address\n7. Submit for review\n\nReview typically takes 24-48 hours. You'll receive an email notification once completed.",
			},
		],
	},
	"failed-transaction": {
		icon: XCircle,
		title: "Failed Transaction",
		sections: [
			{
				title: "Common reasons for failure",
				content: "Transactions may fail due to:\n\n• Insufficient balance in your wallet\n• Network congestion or high gas fees\n• Incorrect wallet address\n• Daily or monthly limit exceeded\n• Blocked or flagged transaction\n• Technical issues with blockchain network\n• Smart contract errors",
			},
			{
				title: "Was I charged?",
				content: "Transaction fees:\n\n• If transaction failed, you typically won't be charged\n• Some blockchain networks charge gas fees even for failed transactions\n• Check your transaction history for any deductions\n• If funds were deducted incorrectly, contact support immediately\n• Provide transaction ID and screenshots for investigation",
			},
			{
				title: "How to resolve",
				content: "Resolution steps:\n\n1. Check your wallet balance\n2. Verify the recipient address is correct\n3. Ensure you're within your transaction limits\n4. Try again during off-peak hours for lower fees\n5. Contact support if issue persists\n6. Have your transaction ID ready for faster assistance",
			},
		],
	},
	"fees-exchange-rates": {
		icon: Scale,
		title: "Fees & Exchange Rates",
		sections: [
			{
				title: "Fee structure",
				content: "Our transparent fees:\n\n• Trading fee: 0.1% - 0.5% depending on volume\n• Deposit fee: Free for crypto, varies for fiat\n• Withdrawal fee: Network fees apply\n• P2P transfer: 0.5%\n• Conversion fee: 0.3%\n\nHigh-volume traders enjoy discounted rates. Check your account tier for details.",
			},
			{
				title: "Exchange rates",
				content: "How rates are determined:\n\n• Real-time market rates from multiple exchanges\n• Rates update every 60 seconds\n• No hidden markups on exchange rates\n• Rate locks in when you confirm transaction\n• View current rates on the Trade page\n• Historical rates available in transaction details",
			},
			{
				title: "Network fees",
				content: "Understanding blockchain fees:\n\n• Gas fees vary by network congestion\n• Ethereum: $5-$50 depending on activity\n• BSC: $0.10-$1\n• Tron: $0.01-$0.50\n• Solana: $0.00025-$0.01\n\nChoose faster blockchains for lower fees. Network fees are paid to miners, not Clusteer.",
			},
		],
	},
	"fraud-suspicious-activity": {
		icon: AlertCircle,
		title: "Fraud & Suspicious Activity",
		sections: [
			{
				title: "Recognize fraud attempts",
				content: "Common scam types:\n\n• Phishing emails pretending to be Clusteer\n• Fake customer support asking for passwords\n• Too-good-to-be-true investment schemes\n• Requests to send crypto to unlock funds\n• Impersonators on social media\n• Fake websites with similar domains",
			},
			{
				title: "Protect your account",
				content: "Security best practices:\n\n• Enable 2FA (Google Authenticator)\n• Never share your password or 2FA codes\n• Use a strong, unique password\n• Verify URLs before entering credentials\n• Don't click suspicious email links\n• Official domain: clusteer.com\n• We'll never ask for your password",
			},
			{
				title: "Report suspicious activity",
				content: "If you notice anything suspicious:\n\n1. Immediately change your password\n2. Enable 2FA if not already active\n3. Check your recent transactions\n4. Contact support immediately\n5. Provide details: emails, screenshots, transaction IDs\n6. Do not send any funds if requested\n\nOur security team will investigate within 1 hour for urgent cases.",
			},
		],
	},
	"fast-secure-withdrawal": {
		icon: DollarSign,
		title: "Fast, Secure Withdrawal",
		sections: [
			{
				title: "Withdrawal process",
				content: "How to withdraw:\n\n1. Go to your Assets page\n2. Select the currency to withdraw\n3. Click 'Send' or 'Withdraw'\n4. Enter recipient address (carefully!)\n5. Enter amount and review fees\n6. Confirm with 2FA code\n7. Transaction is processed\n\nDouble-check addresses before confirming - crypto transactions cannot be reversed!",
			},
			{
				title: "Processing times",
				content: "Expected withdrawal times:\n\n• Crypto to external wallet: 10-60 minutes\n• Bank transfer (NGN): 1-3 business days\n• P2P to Clusteer user: Instant\n• International wire: 3-5 business days\n\nDelays may occur during:\n• High network congestion\n• Security reviews for large amounts\n• Bank holidays\n• Additional verification requirements",
			},
			{
				title: "Withdrawal limits",
				content: "Current limits:\n\n• Unverified accounts: ₦50,000/day\n• Verified accounts: ₦500,000/day\n• VIP accounts: ₦5,000,000/day\n\nTo increase limits:\n• Complete account verification\n• Build transaction history\n• Apply for VIP status\n• Contact support for custom limits",
			},
		],
	},
};

export default function HelpTopicPage() {
	const params = useParams();
	const router = useRouter();
	const topic = params.topic as string;
	const content = HELP_CONTENT[topic];
	const [showContactModal, setShowContactModal] = useState(false);

	if (!content) {
		return (
			<div className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8 max-w-[820px]">
				<Button
					onClick={() => router.push("/support")}
					variant="ghost"
					className="mb-6"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Support
				</Button>
				<div className="bg-white border border-[#E9EAEB] rounded-xl p-8 text-center">
					<p className="text-[#667085]">Help topic not found</p>
				</div>
			</div>
		);
	}

	const Icon = content.icon;

	return (
		<div className="pb-[100px] lg:pb-[91px] pt-1.5 lg:pt-8 max-w-[820px]">
			<Button
				onClick={() => router.push("/support")}
				variant="ghost"
				className="mb-6"
			>
				<ArrowLeft className="w-4 h-4 mr-2" />
				Back to Support
			</Button>

			<div className="bg-white border border-[#E9EAEB] rounded-xl p-8">
				<div className="flex items-center gap-4 mb-6">
					<div className="p-3 bg-[#E7F6EC] rounded-lg">
						<Icon className="w-8 h-8 text-[#0D4222]" />
					</div>
					<h1 className="text-2xl font-semibold text-[#0D0D0D]">{content.title}</h1>
				</div>

				<div className="space-y-8">
					{content.sections.map((section, index) => (
						<div key={index}>
							<h2 className="text-lg font-semibold text-[#0D0D0D] mb-3">
								{section.title}
							</h2>
							<div className="text-[#667085] whitespace-pre-line leading-relaxed">
								{section.content}
							</div>
						</div>
					))}
				</div>

				<div className="mt-8 pt-8 border-t border-[#E9EAEB]">
					<p className="text-sm text-[#667085] mb-4">Still need help?</p>
					<div className="flex gap-3">
						<Link href="/support#create-ticket">
							<Button
								className="gradient-border bg-[#11C211] border-[#0a0d120d] text-white h-10 px-6 rounded-full font-semibold"
							>
								Create a ticket
							</Button>
						</Link>
						<Button
							onClick={() => setShowContactModal(true)}
							variant="outline"
							className="border-[#D5D7DA] h-10 px-6 rounded-full font-semibold"
						>
							Contact support
						</Button>
					</div>
				</div>
			</div>

			{/* Contact Support Modal */}
			{showContactModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl max-w-md w-full">
						<div className="p-6 border-b border-[#E9EAEB]">
							<div className="flex items-center justify-between mb-2">
								<h3 className="font-semibold text-xl text-[#0D0D0D]">Contact Support</h3>
								<button
									onClick={() => setShowContactModal(false)}
									className="text-[#667085] hover:text-[#0D0D0D]"
								>
									<XCircle className="w-6 h-6" />
								</button>
							</div>
							<p className="text-sm text-[#667085]">Choose how you'd like to get in touch with us</p>
						</div>

						<div className="p-6 space-y-3">
							{/* Live Chat Option */}
							<Link href="/support#live-chat">
								<button
									onClick={() => setShowContactModal(false)}
									className="w-full flex items-center gap-4 p-4 border border-[#E9EAEB] rounded-xl hover:bg-[#F9FAFB] transition-colors text-left"
								>
									<div className="w-12 h-12 bg-[#E7F6EC] rounded-lg flex items-center justify-center flex-shrink-0">
										<MessageCircle className="w-6 h-6 text-[#0D4222]" />
									</div>
									<div className="flex-1">
										<h4 className="font-semibold text-[#0D0D0D] mb-1">Live Chat</h4>
										<p className="text-sm text-[#667085]">Chat with our AI assistant or support team</p>
										<span className="inline-block mt-1 text-xs text-[#11C211] font-medium">● Available now</span>
									</div>
								</button>
							</Link>

							{/* Submit Ticket Option */}
							<Link href="/support#create-ticket">
								<button
									onClick={() => setShowContactModal(false)}
									className="w-full flex items-center gap-4 p-4 border border-[#E9EAEB] rounded-xl hover:bg-[#F9FAFB] transition-colors text-left"
								>
									<div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
										<Mail className="w-6 h-6 text-blue-600" />
									</div>
									<div className="flex-1">
										<h4 className="font-semibold text-[#0D0D0D] mb-1">Submit a Ticket</h4>
										<p className="text-sm text-[#667085]">Get help via support ticket (24hr response)</p>
									</div>
								</button>
							</Link>

							{/* Phone Support Option */}
							<a href="tel:8001134246">
								<button
									className="w-full flex items-center gap-4 p-4 border border-[#E9EAEB] rounded-xl hover:bg-[#F9FAFB] transition-colors text-left"
								>
									<div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
										<Phone className="w-6 h-6 text-orange-600" />
									</div>
									<div className="flex-1">
										<h4 className="font-semibold text-[#0D0D0D] mb-1">Call Us</h4>
										<p className="text-sm text-[#667085]">Speak directly with our support team</p>
										<p className="text-sm font-medium text-[#0D0D0D] mt-1">8001134246</p>
									</div>
								</button>
							</a>

							{/* Help Center Option */}
							<Link href="/support">
								<button
									onClick={() => setShowContactModal(false)}
									className="w-full flex items-center gap-4 p-4 border border-[#E9EAEB] rounded-xl hover:bg-[#F9FAFB] transition-colors text-left"
								>
									<div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
										<Headphones className="w-6 h-6 text-purple-600" />
									</div>
									<div className="flex-1">
										<h4 className="font-semibold text-[#0D0D0D] mb-1">Help Center</h4>
										<p className="text-sm text-[#667085]">Browse FAQs and help articles</p>
									</div>
								</button>
							</Link>
						</div>

						<div className="p-6 pt-4 border-t border-[#E9EAEB]">
							<div className="bg-[#F9FAFB] rounded-lg p-4">
								<p className="text-xs text-[#667085] mb-2">Support Hours</p>
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium text-[#0D0D0D]">Live Chat & Phone</span>
									<span className="text-sm text-[#11C211] font-medium">24/7 Available</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
