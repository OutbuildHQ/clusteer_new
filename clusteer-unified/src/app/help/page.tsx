"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "@/components/brand/logo";
import { Footer } from "@/components/app/footer";
import {
	ArrowLeft,
	ArrowRight,
	ChevronDown,
	Search,
	UserPlus,
	ArrowLeftRight,
	Send,
	Shield,
	Landmark,
	AlertCircle,
	Mail,
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
				className="flex w-full items-center justify-between gap-3 py-4 sm:py-5 text-left font-display font-bold text-[15px] sm:text-base md:text-lg hover:text-brand-700 transition-colors min-h-[44px]"
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
/*  Topic data                                                          */
/* ------------------------------------------------------------------ */

const TOPICS = [
	{
		id: "getting-started",
		icon: UserPlus,
		title: "Getting started",
		description: "Create your account, verify your identity, and make your first trade.",
		faqs: [
			{ q: "How do I create a Clusteer account?", a: "Download the app or visit clusteer.com/signup. Enter your email, create a password, and verify your phone number. The whole process takes about 2 minutes." },
			{ q: "What is BVN verification and why do I need it?", a: "BVN (Bank Verification Number) is a unique 11-digit number linked to your identity across all Nigerian banks. We require it to comply with CBN regulations and to protect your account from fraud. Verification is instant once you enter a valid BVN." },
			{ q: "How do I make my first trade?", a: "After BVN verification, go to the Trade page, select Buy or Sell, enter the amount in USDT/USDC or NGN, review the rate, and confirm. For selling stablecoins, send them to the wallet address provided. For buying, make a bank transfer to our account. Payouts are typically completed in under 5 minutes." },
			{ q: "What are the KYC tiers?", a: "Tier 1 requires only BVN verification (2-minute process) and allows basic trading. Tier 2 adds NIN, a government-issued ID, and a selfie for higher limits. Tier 3 includes proof of address and source of funds documentation for high-volume traders." },
		],
	},
	{
		id: "buying-selling",
		icon: ArrowLeftRight,
		title: "Buying & Selling",
		description: "How trades work, rates, fees, and supported stablecoins.",
		faqs: [
			{ q: "How do I buy USDT or USDC?", a: "Go to Trade, select Buy, choose USDT or USDC, enter the amount, and confirm. You will receive a bank account to transfer Naira to. Once we confirm your deposit (usually within minutes), the stablecoins are sent to your wallet address." },
			{ q: "How do I sell stablecoins for Naira?", a: "Go to Trade, select Sell, enter the amount, and confirm the rate. You will receive a blockchain wallet address to send your stablecoins to. Once we detect the transaction on-chain (1-2 confirmations), Naira is sent to your linked bank account. Average payout time is 4 minutes 12 seconds." },
			{ q: "What are the fees?", a: "We charge a flat 0.75% fee on all buy and sell orders. There is no hidden spread -- the rate you see on screen is exactly the rate you get. Internal Clusteer-to-Clusteer transfers are completely free." },
			{ q: "What determines the exchange rate?", a: "Our rates are determined by real-time market conditions across multiple liquidity sources. We aggregate rates from OTC desks, exchanges, and peer networks to offer the most competitive rate. Rates refresh every 30 seconds." },
		],
	},
	{
		id: "sending-receiving",
		icon: Send,
		title: "Sending & Receiving",
		description: "Internal transfers, external deposits, and supported blockchains.",
		faqs: [
			{ q: "How do I send crypto to another Clusteer user?", a: "Go to Send, enter the recipient's Clusteer username or email, enter the amount, and confirm. Internal transfers are instant and free -- no blockchain fees, no waiting for confirmations." },
			{ q: "Which blockchains do you support?", a: "We support USDT and USDC on Tron (TRC-20), BNB Smart Chain (BEP-20), Ethereum (ERC-20), Solana (SPL), and Polygon. When you generate a deposit address, we auto-detect which chain you send from." },
			{ q: "How do I deposit stablecoins from an external wallet?", a: "Go to Receive, select the stablecoin and preferred blockchain, and copy the deposit address or scan the QR code. Send your stablecoins to that address. We watch the mempool in real time and credit your account after the required confirmations (usually 1-2 blocks)." },
			{ q: "Are there minimum or maximum deposit amounts?", a: "The minimum deposit is 5 USDT/USDC. There is no maximum for Tier 2 and Tier 3 verified users. Tier 1 users have a daily deposit limit of $500 equivalent." },
		],
	},
	{
		id: "account-security",
		icon: Shield,
		title: "Account & Security",
		description: "Two-factor authentication, password resets, and account protection.",
		faqs: [
			{ q: "How do I enable two-factor authentication (2FA)?", a: "Go to Settings, then Security. Tap Enable 2FA, scan the QR code with an authenticator app like Google Authenticator or Authy, and enter the 6-digit code to confirm. We strongly recommend enabling 2FA for all accounts." },
			{ q: "How do I reset my password?", a: "On the login page, tap Forgot Password. Enter your registered email address and we will send a password reset link. The link expires after 30 minutes for security. If you have 2FA enabled, you will also need your authenticator code." },
			{ q: "How do I change my email address?", a: "Go to Settings, then Account. Tap Change Email, enter your new email, and verify it via the confirmation link sent to the new address. You will also need to confirm the change from your old email for security." },
			{ q: "What should I do if I suspect unauthorized access?", a: "Immediately change your password and enable 2FA if you haven't already. Go to Settings, then Security, and tap Sign Out All Devices to revoke all active sessions. Contact support@clusteer.com with details, and we will investigate and secure your account." },
		],
	},
	{
		id: "payments-banks",
		icon: Landmark,
		title: "Payments & Banks",
		description: "Adding bank accounts, Naira deposits, and withdrawals.",
		faqs: [
			{ q: "How do I add a bank account?", a: "Go to Settings, then Bank Accounts, and tap Add Account. Enter your bank name, account number, and the account name. We verify the details via NIBSS to ensure the account belongs to you. You can add multiple bank accounts and set a default." },
			{ q: "How long do Naira withdrawals take?", a: "Naira payouts are sent via NIP instant transfer. The average payout time is 4 minutes 12 seconds. In rare cases during bank maintenance windows, it may take up to 30 minutes. You will receive a notification as soon as the funds land." },
			{ q: "Which banks are supported?", a: "We support all Nigerian banks connected to the NIBSS instant payment network. This includes GTBank, Access Bank, Zenith, UBA, First Bank, Kuda, OPay, PalmPay, Stanbic IBTC, Wema, Fidelity, Sterling, and many more." },
			{ q: "Can I use a debit card to buy stablecoins?", a: "Not at this time. Clusteer only supports bank transfers for Naira deposits. This keeps fees lower and processing faster. We may add card payments in the future." },
		],
	},
	{
		id: "troubleshooting",
		icon: AlertCircle,
		title: "Troubleshooting",
		description: "Failed transactions, pending orders, and contacting support.",
		faqs: [
			{ q: "My transaction is stuck on pending -- what should I do?", a: "Most pending transactions resolve within 15 minutes. If your transaction has been pending for more than 30 minutes, check the Transaction History page for status updates. If it still shows pending, contact support@clusteer.com with your transaction reference number (starts with CL-)." },
			{ q: "I sent stablecoins but my account wasn't credited.", a: "First, verify the transaction was confirmed on the blockchain using a block explorer (e.g., Tronscan for TRC-20). If confirmed, check that you sent to the correct address and the correct chain. If everything checks out, contact support with the blockchain transaction hash and we will investigate." },
			{ q: "My bank payout failed. What happens to my money?", a: "If a Naira payout fails (usually due to an incorrect account number or bank maintenance), the equivalent stablecoin amount is automatically credited back to your Clusteer wallet within 10 minutes. You can retry the payout or update your bank details." },
			{ q: "How do I contact support?", a: "Email us at support@clusteer.com -- we typically respond within 2 hours during business hours (9am-9pm WAT). You can also reach us via the in-app chat on the Support page. For urgent account security issues, include 'URGENT' in the subject line." },
		],
	},
];

/* ------------------------------------------------------------------ */
/*  PAGE                                                                */
/* ------------------------------------------------------------------ */

export default function HelpCenter() {
	return (
		<div className="min-h-screen bg-background">
			{/* ─── Top bar ─── */}
			<nav className="sticky top-0 z-50 border-b border-custom-black/6 bg-background/85 backdrop-blur-xl">
				<div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-8">
					<Link href="/" className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
						<ArrowLeft className="size-4" />
						<Logo />
					</Link>
					<div className="flex items-center gap-3">
						<Button variant="ghost" asChild size="sm" className="hidden sm:inline-flex font-semibold">
							<Link href="/login">Sign in</Link>
						</Button>
						<Button asChild size="sm" className="btn-shine shadow-brutal-sm">
							<Link href="/signup">Get started <ArrowRight className="size-4" /></Link>
						</Button>
					</div>
				</div>
			</nav>

			{/* ─── Hero ─── */}
			<section className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 max-w-[1280px] mx-auto text-center">
				<div className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-brand-800 mb-3 sm:mb-4">
					◆ HELP CENTER
				</div>
				<h1 className="font-display text-[clamp(32px,7vw,72px)] sm:text-[clamp(40px,5.5vw,72px)] font-bold leading-[0.95] tracking-[-0.03em]">
					How can we help?
				</h1>
				<p className="mt-4 sm:mt-5 text-[15px] sm:text-[17px] text-muted-foreground max-w-[520px] mx-auto leading-[1.5]">
					Find answers to common questions about trading stablecoins, managing your account, and getting paid in Naira.
				</p>

				{/* Search (decorative) */}
				<div className="mt-6 sm:mt-10 max-w-[560px] mx-auto">
					<div className="flex items-center gap-3 border-2 border-custom-black rounded-full px-5 py-3 sm:py-3.5 bg-white shadow-brutal-sm">
						<Search className="size-5 text-muted-foreground shrink-0" />
						<input
							type="text"
							placeholder="Search for help articles..."
							className="flex-1 bg-transparent text-sm sm:text-[15px] outline-none placeholder:text-muted-foreground/60"
							disabled
						/>
					</div>
					<p className="mt-2 text-xs text-muted-foreground">Search coming soon. Browse topics below.</p>
				</div>
			</section>

			{/* ─── Topic cards grid ─── */}
			<section className="pb-12 sm:pb-20 px-4 sm:px-8 max-w-[1280px] mx-auto">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
					{TOPICS.map((topic) => (
						<a
							key={topic.id}
							href={`#${topic.id}`}
							className="bg-background border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-5 sm:p-8 flex flex-col gap-3 sm:gap-4 hover:bg-warm-beige transition-colors group"
						>
							<div className="size-12 rounded-2xl bg-light-green border-[1.5px] border-custom-black inline-flex items-center justify-center">
								<topic.icon className="size-5" strokeWidth={2.4} />
							</div>
							<div className="font-display text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.02em] group-hover:text-brand-700 transition-colors">
								{topic.title}
							</div>
							<p className="text-sm sm:text-[15px] leading-relaxed text-muted-foreground">
								{topic.description}
							</p>
						</a>
					))}
				</div>
			</section>

			{/* ─── Topic sections with FAQ accordions ─── */}
			{TOPICS.map((topic) => (
				<section
					key={topic.id}
					id={topic.id}
					className="py-12 sm:py-16 px-4 sm:px-8 max-w-[800px] mx-auto scroll-mt-20"
				>
					<div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
						<div className="size-12 rounded-2xl bg-light-green border-[1.5px] border-custom-black inline-flex items-center justify-center shrink-0">
							<topic.icon className="size-5" strokeWidth={2.4} />
						</div>
						<div>
							<div className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-brand-800">
								◆ {topic.title.toUpperCase()}
							</div>
							<h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-[-0.03em]">
								{topic.title}
							</h2>
						</div>
					</div>
					<div className="bg-background border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-4 sm:p-6 lg:p-8">
						{topic.faqs.map((item) => (
							<FAQ key={item.q} q={item.q} a={item.a} />
						))}
					</div>
				</section>
			))}

			{/* ─── Contact CTA ─── */}
			<section className="py-8 sm:py-10 px-4 sm:px-8 max-w-[800px] mx-auto">
				<div className="bg-warm-beige border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-6 sm:p-10 lg:p-12 text-center">
					<div className="size-14 rounded-2xl bg-light-green border-[1.5px] border-custom-black inline-flex items-center justify-center mx-auto mb-4">
						<Mail className="size-6" strokeWidth={2.4} />
					</div>
					<h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-[-0.03em] mb-3">
						Still need help?
					</h2>
					<p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed max-w-[420px] mx-auto mb-6">
						Our support team typically responds within 2 hours during business hours (9am - 9pm WAT, Monday to Saturday).
					</p>
					<Button size="lg" asChild className="btn-shine shadow-brutal-sm">
						<a href="mailto:support@clusteer.com">
							Email support@clusteer.com <ArrowRight className="size-4" />
						</a>
					</Button>
				</div>
			</section>

			{/* ─── Footer ─── */}
			<Footer />
		</div>
	);
}
