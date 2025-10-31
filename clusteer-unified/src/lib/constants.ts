import { WalletCurrency } from "@/store/wallet";

export const DASHBOARD_LINK = "/login";

export const MINIMUM_VALUE = 0; // No minimum for NGN
export const MAXIMUM_VALUE = 100_000_000; // 100M NGN (~$63,500)

// For crypto (USDT/USDC) in sell form
export const MINIMUM_CRYPTO_VALUE = 0; // No minimum for crypto
export const MAXIMUM_CRYPTO_VALUE = 100_000; // 100k USDT

export const STABLE_COIN_RATES = {
	USDT: 1500,
	SOL: 1600,
	BTC: 2000,
} as const;

export const MAX_IMAGE_SIZE = 7 * 1024 * 1024; // 7MB

export const ALLOWED_IMAGE_FILES = [
	"image/png",
	"image/jpeg",
	"image/jpg",
	"image/svg+xml",
	"image/gif",
];

export const PAGE_SIZE = 10;

export const BVN_REGEX = /^\d{11}$/;

export const ALL_SAME_DIGIT_REGEX = /^(\d)\1{10}$/;

export const WALLET_CURRENCY_ICONS: Record<WalletCurrency, string> = {
	NGN: "/assets/images/naira.svg",
	USDT: "/assets/images/usdt.svg",
	USDC: "/assets/images/usdc.svg",
};

export const TRANSACTION_STATUS_FILTERS = [
	"ALL",
	"SUCCESS",
	"FAILED",
	"PENDING",
] as const;

export const ORDER_STATUS_FILTERS = [
	"ALL",
	"CREATED",
	"TREATING",
	"CANCELLED",
	"SETTLED",
	"FAILED",
] as const;
