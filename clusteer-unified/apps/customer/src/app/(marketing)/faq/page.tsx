"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
	ArrowRight,
	ChevronDown,
	Globe,
	TrendingUp,
	CreditCard,
	Shield,
	User,
	HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  FAQ accordion (same pattern as landing page)                        */
/* ------------------------------------------------------------------ */

function FAQ({ q, a }: { q: string; a: string }) {
	const [open, setOpen] = useState(false);
	return (
		<div className="border-b-2 border-custom-black/10">
			<button
				onClick={() => setOpen(!open)}
				aria-expanded={open}
				className="flex w-full items-center justify-between gap-3 py-4 sm:py-5 text-left font-display font-bold text-[15px] sm:text-base md:text-lg hover:text-custom-black/70 transition-colors min-h-[44px]"
			>
				{q}
				<ChevronDown className={`size-5 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
			</button>
			<AnimatePresence initial={false}>
				{open && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="overflow-hidden"
					>
						<p className="pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  FAQ categories                                                      */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
	{
		id: "general",
		icon: Globe,
		label: "General",
		faqs: [
			{ q: "What is Clusteer?", a: "Clusteer is a stablecoin-to-Naira exchange built specifically for Nigerians. We let you buy and sell USDT and USDC directly with your Nigerian bank account. Payouts usually land within minutes, with no hidden spreads or surprise fees." },
			{ q: "What stablecoins do you support?", a: "We support USDT (Tether) and USDC (USD Coin) on five blockchains: Tron (TRC-20), BNB Smart Chain (BEP-20), Ethereum (ERC-20), Solana (SPL), and Polygon. We auto-detect the chain when you send a deposit." },
			{ q: "How is Clusteer different from other exchanges?", a: "Three things set us apart: (1) Zero spread -- the rate you see is the rate you get, with a flat 0.75% fee. (2) Speed -- payouts usually land within minutes via NIP instant transfer. (3) Simplicity -- no order books, no complicated trading interfaces. Just enter an amount, confirm, and get paid." },
			{ q: "Who can use Clusteer?", a: "Anyone with a Nigerian bank account and a valid BVN (Bank Verification Number) can use Clusteer. You must be at least 18 years old. We serve freelancers, traders, diaspora Nigerians, remote workers, and anyone who needs to convert stablecoins to and from Naira." },
			{ q: "Is Clusteer a wallet?", a: "Clusteer includes a custodial wallet for holding stablecoins on the platform, but we are primarily an exchange. You can deposit stablecoins, trade them for Naira, and withdraw to your bank. We recommend not storing large amounts long-term -- use a personal hardware or software wallet for that." },
		],
	},
	{
		id: "trading",
		icon: TrendingUp,
		label: "Trading",
		faqs: [
			{ q: "How do I buy USDT or USDC?", a: "Go to the Trade page, select Buy, choose USDT or USDC, and enter the amount you want to purchase. You will see the exact Naira cost including fees. Confirm the order and transfer the Naira amount to the provided bank account. Once we confirm your deposit, the stablecoins are credited to your Clusteer wallet." },
			{ q: "How do I sell stablecoins for Naira?", a: "Go to Trade, select Sell, enter the stablecoin amount, and confirm the rate. Send the stablecoins to the wallet address we provide. Once confirmed on the blockchain (1-2 blocks), Naira is sent to your linked bank account via NIP instant transfer." },
			{ q: "What are the fees?", a: "We charge a flat 0.75% fee on all buy and sell orders. There is no hidden spread, no withdrawal fee, and no deposit fee. Internal Clusteer-to-Clusteer transfers are completely free. The fee is clearly shown before you confirm any trade." },
			{ q: "What is the minimum trade amount?", a: "The minimum trade amount is 5 USDT (or equivalent in USDC). There is no maximum for Tier 2 and Tier 3 verified accounts. Tier 1 (BVN-only) accounts have a daily limit of $500 equivalent." },
			{ q: "How long do trades take?", a: "Sell orders (stablecoin to Naira): usually within minutes from blockchain confirmation to Naira landing in your bank — same-day at the latest. Buy orders (Naira to stablecoin): after we confirm your bank transfer, stablecoins are credited within minutes." },
		],
	},
	{
		id: "payments",
		icon: CreditCard,
		label: "Payments",
		faqs: [
			{ q: "How do I deposit Naira?", a: "When you place a buy order, we provide a dedicated bank account to transfer to. Use your banking app or USSD to send the exact amount shown. We monitor incoming transfers in real time and process your order once the funds arrive. Transfers from most banks arrive within 1-3 minutes via NIP." },
			{ q: "How long do withdrawals take?", a: "Naira withdrawals (sell payouts) are sent via NIP instant transfer and usually land within minutes. During rare bank maintenance windows (typically late at night), it can take up to 30 minutes. You receive a push notification when funds land." },
			{ q: "Which banks are supported?", a: "We support all Nigerian banks connected to the NIBSS instant payment network -- that is over 25 banks including GTBank, Access Bank, Zenith Bank, UBA, First Bank, Kuda, OPay, PalmPay, Stanbic IBTC, Wema Bank, Fidelity Bank, Sterling Bank, FCMB, Ecobank, and more." },
			{ q: "Can I use a debit card to buy stablecoins?", a: "No, not at this time. Clusteer only supports bank transfers for Naira deposits. This is intentional -- bank transfers are faster, cheaper (no card processing fees), and more reliable for the amounts our users typically trade. We may add card payments in a future update." },
		],
	},
	{
		id: "security",
		icon: Shield,
		label: "Security",
		faqs: [
			{ q: "Is my money safe on Clusteer?", a: "Yes. We use bank-grade AES-256 encryption for all data at rest and in transit. Every account is verified via BVN to prevent fraud. We support two-factor authentication (2FA) on all logins and withdrawals. Your funds are protected at every layer." },
			{ q: "What is two-factor authentication (2FA)?", a: "2FA adds a second layer of security to your account. After entering your password, you must also enter a 6-digit code from an authenticator app (like Google Authenticator or Authy). This means even if someone steals your password, they cannot access your account without your phone." },
			{ q: "What if I forget my password?", a: "Tap Forgot Password on the login page, enter your registered email, and we will send a reset link. The link expires after 30 minutes. If you have 2FA enabled, you will need your authenticator code to complete the reset. If you have lost access to both your email and authenticator, contact support with your BVN for manual verification." },
			{ q: "How is my personal data protected?", a: "We follow industry best practices: AES-256 encryption, secure key management, HTTPS everywhere, and strict access controls. Your BVN and bank details are encrypted at rest using Jasypt column-level encryption. We never share your personal data with third parties without your consent, and we comply with the Nigeria Data Protection Regulation (NDPR)." },
		],
	},
	{
		id: "account",
		icon: User,
		label: "Account",
		faqs: [
			{ q: "How do I verify my account?", a: "Verification happens in tiers. Tier 1: Enter your BVN on the Identity Verification page -- this takes about 2 minutes and unlocks basic trading. Tier 2: Upload your NIN slip, a government-issued ID (passport, driver's license, or national ID), and a live selfie. Tier 3: Provide proof of address and source of funds documentation for high-volume trading." },
			{ q: "What are the KYC tier limits?", a: "Tier 1 (BVN only): Up to $500/day, $2,000/month. Tier 2 (NIN + ID + selfie): Up to $5,000/day, $20,000/month. Tier 3 (full verification): Up to $50,000/day, $200,000/month. Limits apply to the combined value of all trades." },
			{ q: "Can I delete my account?", a: "Yes. Go to Settings, scroll to the bottom, and tap Delete Account. You will need to confirm via email and enter your password. Before deletion, you must withdraw all funds (both stablecoins and pending Naira). Account deletion is permanent and cannot be undone. We retain certain records as required by Nigerian AML/CFT regulations." },
			{ q: "How do I change my email address?", a: "Go to Settings, then Account, and tap Change Email. Enter your new email address. We will send verification links to both your old and new email addresses. You must confirm both to complete the change. If you have 2FA enabled, you will also need your authenticator code." },
		],
	},
];

/* ------------------------------------------------------------------ */
/*  PAGE                                                                */
/* ------------------------------------------------------------------ */

export default function FAQPage() {
	return (
		<>
			{/* ─── Hero ─── */}
			<section className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 max-w-[1280px] mx-auto text-center">
				<div className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-custom-black/70 mb-3 sm:mb-4">
					◆ FAQ
				</div>
				<h1 className="font-display text-[clamp(32px,7vw,72px)] sm:text-[clamp(40px,5.5vw,72px)] font-bold leading-[0.95] tracking-[-0.03em]">
					Frequently asked questions
				</h1>
				<p className="mt-4 sm:mt-5 text-[15px] sm:text-[17px] text-muted-foreground max-w-[560px] mx-auto leading-[1.5]">
					Everything you need to know about using Clusteer to trade stablecoins and get paid in Naira. Can&apos;t find your answer? <Link href="/help" className="text-custom-black/70 font-semibold hover:underline">Visit our Help Center</Link>.
				</p>
			</section>

			{/* ─── Category quick-nav ─── */}
			<section className="pb-8 sm:pb-12 px-4 sm:px-8 max-w-[800px] mx-auto">
				<div className="flex flex-wrap justify-center gap-2 sm:gap-3">
					{CATEGORIES.map((cat) => (
						<a
							key={cat.id}
							href={`#${cat.id}`}
							className="inline-flex items-center gap-2 rounded-full border-2 border-custom-black px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-semibold hover:bg-light-green transition-colors shadow-brutal-sm bg-white"
						>
							<cat.icon className="size-4" strokeWidth={2.4} />
							{cat.label}
						</a>
					))}
				</div>
			</section>

			{/* ─── FAQ sections ─── */}
			{CATEGORIES.map((category, catIdx) => (
				<section
					key={category.id}
					id={category.id}
					className={`py-12 sm:py-16 px-4 sm:px-8 scroll-mt-20 ${catIdx % 2 === 1 ? "bg-warm-beige" : ""}`}
				>
					<div className="max-w-[800px] mx-auto">
						<div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
							<div className="size-12 rounded-2xl bg-light-green border-[1.5px] border-custom-black inline-flex items-center justify-center shrink-0">
								<category.icon className="size-5" strokeWidth={2.4} />
							</div>
							<div>
								<div className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-custom-black/70">
									◆ {category.label.toUpperCase()}
								</div>
								<h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-[-0.03em]">
									{category.label}
								</h2>
							</div>
						</div>
						<div className={`border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-4 sm:p-6 lg:p-8 ${catIdx % 2 === 1 ? "bg-white" : "bg-background"}`}>
							{category.faqs.map((item) => (
								<FAQ key={item.q} q={item.q} a={item.a} />
							))}
						</div>
					</div>
				</section>
			))}

			{/* ─── CTA ─── */}
			<section className="py-8 sm:py-12 px-4 sm:px-8 max-w-[800px] mx-auto">
				<div className="bg-light-green border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-6 sm:p-10 lg:p-12 text-center relative overflow-hidden">
					{/* Decorative watermark */}
					<div className="absolute -right-4 -bottom-4 opacity-[0.08]">
						<HelpCircle className="size-[120px] sm:size-[180px]" strokeWidth={1} />
					</div>
					<div className="relative">
						<h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-[-0.03em] mb-3">
							Can&apos;t find what you&apos;re looking for?
						</h2>
						<p className="text-sm sm:text-[15px] text-custom-black/70 leading-relaxed max-w-[420px] mx-auto mb-6">
							Browse our full Help Center for detailed guides, or reach out to our support team directly.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<Button size="lg" asChild className="btn-shine bg-custom-black text-light-green hover:bg-custom-black/90 border-2 border-custom-black shadow-brutal-sm">
								<Link href="/help">
									Visit Help Center <ArrowRight className="size-4" />
								</Link>
							</Button>
							<Button size="lg" variant="outline" asChild className="border-2 border-custom-black">
								<a href="mailto:support@clusteer.com">
									Email support
								</a>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
