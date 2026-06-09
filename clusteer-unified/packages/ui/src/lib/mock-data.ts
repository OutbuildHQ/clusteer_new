import type { Asset, Order, User, KycSubmission, WalletPool, AdminTxn, AuditEntry } from "./types";

function spark(base: number, drift: number, n = 24): number[] {
	const out: number[] = [];
	let v = base;
	for (let i = 0; i < n; i++) {
		v += (Math.random() - 0.5) * drift;
		out.push(v);
	}
	return out;
}

/**
 * Clusteer is a stablecoin ↔ Naira exchange.
 * Primary: USDT (multi-chain). Secondary: USDC.
 * NGN fiat balance is the on-ramp/off-ramp currency.
 * BTC/ETH/SOL/BNB are NOT tradeable — only stablecoins.
 */
export const ASSETS: Asset[] = [
	{
		symbol: "USDT",
		name: "Tether",
		chains: ["Tron", "BSC", "Ethereum"],
		priceNgn: 1_570,
		priceUsd: 1.0,
		change24h: 0.03,
		sparkline: spark(1570, 5),
		balance: 4_820.12,
		balanceNgn: 7_567_588,
	},
	{
		symbol: "USDC",
		name: "USD Coin",
		chains: ["Ethereum", "Solana", "Polygon"],
		priceNgn: 1_568,
		priceUsd: 1.0,
		change24h: 0.01,
		sparkline: spark(1568, 4),
		balance: 1_240.5,
		balanceNgn: 1_944_624,
	},
];

/** NGN fiat balance — displayed alongside stablecoin holdings */
export const FIAT_BALANCE = {
	currency: "NGN",
	balance: 2_450_000,
	symbol: "₦",
};

const now = Date.now();
const hrs = (h: number) => new Date(now - h * 3_600_000).toISOString();

export const ORDERS: Order[] = [
	{ id: "CL-88291", kind: "buy", asset: "USDT", chain: "Tron", amount: 500, amountNgn: 785_000, rate: 1_570, status: "completed", createdAt: hrs(2) },
	{ id: "CL-88284", kind: "send", asset: "USDT", chain: "Tron", amount: 420, amountNgn: 659_400, rate: 1_570, status: "processing", createdAt: hrs(5), counterparty: "TXfM…9pA2" },
	{ id: "CL-88277", kind: "sell", asset: "USDT", chain: "BSC", amount: 1_200, amountNgn: 1_884_000, rate: 1_570, status: "completed", createdAt: hrs(26) },
	{ id: "CL-88260", kind: "swap", asset: "USDT", chain: "Tron", amount: 800, amountNgn: 1_256_000, rate: 1_570, status: "completed", createdAt: hrs(48) },
	{ id: "CL-88241", kind: "receive", asset: "USDC", chain: "Solana", amount: 250, amountNgn: 392_000, rate: 1_568, status: "completed", createdAt: hrs(72), counterparty: "0x8aC…12f3" },
	{ id: "CL-88237", kind: "buy", asset: "USDC", chain: "Ethereum", amount: 300, amountNgn: 470_400, rate: 1_568, status: "failed", createdAt: hrs(96) },
	{ id: "CL-88225", kind: "sell", asset: "USDT", chain: "Tron", amount: 2_000, amountNgn: 3_140_000, rate: 1_570, status: "completed", createdAt: hrs(120) },
	{ id: "CL-88210", kind: "send", asset: "USDT", chain: "Ethereum", amount: 1_200, amountNgn: 1_884_000, rate: 1_570, status: "pending", createdAt: hrs(2.5), counterparty: "0x32b…aC11" },
];

