export type AssetSymbol = "USDT" | "USDC" | "NGN";
export type Chain = "Bitcoin" | "Ethereum" | "Tron" | "Solana" | "BSC" | "Polygon";
export type QxChannel = "TRC20" | "BEP20" | "ERC20";

export type Asset = {
	symbol: AssetSymbol;
	name: string;
	chains: Chain[];
	priceNgn: number;
	priceUsd: number;
	change24h: number;
	sparkline: number[];
	balance: number;
	balanceNgn: number;
};

// ── Quidax order model (PRD v2.0) ────────────────────────────

export type QxOrderStatus =
	| "awaiting_payment"
	| "awaiting_deposit"
	| "confirming"
	| "completed"
	| "expired"
	| "failed";

export type QxOrderSide = "buy" | "sell";

export type QxPaymentDetails = {
	bankName: string;
	accountNumber: string;
	accountName: string;
	reference: string;
	amountNgn: number;
	expiresAt: string;
};

export type QxDepositDetails = {
	address: string;
	chain: QxChannel;
	amountUsdt: number;
	qrValue: string;
	expiresAt: string;
};

export type QxOrder = {
	id: string;
	side: QxOrderSide;
	asset: "USDT";
	channel: QxChannel;
	amountUsdt: number;
	amountNgn: number;
	rate: number;
	fee: number;
	status: QxOrderStatus;
	destination?: string;
	paymentDetails?: QxPaymentDetails;
	depositDetails?: QxDepositDetails;
	createdAt: string;
	updatedAt?: string;
};

export type QxCreateOrderRequest = {
	side: QxOrderSide;
	amount: number;
	channel: QxChannel;
	destinationAddress?: string;
	bankCode?: string;
	accountNumber?: string;
};

export type QxOtpPayload = {
	orderId: string;
	otpCode: string;
};

export type QxOrderTimeline = {
	label: string;
	status: "done" | "active" | "pending";
	timestamp?: string;
}[];

export type Order = {
	id: string;
	kind: "buy" | "sell" | "swap" | "send" | "receive";
	asset: AssetSymbol;
	chain: Chain;
	amount: number;
	amountNgn: number;
	rate: number;
	status: "pending" | "processing" | "completed" | "failed" | "cancelled";
	createdAt: string;
	counterparty?: string;
	txHash?: string;
	fee?: number;
};

export type User = {
	id: string;
	name: string;
	email: string;
	phone: string;
	kycTier: 0 | 1 | 2 | 3;
	kycStatus: "unverified" | "pending" | "approved" | "rejected";
	createdAt: string;
	country: string;
	status: "active" | "suspended" | "closed";
	totalDepositsNgn: number;
	totalVolume30dNgn: number;
};

export type KycSubmission = {
	id: string;
	userId: string;
	userName: string;
	userEmail: string;
	tier: 1 | 2 | 3;
	submittedAt: string;
	status: "pending" | "approved" | "rejected";
	bvn?: string;
	nin?: string;
	documents: { type: string; url: string }[];
};

export type WalletPool = {
	id: string;
	type: "hot" | "warm" | "cold" | "multi-sig";
	chain: Chain;
	asset: AssetSymbol;
	balance: number;
	balanceUsd: number;
	threshold?: { min: number; max: number };
	address: string;
	signers?: number;
	required?: number;
};

export type AdminTxn = {
	id: string;
	userId: string;
	userName: string;
	kind: "deposit" | "withdrawal" | "buy" | "sell" | "swap" | "send" | "receive";
	asset: AssetSymbol;
	chain: Chain;
	amount: number;
	amountNgn: number;
	status: "pending" | "processing" | "completed" | "failed" | "cancelled";
	createdAt: string;
	flagged?: boolean;
	reason?: string;
};

export type AuditEntry = {
	id: string;
	actor: string;
	actorRole: "admin" | "ops" | "system";
	action: string;
	target?: string;
	ip: string;
	timestamp: string;
	severity: "info" | "warn" | "critical";
};
