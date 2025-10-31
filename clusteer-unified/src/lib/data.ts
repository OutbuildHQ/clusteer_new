import { ICurrency } from "@/types";

export const CURRENCIES: ICurrency[] = [
	{ currency: "USDT", icon: "/assets/images/usdt.svg", rate: 3.33 },
	{ currency: "USDC", icon: "/assets/images/usdc.svg", rate: 2 },
	{ currency: "naira", icon: "/assets/images/naira.svg", rate: 1.0 },
];

export const NETWORKS = [
	{ name: "tron", label: "Tron (TRC20)", symbol: "TRX" },
	{ name: "bsc", label: "BNB Smart Chain (BEP20)", symbol: "BSC" },
	{ name: "ethereum", label: "Ethereum (ERC20)", symbol: "ETH" },
	{ name: "solana", label: "Solana (SPL)", symbol: "SOL" },
];

export const REASONS_TO_LOVE_CLUSTEER = [
	{
		title: "Seamless USDT to Naira Exchange",
		content:
			"Instantly convert between USDT and Naira with no hidden fees and competitive rates.",
		image: "/assets/icons/data_transfer.svg",
	},
	{
		title: "Peer-to-Peer Trading",
		content:
			"Trade directly with others, setting your own terms with escrow protection for safety.",
		image: "/assets/icons/people.svg",
	},
	{
		title: "Advanced Security Protocols",
		content:
			"Your assets and data are protected with encryption and multi-factor authentication.",
		image: "/assets/icons/shield.svg",
	},
	{
		title: "Fast and Easy Transactions",
		content:
			"Quick, smooth trades across desktop and mobile with an intuitive interface.",
		image: "/assets/icons/speed.svg",
	},
	{
		title: "Secure Escrow Service",
		content:
			"Funds are securely held in escrow until both parties complete the transaction.",
		image: "/assets/icons/secure.svg",
	},
	{
		title: "Low Fees & Transparent Pricing",
		content:
			"Enjoy low transaction fees with clear, transparent pricing and no hidden costs.",
		image: "/assets/icons/low_fees.svg",
	},
];

export const FAQs = [
	{
		question: "How long does it take for my transaction to complete?",
		answer:
			"Transaction time depends on the blockchain network you choose (typically 1-15 minutes for confirmation). Once your crypto is confirmed on the network, Naira is sent directly to your bank account within 5 minutes.",
	},
	{
		question: "What happens if my transfer fails?",
		answer:
			"If your transfer fails, your funds are automatically refunded to your wallet within 24 hours. Our support team will also reach out to help resolve the issue and ensure you can complete your transaction successfully.",
	},
	{
		question: "What is your refund policy?",
		answer:
			"We offer full refunds if there's an error on our end or if the transaction cannot be completed. Refunds are processed within 24-48 hours back to your original wallet address. For P2P trades, funds held in escrow are returned if the trade is cancelled.",
	},
	{
		question: "Any dispute resolution policy in place?",
		answer:
			"Yes, we have a dedicated dispute resolution team. For P2P trades, funds are held securely in escrow while our team investigates. We typically resolve disputes within 24-48 hours, ensuring fair outcomes for all parties based on transaction evidence.",
	},
	{
		question: "How is your rate calculated?",
		answer:
			"Our rates are calculated in real-time based on current market conditions, liquidity, and competitive analysis of other Nigerian exchanges. We update rates every few minutes to ensure you always get fair, transparent pricing with no hidden markups.",
	},
	{
		question: "How do I change my account email?",
		answer:
			"To change your email, log into your dashboard, go to Settings > Security > Change Email. You'll need to verify both your old and new email addresses. For security, you may be required to complete 2FA verification before the change takes effect.",
	},
];

export const REVIEWS = [
	{
		name: "Adebowale T.",
		position: "Crypto Trader, ZeonPay",
		content:
			"Clusteer has made it insanely easy to off-ramp our USDT earnings in seconds. The interface is clean, and the rates are always fair.",
		image: "/assets/images/dummy_2.png",
		rating: 5,
	},
	{
		name: "Jessica Ibe",
		position: "Finance Lead, NairaTrust",
		content:
			"No hidden fees, no delays — Clusteer is our go-to for transparent USDT-to-naira exchanges. We've never looked back.",
		image: "/assets/images/dummy_4.png",
		rating: 5,
	},
	{
		name: "Ishaya Bello",
		position: "Web3 Freelancer, BFX Wallet",
		content:
			"As someone who deals with stablecoins daily, I can say Clusteer is one of the fastest and most reliable platforms I've used.",
		image: "/assets/images/dummy_1.png",
		rating: 5,
	},
	{
		name: "Florence Obasi",
		position: "Product Manager, VaultBridge",
		content:
			"The escrow flow is smooth, the rates update in real time, and the payouts hit my bank instantly. What else can I ask for?",
		image: "/assets/images/dummy_3.png",
		rating: 5,
	},
	{
		name: "Owen Afolabi",
		position: "Developer, ByteStack",
		content:
			"Clusteer handles the complexity behind the scenes. I just plug in my wallet and get naira straight to my bank.",
		image: "/assets/images/dummy_1.png",
		rating: 4,
	},
	{
		name: "Stefan Seyi",
		position: "UI Designer, SatoshiBase",
		content:
			"My team uses Clusteer every day for USDT conversions. We love the transparency, speed, and top-tier support.",
		image: "/assets/images/dummy_4.png",
		rating: 5,
	},
	{
		name: "Kosi Nwachukwu",
		position: "DAO Contributor, Novus DAO",
		content:
			"We tried a few others before Clusteer, but none gave us this level of peace of mind. It just works.",
		image: "/assets/images/dummy_3.png",
		rating: 5,
	},
	{
		name: "Harriet Raji",
		position: "Crypto Enthusiast, PayMint",
		content:
			"Fast cashouts, simple interface, and strong security. Clusteer delivers on everything it promises.",
		image: "/assets/images/dummy_2.png",
		rating: 5,
	},
	{
		name: "Jason Aghedo",
		position: "Frontend Developer, CredFlow",
		content:
			"Clusteer helped us simplify crypto payouts to our vendors. It's reliable, instant, and finally feels built for Nigerians like us.",
		image: "/assets/images/dummy_1.png",
		rating: 5,
	},
];
