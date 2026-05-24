export type AssetSymbol = "BTC" | "ETH" | "USDT" | "USDC" | "SOL" | "BNB" | "MATIC" | "TRX";
export type Chain = "Bitcoin" | "Ethereum" | "Tron" | "Solana" | "BSC" | "Polygon";

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