export const USERS: User[] = [
	{ id: "u_001", name: "Aisha Bello", email: "aisha@example.ng", phone: "+234 802 3311 445", kycTier: 2, kycStatus: "approved", createdAt: hrs(720), country: "Nigeria", status: "active", totalDepositsNgn: 48_200_000, totalVolume30dNgn: 12_400_000 },
	{ id: "u_002", name: "Chinedu Okeke", email: "chinedu@example.ng", phone: "+234 803 1112 234", kycTier: 1, kycStatus: "approved", createdAt: hrs(960), country: "Nigeria", status: "active", totalDepositsNgn: 9_800_000, totalVolume30dNgn: 3_200_000 },
	{ id: "u_003", name: "Fatima Yusuf", email: "fatima@example.ng", phone: "+234 805 9993 112", kycTier: 0, kycStatus: "pending", createdAt: hrs(12), country: "Nigeria", status: "active", totalDepositsNgn: 0, totalVolume30dNgn: 0 },
	{ id: "u_004", name: "Emeka Nwachukwu", email: "emeka@example.ng", phone: "+234 806 2211 881", kycTier: 3, kycStatus: "approved", createdAt: hrs(2500), country: "Nigeria", status: "active", totalDepositsNgn: 212_000_000, totalVolume30dNgn: 78_300_000 },
	{ id: "u_005", name: "Ngozi Adaeze", email: "ngozi@example.ng", phone: "+234 812 7711 223", kycTier: 2, kycStatus: "approved", createdAt: hrs(1800), country: "Nigeria", status: "suspended", totalDepositsNgn: 22_400_000, totalVolume30dNgn: 0 },
	{ id: "u_006", name: "Tunde Bakare", email: "tunde@example.ng", phone: "+234 809 1234 567", kycTier: 1, kycStatus: "rejected", createdAt: hrs(480), country: "Nigeria", status: "active", totalDepositsNgn: 1_200_000, totalVolume30dNgn: 400_000 },
];

export const KYC_QUEUE: KycSubmission[] = [
	{ id: "k_301", userId: "u_003", userName: "Fatima Yusuf", userEmail: "fatima@example.ng", tier: 1, submittedAt: hrs(1.5), status: "pending", bvn: "22192847311", documents: [{ type: "Selfie", url: "#" }] },
	{ id: "k_302", userId: "u_007", userName: "Kola Adebayo", userEmail: "kola@example.ng", tier: 2, submittedAt: hrs(4), status: "pending", nin: "49218374625", documents: [{ type: "ID Front", url: "#" }, { type: "ID Back", url: "#" }, { type: "Selfie", url: "#" }] },
	{ id: "k_303", userId: "u_008", userName: "Blessing Udo", userEmail: "blessing@example.ng", tier: 2, submittedAt: hrs(7), status: "pending", nin: "71820394826", documents: [{ type: "ID Front", url: "#" }, { type: "Selfie", url: "#" }] },
	{ id: "k_304", userId: "u_009", userName: "Segun Ajayi", userEmail: "segun@example.ng", tier: 3, submittedAt: hrs(10), status: "pending", documents: [{ type: "Proof of Address", url: "#" }, { type: "Source of Funds", url: "#" }] },
];

