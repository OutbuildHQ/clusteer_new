"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Shield, XCircle, Scale, AlertCircle, DollarSign, Wallet, ArrowLeftRight, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

const HELP_CONTENT: Record<string, { icon: typeof Clock; title: string; sections: { title: string; content: string }[] }> = {
	"deposits-withdrawals": {
		icon: Wallet,
		title: "Deposits & Withdrawals",
		sections: [
			{ title: "How do stablecoin deposits work?", content: "To deposit USDT or USDC:\n\n1. Go to Assets → select the stablecoin\n2. Click Receive and choose your preferred chain (Tron, Ethereum, BSC, etc.)\n3. Copy the deposit address or scan the QR code\n4. Send stablecoins from your external wallet to that address\n\nFunds arrive after network confirmation — typically 1-5 minutes on Tron, 2-10 minutes on others." },
			{ title: "How do Naira deposits work?", content: "To fund your account with Naira:\n\n1. Go to Trade → Buy\n2. Enter the amount in NGN\n3. You'll receive a bank transfer instruction with a unique reference\n4. Send the exact amount from your linked bank account\n5. Funds are credited once confirmed — usually within minutes\n\nAlways use the exact reference and amount shown. Partial payments may be delayed." },
			{ title: "How do withdrawals work?", content: "Stablecoin withdrawals:\n• Go to Assets → select coin → Send\n• Enter the recipient address and choose chain\n• Review fee and confirm with 2FA\n• Processing: 5-30 minutes\n\nNaira withdrawals:\n• Sell stablecoins for NGN\n• Funds auto-withdraw to your linked bank account\n• Processing: within 15 minutes on business days" },
			{ title: "My deposit hasn't arrived", content: "If your deposit is delayed:\n\n1. Check the TX hash on a block explorer to confirm it was sent\n2. Verify you sent to the correct chain (e.g., USDT on Tron, not Ethereum)\n3. Wait for the required network confirmations\n4. If over 30 minutes and confirmed on-chain, contact support with the TX hash\n\nWrong-chain deposits may not be recoverable. Always double-check the network." },
		],
	},
	"buying-selling": {
		icon: ArrowLeftRight,
		title: "Buying & Selling",
		sections: [
			{ title: "How to buy USDT with Naira", content: "1. Go to the Trade page\n2. Select 'Buy' tab\n3. Enter the amount in NGN you want to spend\n4. Choose USDT or USDC\n5. Review the exchange rate and fee (0.75%)\n6. Click 'Buy' and confirm\n7. Make payment via bank transfer\n8. USDT arrives in your wallet once payment confirms" },
			{ title: "How to sell USDT for Naira", content: "1. Go to the Trade page\n2. Select 'Sell' tab\n3. Enter the amount of USDT to sell\n4. Review the NGN you'll receive and the fee\n5. Confirm the order\n6. Naira is sent to your linked bank account within 15 minutes" },
			{ title: "Exchange rates & fees", content: "Clusteer charges a flat 0.75% fee on all buy and sell orders.\n\n• The rate you see is the rate you get — no hidden spread\n• Rates refresh every 10 seconds\n• Rate is locked when you confirm the order\n• Internal transfers (Clusteer to Clusteer) are free\n• External withdrawals incur only the network fee" },
			{ title: "Why was my order cancelled?", content: "Orders may be cancelled if:\n\n• Payment wasn't received within the time limit\n• The amount sent didn't match the order amount\n• Your account was flagged for verification\n• You exceeded your daily/monthly limits\n\nIf you believe this was an error, contact support with your order ID." },
		],
	},
	"security-2fa": {
		icon: Shield,
		title: "Security & 2FA",
		sections: [
			{ title: "Setting up 2FA", content: "Two-factor authentication adds an extra layer of protection:\n\n1. Go to Settings → Security\n2. Click 'Enable 2FA'\n3. Download Google Authenticator or Authy\n4. Scan the QR code shown\n5. Enter the 6-digit code to verify\n6. Save your backup codes somewhere safe\n\n2FA is required for withdrawals and sensitive account changes." },
			{ title: "I lost my 2FA device", content: "If you can't access your authenticator app:\n\n1. Use one of your saved backup codes to log in\n2. Go to Settings → Security → Reset 2FA\n3. Set up 2FA again with your new device\n\nIf you don't have backup codes, contact support with your ID for manual verification. This process takes 24-48 hours for security." },
			{ title: "Protecting your account", content: "Best practices:\n\n• Use a unique, strong password (12+ characters)\n• Enable 2FA immediately after signup\n• Never share your password or 2FA codes with anyone\n• Clusteer will never ask for your password via email or chat\n• Check the URL is clusteer.com before entering credentials\n• Review your login history regularly in Settings\n• Enable email notifications for sign-in alerts" },
		],
	},
	"kyc-verification": {
		icon: BookOpen,
		title: "KYC Verification",
		sections: [
			{ title: "Verification tiers", content: "Clusteer has three KYC tiers:\n\nTier 1 — BVN only:\n• Daily limit: ₦500,000\n• Monthly limit: ₦2,000,000\n• Verify in under 2 minutes\n\nTier 2 — BVN + NIN + ID:\n• Daily limit: ₦5,000,000\n• Monthly limit: ₦20,000,000\n• Upload government ID + selfie\n\nTier 3 — Enhanced:\n• Daily limit: ₦50,000,000+\n• Proof of address + source of funds\n• For high-volume traders and businesses" },
			{ title: "How to verify", content: "1. Go to Identity Verification page\n2. Enter your BVN (11 digits) for Tier 1\n3. For Tier 2: provide NIN and upload a government-issued ID (front + back) and a selfie\n4. For Tier 3: upload proof of address and source of funds documentation\n\nMost Tier 1 approvals are instant. Tier 2 typically completes within 5 minutes. Tier 3 may take 1-2 business days." },
			{ title: "My verification was rejected", content: "Common reasons for rejection:\n\n• Blurry or unclear document photos\n• Document is expired\n• Name on document doesn't match account name\n• BVN or NIN doesn't match your details\n• Selfie doesn't match the ID photo\n\nYou can resubmit after correcting the issue. If you believe the rejection was wrong, contact support." },
		],
	},
};

