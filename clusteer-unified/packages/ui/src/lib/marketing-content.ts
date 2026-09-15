/** Public launch-stage content. Exact prices and availability are deliberately quote-dependent. */
export const publicProduct = {
	access:
		"Clusteer is preparing for public launch. Join the waitlist to hear when access opens. Invited customers can sign in.",
	purpose:
		"Buy stablecoins to your own wallet, or sell them for naira in your Nigerian bank account.",
	fees: "Review the exchange rate, service fee and final amount in your quote before continuing. Network charges may also apply.",
	custody:
		"Clusteer is a conversion service, not a wallet for storing a balance. Buy orders are intended for delivery to your external wallet; sell orders pay out to your selected bank account. Settlement partners process the transfers along the way.",
	networks:
		"Clusteer supports USDT and USDC. Conversion networks include Tron (TRC-20), BNB Smart Chain (BEP-20) and Ethereum (ERC-20); choose from the routes available for your selected stablecoin. Match the network in your wallet to the one selected for your order.",
	timing:
		"For a sell, your transfer needs network confirmation before the bank payout can proceed. For a buy, payment confirmation comes before delivery to your wallet. Timing varies with the network, payment checks and bank availability. Follow each step in your order, and contact support with its reference if a transfer needs attention.",
};
export const helpTopics = [
	{
		id: "getting-started",
		title: "Getting started",
		description: "Access, verification and your first conversion.",
		faqs: [
			{ q: "Can I use Clusteer today?", a: publicProduct.access },
			{ q: "What does Clusteer do?", a: publicProduct.purpose },
			{
				q: "Will I need to verify my identity?",
				a: "Invited customers should complete the verification steps shown in their account before placing an order. Requirements and limits depend on the account and transaction.",
			},
		],
	},
	{
		id: "buying-selling",
		title: "Buying & selling",
		description: "Quotes, costs and where your money goes.",
		faqs: [
			{
				q: "How does buying work?",
				a: "Choose Buy, review an available asset and network, and enter your external wallet destination. Review the quote, then follow the payment instructions for that order. The order tracks payment and delivery.",
			},
			{
				q: "How does selling work?",
				a: "Choose Sell and your bank destination, then review the quote. Follow the order’s transfer instructions using the exact asset, amount and network shown. Track the transfer and bank payout in your order.",
			},
			{ q: "What will a conversion cost?", a: publicProduct.fees },
			{ q: "How long will my conversion take?", a: publicProduct.timing },
			{
				q: "What are the minimum and maximum amounts?",
				a: "Use the limits shown for your account and selected conversion. Limits depend on your verification level and selected route.",
			},
		],
	},
	{
		id: "wallets-networks",
		title: "Wallets & networks",
		description: "Destinations, supported routes and transfer details.",
		faqs: [
			{ q: "Can I hold a balance in Clusteer?", a: publicProduct.custody },
			{ q: "Which assets and networks can I use?", a: publicProduct.networks },
			{
				q: "Can I reuse an earlier deposit address?",
				a: "Always follow the instructions on the current order. Do not assume an address, payment account or reference from an earlier conversion is valid for a new one.",
			},
			{
				q: "What should I check before sending?",
				a: "Check the asset, network, destination and amount against the current order.",
			},
		],
	},
	{
		id: "account-security",
		title: "Account & support",
		description: "Account access and help with an existing order.",
		faqs: [
			{
				q: "I forgot my password. What should I do?",
				a: "Choose Forgot password on the sign-in page and follow the reset instructions. If you cannot access your registered email, contact support@clusteer.com for help. Never share your password, one-time codes or wallet recovery phrase.",
			},
			{
				q: "How do I get help with an order?",
				a: "Email support@clusteer.com with your order reference and a description of the problem. For an on-chain transfer, include the transaction hash. Do not include passwords, one-time codes or recovery phrases.",
			},
			{
				q: "My payout or transfer is still pending. What next?",
				a: "Check the latest order status and the original transfer details. If the status is unavailable or you need help, contact support with your order reference. Avoid sending a second payment while the first is being checked.",
			},
			{
				q: "What if I suspect someone has accessed my account?",
				a: "Use the password-reset flow and contact support@clusteer.com. Describe what happened without sending passwords or verification codes.",
			},
		],
	},
];
export const homeFaqs = [
	helpTopics[0].faqs[0],
	helpTopics[1].faqs[2],
	helpTopics[0].faqs[2],
	helpTopics[2].faqs[1],
	helpTopics[1].faqs[3],
];