export const WALLETS: WalletPool[] = [
	{ id: "w_hot_usdt_tron", type: "hot", chain: "Tron", asset: "USDT", balance: 128_400, balanceUsd: 128_400, threshold: { min: 50_000, max: 250_000 }, address: "TXfM9pA2kL8c6D4wQ3rX5zYH8m2bN9J1fA" },
	{ id: "w_hot_usdt_bsc", type: "hot", chain: "BSC", asset: "USDT", balance: 84_200, balanceUsd: 84_200, threshold: { min: 30_000, max: 150_000 }, address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" },
	{ id: "w_warm_usdt_eth", type: "warm", chain: "Ethereum", asset: "USDT", balance: 312_000, balanceUsd: 312_000, address: "0x8aC7230489e80000f9a3FBB0a6ad5DD4FBe12f3a" },
	{ id: "w_cold_usdt", type: "cold", chain: "Tron", asset: "USDT", balance: 2_400_000, balanceUsd: 2_400_000, address: "TN3W4H6rK6tpVEiszFhAbraMcfk2nLoaUR" },
	{ id: "w_ms_usdc", type: "multi-sig", chain: "Ethereum", asset: "USDC", balance: 2_100_000, balanceUsd: 2_100_000, address: "0x8aC7230489e80000f9a3FBB0a6ad5DD4FBe12f3a", signers: 5, required: 3 },
];

export const ADMIN_TXNS: AdminTxn[] = [
	{ id: "tx_9001", userId: "u_001", userName: "Aisha Bello", kind: "deposit", asset: "USDT", chain: "Tron", amount: 5_000, amountNgn: 7_850_000, status: "completed", createdAt: hrs(1) },
	{ id: "tx_9002", userId: "u_004", userName: "Emeka Nwachukwu", kind: "withdrawal", asset: "USDT", chain: "Tron", amount: 12_000, amountNgn: 18_840_000, status: "pending", createdAt: hrs(0.3), flagged: true, reason: "Amount > ₦10M single transaction" },
	{ id: "tx_9003", userId: "u_002", userName: "Chinedu Okeke", kind: "buy", asset: "USDT", chain: "BSC", amount: 1_000, amountNgn: 1_570_000, status: "completed", createdAt: hrs(2) },
	{ id: "tx_9004", userId: "u_005", userName: "Ngozi Adaeze", kind: "withdrawal", asset: "USDC", chain: "Ethereum", amount: 2_500, amountNgn: 3_920_000, status: "failed", createdAt: hrs(3), flagged: true, reason: "Account suspended" },
	{ id: "tx_9005", userId: "u_001", userName: "Aisha Bello", kind: "sell", asset: "USDT", chain: "Tron", amount: 3_000, amountNgn: 4_710_000, status: "completed", createdAt: hrs(4.5) },
	{ id: "tx_9006", userId: "u_006", userName: "Tunde Bakare", kind: "swap", asset: "USDC", chain: "Solana", amount: 200, amountNgn: 313_600, status: "processing", createdAt: hrs(5) },
];

export const AUDIT: AuditEntry[] = [
	{ id: "a_1", actor: "ops.kemi@clusteer.io", actorRole: "ops", action: "KYC Tier 2 approved", target: "u_001 Aisha Bello", ip: "41.58.22.101", timestamp: hrs(1), severity: "info" },
	{ id: "a_2", actor: "admin.dayo@clusteer.io", actorRole: "admin", action: "Withdrawal flagged for review", target: "tx_9002", ip: "41.58.22.15", timestamp: hrs(0.3), severity: "warn" },
	{ id: "a_3", actor: "system", actorRole: "system", action: "Hot wallet rebalance triggered", target: "w_hot_usdt_tron", ip: "internal", timestamp: hrs(2), severity: "info" },
	{ id: "a_4", actor: "admin.dayo@clusteer.io", actorRole: "admin", action: "User suspended", target: "u_005 Ngozi Adaeze", ip: "41.58.22.15", timestamp: hrs(3), severity: "critical" },
	{ id: "a_5", actor: "ops.kemi@clusteer.io", actorRole: "ops", action: "Support ticket resolved", target: "T-0442", ip: "41.58.22.101", timestamp: hrs(6), severity: "info" },
];

export const CURRENT_USER = {
	id: "u_001",
	name: "Aisha Bello",
	firstName: "Aisha",
	email: "aisha@example.ng",
	phone: "+234 802 3311 445",
	avatarUrl: "",
	kycTier: 2 as const,
	kycStatus: "approved" as const,
	twoFactorEnabled: true,
};

// Price history for charts (USDT/NGN rate over time)
export function generateCandles(n = 80, base = 1_570, volatility = 15) {
	const out: { time: string; open: number; high: number; low: number; close: number }[] = [];
	let o = base;
	const today = new Date();
	for (let i = n; i >= 0; i--) {
		const date = new Date(today.getTime() - i * 86400000);
		const c = o + (Math.random() - 0.5) * volatility;
		const h = Math.max(o, c) + Math.random() * volatility * 0.4;
		const l = Math.min(o, c) - Math.random() * volatility * 0.4;
		out.push({
			time: date.toISOString().slice(0, 10),
			open: Math.round(o),
			high: Math.round(h),
			low: Math.round(l),
			close: Math.round(c),
		});
		o = c;
	}
	return out;
}

export function generateAreaSeries(n = 30, base = 1_570) {
	const out: { t: string; v: number }[] = [];
	let v = base;
	for (let i = n; i >= 0; i--) {
		v += (Math.random() - 0.5) * (base * 0.005);
		const d = new Date(Date.now() - i * 86400000);
		out.push({ t: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }), v: Math.round(v) });
	}
	return out;
}
