"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
	ArrowRight,
	ChevronDown,
	Search,
	UserPlus,
	ArrowLeftRight,
	Wallet,
	Shield,
	Landmark,
	AlertCircle,
	Mail,
	X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  FAQ accordion                                                       */
/* ------------------------------------------------------------------ */

function FAQ({ q, a, tag }: { q: string; a: string; tag?: string }) {
	const [open, setOpen] = useState(false);
	return (
		<div className="border-b-2 border-custom-black/10 last:border-b-0">
			<button
				onClick={() => setOpen(!open)}
				aria-expanded={open}
				className="flex w-full items-center justify-between gap-3 py-4 sm:py-5 text-left font-display font-bold text-[15px] sm:text-base md:text-lg hover:text-custom-black/70 transition-colors min-h-[44px]"
			>
				<span className="flex flex-col gap-1">
					{tag && (
						<span className="font-mono text-[10px] font-semibold uppercase tracking-[1.5px] text-custom-black/45">
							{tag}
						</span>
					)}
					{q}
				</span>
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
/*  Topic data — scoped to what Clusteer actually does (buy/sell        */
/*  stablecoins for Naira via our licensed partner; non-custodial).     */
/* ------------------------------------------------------------------ */

const TOPICS = [
	{
		id: "getting-started",
		icon: UserPlus,
		title: "Getting started",
		description: "Create your account, verify your identity, and place your first order.",
		faqs: [
			{ q: "How do I create a Clusteer account?", a: "Visit clusteer.com/signup or download the app. Enter your email, create a password, and verify your phone number. The whole process takes about 2 minutes." },
			{ q: "What is BVN verification and why do I need it?", a: "BVN (Bank Verification Number) is a unique 11-digit number linked to your identity across all Nigerian banks. We require it to comply with CBN and SEC regulations and to protect your account from fraud. Verification is instant once you enter a valid BVN." },
			{ q: "How do I place my first order?", a: "After verification, go to Trade, pick Buy or Sell, enter the amount in USDT/USDC or NGN, review the locked rate, and confirm. When buying, you transfer Naira to the account shown and your stablecoins are delivered to your wallet. When selling, you send your stablecoins to the deposit address shown and Naira lands in your bank — usually in under 5 minutes." },
			{ q: "What are the KYC tiers?", a: "Tier 1 requires only BVN verification and allows basic trading. Tier 2 adds NIN, a government ID, and a selfie for higher limits. Tier 3 adds proof of address and source-of-funds documentation for high-volume traders." },
		],
	},
	{
		id: "buying-selling",
		icon: ArrowLeftRight,
		title: "Buying & Selling",
		description: "How orders work, rates, fees, and supported stablecoins.",
		faqs: [
			{ q: "How do I buy USDT or USDC?", a: "Go to Trade, select Buy, choose USDT or USDC and the network, enter the amount, and confirm. You'll get a bank account to transfer Naira to. Once we confirm your deposit (usually within minutes), the stablecoins are settled on-chain to your own wallet address." },
			{ q: "How do I sell stablecoins for Naira?", a: "Go to Trade, select Sell, enter the amount, and confirm the rate. You'll get a one-time deposit address to send your stablecoins to. Once the transfer confirms on-chain (1-2 confirmations), Naira is sent to your linked bank account, usually within minutes." },
			{ q: "What are the fees?", a: "We charge a flat 0.75% fee on every buy and sell order. There is no hidden spread — the rate you see on screen is exactly the rate you get." },
			{ q: "What determines the exchange rate?", a: "Rates reflect real-time market conditions and refresh every 30 seconds. When you confirm an order, the rate is locked for a short window so there are no surprises between quote and settlement." },
			{ q: "Are there minimum or maximum order amounts?", a: "The minimum order is 5 USDT/USDC equivalent. Maximums depend on your KYC tier — Tier 1 has a daily cap, while Tier 2 and Tier 3 unlock progressively higher daily limits. You can see your current limits on the Settings → Limits page." },
		],
	},
	{
		id: "wallets-networks",
		icon: Wallet,
		title: "Wallets & Networks",
		description: "Where your stablecoins go, supported networks, and completing a sell.",
		faqs: [
			{ q: "Where do the stablecoins I buy go?", a: "Clusteer is non-custodial — we never hold your crypto. When you buy, your USDT or USDC is settled straight to the wallet address you provide, on-chain. You stay in control of your funds at all times." },
			{ q: "Which networks (blockchains) are supported?", a: "USDT and USDC are supported on Tron (TRC-20), BNB Smart Chain (BEP-20), and Ethereum (ERC-20). You choose the network when you place a buy or sell order — make sure your own wallet supports the same network." },
			{ q: "How do I complete a sell order?", a: "When you sell, we show you a one-time deposit address for that specific order. Send the exact stablecoin amount on the network you selected. Once it confirms on-chain (usually 1-2 blocks), your Naira payout is released to your linked bank account." },
			{ q: "Can I hold a crypto balance on Clusteer?", a: "No. Because Clusteer is non-custodial, there is no Clusteer wallet to top up or store funds in. You buy stablecoins to your own wallet, or sell them for Naira — nothing is held on our side." },
		],
	},
	{
		id: "account-security",
		icon: Shield,
		title: "Account & Security",
		description: "Password resets and account protection.",
		faqs: [
			{ q: "How do I reset my password?", a: "On the login page, tap Forgot Password, enter your registered email, and we'll send a reset link. The link expires after 30 minutes for security." },
			{ q: "How do I change my email address?", a: "Go to Settings → Account, tap Change Email, enter the new address, and verify it via the confirmation link. For security, you'll also confirm the change from your old email." },
			{ q: "What should I do if I suspect unauthorized access?", a: "Immediately change your password, then email support@clusteer.com with details — we'll investigate and secure your account. Because Clusteer is non-custodial, your stablecoins always settle to your own wallet, never a balance we control." },
		],
	},
	{
		id: "payments-banks",
		icon: Landmark,
		title: "Payments & Banks",
		description: "Adding bank accounts, Naira payouts, and supported banks.",
		faqs: [
			{ q: "How do I add a bank account?", a: "Go to Settings → Bank Accounts and tap Add Account. Enter your bank, account number, and account name — we verify the details via NIBSS to confirm the account is yours. You can add multiple accounts and set a default for payouts." },
			{ q: "How long do Naira payouts take?", a: "Payouts are sent via NIP instant transfer, usually within minutes. In rare cases during bank maintenance windows it may take up to 30 minutes. You'll get a notification as soon as the funds land." },
			{ q: "Which banks are supported?", a: "All Nigerian banks on the NIBSS instant payment network — including GTBank, Access, Zenith, UBA, First Bank, Kuda, OPay, PalmPay, Stanbic IBTC, Wema, Fidelity, Sterling, and many more." },
			{ q: "Can I use a debit card to buy stablecoins?", a: "Not at this time. Clusteer supports bank transfers for Naira, which keeps fees lower and settlement faster. We may add card payments in future." },
		],
	},
	{
		id: "troubleshooting",
		icon: AlertCircle,
		title: "Troubleshooting",
		description: "Pending orders, payout issues, and contacting support.",
		faqs: [
			{ q: "My order is stuck on pending — what should I do?", a: "Most orders resolve within 15 minutes. If yours has been pending for more than 30 minutes, check the Orders page for status. If it still shows pending, contact support@clusteer.com with your order reference (starts with CL-)." },
			{ q: "I sent stablecoins for a sell order but haven't been paid.", a: "First, confirm the transfer on the blockchain using a block explorer (e.g., Tronscan for TRC-20), and check you sent the exact amount to the correct address on the network you selected. If it's confirmed and correct, contact support with the transaction hash — we'll trace the order and release your Naira payout." },
			{ q: "My bank payout failed. What happens to my money?", a: "If a payout fails (usually an incorrect account number or a bank maintenance window), the order is held and our team retries the payout or reaches out to correct your bank details. Your funds are never lost — you'll be notified as soon as it's resolved." },
			{ q: "How do I contact support?", a: "Email support@clusteer.com — we aim to respond within 4 hours during business hours (Monday–Friday, 9am–5pm WAT). You can also reach us via in-app chat on the Support page. For urgent security issues, include 'URGENT' in the subject line." },
		],
	},
];

const ALL_FAQS = TOPICS.flatMap((t) => t.faqs.map((f) => ({ ...f, topic: t.title })));

/* ------------------------------------------------------------------ */
/*  PAGE                                                                */
/* ------------------------------------------------------------------ */

export default function HelpCenter() {
	const [query, setQuery] = useState("");
	const q = query.trim().toLowerCase();

	const results = useMemo(() => {
		if (!q) return [];
		const terms = q.split(/\s+/).filter(Boolean);
		return ALL_FAQS.filter((f) => {
			const hay = (f.q + " " + f.a + " " + f.topic).toLowerCase();
			return terms.every((t) => hay.includes(t));
		});
	}, [q]);

	return (
		<>
			{/* ─── Hero ─── */}
			<section className="py-12 sm:py-20 lg:py-28 px-4 sm:px-8 max-w-[1280px] mx-auto text-center">
				<div className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-custom-black/70 mb-3 sm:mb-4">
					◆ HELP CENTER
				</div>
				<h1 className="font-display text-[clamp(32px,7vw,72px)] sm:text-[clamp(40px,5.5vw,72px)] font-bold leading-[0.95] tracking-[-0.03em]">
					How can we help?
				</h1>
				<p className="mt-4 sm:mt-5 text-[15px] sm:text-[17px] text-muted-foreground max-w-[520px] mx-auto leading-[1.5]">
					Find answers about buying and selling stablecoins, your wallet and networks, and getting paid in Naira.
				</p>

				{/* Search */}
				<div className="mt-6 sm:mt-10 max-w-[560px] mx-auto">
					<div className="flex items-center gap-3 border-2 border-custom-black rounded-full px-5 py-3 sm:py-3.5 bg-white shadow-brutal-sm focus-within:shadow-[2px_2px_0px_0px_#21241D] transition-shadow">
						<Search className="size-5 text-muted-foreground shrink-0" />
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search for help…"
							aria-label="Search help articles"
							className="flex-1 bg-transparent text-sm sm:text-[15px] outline-none placeholder:text-muted-foreground/60"
						/>
						{query && (
							<button onClick={() => setQuery("")} aria-label="Clear search" className="shrink-0 text-muted-foreground hover:text-custom-black">
								<X className="size-4" />
							</button>
						)}
					</div>
					{q && (
						<p className="mt-2 text-xs text-muted-foreground">
							{results.length} {results.length === 1 ? "result" : "results"} for “{query.trim()}”
						</p>
					)}
				</div>
			</section>

			{/* ─── Search results ─── */}
			{q ? (
				<section className="pb-12 sm:pb-20 px-4 sm:px-8 max-w-[800px] mx-auto">
					{results.length > 0 ? (
						<div className="bg-background border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-4 sm:p-6 lg:p-8">
							{results.map((item) => (
								<FAQ key={item.q} q={item.q} a={item.a} tag={item.topic} />
							))}
						</div>
					) : (
						<div className="bg-warm-beige border-2 border-custom-black rounded-[20px] sm:rounded-3xl p-8 sm:p-12 text-center">
							<div className="size-12 rounded-2xl bg-light-green border-[1.5px] border-custom-black inline-flex items-center justify-center mx-auto mb-4">
								<Search className="size-5" strokeWidth={2.4} />
							</div>
							<h2 className="font-display text-lg sm:text-xl font-bold tracking-[-0.02em] mb-2">
								No results for “{query.trim()}”
							</h2>
							<p className="text-sm text-muted-foreground max-w-[380px] mx-auto">
								Try different keywords, or email{" "}
								<a href="mailto:support@clusteer.com" className="underline">support@clusteer.com</a> and we&apos;ll help.
							</p>
						</div>
					)}
				</section>
			) : (
				<>
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
									<div className="font-display text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.02em] group-hover:text-custom-black/70 transition-colors">
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
									<div className="font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-custom-black/70">
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
				</>
			)}

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
		</>
	);
}