export default function HelpTopicPage({ params }: { params: Promise<{ topic: string }> }) {
	const { topic } = use(params);
	const router = useRouter();
	const content = HELP_CONTENT[topic];

	if (!content) {
		return (
			<div className="max-w-3xl mx-auto space-y-6">
				<button
					onClick={() => router.push("/support")}
					style={{
						background: "transparent",
						border: "none",
						padding: "8px 12px",
						cursor: "pointer",
						display: "inline-flex",
						alignItems: "center",
						gap: "8px",
						fontSize: "14px",
						color: "var(--c-fg, inherit)",
					}}
				>
					<ArrowLeft className="size-4" /> Back to Support
				</button>
				<div className="ds-card" style={{ borderRadius: "var(--c-radius, 12px)", border: "1px solid var(--c-border, #e5e5e5)", background: "var(--c-surface, #fff)" }}>
					<div style={{ padding: "48px", textAlign: "center" }}>
						<p className="text-muted-foreground">Help topic not found.</p>
						<Link
							href="/support"
							style={{
								display: "inline-block",
								marginTop: "16px",
								background: "var(--c-accent, #9FE870)",
								color: "#fff",
								border: "none",
								height: "36px",
								lineHeight: "36px",
								padding: "0 16px",
								borderRadius: "8px",
								fontWeight: 600,
								fontSize: "14px",
								textDecoration: "none",
							}}
						>
							Browse all topics
						</Link>
					</div>
				</div>
			</div>
		);
	}

	const Icon = content.icon;

	return (
		<div className="max-w-3xl mx-auto space-y-6">
			<button
				onClick={() => router.push("/support")}
				style={{
					background: "transparent",
					border: "none",
					padding: "8px 12px",
					cursor: "pointer",
					display: "inline-flex",
					alignItems: "center",
					gap: "8px",
					fontSize: "14px",
					color: "var(--c-fg, inherit)",
				}}
			>
				<ArrowLeft className="size-4" /> Back to Support
			</button>

			<div className="ds-card" style={{ borderRadius: "var(--c-radius, 12px)", border: "1px solid var(--c-border, #e5e5e5)", background: "var(--c-surface, #fff)" }}>
				<div style={{ padding: "24px 32px" }}>
					<div className="flex items-center gap-4 mb-8">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
							<Icon className="size-6" />
						</div>
						<h1 className="font-display text-2xl font-bold tracking-tight">{content.title}</h1>
					</div>

					<div className="space-y-8">
						{content.sections.map((section, i) => (
							<div key={i}>
								<h2 className="text-lg font-semibold mb-3">{section.title}</h2>
								<div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
									{section.content}
								</div>
							</div>
						))}
					</div>

					<div className="mt-10 pt-6 border-t border-border">
						<p className="text-sm text-muted-foreground mb-4">Didn&apos;t find what you need?</p>
						<div className="flex flex-col sm:flex-row gap-3">
							<Link
								href="/support"
								style={{
									display: "inline-flex",
									alignItems: "center",
									justifyContent: "center",
									background: "var(--c-accent, #9FE870)",
									color: "#fff",
									border: "none",
									height: "40px",
									padding: "0 16px",
									borderRadius: "8px",
									fontWeight: 600,
									fontSize: "14px",
									textDecoration: "none",
								}}
							>
								Create a ticket
							</Link>
							<Link
								href="/support"
								style={{
									display: "inline-flex",
									alignItems: "center",
									justifyContent: "center",
									background: "transparent",
									color: "var(--c-fg, inherit)",
									border: "1px solid var(--c-border, #e5e5e5)",
									height: "40px",
									padding: "0 16px",
									borderRadius: "8px",
									fontWeight: 500,
									fontSize: "14px",
									textDecoration: "none",
								}}
							>
								Back to Help Center
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Related topics */}
			<div>
				<h3 className="font-semibold mb-3">Related topics</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					{Object.entries(HELP_CONTENT)
						.filter(([slug]) => slug !== topic)
						.slice(0, 2)
						.map(([slug, t]) => (
							<Link key={slug} href={`/support/help/${slug}`} style={{ textDecoration: "none" }}>
								<div
									className="ds-card group"
									style={{
										borderRadius: "var(--c-radius, 12px)",
										border: "1px solid var(--c-border, #e5e5e5)",
										background: "var(--c-surface, #fff)",
										padding: "16px",
										display: "flex",
										alignItems: "center",
										gap: "12px",
										cursor: "pointer",
										transition: "border-color 0.2s",
									}}
								>
									<div className="rounded-lg bg-primary/10 p-2 text-primary"><t.icon className="size-4" /></div>
									<div className="flex-1 min-w-0">
										<p className="font-medium text-sm">{t.title}</p>
										<p className="text-xs text-muted-foreground">{t.sections.length} articles</p>
									</div>
									<ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
}
